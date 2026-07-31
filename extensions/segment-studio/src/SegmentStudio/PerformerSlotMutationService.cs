using System.Security.Cryptography;
using System.Text;
using Cove.Core.Entities;
using Microsoft.EntityFrameworkCore;

namespace SegmentStudio;

public sealed record SlotDefinitionInput(Guid? Id, string? Label, int SortOrder, IReadOnlyList<string>? GenderHints);
public sealed record SlotDefinitionSetUpdate(string? Revision, bool AllowSamePerformerInMultipleSlots, IReadOnlyList<SlotDefinitionInput>? Definitions, bool ConfirmDeleteAssigned = false);
public sealed record SlotAssignmentInput(Guid SlotDefinitionId, int? PerformerId);
public sealed record SlotAssignmentUpdate(string? Revision, IReadOnlyList<SlotAssignmentInput>? Assignments);
public sealed record SlotDefinitionView(Guid Id, string? Label, int SortOrder, IReadOnlyList<string> GenderHints, int AssignmentCount);
public sealed record SlotDefinitionSetView(int TagId, string Revision, bool AllowSamePerformerInMultipleSlots, IReadOnlyList<SlotDefinitionView> Definitions);
public sealed record SlotDefinitionSummaryView(Guid Id, string? Label, int SortOrder, IReadOnlyList<string> GenderHints);
public sealed record SlotDefinitionSetSummaryView(
    int TagId,
    string TagName,
    bool AllowSamePerformerInMultipleSlots,
    IReadOnlyList<SlotDefinitionSummaryView> Definitions);
public sealed record SlotAssignmentView(long SegmentId, string Revision, IReadOnlyList<PerformerSlotEditorItem> Slots);
public enum SlotMutationStatus { Updated, Invalid, NotFound, Conflict }
public sealed record SlotMutationResult<T>(SlotMutationStatus Status, T? Value = default, string? Error = null);

public static class PerformerSlotMutationService
{
    private static readonly HashSet<string> AllowedHints =
        ["MALE", "FEMALE", "TRANSGENDER_MALE", "TRANSGENDER_FEMALE"];

    public static async Task<IReadOnlyList<SlotDefinitionSetSummaryView>> ListDefinitionSummariesAsync(
        DbContext db,
        CancellationToken ct)
    {
        var sets = await (
            from set in db.Set<SegmentStudioSlotDefinitionSet>().AsNoTracking()
            join tag in db.Set<Tag>().AsNoTracking() on set.TagId equals tag.Id
            where db.Set<SegmentStudioSlotDefinition>().Any(definition =>
                definition.SlotDefinitionSetId == set.Id)
            select new
            {
                set.Id,
                set.TagId,
                TagName = tag.Name,
                set.AllowSamePerformerInMultipleSlots,
            }).ToListAsync(ct);
        if (sets.Count == 0) return [];

        var setIds = sets.Select(set => set.Id).ToArray();
        var definitions = await db.Set<SegmentStudioSlotDefinition>().AsNoTracking()
            .Where(definition => setIds.Contains(definition.SlotDefinitionSetId))
            .Select(definition => new
            {
                definition.Id,
                definition.SlotDefinitionSetId,
                definition.Label,
                definition.SortOrder,
            })
            .ToListAsync(ct);
        var definitionIds = definitions.Select(definition => definition.Id).ToArray();
        var hints = await db.Set<SegmentStudioSlotDefinitionGenderHint>().AsNoTracking()
            .Where(hint => definitionIds.Contains(hint.SlotDefinitionId))
            .Select(hint => new { hint.SlotDefinitionId, hint.GenderHint })
            .ToListAsync(ct);
        var hintsByDefinition = hints
            .GroupBy(hint => hint.SlotDefinitionId)
            .ToDictionary(
                group => group.Key,
                group => (IReadOnlyList<string>)group
                    .Select(hint => hint.GenderHint)
                    .Order(StringComparer.Ordinal)
                    .ToArray());

        return sets
            .OrderBy(set => set.TagName, StringComparer.OrdinalIgnoreCase)
            .ThenBy(set => set.TagId)
            .Select(set => new SlotDefinitionSetSummaryView(
                set.TagId,
                set.TagName,
                set.AllowSamePerformerInMultipleSlots,
                definitions
                    .Where(definition => definition.SlotDefinitionSetId == set.Id)
                    .OrderBy(definition => definition.SortOrder)
                    .ThenBy(definition => definition.Id)
                    .Select(definition => new SlotDefinitionSummaryView(
                        definition.Id,
                        definition.Label,
                        definition.SortOrder,
                        hintsByDefinition.GetValueOrDefault(definition.Id) ?? []))
                    .ToArray()))
            .ToArray();
    }

    public static async Task<SlotDefinitionSetView?> LoadDefinitionsAsync(DbContext db, int tagId, CancellationToken ct)
    {
        var set = await (from candidate in db.Set<SegmentStudioSlotDefinitionSet>().AsNoTracking()
                         join tag in db.Set<Tag>().AsNoTracking() on candidate.TagId equals tag.Id
                         where candidate.TagId == tagId
                         select candidate).SingleOrDefaultAsync(ct);
        if (set is null) return null;
        var definitions = await db.Set<SegmentStudioSlotDefinition>().AsNoTracking()
            .Where(definition => definition.SlotDefinitionSetId == set.Id)
            .OrderBy(definition => definition.SortOrder).ThenBy(definition => definition.Id).ToListAsync(ct);
        var ids = definitions.Select(definition => definition.Id).ToArray();
        var hints = await db.Set<SegmentStudioSlotDefinitionGenderHint>().AsNoTracking()
            .Where(hint => ids.Contains(hint.SlotDefinitionId)).ToListAsync(ct);
        var assignments = await db.Set<SegmentStudioSegmentSlot>().AsNoTracking()
            .Where(slot => ids.Contains(slot.SlotDefinitionId))
            .Select(slot => new DefinitionAssignmentIdentity(slot.SlotDefinitionId, slot.ItemId, slot.PerformerId))
            .ToListAsync(ct);
        var views = definitions.Select(definition => new SlotDefinitionView(definition.Id, definition.Label,
            definition.SortOrder, hints.Where(hint => hint.SlotDefinitionId == definition.Id).Select(hint => hint.GenderHint)
                .Order(StringComparer.Ordinal).ToArray(), assignments.Count(item => item.SlotDefinitionId == definition.Id))).ToArray();
        return new(tagId, Revision(set.AllowSamePerformerInMultipleSlots, views, assignments), set.AllowSamePerformerInMultipleSlots, views);
    }

    public static async Task<SlotMutationResult<SlotDefinitionSetView>> UpdateDefinitionsAsync(
        DbContext db, int tagId, SlotDefinitionSetUpdate request, CancellationToken ct)
    {
        var strategy = db.Database.CreateExecutionStrategy();
        return await strategy.ExecuteAsync(() => UpdateDefinitionsCoreAsync(db, tagId, request, ct));
    }

    private static async Task<SlotMutationResult<SlotDefinitionSetView>> UpdateDefinitionsCoreAsync(
        DbContext db, int tagId, SlotDefinitionSetUpdate request, CancellationToken ct)
    {
        var inputs = request.Definitions ?? [];
        if (inputs.Count > 64 || inputs.Select(item => item.SortOrder).Distinct().Count() != inputs.Count
            || inputs.Any(item => item.SortOrder < 0 || item.SortOrder > 10_000 || item.Label?.Length > 200
                || (item.GenderHints ?? []).Any(hint => !AllowedHints.Contains(hint))))
            return new(SlotMutationStatus.Invalid, Error: "Slot definitions, ordering, labels, or gender hints are invalid.");
        if (!await db.Set<Tag>().AsNoTracking().AnyAsync(tag => tag.Id == tagId, ct))
            return new(SlotMutationStatus.NotFound, Error: "Activity tag not found.");
        await using var transaction = db.Database.IsRelational() ? await db.Database.BeginTransactionAsync(ct) : null;
        await LockSlotTablesAsync(db, ct);
        var current = await LoadDefinitionsAsync(db, tagId, ct);
        if (current is not null && current.Revision != request.Revision)
            return new(SlotMutationStatus.Conflict, current, "Slot definitions changed in another session.");
        if (current is null && !string.IsNullOrEmpty(request.Revision))
            return new(SlotMutationStatus.Conflict, Error: "Slot definitions changed in another session.");

        var set = await db.Set<SegmentStudioSlotDefinitionSet>().SingleOrDefaultAsync(candidate => candidate.TagId == tagId, ct);
        if (set is null)
        {
            set = new() { Id = Guid.NewGuid(), TagId = tagId, CreatedAt = DateTime.UtcNow };
            db.Add(set);
        }
        set.AllowSamePerformerInMultipleSlots = request.AllowSamePerformerInMultipleSlots;
        var existing = await db.Set<SegmentStudioSlotDefinition>()
            .Where(definition => definition.SlotDefinitionSetId == set.Id).ToListAsync(ct);
        var requestedIds = inputs.Where(item => item.Id.HasValue).Select(item => item.Id!.Value).ToHashSet();
        if (requestedIds.Any(id => existing.All(item => item.Id != id)))
            return new(SlotMutationStatus.Invalid, Error: "A slot identifier does not belong to this activity.");
        var removedIds = existing.Where(item => !requestedIds.Contains(item.Id)).Select(item => item.Id).ToArray();
        if (!request.ConfirmDeleteAssigned && await db.Set<SegmentStudioSegmentSlot>().AsNoTracking().AnyAsync(slot => removedIds.Contains(slot.SlotDefinitionId), ct))
            return new(SlotMutationStatus.Invalid, Error: "Deleting an assigned slot requires explicit confirmation.");
        if (!request.AllowSamePerformerInMultipleSlots)
        {
            var retainedIds = existing.Where(item => requestedIds.Contains(item.Id)).Select(item => item.Id).ToArray();
            var hasDuplicates = await db.Set<SegmentStudioSegmentSlot>().AsNoTracking()
                .Where(slot => retainedIds.Contains(slot.SlotDefinitionId))
                .GroupBy(slot => new { slot.ItemId, slot.PerformerId }).AnyAsync(group => group.Count() > 1, ct);
            if (hasDuplicates) return new(SlotMutationStatus.Invalid, Error: "Existing assignments contain duplicate performers; clear them before tightening the policy.");
        }
        db.RemoveRange(existing.Where(item => !requestedIds.Contains(item.Id)));
        // Avoid transient collisions on the unique (set, sort_order) index when two stable slots swap positions.
        foreach (var (definition, index) in existing.Where(item => requestedIds.Contains(item.Id)).OrderBy(item => item.Id).Select((item, index) => (item, index)))
            definition.SortOrder = 1_000_000 + index;
        if (db.Database.IsRelational()) await db.SaveChangesAsync(ct);
        foreach (var input in inputs)
        {
            var definition = input.Id is Guid id ? existing.Single(item => item.Id == id) : new SegmentStudioSlotDefinition
                { Id = Guid.NewGuid(), SlotDefinitionSetId = set.Id, CreatedAt = DateTime.UtcNow };
            if (input.Id is null) db.Add(definition);
            definition.Label = string.IsNullOrWhiteSpace(input.Label) ? null : input.Label.Trim();
            definition.SortOrder = input.SortOrder;
            var oldHints = await db.Set<SegmentStudioSlotDefinitionGenderHint>().Where(hint => hint.SlotDefinitionId == definition.Id).ToListAsync(ct);
            db.RemoveRange(oldHints);
            foreach (var hint in (input.GenderHints ?? []).Distinct()) db.Add(new SegmentStudioSlotDefinitionGenderHint { SlotDefinitionId = definition.Id, GenderHint = hint });
        }
        await db.SaveChangesAsync(ct);
        if (transaction is not null) await transaction.CommitAsync(ct);
        return new(SlotMutationStatus.Updated, await LoadDefinitionsAsync(db, tagId, ct));
    }

    public static async Task<SlotMutationResult<SlotAssignmentView>> UpdateAssignmentsAsync(
        DbContext db, int videoId, int segmentId, SlotAssignmentUpdate request, CancellationToken ct)
    {
        var strategy = db.Database.CreateExecutionStrategy();
        return await strategy.ExecuteAsync(() => UpdateAssignmentsCoreAsync(db, videoId, segmentId, request, ct));
    }

    private static async Task<SlotMutationResult<SlotAssignmentView>> UpdateAssignmentsCoreAsync(
        DbContext db, int videoId, int segmentId, SlotAssignmentUpdate request, CancellationToken ct)
    {
        await using var transaction = db.Database.IsRelational() ? await db.Database.BeginTransactionAsync(ct) : null;
        await LockSlotTablesAsync(db, ct);
        var segment = await (from item in db.Set<Segment>().AsNoTracking()
                             join tag in db.Set<Tag>().AsNoTracking() on item.TagId equals tag.Id
                             where item.Id == segmentId && item.HostType == SegmentHostType.Video
                                 && item.HostId == videoId && item.Kind == "tag"
                             select item).SingleOrDefaultAsync(ct);
        if (segment is null) return new(SlotMutationStatus.NotFound, Error: "Segment not found.");
        var definitions = await LoadDefinitionsAsync(db, segment.TagId!.Value, ct);
        if (definitions is null) return new(SlotMutationStatus.Invalid, Error: "This activity has no performer slots.");
        var currentSlots = await PerformerSlotEditorService.LoadAsync(db, new Dictionary<int, int> { [segmentId] = segment.TagId.Value }, ct);
        var definitionRevision = AssignmentDefinitionRevision(definitions);
        var currentRevision = AssignmentRevision(definitionRevision, currentSlots);
        var currentView = new SlotAssignmentView(segmentId, currentRevision, currentSlots);
        if (request.Revision != currentRevision) return new(SlotMutationStatus.Conflict, currentView, "Slot assignments changed in another session.");
        var requestedAssignments = request.Assignments ?? [];
        if (requestedAssignments.Select(item => item.SlotDefinitionId).Distinct().Count() != requestedAssignments.Count
            || requestedAssignments.Any(item => definitions.Definitions.All(definition => definition.Id != item.SlotDefinitionId)))
            return new(SlotMutationStatus.Invalid, Error: "Every slot must belong to the segment activity and appear at most once.");
        var performers = requestedAssignments.Where(item => item.PerformerId.HasValue).Select(item => item.PerformerId!.Value).ToArray();
        if (!definitions.AllowSamePerformerInMultipleSlots && performers.Distinct().Count() != performers.Length)
            return new(SlotMutationStatus.Invalid, Error: "The same performer cannot be assigned to multiple slots for this activity.");
        if (await db.Set<Performer>().AsNoTracking().CountAsync(item => performers.Contains(item.Id), ct) != performers.Distinct().Count())
            return new(SlotMutationStatus.Invalid, Error: "An assigned performer does not exist.");
        var studioItem = await db.Set<SegmentStudioItem>().SingleOrDefaultAsync(item => item.NativeSegmentId == segmentId, ct);
        if (studioItem is null && requestedAssignments.Any(item => item.PerformerId.HasValue))
        {
            studioItem = new SegmentStudioItem
            {
                NativeSegmentId = segmentId,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow,
            };
            db.Add(studioItem);
        }
        var ids = definitions.Definitions.Select(item => item.Id).ToArray();
        var existing = await db.Set<SegmentStudioSegmentSlot>()
            .Where(slot => slot.Item.NativeSegmentId == segmentId && ids.Contains(slot.SlotDefinitionId)).ToListAsync(ct);
        var requestedByDefinition = requestedAssignments.ToDictionary(item => item.SlotDefinitionId);
        db.RemoveRange(existing.Where(item => !requestedByDefinition.TryGetValue(item.SlotDefinitionId, out var requested) || requested.PerformerId is null));
        foreach (var item in requestedAssignments.Where(item => item.PerformerId.HasValue))
        {
            var tracked = existing.SingleOrDefault(slot => slot.SlotDefinitionId == item.SlotDefinitionId);
            if (tracked is not null) tracked.PerformerId = item.PerformerId!.Value;
            else db.Add(new SegmentStudioSegmentSlot
                { Item = studioItem!, SlotDefinitionId = item.SlotDefinitionId, PerformerId = item.PerformerId!.Value, CreatedAt = DateTime.UtcNow });
        }
        await db.SaveChangesAsync(ct);
        if (transaction is not null) await transaction.CommitAsync(ct);
        var saved = await PerformerSlotEditorService.LoadAsync(db, new Dictionary<int, int> { [segmentId] = segment.TagId.Value }, ct);
        return new(SlotMutationStatus.Updated, new(segmentId, AssignmentRevision(definitionRevision, saved), saved));
    }

    public static async Task<SlotMutationResult<SlotAssignmentView>> UpdateOwnedAssignmentsAsync(
        DbContext db, int videoId, long itemId, SlotAssignmentUpdate request, CancellationToken ct)
    {
        var strategy = db.Database.CreateExecutionStrategy();
        return await strategy.ExecuteAsync(async () =>
        {
            await using var transaction = db.Database.IsRelational() ? await db.Database.BeginTransactionAsync(ct) : null;
            await SegmentStudioReviewLock.AcquireAsync(db, videoId, ct);
            await LockSlotTablesAsync(db, ct);
            var item = await db.Set<SegmentStudioItem>().SingleOrDefaultAsync(candidate =>
                candidate.Id == itemId && candidate.NativeSegmentId == null
                && candidate.VideoId == videoId && candidate.ReviewState != null, ct);
            if (item is null || item.TagId is null)
                return new SlotMutationResult<SlotAssignmentView>(SlotMutationStatus.NotFound, Error: "Draft not found.");
            var definitions = await LoadDefinitionsAsync(db, item.TagId.Value, ct);
            if (definitions is null)
                return new SlotMutationResult<SlotAssignmentView>(SlotMutationStatus.Invalid, Error: "This activity has no performer slots.");
            var editorId = -itemId;
            var currentSlots = await PerformerSlotEditorService.LoadUnifiedAsync(
                db, new Dictionary<int, int>(), new Dictionary<long, int> { [itemId] = item.TagId.Value }, ct);
            var definitionRevision = AssignmentDefinitionRevision(definitions);
            var currentRevision = AssignmentRevision(definitionRevision, currentSlots);
            var currentView = new SlotAssignmentView(editorId, currentRevision, currentSlots);
            if (request.Revision != currentRevision)
                return new SlotMutationResult<SlotAssignmentView>(
                    SlotMutationStatus.Conflict, currentView, "Slot assignments changed in another session.");
            var requestedAssignments = request.Assignments ?? [];
            if (requestedAssignments.Select(candidate => candidate.SlotDefinitionId).Distinct().Count() != requestedAssignments.Count
                || requestedAssignments.Any(candidate => definitions.Definitions.All(definition => definition.Id != candidate.SlotDefinitionId)))
                return new SlotMutationResult<SlotAssignmentView>(
                    SlotMutationStatus.Invalid, Error: "Every slot must belong to the draft activity and appear at most once.");
            var performers = requestedAssignments.Where(candidate => candidate.PerformerId.HasValue)
                .Select(candidate => candidate.PerformerId!.Value).ToArray();
            if (!definitions.AllowSamePerformerInMultipleSlots && performers.Distinct().Count() != performers.Length)
                return new SlotMutationResult<SlotAssignmentView>(
                    SlotMutationStatus.Invalid, Error: "The same performer cannot be assigned to multiple slots for this activity.");
            if (await db.Set<Performer>().AsNoTracking().CountAsync(candidate => performers.Contains(candidate.Id), ct)
                != performers.Distinct().Count())
                return new SlotMutationResult<SlotAssignmentView>(
                    SlotMutationStatus.Invalid, Error: "An assigned performer does not exist.");
            var definitionIds = definitions.Definitions.Select(definition => definition.Id).ToArray();
            var existing = await db.Set<SegmentStudioSegmentSlot>()
                .Where(slot => slot.ItemId == itemId && definitionIds.Contains(slot.SlotDefinitionId))
                .ToListAsync(ct);
            var requestedByDefinition = requestedAssignments.ToDictionary(candidate => candidate.SlotDefinitionId);
            var existingAssignments = existing
                .ToDictionary(slot => slot.SlotDefinitionId, slot => (int?)slot.PerformerId);
            var desiredAssignments = requestedAssignments
                .Where(assignment => assignment.PerformerId.HasValue)
                .ToDictionary(assignment => assignment.SlotDefinitionId, assignment => assignment.PerformerId);
            var changed = existingAssignments.Count != desiredAssignments.Count
                || existingAssignments.Any(pair =>
                    !desiredAssignments.TryGetValue(pair.Key, out var performerId)
                    || performerId != pair.Value);
            if (!changed)
            {
                if (transaction is not null)
                    await transaction.CommitAsync(ct);
                return new SlotMutationResult<SlotAssignmentView>(SlotMutationStatus.Updated, currentView);
            }
            db.RemoveRange(existing.Where(slot =>
                !requestedByDefinition.TryGetValue(slot.SlotDefinitionId, out var requested)
                || requested.PerformerId is null));
            foreach (var assignment in requestedAssignments.Where(candidate => candidate.PerformerId.HasValue))
            {
                var tracked = existing.SingleOrDefault(slot => slot.SlotDefinitionId == assignment.SlotDefinitionId);
                if (tracked is not null)
                    tracked.PerformerId = assignment.PerformerId!.Value;
                else
                    db.Add(new SegmentStudioSegmentSlot
                    {
                        ItemId = itemId,
                        SlotDefinitionId = assignment.SlotDefinitionId,
                        PerformerId = assignment.PerformerId!.Value,
                        CreatedAt = DateTime.UtcNow,
                    });
            }
            item.Revision++;
            item.UpdatedAt = DateTime.UtcNow;
            await db.SaveChangesAsync(ct);
            if (transaction is not null)
                await transaction.CommitAsync(ct);
            var saved = await PerformerSlotEditorService.LoadUnifiedAsync(
                db, new Dictionary<int, int>(), new Dictionary<long, int> { [itemId] = item.TagId.Value }, ct);
            return new SlotMutationResult<SlotAssignmentView>(
                SlotMutationStatus.Updated,
                new(editorId, AssignmentRevision(definitionRevision, saved), saved));
        });
    }

    public static async Task<IReadOnlyDictionary<int, string>> LoadAssignmentRevisionsAsync(
        DbContext db, IReadOnlyDictionary<int, int> segmentTagIds, IReadOnlyList<PerformerSlotEditorItem> slots, CancellationToken ct)
    {
        var result = new Dictionary<int, string>();
        foreach (var (segmentId, tagId) in segmentTagIds)
        {
            var definitions = await LoadDefinitionsAsync(db, tagId, ct);
            if (definitions is not null)
                result[segmentId] = AssignmentRevision(AssignmentDefinitionRevision(definitions), slots.Where(slot => slot.SegmentId == segmentId));
        }
        return result;
    }

    public static async Task<IReadOnlyDictionary<long, string>> LoadUnifiedAssignmentRevisionsAsync(
        DbContext db,
        IReadOnlyDictionary<int, int> nativeSegmentTagIds,
        IReadOnlyDictionary<long, int> ownedItemTagIds,
        IReadOnlyList<PerformerSlotEditorItem> slots,
        CancellationToken ct)
    {
        var result = new Dictionary<long, string>();
        foreach (var (segmentId, tagId) in nativeSegmentTagIds)
        {
            var definitions = await LoadDefinitionsAsync(db, tagId, ct);
            if (definitions is not null)
                result[segmentId] = AssignmentRevision(
                    AssignmentDefinitionRevision(definitions), slots.Where(slot => slot.SegmentId == segmentId));
        }
        foreach (var (itemId, tagId) in ownedItemTagIds)
        {
            var definitions = await LoadDefinitionsAsync(db, tagId, ct);
            if (definitions is not null)
                result[-itemId] = AssignmentRevision(
                    AssignmentDefinitionRevision(definitions), slots.Where(slot => slot.SegmentId == -itemId));
        }
        return result;
    }

    public static async Task<IReadOnlyList<int>> LoadAffectedVideoIdsAsync(
        DbContext db, int tagId, IReadOnlyList<SlotDefinitionInput>? requestedDefinitions, CancellationToken ct)
    {
        var retainedIds = (requestedDefinitions ?? []).Where(item => item.Id.HasValue).Select(item => item.Id!.Value).ToArray();
        var removedIds = await (from definition in db.Set<SegmentStudioSlotDefinition>().AsNoTracking()
                                join set in db.Set<SegmentStudioSlotDefinitionSet>().AsNoTracking() on definition.SlotDefinitionSetId equals set.Id
                                join tag in db.Set<Tag>().AsNoTracking() on set.TagId equals tag.Id
                                where set.TagId == tagId && !retainedIds.Contains(definition.Id)
                                select definition.Id).ToArrayAsync(ct);
        if (removedIds.Length == 0) return [];
        return await (from slot in db.Set<SegmentStudioSegmentSlot>().AsNoTracking()
                      join item in db.Set<SegmentStudioItem>().AsNoTracking() on slot.ItemId equals item.Id
                      join segment in db.Set<Segment>().AsNoTracking() on item.NativeSegmentId equals segment.Id
                      join video in db.Set<Video>().IgnoreQueryFilters().AsNoTracking() on segment.HostId equals video.Id
                      where removedIds.Contains(slot.SlotDefinitionId) && segment.HostType == SegmentHostType.Video
                      select video.Id).Distinct().OrderBy(id => id).ToListAsync(ct);
    }

    private static string Revision(bool allowDuplicates, IEnumerable<SlotDefinitionView> definitions,
        IEnumerable<DefinitionAssignmentIdentity> assignments) => Hash(
        System.Text.Json.JsonSerializer.Serialize(new { allowDuplicates, definitions = definitions.Select(item => new
            { item.Id, item.SortOrder, item.Label, item.GenderHints, item.AssignmentCount }), assignments = assignments
                .OrderBy(item => item.SlotDefinitionId).ThenBy(item => item.ItemId).ThenBy(item => item.PerformerId) }));
    private static string AssignmentRevision(string definitionRevision, IEnumerable<PerformerSlotEditorItem> slots) => Hash(
        System.Text.Json.JsonSerializer.Serialize(new { definitionRevision, assignments = slots.OrderBy(item => item.SlotDefinitionId)
            .Select(item => new { item.SlotDefinitionId, item.PerformerId }) }));
    private static string AssignmentDefinitionRevision(SlotDefinitionSetView view) => Hash(
        System.Text.Json.JsonSerializer.Serialize(new { view.AllowSamePerformerInMultipleSlots, definitions = view.Definitions.Select(item => new
            { item.Id, item.SortOrder, item.Label, item.GenderHints }) }));
    private static string Hash(string value) => Convert.ToHexString(SHA256.HashData(Encoding.UTF8.GetBytes(value))).ToLowerInvariant();

    internal static Task LockSlotTablesAsync(DbContext db, CancellationToken ct) => !db.Database.IsRelational()
        ? Task.CompletedTask
        : db.Database.ExecuteSqlRawAsync(
            "LOCK TABLE segment_studio_slot_definition_sets, segment_studio_slot_definitions, segment_studio_segment_slots IN SHARE ROW EXCLUSIVE MODE", ct);

    private sealed record DefinitionAssignmentIdentity(Guid SlotDefinitionId, long ItemId, int PerformerId);
}
