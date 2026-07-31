using Microsoft.EntityFrameworkCore;

namespace SegmentStudio;

public sealed class LineageConflictException(string code, string message) : InvalidOperationException(message)
{
    public string Code { get; } = code;
}

public sealed record DerivationEdgeCreate(
    Guid SourceNodeId,
    Guid DerivedNodeId,
    Guid RuleId,
    Guid? ActivityId,
    DateTime? RecordedAt,
    string MetadataJson);

public sealed record DerivationEdgeDto(
    long Id,
    Guid SourceNodeId,
    Guid DerivedNodeId,
    string RuleKey,
    string RuleVersion,
    int SourceTagId,
    int DerivedTagId);

public sealed record LineageRelativeDto(
    long ItemId,
    Guid NodeId,
    string RuleKey,
    string RuleVersion,
    int TagId);

public sealed record SegmentLineageDto(
    Guid? NodeId,
    bool Derived,
    bool TagReadOnly,
    int ComponentSize,
    string IntegrityState,
    IReadOnlyList<LineageRelativeDto> Parents,
    IReadOnlyList<LineageRelativeDto> Children);

public interface IDerivationGraphService
{
    Task<SegmentStudioDerivationEdge> CreateEdgeAsync(
        DbContext db,
        DerivationEdgeCreate request,
        CancellationToken ct);

    Task RemoveEdgeAsync(DbContext db, long edgeId, CancellationToken ct);

    Task RecomputeInheritedProvenanceAsync(DbContext db, CancellationToken ct);

    Task<IReadOnlyList<DerivationEdgeDto>> GetComponentEdgesAsync(
        DbContext db,
        Guid nodeId,
        CancellationToken ct);

    Task<SegmentLineageDto> GetLineageAsync(
        DbContext db,
        long itemId,
        CancellationToken ct);
}

public sealed class DerivationGraphService(
    ISegmentProvenanceService? provenanceService = null) : IDerivationGraphService
{
    private readonly ISegmentProvenanceService _provenance =
        provenanceService ?? new SegmentProvenanceService();

    public async Task<SegmentStudioDerivationEdge> CreateEdgeAsync(
        DbContext db,
        DerivationEdgeCreate request,
        CancellationToken ct)
    {
        var isPostgres = db.Database.ProviderName?.Contains("Npgsql", StringComparison.Ordinal) == true;
        await using var localTransaction = isPostgres && db.Database.CurrentTransaction is null
            ? await db.Database.BeginTransactionAsync(ct)
            : null;
        if (isPostgres)
        {
            foreach (var nodeId in new[] { request.SourceNodeId, request.DerivedNodeId }.Order())
            {
                await db.Database.ExecuteSqlInterpolatedAsync(
                    $"SELECT pg_advisory_xact_lock(hashtextextended({nodeId.ToString()}, 0))",
                    ct);
            }
        }
        if (request.SourceNodeId == request.DerivedNodeId)
            throw new LineageConflictException("LINEAGE_CYCLE", "A segment cannot derive from itself.");
        if (string.IsNullOrWhiteSpace(request.MetadataJson))
            throw new ArgumentException("Derivation metadata is required.", nameof(request));
        try
        {
            using var _ = System.Text.Json.JsonDocument.Parse(request.MetadataJson);
        }
        catch (System.Text.Json.JsonException exception)
        {
            throw new ArgumentException("Derivation metadata must be valid JSON.", nameof(request), exception);
        }

        var nodes = await db.Set<SegmentStudioLineageNode>()
            .Where(node => node.Id == request.SourceNodeId || node.Id == request.DerivedNodeId)
            .ToDictionaryAsync(node => node.Id, ct);
        if (!nodes.TryGetValue(request.SourceNodeId, out var source)
            || !nodes.TryGetValue(request.DerivedNodeId, out var derived)
            || source.State != "live"
            || derived.State != "live")
            throw new KeyNotFoundException("Both lineage endpoints must be live.");
        if (source.LastKnownVideoId != derived.LastKnownVideoId)
            throw new LineageConflictException("LINEAGE_CROSS_VIDEO", "Derivation cannot cross videos.");
        await SegmentStudioReviewLock.AcquireAsync(db, source.LastKnownVideoId, ct);
        await db.Entry(source).ReloadAsync(ct);
        await db.Entry(derived).ReloadAsync(ct);
        if (derived.ItemId is long derivedItemId
            && await db.Set<SegmentStudioItem>().AsNoTracking()
                .AnyAsync(item => item.Id == derivedItemId && item.NativeSegmentId != null, ct))
            throw new LineageConflictException(
                "NATIVE_DERIVED_NOT_ALLOWED",
                "Derived segments must remain Segment Studio-owned.");

        var ruleQuery = isPostgres
            ? db.Set<SegmentStudioDerivationRule>()
                .FromSqlInterpolated($"""
                    SELECT *
                    FROM segment_studio_derivation_rules
                    WHERE id = {request.RuleId}
                    FOR KEY SHARE
                    """)
                .AsNoTracking()
            : db.Set<SegmentStudioDerivationRule>().AsNoTracking();
        var rule = await ruleQuery
            .SingleOrDefaultAsync(candidate => candidate.Id == request.RuleId, ct)
            ?? throw new LineageConflictException("LINEAGE_RULE_MISMATCH", "Derivation rule was not found.");
        if (source.LastKnownTagId != rule.SourceTagId
            || derived.LastKnownTagId != rule.DerivedTagId)
            throw new LineageConflictException(
                "LINEAGE_RULE_MISMATCH",
                "The rule does not match the current source and derived tags.");
        if (await db.Set<SegmentStudioDerivationEdge>().AsNoTracking().AnyAsync(edge =>
                edge.SourceNodeId == request.SourceNodeId
                && edge.DerivedNodeId == request.DerivedNodeId
                && edge.RuleId == request.RuleId, ct))
            throw new LineageConflictException("LINEAGE_RULE_MISMATCH", "This derivation edge already exists.");
        if (await IsReachableAsync(db, request.DerivedNodeId, request.SourceNodeId, ct))
            throw new LineageConflictException("LINEAGE_CYCLE", "The derivation would create a cycle.");

        var disagreeingParent = await (
                from edge in db.Set<SegmentStudioDerivationEdge>().AsNoTracking()
                join incomingRule in db.Set<SegmentStudioDerivationRule>().AsNoTracking()
                    on edge.RuleId equals incomingRule.Id
                where edge.DerivedNodeId == request.DerivedNodeId
                    && incomingRule.DerivedTagId != rule.DerivedTagId
                select edge.Id)
            .AnyAsync(ct);
        if (disagreeingParent)
            throw new LineageConflictException(
                "LINEAGE_RULE_MISMATCH",
                "All parents of a derived segment must agree on its tag.");

        var now = DateTime.UtcNow;
        var created = new SegmentStudioDerivationEdge
        {
            SourceNodeId = source.Id,
            DerivedNodeId = derived.Id,
            RuleId = rule.Id,
            RuleVersionAtCreation = rule.Version,
            SourceTagIdAtCreation = rule.SourceTagId,
            DerivedTagIdAtCreation = rule.DerivedTagId,
            ActivityId = request.ActivityId,
            RecordedAt = request.RecordedAt,
            MetadataJson = request.MetadataJson,
            CreatedAt = now,
            UpdatedAt = now,
        };
        db.Add(created);
        await db.SaveChangesAsync(ct);
        await CopyInheritedProvenanceAsync(db, source.Id, derived.Id, ct);
        if (localTransaction is not null)
            await localTransaction.CommitAsync(ct);
        return created;
    }

    public async Task<IReadOnlyList<DerivationEdgeDto>> GetComponentEdgesAsync(
        DbContext db,
        Guid nodeId,
        CancellationToken ct)
    {
        var edges = await LineageScaleQueries.LoadComponentEdgesAsync(
            db, [nodeId], tracking: false, ct);
        var componentNodes = edges
            .SelectMany(edge => new[] { edge.SourceNodeId, edge.DerivedNodeId })
            .Append(nodeId)
            .ToHashSet();

        var ruleIds = edges.Where(edge =>
                componentNodes.Contains(edge.SourceNodeId)
                && componentNodes.Contains(edge.DerivedNodeId))
            .Select(edge => edge.RuleId)
            .Distinct()
            .ToArray();
        var rules = await db.Set<SegmentStudioDerivationRule>().AsNoTracking()
            .Where(rule => ruleIds.Contains(rule.Id))
            .ToDictionaryAsync(rule => rule.Id, ct);
        return edges
            .Where(edge =>
                componentNodes.Contains(edge.SourceNodeId)
                && componentNodes.Contains(edge.DerivedNodeId))
            .OrderBy(edge => edge.Id)
            .Select(edge =>
            {
                var rule = rules[edge.RuleId];
                return new DerivationEdgeDto(
                    edge.Id,
                    edge.SourceNodeId,
                    edge.DerivedNodeId,
                    rule.Key,
                    rule.Version,
                    edge.SourceTagIdAtCreation,
                    edge.DerivedTagIdAtCreation);
            })
            .ToArray();
    }

    public async Task RemoveEdgeAsync(DbContext db, long edgeId, CancellationToken ct)
    {
        var isPostgres = db.Database.ProviderName?.Contains("Npgsql", StringComparison.Ordinal) == true;
        await using var localTransaction = isPostgres && db.Database.CurrentTransaction is null
            ? await db.Database.BeginTransactionAsync(ct)
            : null;
        var edge = await db.Set<SegmentStudioDerivationEdge>()
            .SingleOrDefaultAsync(candidate => candidate.Id == edgeId, ct)
            ?? throw new KeyNotFoundException("Derivation edge was not found.");
        var videoId = await db.Set<SegmentStudioLineageNode>().AsNoTracking()
            .Where(node => node.Id == edge.SourceNodeId)
            .Select(node => node.LastKnownVideoId)
            .SingleAsync(ct);
        await SegmentStudioReviewLock.AcquireAsync(db, videoId, ct);
        var affectedNodeIds = new[] { edge.SourceNodeId, edge.DerivedNodeId };
        db.Remove(edge);
        await db.SaveChangesAsync(ct);
        await RetireUnsupportedInheritedAssertionsAsync(db, affectedNodeIds, ct);
        if (localTransaction is not null)
            await localTransaction.CommitAsync(ct);
    }

    public async Task RecomputeInheritedProvenanceAsync(DbContext db, CancellationToken ct)
    {
        var edges = await LineageScaleQueries.LoadAllEdgesAsync(
            db, tracking: false, ct);
        var outgoing = edges.ToLookup(edge => edge.SourceNodeId, edge => edge.DerivedNodeId);
        var origins = (await LineageScaleQueries.LoadActiveProvenanceAsync(
                db, tracking: false, ct))
            .Where(assertion => assertion.Relation == "origin")
            .ToArray();
        foreach (var origin in origins)
        {
            var pending = new Stack<Guid>(outgoing[origin.LineageNodeId]);
            var visited = new HashSet<Guid>();
            while (pending.TryPop(out var descendantId))
            {
                if (!visited.Add(descendantId))
                    continue;
                await _provenance.AppendAsync(
                    db,
                    new SegmentProvenanceAppend(
                        descendantId,
                        origin.SourceId,
                        "inherited",
                        origin.ActivityId,
                        origin.ModelKey,
                        origin.ModelIdentifier,
                        origin.ModelVersion,
                        origin.Confidence,
                        origin.RecordedAt,
                        origin.MetadataJson),
                    ct);
                foreach (var childId in outgoing[descendantId])
                    pending.Push(childId);
            }
        }
        await RetireUnsupportedInheritedAssertionsAsync(db, ct);
    }

    public async Task<SegmentLineageDto> GetLineageAsync(
        DbContext db,
        long itemId,
        CancellationToken ct)
    {
        var node = await db.Set<SegmentStudioLineageNode>().AsNoTracking()
            .SingleOrDefaultAsync(candidate => candidate.ItemId == itemId && candidate.State == "live", ct);
        if (node is null)
            return new SegmentLineageDto(null, false, false, 1, "consistent", [], []);
        var edges = await GetComponentEdgesAsync(db, node.Id, ct);
        var nodeIds = edges
            .SelectMany(edge => new[] { edge.SourceNodeId, edge.DerivedNodeId })
            .Append(node.Id)
            .Distinct()
            .ToArray();
        var itemIds = await db.Set<SegmentStudioLineageNode>().AsNoTracking()
            .Where(candidate => nodeIds.Contains(candidate.Id) && candidate.State == "live")
            .ToDictionaryAsync(candidate => candidate.Id, candidate => candidate.ItemId, ct);
        var parents = edges
            .Where(edge => edge.DerivedNodeId == node.Id)
            .Where(edge => itemIds.GetValueOrDefault(edge.SourceNodeId) is not null)
            .Select(edge => new LineageRelativeDto(
                itemIds[edge.SourceNodeId]!.Value,
                edge.SourceNodeId,
                edge.RuleKey,
                edge.RuleVersion,
                edge.SourceTagId))
            .ToArray();
        var children = edges
            .Where(edge => edge.SourceNodeId == node.Id)
            .Where(edge => itemIds.GetValueOrDefault(edge.DerivedNodeId) is not null)
            .Select(edge => new LineageRelativeDto(
                itemIds[edge.DerivedNodeId]!.Value,
                edge.DerivedNodeId,
                edge.RuleKey,
                edge.RuleVersion,
                edge.DerivedTagId))
            .ToArray();
        return new SegmentLineageDto(
            node.Id,
            parents.Length > 0,
            parents.Length > 0,
            nodeIds.Length,
            "unchecked",
            parents,
            children);
    }

    private static async Task<bool> IsReachableAsync(
        DbContext db,
        Guid start,
        Guid target,
        CancellationToken ct)
    {
        var edges = await LineageScaleQueries.LoadComponentEdgesAsync(
            db, [start], tracking: false, ct);
        var outgoing = edges.ToLookup(edge => edge.SourceNodeId, edge => edge.DerivedNodeId);
        var pending = new Stack<Guid>();
        var visited = new HashSet<Guid>();
        pending.Push(start);
        while (pending.TryPop(out var current))
        {
            if (!visited.Add(current))
                continue;
            if (current == target)
                return true;
            foreach (var next in outgoing[current])
                pending.Push(next);
        }
        return false;
    }

    private async Task CopyInheritedProvenanceAsync(
        DbContext db,
        Guid sourceNodeId,
        Guid derivedNodeId,
        CancellationToken ct)
    {
        var assertions = await db.Set<SegmentStudioSegmentProvenance>().AsNoTracking()
            .Where(assertion =>
                assertion.LineageNodeId == sourceNodeId
                && assertion.SupersededAt == null)
            .OrderBy(assertion => assertion.Id)
            .ToListAsync(ct);
        foreach (var assertion in assertions)
        {
            await _provenance.AppendAsync(
                db,
                new SegmentProvenanceAppend(
                    derivedNodeId,
                    assertion.SourceId,
                    "inherited",
                    assertion.ActivityId,
                    assertion.ModelKey,
                    assertion.ModelIdentifier,
                    assertion.ModelVersion,
                    assertion.Confidence,
                    assertion.RecordedAt,
                    assertion.MetadataJson),
                ct);
        }
    }

    internal static async Task RetireUnsupportedInheritedAssertionsAsync(
        DbContext db,
        CancellationToken ct)
    {
        var edges = await LineageScaleQueries.LoadAllEdgesAsync(
            db, tracking: false, ct);
        var parents = edges.ToLookup(edge => edge.DerivedNodeId, edge => edge.SourceNodeId);
        var assertions = await LineageScaleQueries.LoadActiveProvenanceAsync(
            db, tracking: true, ct);
        await RetireUnsupportedInheritedAssertionsAsync(db, parents, assertions, ct);
    }

    internal static async Task RetireUnsupportedInheritedAssertionsAsync(
        DbContext db,
        IEnumerable<Guid> affectedNodeIds,
        CancellationToken ct)
    {
        var pending = new Queue<Guid>(affectedNodeIds.Distinct());
        var processed = new HashSet<Guid>();
        while (pending.TryDequeue(out var root))
        {
            if (processed.Contains(root)
                || !await db.Set<SegmentStudioLineageNode>().AsNoTracking()
                    .AnyAsync(node => node.Id == root, ct))
                continue;

            var edges = await LineageScaleQueries.LoadComponentEdgesAsync(
                db, [root], tracking: false, ct);
            var nodeIds = edges
                .SelectMany(edge => new[] { edge.SourceNodeId, edge.DerivedNodeId })
                .Append(root)
                .Distinct()
                .ToArray();
            processed.UnionWith(nodeIds);

            var assertions = await db.Set<SegmentStudioSegmentProvenance>()
                .Where(assertion =>
                    nodeIds.Contains(assertion.LineageNodeId)
                    && assertion.SupersededAt == null)
                .OrderBy(assertion => assertion.Id)
                .ToListAsync(ct);
            var parents = edges.ToLookup(edge => edge.DerivedNodeId, edge => edge.SourceNodeId);
            await RetireUnsupportedInheritedAssertionsAsync(db, parents, assertions, ct);
        }
    }

    private static async Task RetireUnsupportedInheritedAssertionsAsync(
        DbContext db,
        ILookup<Guid, Guid> parents,
        IReadOnlyList<SegmentStudioSegmentProvenance> assertions,
        CancellationToken ct)
    {
        var origins = assertions.Where(assertion => assertion.Relation == "origin").ToArray();
        var now = DateTime.UtcNow;
        foreach (var inherited in assertions.Where(assertion => assertion.Relation == "inherited"))
        {
            var pending = new Stack<Guid>(parents[inherited.LineageNodeId]);
            var visited = new HashSet<Guid>();
            var supported = false;
            while (pending.TryPop(out var ancestor))
            {
                if (!visited.Add(ancestor))
                    continue;
                if (origins.Any(origin =>
                        origin.LineageNodeId == ancestor
                        && SameEvidence(origin, inherited)))
                {
                    supported = true;
                    break;
                }
                foreach (var parent in parents[ancestor])
                    pending.Push(parent);
            }
            if (!supported)
            {
                inherited.SupersededAt = now;
                inherited.UpdatedAt = now;
            }
        }
        await db.SaveChangesAsync(ct);
    }

    private static bool SameEvidence(
        SegmentStudioSegmentProvenance left,
        SegmentStudioSegmentProvenance right) =>
        left.SourceId == right.SourceId
        && left.ActivityId == right.ActivityId
        && left.ModelKey == right.ModelKey
        && left.ModelIdentifier == right.ModelIdentifier
        && left.ModelVersion == right.ModelVersion;
}
