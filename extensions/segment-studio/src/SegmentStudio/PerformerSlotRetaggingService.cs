using Cove.Core.Entities;
using Microsoft.EntityFrameworkCore;

namespace SegmentStudio;

public static class PerformerSlotRetaggingService
{
    public static async Task RemapAsync(
        DbContext db,
        long itemId,
        int sourceTagId,
        int targetTagId,
        CancellationToken ct,
        bool autoAssignMissingSlots = false)
    {
        if (sourceTagId == targetTagId)
            return;

        var existing = await db.Set<SegmentStudioSegmentSlot>()
            .Where(slot => slot.ItemId == itemId)
            .ToListAsync(ct);
        if (existing.Count == 0 && !autoAssignMissingSlots)
            return;

        var sourceDefinitions = await (
                from definition in db.Set<SegmentStudioSlotDefinition>().AsNoTracking()
                join set in db.Set<SegmentStudioSlotDefinitionSet>().AsNoTracking()
                    on definition.SlotDefinitionSetId equals set.Id
                where set.TagId == sourceTagId
                select new { definition.Id, definition.Label, definition.SortOrder })
            .ToDictionaryAsync(definition => definition.Id, ct);
        var targetSet = await db.Set<SegmentStudioSlotDefinitionSet>().AsNoTracking()
            .SingleOrDefaultAsync(set => set.TagId == targetTagId, ct);
        var targetDefinitionRows = targetSet is null
            ? []
            : await db.Set<SegmentStudioSlotDefinition>().AsNoTracking()
                .Where(definition => definition.SlotDefinitionSetId == targetSet.Id)
                .OrderBy(definition => definition.SortOrder)
                .ThenBy(definition => definition.Id)
                .ToListAsync(ct);
        var targetDefinitionIds = targetDefinitionRows.Select(definition => definition.Id).ToArray();
        var targetHints = targetDefinitionIds.Length == 0
            ? []
            : await db.Set<SegmentStudioSlotDefinitionGenderHint>().AsNoTracking()
                .Where(hint => targetDefinitionIds.Contains(hint.SlotDefinitionId))
                .ToListAsync(ct);
        var targetDefinitions = targetDefinitionRows
            .Select(definition => new TargetDefinition(
                definition.Id,
                definition.Label,
                definition.SortOrder,
                targetHints
                    .Where(hint => hint.SlotDefinitionId == definition.Id)
                    .Select(hint => hint.GenderHint)
                    .ToArray()))
            .ToList();
        var performerIds = existing.Select(slot => slot.PerformerId).Distinct().ToArray();
        var performerRows = await db.Set<Performer>().AsNoTracking()
            .Where(performer => performerIds.Contains(performer.Id))
            .Select(performer => new { performer.Id, performer.Gender })
            .ToListAsync(ct);
        var performerGenders = performerRows.ToDictionary(
            performer => performer.Id,
            performer => performer.Gender?.ToString());

        var availableTargets = targetDefinitions
            .GroupBy(definition => LabelKey(definition.Label), StringComparer.Ordinal)
            .ToDictionary(
                group => group.Key,
                group => new Queue<TargetDefinition>(group),
                StringComparer.Ordinal);
        var remapped = new List<SegmentStudioSegmentSlot>();
        var usedPerformers = new HashSet<int>();
        foreach (var assignment in existing
                     .Where(slot => sourceDefinitions.ContainsKey(slot.SlotDefinitionId))
                     .OrderBy(slot => sourceDefinitions[slot.SlotDefinitionId].SortOrder)
                     .ThenBy(slot => slot.SlotDefinitionId))
        {
            var source = sourceDefinitions[assignment.SlotDefinitionId];
            if (targetSet is not null
                && !targetSet.AllowSamePerformerInMultipleSlots
                && usedPerformers.Contains(assignment.PerformerId))
                continue;
            if (!availableTargets.TryGetValue(LabelKey(source.Label), out var targets)
                || !targets.TryDequeue(out var target))
                continue;
            if (target.GenderHints.Count != 0
                && (!performerGenders.TryGetValue(assignment.PerformerId, out var performerGender)
                    || !target.GenderHints.Any(hint => SameGender(hint, performerGender))))
                continue;
            if (targetSet is not null
                && !targetSet.AllowSamePerformerInMultipleSlots)
                usedPerformers.Add(assignment.PerformerId);
            remapped.Add(new SegmentStudioSegmentSlot
            {
                ItemId = itemId,
                SlotDefinitionId = target.Id,
                PerformerId = assignment.PerformerId,
                CreatedAt = DateTime.UtcNow,
            });
        }

        db.RemoveRange(existing);
        db.AddRange(remapped);
        if (autoAssignMissingSlots
            && db.Model.FindEntityType(typeof(SegmentStudioItem)) is not null)
        {
            var itemLocation = await db.Set<SegmentStudioItem>().AsNoTracking()
                .Where(item => item.Id == itemId)
                .Select(item => new { item.VideoId, item.NativeSegmentId })
                .SingleOrDefaultAsync(ct);
            var videoId = itemLocation?.VideoId;
            if (videoId is null && itemLocation?.NativeSegmentId is int nativeSegmentId
                && db.Model.FindEntityType(typeof(Segment)) is not null)
                videoId = await db.Set<Segment>().AsNoTracking()
                    .Where(segment => segment.Id == nativeSegmentId
                        && segment.HostType == SegmentHostType.Video)
                    .Select(segment => (int?)segment.HostId)
                    .SingleOrDefaultAsync(ct);
            if (videoId is not null)
            {
                var retained = remapped.ToDictionary(
                    assignment => assignment.SlotDefinitionId,
                    assignment => assignment.PerformerId);
                var completed = await PerformerSlotAutoAssignmentService.FindUniqueAssignmentAsync(
                    db, videoId.Value, targetTagId, ct, retained);
                if (completed is not null)
                    db.AddRange(completed
                        .Where(pair => !retained.ContainsKey(pair.Key))
                        .Select(pair => new SegmentStudioSegmentSlot
                        {
                            ItemId = itemId,
                            SlotDefinitionId = pair.Key,
                            PerformerId = pair.Value,
                            CreatedAt = DateTime.UtcNow,
                        }));
            }
        }
    }

    private static string LabelKey(string? label) => label is null ? "\0" : $"\u0001{label}";

    private static bool SameGender(string hint, string? gender) =>
        gender is not null
        && string.Equals(
            hint.Replace("_", "", StringComparison.Ordinal),
            gender.Replace("_", "", StringComparison.Ordinal),
            StringComparison.OrdinalIgnoreCase);

    private sealed record TargetDefinition(
        Guid Id,
        string? Label,
        int SortOrder,
        IReadOnlyList<string> GenderHints);
}
