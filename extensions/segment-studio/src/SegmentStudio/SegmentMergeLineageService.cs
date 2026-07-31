using Microsoft.EntityFrameworkCore;

namespace SegmentStudio;

internal static class SegmentMergeLineageService
{
    public static async Task<string?> ConsolidateRootsAsync(
        DbContext db,
        long survivorItemId,
        long consumedItemId,
        int videoId,
        int tagId,
        double startSec,
        double? endSec,
        CancellationToken ct)
    {
        var nodes = await db.Set<SegmentStudioLineageNode>()
            .Where(node => node.ItemId == survivorItemId || node.ItemId == consumedItemId)
            .ToListAsync(ct);
        if (nodes.Count == 0) return null;
        if (nodes.Any(node => node.State != "live"))
            return "Segments with non-live lineage cannot be merged.";

        var nodeIds = nodes.Select(node => node.Id).ToArray();
        var hasEdges = await db.Set<SegmentStudioDerivationEdge>().AsNoTracking()
            .AnyAsync(edge => nodeIds.Contains(edge.SourceNodeId) || nodeIds.Contains(edge.DerivedNodeId), ct);
        if (hasEdges)
            return "Derived segments or segments with derived descendants cannot be merged.";

        var survivor = nodes.SingleOrDefault(node => node.ItemId == survivorItemId);
        var consumed = nodes.SingleOrDefault(node => node.ItemId == consumedItemId);
        if (survivor is null && consumed is not null)
        {
            consumed.ItemId = survivorItemId;
            survivor = consumed;
            consumed = null;
        }

        var assertions = await db.Set<SegmentStudioSegmentProvenance>()
            .Where(assertion => nodeIds.Contains(assertion.LineageNodeId))
            .ToListAsync(ct);
        var now = DateTime.UtcNow;
        db.RemoveRange(assertions);

        if (survivor is not null && consumed is not null)
        {
            db.Remove(consumed);
        }

        if (survivor is not null)
        {
            survivor.LastKnownVideoId = videoId;
            survivor.LastKnownTagId = tagId;
            survivor.LastKnownStartSec = startSec;
            survivor.LastKnownEndSec = endSec;
            survivor.UpdatedAt = now;
        }
        return null;
    }
}
