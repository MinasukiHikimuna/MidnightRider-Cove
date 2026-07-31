using Cove.Core.Entities;
using Microsoft.EntityFrameworkCore;

namespace SegmentStudio;

/// <summary>
/// Propagates a rejection through materialized derivations. A derived item is
/// rejected only when every live source item for it is rejected. Callers must
/// hold the video's review lock and save the supplied context as one unit with
/// their source-state change.
/// </summary>
public static class DerivedSegmentRejectionService
{
    public static async Task RejectDescendantsAsync(
        DbContext db,
        long rootItemId,
        CancellationToken ct) =>
        await RejectDescendantsAsync(db, [rootItemId], ct);

    public static async Task RejectDescendantsAsync(
        DbContext db,
        IReadOnlyCollection<long> rootItemIds,
        CancellationToken ct)
    {
        var rootNodes = await db.Set<SegmentStudioLineageNode>()
            .Where(node => node.ItemId != null && rootItemIds.Contains(node.ItemId.Value) && node.State == "live")
            .Select(node => node.Id)
            .ToArrayAsync(ct);
        if (rootNodes.Length == 0) return;

        var reachable = new HashSet<Guid>(rootNodes);
        var frontier = rootNodes;
        while (frontier.Length > 0)
        {
            var next = await db.Set<SegmentStudioDerivationEdge>()
                .Where(edge => frontier.Contains(edge.SourceNodeId))
                .Select(edge => edge.DerivedNodeId)
                .Distinct()
                .ToArrayAsync(ct);
            frontier = next.Where(reachable.Add).ToArray();
        }

        var descendantNodeIds = reachable.Except(rootNodes).ToArray();
        if (descendantNodeIds.Length == 0) return;
        var incoming = await db.Set<SegmentStudioDerivationEdge>()
            .Where(edge => descendantNodeIds.Contains(edge.DerivedNodeId))
            .ToListAsync(ct);
        var relevantNodeIds = incoming
            .SelectMany(edge => new[] { edge.SourceNodeId, edge.DerivedNodeId })
            .Distinct()
            .ToArray();
        var nodes = await db.Set<SegmentStudioLineageNode>()
            .Where(node => relevantNodeIds.Contains(node.Id) && node.State == "live")
            .ToListAsync(ct);
        var itemIds = nodes.Where(node => node.ItemId is not null)
            .Select(node => node.ItemId!.Value).Distinct().ToArray();
        var items = await db.Set<SegmentStudioItem>()
            .Where(item => itemIds.Contains(item.Id)).ToListAsync(ct);
        var nativeIds = items.Where(item => item.NativeSegmentId is not null)
            .Select(item => item.NativeSegmentId!.Value).ToArray();
        var nativeSegments = await db.Set<Segment>()
            .Where(segment => nativeIds.Contains(segment.Id)).ToListAsync(ct);
        var nodeItems = nodes.Where(node => node.ItemId is not null)
            .Join(items, node => node.ItemId!.Value, item => item.Id, (_, item) => item)
            .ToDictionary(item => item.Id);
        var nodeItemIds = nodes.Where(node => node.ItemId is not null)
            .ToDictionary(node => node.Id, node => node.ItemId!.Value);
        var segmentsById = nativeSegments.ToDictionary(segment => segment.Id);

        bool IsRejected(long itemId)
        {
            if (!nodeItems.TryGetValue(itemId, out var item)) return false;
            return item.NativeSegmentId is int nativeId
                ? segmentsById.TryGetValue(nativeId, out var segment)
                    && DirectSegmentReviewService.ReadReviewState(segment.Payload) == "rejected"
                : item.ReviewState == "rejected";
        }

        // A source may itself become rejected during this pass, so repeat until
        // every reachable layer whose incoming sources are rejected is settled.
        var changed = true;
        while (changed)
        {
            changed = false;
            foreach (var nodeId in descendantNodeIds)
            {
                if (!nodeItemIds.TryGetValue(nodeId, out var itemId) || IsRejected(itemId)) continue;
                var sourceNodeIds = incoming.Where(edge => edge.DerivedNodeId == nodeId)
                    .Select(edge => edge.SourceNodeId)
                    .ToArray();
                if (sourceNodeIds.Length == 0
                    || sourceNodeIds.Any(sourceNodeId => !nodeItemIds.TryGetValue(sourceNodeId, out var sourceItemId)
                        || !IsRejected(sourceItemId))) continue;
                var item = nodeItems[itemId];
                if (item.NativeSegmentId is int nativeId && segmentsById.TryGetValue(nativeId, out var segment))
                {
                    segment.Payload = DirectSegmentReviewService.MergeReviewState(segment.Payload, "rejected");
                    segment.UpdatedAt = DirectSegmentReviewService.NextTimestamp(segment.UpdatedAt);
                }
                else
                {
                    item.ReviewState = "rejected";
                    item.Revision++;
                    item.UpdatedAt = DateTime.UtcNow;
                }
                changed = true;
            }
        }
    }
}
