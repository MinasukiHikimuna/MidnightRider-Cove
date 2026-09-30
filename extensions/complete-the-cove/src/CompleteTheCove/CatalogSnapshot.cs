using System.Collections.Concurrent;
using System.Diagnostics.CodeAnalysis;
using System.Globalization;
using System.Text;
using System.Text.Json;
using System.Text.Json.Serialization;
using Microsoft.EntityFrameworkCore;

namespace CompleteTheCove;

/// <summary>
/// Read-only, versioned catalog snapshot route (contract:
/// 001-download-missing/complete-the-cove-catalog-snapshot-api.md). One GET over the
/// existing catalog tables; no catalog writes, no shared types with consumers.
/// </summary>
public static class CatalogSnapshot
{
    public const int DefaultPageLimit = 250;
    public const int MaxPageLimit = 1000;
    public static readonly TimeSpan Lifetime = TimeSpan.FromMinutes(30);

    public const string ConditionCurrent = "current";
    public const string ConditionDegraded = "degraded";
    public const string ConditionFailed = "failed";
    public const string ConditionUnavailable = "unavailable";

    public static async Task<CatalogSnapshotOutcome> PageAsync(
        string? limitText, string? cursorText, DbContext db, CatalogSnapshotRegistry registry, CancellationToken ct)
    {
        int limit;
        if (string.IsNullOrWhiteSpace(limitText))
        {
            limit = DefaultPageLimit;
        }
        else if (!int.TryParse(limitText, out var parsedLimit) || parsedLimit is < 1 or > MaxPageLimit)
        {
            return CatalogSnapshotOutcome.Error(400, "validation_error", "limit must be an integer between 1 and 1000.");
        }
        else
        {
            limit = parsedLimit;
        }

        CatalogSnapshotRecord? snapshot = null;
        var ordinal = 0;
        if (string.IsNullOrWhiteSpace(cursorText))
        {
            snapshot = await CaptureAsync(db, ct);
            registry.Add(snapshot);
        }
        else
        {
            if (!CatalogSnapshotCursor.TryDecode(cursorText, out var snapshotId, out var cursorOrdinal, out var version))
                return CatalogSnapshotOutcome.Error(400, "cursor_invalid", "cursor is malformed.");
            if (version != CatalogSnapshotCursor.CurrentVersion)
                return CatalogSnapshotOutcome.Error(409, "cursor_version_unsupported", "cursor names an unsupported snapshot version; use the v1 route without a cursor.");
            if (!registry.TryGet(snapshotId, out snapshot))
                return CatalogSnapshotOutcome.Error(410, "cursor_expired", "Snapshot expired.", restart: true);
            if (cursorOrdinal >= snapshot.Items.Count)
                return CatalogSnapshotOutcome.Error(400, "cursor_invalid", "cursor is out of range for its snapshot.");
            ordinal = cursorOrdinal;
        }

        var pageLength = Math.Min(limit, snapshot.Items.Count - ordinal);
        var items = snapshot.Items.Skip(ordinal).Take(pageLength).ToList();
        return CatalogSnapshotOutcome.Ok(new CatalogSnapshotResponse(
            "v1",
            snapshot.Id.ToString("N", CultureInfo.InvariantCulture),
            snapshot.CreatedAtUtc,
            snapshot.ExpiresAtUtc,
            ordinal + pageLength < snapshot.Items.Count ? CatalogSnapshotCursor.Encode(snapshot.Id, ordinal + pageLength) : null,
            new CatalogSnapshotStatus(snapshot.Condition, snapshot.Providers),
            items));
    }

    private static async Task<CatalogSnapshotRecord> CaptureAsync(DbContext db, CancellationToken ct)
    {
        // Pin the full projection at snapshot time so concurrent refreshes or
        // writes cannot alter an in-flight consumer's pages or ordering.
        // ponytail: whole-catalog in-memory pin; move to a producer-owned table if
        // the catalog ever grows large enough to make this a problem.
        var videos = await db.Set<CompletionVideo>().AsNoTracking().AsSplitQuery()
            .Include(x => x.Targets).ThenInclude(x => x.Target)
            .Include(x => x.Performers)
            .Include(x => x.Tags)
            .Include(x => x.Urls)
            .ToListAsync(ct);
        var items = videos
            .Select(ProjectItem)
            .OrderBy(item => item.RemoteEndpoint, StringComparer.Ordinal)
            .ThenBy(item => item.RemoteId, StringComparer.Ordinal)
            .ToList();
        var providers = await LoadProvidersAsync(db, ct);
        var now = DateTime.UtcNow;
        return new CatalogSnapshotRecord(Guid.NewGuid(), now, now.Add(Lifetime), items, providers, AggregateCondition(providers));
    }

    private static CatalogSnapshotItem ProjectItem(CompletionVideo video) => new(
        video.RemoteEndpoint,
        CompletionCatalog.NormalizeEndpoint(video.RemoteEndpoint),
        video.RemoteId,
        video.Title,
        video.Code,
        video.Details,
        video.ReleaseDate,
        video.StudioRemoteId is null ? null : new CatalogSnapshotStudio(
            video.RemoteEndpoint,
            video.StudioRemoteId,
            video.StudioName,
            video.CoveStudioId,
            video.ParentStudioRemoteId is null ? null : new CatalogSnapshotStudioParent(
                video.RemoteEndpoint,
                video.ParentStudioRemoteId,
                video.ParentStudioName,
                null)),
        video.Urls.Select(url => url.Url).Distinct(StringComparer.OrdinalIgnoreCase)
            .OrderBy(url => url, StringComparer.Ordinal).ToList(),
        video.Performers
            .OrderBy(performer => performer.Name, StringComparer.Ordinal)
            .ThenBy(performer => performer.RemoteId, StringComparer.Ordinal)
            .Select(performer => new CatalogSnapshotPerformer(performer.RemoteId, performer.CovePerformerId, performer.Name, performer.Disambiguation))
            .ToList(),
        video.Tags
            .OrderBy(tag => tag.Name, StringComparer.Ordinal)
            .ThenBy(tag => tag.RemoteId, StringComparer.Ordinal)
            .Select(tag => new CatalogSnapshotTag(tag.RemoteId, tag.CoveTagId, tag.Name))
            .ToList(),
        new CatalogSnapshotCover(
            video.CoverBlobId is not null ? "available" : video.CoverError is not null ? "failed" : "unavailable",
            video.CoverSourceUrl,
            video.CoverError),
        video.IsIgnored,
        video.CreatedAt,
        video.UpdatedAt,
        video.Targets
            .Where(link => link.Target is not null)
            .Select(link => new CatalogSnapshotTarget(
                link.Target!.EntityType.ToString().ToLowerInvariant(),
                link.Target.EntityId,
                link.Target.DisplayName,
                link.Target.RemoteEndpoint,
                link.Target.RemoteId))
            .OrderBy(target => target.LocalEntityId)
            .ThenBy(target => target.RemoteEndpoint, StringComparer.Ordinal)
            .ToList());

    private static async Task<IReadOnlyList<CatalogSnapshotProvider>> LoadProvidersAsync(DbContext db, CancellationToken ct)
    {
        var rows = await db.Set<CompletionTarget>().AsNoTracking()
            .Select(row => new
            {
                row.Id,
                row.RemoteEndpoint,
                row.LastRefreshAt,
                row.LastSuccessfulRefreshAt,
                row.LastRefreshError,
                row.EligibleVideoCount,
                row.OwnedVideoCount,
            })
            .ToListAsync(ct);
        // ponytail: provider counts sum the per-target counts the refresh job stores,
        // matching /targets semantics; a video eligible under several targets counts
        // once per target. Add a dedicated count pass only if a consumer needs exacts.
        return rows
            .GroupBy(row => row.RemoteEndpoint)
            .Select(group =>
            {
                var latest = group.OrderByDescending(row => row.LastRefreshAt).ThenByDescending(row => row.Id).First();
                string condition = latest.LastRefreshAt is null
                    ? ConditionUnavailable
                    : latest.LastRefreshError is not null
                        ? (group.Any(row => row.LastSuccessfulRefreshAt.HasValue) ? ConditionDegraded : ConditionFailed)
                        : ConditionCurrent;
                var endpoint = CompletionCatalog.NormalizeEndpoint(latest.RemoteEndpoint);
                return new CatalogSnapshotProvider(
                    endpoint,
                    endpoint,
                    condition,
                    group.Max(row => row.LastRefreshAt),
                    group.Max(row => row.LastSuccessfulRefreshAt),
                    latest.LastRefreshError,
                    group.Sum(row => row.EligibleVideoCount ?? 0),
                    group.Sum(row => row.OwnedVideoCount ?? 0));
            })
            .OrderBy(provider => provider.Endpoint, StringComparer.Ordinal)
            .ToList();
    }

    private static string AggregateCondition(IReadOnlyList<CatalogSnapshotProvider> providers)
    {
        if (providers.Count == 0) return ConditionUnavailable;
        if (providers.All(provider => provider.Condition == ConditionCurrent)) return ConditionCurrent;
        if (providers.Any(provider => provider.LastSuccessfulRefreshAt.HasValue)) return ConditionDegraded;
        if (providers.Any(provider => provider.Condition == ConditionFailed)) return ConditionFailed;
        return ConditionUnavailable;
    }
}

/// <summary>Immutable leaf set plus frozen provider status for one snapshot.</summary>
public sealed record CatalogSnapshotRecord(
    Guid Id,
    DateTime CreatedAtUtc,
    DateTime ExpiresAtUtc,
    IReadOnlyList<CatalogSnapshotItem> Items,
    IReadOnlyList<CatalogSnapshotProvider> Providers,
    string Condition);

/// <summary>
/// ponytail: in-memory snapshot bookkeeping; a Cove restart invalidates every cursor
/// (consumers get 410 and restart per the contract). O(n) prune per call is fine while
/// live snapshots stay few; move to a producer-owned table if they ever grow.
/// </summary>
public sealed class CatalogSnapshotRegistry
{
    private readonly ConcurrentDictionary<Guid, CatalogSnapshotRecord> _snapshots = new();

    public void Add(CatalogSnapshotRecord snapshot)
    {
        PruneExpired();
        _snapshots[snapshot.Id] = snapshot;
    }

    public bool TryGet(Guid id, [MaybeNullWhen(false)] out CatalogSnapshotRecord snapshot)
    {
        if (_snapshots.TryGetValue(id, out var existing) && existing.ExpiresAtUtc > DateTime.UtcNow)
        {
            snapshot = existing;
            return true;
        }

        if (existing is not null) _snapshots.TryRemove(id, out _);
        snapshot = null!;
        return false;
    }

    private void PruneExpired()
    {
        var now = DateTime.UtcNow;
        foreach (var (id, snapshot) in _snapshots)
        {
            if (snapshot.ExpiresAtUtc <= now) _snapshots.TryRemove(id, out _);
        }
    }
}

public static class CatalogSnapshotCursor
{
    public const int CurrentVersion = 1;

    public static string Encode(Guid snapshotId, int ordinal)
    {
        var token = $"{CurrentVersion}|{snapshotId:N}|{ordinal.ToString(CultureInfo.InvariantCulture)}";
        return Convert.ToBase64String(Encoding.UTF8.GetBytes(token))
            .TrimEnd('=').Replace('+', '-').Replace('/', '_');
    }

    public static bool TryDecode(string token, out Guid snapshotId, out int ordinal, out int version)
    {
        snapshotId = Guid.Empty;
        ordinal = -1;
        version = -1;
        string payload;
        try
        {
            var base64 = token.Replace('-', '+').Replace('_', '/');
            payload = Encoding.UTF8.GetString(Convert.FromBase64String(
                base64.PadRight(base64.Length + (4 - base64.Length % 4) % 4, '=')));
        }
        catch (FormatException)
        {
            return false;
        }

        var parts = payload.Split('|');
        if (parts.Length != 3 || !int.TryParse(parts[0], out version) || version < 1) return false;
        if (version != CurrentVersion) return true;
        return Guid.TryParse(parts[1], out snapshotId) && int.TryParse(parts[2], out ordinal) && ordinal >= 0;
    }
}

public sealed record CatalogSnapshotOutcome(
    CatalogSnapshotResponse? Envelope,
    int Status,
    string Code,
    string Message,
    bool Restart)
{
    public static CatalogSnapshotOutcome Ok(CatalogSnapshotResponse envelope) => new(envelope, 200, "", "", false);
    public static CatalogSnapshotOutcome Error(int status, string code, string message, bool restart = false)
        => new(null, status, code, message, restart);
}

public sealed record CatalogSnapshotResponse(
    string SchemaVersion,
    string SnapshotId,
    DateTime CreatedAt,
    DateTime ExpiresAt,
    string? NextCursor,
    CatalogSnapshotStatus Status,
    IReadOnlyList<CatalogSnapshotItem> Items);

public sealed record CatalogSnapshotStatus(
    string Condition,
    IReadOnlyList<CatalogSnapshotProvider> Providers);

public sealed record CatalogSnapshotProvider(
    string Endpoint,
    string NormalizedEndpoint,
    string Condition,
    DateTime? LastAttemptedRefreshAt,
    DateTime? LastSuccessfulRefreshAt,
    string? LastRefreshError,
    int EligibleVideoCount,
    int OwnedVideoCount);

public sealed record CatalogSnapshotItem(
    string RemoteEndpoint,
    string NormalizedEndpoint,
    string RemoteId,
    string? Title,
    string? Code,
    string? Details,
    DateOnly? ReleaseDate,
    CatalogSnapshotStudio? Studio,
    IReadOnlyList<string> Urls,
    IReadOnlyList<CatalogSnapshotPerformer> Performers,
    IReadOnlyList<CatalogSnapshotTag> Tags,
    CatalogSnapshotCover Cover,
    bool Ignored,
    DateTime CreatedAt,
    DateTime UpdatedAt,
    IReadOnlyList<CatalogSnapshotTarget> Targets);

public sealed record CatalogSnapshotStudio(
    string RemoteEndpoint,
    string RemoteId,
    string? Name,
    int? LocalId,
    CatalogSnapshotStudioParent? Parent);

public sealed record CatalogSnapshotStudioParent(
    string RemoteEndpoint,
    string RemoteId,
    string? Name,
    int? LocalId);

public sealed record CatalogSnapshotPerformer(string RemoteId, int? LocalId, string Name, string? Disambiguation);
public sealed record CatalogSnapshotTag(string RemoteId, int? LocalId, string Name);
public sealed record CatalogSnapshotCover(string State, string? SourceUrl, string? Error);
public sealed record CatalogSnapshotTarget(string TargetType, int LocalEntityId, string DisplayName, string RemoteEndpoint, string RemoteId);

/// <summary>Wire options for the snapshot route: camelCase and nulls always emitted (the contract
/// requires every key). Independent of host serializer configuration.</summary>
public static class CatalogSnapshotJson
{
    public static readonly JsonSerializerOptions Options = new(JsonSerializerDefaults.Web)
    {
        DefaultIgnoreCondition = JsonIgnoreCondition.Never,
    };
}
