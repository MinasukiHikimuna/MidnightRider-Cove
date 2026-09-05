using Cove.Core.Entities;
using Cove.Core.Interfaces;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace CompleteTheCove;

public sealed class CompletionCatalog(
    DbContext db,
    IBlobService blobs,
    ILogger<CompletionCatalog> logger,
    Func<string, CoverDownloadClient>? coverDownloaderFactory = null)
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
            x.EligibleVideoCount,
            x.OwnedVideoCount,
            MissingVideoCount = x.Videos.Count(video => !video.Video!.IsIgnored),
        }).ToListAsync(ct);
        var items = targets.GroupBy(x => new { x.EntityType, x.EntityId })
            .Select(group => new
            {
                group.Key.EntityType, group.Key.EntityId,
                DisplayName = group.Select(x => x.DisplayName).First(),
                SelectedAt = group.Min(x => x.SelectedAt),
                LastRefreshAt = group.Max(x => x.LastRefreshAt),
                LastRefreshError = string.Join("; ", group.Select(x => x.LastRefreshError).Where(x => !string.IsNullOrWhiteSpace(x))),
                MissingVideoCount = group.Sum(x => x.MissingVideoCount),
                Providers = group
                    .Where(x => x.LastSuccessfulRefreshAt.HasValue
                        && x.EligibleVideoCount.HasValue
                        && x.OwnedVideoCount.HasValue)
                    .OrderBy(x => x.RemoteEndpoint, StringComparer.OrdinalIgnoreCase)
                    .Select(x => new CompletionProviderProgress(
                        x.RemoteEndpoint,
                        x.LastSuccessfulRefreshAt!.Value,
                        x.LastRefreshAt,
                        x.LastRefreshError,
                        x.EligibleVideoCount!.Value,
                        x.OwnedVideoCount!.Value))
                    .ToList(),
            })
            .OrderBy(x => x.EntityType)
            .ThenBy(x => x.DisplayName, StringComparer.OrdinalIgnoreCase)
            .Select(x => new CompletionTargetOverviewItem(
                x.EntityType.ToString().ToLowerInvariant(), x.EntityId, x.DisplayName,
                x.SelectedAt, x.LastRefreshAt, x.LastRefreshError, x.MissingVideoCount, x.Providers))
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

    public async Task SynchronizeTargetSourcesAsync(IReadOnlyList<string> endpoints, CancellationToken ct,
        CompletionTargetType? targetType = null, int? entityId = null)
    {
        var normalizedEndpoints = endpoints.Select(NormalizeEndpoint).ToHashSet(StringComparer.OrdinalIgnoreCase);
        var targets = db.Set<CompletionTarget>().AsQueryable();
        if (targetType.HasValue) targets = targets.Where(x => x.EntityType == targetType && x.EntityId == entityId);
        var staleTargets = await targets
            .Where(x => !normalizedEndpoints.Contains(x.RemoteEndpoint)).ToListAsync(ct);
        if (staleTargets.Count > 0)
        {
            db.RemoveRange(staleTargets);
            await db.SaveChangesAsync(ct);
            await DeleteOrphansAsync(ct);
        }
        var selections = await targets.AsNoTracking()
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
        var targetIds = targets.Select(x => x.Id).ToArray();
        db.RemoveRange(await db.Set<CompletionVideoTarget>().Where(x => targetIds.Contains(x.TargetId)).ToListAsync(ct));
        db.RemoveRange(targets);
        await db.SaveChangesAsync(ct);
        await DeleteOrphansAsync(ct);
    }

    public async Task<bool> SetIgnoredAsync(int videoId, bool ignored, CancellationToken ct)
    {
        var video = await db.Set<CompletionVideo>().FirstOrDefaultAsync(x => x.Id == videoId, ct);
        if (video is null) return false;
        video.IsIgnored = ignored;
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
        if (targets.Count == 0)
        {
            progress.Report(1, "No tracked records for this provider.");
            return new RefreshTotals(0, 0, 0, 0, 0);
        }
        var ownedEndpoints = (await db.Set<VideoRemoteId>().AsNoTracking()
            .Select(x => x.Endpoint).Distinct().ToListAsync(ct))
            .Where(value => SameProvider(value, endpoint)).ToArray();
        var owned = (await db.Set<VideoRemoteId>().AsNoTracking()
            .Where(x => ownedEndpoints.Contains(x.Endpoint)).Select(x => x.RemoteId).ToListAsync(ct))
            .ToHashSet(StringComparer.OrdinalIgnoreCase);
        var totals = new RefreshTotals(targets.Count, 0, 0, 0, 0);
        for (var index = 0; index < targets.Count; index++)
        {
            var target = targets[index];
            var progressStart = 0.05 + (0.95 * index / targets.Count);
            var progressMiddle = 0.05 + (0.95 * (index + 0.5) / targets.Count);
            var targetLabel = $"{target.EntityType.ToString().ToLowerInvariant()} {target.DisplayName}";
            progress.Report(progressStart, $"Discovering videos for {targetLabel} ({index + 1}/{targets.Count})...");
            try
            {
                var discovered = await discovery.DiscoverAsync(target, ct);
                progress.Report(progressMiddle, $"Reconciling {targetLabel} ({index + 1}/{targets.Count}; {discovered.Count} {(discovered.Count == 1 ? "video" : "videos")} found)...");
                totals = await RefreshTargetAsync(target, discovery.Endpoint, discovered, settings, owned, totals,
                    (done, count) => progress.Report(progressMiddle + (0.475 / targets.Count * done / Math.Max(1, count)),
                        $"Reconciling {targetLabel}: {done}/{count} missing videos processed..."), ct);
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

    private async Task<RefreshTotals> RefreshTargetAsync(CompletionTarget target, string endpoint, IReadOnlyList<SourceVideo> discovered, CompleteSettings settings, HashSet<string> owned, RefreshTotals totals, Action<int, int> report, CancellationToken ct)
    {
        var discoveredRemoteIds = discovered.SelectMany(video => video.RemoteIds)
            .Where(key => SameProvider(key.Endpoint, endpoint) && !string.IsNullOrWhiteSpace(key.RemoteId))
            .Select(key => key.RemoteId).ToHashSet(StringComparer.OrdinalIgnoreCase);
        var eligible = discovered
            .Select(video => new
            {
                Video = video,
                RemoteId = video.RemoteIds
                    .FirstOrDefault(key => SameProvider(key.Endpoint, endpoint))?.RemoteId
            })
            .Where(item => !string.IsNullOrWhiteSpace(item.RemoteId)
                && !item.Video.Tags.Any(tag => settings.ExcludedTagNames.Contains(tag.Name)))
            .DistinctBy(item => item.RemoteId, StringComparer.OrdinalIgnoreCase)
            .ToList();
        var missing = eligible
            .Where(item => !owned.Contains(item.RemoteId!))
            .Select(item => item.Video)
            .ToList();

        var priorLinks = await db.Set<CompletionVideoTarget>().AsNoTracking().Include(x => x.Video).ThenInclude(video => video!.Tags)
            .Where(x => x.TargetId == target.Id).ToListAsync(ct);
        endpoint = NormalizeEndpoint(endpoint);
        var keepVideoIds = new HashSet<int>();
        var priorVideoIds = priorLinks.Select(x => x.VideoId).ToHashSet();
        var coverHost = new Uri(endpoint).Host;
        using var downloader = coverDownloaderFactory?.Invoke(coverHost) ?? new CoverDownloadClient(coverHost);
        var processed = 0;
        foreach (var batch in missing.Chunk(100))
        {
            ct.ThrowIfCancellationRequested();
            var remoteIds = batch.Select(source => source.RemoteIds.First(key => SameProvider(key.Endpoint, endpoint)).RemoteId).ToArray();
            // Split collection reads avoid multiplying performers × tags × URLs.
            var existing = await db.Set<CompletionVideo>().AsSplitQuery()
                .Include(x => x.Performers).Include(x => x.Tags).Include(x => x.Urls)
                .Where(x => x.RemoteEndpoint == endpoint && remoteIds.Contains(x.RemoteId))
                .ToDictionaryAsync(x => x.RemoteId, StringComparer.OrdinalIgnoreCase, ct);
            var identities = await LoadLocalIdentitiesAsync(batch, endpoint, ct);
            var saved = new List<CompletionVideo>();
            foreach (var source in batch)
            {
                ct.ThrowIfCancellationRequested();
                var remoteId = source.RemoteIds.First(key => SameProvider(key.Endpoint, endpoint)).RemoteId;
                existing.TryGetValue(remoteId, out var video);
                video = UpsertVideo(source, endpoint, remoteId, video, identities);
                if (!priorVideoIds.Contains(video.Id))
                    db.Add(new CompletionVideoTarget { Video = video, Target = target });
                saved.Add(video);
            }
            await db.SaveChangesAsync(ct);
            // Metadata is durable before network cover work. Only new/changed
            // covers require an individual save; cached covers do no work.
            for (var index = 0; index < batch.Length; index++)
            {
                ct.ThrowIfCancellationRequested();
                await EnsureCoverAsync(saved[index], batch[index].CoverUrl, downloader, ct);
            }
            // A failed cover records an error without saving inside its catch.
            await db.SaveChangesAsync(ct);
            foreach (var video in saved) keepVideoIds.Add(video.Id);
            // Keep the EF tracker bounded over large catalogs and subsequent targets.
            DetachVideoGraphs();
            processed += batch.Length;
            report(processed, missing.Count);
        }
        var removed = priorLinks.Where(x => !keepVideoIds.Contains(x.VideoId)
            && (x.Video?.IsIgnored != true
                || discoveredRemoteIds.Contains(x.Video.RemoteId)
                || owned.Contains(x.Video.RemoteId)
                || x.Video.Tags.Any(tag => settings.ExcludedTagNames.Contains(tag.Name)))).ToList();
        var removedIds = removed.Select(x => x.VideoId).ToArray();
        db.RemoveRange(await db.Set<CompletionVideoTarget>()
            .Where(x => x.TargetId == target.Id && removedIds.Contains(x.VideoId)).ToListAsync(ct));
        await db.SaveChangesAsync(ct);
        await DeleteOrphansAsync(ct);
        target.EligibleVideoCount = eligible.Count;
        target.OwnedVideoCount = eligible.Count(item => owned.Contains(item.RemoteId!));
        return totals with
        {
            Examined = totals.Examined + discovered.Count,
            Missing = totals.Missing + missing.Count,
            Removed = totals.Removed + removed.Count,
        };
    }

    private sealed record LocalIdentities(
        Dictionary<string, int> Studios, Dictionary<string, int> Performers, Dictionary<string, int> Tags);

    private async Task<LocalIdentities> LoadLocalIdentitiesAsync(SourceVideo[] videos, string endpoint, CancellationToken ct)
    {
        var studioIds = videos.Select(x => x.Studio?.RemoteIds.FirstOrDefault()?.RemoteId).Where(x => x is not null).Distinct().ToArray();
        var performerIds = videos.SelectMany(x => x.Performers).SelectMany(x => x.RemoteIds).Select(x => x.RemoteId).Distinct().ToArray();
        var tagIds = videos.SelectMany(x => x.Tags).SelectMany(x => x.RemoteIds).Select(x => x.RemoteId).Distinct().ToArray();
        var studios = await db.Set<StudioRemoteId>().AsNoTracking().Where(x => studioIds.Contains(x.RemoteId))
            .Select(x => new { x.Endpoint, x.RemoteId, LocalId = x.StudioId }).ToListAsync(ct);
        var performers = await db.Set<PerformerRemoteId>().AsNoTracking().Where(x => performerIds.Contains(x.RemoteId))
            .Select(x => new { x.Endpoint, x.RemoteId, LocalId = x.PerformerId }).ToListAsync(ct);
        var tags = await db.Set<TagRemoteId>().AsNoTracking().Where(x => tagIds.Contains(x.RemoteId))
            .Select(x => new { x.Endpoint, x.RemoteId, LocalId = x.TagId }).ToListAsync(ct);
        return new(
            studios.Where(x => SameProvider(x.Endpoint, endpoint)).GroupBy(x => x.RemoteId, StringComparer.OrdinalIgnoreCase).ToDictionary(x => x.Key, x => x.First().LocalId, StringComparer.OrdinalIgnoreCase),
            performers.Where(x => SameProvider(x.Endpoint, endpoint)).GroupBy(x => x.RemoteId, StringComparer.OrdinalIgnoreCase).ToDictionary(x => x.Key, x => x.First().LocalId, StringComparer.OrdinalIgnoreCase),
            tags.Where(x => SameProvider(x.Endpoint, endpoint)).GroupBy(x => x.RemoteId, StringComparer.OrdinalIgnoreCase).ToDictionary(x => x.Key, x => x.First().LocalId, StringComparer.OrdinalIgnoreCase));
    }

    private CompletionVideo UpsertVideo(SourceVideo source, string endpoint, string remoteId,
        CompletionVideo? video, LocalIdentities identities)
    {
        if (video is null)
        {
            video = new CompletionVideo { RemoteEndpoint = endpoint, RemoteId = remoteId };
            db.Add(video);
        }
        var before = (video.Title, video.Code, video.Details, video.ReleaseDate, video.StudioRemoteId,
            video.StudioName, video.CoveStudioId, video.ParentStudioRemoteId, video.ParentStudioName);
        video.Title = source.Title;
        video.Code = source.Code;
        video.Details = source.Details;
        video.ReleaseDate = DateOnly.TryParse(source.Date, out var date) ? date : null;
        video.StudioRemoteId = source.Studio?.RemoteIds.FirstOrDefault()?.RemoteId;
        video.StudioName = source.Studio?.Name;
        video.CoveStudioId = video.StudioRemoteId is not null && identities.Studios.TryGetValue(video.StudioRemoteId, out var studioId) ? studioId : null;
        video.ParentStudioRemoteId = source.Studio?.Parent?.RemoteIds.FirstOrDefault()?.RemoteId;
        video.ParentStudioName = source.Studio?.Parent?.Name;
        var changed = before != (video.Title, video.Code, video.Details, video.ReleaseDate, video.StudioRemoteId,
            video.StudioName, video.CoveStudioId, video.ParentStudioRemoteId, video.ParentStudioName);
        var performers = source.Performers.Select(x => new CompletionVideoPerformer
        {
            RemoteId = x.RemoteIds.FirstOrDefault()?.RemoteId ?? string.Empty,
            CovePerformerId = identities.Performers.TryGetValue(x.RemoteIds.FirstOrDefault()?.RemoteId ?? string.Empty, out var performerId) ? performerId : null,
            Name = x.Name,
            Disambiguation = x.Disambiguation,
        }).ToList();
        var tags = source.Tags.Select(x => new CompletionVideoTag
        {
            RemoteId = x.RemoteIds.FirstOrDefault()?.RemoteId ?? string.Empty,
            CoveTagId = identities.Tags.TryGetValue(x.RemoteIds.FirstOrDefault()?.RemoteId ?? string.Empty, out var tagId) ? tagId : null,
            Name = x.Name,
        }).ToList();
        var urls = source.Urls.Where(IsSafeExternalUrl).Distinct(StringComparer.OrdinalIgnoreCase)
            .Select(x => new CompletionVideoUrl { Url = x }).ToList();
        if (!video.Performers.Select(PerformerKey).Order().SequenceEqual(performers.Select(PerformerKey).Order()))
        {
            db.RemoveRange(video.Performers);
            video.Performers = performers;
            changed = true;
        }
        if (!video.Tags.Select(TagKey).Order().SequenceEqual(tags.Select(TagKey).Order()))
        {
            db.RemoveRange(video.Tags);
            video.Tags = tags;
            changed = true;
        }
        if (!video.Urls.Select(x => x.Url).Order(StringComparer.Ordinal).SequenceEqual(urls.Select(x => x.Url).Order(StringComparer.Ordinal)))
        {
            db.RemoveRange(video.Urls);
            video.Urls = urls;
            changed = true;
        }
        if (changed) video.UpdatedAt = DateTime.UtcNow;
        return video;
    }

    private static (string, int?, string, string?) PerformerKey(CompletionVideoPerformer x) =>
        (x.RemoteId, x.CovePerformerId, x.Name, x.Disambiguation);
    private static (string, int?, string) TagKey(CompletionVideoTag x) => (x.RemoteId, x.CoveTagId, x.Name);

    private void DetachVideoGraphs()
    {
        foreach (var entry in db.ChangeTracker.Entries().Where(entry => entry.Entity is CompletionVideo
            or CompletionVideoTarget or CompletionVideoPerformer or CompletionVideoTag or CompletionVideoUrl).ToArray())
            entry.State = EntityState.Detached;
    }

    private async Task EnsureCoverAsync(CompletionVideo video, string? sourceUrl, CoverDownloadClient downloader, CancellationToken ct)
    {
        if (string.IsNullOrWhiteSpace(sourceUrl)) return;
        if (video.CoverBlobId is not null && string.Equals(video.CoverSourceUrl, sourceUrl, StringComparison.Ordinal)) return;
        try
        {
            var cover = await downloader.DownloadAsync(sourceUrl, ct);
            await using var stream = new MemoryStream(cover.Bytes, writable: false);
            var blobId = await blobs.StoreBlobAsync(stream, cover.ContentType, ct);
            var previous = video.CoverBlobId;
            video.CoverBlobId = blobId;
            video.CoverSourceUrl = sourceUrl;
            video.CoverError = null;
            video.UpdatedAt = DateTime.UtcNow;
            // Finish persisting a downloaded cover before observing cancellation
            // again, so its previous blob can be released safely.
            await db.SaveChangesAsync(CancellationToken.None);
            if (!string.IsNullOrWhiteSpace(previous)) await blobs.DeleteBlobAsync(previous, CancellationToken.None);
        }
        catch (Exception ex) when (ex is not OperationCanceledException)
        {
            video.CoverError = SafeError(ex);
            logger.LogWarning(ex, "Could not store a missing-video cover");
        }
    }

    private async Task DeleteOrphansAsync(CancellationToken ct)
    {
        var orphans = await db.Set<CompletionVideo>().Where(x => !x.Targets.Any()).ToListAsync(ct);
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
