using System.Security.Cryptography;
using System.Text;
using System.Text.Json;
using Cove.Core.Auth;
using Cove.Core.Entities;
using Microsoft.EntityFrameworkCore;

namespace SegmentStudio;

public sealed record DerivationRuleDeletePreview(
    Guid RuleId,
    string Fingerprint,
    int RemovedEdgeCount,
    int DeletedSegmentCount,
    int RetainedSharedSegmentCount,
    int AffectedVideoCount);

public sealed record DerivationRuleDeleteRequest(
    Guid OperationId,
    string Fingerprint);

public sealed record DerivationRuleDeleteResult(
    int RemovedEdgeCount,
    int DeletedSegmentCount,
    int RetainedSharedSegmentCount,
    int AffectedVideoCount,
    bool Replayed = false);

public sealed record DerivationRuleMaterializationPreview(
    Guid RuleId,
    string Fingerprint,
    int SourceCount,
    int CreateCount,
    int LinkCount,
    int AlreadyMaterializedCount);

public sealed record DerivationRuleMaterializationRequest(
    Guid OperationId,
    string Fingerprint);

public sealed record DerivationRuleMaterializationResult(
    int CreatedCount,
    int LinkedCount,
    int AlreadyMaterializedCount,
    bool Replayed = false);

public static class DerivationRuleLifecycleService
{
    private const int MaximumPlannedActions = 20_000;

    public static async Task<DerivationRuleDeletePreview> PreviewDeleteAsync(
        DbContext db,
        Guid ruleId,
        CancellationToken ct)
    {
        var plan = await BuildDeletePlanAsync(db, ruleId, ct);
        return ToDeletePreview(plan);
    }

    public static async Task<DerivationRuleDeletePreview> PreviewDeleteAsync(
        DbContext db,
        Guid ruleId,
        CovePrincipal? principal,
        IAuthorizationService authorization,
        CancellationToken ct)
    {
        var plan = await BuildDeletePlanAsync(db, ruleId, ct);
        await EnsureVideoAccessAsync(
            plan.AffectedVideoIds, Permissions.SegmentsDelete, principal, authorization, ct);
        return ToDeletePreview(plan);
    }

    public static Task<DerivationRuleDeleteResult> DeleteAsync(
        DbContext db,
        Guid ruleId,
        DerivationRuleDeleteRequest request,
        CancellationToken ct) =>
        DeleteCoreAsync(db, ruleId, request, actorUserId: null, ct);

    private static async Task<DerivationRuleDeleteResult> DeleteCoreAsync(
        DbContext db,
        Guid ruleId,
        DerivationRuleDeleteRequest request,
        int? actorUserId,
        CancellationToken ct)
    {
        ValidateOperation(request.OperationId, request.Fingerprint);
        var requestFingerprint = Hash($"delete-rule|{ruleId}|{request.Fingerprint}");
        var replay = await ReplayDeleteAsync(
            db, request.OperationId, requestFingerprint, actorUserId, ct);
        if (replay is not null) return replay with { Replayed = true };

        var strategy = db.Database.CreateExecutionStrategy();
        return await strategy.ExecuteAsync(async () =>
        {
            db.ChangeTracker.Clear();
            await using var transaction = db.Database.IsRelational()
                && db.Database.CurrentTransaction is null
                ? await db.Database.BeginTransactionAsync(ct)
                : null;
            await SegmentStudioRolloutService.EnsureWritesEnabledAsync(db, ct);
            await DerivationRuleIntegrityService.AcquireMutationLockAsync(db, ct);
            replay = await ReplayDeleteAsync(
                db, request.OperationId, requestFingerprint, actorUserId, ct);
            if (replay is not null)
            {
                if (transaction is not null) await transaction.CommitAsync(ct);
                return replay with { Replayed = true };
            }

            await DerivationRuleIntegrityService.AcquireRuleWriteLockAsync(db, ruleId, ct);
            var plan = await BuildDeletePlanAsync(db, ruleId, ct);
            EnsureFingerprint(plan.Fingerprint, request.Fingerprint);
            var result = await ApplyDeletePlanAsync(db, plan, ct);
            db.Add(new SegmentStudioSegmentOperation
            {
                OperationId = request.OperationId,
                Kind = "derivation-rule-delete",
                ActorUserId = actorUserId,
                RequestFingerprint = requestFingerprint,
                ComponentFingerprint = VideoScope(plan.AffectedVideoIds),
                ResultPayloadJson = JsonSerializer.Serialize(result),
                CreatedAt = DateTime.UtcNow,
            });
            await db.SaveChangesAsync(ct);
            if (transaction is not null) await transaction.CommitAsync(ct);
            return result;
        });
    }

    public static async Task<DerivationRuleDeleteResult> DeleteAsync(
        DbContext db,
        Guid ruleId,
        DerivationRuleDeleteRequest request,
        CovePrincipal? principal,
        IAuthorizationService authorization,
        CancellationToken ct)
    {
        ValidateOperation(request.OperationId, request.Fingerprint);
        var requestFingerprint = Hash($"delete-rule|{ruleId}|{request.Fingerprint}");
        var actorUserId = principal?.UserId;
        var replay = await ReplayDeleteAsync(
            db, request.OperationId, requestFingerprint, actorUserId, ct);
        if (replay is not null)
        {
            await EnsureReplayVideoAccessAsync(
                db, request.OperationId, Permissions.SegmentsDelete, principal, authorization, ct);
            return replay with { Replayed = true };
        }
        var plan = await BuildDeletePlanAsync(db, ruleId, ct);
        EnsureFingerprint(plan.Fingerprint, request.Fingerprint);
        await EnsureVideoAccessAsync(
            plan.AffectedVideoIds, Permissions.SegmentsDelete, principal, authorization, ct);
        return await DeleteCoreAsync(db, ruleId, request, actorUserId, ct);
    }

    internal static async Task<DerivationRuleDeleteResult> ApplyCleanupAsync(
        DbContext db,
        Guid ruleId,
        string fingerprint,
        bool deleteRule,
        CancellationToken ct)
    {
        await DerivationRuleIntegrityService.AcquireRuleWriteLockAsync(db, ruleId, ct);
        var plan = await BuildDeletePlanAsync(db, ruleId, ct);
        EnsureFingerprint(plan.Fingerprint, fingerprint);
        return await ApplyDeletePlanAsync(db, plan, ct, deleteRule);
    }

    public static async Task<DerivationRuleMaterializationPreview> PreviewMaterializationAsync(
        DbContext db,
        Guid ruleId,
        CancellationToken ct)
    {
        var plan = await BuildMaterializationPlanAsync(db, ruleId, ct);
        return ToMaterializationPreview(plan);
    }

    public static async Task<DerivationRuleMaterializationPreview> PreviewMaterializationAsync(
        DbContext db,
        Guid ruleId,
        CovePrincipal? principal,
        IAuthorizationService authorization,
        CancellationToken ct)
    {
        var plan = await BuildMaterializationPlanAsync(db, ruleId, ct);
        await EnsureVideoAccessAsync(
            plan.AffectedVideoIds, Permissions.SegmentsRead, principal, authorization, ct);
        return ToMaterializationPreview(plan);
    }

    public static async Task<DerivationRuleMaterializationResult> MaterializeAsync(
        DbContext db,
        Guid ruleId,
        DerivationRuleMaterializationRequest request,
        int? actorUserId,
        CancellationToken ct)
    {
        ValidateOperation(request.OperationId, request.Fingerprint);
        var requestFingerprint = Hash($"materialize-rule|{ruleId}|{request.Fingerprint}");
        var replay = await ReplayMaterializationAsync(
            db, request.OperationId, requestFingerprint, actorUserId, ct);
        if (replay is not null) return replay with { Replayed = true };

        var strategy = db.Database.CreateExecutionStrategy();
        return await strategy.ExecuteAsync(async () =>
        {
            db.ChangeTracker.Clear();
            await using var transaction = db.Database.IsRelational()
                && db.Database.CurrentTransaction is null
                ? await db.Database.BeginTransactionAsync(ct)
                : null;
            await SegmentStudioRolloutService.EnsureWritesEnabledAsync(db, ct);
            await DerivationRuleIntegrityService.AcquireMutationLockAsync(db, ct);
            replay = await ReplayMaterializationAsync(
                db, request.OperationId, requestFingerprint, actorUserId, ct);
            if (replay is not null)
            {
                if (transaction is not null) await transaction.CommitAsync(ct);
                return replay with { Replayed = true };
            }

            var plan = await BuildMaterializationPlanAsync(db, ruleId, ct);
            EnsureFingerprint(plan.Fingerprint, request.Fingerprint);
            var result = await ApplyMaterializationPlanAsync(db, plan, ct);
            db.Add(new SegmentStudioSegmentOperation
            {
                OperationId = request.OperationId,
                Kind = "derivation-rule-materialize",
                ActorUserId = actorUserId,
                RequestFingerprint = requestFingerprint,
                ComponentFingerprint = VideoScope(plan.AffectedVideoIds),
                ResultPayloadJson = JsonSerializer.Serialize(result),
                CreatedAt = DateTime.UtcNow,
            });
            await db.SaveChangesAsync(ct);
            if (transaction is not null) await transaction.CommitAsync(ct);
            return result;
        });
    }

    public static async Task<DerivationRuleMaterializationResult> MaterializeAsync(
        DbContext db,
        Guid ruleId,
        DerivationRuleMaterializationRequest request,
        int? actorUserId,
        CovePrincipal? principal,
        IAuthorizationService authorization,
        CancellationToken ct)
    {
        ValidateOperation(request.OperationId, request.Fingerprint);
        var requestFingerprint = Hash($"materialize-rule|{ruleId}|{request.Fingerprint}");
        var replay = await ReplayMaterializationAsync(
            db, request.OperationId, requestFingerprint, actorUserId, ct);
        if (replay is not null)
        {
            await EnsureReplayVideoAccessAsync(
                db, request.OperationId, Permissions.SegmentsWrite, principal, authorization, ct);
            return replay with { Replayed = true };
        }
        var plan = await BuildMaterializationPlanAsync(db, ruleId, ct);
        EnsureFingerprint(plan.Fingerprint, request.Fingerprint);
        await EnsureVideoAccessAsync(
            plan.AffectedVideoIds, Permissions.SegmentsWrite, principal, authorization, ct);
        return await MaterializeAsync(db, ruleId, request, actorUserId, ct);
    }

    private static async Task<DeletePlan> BuildDeletePlanAsync(
        DbContext db,
        Guid ruleId,
        CancellationToken ct)
    {
        var rule = await db.Set<SegmentStudioDerivationRule>().AsNoTracking()
            .SingleOrDefaultAsync(candidate => candidate.Id == ruleId, ct)
            ?? throw new KeyNotFoundException("Derivation rule was not found.");
        var edges = await db.Set<SegmentStudioDerivationEdge>().AsNoTracking()
            .OrderBy(edge => edge.Id)
            .ToListAsync(ct);
        var directEdges = edges.Where(edge => edge.RuleId == ruleId).ToArray();
        var dependencyPlan = DerivationDependencyPlanner.ForRemovedEdges(
            edges,
            directEdges.Select(edge => edge.Id));
        var removedEdgeIds = dependencyPlan.RemovedEdgeIds;
        var deletedNodeIds = dependencyPlan.DeletedNodeIds;

        var removedEdges = edges.Where(edge => removedEdgeIds.Contains(edge.Id)).ToArray();
        var nodes = deletedNodeIds.Count == 0
            ? []
            : await db.Set<SegmentStudioLineageNode>().AsNoTracking()
                .Where(node => deletedNodeIds.Contains(node.Id))
                .OrderBy(node => node.Id)
                .ToListAsync(ct);
        var itemIds = nodes.Where(node => node.ItemId is not null)
            .Select(node => node.ItemId!.Value)
            .Distinct()
            .ToArray();
        var items = itemIds.Length == 0
            ? []
            : await db.Set<SegmentStudioItem>().AsNoTracking()
                .Where(item => itemIds.Contains(item.Id))
                .OrderBy(item => item.Id)
                .ToListAsync(ct);
        var affectedNodeIds = removedEdges
            .SelectMany(edge => new[] { edge.SourceNodeId, edge.DerivedNodeId })
            .Concat(deletedNodeIds)
            .Distinct()
            .ToArray();
        var affectedNodes = affectedNodeIds.Length == 0
            ? []
            : await db.Set<SegmentStudioLineageNode>().AsNoTracking()
                .Where(node => affectedNodeIds.Contains(node.Id))
                .OrderBy(node => node.Id)
                .ToListAsync(ct);
        var retainedShared = dependencyPlan.RetainedSharedNodeCount;
        var affectedVideos = affectedNodes.Select(node => node.LastKnownVideoId)
            .Concat(items.Where(item => item.VideoId is not null).Select(item => item.VideoId!.Value))
            .Distinct()
            .Order()
            .ToArray();
        var maintenanceNodeIds = affectedNodeIds
            .Where(nodeId => !deletedNodeIds.Contains(nodeId))
            .ToArray();
        var fingerprint = Hash(JsonSerializer.Serialize(new
        {
            rule = new
            {
                rule.Id,
                rule.Key,
                rule.Version,
                rule.SourceTagId,
                rule.DerivedTagId,
                rule.UpdatedAt,
            },
            removedEdges = removedEdges.Select(edge => new
            {
                edge.Id,
                edge.SourceNodeId,
                edge.DerivedNodeId,
                edge.RuleId,
                edge.UpdatedAt,
            }),
            affectedNodes = affectedNodes.Select(node => new
            {
                node.Id,
                node.ItemId,
                node.LastKnownVideoId,
                node.UpdatedAt,
            }),
            deletedNodes = nodes.Select(node => new
            {
                node.Id,
                node.ItemId,
                node.UpdatedAt,
            }),
            items = items.Select(item => new
            {
                item.Id,
                item.Revision,
                item.UpdatedAt,
            }),
        }));
        return new(
            rule,
            removedEdges,
            nodes,
            items,
            retainedShared,
            affectedVideos,
            maintenanceNodeIds,
            fingerprint);
    }

    private static async Task<DerivationRuleDeleteResult> ApplyDeletePlanAsync(
        DbContext db,
        DeletePlan plan,
        CancellationToken ct,
        bool deleteRule = true)
    {
        var edgeIds = plan.Edges.Select(edge => edge.Id).ToArray();
        var nodeIds = plan.Nodes.Select(node => node.Id).ToArray();
        var itemIds = plan.Items.Select(item => item.Id).ToArray();

        if (db.Model.FindEntityType(typeof(SegmentStudioLineageIssue)) is not null
            && (edgeIds.Length > 0 || nodeIds.Length > 0))
        {
            var issues = await db.Set<SegmentStudioLineageIssue>()
                .Where(issue =>
                    issue.EdgeId != null && edgeIds.Contains(issue.EdgeId.Value)
                    || issue.LineageNodeId != null && nodeIds.Contains(issue.LineageNodeId.Value))
                .ToListAsync(ct);
            db.RemoveRange(issues);
        }
        if (db.Model.FindEntityType(typeof(SegmentStudioSegmentProvenance)) is not null
            && nodeIds.Length > 0)
        {
            db.RemoveRange(await db.Set<SegmentStudioSegmentProvenance>()
                .Where(assertion => nodeIds.Contains(assertion.LineageNodeId))
                .ToListAsync(ct));
        }
        if (db.Model.FindEntityType(typeof(SegmentStudioIncorrectExample)) is not null
            && itemIds.Length > 0)
        {
            db.RemoveRange(await db.Set<SegmentStudioIncorrectExample>()
                .Where(example => example.ItemId != null
                    && itemIds.Contains(example.ItemId.Value))
                .ToListAsync(ct));
        }
        if (db.Model.FindEntityType(typeof(SegmentStudioHistorySession)) is not null
            && plan.AffectedVideoIds.Count > 0)
        {
            db.RemoveRange(await db.Set<SegmentStudioHistorySession>()
                .Where(session => plan.AffectedVideoIds.Contains(session.VideoId))
                .ToListAsync(ct));
        }

        if (edgeIds.Length > 0)
            db.RemoveRange(await db.Set<SegmentStudioDerivationEdge>()
                .Where(edge => edgeIds.Contains(edge.Id))
                .ToListAsync(ct));
        if (nodeIds.Length > 0)
            db.RemoveRange(await db.Set<SegmentStudioLineageNode>()
                .Where(node => nodeIds.Contains(node.Id))
                .ToListAsync(ct));

        var nativeIds = plan.Items.Where(item => item.NativeSegmentId is not null)
            .Select(item => item.NativeSegmentId!.Value)
            .Distinct()
            .ToArray();
        if (nativeIds.Length > 0 && db.Model.FindEntityType(typeof(Segment)) is not null)
        {
            db.RemoveRange(await db.Set<Segment>()
                .Where(segment => nativeIds.Contains(segment.Id))
                .ToListAsync(ct));
        }
        var ownedIds = plan.Items.Where(item => item.NativeSegmentId is null)
            .Select(item => item.Id)
            .ToArray();
        if (ownedIds.Length > 0)
            db.RemoveRange(await db.Set<SegmentStudioItem>()
                .Where(item => ownedIds.Contains(item.Id))
                .ToListAsync(ct));
        if (deleteRule)
        {
            var rule = await db.Set<SegmentStudioDerivationRule>()
                .SingleAsync(candidate => candidate.Id == plan.Rule.Id, ct);
            db.Remove(rule);
        }
        await db.SaveChangesAsync(ct);
        if (db.Model.FindEntityType(typeof(SegmentStudioSegmentProvenance)) is not null
            && plan.MaintenanceNodeIds.Count > 0)
            await DerivationGraphService.RetireUnsupportedInheritedAssertionsAsync(
                db, plan.MaintenanceNodeIds, ct);
        return new(
            plan.Edges.Count,
            plan.Items.Count,
            plan.RetainedSharedSegmentCount,
            plan.AffectedVideoIds.Count);
    }

    private static async Task<MaterializationPlan> BuildMaterializationPlanAsync(
        DbContext db,
        Guid ruleId,
        CancellationToken ct)
    {
        var rule = await db.Set<SegmentStudioDerivationRule>().AsNoTracking()
            .SingleOrDefaultAsync(candidate => candidate.Id == ruleId, ct)
            ?? throw new KeyNotFoundException("Derivation rule was not found.");
        var nodes = await db.Set<SegmentStudioLineageNode>().AsNoTracking()
            .Where(node => node.State == "live" && node.ItemId != null)
            .OrderBy(node => node.Id)
            .ToListAsync(ct);
        var itemIds = nodes.Select(node => node.ItemId!.Value).Distinct().ToArray();
        var items = await db.Set<SegmentStudioItem>().AsNoTracking()
            .Where(item => itemIds.Contains(item.Id))
            .ToDictionaryAsync(item => item.Id, ct);
        var edges = await db.Set<SegmentStudioDerivationEdge>().AsNoTracking()
            .OrderBy(edge => edge.Id)
            .ToListAsync(ct);
        var incomingNodeIds = edges.Select(edge => edge.DerivedNodeId).ToHashSet();
        var sourceNodes = nodes
            .Where(node => node.LastKnownTagId == rule.SourceTagId)
            .Where(node => items.TryGetValue(node.ItemId!.Value, out var item)
                && (item.NativeSegmentId is not null
                    || item.ReviewState == "approved"
                    || incomingNodeIds.Contains(node.Id)))
            .ToArray();
        var relevantItemIds = sourceNodes.Select(node => node.ItemId!.Value)
            .Concat(nodes.Where(node => node.LastKnownTagId == rule.DerivedTagId)
                .Select(node => node.ItemId!.Value))
            .Distinct()
            .ToArray();
        var slots = db.Model.FindEntityType(typeof(SegmentStudioSegmentSlot)) is null
            ? []
            : await db.Set<SegmentStudioSegmentSlot>().AsNoTracking()
                .Where(slot => relevantItemIds.Contains(slot.ItemId))
                .ToListAsync(ct);
        var assignmentsByItem = slots.GroupBy(slot => slot.ItemId)
            .ToDictionary(
                group => group.Key,
                group => (IReadOnlyDictionary<Guid, int>)group.ToDictionary(
                    slot => slot.SlotDefinitionId,
                    slot => slot.PerformerId));
        var mappings = DerivationRuleManagementService.ParseMappings(rule.MetadataJson);
        var existingRuleSources = edges.Where(edge => edge.RuleId == rule.Id)
            .Select(edge => edge.SourceNodeId)
            .ToHashSet();
        var targetsBySignature = nodes
            .Where(node => node.LastKnownTagId == rule.DerivedTagId)
            .Where(node => items.TryGetValue(node.ItemId!.Value, out var item)
                && item.NativeSegmentId is null)
            .GroupBy(node => NodeSignature(
                node.LastKnownVideoId,
                rule.DerivedTagId,
                node.LastKnownStartSec,
                node.LastKnownEndSec,
                assignmentsByItem.GetValueOrDefault(node.ItemId!.Value)
                    ?? new Dictionary<Guid, int>()))
            .ToDictionary(
                group => group.Key,
                group => $"existing:{group.OrderBy(node => node.Id).First().Id}");
        var actions = new List<MaterializationAction>();
        var already = 0;
        foreach (var source in sourceNodes)
        {
            if (existingRuleSources.Contains(source.Id))
            {
                already++;
                continue;
            }
            var sourceItem = items[source.ItemId!.Value];
            var mapped = ApplySlotMappings(
                assignmentsByItem.GetValueOrDefault(sourceItem.Id)
                    ?? new Dictionary<Guid, int>(),
                mappings);
            var signature = NodeSignature(
                source.LastKnownVideoId,
                rule.DerivedTagId,
                source.LastKnownStartSec,
                source.LastKnownEndSec,
                mapped);
            if (!targetsBySignature.TryGetValue(signature, out var targetToken))
            {
                targetToken = $"planned:{Hash(signature)}";
                targetsBySignature[signature] = targetToken;
            }
            actions.Add(new(source, sourceItem, targetToken, mapped));
            if (actions.Count > MaximumPlannedActions)
                throw new LineageConflictException(
                    "LINEAGE_PLAN_TOO_LARGE",
                    "Rule materialization exceeded its safe output limit.");
        }

        var sources = sourceNodes.Select(source => new
        {
            sourceNodeId = source.Id,
            sourceItemId = source.ItemId,
            source.LastKnownVideoId,
            source.UpdatedAt,
        }).ToArray();
        var outcomes = actions.Select(action => new
        {
            sourceNodeId = action.SourceNode.Id,
            sourceItemId = action.SourceItem.Id,
            sourceRevision = action.SourceItem.Revision,
            sourceUpdatedAt = action.SourceItem.UpdatedAt,
            action.TargetToken,
            assignments = action.Assignments.OrderBy(assignment => assignment.Key),
        }).ToArray();
        var fingerprint = Hash(JsonSerializer.Serialize(new
        {
            rule = new
            {
                rule.Id,
                rule.Version,
                rule.SourceTagId,
                rule.DerivedTagId,
                rule.MetadataJson,
                rule.UpdatedAt,
            },
            sources,
            outcomes,
            already,
        }));
        return new(
            rule,
            sourceNodes.Length,
            already,
            sourceNodes.Select(node => node.LastKnownVideoId).Distinct().Order().ToArray(),
            actions,
            fingerprint);
    }

    private static async Task<DerivationRuleMaterializationResult> ApplyMaterializationPlanAsync(
        DbContext db,
        MaterializationPlan plan,
        CancellationToken ct)
    {
        var nodeIdsByToken = plan.Actions
            .Where(action => action.TargetToken.StartsWith("existing:", StringComparison.Ordinal))
            .Select(action => action.TargetToken)
            .Distinct()
            .ToDictionary(
                token => token,
                token => Guid.Parse(token["existing:".Length..]));
        var createdCount = 0;
        var linkedCount = 0;
        var graph = new DerivationGraphService();
        foreach (var action in plan.Actions)
        {
            if (!nodeIdsByToken.TryGetValue(action.TargetToken, out var targetNodeId))
            {
                var now = DateTime.UtcNow;
                var item = new SegmentStudioItem
                {
                    ReviewState = "unreviewed",
                    RepresentationSchemaVersion = 1,
                    VideoId = action.SourceNode.LastKnownVideoId,
                    StartSec = action.SourceNode.LastKnownStartSec,
                    EndSec = action.SourceNode.LastKnownEndSec,
                    TagId = plan.Rule.DerivedTagId,
                    Kind = "tag",
                    SourceKey = action.SourceItem.SourceKey ?? "user",
                    SourceRunId = action.SourceItem.SourceRunId,
                    Confidence = action.SourceItem.Confidence,
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
                    LastKnownVideoId = action.SourceNode.LastKnownVideoId,
                    LastKnownTagId = plan.Rule.DerivedTagId,
                    LastKnownStartSec = action.SourceNode.LastKnownStartSec,
                    LastKnownEndSec = action.SourceNode.LastKnownEndSec,
                    CreatedAt = now,
                    UpdatedAt = now,
                };
                db.Add(node);
                foreach (var assignment in action.Assignments)
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
                targetNodeId = node.Id;
                nodeIdsByToken[action.TargetToken] = targetNodeId;
                createdCount++;
            }
            else
            {
                linkedCount++;
            }

            await graph.CreateEdgeAsync(
                db,
                new DerivationEdgeCreate(
                    action.SourceNode.Id,
                    targetNodeId,
                    plan.Rule.Id,
                    null,
                    DateTime.UtcNow,
                    """{"materializedBy":"segment-studio","scope":"rule"}"""),
                ct);
        }
        // Edge creation copies the source's active provenance and recursively propagates it
        // through existing descendants, so materialization does not need a library-wide sweep.
        return new(createdCount, linkedCount, plan.AlreadyMaterializedCount);
    }

    private static DerivationRuleDeletePreview ToDeletePreview(DeletePlan plan) =>
        new(
            plan.Rule.Id,
            plan.Fingerprint,
            plan.Edges.Count,
            plan.Items.Count,
            plan.RetainedSharedSegmentCount,
            plan.AffectedVideoIds.Count);

    private static DerivationRuleMaterializationPreview ToMaterializationPreview(
        MaterializationPlan plan)
    {
        var createTokens = plan.Actions
            .Where(action => action.TargetToken.StartsWith("planned:", StringComparison.Ordinal))
            .Select(action => action.TargetToken)
            .Distinct()
            .ToHashSet();
        return new(
            plan.Rule.Id,
            plan.Fingerprint,
            plan.SourceCount,
            createTokens.Count,
            plan.Actions.Count - createTokens.Count,
            plan.AlreadyMaterializedCount);
    }

    private static Dictionary<Guid, int> ApplySlotMappings(
        IReadOnlyDictionary<Guid, int> assignments,
        IReadOnlyList<DerivationRuleSlotMappingRequest> mappings)
    {
        var mapped = new Dictionary<Guid, int>();
        foreach (var mapping in mappings)
            if (assignments.TryGetValue(mapping.SourceSlotDefinitionId, out var performerId))
                mapped[mapping.DerivedSlotDefinitionId] = performerId;
        return mapped;
    }

    private static string NodeSignature(
        int videoId,
        int tagId,
        double? startSec,
        double? endSec,
        IReadOnlyDictionary<Guid, int> assignments) =>
        $"{videoId}|{tagId}|{startSec?.ToString("R") ?? "missing"}|"
        + $"{endSec?.ToString("R") ?? "open"}|"
        + string.Join(",", assignments.OrderBy(assignment => assignment.Key)
            .Select(assignment => $"{assignment.Key}:{assignment.Value}"));

    private static void ValidateOperation(Guid operationId, string fingerprint)
    {
        if (operationId == Guid.Empty)
            throw new ArgumentException("Operation ID is required.");
        if (string.IsNullOrWhiteSpace(fingerprint))
            throw new ArgumentException("Preview fingerprint is required.");
    }

    private static void EnsureFingerprint(string current, string requested)
    {
        if (!CryptographicOperations.FixedTimeEquals(
                Encoding.UTF8.GetBytes(current),
                Encoding.UTF8.GetBytes(requested)))
            throw new LineageConflictException(
                "LINEAGE_COMPONENT_CHANGED",
                "Derivation rule inputs changed after preview.");
    }

    private static async Task EnsureVideoAccessAsync(
        IReadOnlyList<int> videoIds,
        string permission,
        CovePrincipal? principal,
        IAuthorizationService authorization,
        CancellationToken ct)
    {
        foreach (var videoId in videoIds)
        {
            var access = await authorization.AuthorizeAsync(
                principal,
                permission,
                EntityRef.Of(EntityKinds.Video, videoId),
                ct);
            if (!access.Allowed)
                throw new LineageConflictException(
                    "LINEAGE_PERMISSION_DENIED",
                    "You cannot change every video affected by this derivation rule.");
        }
    }

    private static async Task EnsureReplayVideoAccessAsync(
        DbContext db,
        Guid operationId,
        string permission,
        CovePrincipal? principal,
        IAuthorizationService authorization,
        CancellationToken ct)
    {
        var scope = await db.Set<SegmentStudioSegmentOperation>().AsNoTracking()
            .Where(operation => operation.OperationId == operationId)
            .Select(operation => operation.ComponentFingerprint)
            .SingleAsync(ct);
        await EnsureVideoAccessAsync(ParseVideoScope(scope), permission, principal, authorization, ct);
    }

    private static string VideoScope(IReadOnlyList<int> videoIds) =>
        $"videos:{string.Join(",", videoIds.Distinct().Order())}";

    private static IReadOnlyList<int> ParseVideoScope(string? scope)
    {
        if (scope?.StartsWith("videos:", StringComparison.Ordinal) != true)
            return [];
        return scope["videos:".Length..]
            .Split(',', StringSplitOptions.RemoveEmptyEntries)
            .Select(value => int.TryParse(value, out var videoId) ? videoId : 0)
            .Where(videoId => videoId > 0)
            .Distinct()
            .Order()
            .ToArray();
    }

    private static async Task<DerivationRuleDeleteResult?> ReplayDeleteAsync(
        DbContext db,
        Guid operationId,
        string requestFingerprint,
        int? actorUserId,
        CancellationToken ct)
    {
        var operation = await db.Set<SegmentStudioSegmentOperation>().AsNoTracking()
            .SingleOrDefaultAsync(candidate => candidate.OperationId == operationId, ct);
        if (operation is null) return null;
        if (operation.Kind != "derivation-rule-delete"
            || operation.RequestFingerprint != requestFingerprint
            || operation.ActorUserId != actorUserId)
            throw new LineageConflictException(
                "LINEAGE_COMPONENT_CHANGED",
                "The operation ID was already used for another request.");
        return JsonSerializer.Deserialize<DerivationRuleDeleteResult>(
            operation.ResultPayloadJson!)!;
    }

    private static async Task<DerivationRuleMaterializationResult?> ReplayMaterializationAsync(
        DbContext db,
        Guid operationId,
        string requestFingerprint,
        int? actorUserId,
        CancellationToken ct)
    {
        var operation = await db.Set<SegmentStudioSegmentOperation>().AsNoTracking()
            .SingleOrDefaultAsync(candidate => candidate.OperationId == operationId, ct);
        if (operation is null) return null;
        if (operation.Kind != "derivation-rule-materialize"
            || operation.RequestFingerprint != requestFingerprint
            || operation.ActorUserId != actorUserId)
            throw new LineageConflictException(
                "LINEAGE_COMPONENT_CHANGED",
                "The operation ID was already used for another request.");
        return JsonSerializer.Deserialize<DerivationRuleMaterializationResult>(
            operation.ResultPayloadJson!)!;
    }

    private static string Hash(string value) =>
        Convert.ToHexString(SHA256.HashData(Encoding.UTF8.GetBytes(value)));

    private sealed record DeletePlan(
        SegmentStudioDerivationRule Rule,
        IReadOnlyList<SegmentStudioDerivationEdge> Edges,
        IReadOnlyList<SegmentStudioLineageNode> Nodes,
        IReadOnlyList<SegmentStudioItem> Items,
        int RetainedSharedSegmentCount,
        IReadOnlyList<int> AffectedVideoIds,
        IReadOnlyList<Guid> MaintenanceNodeIds,
        string Fingerprint);

    private sealed record MaterializationAction(
        SegmentStudioLineageNode SourceNode,
        SegmentStudioItem SourceItem,
        string TargetToken,
        IReadOnlyDictionary<Guid, int> Assignments);

    private sealed record MaterializationPlan(
        SegmentStudioDerivationRule Rule,
        int SourceCount,
        int AlreadyMaterializedCount,
        IReadOnlyList<int> AffectedVideoIds,
        IReadOnlyList<MaterializationAction> Actions,
        string Fingerprint);
}
