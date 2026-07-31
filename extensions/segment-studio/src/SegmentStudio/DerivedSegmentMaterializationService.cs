using System.Security.Cryptography;
using System.Text;
using System.Text.Json;
using Cove.Core.Entities;
using Microsoft.EntityFrameworkCore;

namespace SegmentStudio;

public sealed record DerivedSegmentMaterializationPreviewRequest(int MaxDepth = 3);

public sealed record DerivedSegmentMaterializationRequest(
    Guid OperationId,
    string Fingerprint,
    int MaxDepth = 3);

public sealed record DerivedSegmentMaterializationOutput(
    Guid RuleId,
    long RootItemId,
    string RootTagName,
    double RootStartSec,
    string SourceTagName,
    string DerivedTagName,
    int Depth,
    string Action);

public sealed record DerivedSegmentMaterializationPreview(
    string Fingerprint,
    int SourceCount,
    int CreateCount,
    int LinkCount,
    int AlreadyMaterializedCount,
    int ConflictCount,
    IReadOnlyList<DerivedSegmentMaterializationOutput> Outputs);

public sealed record DerivedSegmentMaterializationResult(
    int CreatedCount,
    int LinkedCount,
    int AlreadyMaterializedCount,
    bool Replayed = false);

public static class DerivedSegmentMaterializationService
{
    private const int MaxVisitedRuleApplications = 20_000;
    private const int MaxPlannedActions = 10_000;

    public static async Task<DerivedSegmentMaterializationPreview> PreviewAsync(
        DbContext db,
        int videoId,
        int maxDepth,
        CancellationToken ct)
    {
        var plan = await BuildPlanAsync(db, videoId, NormalizeDepth(maxDepth), ct);
        return ToPreview(plan);
    }

    public static async Task<DerivedSegmentMaterializationResult> ExecuteAsync(
        DbContext db,
        int videoId,
        DerivedSegmentMaterializationRequest request,
        int? actorUserId,
        CancellationToken ct)
    {
        if (request.OperationId == Guid.Empty)
            throw new ArgumentException("Operation ID is required.", nameof(request));
        if (string.IsNullOrWhiteSpace(request.Fingerprint))
            throw new ArgumentException("Preview fingerprint is required.", nameof(request));
        var strategy = db.Database.CreateExecutionStrategy();
        return await strategy.ExecuteAsync(async () =>
        {
            // A transient failure may retry this delegate with the same scoped DbContext.
            // Reset tracked state before rebuilding and applying the complete transaction.
            db.ChangeTracker.Clear();
            return await ExecuteCoreAsync(db, videoId, request, actorUserId, ct);
        });
    }

    private static async Task<DerivedSegmentMaterializationResult> ExecuteCoreAsync(
        DbContext db,
        int videoId,
        DerivedSegmentMaterializationRequest request,
        int? actorUserId,
        CancellationToken ct)
    {
        var maxDepth = NormalizeDepth(request.MaxDepth);
        var requestFingerprint = Hash($"{videoId}|{request.Fingerprint}|{maxDepth}");
        var replay = await ReplayAsync(db, request.OperationId, requestFingerprint, actorUserId, ct);
        if (replay is not null) return replay with { Replayed = true };

        await using var transaction = db.Database.IsRelational()
            ? await db.Database.BeginTransactionAsync(ct)
            : null;
        await SegmentStudioRolloutService.EnsureWritesEnabledAsync(db, ct);
        await AcquireOperationLockAsync(db, request.OperationId, ct);
        replay = await ReplayAsync(db, request.OperationId, requestFingerprint, actorUserId, ct);
        if (replay is not null)
        {
            if (transaction is not null) await transaction.CommitAsync(ct);
            return replay with { Replayed = true };
        }
        await SegmentStudioReviewLock.AcquireAsync(db, videoId, ct);
        await SyncNativeLineageSnapshotsAsync(db, videoId, ct);

        var plan = await BuildPlanAsync(db, videoId, maxDepth, ct);
        if (!CryptographicOperations.FixedTimeEquals(
                Encoding.UTF8.GetBytes(plan.Fingerprint),
                Encoding.UTF8.GetBytes(request.Fingerprint)))
            throw new LineageConflictException(
                "LINEAGE_COMPONENT_CHANGED",
                "Derived segment inputs changed after preview.");

        var nodesByToken = plan.Nodes.Values
            .Where(node => node.NodeId is not null)
            .ToDictionary(node => node.Token, node => node.NodeId!.Value);
        var graph = new DerivationGraphService();
        var createdCount = 0;
        var linkedCount = 0;
        foreach (var action in plan.Actions.OrderBy(action => action.Depth))
        {
            if (action.Action == "create")
            {
                var target = plan.Nodes[action.TargetToken];
                var now = DateTime.UtcNow;
                var item = new SegmentStudioItem
                {
                    ReviewState = "unreviewed",
                    RepresentationSchemaVersion = 1,
                    VideoId = videoId,
                    StartSec = target.StartSec,
                    EndSec = target.EndSec,
                    TagId = target.TagId,
                    Kind = "tag",
                    SourceKey = target.SourceKey ?? "user",
                    SourceRunId = target.SourceRunId,
                    Confidence = target.Confidence,
                    Revision = 1,
                    CreatedAt = now,
                    UpdatedAt = now,
                };
                db.Add(item);
                await db.SaveChangesAsync(ct);
                var node = new SegmentStudioLineageNode
                {
                    Id = Guid.NewGuid(),
                    ItemId = item.Id,
                    State = "live",
                    LastKnownVideoId = videoId,
                    LastKnownTagId = target.TagId,
                    LastKnownStartSec = target.StartSec,
                    LastKnownEndSec = target.EndSec,
                    CreatedAt = now,
                    UpdatedAt = now,
                };
                db.Add(node);
                foreach (var assignment in target.Assignments)
                {
                    db.Add(new SegmentStudioSegmentSlot
                    {
                        ItemId = item.Id,
                        SlotDefinitionId = assignment.Key,
                        PerformerId = assignment.Value,
                        CreatedAt = now,
                    });
                }
                await db.SaveChangesAsync(ct);
                nodesByToken[target.Token] = node.Id;
                createdCount++;
            }
            else
            {
                linkedCount++;
            }

            await graph.CreateEdgeAsync(
                db,
                new DerivationEdgeCreate(
                    nodesByToken[action.SourceToken],
                    nodesByToken[action.TargetToken],
                    action.Rule.Id,
                    null,
                    DateTime.UtcNow,
                    """{"materializedBy":"segment-studio"}"""),
                ct);
        }

        var result = new DerivedSegmentMaterializationResult(
            createdCount,
            linkedCount,
            plan.AlreadyMaterializedCount);
        db.Add(new SegmentStudioSegmentOperation
        {
            OperationId = request.OperationId,
            Kind = "materialize-derived",
            ActorUserId = actorUserId,
            RequestFingerprint = requestFingerprint,
            ComponentFingerprint = $"video:{videoId}",
            ResultPayloadJson = JsonSerializer.Serialize(result),
            CreatedAt = DateTime.UtcNow,
        });
        await db.SaveChangesAsync(ct);
        if (transaction is not null) await transaction.CommitAsync(ct);
        return result;
    }

    private static async Task SyncNativeLineageSnapshotsAsync(
        DbContext db,
        int videoId,
        CancellationToken ct)
    {
        var rows = await (
                from node in db.Set<SegmentStudioLineageNode>()
                join item in db.Set<SegmentStudioItem>() on node.ItemId equals item.Id
                join segment in db.Set<Segment>() on item.NativeSegmentId equals segment.Id
                where node.State == "live"
                    && segment.HostType == SegmentHostType.Video
                    && segment.HostId == videoId
                    && segment.Kind == "tag"
                    && segment.TagId != null
                select new { Node = node, Segment = segment })
            .ToListAsync(ct);
        var now = DateTime.UtcNow;
        var changed = false;
        foreach (var row in rows)
        {
            if (row.Node.LastKnownVideoId == row.Segment.HostId
                && row.Node.LastKnownTagId == row.Segment.TagId
                && row.Node.LastKnownStartSec == row.Segment.StartSec
                && row.Node.LastKnownEndSec == row.Segment.EndSec)
                continue;
            row.Node.LastKnownVideoId = row.Segment.HostId;
            row.Node.LastKnownTagId = row.Segment.TagId;
            row.Node.LastKnownStartSec = row.Segment.StartSec;
            row.Node.LastKnownEndSec = row.Segment.EndSec;
            row.Node.UpdatedAt = now;
            changed = true;
        }
        if (changed) await db.SaveChangesAsync(ct);
    }

    private static async Task<MaterializationPlan> BuildPlanAsync(
        DbContext db,
        int videoId,
        int maxDepth,
        CancellationToken ct)
    {
        var nativeSegments = await db.Set<Segment>().AsNoTracking()
            .Where(segment => segment.HostType == SegmentHostType.Video
                && segment.HostId == videoId
                && segment.Kind == "tag"
                && segment.TagId != null)
            .ToDictionaryAsync(segment => segment.Id, ct);
        var nativeSegmentIds = nativeSegments.Keys.ToArray();
        var nativeAnchorItemIds = nativeSegmentIds.Length == 0
            ? []
            : await db.Set<SegmentStudioItem>().AsNoTracking()
                .Where(item => item.NativeSegmentId != null
                    && nativeSegmentIds.Contains(item.NativeSegmentId.Value))
                .Select(item => item.Id)
                .ToArrayAsync(ct);
        var nodeRows = await db.Set<SegmentStudioLineageNode>().AsNoTracking()
            .Where(node => node.State == "live"
                && node.ItemId != null
                && (nativeAnchorItemIds.Contains(node.ItemId.Value)
                    || (node.LastKnownVideoId == videoId
                        && node.LastKnownTagId != null
                        && node.LastKnownStartSec != null)))
            .OrderBy(node => node.CreatedAt)
            .ThenBy(node => node.Id)
            .ToListAsync(ct);
        var itemIds = nodeRows.Select(node => node.ItemId!.Value).ToArray();
        var items = await db.Set<SegmentStudioItem>().AsNoTracking()
            .Where(item => itemIds.Contains(item.Id))
            .ToDictionaryAsync(item => item.Id, ct);
        var slotRows = await db.Set<SegmentStudioSegmentSlot>().AsNoTracking()
            .Where(slot => itemIds.Contains(slot.ItemId))
            .ToListAsync(ct);
        var rules = await db.Set<SegmentStudioDerivationRule>().AsNoTracking()
            .OrderBy(rule => rule.SourceTagId)
            .ThenBy(rule => rule.DerivedTagId)
            .ThenBy(rule => rule.Id)
            .ToListAsync(ct);
        var relevantNodeIds = nodeRows.Select(node => node.Id).ToArray();
        var edges = await db.Set<SegmentStudioDerivationEdge>().AsNoTracking()
            .Where(edge => relevantNodeIds.Contains(edge.SourceNodeId)
                || relevantNodeIds.Contains(edge.DerivedNodeId))
            .ToListAsync(ct);
        var tagIds = rules.SelectMany(rule => new[] { rule.SourceTagId, rule.DerivedTagId })
            .Distinct()
            .ToArray();
        var tagNames = await db.Set<Tag>().AsNoTracking()
            .Where(tag => tagIds.Contains(tag.Id))
            .ToDictionaryAsync(tag => tag.Id, tag => tag.Name, ct);

        var planNodes = new Dictionary<string, PlanNode>(StringComparer.Ordinal);
        var nodesById = new Dictionary<Guid, PlanNode>();
        var slotsByItem = slotRows
            .GroupBy(slot => slot.ItemId)
            .ToDictionary(
                group => group.Key,
                group => (IReadOnlyDictionary<Guid, int>)group.ToDictionary(
                    slot => slot.SlotDefinitionId,
                    slot => slot.PerformerId));
        foreach (var node in nodeRows)
        {
            if (!items.TryGetValue(node.ItemId!.Value, out var item)) continue;
            Segment? nativeSegment = null;
            if (item.NativeSegmentId is int nativeId
                && !nativeSegments.TryGetValue(nativeId, out nativeSegment))
                continue;
            var planNode = new PlanNode(
                $"node:{node.Id}",
                node.Id,
                item.Id,
                nativeSegment is not null ? nativeSegment.TagId!.Value : node.LastKnownTagId!.Value,
                nativeSegment is not null ? nativeSegment.StartSec : node.LastKnownStartSec!.Value,
                nativeSegment is not null ? nativeSegment.EndSec : node.LastKnownEndSec,
                slotsByItem.GetValueOrDefault(item.Id) ?? new Dictionary<Guid, int>(),
                nativeSegment is not null ? nativeSegment.SourceKey : item.SourceKey,
                nativeSegment is not null ? nativeSegment.SourceRunId : item.SourceRunId,
                nativeSegment is not null ? nativeSegment.Confidence : item.Confidence);
            planNodes[planNode.Token] = planNode;
            nodesById[node.Id] = planNode;
        }

        var incomingNodeIds = edges
            .Where(edge => nodesById.ContainsKey(edge.SourceNodeId))
            .Select(edge => edge.DerivedNodeId)
            .ToHashSet();
        var roots = nodesById.Values
            .Where(node => node.NodeId is Guid nodeId && !incomingNodeIds.Contains(nodeId))
            .Where(node => node.ItemId is long itemId
                && items.TryGetValue(itemId, out var item)
                && ((item.NativeSegmentId is int nativeId && nativeSegments.ContainsKey(nativeId))
                    || item.ReviewState == "approved"))
            .OrderBy(node => node.StartSec)
            .ThenBy(node => node.ItemId)
            .ToArray();
        var rulesBySource = rules.GroupBy(rule => rule.SourceTagId)
            .ToDictionary(group => group.Key, group => group.ToArray());
        var rulesById = rules.ToDictionary(rule => rule.Id);
        var existingEdges = edges
            .Where(edge => rulesById.ContainsKey(edge.RuleId)
                && nodesById.ContainsKey(edge.SourceNodeId)
                && nodesById.ContainsKey(edge.DerivedNodeId))
            .GroupBy(edge => (edge.SourceNodeId, edge.RuleId))
            .ToDictionary(group => group.Key, group => group.OrderBy(edge => edge.Id).ToArray());
        var targetsBySignature = nodesById.Values
            .Where(node => node.ItemId is long itemId
                && items.TryGetValue(itemId, out var item)
                && item.NativeSegmentId is null)
            .GroupBy(OutputSignature)
            .ToDictionary(group => group.Key, group => group.OrderBy(node => node.ItemId).First());
        var actions = new List<PlanAction>();
        var outcomes = new List<string>();
        var processed = new HashSet<(string Token, Guid RuleId)>();
        var alreadyMaterialized = 0;
        var conflictCount = 0;

        void Traverse(PlanNode source, PlanNode root, int depth)
        {
            if (depth >= maxDepth || !rulesBySource.TryGetValue(source.TagId, out var applicable))
                return;
            foreach (var rule in applicable)
            {
                if (!processed.Add((source.Token, rule.Id))) continue;
                if (processed.Count > MaxVisitedRuleApplications)
                    throw new LineageConflictException(
                        "LINEAGE_PLAN_TOO_LARGE",
                        "Derived segment preview exceeded its safe traversal limit.");
                var nextDepth = depth + 1;
                var assignments = ApplySlotMappings(
                    source.Assignments,
                    DerivationRuleManagementService.ParseMappings(rule.MetadataJson));
                var candidate = new PlanNode(
                    "",
                    null,
                    null,
                    rule.DerivedTagId,
                    source.StartSec,
                    source.EndSec,
                    assignments,
                    source.SourceKey,
                    source.SourceRunId,
                    source.Confidence);
                var signature = OutputSignature(candidate);
                if (source.NodeId is Guid sourceNodeId
                    && existingEdges.TryGetValue((sourceNodeId, rule.Id), out var outgoing))
                {
                    if (outgoing.Length != 1
                        || !nodesById.TryGetValue(outgoing[0].DerivedNodeId, out var existingTarget)
                        || OutputSignature(existingTarget) != signature)
                    {
                        conflictCount++;
                        outcomes.Add($"{SourceStateSignature(source)}|{rule.Id}|conflict|{nextDepth}|{signature}");
                        continue;
                    }
                    alreadyMaterialized++;
                    outcomes.Add($"{SourceStateSignature(source)}|{rule.Id}|{existingTarget.Token}|already|{nextDepth}|{signature}");
                    Traverse(existingTarget, root, nextDepth);
                    continue;
                }

                if (!targetsBySignature.TryGetValue(signature, out var target))
                {
                    var token = $"planned:{Hash(signature)}";
                    target = candidate with { Token = token };
                    targetsBySignature[signature] = target;
                    planNodes[token] = target;
                    actions.Add(new(root.Token, source.Token, token, rule, nextDepth, "create"));
                    outcomes.Add($"{SourceStateSignature(source)}|{rule.Id}|{token}|create|{nextDepth}");
                }
                else
                {
                    actions.Add(new(root.Token, source.Token, target.Token, rule, nextDepth, "link"));
                    outcomes.Add($"{SourceStateSignature(source)}|{rule.Id}|{target.Token}|link|{nextDepth}");
                }
                if (actions.Count > MaxPlannedActions)
                    throw new LineageConflictException(
                        "LINEAGE_PLAN_TOO_LARGE",
                        "Derived segment preview exceeded its safe output limit.");
                Traverse(target, root, nextDepth);
            }
        }

        foreach (var root in roots) Traverse(root, root, 0);
        var fingerprint = Hash(JsonSerializer.Serialize(new
        {
            videoId,
            maxDepth,
            roots = roots.Select(root => new
            {
                root.Token,
                state = SourceStateSignature(root),
            }),
            outcomes,
        }));
        return new(
            planNodes, actions, fingerprint, roots.Length, alreadyMaterialized, conflictCount, tagNames);
    }

    private static DerivedSegmentMaterializationPreview ToPreview(MaterializationPlan plan) =>
        new(
            plan.Fingerprint,
            plan.SourceCount,
            plan.Actions.Count(action => action.Action == "create"),
            plan.Actions.Count(action => action.Action == "link"),
            plan.AlreadyMaterializedCount,
            plan.ConflictCount,
            plan.Actions.Select(action =>
            {
                var root = plan.Nodes[action.RootToken];
                return new DerivedSegmentMaterializationOutput(
                    action.Rule.Id,
                    root.ItemId ?? 0,
                    plan.TagNames.GetValueOrDefault(root.TagId) ?? $"Tag {root.TagId}",
                    root.StartSec,
                    plan.TagNames.GetValueOrDefault(action.Rule.SourceTagId) ?? $"Tag {action.Rule.SourceTagId}",
                    plan.TagNames.GetValueOrDefault(action.Rule.DerivedTagId) ?? $"Tag {action.Rule.DerivedTagId}",
                    action.Depth,
                    action.Action);
            }).ToArray());

    private static Dictionary<Guid, int> ApplySlotMappings(
        IReadOnlyDictionary<Guid, int> assignments,
        IReadOnlyList<DerivationRuleSlotMappingRequest> mappings)
    {
        var mapped = new Dictionary<Guid, int>();
        foreach (var mapping in mappings)
        {
            if (assignments.TryGetValue(mapping.SourceSlotDefinitionId, out var performerId))
                mapped[mapping.DerivedSlotDefinitionId] = performerId;
        }
        return mapped;
    }

    private static string OutputSignature(PlanNode node) =>
        $"{node.TagId}|{node.StartSec:R}|{node.EndSec?.ToString("R") ?? "open"}|"
        + string.Join(",", node.Assignments.OrderBy(assignment => assignment.Key)
            .Select(assignment => $"{assignment.Key}:{assignment.Value}"));

    private static string SourceStateSignature(PlanNode node) =>
        $"{node.Token}|{OutputSignature(node)}|{node.SourceKey}|{node.SourceRunId}|{node.Confidence?.ToString("R")}";

    private static int NormalizeDepth(int maxDepth) => Math.Clamp(maxDepth, 1, 10);

    private static string Hash(string value) =>
        Convert.ToHexString(SHA256.HashData(Encoding.UTF8.GetBytes(value)));

    private static async Task<DerivedSegmentMaterializationResult?> ReplayAsync(
        DbContext db,
        Guid operationId,
        string requestFingerprint,
        int? actorUserId,
        CancellationToken ct)
    {
        var receipt = await db.Set<SegmentStudioSegmentOperation>().AsNoTracking()
            .SingleOrDefaultAsync(operation => operation.OperationId == operationId, ct);
        if (receipt is null) return null;
        if (receipt.Kind != "materialize-derived"
            || receipt.RequestFingerprint != requestFingerprint
            || receipt.ActorUserId != actorUserId)
            throw new LineageConflictException(
                "LINEAGE_COMPONENT_CHANGED",
                "The operation ID was already used for another request.");
        return JsonSerializer.Deserialize<DerivedSegmentMaterializationResult>(
            receipt.ResultPayloadJson!)!;
    }

    private static Task AcquireOperationLockAsync(
        DbContext db,
        Guid operationId,
        CancellationToken ct) =>
        db.Database.ProviderName?.Contains("Npgsql", StringComparison.Ordinal) == true
            ? db.Database.ExecuteSqlInterpolatedAsync(
                $"SELECT pg_advisory_xact_lock(hashtextextended({"segment-studio:operation:" + operationId}, 0))",
                ct)
            : Task.CompletedTask;

    private sealed record PlanNode(
        string Token,
        Guid? NodeId,
        long? ItemId,
        int TagId,
        double StartSec,
        double? EndSec,
        IReadOnlyDictionary<Guid, int> Assignments,
        string? SourceKey,
        string? SourceRunId,
        float? Confidence);

    private sealed record PlanAction(
        string RootToken,
        string SourceToken,
        string TargetToken,
        SegmentStudioDerivationRule Rule,
        int Depth,
        string Action);

    private sealed record MaterializationPlan(
        IReadOnlyDictionary<string, PlanNode> Nodes,
        IReadOnlyList<PlanAction> Actions,
        string Fingerprint,
        int SourceCount,
        int AlreadyMaterializedCount,
        int ConflictCount,
        IReadOnlyDictionary<int, string> TagNames);
}
