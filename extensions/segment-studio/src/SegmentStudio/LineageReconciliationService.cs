using System.Security.Cryptography;
using System.Text;
using System.Text.Json;
using Cove.Core.Entities;
using Microsoft.EntityFrameworkCore;

namespace SegmentStudio;

public sealed record TagChangePreviewRequest(long ExpectedRevision, int TagId);

public sealed record TagChangeExecuteRequest(
    Guid OperationId,
    long ExpectedRevision,
    string ComponentFingerprint,
    int TagId);

public sealed record TagChangePreview(
    long ItemId,
    int CurrentTagId,
    int ProposedTagId,
    string ComponentFingerprint,
    IReadOnlyList<long> RemovedEdgeIds,
    IReadOnlyList<long> DeletedItemIds,
    int PreservedDescendantCount);

public sealed record TagChangeResult(
    long ItemId,
    int TagId,
    long Revision,
    int RemovedEdgeCount,
    int DeletedDescendantCount,
    bool Replayed = false);

public interface ILineageReconciliationService
{
    Task<TagChangePreview> PreviewAsync(
        DbContext db, long itemId, TagChangePreviewRequest request, CancellationToken ct);

    Task<TagChangeResult> ExecuteAsync(
        DbContext db,
        long itemId,
        TagChangeExecuteRequest request,
        int? actorUserId,
        CancellationToken ct,
        bool autoAssignMissingSlots = false);
}

public sealed class LineageReconciliationService(
    IDerivationGraphService graph) : ILineageReconciliationService
{
    public async Task<TagChangePreview> PreviewAsync(
        DbContext db,
        long itemId,
        TagChangePreviewRequest request,
        CancellationToken ct)
    {
        if (!await db.Set<Tag>().AsNoTracking().AnyAsync(tag => tag.Id == request.TagId, ct))
            throw new ArgumentException("Tag not found.", nameof(request));
        var state = await LoadStateAsync(db, itemId, ct);
        ValidateRoot(state, request.ExpectedRevision);
        return BuildPreview(state, request.TagId);
    }

    public async Task<TagChangeResult> ExecuteAsync(
        DbContext db,
        long itemId,
        TagChangeExecuteRequest request,
        int? actorUserId,
        CancellationToken ct,
        bool autoAssignMissingSlots = false)
    {
        if (db.Database.CurrentTransaction is not null)
            return await ExecuteCoreAsync(
                db, itemId, request, actorUserId, ct, autoAssignMissingSlots);

        var strategy = db.Database.CreateExecutionStrategy();
        var firstAttempt = true;
        return await strategy.ExecuteAsync(async () =>
        {
            if (!firstAttempt) db.ChangeTracker.Clear();
            firstAttempt = false;
            return await ExecuteCoreAsync(
                db, itemId, request, actorUserId, ct, autoAssignMissingSlots);
        });
    }

    private async Task<TagChangeResult> ExecuteCoreAsync(
        DbContext db,
        long itemId,
        TagChangeExecuteRequest request,
        int? actorUserId,
        CancellationToken ct,
        bool autoAssignMissingSlots)
    {
        if (request.OperationId == Guid.Empty)
            throw new ArgumentException("Operation ID is required.", nameof(request));
        if (string.IsNullOrWhiteSpace(request.ComponentFingerprint))
            throw new ArgumentException("Component fingerprint is required.", nameof(request));
        if (!await db.Set<Tag>().AsNoTracking().AnyAsync(tag => tag.Id == request.TagId, ct))
            throw new ArgumentException("Tag not found.", nameof(request));
        var requestFingerprint = Fingerprint(
            $"tag-change|{itemId}|{request.ExpectedRevision}|{request.ComponentFingerprint}|{request.TagId}");
        var replay = await ReplayAsync(db, request.OperationId, requestFingerprint, actorUserId, ct);
        if (replay is not null)
            return replay with { Replayed = true };

        await using var transaction = db.Database.IsRelational()
            && db.Database.CurrentTransaction is null
            ? await db.Database.BeginTransactionAsync(ct)
            : null;
        if (db.Database.ProviderName?.Contains("Npgsql", StringComparison.Ordinal) == true)
        {
            await db.Database.ExecuteSqlInterpolatedAsync(
                $"SELECT pg_advisory_xact_lock(hashtextextended({request.OperationId.ToString()}, 0))",
                ct);
        }
        replay = await ReplayAsync(db, request.OperationId, requestFingerprint, actorUserId, ct);
        if (replay is not null)
        {
            if (transaction is not null)
                await transaction.CommitAsync(ct);
            return replay with { Replayed = true };
        }
        var initial = await LoadStateAsync(db, itemId, ct);
        await SegmentStudioReviewLock.AcquireAsync(db, initial.RootNode.LastKnownVideoId, ct);
        var state = await LoadStateAsync(db, itemId, ct);
        ValidateRoot(state, request.ExpectedRevision);
        var preview = BuildPreview(state, request.TagId);
        if (preview.ComponentFingerprint != request.ComponentFingerprint)
            throw new LineageConflictException(
                "LINEAGE_COMPONENT_CHANGED",
                "The lineage component changed after the preview.");

        var root = state.RootItem;
        await PerformerSlotRetaggingService.RemapAsync(
            db, root.Id, preview.CurrentTagId, request.TagId, ct,
            autoAssignMissingSlots);
        if (root.NativeSegmentId is int nativeSegmentId)
        {
            var segment = await db.Set<Segment>().SingleAsync(candidate => candidate.Id == nativeSegmentId, ct);
            segment.TagId = request.TagId;
            segment.UpdatedAt = DateTime.UtcNow;
        }
        else
        {
            root.TagId = request.TagId;
        }
        root.Revision++;
        root.UpdatedAt = DateTime.UtcNow;
        state.RootNode.LastKnownTagId = request.TagId;
        state.RootNode.UpdatedAt = root.UpdatedAt;

        foreach (var edgeId in preview.RemovedEdgeIds)
            await graph.RemoveEdgeAsync(db, edgeId, ct);
        await graph.RecomputeInheritedProvenanceAsync(db, ct);

        var deletedItems = await db.Set<SegmentStudioItem>()
            .Where(candidate => preview.DeletedItemIds.Contains(candidate.Id))
            .ToListAsync(ct);
        var deletedNodes = await db.Set<SegmentStudioLineageNode>()
            .Where(candidate => candidate.ItemId != null
                && preview.DeletedItemIds.Contains(candidate.ItemId.Value))
            .ToListAsync(ct);
        db.RemoveRange(deletedNodes);
        var nativeIds = deletedItems
            .Where(candidate => candidate.NativeSegmentId is not null)
            .Select(candidate => candidate.NativeSegmentId!.Value)
            .ToArray();
        var nativeSegments = await db.Set<Segment>()
            .Where(segment => nativeIds.Contains(segment.Id))
            .ToListAsync(ct);
        foreach (var nativeSegment in nativeSegments)
        {
            if (nativeSegment.ImageBlobId is { Length: > 0 } blobId
                && !await db.Set<SegmentStudioBlobCleanupOutbox>()
                    .AnyAsync(entry => entry.BlobId == blobId, ct))
            {
                db.Add(new SegmentStudioBlobCleanupOutbox
                {
                    BlobId = blobId,
                    Status = "pending",
                    AttemptCount = 0,
                    CreatedAt = DateTime.UtcNow,
                    UpdatedAt = DateTime.UtcNow,
                });
            }
        }
        foreach (var item in deletedItems)
        {
            if (db.Database.ProviderName?.Contains("Npgsql", StringComparison.Ordinal) != true
                && item.ExtensionImageBlobId is { Length: > 0 } blobId
                && !await db.Set<SegmentStudioBlobCleanupOutbox>()
                    .AnyAsync(entry => entry.BlobId == blobId, ct))
            {
                db.Add(new SegmentStudioBlobCleanupOutbox
                {
                    BlobId = blobId,
                    Status = "pending",
                    AttemptCount = 0,
                    CreatedAt = DateTime.UtcNow,
                    UpdatedAt = DateTime.UtcNow,
                });
            }
        }
        if (nativeSegments.Count > 0)
            db.RemoveRange(nativeSegments);
        db.RemoveRange(deletedItems.Where(candidate => candidate.NativeSegmentId is null));

        var retainedEdges = state.Edges
            .Where(edge => !preview.RemovedEdgeIds.Contains(edge.Id))
            .ToArray();
        var rulesById = state.Rules.ToDictionary(rule => rule.Id);
        foreach (var edge in retainedEdges)
        {
            var rule = rulesById[edge.RuleId];
            edge.RuleVersionAtCreation = rule.Version;
            edge.SourceTagIdAtCreation = edge.SourceNodeId == state.RootNode.Id
                ? request.TagId
                : rule.SourceTagId;
            edge.DerivedTagIdAtCreation = rule.DerivedTagId;
            edge.UpdatedAt = DateTime.UtcNow;
        }

        var result = new TagChangeResult(
            itemId,
            request.TagId,
            root.Revision,
            preview.RemovedEdgeIds.Count,
            preview.DeletedItemIds.Count);
        db.Add(new SegmentStudioSegmentOperation
        {
            OperationId = request.OperationId,
            Kind = "tag-change",
            ActorUserId = actorUserId,
            RequestFingerprint = requestFingerprint,
            ComponentFingerprint = preview.ComponentFingerprint,
            ItemId = itemId,
            ResultPayloadJson = JsonSerializer.Serialize(result),
            CreatedAt = DateTime.UtcNow,
        });
        await db.SaveChangesAsync(ct);
        if (transaction is not null)
            await transaction.CommitAsync(ct);
        return result;
    }

    private static TagChangePreview BuildPreview(ComponentState state, int proposedTagId)
    {
        var rules = state.Rules.ToDictionary(rule => rule.Id);
        var nodes = state.Nodes.ToDictionary(node => node.Id);
        var affectedDescendants = new HashSet<Guid>();
        var affectedPending = new Stack<Guid>();
        affectedPending.Push(state.RootNode.Id);
        while (affectedPending.TryPop(out var affectedSource))
        {
            foreach (var edge in state.Edges.Where(candidate => candidate.SourceNodeId == affectedSource))
            {
                if (affectedDescendants.Add(edge.DerivedNodeId))
                    affectedPending.Push(edge.DerivedNodeId);
            }
        }
        var derivedNodeIds = state.Edges.Select(edge => edge.DerivedNodeId).ToHashSet();
        var componentRoots = state.Nodes
            .Where(node => !derivedNodeIds.Contains(node.Id))
            .Select(node => node.Id)
            .Order()
            .ToArray();
        var retainedNodes = componentRoots.ToHashSet();
        var retainedEdges = new HashSet<long>();
        var pending = new Queue<Guid>();
        foreach (var rootId in componentRoots)
            pending.Enqueue(rootId);
        while (pending.TryDequeue(out var sourceId))
        {
            var sourceTag = sourceId == state.RootNode.Id
                ? proposedTagId
                : nodes[sourceId].LastKnownTagId;
            foreach (var edge in state.Edges
                         .Where(candidate => candidate.SourceNodeId == sourceId)
                         .OrderBy(candidate => candidate.Id))
            {
                var rule = rules[edge.RuleId];
                var derived = nodes[edge.DerivedNodeId];
                if (rule.SourceTagId != sourceTag
                    || rule.DerivedTagId != derived.LastKnownTagId)
                    continue;
                retainedEdges.Add(edge.Id);
                if (retainedNodes.Add(derived.Id))
                    pending.Enqueue(derived.Id);
            }
        }

        var descendantIds = state.Nodes
            .Where(node => node.Id != state.RootNode.Id)
            .Select(node => node.Id)
            .ToHashSet();
        var deletedNodeIds = descendantIds.Except(retainedNodes).ToHashSet();
        var removedEdgeIds = state.Edges
            .Where(edge =>
                !retainedEdges.Contains(edge.Id)
                || deletedNodeIds.Contains(edge.SourceNodeId)
                || deletedNodeIds.Contains(edge.DerivedNodeId))
            .Select(edge => edge.Id)
            .Order()
            .ToArray();
        var deletedItemIds = state.Nodes
            .Where(node => deletedNodeIds.Contains(node.Id) && node.ItemId is not null)
            .Select(node => node.ItemId!.Value)
            .Order()
            .ToArray();
        return new TagChangePreview(
            state.RootItem.Id,
            state.RootNode.LastKnownTagId!.Value,
            proposedTagId,
            state.Fingerprint,
            removedEdgeIds,
            deletedItemIds,
            affectedDescendants.Count(retainedNodes.Contains));
    }

    private static void ValidateRoot(ComponentState state, long expectedRevision)
    {
        if (state.RootItem.Revision != expectedRevision)
            throw new LineageConflictException(
                "LINEAGE_COMPONENT_CHANGED",
                "The root segment changed before reconciliation.");
        if (state.RootNode.LastKnownTagId is null)
            throw new LineageConflictException("LINEAGE_RULE_MISMATCH", "The root segment has no tag.");
        if (state.Edges.Any(edge => edge.DerivedNodeId == state.RootNode.Id))
            throw new LineageConflictException(
                "DERIVED_TAG_IMMUTABLE",
                "An intermediate or derived segment cannot be retagged.");
    }

    private static async Task<ComponentState> LoadStateAsync(
        DbContext db,
        long itemId,
        CancellationToken ct)
    {
        var item = await db.Set<SegmentStudioItem>()
            .SingleOrDefaultAsync(candidate => candidate.Id == itemId, ct)
            ?? throw new KeyNotFoundException("Segment Studio item was not found.");
        var node = await db.Set<SegmentStudioLineageNode>()
            .SingleOrDefaultAsync(candidate => candidate.ItemId == itemId && candidate.State == "live", ct)
            ?? throw new KeyNotFoundException("The item has no live lineage node.");
        var edges = (await LineageScaleQueries.LoadComponentEdgesAsync(
            db, [node.Id], tracking: true, ct)).ToArray();
        var componentNodeIds = edges
            .SelectMany(edge => new[] { edge.SourceNodeId, edge.DerivedNodeId })
            .Append(node.Id)
            .ToHashSet();
        var nodes = await db.Set<SegmentStudioLineageNode>()
            .Where(candidate => componentNodeIds.Contains(candidate.Id))
            .ToArrayAsync(ct);
        var ruleIds = edges.Select(edge => edge.RuleId).Distinct().ToArray();
        var rules = await db.Set<SegmentStudioDerivationRule>()
            .Where(rule => ruleIds.Contains(rule.Id))
            .ToArrayAsync(ct);
        if (rules.Length != ruleIds.Length || nodes.Any(candidate => candidate.State != "live"))
            throw new LineageConflictException(
                "LINEAGE_COMPONENT_INCONSISTENT",
                "The lineage component must be repaired before retagging.");
        var nodeItemIds = nodes.Where(value => value.ItemId is not null)
            .Select(value => value.ItemId!.Value)
            .ToArray();
        var componentItems = await db.Set<SegmentStudioItem>().AsNoTracking()
            .Where(candidate => nodeItemIds.Contains(candidate.Id))
            .Select(candidate => new { candidate.Id, candidate.Revision, candidate.TagId, candidate.NativeSegmentId })
            .ToArrayAsync(ct);
        if (componentItems.Length != nodes.Length)
            throw new LineageConflictException(
                "LINEAGE_COMPONENT_INCONSISTENT",
                "The lineage component contains a live node without a live item.");
        var nativeIds = componentItems
            .Where(value => value.NativeSegmentId is not null)
            .Select(value => value.NativeSegmentId!.Value)
            .ToArray();
        var nativeSegments = await db.Set<Segment>().AsNoTracking()
            .Where(segment => nativeIds.Contains(segment.Id))
            .Select(segment => new { segment.Id, segment.TagId, segment.UpdatedAt })
            .ToDictionaryAsync(segment => segment.Id, ct);
        foreach (var componentNode in nodes)
        {
            var componentItem = componentItems.Single(value => value.Id == componentNode.ItemId);
            var currentTag = componentItem.NativeSegmentId is int nativeId
                ? nativeSegments.GetValueOrDefault(nativeId)?.TagId
                : componentItem.TagId;
            if (currentTag != componentNode.LastKnownTagId)
                throw new LineageConflictException(
                    "LINEAGE_COMPONENT_INCONSISTENT",
                    "The lineage component tag snapshots do not match the live segments.");
        }
        var fingerprintPayload = string.Join("|",
            componentItems.OrderBy(value => value.Id)
                .Select(value => $"i:{value.Id}:{value.Revision}")) + "|"
            + string.Join("|", nodes.OrderBy(value => value.Id)
                .Select(value => $"n:{value.Id}:{value.ItemId}:{value.State}:{value.LastKnownTagId}")) + "|"
            + string.Join("|", edges.OrderBy(value => value.Id)
                .Select(value => $"e:{value.Id}:{value.SourceNodeId}:{value.DerivedNodeId}:{value.RuleId}:{value.SourceTagIdAtCreation}:{value.DerivedTagIdAtCreation}")) + "|"
            + string.Join("|", rules.OrderBy(value => value.Id)
                .Select(value => $"r:{value.Id}:{value.SourceTagId}:{value.DerivedTagId}:{value.UpdatedAt.Ticks}")) + "|"
            + string.Join("|", nativeSegments.Values.OrderBy(value => value.Id)
                .Select(value => $"s:{value.Id}:{value.TagId}:{value.UpdatedAt.Ticks}"));
        return new ComponentState(item, node, nodes, edges, rules, Fingerprint(fingerprintPayload));
    }

    private static string Fingerprint(string payload) =>
        Convert.ToHexString(SHA256.HashData(Encoding.UTF8.GetBytes(payload)));

    private static async Task<TagChangeResult?> ReplayAsync(
        DbContext db,
        Guid operationId,
        string requestFingerprint,
        int? actorUserId,
        CancellationToken ct)
    {
        var receipt = await db.Set<SegmentStudioSegmentOperation>().AsNoTracking()
            .SingleOrDefaultAsync(operation => operation.OperationId == operationId, ct);
        if (receipt is null)
            return null;
        if (receipt.Kind != "tag-change"
            || receipt.RequestFingerprint != requestFingerprint
            || receipt.ActorUserId != actorUserId)
            throw new LineageConflictException(
                "LINEAGE_COMPONENT_CHANGED",
                "The operation ID was already used for another request.");
        return JsonSerializer.Deserialize<TagChangeResult>(receipt.ResultPayloadJson!)!;
    }

    private sealed record ComponentState(
        SegmentStudioItem RootItem,
        SegmentStudioLineageNode RootNode,
        IReadOnlyList<SegmentStudioLineageNode> Nodes,
        IReadOnlyList<SegmentStudioDerivationEdge> Edges,
        IReadOnlyList<SegmentStudioDerivationRule> Rules,
        string Fingerprint);
}
