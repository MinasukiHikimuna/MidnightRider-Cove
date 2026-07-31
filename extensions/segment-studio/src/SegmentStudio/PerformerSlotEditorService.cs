using Cove.Core.Entities;
using Microsoft.EntityFrameworkCore;

namespace SegmentStudio;

public sealed record PerformerSlotEditorItem(
    long SegmentId,
    Guid SlotDefinitionId,
    string? Label,
    int SortOrder,
    IReadOnlyList<string> GenderHints,
    int? PerformerId,
    string? PerformerName,
    bool AllowSamePerformerInMultipleSlots);

public sealed record PerformerSlotCandidate(int PerformerId, string Name, string? Gender, bool IsVideoPerformer);

public static class PerformerSlotEditorService
{
    public static async Task<IReadOnlyList<PerformerSlotEditorItem>> LoadAsync(
        DbContext db,
        IReadOnlyDictionary<int, int> segmentTagIds,
        CancellationToken ct) =>
        await LoadUnifiedAsync(db, segmentTagIds, new Dictionary<long, int>(), ct);

    public static async Task<IReadOnlyList<PerformerSlotEditorItem>> LoadUnifiedAsync(
        DbContext db,
        IReadOnlyDictionary<int, int> nativeSegmentTagIds,
        IReadOnlyDictionary<long, int> ownedItemTagIds,
        CancellationToken ct)
    {
        var segmentTagIds = nativeSegmentTagIds
            .ToDictionary(pair => (long)pair.Key, pair => pair.Value);
        foreach (var pair in ownedItemTagIds)
            segmentTagIds[-pair.Key] = pair.Value;
        if (segmentTagIds.Count == 0)
            return [];

        var tagIds = segmentTagIds.Values.Distinct().ToArray();
        var definitionSets = await db.Set<SegmentStudioSlotDefinitionSet>()
            .AsNoTracking()
            .Where(set => tagIds.Contains(set.TagId))
            .Select(set => new DefinitionSetRow(set.Id, set.TagId, set.AllowSamePerformerInMultipleSlots))
            .ToListAsync(ct);
        if (definitionSets.Count == 0)
            return [];

        var setIds = definitionSets.Select(set => set.Id).ToArray();
        var definitions = await db.Set<SegmentStudioSlotDefinition>()
            .AsNoTracking()
            .Where(definition => setIds.Contains(definition.SlotDefinitionSetId))
            .Select(definition => new DefinitionRow(
                definition.Id,
                definition.SlotDefinitionSetId,
                definition.Label,
                definition.SortOrder))
            .ToListAsync(ct);

        var definitionIds = definitions.Select(definition => definition.Id).ToArray();
        var hints = definitionIds.Length == 0
            ? []
            : await db.Set<SegmentStudioSlotDefinitionGenderHint>()
                .AsNoTracking()
                .Where(hint => definitionIds.Contains(hint.SlotDefinitionId))
                .Select(hint => new GenderHintRow(hint.SlotDefinitionId, hint.GenderHint))
                .ToListAsync(ct);

        var nativeSegmentIds = nativeSegmentTagIds.Keys.ToArray();
        var ownedItemIds = ownedItemTagIds.Keys.ToArray();
        var assignments = definitionIds.Length == 0
            ? []
            : await (
                    from slot in db.Set<SegmentStudioSegmentSlot>().AsNoTracking()
                    join performer in db.Set<Performer>().AsNoTracking()
                        on slot.PerformerId equals performer.Id
                    join item in db.Set<SegmentStudioItem>().AsNoTracking()
                        on slot.ItemId equals item.Id
                    where ((item.NativeSegmentId.HasValue
                                && nativeSegmentIds.Contains(item.NativeSegmentId.Value))
                            || (!item.NativeSegmentId.HasValue
                                && ownedItemIds.Contains(item.Id)))
                          && definitionIds.Contains(slot.SlotDefinitionId)
                    select new AssignmentRow(
                        item.NativeSegmentId.HasValue ? item.NativeSegmentId.Value : -item.Id,
                        slot.SlotDefinitionId,
                        slot.PerformerId,
                        performer.Name))
                .ToListAsync(ct);

        var setByTag = definitionSets.ToDictionary(set => set.TagId);
        var definitionsBySet = definitions
            .GroupBy(definition => definition.SetId)
            .ToDictionary(
                group => group.Key,
                group => group
                    .OrderBy(definition => definition.SortOrder)
                    .ThenBy(definition => definition.Id)
                    .ToArray());
        var hintsByDefinition = hints
            .GroupBy(hint => hint.DefinitionId)
            .ToDictionary(
                group => group.Key,
                group => (IReadOnlyList<string>)group
                    .Select(hint => hint.Value)
                    .Order(StringComparer.Ordinal)
                    .ToArray());
        var assignmentBySlot = assignments.ToDictionary(
            assignment => (assignment.SegmentId, assignment.DefinitionId));
        var result = new List<PerformerSlotEditorItem>();
        foreach (var (segmentId, tagId) in segmentTagIds.OrderBy(pair => pair.Key))
        {
            if (!setByTag.TryGetValue(tagId, out var set)
                || !definitionsBySet.TryGetValue(set.Id, out var applicableDefinitions))
                continue;

            foreach (var definition in applicableDefinitions)
            {
                assignmentBySlot.TryGetValue((segmentId, definition.Id), out var assignment);
                var definitionHints = hintsByDefinition.GetValueOrDefault(definition.Id) ?? [];
                result.Add(new PerformerSlotEditorItem(
                    segmentId,
                    definition.Id,
                    definition.Label,
                    definition.SortOrder,
                    definitionHints,
                    assignment?.PerformerId,
                    assignment?.PerformerName,
                    set.AllowSamePerformerInMultipleSlots));
            }
        }

        return result;
    }

    public static async Task<IReadOnlyList<PerformerSlotCandidate>> LoadCandidatesAsync(DbContext db, int videoId, CancellationToken ct)
    {
        var videoPerformerIds = await db.Set<VideoPerformer>().AsNoTracking().Where(link => link.VideoId == videoId)
            .Select(link => link.PerformerId).ToListAsync(ct);
        var rows = await db.Set<Performer>().AsNoTracking().OrderBy(performer => performer.Name).ThenBy(performer => performer.Id)
            .Select(performer => new { performer.Id, performer.Name, performer.Gender }).ToListAsync(ct);
        return rows.Select(performer => new PerformerSlotCandidate(
                performer.Id, performer.Name, performer.Gender?.ToString(), videoPerformerIds.Contains(performer.Id)))
            .OrderByDescending(candidate => candidate.IsVideoPerformer)
            .ThenBy(candidate => candidate.Name, StringComparer.OrdinalIgnoreCase)
            .ThenBy(candidate => candidate.PerformerId).ToArray();
    }

    private sealed record DefinitionSetRow(Guid Id, int TagId, bool AllowSamePerformerInMultipleSlots);
    private sealed record DefinitionRow(Guid Id, Guid SetId, string? Label, int SortOrder);
    private sealed record GenderHintRow(Guid DefinitionId, string Value);
    private sealed record AssignmentRow(long SegmentId, Guid DefinitionId, int PerformerId, string PerformerName);
}
