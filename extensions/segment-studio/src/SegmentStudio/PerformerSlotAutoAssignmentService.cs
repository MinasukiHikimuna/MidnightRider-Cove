using Cove.Core.Entities;
using Microsoft.EntityFrameworkCore;

namespace SegmentStudio;

public sealed record AutoAssignmentSlot(
    Guid Id,
    string? Label,
    int SortOrder,
    IReadOnlyList<string> GenderHints);

public sealed record AutoAssignmentPerformer(int Id, string Name, string? Gender);

public sealed record BulkAutoAssignmentResult(int AssignedSegmentCount, int AssignedSlotCount);
public sealed record BulkAutoAssignmentRequest(
    IReadOnlyList<int>? NativeSegmentIds,
    IReadOnlyList<long>? ItemIds);

public static class PerformerSlotAutoAssignmentService
{
    public static IReadOnlyDictionary<Guid, int>? FindUniqueAssignment(
        IReadOnlyList<AutoAssignmentSlot> slots,
        IReadOnlyList<AutoAssignmentPerformer> videoPerformers,
        bool allowSamePerformerInMultipleSlots,
        IReadOnlyDictionary<Guid, int>? existingAssignments = null)
    {
        if (slots.Count == 0 || videoPerformers.Count == 0)
            return null;
        var hasLabels = slots.Any(slot => !string.IsNullOrWhiteSpace(slot.Label));
        var hasUnlabeled = slots.Any(slot => string.IsNullOrWhiteSpace(slot.Label));
        if (hasLabels && hasUnlabeled)
            return null;

        Dictionary<Guid, int>? unique = null;
        var semanticCombinations = new HashSet<string>(StringComparer.Ordinal);
        if (!hasLabels && slots.All(slot => slot.GenderHints.Count == 0)
            && slots.Count == videoPerformers.Count && !allowSamePerformerInMultipleSlots
            && (existingAssignments is null || existingAssignments.Count == 0))
        {
            var orderedSlots = slots.OrderBy(slot => slot.Id).ToArray();
            var orderedPerformers = videoPerformers
                .OrderBy(performer => performer.Name, StringComparer.OrdinalIgnoreCase)
                .ThenBy(performer => performer.Id).ToArray();
            return orderedSlots.Select((slot, index) => new
                { SlotId = slot.Id, PerformerId = orderedPerformers[index].Id })
                .ToDictionary(pair => pair.SlotId, pair => pair.PerformerId);
        }
        var current = existingAssignments is null
            ? new Dictionary<Guid, int>()
            : new Dictionary<Guid, int>(existingAssignments);
        var used = allowSamePerformerInMultipleSlots
            ? new HashSet<int>()
            : current.Values.ToHashSet();
        Search(0, current, used);
        return semanticCombinations.Count == 1 ? unique : null;

        void Search(int slotIndex, Dictionary<Guid, int> current, HashSet<int> used)
        {
            if (semanticCombinations.Count > 1)
                return;
            if (slotIndex == slots.Count)
            {
                var key = string.Join("|", slots
                    .GroupBy(slot => slot.Label ?? "", StringComparer.Ordinal)
                    .Select(group => $"{group.Key}:{string.Join(",", group
                        .Select(slot => current[slot.Id]).Order())}"));
                if (semanticCombinations.Add(key))
                    unique = new Dictionary<Guid, int>(current);
                return;
            }

            var slot = slots[slotIndex];
            if (current.ContainsKey(slot.Id))
            {
                Search(slotIndex + 1, current, used);
                return;
            }
            foreach (var performer in videoPerformers)
            {
                if (!allowSamePerformerInMultipleSlots && used.Contains(performer.Id))
                    continue;
                if (slot.GenderHints.Count != 0
                    && !slot.GenderHints.Any(hint => SameGender(hint, performer.Gender)))
                    continue;
                current[slot.Id] = performer.Id;
                if (!allowSamePerformerInMultipleSlots)
                    used.Add(performer.Id);
                Search(slotIndex + 1, current, used);
                if (!allowSamePerformerInMultipleSlots)
                    used.Remove(performer.Id);
                current.Remove(slot.Id);
            }
        }
    }

    public static async Task<bool> TryAssignItemAsync(
        DbContext db, SegmentStudioItem item, CancellationToken ct, int? knownVideoId = null)
    {
        if (item.TagId is null)
            return false;
        return await TryAssignItemAsync(db, item, knownVideoId ?? item.VideoId, item.TagId.Value, ct);
    }

    private static async Task<bool> TryAssignItemAsync(
        DbContext db, SegmentStudioItem item, int? videoId, int tagId, CancellationToken ct)
    {
        if (videoId is null && item.NativeSegmentId is not null)
            videoId = await db.Set<Segment>().AsNoTracking()
                .Where(segment => segment.Id == item.NativeSegmentId
                    && segment.HostType == SegmentHostType.Video)
                .Select(segment => (int?)segment.HostId)
                .SingleOrDefaultAsync(ct);
        if (videoId is null)
            return false;
        var existing = await db.Set<SegmentStudioSegmentSlot>().AsNoTracking()
            .Where(slot => slot.ItemId == item.Id)
            .ToDictionaryAsync(slot => slot.SlotDefinitionId, slot => slot.PerformerId, ct);
        var assignment = await FindUniqueAssignmentAsync(db, videoId.Value, tagId, ct, existing);
        if (assignment is null)
            return false;
        var additions = assignment.Where(pair => !existing.ContainsKey(pair.Key)).ToArray();
        if (additions.Length == 0)
            return false;
        db.AddRange(additions.Select(pair => new SegmentStudioSegmentSlot
        {
            ItemId = item.Id,
            SlotDefinitionId = pair.Key,
            PerformerId = pair.Value,
            CreatedAt = DateTime.UtcNow,
        }));
        return true;
    }

    public static async Task<BulkAutoAssignmentResult> AssignEmptySegmentsAsync(
        DbContext db, int videoId, CancellationToken ct,
        IReadOnlyCollection<int>? nativeSegmentIds = null,
        IReadOnlyCollection<long>? itemIds = null)
    {
        var nativeSegments = await db.Set<Segment>().AsNoTracking()
            .Where(segment => segment.HostType == SegmentHostType.Video
                && segment.HostId == videoId && segment.Kind == "tag" && segment.TagId != null
                && (nativeSegmentIds == null || nativeSegmentIds.Contains(segment.Id)))
            .Select(segment => new { segment.Id, TagId = segment.TagId!.Value })
            .OrderBy(segment => segment.Id)
            .ToListAsync(ct);
        var nativeIds = nativeSegments.Select(segment => segment.Id).ToArray();
        var anchors = await db.Set<SegmentStudioItem>()
            .Where(item => item.NativeSegmentId != null && nativeIds.Contains(item.NativeSegmentId.Value))
            .ToDictionaryAsync(item => item.NativeSegmentId!.Value, ct);
        var ownedItems = await db.Set<SegmentStudioItem>()
            .Where(item => item.NativeSegmentId == null && item.VideoId == videoId && item.TagId != null
                && (itemIds == null || itemIds.Contains(item.Id))
                && !db.Set<SegmentStudioSegmentSlot>().Any(slot => slot.ItemId == item.Id))
            .OrderBy(item => item.Id)
            .ToListAsync(ct);
        var assignedSegments = 0;
        var assignedSlots = 0;
        foreach (var segment in nativeSegments)
        {
            if (!anchors.TryGetValue(segment.Id, out var item))
            {
                var assignment = await FindUniqueAssignmentAsync(db, videoId, segment.TagId, ct);
                if (assignment is null)
                    continue;
                item = new SegmentStudioItem
                {
                    NativeSegmentId = segment.Id,
                    CreatedAt = DateTime.UtcNow,
                    UpdatedAt = DateTime.UtcNow,
                };
                db.Add(item);
                anchors[segment.Id] = item;
                AddAssignments(db, item, assignment);
                assignedSegments++;
                assignedSlots += assignment.Count;
                continue;
            }
            if (await AssignAndCountAsync(item, segment.TagId))
                assignedSegments++;
        }
        foreach (var item in ownedItems)
        {
            if (await AssignAndCountAsync(item, item.TagId!.Value))
                assignedSegments++;
        }
        if (assignedSegments != 0)
            await db.SaveChangesAsync(ct);
        return new(assignedSegments, assignedSlots);

        async Task<bool> AssignAndCountAsync(SegmentStudioItem item, int tagId)
        {
            var before = db.ChangeTracker.Entries<SegmentStudioSegmentSlot>().Count(entry =>
                entry.State == EntityState.Added);
            if (!await TryAssignItemAsync(db, item, videoId, tagId, ct))
                return false;
            assignedSlots += db.ChangeTracker.Entries<SegmentStudioSegmentSlot>().Count(entry =>
                entry.State == EntityState.Added) - before;
            return true;
        }
    }

    internal static async Task<IReadOnlyDictionary<Guid, int>?> FindUniqueAssignmentAsync(
        DbContext db,
        int videoId,
        int tagId,
        CancellationToken ct,
        IReadOnlyDictionary<Guid, int>? existingAssignments = null)
    {
        if (db.Model.FindEntityType(typeof(VideoPerformer)) is null
            || db.Model.FindEntityType(typeof(Performer)) is null)
            return null;
        var set = await db.Set<SegmentStudioSlotDefinitionSet>().AsNoTracking()
            .SingleOrDefaultAsync(candidate => candidate.TagId == tagId, ct);
        if (set is null)
            return null;
        var definitions = await db.Set<SegmentStudioSlotDefinition>().AsNoTracking()
            .Where(definition => definition.SlotDefinitionSetId == set.Id)
            .OrderBy(definition => definition.SortOrder).ThenBy(definition => definition.Id)
            .Select(definition => new { definition.Id, definition.Label, definition.SortOrder })
            .ToListAsync(ct);
        var ids = definitions.Select(definition => definition.Id).ToArray();
        var hints = await db.Set<SegmentStudioSlotDefinitionGenderHint>().AsNoTracking()
            .Where(hint => ids.Contains(hint.SlotDefinitionId)).ToListAsync(ct);
        var performerRows = await (
                from link in db.Set<VideoPerformer>().AsNoTracking()
                join performer in db.Set<Performer>().AsNoTracking() on link.PerformerId equals performer.Id
                where link.VideoId == videoId
                orderby performer.Name, performer.Id
                select new { performer.Id, performer.Name, performer.Gender })
            .ToListAsync(ct);
        var performers = performerRows.Select(performer => new AutoAssignmentPerformer(
            performer.Id, performer.Name, performer.Gender?.ToString())).ToArray();
        return FindUniqueAssignment(
            definitions.Select(definition => new AutoAssignmentSlot(
                definition.Id, definition.Label, definition.SortOrder,
                hints.Where(hint => hint.SlotDefinitionId == definition.Id)
                    .Select(hint => hint.GenderHint).ToArray())).ToArray(),
            performers,
            set.AllowSamePerformerInMultipleSlots,
            existingAssignments);
    }

    private static void AddAssignments(
        DbContext db, SegmentStudioItem item, IReadOnlyDictionary<Guid, int> assignment) =>
        db.AddRange(assignment.Select(pair => new SegmentStudioSegmentSlot
        {
            Item = item,
            SlotDefinitionId = pair.Key,
            PerformerId = pair.Value,
            CreatedAt = DateTime.UtcNow,
        }));

    private static bool SameGender(string hint, string? gender) =>
        gender is not null
        && string.Equals(
            hint.Replace("_", "", StringComparison.Ordinal),
            gender.Replace("_", "", StringComparison.Ordinal),
            StringComparison.OrdinalIgnoreCase);
}
