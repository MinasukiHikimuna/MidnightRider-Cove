using Cove.Core.Entities;
using Cove.Core.Interfaces;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace CompleteTheCove;

public sealed class CompletionCatalog(
    DbContext db,
    IBlobService blobs,
    ILogger<CompletionCatalog> logger)
{
    public async Task<CompletionTarget?> GetTargetAsync(CompletionTargetType type, int entityId, CancellationToken ct) =>
        await db.Set<CompletionTarget>().AsNoTracking()
            .FirstOrDefaultAsync(x => x.EntityType == type && x.EntityId == entityId, ct);

    public async Task<CompletionTargetOverviewItem?> GetTargetOverviewItemAsync(
        CompletionTargetType type,
        int entityId,
        CancellationToken ct) =>
        (await GetTargetOverviewAsync(ct)).Items
            .FirstOrDefault(x => x.Type == type.ToString().ToLowerInvariant() && x.EntityId == entityId);

    public async Task<CompletionTargetOverview> GetTargetOverviewAsync(CancellationToken ct)
    {
        var targets = await db.Set<CompletionTarget>().AsNoTracking().Select(x => new
        {
            x.EntityType,
            x.EntityId,
            x.DisplayName,
            x.SelectedAt,
            x.LastRefreshAt,
            x.LastRefreshError,
            x.RemoteEndpoint,
            x.LastSuccessfulRefreshAt,
            x.EligibleSceneCount,
            x.OwnedSceneCount,
            MissingSceneCount = x.Scenes.Count(scene => !scene.Scene!.IsIgnored),
        }).ToListAsync(ct);
        var items = targets.GroupBy(x => new { x.EntityType, x.EntityId })
            .Select(group => new
            {
                group.Key.EntityType, group.Key.EntityId,
                DisplayName = group.Select(x => x.DisplayName).First(),
                SelectedAt = group.Min(x => x.SelectedAt),
                LastRefreshAt = group.Max(x => x.LastRefreshAt),
                LastRefreshError = string.Join("; ", group.Select(x => x.LastRefreshError).Where(x => !string.IsNullOrWhiteSpace(x))),
                MissingSceneCount = group.Sum(x => x.MissingSceneCount),
                Providers = group
                    .Where(x => x.LastSuccessfulRefreshAt.HasValue
                        && x.EligibleSceneCount.HasValue
                        && x.OwnedSceneCount.HasValue)
                    .OrderBy(x => x.RemoteEndpoint, StringComparer.OrdinalIgnoreCase)
                    .Select(x => new CompletionProviderProgress(
                        x.RemoteEndpoint,
                        x.LastSuccessfulRefreshAt!.Value,
                        x.LastRefreshAt,
                        x.LastRefreshError,
                        x.EligibleSceneCount!.Value,
                        x.OwnedSceneCount!.Value))
                    .ToList(),
            })
            .OrderBy(x => x.EntityType)
            .ThenBy(x => x.DisplayName, StringComparer.OrdinalIgnoreCase)
            .Select(x => new CompletionTargetOverviewItem(
                x.EntityType.ToString().ToLowerInvariant(), x.EntityId, x.DisplayName,
                x.SelectedAt, x.LastRefreshAt, x.LastRefreshError, x.MissingSceneCount, x.Providers))
            .ToList();
        return new(items, new(
            items.Count,
            items.Count(x => x.Type == "performer"),
            items.Count(x => x.Type == "studio"),
            items.Count(x => x.Type == "tag")));
    }

    public async Task<CompletionTarget> TrackAsync(CompletionTargetType type, int entityId, string endpoint, CancellationToken ct)
    {
        endpoint = NormalizeEndpoint(endpoint);
        var existing = await db.Set<CompletionTarget>()
            .FirstOrDefaultAsync(x => x.EntityType == type && x.EntityId == entityId && x.RemoteEndpoint == endpoint, ct);
        var identity = await ResolveIdentityAsync(type, entityId, endpoint, ct)
            ?? throw new InvalidOperationException("The entity has no identity for this metadata server.");
        if (existing is null)
        {
            existing = new CompletionTarget
            {
                EntityType = type,
                EntityId = entityId,
                DisplayName = identity.Name,
                RemoteEndpoint = endpoint,
                RemoteId = identity.RemoteId,
            };
            db.Add(existing);
        }
        else
        {
            existing.DisplayName = identity.Name;
            existing.RemoteEndpoint = endpoint;
            existing.RemoteId = identity.RemoteId;
        }
        await db.SaveChangesAsync(ct);
        return existing;
    }

    public async Task<IReadOnlyList<CompletionTarget>> TrackAsync(CompletionTargetType type, int entityId, IReadOnlyList<string> endpoints, CancellationToken ct)
    {
        var tracked = new List<CompletionTarget>();
        foreach (var endpoint in endpoints)
        {
            var identity = await ResolveIdentityAsync(type, entityId, endpoint, ct);
            if (identity is null) continue;
            tracked.Add(await TrackAsync(type, entityId, endpoint, ct));
        }
        if (tracked.Count == 0) throw new InvalidOperationException("Identify this entity with a supported metadata server before tracking it.");
        return tracked;
    }

    public async Task SynchronizeTargetSourcesAsync(IReadOnlyList<string> endpoints, CancellationToken ct)
    {
        var normalizedEndpoints = endpoints.Select(NormalizeEndpoint).ToHashSet(StringComparer.OrdinalIgnoreCase);
        var staleTargets = await db.Set<CompletionTarget>()
            .Where(x => !normalizedEndpoints.Contains(x.RemoteEndpoint)).ToListAsync(ct);
        if (staleTargets.Count > 0)
        {
            db.RemoveRange(staleTargets);
            await db.SaveChangesAsync(ct);
            await DeleteOrphansAsync(ct);
        }
        var selections = await db.Set<CompletionTarget>().AsNoTracking()
            .Select(x => new { x.EntityType, x.EntityId }).Distinct().ToListAsync(ct);
        foreach (var selection in selections)
        {
            foreach (var endpoint in endpoints)
            {
                if (await ResolveIdentityAsync(selection.EntityType, selection.EntityId, endpoint, ct) is null) continue;
                await TrackAsync(selection.EntityType, selection.EntityId, endpoint, ct);
            }
        }
    }

    public async Task UntrackAsync(CompletionTargetType type, int entityId, CancellationToken ct)
    {
        var targets = await db.Set<CompletionTarget>().Where(x => x.EntityType == type && x.EntityId == entityId).ToListAsync(ct);
        if (targets.Count == 0) return;
        db.RemoveRange(targets);
        await db.SaveChangesAsync(ct);
        await DeleteOrphansAsync(ct);
    }

    public async Task<bool> SetIgnoredAsync(int sceneId, bool ignored, CancellationToken ct)
    {
        var scene = await db.Set<CompletionScene>().FirstOrDefaultAsync(x => x.Id == sceneId, ct);
        if (scene is null) return false;
        scene.IsIgnored = ignored;
        await db.SaveChangesAsync(ct);
        return true;
    }

    public async Task<RefreshTotals> RefreshAsync(
        ICompletionDiscovery discovery,
        CompleteSettings settings,
        CompletionTargetType? targetType,
        int? entityId,
        Cove.Plugins.IJobProgress progress,
        CancellationToken ct)
    {
        var query = db.Set<CompletionTarget>().AsTracking();
        var endpoint = NormalizeEndpoint(discovery.Endpoint);
        query = query.Where(x => x.RemoteEndpoint == endpoint);
        if (targetType.HasValue) query = query.Where(x => x.EntityType == targetType && x.EntityId == entityId);
        var targets = await query.OrderBy(x => x.Id).ToListAsync(ct);
        var owned = (await db.Set<VideoRemoteId>().AsNoTracking()
            .Select(x => new { x.Endpoint, x.RemoteId }).ToListAsync(ct))
            .Where(x => SameProvider(x.Endpoint, discovery.Endpoint))
            .Select(x => x.RemoteId).ToHashSet(StringComparer.OrdinalIgnoreCase);
        var totals = new RefreshTotals(targets.Count, 0, 0, 0, 0);
        for (var index = 0; index < targets.Count; index++)
        {
            var target = targets[index];
            var progressStart = 0.05 + (0.95 * index / targets.Count);
            var progressMiddle = 0.05 + (0.95 * (index + 0.5) / targets.Count);
            var targetLabel = $"{target.EntityType.ToString().ToLowerInvariant()} {target.DisplayName}";
            progress.Report(progressStart, $"Discovering scenes for {targetLabel} ({index + 1}/{targets.Count})...");
            try
            {
                var discovered = await discovery.DiscoverAsync(target, ct);
                progress.Report(progressMiddle, $"Reconciling {targetLabel} ({index + 1}/{targets.Count}; {discovered.Count} scenes found)...");
                totals = await RefreshTargetAsync(target, discovery.Endpoint, discovered, settings, owned, totals, ct);
                target.LastRefreshAt = DateTime.UtcNow;
                target.LastRefreshError = null;
                target.LastSuccessfulRefreshAt = target.LastRefreshAt;
            }
            catch (OperationCanceledException) when (ct.IsCancellationRequested)
            {
                await DeleteOrphansAsync(CancellationToken.None);
                throw;
            }
            catch (Exception ex)
            {
                target.LastRefreshAt = DateTime.UtcNow;
                target.LastRefreshError = SafeError(ex);
                totals = totals with { Failed = totals.Failed + 1 };
                logger.LogWarning(ex, "Could not refresh completion target {TargetType}/{TargetId}", target.EntityType, target.EntityId);
            }
            await db.SaveChangesAsync(ct);
            progress.Report(0.05 + (0.95 * (index + 1) / targets.Count),
                $"Refreshed {index + 1}/{targets.Count}; missing {totals.Missing}; removed {totals.Removed}; failed {totals.Failed}.");
        }
        progress.Report(1, $"Targets {totals.Targets}; examined {totals.Examined}; missing {totals.Missing}; removed {totals.Removed}; failed {totals.Failed}.");
        return totals;
    }

    private async Task<RefreshTotals> RefreshTargetAsync(CompletionTarget target, string endpoint, IReadOnlyList<SourceVideo> discovered, CompleteSettings settings, HashSet<string> owned, RefreshTotals totals, CancellationToken ct)
    {
        var discoveredRemoteIds = discovered.SelectMany(scene => scene.RemoteIds)
            .Where(key => SameProvider(key.Endpoint, endpoint) && !string.IsNullOrWhiteSpace(key.RemoteId))
            .Select(key => key.RemoteId).ToHashSet(StringComparer.OrdinalIgnoreCase);
        var eligible = discovered
            .Select(scene => new
            {
                Scene = scene,
                RemoteId = scene.RemoteIds
                    .FirstOrDefault(key => SameProvider(key.Endpoint, endpoint))?.RemoteId
            })
            .Where(item => !string.IsNullOrWhiteSpace(item.RemoteId)
                && !item.Scene.Tags.Any(tag => settings.ExcludedTagNames.Contains(tag.Name)))
            .DistinctBy(item => item.RemoteId, StringComparer.OrdinalIgnoreCase)
            .ToList();
        var missing = eligible
            .Where(item => !owned.Contains(item.RemoteId!))
            .Select(item => item.Scene)
            .ToList();
        target.EligibleSceneCount = eligible.Count;
        target.OwnedSceneCount = eligible.Count(item => owned.Contains(item.RemoteId!));

        var priorLinks = await db.Set<CompletionSceneTarget>().Include(x => x.Scene).ThenInclude(scene => scene!.Tags)
            .Where(x => x.TargetId == target.Id).ToListAsync(ct);
        var keepSceneIds = new HashSet<int>();
        foreach (var source in missing)
        {
            var scene = await UpsertSceneAsync(source, endpoint, ct);
            keepSceneIds.Add(scene.Id);
            if (!priorLinks.Any(x => x.SceneId == scene.Id))
                db.Add(new CompletionSceneTarget { Scene = scene, Target = target });
        }
        var removed = priorLinks.Where(x => !keepSceneIds.Contains(x.SceneId)
            && (x.Scene?.IsIgnored != true
                || discoveredRemoteIds.Contains(x.Scene.RemoteId)
                || owned.Contains(x.Scene.RemoteId)
                || x.Scene.Tags.Any(tag => settings.ExcludedTagNames.Contains(tag.Name)))).ToList();
        db.RemoveRange(removed);
        await db.SaveChangesAsync(ct);
        await DeleteOrphansAsync(ct);
        return totals with
        {
            Examined = totals.Examined + discovered.Count,
            Missing = totals.Missing + missing.Count,
            Removed = totals.Removed + removed.Count,
        };
    }

    private async Task<CompletionScene> UpsertSceneAsync(SourceVideo source, string endpoint, CancellationToken ct)
    {
        endpoint = NormalizeEndpoint(endpoint);
        var remoteId = source.RemoteIds[0].RemoteId;
        var scene = await db.Set<CompletionScene>()
            .Include(x => x.Performers).Include(x => x.Tags).Include(x => x.Urls)
            .FirstOrDefaultAsync(x => x.RemoteEndpoint == endpoint && x.RemoteId == remoteId, ct);
        if (scene is null)
        {
            scene = new CompletionScene { RemoteEndpoint = endpoint, RemoteId = remoteId };
            db.Add(scene);
        }
        scene.Title = source.Title;
        scene.Code = source.Code;
        scene.Details = source.Details;
        scene.ReleaseDate = DateOnly.TryParse(source.Date, out var date) ? date : null;
        scene.StudioRemoteId = source.Studio?.RemoteIds.FirstOrDefault()?.RemoteId;
        scene.StudioName = source.Studio?.Name;
        scene.CoveStudioId = scene.StudioRemoteId is null ? null : (await db.Set<StudioRemoteId>().AsNoTracking()
            .Where(x => x.RemoteId == scene.StudioRemoteId).Select(x => new { x.Endpoint, x.StudioId }).ToListAsync(ct))
            .Where(x => SameProvider(x.Endpoint, endpoint)).Select(x => (int?)x.StudioId).FirstOrDefault();
        scene.ParentStudioRemoteId = source.Studio?.Parent?.RemoteIds.FirstOrDefault()?.RemoteId;
        scene.ParentStudioName = source.Studio?.Parent?.Name;
        scene.UpdatedAt = DateTime.UtcNow;
        db.RemoveRange(scene.Performers);
        db.RemoveRange(scene.Tags);
        db.RemoveRange(scene.Urls);
        var remotePerformerIds = source.Performers.Select(x => x.RemoteIds.FirstOrDefault()?.RemoteId)
            .Where(x => !string.IsNullOrWhiteSpace(x)).Cast<string>().Distinct(StringComparer.OrdinalIgnoreCase).ToList();
        var localPerformerIds = remotePerformerIds.Count == 0
            ? new Dictionary<string, int>(StringComparer.OrdinalIgnoreCase)
            : (await db.Set<PerformerRemoteId>().AsNoTracking()
                .Where(x => remotePerformerIds.Contains(x.RemoteId))
                .Select(x => new { x.Endpoint, x.RemoteId, x.PerformerId }).ToListAsync(ct))
                .Where(x => SameProvider(x.Endpoint, endpoint))
                .GroupBy(x => x.RemoteId, StringComparer.OrdinalIgnoreCase)
                .ToDictionary(x => x.Key, x => x.First().PerformerId, StringComparer.OrdinalIgnoreCase);
        int? ResolveLocalPerformerId(string remoteId) => localPerformerIds.TryGetValue(remoteId, out var performerId) ? performerId : null;
        var remoteTagIds = source.Tags.Select(x => x.RemoteIds.FirstOrDefault()?.RemoteId)
            .Where(x => !string.IsNullOrWhiteSpace(x)).Cast<string>().Distinct(StringComparer.OrdinalIgnoreCase).ToList();
        var localTagIds = remoteTagIds.Count == 0
            ? new Dictionary<string, int>(StringComparer.OrdinalIgnoreCase)
            : (await db.Set<TagRemoteId>().AsNoTracking().Where(x => remoteTagIds.Contains(x.RemoteId))
                .Select(x => new { x.Endpoint, x.RemoteId, x.TagId }).ToListAsync(ct))
                .Where(x => SameProvider(x.Endpoint, endpoint)).GroupBy(x => x.RemoteId, StringComparer.OrdinalIgnoreCase)
                .ToDictionary(x => x.Key, x => x.First().TagId, StringComparer.OrdinalIgnoreCase);
        scene.Performers = source.Performers.Select(x => new CompletionScenePerformer
        {
            RemoteId = x.RemoteIds.FirstOrDefault()?.RemoteId ?? string.Empty,
            CovePerformerId = ResolveLocalPerformerId(x.RemoteIds.FirstOrDefault()?.RemoteId ?? string.Empty),
            Name = x.Name,
            Disambiguation = x.Disambiguation,
        }).ToList();
        scene.Tags = source.Tags.Select(x => new CompletionSceneTag
        {
            RemoteId = x.RemoteIds.FirstOrDefault()?.RemoteId ?? string.Empty,
            CoveTagId = localTagIds.TryGetValue(x.RemoteIds.FirstOrDefault()?.RemoteId ?? string.Empty, out var tagId) ? tagId : null,
            Name = x.Name,
        }).ToList();
        scene.Urls = source.Urls.Where(IsSafeExternalUrl).Distinct(StringComparer.OrdinalIgnoreCase)
            .Select(x => new CompletionSceneUrl { Url = x }).ToList();
        await db.SaveChangesAsync(ct);
        await EnsureCoverAsync(scene, source.CoverUrl, endpoint, ct);
        return scene;
    }

    private async Task EnsureCoverAsync(CompletionScene scene, string? sourceUrl, string endpoint, CancellationToken ct)
    {
        if (string.IsNullOrWhiteSpace(sourceUrl)) return;
        if (scene.CoverBlobId is not null && string.Equals(scene.CoverSourceUrl, sourceUrl, StringComparison.Ordinal)) return;
        try
        {
            var host = new Uri(endpoint).Host;
            using var downloader = new CoverDownloadClient(host);
            var cover = await downloader.DownloadAsync(sourceUrl, ct);
            await using var stream = new MemoryStream(cover.Bytes, writable: false);
            var blobId = await blobs.StoreBlobAsync(stream, cover.ContentType, ct);
            var previous = scene.CoverBlobId;
            scene.CoverBlobId = blobId;
            scene.CoverSourceUrl = sourceUrl;
            scene.CoverError = null;
            await db.SaveChangesAsync(ct);
            if (!string.IsNullOrWhiteSpace(previous)) await blobs.DeleteBlobAsync(previous, ct);
        }
        catch (Exception ex) when (ex is not OperationCanceledException)
        {
            scene.CoverError = SafeError(ex);
            logger.LogWarning(ex, "Could not store a missing-scene cover");
        }
    }

    private async Task DeleteOrphansAsync(CancellationToken ct)
    {
        var orphans = await db.Set<CompletionScene>().Where(x => !x.Targets.Any()).ToListAsync(ct);
        db.RemoveRange(orphans);
        await db.SaveChangesAsync(ct);
        foreach (var blobId in orphans.Select(x => x.CoverBlobId).Where(x => !string.IsNullOrWhiteSpace(x)))
            await blobs.DeleteBlobAsync(blobId!, ct);
    }

    private async Task<TargetIdentity?> ResolveIdentityAsync(CompletionTargetType type, int id, string endpoint, CancellationToken ct)
    {
        string? name;
        IReadOnlyList<RemoteKeyValue> remoteIds;
        switch (type)
        {
            case CompletionTargetType.Performer:
                var performer = await db.Set<Performer>().AsNoTracking().Include(x => x.RemoteIds).FirstOrDefaultAsync(x => x.Id == id, ct);
                name = performer?.Name;
                remoteIds = performer?.RemoteIds.Select(x => new RemoteKeyValue(x.Endpoint, x.RemoteId)).ToList() ?? [];
                break;
            case CompletionTargetType.Studio:
                var studio = await db.Set<Studio>().AsNoTracking().Include(x => x.RemoteIds).FirstOrDefaultAsync(x => x.Id == id, ct);
                name = studio?.Name;
                remoteIds = studio?.RemoteIds.Select(x => new RemoteKeyValue(x.Endpoint, x.RemoteId)).ToList() ?? [];
                break;
            case CompletionTargetType.Tag:
                var tag = await db.Set<Tag>().AsNoTracking().Include(x => x.RemoteIds).FirstOrDefaultAsync(x => x.Id == id, ct);
                name = tag?.Name;
                remoteIds = tag?.RemoteIds.Select(x => new RemoteKeyValue(x.Endpoint, x.RemoteId)).ToList() ?? [];
                break;
            default: return null;
        }
        var remoteId = remoteIds.FirstOrDefault(x => SameProvider(x.Endpoint, endpoint))?.RemoteId;
        return string.IsNullOrWhiteSpace(name) || string.IsNullOrWhiteSpace(remoteId) ? null : new(name, remoteId);
    }

    public static bool SameProvider(string left, string right) => string.Equals(ProviderKey(left), ProviderKey(right), StringComparison.OrdinalIgnoreCase);

    public static string NormalizeEndpoint(string endpoint) => Uri.TryCreate(endpoint, UriKind.Absolute, out var uri)
        ? new UriBuilder(uri) { Scheme = uri.Scheme.ToLowerInvariant(), Host = uri.Host.ToLowerInvariant() }.Uri.AbsoluteUri.TrimEnd('/')
        : endpoint.Trim().TrimEnd('/');

    private static string ProviderKey(string endpoint)
    {
        if (!Uri.TryCreate(endpoint.Trim(), UriKind.Absolute, out var uri)) return endpoint.Trim().TrimEnd('/').ToLowerInvariant();
        var host = uri.Host.ToLowerInvariant();
        var labels = host.Split('.', StringSplitOptions.RemoveEmptyEntries);
        return labels.Length > 2 ? string.Join('.', labels[^2..]) : host;
    }

    private static bool IsSafeExternalUrl(string value) => Uri.TryCreate(value, UriKind.Absolute, out var uri) && uri.Scheme is "http" or "https";
    private static string SafeError(Exception error) => error.Message.Length <= 500 ? error.Message : error.Message[..500];
}

internal sealed record TargetIdentity(string Name, string RemoteId);
internal sealed record RemoteKeyValue(string Endpoint, string RemoteId);

public sealed record CoverDownload(byte[] Bytes, string ContentType);

public sealed class CoverDownloadClient : IDisposable
{
    public const int MaxBytes = 20 * 1024 * 1024;
    private readonly string _trustedHost;
    private readonly HttpClient _http;
    public CoverDownloadClient(string trustedHost, HttpMessageHandler? handler = null)
    {
        _trustedHost = trustedHost;
        _http = handler is null ? new(new HttpClientHandler { AllowAutoRedirect = false }) : new(handler, disposeHandler: false);
        _http.Timeout = TimeSpan.FromSeconds(30);
    }
    public async Task<CoverDownload> DownloadAsync(string url, CancellationToken ct)
    {
        var current = Validate(url);
        for (var redirects = 0; redirects <= 3; redirects++)
        {
            using var response = await _http.GetAsync(current, HttpCompletionOption.ResponseHeadersRead, ct);
            if ((int)response.StatusCode is >= 300 and < 400 && response.Headers.Location is not null)
            {
                current = Validate(new Uri(current, response.Headers.Location).ToString());
                continue;
            }
            response.EnsureSuccessStatusCode();
            var contentType = response.Content.Headers.ContentType?.MediaType?.ToLowerInvariant() ?? string.Empty;
            if (contentType is not ("image/jpeg" or "image/png" or "image/webp" or "image/gif" or "image/avif"))
                throw new InvalidOperationException("Cover response was not a supported raster image.");
            if (response.Content.Headers.ContentLength > MaxBytes) throw new InvalidOperationException("Cover exceeds the 20 MB limit.");
            await using var input = await response.Content.ReadAsStreamAsync(ct);
            using var output = new MemoryStream();
            var buffer = new byte[81920];
            int read;
            while ((read = await input.ReadAsync(buffer, ct)) > 0)
            {
                if (output.Length + read > MaxBytes) throw new InvalidOperationException("Cover exceeds the 20 MB limit.");
                await output.WriteAsync(buffer.AsMemory(0, read), ct);
            }
            return new(output.ToArray(), contentType);
        }
        throw new InvalidOperationException("Cover redirected too many times.");
    }
    private Uri Validate(string value)
    {
        if (!Uri.TryCreate(value, UriKind.Absolute, out var uri) || uri.Scheme != Uri.UriSchemeHttps || !CompletionCatalog.SameProvider(uri.ToString(), $"https://{_trustedHost}"))
            throw new InvalidOperationException("Cover URL must use HTTPS on the configured metadata provider's host.");
        return uri;
    }
    public void Dispose() => _http.Dispose();
}
