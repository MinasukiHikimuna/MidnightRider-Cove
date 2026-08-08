using Microsoft.EntityFrameworkCore;

namespace SegmentStudio;

public sealed record SegmentEditorItemMetadata(
    IReadOnlyList<SegmentProvenanceDto> Provenance,
    SegmentLineageDto? Lineage);

public static class SegmentEditorMetadataService
{
    public static async Task<IReadOnlyDictionary<long, SegmentEditorItemMetadata>> LoadAsync(
        DbContext db,
        int videoId,
        IReadOnlyCollection<long> editorItemIds,
        bool includeProvenance,
        bool includeLineage,
        CancellationToken ct)
    {
        if (editorItemIds.Count == 0)
            return new Dictionary<long, SegmentEditorItemMetadata>();

        var requestedIds = editorItemIds.ToHashSet();
        var nodes = await db.Set<SegmentStudioLineageNode>().AsNoTracking()
            .Where(node => node.LastKnownVideoId == videoId)
            .Select(node => new { node.Id, node.ItemId, node.State })
            .ToListAsync(ct);
        var requestedNodes = nodes
            .Where(node => node.State == "live"
                && node.ItemId is long itemId
                && requestedIds.Contains(itemId))
            .ToDictionary(node => node.ItemId!.Value);
        var nodeIds = nodes.Select(node => node.Id).ToArray();
        var edges = includeLineage ? await (
                from edge in db.Set<SegmentStudioDerivationEdge>().AsNoTracking()
                join rule in db.Set<SegmentStudioDerivationRule>().AsNoTracking()
                    on edge.RuleId equals rule.Id
                where nodeIds.Contains(edge.SourceNodeId)
                    || nodeIds.Contains(edge.DerivedNodeId)
                orderby edge.Id
                select new
                {
                    edge.Id,
                    edge.SourceNodeId,
                    edge.DerivedNodeId,
                    RuleKey = rule.Key,
                    RuleVersion = rule.Version,
                    SourceTagId = edge.SourceTagIdAtCreation,
                    DerivedTagId = edge.DerivedTagIdAtCreation,
                })
            .ToListAsync(ct) : [];
        var provenanceRows = includeProvenance ? await (
                from assertion in db.Set<SegmentStudioSegmentProvenance>().AsNoTracking()
                join node in db.Set<SegmentStudioLineageNode>().AsNoTracking()
                    on assertion.LineageNodeId equals node.Id
                join source in db.Set<SegmentStudioSource>().AsNoTracking()
                    on assertion.SourceId equals source.Id
                join activityCandidate in db.Set<SegmentStudioProvenanceActivity>().AsNoTracking()
                    on assertion.ActivityId equals activityCandidate.Id into activities
                from activity in activities.DefaultIfEmpty()
                where node.ItemId != null
                    && requestedIds.Contains(node.ItemId.GetValueOrDefault())
                    && assertion.SupersededAt == null
                orderby assertion.CreatedAt, assertion.Id
                select new
                {
                    ItemId = node.ItemId.GetValueOrDefault(),
                    Value = new SegmentProvenanceDto(
                        assertion.Id,
                        source.Key,
                        source.DisplayName,
                        source.Category,
                        source.Provider,
                        assertion.Relation,
                        activity == null ? null : activity.Kind,
                        activity == null ? null : activity.ExternalRunId,
                        assertion.ModelKey,
                        assertion.ModelIdentifier,
                        assertion.ModelVersion,
                        assertion.Confidence,
                        assertion.RecordedAt,
                        assertion.MetadataJson),
                })
            .ToListAsync(ct) : [];

        var componentNodeIds = nodeIds
            .Concat(edges.SelectMany(edge => new[] { edge.SourceNodeId, edge.DerivedNodeId }))
            .Distinct()
            .ToArray();
        var parent = componentNodeIds.ToDictionary(nodeId => nodeId, nodeId => nodeId);
        Guid Find(Guid id)
        {
            var root = id;
            while (parent[root] != root) root = parent[root];
            while (parent[id] != id)
            {
                var next = parent[id];
                parent[id] = root;
                id = next;
            }
            return root;
        }
        void Union(Guid left, Guid right)
        {
            if (!parent.ContainsKey(left) || !parent.ContainsKey(right)) return;
            var leftRoot = Find(left);
            var rightRoot = Find(right);
            if (leftRoot != rightRoot) parent[rightRoot] = leftRoot;
        }
        foreach (var edge in edges) Union(edge.SourceNodeId, edge.DerivedNodeId);

        var componentSizes = componentNodeIds
            .GroupBy(Find)
            .ToDictionary(group => group.Key, group => group.Count());
        var itemIdsByNode = nodes
            .Where(node => node.State == "live")
            .ToDictionary(node => node.Id, node => node.ItemId);
        var parentsByNode = edges.ToLookup(edge => edge.DerivedNodeId);
        var childrenByNode = edges.ToLookup(edge => edge.SourceNodeId);

        var provenanceByItem = provenanceRows.ToLookup(row => row.ItemId, row => row.Value);
        var result = new Dictionary<long, SegmentEditorItemMetadata>();
        foreach (var itemId in requestedIds)
        {
            if (!requestedNodes.TryGetValue(itemId, out var node))
            {
                result[itemId] = new(
                    provenanceByItem[itemId].ToArray(),
                    includeLineage
                        ? new SegmentLineageDto(null, false, false, 1, "consistent", [], [])
                        : null);
                continue;
            }
            var parents = parentsByNode[node.Id]
                .Where(edge => itemIdsByNode.GetValueOrDefault(edge.SourceNodeId) is not null)
                .Select(edge => new LineageRelativeDto(
                    itemIdsByNode[edge.SourceNodeId]!.Value,
                    edge.SourceNodeId,
                    edge.RuleKey,
                    edge.RuleVersion,
                    edge.SourceTagId))
                .ToArray();
            var children = childrenByNode[node.Id]
                .Where(edge => itemIdsByNode.GetValueOrDefault(edge.DerivedNodeId) is not null)
                .Select(edge => new LineageRelativeDto(
                    itemIdsByNode[edge.DerivedNodeId]!.Value,
                    edge.DerivedNodeId,
                    edge.RuleKey,
                    edge.RuleVersion,
                    edge.DerivedTagId))
                .ToArray();
            var root = Find(node.Id);
            result[itemId] = new(
                provenanceByItem[itemId].ToArray(),
                includeLineage ? new SegmentLineageDto(
                    node.Id,
                    parents.Length > 0,
                    parents.Length > 0,
                    componentSizes[root],
                    "unchecked",
                    parents,
                    children) : null);
        }
        return result;
    }
}
