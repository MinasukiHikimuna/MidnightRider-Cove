using Cove.Core.Entities;
using Microsoft.EntityFrameworkCore;

namespace MergeOpportunities;

/// <summary>
/// Finds candidate duplicate performer/studio groups from core tables and records user
/// decisions. Candidate groups are recomputed on every request (no materialized state);
/// the only extension-owned table stores decisions.
///
/// Two candidate classes:
///  - remote-id: the same (normalized endpoint, remoteId) is attached to 2+ cove entities.
///    Normalization strips the query string (split_part(Endpoint,'?',1)) so e.g.
///    "https://stashdb.org?x" and "https://stashdb.org" group together.
///  - name: the same normalized name (lower, trim) on 2+ cove entities whose remote ids
///    span 2+ distinct providers (cross-provider matches only; single-provider same-name
///    noise is excluded in v1).
/// </summary>
public sealed class MergeOpportunityCatalog
{
    public const string PerformerType = "performer";
    public const string StudioType = "studio";
    public const string KindRemoteId = "remote-id";
    public const string KindName = "name";

    internal static readonly string[] ValidDecisions = { "merged", "attached", "deleted", "dismissed" };

    private readonly DbContext _db;

    public MergeOpportunityCatalog(DbContext db) => _db = db;

    // ---------- key helpers ----------

    public static string NormalizeProvider(string endpoint) => endpoint.Split('?')[0];

    public static string NormalizeName(string name) => name.Trim().ToLowerInvariant();

    public static string RemoteKey(string entityType, string provider, string remoteId) =>
        $"{entityType}|remote-id|{provider}|{remoteId}";

    public static string NameKey(string entityType, string name) =>
        $"{entityType}|name|{NormalizeName(name)}";

    /// <summary>Parse a candidate key: {entityType}|remote-id|{provider}|{remoteId}
    /// or {entityType}|name|{normalizedName}.</summary>
    public static bool TryParseKey(
        string key, out string entityType, out string kind, out string value1, out string value2)
    {
        entityType = string.Empty;
        kind = string.Empty;
        value1 = string.Empty;
        value2 = string.Empty;
        if (string.IsNullOrWhiteSpace(key)) return false;
        var parts = key.Split('|');
        if (parts.Length < 3) return false;
        entityType = parts[0];
        if (entityType is not (PerformerType or StudioType)) return false;
        if (parts[1] == "remote-id" && parts.Length >= 4)
        {
            kind = KindRemoteId;
            value1 = parts[2];
            value2 = string.Join("|", parts.Skip(3));
            return value1.Length > 0 && value2.Length > 0;
        }
        if (parts[1] == "name")
        {
            kind = KindName;
            value1 = string.Join("|", parts.Skip(2));
            return value1.Length > 0;
        }
        return false;
    }

    public static bool IsValidDecision(string decision) => ValidDecisions.Contains(decision);

    // ---------- candidate detection ----------

    public async Task<IReadOnlyList<CandidateSummary>> GetCandidatesAsync(CancellationToken ct)
    {
        var decisions = (await _db.Set<MergeOpportunityDecision>().AsNoTracking().ToListAsync(ct))
            .ToDictionary(d => d.Key);
        var performerData = await GetEntityDataAsync(PerformerType, ct);
        var studioData = await GetEntityDataAsync(StudioType, ct);

        var result = new List<CandidateSummary>();
        foreach (var g in performerData.Groups) result.Add(BuildSummary(performerData, g, decisions));
        foreach (var g in studioData.Groups) result.Add(BuildSummary(studioData, g, decisions));

        return result
            .OrderBy(s => s.EntityType)
            .ThenBy(s => s.Kind == KindRemoteId ? 0 : 1)
            .ThenByDescending(s => s.TotalVideoCount)
            .ThenBy(s => s.Label, StringComparer.OrdinalIgnoreCase)
            .ToList();
    }

    public async Task<CandidateDetail?> GetCandidateAsync(string key, CancellationToken ct)
    {
        if (!TryParseKey(key, out var entityType, out var kind, out _, out _)) return null;
        var data = await GetEntityDataAsync(entityType, ct);
        var group = data.Groups.FirstOrDefault(g => g.Key == key);
        if (group is null) return null;
        var decisions = (await _db.Set<MergeOpportunityDecision>().AsNoTracking().ToListAsync(ct))
            .ToDictionary(d => d.Key);
        var summary = BuildSummary(data, group, decisions);
        var scenes = kind == KindName
            ? await GetSharedScenesAsync(entityType, group.Members, ct)
            : Array.Empty<SharedScene>();
        return new CandidateDetail(summary, scenes);
    }

    // ---------- attach (additive) ----------

    /// <summary>Copy remote ids from source entities to the target, skipping rows the target
    /// already has (compared on normalized endpoint + remoteId). Returns null when the target
    /// or any source does not exist. Idempotent.</summary>
    public async Task<AttachResult?> AttachRemoteIdsAsync(
        string entityType, int targetId, IReadOnlyList<int> sourceIds, CancellationToken ct)
    {
        if (entityType is not (PerformerType or StudioType) || targetId <= 0) return null;
        var sources = sourceIds.Where(id => id > 0 && id != targetId).Distinct().ToList();
        if (sources.Count == 0) return null;

        if (entityType == PerformerType)
        {
            var ids = (await _db.Set<Performer>().AsNoTracking()
                .Where(p => p.Id == targetId || sources.Contains(p.Id))
                .Select(p => p.Id).ToListAsync(ct)).ToHashSet();
            if (!ids.Contains(targetId) || sources.Any(id => !ids.Contains(id))) return null;

            var existing = (await _db.Set<PerformerRemoteId>().AsNoTracking()
                .Where(r => r.PerformerId == targetId)
                .Select(r => new { r.Endpoint, r.RemoteId }).ToListAsync(ct))
                .Select(r => (NormalizeProvider(r.Endpoint), r.RemoteId)).ToHashSet();
            var incoming = await _db.Set<PerformerRemoteId>().AsNoTracking()
                .Where(r => sources.Contains(r.PerformerId))
                .Select(r => new { r.Endpoint, r.RemoteId }).ToListAsync(ct);
            var toAdd = incoming
                .Where(r => !existing.Contains((NormalizeProvider(r.Endpoint), r.RemoteId)))
                .GroupBy(r => (NormalizeProvider(r.Endpoint), r.RemoteId))
                .Select(g => g.First())
                .ToList();
            foreach (var row in toAdd)
            {
                _db.Set<PerformerRemoteId>().Add(new PerformerRemoteId
                {
                    PerformerId = targetId,
                    Endpoint = row.Endpoint,
                    RemoteId = row.RemoteId,
                });
            }
            await _db.SaveChangesAsync(ct);
            return new AttachResult(entityType, targetId, sources, toAdd.Count);
        }
        else
        {
            var ids = (await _db.Set<Studio>().AsNoTracking()
                .Where(p => p.Id == targetId || sources.Contains(p.Id))
                .Select(p => p.Id).ToListAsync(ct)).ToHashSet();
            if (!ids.Contains(targetId) || sources.Any(id => !ids.Contains(id))) return null;

            var existing = (await _db.Set<StudioRemoteId>().AsNoTracking()
                .Where(r => r.StudioId == targetId)
                .Select(r => new { r.Endpoint, r.RemoteId }).ToListAsync(ct))
                .Select(r => (NormalizeProvider(r.Endpoint), r.RemoteId)).ToHashSet();
            var incoming = await _db.Set<StudioRemoteId>().AsNoTracking()
                .Where(r => sources.Contains(r.StudioId))
                .Select(r => new { r.Endpoint, r.RemoteId }).ToListAsync(ct);
            var toAdd = incoming
                .Where(r => !existing.Contains((NormalizeProvider(r.Endpoint), r.RemoteId)))
                .GroupBy(r => (NormalizeProvider(r.Endpoint), r.RemoteId))
                .Select(g => g.First())
                .ToList();
            foreach (var row in toAdd)
            {
                _db.Set<StudioRemoteId>().Add(new StudioRemoteId
                {
                    StudioId = targetId,
                    Endpoint = row.Endpoint,
                    RemoteId = row.RemoteId,
                });
            }
            await _db.SaveChangesAsync(ct);
            return new AttachResult(entityType, targetId, sources, toAdd.Count);
        }
    }

    // ---------- decisions ----------

    public async Task<MergeOpportunityDecision> UpsertDecisionAsync(
        string key, string decision, int? targetEntityId, string? note, CancellationToken ct)
    {
        var row = await _db.Set<MergeOpportunityDecision>().FirstOrDefaultAsync(d => d.Key == key, ct);
        if (row is null)
        {
            row = new MergeOpportunityDecision { Key = key };
            _db.Set<MergeOpportunityDecision>().Add(row);
        }
        row.Decision = decision;
        row.TargetEntityId = targetEntityId;
        row.Note = note;
        row.DecidedAt = DateTime.UtcNow;
        await _db.SaveChangesAsync(ct);
        return row;
    }

    public async Task<bool> RemoveDecisionAsync(string key, CancellationToken ct)
    {
        var row = await _db.Set<MergeOpportunityDecision>().FirstOrDefaultAsync(d => d.Key == key, ct);
        if (row is null) return false;
        _db.Set<MergeOpportunityDecision>().Remove(row);
        await _db.SaveChangesAsync(ct);
        return true;
    }

    // ---------- internals ----------

    private sealed record EntityRow(int Id, string Name);
    private sealed record RemoteRow(int EntityId, string Endpoint, string RemoteId);
    private sealed record Group(string Key, string Kind, HashSet<int> Members);
    private sealed record EntityData(
        IReadOnlyDictionary<int, string> NamesById,
        IReadOnlyDictionary<int, int> VideoCounts,
        IReadOnlyDictionary<int, IReadOnlyList<RemoteIdRef>> RemotesById,
        List<Group> Groups);

    private sealed class SceneAcc
    {
        public string Title { get; set; } = string.Empty;
        public int? StudioId { get; set; }
        public readonly HashSet<int> Members = new();
        public readonly HashSet<int> Videos = new();
    }

    private async Task<EntityData> GetEntityDataAsync(string entityType, CancellationToken ct)
    {
        if (entityType == PerformerType)
        {
            var entities = (await _db.Set<Performer>().AsNoTracking()
                .Select(p => new { p.Id, p.Name }).ToListAsync(ct))
                .Select(e => new EntityRow(e.Id, e.Name)).ToList();
            var remotes = (await _db.Set<PerformerRemoteId>().AsNoTracking()
                .Select(r => new { r.PerformerId, r.Endpoint, r.RemoteId }).ToListAsync(ct))
                .Select(r => new RemoteRow(r.PerformerId, r.Endpoint, r.RemoteId)).ToList();
            var counts = (await _db.Set<VideoPerformer>().AsNoTracking()
                .Select(v => v.PerformerId)
                .GroupBy(id => id)
                .Select(g => new { Id = g.Key, Count = g.Count() })
                .ToListAsync(ct))
                .ToDictionary(x => x.Id, x => x.Count);
            return new EntityData(
                entities.ToDictionary(e => e.Id, e => e.Name),
                counts,
                RemotesById(remotes),
                BuildGroups(PerformerType, entities, remotes));
        }
        else
        {
            var entities = (await _db.Set<Studio>().AsNoTracking()
                .Select(p => new { p.Id, p.Name }).ToListAsync(ct))
                .Select(e => new EntityRow(e.Id, e.Name)).ToList();
            var remotes = (await _db.Set<StudioRemoteId>().AsNoTracking()
                .Select(r => new { r.StudioId, r.Endpoint, r.RemoteId }).ToListAsync(ct))
                .Select(r => new RemoteRow(r.StudioId, r.Endpoint, r.RemoteId)).ToList();
            var counts = (await _db.Set<Video>().AsNoTracking()
                .Where(v => v.StudioId != null)
                .Select(v => v.StudioId!.Value)
                .GroupBy(id => id)
                .Select(g => new { Id = g.Key, Count = g.Count() })
                .ToListAsync(ct))
                .ToDictionary(x => x.Id, x => x.Count);
            return new EntityData(
                entities.ToDictionary(e => e.Id, e => e.Name),
                counts,
                RemotesById(remotes),
                BuildGroups(StudioType, entities, remotes));
        }
    }

    private static IReadOnlyDictionary<int, IReadOnlyList<RemoteIdRef>> RemotesById(
        IReadOnlyList<RemoteRow> remotes) =>
        remotes
            .Where(r => r.RemoteId.Length > 0)
            .GroupBy(r => r.EntityId)
            .ToDictionary(g => g.Key, g => (IReadOnlyList<RemoteIdRef>)g
                .Select(r => new RemoteIdRef(NormalizeProvider(r.Endpoint), r.RemoteId))
                .Distinct()
                .ToList());

    private static List<Group> BuildGroups(
        string entityType, IReadOnlyList<EntityRow> entities, IReadOnlyList<RemoteRow> remotes)
    {
        var remotesByEntity = RemotesById(remotes);
        var providersByEntity = remotesByEntity
            .ToDictionary(kv => kv.Key, kv => kv.Value.Select(r => r.Provider).ToHashSet());

        var groups = new List<Group>();

        // class 1: same (normalized endpoint, remoteId) on 2+ distinct entities
        foreach (var g in remotes
            .Where(r => r.RemoteId.Length > 0)
            .GroupBy(r => (NormalizeProvider(r.Endpoint), r.RemoteId)))
        {
            var members = g.Select(r => r.EntityId).Distinct().ToHashSet();
            if (members.Count > 1)
                groups.Add(new Group(RemoteKey(entityType, g.Key.Item1, g.Key.Item2), KindRemoteId, members));
        }

        // class 2: same normalized name on 2+ distinct entities spanning 2+ providers
        foreach (var g in entities
            .Where(e => !string.IsNullOrWhiteSpace(e.Name))
            .GroupBy(e => NormalizeName(e.Name)))
        {
            var members = g.Select(e => e.Id).Distinct().ToHashSet();
            if (members.Count <= 1) continue;
            var providers = members
                .SelectMany(id => providersByEntity.GetValueOrDefault(id) ?? Enumerable.Empty<string>())
                .ToHashSet();
            if (providers.Count > 1)
                groups.Add(new Group(NameKey(entityType, g.Key), KindName, members));
        }

        return groups;
    }

    private static CandidateSummary BuildSummary(
        EntityData data, Group group, IReadOnlyDictionary<string, MergeOpportunityDecision> decisions)
    {
        var entityType = group.Key.Split('|')[0];
        var members = group.Members
            .Select(id => new CandidateMember(
                id,
                data.NamesById.GetValueOrDefault(id) ?? string.Empty,
                data.VideoCounts.GetValueOrDefault(id),
                data.VideoCounts.GetValueOrDefault(id) == 0,
                data.RemotesById.GetValueOrDefault(id) ?? Array.Empty<RemoteIdRef>(),
                $"/api/{entityType}s/{id}/image?max=640"))
            .OrderByDescending(m => m.VideoCount)
            .ThenBy(m => m.EntityId)
            .ToList();
        var label = members.FirstOrDefault(m => m.Name.Length > 0)?.Name ?? string.Empty;
        var decision = decisions.TryGetValue(group.Key, out var stored)
            ? new CandidateDecision(stored.Decision, stored.TargetEntityId, stored.DecidedAt)
            : null;
        return new CandidateSummary(
            group.Key, entityType, group.Kind, label,
            members.Count, members.Sum(m => m.VideoCount), members, decision);
    }

    /// <summary>Scene signatures (normalized title, studio) credited to 2+ members of the group.</summary>
    private async Task<IReadOnlyList<SharedScene>> GetSharedScenesAsync(
        string entityType, HashSet<int> members, CancellationToken ct)
    {
        if (members.Count < 2) return Array.Empty<SharedScene>();
        var acc = new Dictionary<(string Title, int Studio), SceneAcc>();

        if (entityType == PerformerType)
        {
            var credits = await _db.Set<VideoPerformer>().AsNoTracking()
                .Where(vp => members.Contains(vp.PerformerId))
                .Select(vp => new { vp.PerformerId, vp.VideoId })
                .ToListAsync(ct);
            var videoIds = credits.Select(c => c.VideoId).ToHashSet();
            var videos = (await _db.Set<Video>().AsNoTracking()
                .Where(v => videoIds.Contains(v.Id))
                .Select(v => new { v.Id, v.Title, v.StudioId })
                .ToListAsync(ct)).ToDictionary(v => v.Id);
            foreach (var c in credits)
            {
                if (!videos.TryGetValue(c.VideoId, out var v) || string.IsNullOrWhiteSpace(v.Title)) continue;
                Accumulate(acc, (v.Title.Trim().ToLowerInvariant(), v.StudioId ?? -1),
                    v.Title, v.StudioId, c.PerformerId, c.VideoId);
            }
        }
        else
        {
            var videos = await _db.Set<Video>().AsNoTracking()
                .Where(v => v.StudioId != null && members.Contains(v.StudioId!.Value))
                .Select(v => new { v.Id, v.Title, v.StudioId })
                .ToListAsync(ct);
            foreach (var v in videos)
            {
                if (string.IsNullOrWhiteSpace(v.Title)) continue;
                Accumulate(acc, (v.Title.Trim().ToLowerInvariant(), -1),
                    v.Title, v.StudioId, v.StudioId!.Value, v.Id);
            }
        }

        var studioIds = acc.Values.Where(s => s.StudioId != null).Select(s => s.StudioId!.Value).ToHashSet();
        var studioNames = (await _db.Set<Studio>().AsNoTracking()
            .Where(s => studioIds.Contains(s.Id))
            .Select(s => new { s.Id, s.Name }).ToListAsync(ct))
            .ToDictionary(s => s.Id, s => s.Name);

        return acc.Values
            .Where(s => s.Members.Count >= 2)
            .Select(s => new SharedScene(
                s.Title,
                s.StudioId == null || s.StudioId == -1 ? null : s.StudioId,
                s.StudioId == null || s.StudioId == -1 ? null : studioNames.GetValueOrDefault(s.StudioId.Value),
                s.Members.Count,
                s.Videos.OrderBy(id => id).Take(10).ToList()))
            .OrderByDescending(s => s.MemberCount)
            .ThenBy(s => s.Title, StringComparer.OrdinalIgnoreCase)
            .Take(50)
            .ToList();
    }

    private static void Accumulate(
        Dictionary<(string, int), SceneAcc> acc, (string, int) sig,
        string title, int? studioId, int member, int videoId)
    {
        if (!acc.TryGetValue(sig, out var a)) acc[sig] = a = new SceneAcc { Title = title, StudioId = studioId };
        a.Members.Add(member);
        a.Videos.Add(videoId);
    }
}
