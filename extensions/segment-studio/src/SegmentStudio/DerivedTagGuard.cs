using Microsoft.EntityFrameworkCore;

namespace SegmentStudio;

public static class DerivedTagGuard
{
    public static async Task<IReadOnlySet<long>> LoadDerivedItemIdsAsync(
        DbContext db,
        IReadOnlyCollection<long> itemIds,
        CancellationToken ct)
    {
        if (itemIds.Count == 0)
            return new HashSet<long>();
        return await (
                from node in db.Set<SegmentStudioLineageNode>().AsNoTracking()
                join edge in db.Set<SegmentStudioDerivationEdge>().AsNoTracking()
                    on node.Id equals edge.DerivedNodeId
                where node.ItemId != null
                    && node.State == "live"
                    && itemIds.Contains(node.ItemId.Value)
                select node.ItemId.GetValueOrDefault())
            .Distinct()
            .ToHashSetAsync(ct);
    }

    public static Task<bool> IsDerivedItemAsync(
        DbContext db,
        long itemId,
        CancellationToken ct) =>
        (
            from node in db.Set<SegmentStudioLineageNode>().AsNoTracking()
            join edge in db.Set<SegmentStudioDerivationEdge>().AsNoTracking()
                on node.Id equals edge.DerivedNodeId
            where node.ItemId == itemId && node.State == "live"
            select edge.Id)
        .AnyAsync(ct);

    public static Task<bool> HasOutgoingEdgesAsync(
        DbContext db,
        long itemId,
        CancellationToken ct) =>
        (
            from node in db.Set<SegmentStudioLineageNode>().AsNoTracking()
            join edge in db.Set<SegmentStudioDerivationEdge>().AsNoTracking()
                on node.Id equals edge.SourceNodeId
            where node.ItemId == itemId && node.State == "live"
            select edge.Id)
        .AnyAsync(ct);

    public static async Task<bool> IsDerivedNativeSegmentAsync(
        DbContext db,
        int nativeSegmentId,
        CancellationToken ct)
    {
        var itemId = await db.Set<SegmentStudioItem>().AsNoTracking()
            .Where(item => item.NativeSegmentId == nativeSegmentId)
            .Select(item => (long?)item.Id)
            .SingleOrDefaultAsync(ct);
        return itemId is not null
            && await IsDerivedItemAsync(db, itemId.Value, ct);
    }
}
