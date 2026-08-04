using Cove.Core.Auth;
using Cove.Core.Entities;
using Microsoft.EntityFrameworkCore;

namespace SegmentStudio;

public sealed record NativeOwnershipLineagePruningResult(
    bool Succeeded,
    int DeletedDerivedSegmentCount = 0,
    int RemovedEdgeCount = 0,
    int RetainedSharedSegmentCount = 0,
    string? Code = null,
    string? Error = null);

public static class NativeOwnershipLineagePruningService
{
    public static async Task<NativeOwnershipLineagePruningResult> ApplyAsync(
        DbContext db,
        IReadOnlyCollection<long> sourceItemIds,
        CovePrincipal? principal,
        IAuthorizationService authorization,
        CancellationToken ct)
    {
        if (sourceItemIds.Count == 0)
            return new(true);

        var sourceNodes = await db.Set<SegmentStudioLineageNode>()
            .Where(node => node.ItemId != null && sourceItemIds.Contains(node.ItemId.Value))
            .ToListAsync(ct);
        if (sourceNodes.Count == 0)
            return new(true);

        var sourceNodeIds = sourceNodes.Select(node => node.Id).ToHashSet();
        var componentEdges = await LineageScaleQueries.LoadComponentEdgesAsync(
            db, sourceNodeIds, tracking: true, ct);
        if (componentEdges.Any(edge => sourceNodeIds.Contains(edge.DerivedNodeId)))
            return new(
                false,
                Code: "NATIVE_DERIVED_REQUIRES_NORMALIZATION",
                Error: "A selected native segment is itself derived. Reload it with the corrected migration before deleting it.");

        var outgoingEdgeIds = componentEdges
            .Where(edge => sourceNodeIds.Contains(edge.SourceNodeId))
            .Select(edge => edge.Id)
            .ToArray();
        if (outgoingEdgeIds.Length == 0)
            return new(true);

        var dependency = DerivationDependencyPlanner.ForRemovedEdges(
            componentEdges, outgoingEdgeIds);
        var deletedNodeIds = dependency.DeletedNodeIds.ToArray();
        var deletedNodes = await db.Set<SegmentStudioLineageNode>()
            .Where(node => deletedNodeIds.Contains(node.Id))
            .ToListAsync(ct);
        var deletedItemIds = deletedNodes
            .Where(node => node.ItemId is not null)
            .Select(node => node.ItemId!.Value)
            .Distinct()
            .ToArray();
        var deletedItems = await db.Set<SegmentStudioItem>()
            .Where(item => deletedItemIds.Contains(item.Id))
            .ToListAsync(ct);
        if (deletedNodes.Any(node => node.State != "live" || node.ItemId is null)
            || deletedItems.Count != deletedItemIds.Length)
            return new(
                false,
                Code: "LINEAGE_COMPONENT_INCONSISTENT",
                Error: "The affected derivation data must be repaired before deleting this segment.");
        if (deletedItems.Any(item => item.NativeSegmentId is not null))
            return new(
                false,
                Code: "NATIVE_DERIVED_REQUIRES_NORMALIZATION",
                Error: "A derived segment is still stored as a native Cove segment. Reload it with the corrected migration before deleting its source.");

        var affectedVideoIds = deletedNodes.Select(node => node.LastKnownVideoId)
            .Concat(sourceNodes.Select(node => node.LastKnownVideoId))
            .Distinct()
            .Order()
            .ToArray();
        foreach (var videoId in affectedVideoIds)
        {
            var access = await authorization.AuthorizeAsync(
                principal,
                Permissions.SegmentsDelete,
                EntityRef.Of(EntityKinds.Video, videoId),
                ct);
            if (!access.Allowed)
                return new(
                    false,
                    Code: "LINEAGE_PERMISSION_DENIED",
                    Error: access.Reason ?? "You cannot delete every affected derived segment.");
        }

        var removedEdges = componentEdges
            .Where(edge => dependency.RemovedEdgeIds.Contains(edge.Id))
            .ToArray();
        var removedEdgeIds = removedEdges.Select(edge => edge.Id).ToArray();
        var maintenanceNodeIds = removedEdges
            .SelectMany(edge => new[] { edge.SourceNodeId, edge.DerivedNodeId })
            .Where(nodeId => !dependency.DeletedNodeIds.Contains(nodeId))
            .Distinct()
            .ToArray();

        if (db.Model.FindEntityType(typeof(SegmentStudioLineageIssue)) is not null)
        {
            db.RemoveRange(await db.Set<SegmentStudioLineageIssue>()
                .Where(issue =>
                    issue.EdgeId != null && removedEdgeIds.Contains(issue.EdgeId.Value)
                    || issue.LineageNodeId != null && deletedNodeIds.Contains(issue.LineageNodeId.Value))
                .ToListAsync(ct));
        }
        if (db.Model.FindEntityType(typeof(SegmentStudioSegmentProvenance)) is not null)
        {
            db.RemoveRange(await db.Set<SegmentStudioSegmentProvenance>()
                .Where(assertion => deletedNodeIds.Contains(assertion.LineageNodeId))
                .ToListAsync(ct));
        }
        if (db.Model.FindEntityType(typeof(SegmentStudioIncorrectExample)) is not null)
        {
            db.RemoveRange(await db.Set<SegmentStudioIncorrectExample>()
                .Where(example => example.ItemId != null
                    && deletedItemIds.Contains(example.ItemId.Value))
                .ToListAsync(ct));
        }
        if (db.Model.FindEntityType(typeof(SegmentStudioHistorySession)) is not null)
        {
            db.RemoveRange(await db.Set<SegmentStudioHistorySession>()
                .Where(session => affectedVideoIds.Contains(session.VideoId))
                .ToListAsync(ct));
        }
        if (!db.Database.IsRelational()
            && db.Model.FindEntityType(typeof(SegmentStudioBlobCleanupOutbox)) is not null)
        {
            foreach (var blobId in deletedItems.Select(item => item.ExtensionImageBlobId)
                .Where(blobId => !string.IsNullOrWhiteSpace(blobId))
                .Distinct())
            {
                db.Add(new SegmentStudioBlobCleanupOutbox
                {
                    BlobId = blobId!,
                    Status = "pending",
                    CreatedAt = DateTime.UtcNow,
                    UpdatedAt = DateTime.UtcNow,
                });
            }
        }

        db.RemoveRange(removedEdges);
        db.RemoveRange(deletedNodes);
        db.RemoveRange(deletedItems);
        await db.SaveChangesAsync(ct);
        if (maintenanceNodeIds.Length > 0
            && db.Model.FindEntityType(typeof(SegmentStudioSegmentProvenance)) is not null)
        {
            await DerivationGraphService.RetireUnsupportedInheritedAssertionsAsync(
                db, maintenanceNodeIds, ct);
        }
        return new(
            true,
            deletedItems.Count,
            removedEdges.Length,
            dependency.RetainedSharedNodeCount);
    }
}
