using System.Security.Cryptography;
using System.Text;
using System.Text.Json;
using Cove.Core.Auth;
using Cove.Core.Entities;
using Microsoft.EntityFrameworkCore;

namespace SegmentStudio;

public sealed record SegmentDependencyDeletePreviewRequest(long ExpectedRevision);

public sealed record SegmentDependencyDeleteExecuteRequest(
    Guid OperationId,
    string Fingerprint);

public sealed record SegmentDependencyDeletePreview(
    string Fingerprint,
    int SelectedSegmentCount,
    int DependentSegmentCount,
    int DeletedSegmentCount,
    int RemovedEdgeCount,
    int RetainedSharedSegmentCount,
    int AffectedVideoCount,
    int PermissionFailureCount,
    IReadOnlyList<string> IntegrityWarnings,
    bool RequiresTypedConfirmation,
    int ProtectedIncorrectExampleCount = 0,
    int DeferredRejectedSegmentCount = 0);

public sealed record SegmentDependencyDeleteResult(
    int DeletedSegmentCount,
    int DeletedEdgeCount,
    int RetainedSharedSegmentCount,
    int AffectedVideoCount,
    bool Replayed = false);

public interface ISegmentLineageDeletionService
{
    Task<SegmentDependencyDeletePreview> PreviewAsync(
        DbContext db,
        long itemId,
        SegmentDependencyDeletePreviewRequest request,
        CovePrincipal? principal,
        IAuthorizationService authorization,
        CancellationToken ct);

    Task<SegmentDependencyDeleteResult> ExecuteAsync(
        DbContext db,
        long itemId,
        SegmentDependencyDeleteExecuteRequest request,
        CovePrincipal? principal,
        IAuthorizationService authorization,
        CancellationToken ct);

    Task<SegmentDependencyDeletePreview> PreviewRejectedAsync(
        DbContext db,
        int videoId,
        CovePrincipal? principal,
        IAuthorizationService authorization,
        CancellationToken ct);

    Task<SegmentDependencyDeleteResult> ExecuteRejectedAsync(
        DbContext db,
        int videoId,
        SegmentDependencyDeleteExecuteRequest request,
        CovePrincipal? principal,
        IAuthorizationService authorization,
        CancellationToken ct);

    Task<SegmentDependencyDeletePreview> PreviewRepairAsync(
        DbContext db,
        long itemId,
        long expectedRevision,
        CovePrincipal? principal,
        IAuthorizationService authorization,
        CancellationToken ct);

    Task<SegmentDependencyDeleteResult> ExecuteRepairAsync(
        DbContext db,
        long itemId,
        SegmentDependencyDeleteExecuteRequest request,
        CovePrincipal? principal,
        IAuthorizationService authorization,
        CancellationToken ct);
}

public class SegmentLineageDeletionService : ISegmentLineageDeletionService
{
    public async Task<SegmentDependencyDeletePreview> PreviewAsync(
        DbContext db,
        long itemId,
        SegmentDependencyDeletePreviewRequest request,
        CovePrincipal? principal,
        IAuthorizationService authorization,
        CancellationToken ct)
    {
        var selection = await LoadSingleSelectionAsync(db, itemId, ct);
        if (selection.SelectedItems.Single().Revision != request.ExpectedRevision)
            throw Changed();
        EnsureNoProtectedIncorrectExamples(selection);
        var plan = await BuildPlanAsync(db, selection, removeWholeComponent: false, ct);
        return await BuildPreviewAsync(plan, principal, authorization, ct);
    }

    public Task<SegmentDependencyDeleteResult> ExecuteAsync(
        DbContext db,
        long itemId,
        SegmentDependencyDeleteExecuteRequest request,
        CovePrincipal? principal,
        IAuthorizationService authorization,
        CancellationToken ct) =>
        ExecuteWithRetryAsync(
            db,
            DeleteTarget.Single(itemId),
            request,
            principal,
            authorization,
            repairInconsistent: false,
            ct);

    public async Task<SegmentDependencyDeletePreview> PreviewRejectedAsync(
        DbContext db,
        int videoId,
        CovePrincipal? principal,
        IAuthorizationService authorization,
        CancellationToken ct)
    {
        var selection = await LoadRejectedSelectionAsync(db, videoId, ct);
        var plan = await BuildPlanAsync(db, selection, removeWholeComponent: false, ct);
        return await BuildPreviewAsync(plan, principal, authorization, ct);
    }

    public Task<SegmentDependencyDeleteResult> ExecuteRejectedAsync(
        DbContext db,
        int videoId,
        SegmentDependencyDeleteExecuteRequest request,
        CovePrincipal? principal,
        IAuthorizationService authorization,
        CancellationToken ct) =>
        ExecuteWithRetryAsync(
            db,
            DeleteTarget.Rejected(videoId),
            request,
            principal,
            authorization,
            repairInconsistent: false,
            ct);

    public async Task<SegmentDependencyDeletePreview> PreviewRepairAsync(
        DbContext db,
        long itemId,
        long expectedRevision,
        CovePrincipal? principal,
        IAuthorizationService authorization,
        CancellationToken ct)
    {
        var selection = await LoadSingleSelectionAsync(db, itemId, ct);
        if (selection.SelectedItems.Single().Revision != expectedRevision)
            throw Changed();
        EnsureNoProtectedIncorrectExamples(selection);
        var plan = await BuildPlanAsync(db, selection, removeWholeComponent: true, ct);
        return await BuildPreviewAsync(plan, principal, authorization, ct);
    }

    public Task<SegmentDependencyDeleteResult> ExecuteRepairAsync(
        DbContext db,
        long itemId,
        SegmentDependencyDeleteExecuteRequest request,
        CovePrincipal? principal,
        IAuthorizationService authorization,
        CancellationToken ct) =>
        ExecuteWithRetryAsync(
            db,
            DeleteTarget.Repair(itemId),
            request,
            principal,
            authorization,
            repairInconsistent: true,
            ct);

    private async Task<SegmentDependencyDeleteResult> ExecuteWithRetryAsync(
        DbContext db,
        DeleteTarget target,
        SegmentDependencyDeleteExecuteRequest request,
        CovePrincipal? principal,
        IAuthorizationService authorization,
        bool repairInconsistent,
        CancellationToken ct)
    {
        if (db.Database.CurrentTransaction is not null)
            return await ExecuteCoreAsync(
                db, target, request, principal, authorization, repairInconsistent, ct);

        var strategy = db.Database.CreateExecutionStrategy();
        var firstAttempt = true;
        return await strategy.ExecuteAsync(async () =>
        {
            if (!firstAttempt)
                db.ChangeTracker.Clear();
            firstAttempt = false;
            return await ExecuteCoreAsync(
                db, target, request, principal, authorization, repairInconsistent, ct);
        });
    }

    private async Task<SegmentDependencyDeleteResult> ExecuteCoreAsync(
        DbContext db,
        DeleteTarget target,
        SegmentDependencyDeleteExecuteRequest request,
        CovePrincipal? principal,
        IAuthorizationService authorization,
        bool repairInconsistent,
        CancellationToken ct)
    {
        if (request.OperationId == Guid.Empty)
            throw new ArgumentException("Operation ID is required.", nameof(request));
        if (string.IsNullOrWhiteSpace(request.Fingerprint))
            throw new ArgumentException("Deletion fingerprint is required.", nameof(request));
        var actorUserId = principal?.UserId;
        var requestFingerprint = Fingerprint(
            $"{target.OperationKind}|{target.ScopeKey}|{request.Fingerprint}");
        var replay = await ReplayAsync(
            db, request.OperationId, target.OperationKind, requestFingerprint, actorUserId, ct);
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
        replay = await ReplayAsync(
            db, request.OperationId, target.OperationKind, requestFingerprint, actorUserId, ct);
        if (replay is not null)
        {
            if (transaction is not null)
                await transaction.CommitAsync(ct);
            return replay with { Replayed = true };
        }

        await SegmentStudioRolloutService.EnsureWritesEnabledAsync(db, ct);
        await DerivationRuleIntegrityService.AcquireMutationLockAsync(db, ct);
        var initial = await LoadPlanAsync(db, target, ct);
        foreach (var videoId in initial.VideoIds.Order())
            await SegmentStudioReviewLock.AcquireAsync(db, videoId, ct);
        db.ChangeTracker.Clear();
        var plan = await LoadPlanAsync(db, target, ct);
        if (!FixedTimeEquals(plan.Fingerprint, request.Fingerprint))
            throw Changed();
        var preview = await BuildPreviewAsync(plan, principal, authorization, ct);
        if (preview.PermissionFailureCount > 0)
            throw new LineageConflictException(
                "LINEAGE_PERMISSION_DENIED",
                "You cannot delete every affected segment.");
        if (plan.Warnings.Count > 0 && !repairInconsistent)
            throw new LineageConflictException(
                "LINEAGE_COMPONENT_INCONSISTENT",
                "The related derivation data must be repaired before deletion.");

        var result = await ApplyPlanAsync(db, plan, ct);
        db.Add(new SegmentStudioSegmentOperation
        {
            OperationId = request.OperationId,
            Kind = target.OperationKind,
            ActorUserId = actorUserId,
            RequestFingerprint = requestFingerprint,
            ComponentFingerprint = plan.Fingerprint,
            ResultPayloadJson = JsonSerializer.Serialize(result),
            CreatedAt = DateTime.UtcNow,
        });
        if (db.Model.FindEntityType(typeof(SegmentStudioHistorySession)) is not null)
        {
            foreach (var videoId in plan.VideoIds)
                await SegmentStudioHistoryService.ClearVideoAsync(db, videoId, ct);
        }
        await db.SaveChangesAsync(ct);
        await BeforeCommitAsync(db, ct);
        if (transaction is not null)
            await transaction.CommitAsync(ct);
        return result;
    }

    protected virtual Task BeforeCommitAsync(DbContext db, CancellationToken ct) =>
        Task.CompletedTask;

    private static async Task<DeletionPlan> LoadPlanAsync(
        DbContext db,
        DeleteTarget target,
        CancellationToken ct)
    {
        var selection = target.VideoId is int videoId
            ? await LoadRejectedSelectionAsync(db, videoId, ct)
            : await LoadSingleSelectionAsync(db, target.ItemId!.Value, ct);
        if (target.VideoId is null)
            EnsureNoProtectedIncorrectExamples(selection);
        return await BuildPlanAsync(db, selection, target.RemoveWholeComponent, ct);
    }

    private static async Task<Selection> LoadSingleSelectionAsync(
        DbContext db,
        long itemId,
        CancellationToken ct)
    {
        var item = await db.Set<SegmentStudioItem>()
            .AsNoTracking()
            .SingleOrDefaultAsync(candidate => candidate.Id == itemId, ct)
            ?? throw new KeyNotFoundException("Segment Studio item was not found.");
        var selectedNodes = await db.Set<SegmentStudioLineageNode>().AsNoTracking()
            .Where(node => node.ItemId == itemId)
            .ToListAsync(ct);
        var selectedNodeIds = selectedNodes.Select(node => node.Id).ToArray();
        var componentEdges = selectedNodeIds.Length == 0
            ? []
            : await LineageScaleQueries.LoadComponentEdgesAsync(
                db, selectedNodeIds, tracking: false, ct);
        var componentNodeIds = componentEdges
            .SelectMany(edge => new[] { edge.SourceNodeId, edge.DerivedNodeId })
            .Concat(selectedNodeIds)
            .ToHashSet();
        var componentItemIds = componentNodeIds.Count == 0
            ? []
            : await db.Set<SegmentStudioLineageNode>().AsNoTracking()
                .Where(node => componentNodeIds.Contains(node.Id) && node.ItemId != null)
                .Select(node => node.ItemId!.Value)
                .ToListAsync(ct);
        var protectedExamples = await LoadProtectionAsync(
            db,
            componentItemIds.Append(itemId).Distinct().ToArray(),
            ct);
        return new([item], [], 1, $"item:{itemId}", protectedExamples, 0);
    }

    private static async Task<Selection> LoadRejectedSelectionAsync(
        DbContext db,
        int videoId,
        CancellationToken ct)
    {
        if (!await db.Set<Video>().AsNoTracking().AnyAsync(video => video.Id == videoId, ct))
            throw new KeyNotFoundException("Video was not found.");
        var nativeCandidates = await db.Set<Segment>().AsNoTracking()
            .Where(segment =>
                segment.HostType == SegmentHostType.Video
                && segment.HostId == videoId
                && segment.Kind == "tag"
                && segment.TagId != null)
            .ToListAsync(ct);
        var rejectedNative = nativeCandidates
            .Where(segment => DirectSegmentReviewService.ReadReviewState(segment.Payload) == "rejected")
            .ToArray();
        var rejectedOwned = await db.Set<SegmentStudioItem>().AsNoTracking()
            .Where(item =>
                item.NativeSegmentId == null
                && item.VideoId == videoId
                && item.ReviewState == "rejected")
            .ToListAsync(ct);
        var rejectedNativeIds = rejectedNative.Select(segment => segment.Id).ToArray();
        var nativeAnchors = rejectedNativeIds.Length == 0
            ? []
            : await db.Set<SegmentStudioItem>().AsNoTracking()
                .Where(item =>
                    item.NativeSegmentId != null
                    && rejectedNativeIds.Contains(item.NativeSegmentId.Value))
                .ToListAsync(ct);
        var anchoredNativeIds = nativeAnchors
            .Select(item => item.NativeSegmentId!.Value)
            .ToHashSet();
        var looseNative = rejectedNative
            .Where(segment => !anchoredNativeIds.Contains(segment.Id))
            .Select(segment => new NativeState(
                segment.Id,
                segment.HostId,
                segment.UpdatedAt,
                segment.ImageBlobId))
            .ToArray();
        var items = rejectedOwned.Concat(nativeAnchors)
            .GroupBy(item => item.Id)
            .Select(group => group.First())
            .ToArray();
        var candidateItemIds = items.Select(item => item.Id).ToArray();
        var candidateNodes = candidateItemIds.Length == 0
            ? []
            : await db.Set<SegmentStudioLineageNode>().AsNoTracking()
                .Where(node => node.ItemId != null
                    && candidateItemIds.Contains(node.ItemId.Value))
                .ToListAsync(ct);
        var candidateRootNodeIds = candidateNodes.Select(node => node.Id).ToArray();
        var candidateComponentEdges = candidateRootNodeIds.Length == 0
            ? []
            : await LineageScaleQueries.LoadComponentEdgesAsync(
                db, candidateRootNodeIds, tracking: false, ct);
        var candidateComponentNodeIds = candidateComponentEdges
            .SelectMany(edge => new[] { edge.SourceNodeId, edge.DerivedNodeId })
            .Concat(candidateRootNodeIds)
            .ToHashSet();
        var candidateComponentNodes = candidateComponentNodeIds.Count == 0
            ? []
            : await db.Set<SegmentStudioLineageNode>().AsNoTracking()
                .Where(node => candidateComponentNodeIds.Contains(node.Id))
                .ToListAsync(ct);
        var relevantItemIds = candidateComponentNodes
            .Where(node => node.ItemId != null)
            .Select(node => node.ItemId!.Value)
            .Concat(candidateItemIds)
            .Distinct()
            .ToArray();
        var protection = await LoadProtectionAsync(db, relevantItemIds, ct);
        var protectedItemIds = protection.Select(state => state.ItemId).ToHashSet();
        var protectedNodes = candidateComponentNodes
            .Where(node => node.ItemId != null
                && protectedItemIds.Contains(node.ItemId.Value))
            .ToArray();
        var protectedRootNodeIds = protectedNodes.Select(node => node.Id).ToArray();
        var protectedComponentNodeIds = ConnectedNodeIds(
            candidateComponentEdges,
            protectedRootNodeIds);
        var deferredItemIds = candidateNodes
            .Where(node => protectedComponentNodeIds.Contains(node.Id))
            .Select(node => node.ItemId!.Value)
            .Concat(candidateItemIds.Where(protectedItemIds.Contains))
            .ToHashSet();
        var eligibleItems = items
            .Where(item => !deferredItemIds.Contains(item.Id))
            .ToArray();
        return new(
            eligibleItems,
            looseNative,
            eligibleItems.Length + looseNative.Length,
            $"video:{videoId}:rejected",
            protection,
            deferredItemIds.Count);
    }

    private static async Task<DeletionPlan> BuildPlanAsync(
        DbContext db,
        Selection selection,
        bool removeWholeComponent,
        CancellationToken ct)
    {
        if (selection.SelectedSegmentCount == 0
            && selection.DeferredRejectedSegmentCount == 0)
            throw new LineageConflictException(
                "NO_SEGMENTS_SELECTED",
                "There are no rejected segments to delete.");
        if (selection.SelectedSegmentCount == 0)
        {
            var emptyFingerprint = Fingerprint(JsonSerializer.Serialize(new
            {
                selection.ScopeKey,
                protectedIncorrectExamples = selection.ProtectedIncorrectExamples
                    .OrderBy(example => example.Id),
                selection.DeferredRejectedSegmentCount,
            }));
            return new(
                selection,
                [],
                [],
                [],
                [],
                [],
                [],
                [],
                [],
                [],
                0,
                0,
                emptyFingerprint);
        }
        var selectedItemIds = selection.SelectedItems.Select(item => item.Id).ToArray();
        var selectedItems = await db.Set<SegmentStudioItem>()
            .Where(item => selectedItemIds.Contains(item.Id))
            .ToListAsync(ct);
        if (selectedItems.Count != selectedItemIds.Length)
            throw Changed();
        var selectedNodes = await db.Set<SegmentStudioLineageNode>()
            .Where(node => node.ItemId != null && selectedItemIds.Contains(node.ItemId.Value))
            .ToListAsync(ct);
        var selectedNodeIds = selectedNodes.Select(node => node.Id).ToHashSet();
        var componentEdges = selectedNodeIds.Count == 0
            ? []
            : (await LineageScaleQueries.LoadComponentEdgesAsync(
                db, selectedNodeIds, tracking: true, ct)).ToList();
        var componentNodeIds = componentEdges
            .SelectMany(edge => new[] { edge.SourceNodeId, edge.DerivedNodeId })
            .Concat(selectedNodeIds)
            .ToHashSet();
        var componentNodes = componentNodeIds.Count == 0
            ? []
            : await db.Set<SegmentStudioLineageNode>()
                .Where(node => componentNodeIds.Contains(node.Id))
                .ToListAsync(ct);

        DerivationDependencyPlan dependencyPlan;
        if (removeWholeComponent)
        {
            dependencyPlan = new(
                componentNodeIds,
                componentEdges.Select(edge => edge.Id).ToHashSet(),
                0);
        }
        else
        {
            dependencyPlan = DerivationDependencyPlanner.ForDeletedNodes(
                componentEdges,
                selectedNodeIds);
        }

        var removedEdges = componentEdges
            .Where(edge => dependencyPlan.RemovedEdgeIds.Contains(edge.Id))
            .ToArray();
        var deletedNodes = componentNodes
            .Where(node => dependencyPlan.DeletedNodeIds.Contains(node.Id))
            .ToArray();
        var deletedItemIds = deletedNodes
            .Where(node => node.ItemId is not null)
            .Select(node => node.ItemId!.Value)
            .Concat(selectedItemIds)
            .Distinct()
            .ToArray();
        var deletedItems = await db.Set<SegmentStudioItem>()
            .Where(item => deletedItemIds.Contains(item.Id))
            .ToListAsync(ct);
        if ((await LoadProtectionAsync(db, deletedItemIds, ct)).Count > 0)
            throw ProtectedIncorrectExample();
        var nativeIds = deletedItems
            .Where(item => item.NativeSegmentId is not null)
            .Select(item => item.NativeSegmentId!.Value)
            .Concat(selection.LooseNativeSegments.Select(segment => segment.Id))
            .Distinct()
            .ToArray();
        var nativeSegments = nativeIds.Length == 0
            ? []
            : await db.Set<Segment>()
                .Where(segment => nativeIds.Contains(segment.Id))
                .ToListAsync(ct);
        var nativeStates = nativeSegments
            .Select(segment => new NativeState(
                segment.Id,
                segment.HostId,
                segment.UpdatedAt,
                segment.ImageBlobId))
            .ToArray();
        var warnings = new List<string>();
        if (componentNodes.Any(node => node.State != "live" || node.ItemId is null)
            || deletedItems.Count != deletedItemIds.Length
            || nativeSegments.Count != nativeIds.Length)
            warnings.Add("missing-endpoint");
        var componentKey = componentNodeIds.Count == 0
            ? ""
            : Fingerprint(string.Join("|", componentNodeIds.Order()));
        var componentEdgeIds = componentEdges.Select(edge => edge.Id).ToArray();
        var issues = componentNodeIds.Count == 0
            ? []
            : await db.Set<SegmentStudioLineageIssue>().AsNoTracking()
                .Where(issue => issue.ResolvedAt == null
                    && (issue.ComponentKey == componentKey
                        || issue.LineageNodeId != null
                            && componentNodeIds.Contains(issue.LineageNodeId.Value)
                        || issue.EdgeId != null
                            && componentEdgeIds.Contains(issue.EdgeId.Value)))
                .Select(issue => new IssueState(issue.Id, issue.LastDetectedAt))
                .ToListAsync(ct);
        if (issues.Count > 0)
            warnings.Add("open-integrity-issue");
        var maintenanceNodeIds = removedEdges
            .SelectMany(edge => new[] { edge.SourceNodeId, edge.DerivedNodeId })
            .Where(nodeId => !dependencyPlan.DeletedNodeIds.Contains(nodeId))
            .Distinct()
            .ToArray();
        var videoIds = componentNodes.Select(node => node.LastKnownVideoId)
            .Concat(deletedItems.Where(item => item.VideoId is not null)
                .Select(item => item.VideoId!.Value))
            .Concat(nativeStates.Select(segment => segment.VideoId))
            .ToHashSet();
        var deletedSegmentCount = deletedItems.Count
            + selection.LooseNativeSegments.Count;
        var fingerprint = Fingerprint(JsonSerializer.Serialize(new
        {
            selection.ScopeKey,
            removeWholeComponent,
            selected = selectedItems.OrderBy(item => item.Id).Select(item => new
            {
                item.Id,
                item.Revision,
                UpdatedAtTicks = item.UpdatedAt.Ticks,
                item.NativeSegmentId,
            }),
            looseNative = selection.LooseNativeSegments.OrderBy(segment => segment.Id).Select(segment => new
            {
                segment.Id,
                segment.VideoId,
                UpdatedAtTicks = segment.UpdatedAtValue.Ticks,
                segment.ImageBlobId,
            }),
            nodes = componentNodes.OrderBy(node => node.Id).Select(node => new
            {
                node.Id,
                node.ItemId,
                node.State,
                UpdatedAtTicks = node.UpdatedAt.Ticks,
            }),
            edges = componentEdges.OrderBy(edge => edge.Id).Select(edge => new
            {
                edge.Id,
                edge.SourceNodeId,
                edge.DerivedNodeId,
                edge.RuleId,
                UpdatedAtTicks = edge.UpdatedAt.Ticks,
            }),
            deletedItems = deletedItems.OrderBy(item => item.Id).Select(item => new
            {
                item.Id,
                item.Revision,
                UpdatedAtTicks = item.UpdatedAt.Ticks,
                item.NativeSegmentId,
            }),
            native = nativeStates.OrderBy(segment => segment.Id).Select(segment => new
            {
                segment.Id,
                segment.VideoId,
                UpdatedAtTicks = segment.UpdatedAtValue.Ticks,
                segment.ImageBlobId,
            }),
            issues = issues.OrderBy(issue => issue.Id).Select(issue => new
            {
                issue.Id,
                UpdatedAtTicks = issue.UpdatedAtValue.Ticks,
            }),
            protectedIncorrectExamples = selection.ProtectedIncorrectExamples
                .OrderBy(example => example.Id),
            selection.DeferredRejectedSegmentCount,
        }));
        return new(
            selection,
            componentNodes,
            componentEdges,
            deletedNodes,
            removedEdges,
            deletedItems,
            nativeSegments,
            maintenanceNodeIds,
            videoIds,
            warnings,
            dependencyPlan.RetainedSharedNodeCount,
            deletedSegmentCount,
            fingerprint);
    }

    private static async Task<SegmentDependencyDeletePreview> BuildPreviewAsync(
        DeletionPlan plan,
        CovePrincipal? principal,
        IAuthorizationService authorization,
        CancellationToken ct)
    {
        var failures = 0;
        foreach (var videoId in plan.VideoIds.Order())
        {
            var access = await authorization.AuthorizeAsync(
                principal,
                Permissions.SegmentsDelete,
                EntityRef.Of(EntityKinds.Video, videoId),
                ct);
            if (!access.Allowed)
                failures++;
        }
        var dependentCount = Math.Max(
            0,
            plan.DeletedSegmentCount - plan.Selection.SelectedSegmentCount);
        return new(
            plan.Fingerprint,
            plan.Selection.SelectedSegmentCount,
            dependentCount,
            plan.DeletedSegmentCount,
            plan.RemovedEdges.Count,
            plan.RetainedSharedSegmentCount,
            plan.VideoIds.Count,
            failures,
            plan.Warnings,
            plan.DeletedSegmentCount >= 10,
            plan.Selection.ProtectedIncorrectExamples.Count,
            plan.Selection.DeferredRejectedSegmentCount);
    }

    private static async Task<SegmentDependencyDeleteResult> ApplyPlanAsync(
        DbContext db,
        DeletionPlan plan,
        CancellationToken ct)
    {
        foreach (var segment in plan.NativeSegments)
        {
            if (segment.ImageBlobId is { Length: > 0 } blobId)
                await QueueCleanupAsync(db, blobId, ct);
        }
        foreach (var item in plan.DeletedItems)
        {
            if (db.Database.ProviderName?.Contains("Npgsql", StringComparison.Ordinal) != true
                && item.ExtensionImageBlobId is { Length: > 0 } blobId)
                await QueueCleanupAsync(db, blobId, ct);
        }

        var deletedNodeIds = plan.DeletedNodes.Select(node => node.Id).ToArray();
        var removedEdgeIds = plan.RemovedEdges.Select(edge => edge.Id).ToArray();
        var deletedItemIds = plan.DeletedItems.Select(item => item.Id).ToArray();
        if (db.Model.FindEntityType(typeof(SegmentStudioLineageIssue)) is not null
            && (deletedNodeIds.Length > 0 || removedEdgeIds.Length > 0))
        {
            db.RemoveRange(await db.Set<SegmentStudioLineageIssue>()
                .Where(issue =>
                    issue.LineageNodeId != null
                        && deletedNodeIds.Contains(issue.LineageNodeId.Value)
                    || issue.EdgeId != null
                        && removedEdgeIds.Contains(issue.EdgeId.Value))
                .ToListAsync(ct));
        }
        if (db.Model.FindEntityType(typeof(SegmentStudioIncorrectExample)) is not null
            && deletedItemIds.Length > 0)
        {
            db.RemoveRange(await db.Set<SegmentStudioIncorrectExample>()
                .Where(example => example.ItemId != null
                    && deletedItemIds.Contains(example.ItemId.Value))
                .ToListAsync(ct));
        }
        if (removedEdgeIds.Length > 0)
            db.RemoveRange(plan.RemovedEdges);
        if (deletedNodeIds.Length > 0)
        {
            db.RemoveRange(await db.Set<SegmentStudioSegmentProvenance>()
                .Where(assertion => deletedNodeIds.Contains(assertion.LineageNodeId))
                .ToListAsync(ct));
            db.RemoveRange(plan.DeletedNodes);
        }
        if (plan.NativeSegments.Count > 0)
            db.RemoveRange(plan.NativeSegments);
        var ownedItems = plan.DeletedItems
            .Where(item => item.NativeSegmentId is null)
            .ToArray();
        if (ownedItems.Length > 0)
            db.RemoveRange(ownedItems);
        await db.SaveChangesAsync(ct);
        if (plan.MaintenanceNodeIds.Count > 0)
            await DerivationGraphService.RetireUnsupportedInheritedAssertionsAsync(
                db, plan.MaintenanceNodeIds, ct);
        return new(
            plan.DeletedSegmentCount,
            plan.RemovedEdges.Count,
            plan.RetainedSharedSegmentCount,
            plan.VideoIds.Count);
    }

    private static async Task QueueCleanupAsync(
        DbContext db,
        string blobId,
        CancellationToken ct)
    {
        if (await db.Set<SegmentStudioBlobCleanupOutbox>()
            .AnyAsync(entry => entry.BlobId == blobId, ct))
            return;
        db.Add(new SegmentStudioBlobCleanupOutbox
        {
            BlobId = blobId,
            Status = "pending",
            AttemptCount = 0,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow,
        });
    }

    private static async Task<SegmentDependencyDeleteResult?> ReplayAsync(
        DbContext db,
        Guid operationId,
        string operationKind,
        string requestFingerprint,
        int? actorUserId,
        CancellationToken ct)
    {
        var receipt = await db.Set<SegmentStudioSegmentOperation>().AsNoTracking()
            .SingleOrDefaultAsync(operation => operation.OperationId == operationId, ct);
        if (receipt is null)
            return null;
        if (receipt.Kind != operationKind
            || receipt.RequestFingerprint != requestFingerprint
            || receipt.ActorUserId != actorUserId)
            throw Changed();
        return JsonSerializer.Deserialize<SegmentDependencyDeleteResult>(
            receipt.ResultPayloadJson!)!;
    }

    private static string Fingerprint(string payload) =>
        Convert.ToHexString(SHA256.HashData(Encoding.UTF8.GetBytes(payload)));

    private static bool FixedTimeEquals(string current, string requested) =>
        current.Length == requested.Length
        && CryptographicOperations.FixedTimeEquals(
            Encoding.UTF8.GetBytes(current),
            Encoding.UTF8.GetBytes(requested));

    private static LineageConflictException Changed() =>
        new("LINEAGE_COMPONENT_CHANGED", "The deletion inputs changed after preview.");

    private static void EnsureNoProtectedIncorrectExamples(Selection selection)
    {
        if (selection.ProtectedIncorrectExamples.Count > 0)
            throw ProtectedIncorrectExample();
    }

    private static LineageConflictException ProtectedIncorrectExample() =>
        new(
            "INCORRECT_EXAMPLE_PROTECTED",
            "Export collected incorrect examples before deleting segments in this lineage component.");

    private static async Task<IReadOnlyList<ProtectionState>> LoadProtectionAsync(
        DbContext db,
        IReadOnlyCollection<long> itemIds,
        CancellationToken ct)
    {
        if (itemIds.Count == 0
            || db.Model.FindEntityType(typeof(SegmentStudioIncorrectExample)) is null)
            return [];
        return await db.Set<SegmentStudioIncorrectExample>()
            .AsNoTracking()
            .Where(example => example.ItemId != null
                && itemIds.Contains(example.ItemId.Value))
            .OrderBy(example => example.Id)
            .Select(example => new ProtectionState(
                example.Id,
                example.Revision,
                example.ItemId!.Value))
            .ToListAsync(ct);
    }

    private static HashSet<Guid> ConnectedNodeIds(
        IReadOnlyList<SegmentStudioDerivationEdge> edges,
        IEnumerable<Guid> roots)
    {
        var connected = roots.ToHashSet();
        if (connected.Count == 0)
            return connected;
        var adjacency = new Dictionary<Guid, List<Guid>>();
        foreach (var edge in edges)
        {
            if (!adjacency.TryGetValue(edge.SourceNodeId, out var derived))
                adjacency[edge.SourceNodeId] = derived = [];
            derived.Add(edge.DerivedNodeId);
            if (!adjacency.TryGetValue(edge.DerivedNodeId, out var sources))
                adjacency[edge.DerivedNodeId] = sources = [];
            sources.Add(edge.SourceNodeId);
        }
        var frontier = new Queue<Guid>(connected);
        while (frontier.TryDequeue(out var nodeId))
        {
            if (!adjacency.TryGetValue(nodeId, out var neighbours))
                continue;
            foreach (var neighbour in neighbours)
            {
                if (connected.Add(neighbour))
                    frontier.Enqueue(neighbour);
            }
        }
        return connected;
    }

    private sealed record NativeState(
        int Id,
        int VideoId,
        DateTime UpdatedAtValue,
        string? ImageBlobId);

    private sealed record IssueState(Guid Id, DateTime UpdatedAtValue);

    private sealed record ProtectionState(long Id, long Revision, long ItemId);

    private sealed record Selection(
        IReadOnlyList<SegmentStudioItem> SelectedItems,
        IReadOnlyList<NativeState> LooseNativeSegments,
        int SelectedSegmentCount,
        string ScopeKey,
        IReadOnlyList<ProtectionState> ProtectedIncorrectExamples,
        int DeferredRejectedSegmentCount);

    private sealed record DeletionPlan(
        Selection Selection,
        IReadOnlyList<SegmentStudioLineageNode> ComponentNodes,
        IReadOnlyList<SegmentStudioDerivationEdge> ComponentEdges,
        IReadOnlyList<SegmentStudioLineageNode> DeletedNodes,
        IReadOnlyList<SegmentStudioDerivationEdge> RemovedEdges,
        IReadOnlyList<SegmentStudioItem> DeletedItems,
        IReadOnlyList<Segment> NativeSegments,
        IReadOnlyList<Guid> MaintenanceNodeIds,
        HashSet<int> VideoIds,
        IReadOnlyList<string> Warnings,
        int RetainedSharedSegmentCount,
        int DeletedSegmentCount,
        string Fingerprint);

    private sealed record DeleteTarget(
        long? ItemId,
        int? VideoId,
        bool RemoveWholeComponent,
        string OperationKind,
        string ScopeKey)
    {
        public static DeleteTarget Single(long itemId) =>
            new(itemId, null, false, "dependency-delete", $"item:{itemId}");

        public static DeleteTarget Rejected(int videoId) =>
            new(null, videoId, false, "rejected-dependency-delete", $"video:{videoId}:rejected");

        public static DeleteTarget Repair(long itemId) =>
            new(itemId, null, true, "component-delete-repair", $"repair:{itemId}");
    }
}
