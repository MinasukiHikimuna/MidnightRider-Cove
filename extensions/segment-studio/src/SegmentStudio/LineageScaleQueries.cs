using Microsoft.EntityFrameworkCore;

namespace SegmentStudio;

internal static class LineageScaleQueries
{
    public const int PageSize = 500;
    public const int MaximumComponentEdges = 10_000;
    public const int MaximumComponentNodes = 10_000;
    public const int MaximumGlobalRows = 100_000;

    public static async Task<IReadOnlyList<SegmentStudioDerivationEdge>> LoadComponentEdgesAsync(
        DbContext db,
        IEnumerable<Guid> roots,
        bool tracking,
        CancellationToken ct)
    {
        var visitedNodes = roots.ToHashSet();
        var frontier = new Queue<Guid>(visitedNodes);
        var edges = new Dictionary<long, SegmentStudioDerivationEdge>();
        while (frontier.Count > 0)
        {
            var batch = new List<Guid>(PageSize);
            while (batch.Count < PageSize && frontier.TryDequeue(out var nodeId))
                batch.Add(nodeId);
            long afterId = 0;
            while (true)
            {
                var query = db.Set<SegmentStudioDerivationEdge>()
                    .Where(edge => edge.Id > afterId
                        && (batch.Contains(edge.SourceNodeId)
                            || batch.Contains(edge.DerivedNodeId)));
                if (!tracking)
                    query = query.AsNoTracking();
                var page = await query.OrderBy(edge => edge.Id)
                    .Take(PageSize)
                    .ToListAsync(ct);
                foreach (var edge in page)
                {
                    edges[edge.Id] = edge;
                    if (visitedNodes.Add(edge.SourceNodeId))
                        frontier.Enqueue(edge.SourceNodeId);
                    if (visitedNodes.Add(edge.DerivedNodeId))
                        frontier.Enqueue(edge.DerivedNodeId);
                }
                if (edges.Count > MaximumComponentEdges)
                    throw TooLarge();
                if (visitedNodes.Count > MaximumComponentNodes)
                    throw TooLarge();
                if (page.Count < PageSize)
                    break;
                afterId = page[^1].Id;
            }
        }
        return edges.Values.OrderBy(edge => edge.Id).ToArray();
    }

    public static async Task<IReadOnlyList<SegmentStudioDerivationEdge>> LoadAllEdgesAsync(
        DbContext db,
        bool tracking,
        CancellationToken ct)
    {
        var result = new List<SegmentStudioDerivationEdge>();
        long afterId = 0;
        while (true)
        {
            var query = db.Set<SegmentStudioDerivationEdge>()
                .Where(edge => edge.Id > afterId);
            if (!tracking)
                query = query.AsNoTracking();
            var page = await query.OrderBy(edge => edge.Id)
                .Take(PageSize)
                .ToListAsync(ct);
            result.AddRange(page);
            if (result.Count > MaximumGlobalRows)
                throw new LineageConflictException(
                    "LINEAGE_SCALE_LIMIT",
                    $"The operation exceeds the {MaximumGlobalRows} edge maintenance limit.");
            if (page.Count < PageSize)
                break;
            afterId = page[^1].Id;
        }
        return result;
    }

    public static async Task<IReadOnlyList<SegmentStudioSegmentProvenance>>
        LoadActiveProvenanceAsync(
            DbContext db,
            bool tracking,
            CancellationToken ct)
    {
        var result = new List<SegmentStudioSegmentProvenance>();
        long afterId = 0;
        while (true)
        {
            var query = db.Set<SegmentStudioSegmentProvenance>()
                .Where(assertion =>
                    assertion.Id > afterId
                    && assertion.SupersededAt == null);
            if (!tracking)
                query = query.AsNoTracking();
            var page = await query.OrderBy(assertion => assertion.Id)
                .Take(PageSize)
                .ToListAsync(ct);
            result.AddRange(page);
            if (result.Count > MaximumGlobalRows)
                throw new LineageConflictException(
                    "LINEAGE_SCALE_LIMIT",
                    $"The operation exceeds the {MaximumGlobalRows} provenance maintenance limit.");
            if (page.Count < PageSize)
                break;
            afterId = page[^1].Id;
        }
        return result;
    }

    private static LineageConflictException TooLarge() =>
        new(
            "LINEAGE_COMPONENT_TOO_LARGE",
            $"The lineage component exceeds the {MaximumComponentEdges} edge limit.");
}
