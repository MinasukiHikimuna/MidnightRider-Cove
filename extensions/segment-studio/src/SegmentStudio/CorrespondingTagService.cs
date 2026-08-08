using System.Security.Cryptography;
using System.Text;
using System.Text.Json;
using Cove.Core.Entities;
using Microsoft.EntityFrameworkCore;

namespace SegmentStudio;

public sealed record CorrespondingTagMappingUpdate(
    int SourceTagId,
    int? CorrespondingTagId,
    DateTime? ExpectedUpdatedAt = null);

public sealed record SaveCorrespondingTagMappingsRequest(
    IReadOnlyList<CorrespondingTagMappingUpdate> Mappings);

public sealed record CorrespondingTagConversionMapping(
    int SourceTagId,
    int CorrespondingTagId,
    DateTime ExpectedUpdatedAt);

public sealed record ConvertCorrespondingTagsRequest(
    Guid OperationId,
    IReadOnlyList<CorrespondingTagConversionMapping>? Mappings,
    IReadOnlyList<string>? ReviewStates,
    long ExpectedHistoryRevision = 0);

public sealed record CorrespondingTagRow(
    int SourceTagId,
    string SourceTagName,
    int? CorrespondingTagId,
    string? CorrespondingTagName,
    DateTime? MappingUpdatedAt,
    int UnreviewedCount,
    int ApprovedCount,
    int RejectedCount);

public sealed record CorrespondingTagSummary(
    int SourceTagCount,
    int MappedSourceTagCount,
    int UnreviewedReadyCount,
    int ApprovedReadyCount,
    IReadOnlyList<CorrespondingTagRow> Rows);

public sealed record CorrespondingTagSaveResult(
    bool Success,
    CorrespondingTagSummary? Value = null,
    string? Error = null,
    bool Conflict = false);

public sealed record CorrespondingTagConversion(
    long ItemId,
    int SourceTagId,
    string SourceTagName,
    int CorrespondingTagId,
    string CorrespondingTagName,
    string ReviewState,
    long PreviousRevision,
    long Revision,
    double StartSec,
    double? EndSec,
    string SourceKey,
    string? SourceRunId,
    float? Confidence);

public sealed record CorrespondingTagConversionResult(
    bool Success,
    int ConvertedCount = 0,
    int ProtectedCount = 0,
    int LineageProtectedCount = 0,
    int SlotPermissionProtectedCount = 0,
    IReadOnlyList<CorrespondingTagConversion>? Conversions = null,
    CorrespondingTagSummary? Value = null,
    string? Error = null,
    bool Replayed = false,
    SegmentStudioHistoryView? History = null,
    bool HistoryConflict = false,
    bool MappingConflict = false);

public static class CorrespondingTagService
{
    private const string ConversionOperationKind = "corresponding-tag-convert";
    private static readonly string[] ConvertibleReviewStates = ["unreviewed", "approved"];

    public static async Task<CorrespondingTagSummary> GetSummaryAsync(
        DbContext db,
        int videoId,
        CancellationToken ct)
    {
        var drafts = await LoadUnconvertedDraftsAsync(db, videoId, ct);
        if (drafts.Count == 0)
            return EmptySummary();

        var sourceTagIds = drafts.Select(row => row.SourceTagId).Distinct().ToArray();
        var mappings = await db.Set<SegmentStudioCorrespondingTagMapping>()
            .AsNoTracking()
            .Where(mapping => sourceTagIds.Contains(mapping.SourceTagId))
            .ToDictionaryAsync(mapping => mapping.SourceTagId, ct);
        var tagIds = sourceTagIds.Concat(mappings.Values
                .Select(mapping => mapping.CorrespondingTagId))
            .Distinct()
            .ToArray();
        var tags = await db.Set<Tag>().AsNoTracking()
            .Where(tag => tagIds.Contains(tag.Id))
            .ToDictionaryAsync(tag => tag.Id, tag => tag.Name, ct);

        var rows = drafts
            .GroupBy(row => row.SourceTagId)
            .Select(group =>
            {
                mappings.TryGetValue(group.Key, out var mapping);
                return new CorrespondingTagRow(
                    group.Key,
                    tags.GetValueOrDefault(group.Key) ?? $"Tag {group.Key}",
                    mapping?.CorrespondingTagId,
                    mapping is null
                        ? null
                        : tags.GetValueOrDefault(mapping.CorrespondingTagId),
                    mapping?.UpdatedAt,
                    group.Count(row => row.ReviewState == "unreviewed"),
                    group.Count(row => row.ReviewState == "approved"),
                    group.Count(row => row.ReviewState == "rejected"));
            })
            .OrderBy(row => row.SourceTagName, StringComparer.OrdinalIgnoreCase)
            .ThenBy(row => row.SourceTagId)
            .ToArray();
        return new CorrespondingTagSummary(
            rows.Length,
            rows.Count(row => row.CorrespondingTagId is not null),
            rows.Where(row => row.CorrespondingTagId is not null)
                .Sum(row => row.UnreviewedCount),
            rows.Where(row => row.CorrespondingTagId is not null)
                .Sum(row => row.ApprovedCount),
            rows);
    }

    public static async Task<CorrespondingTagSaveResult> SaveMappingsAsync(
        DbContext db,
        int videoId,
        IReadOnlyList<CorrespondingTagMappingUpdate> updates,
        CancellationToken ct)
    {
        if (updates.Count == 0)
            return new(false, Error: "Provide at least one corresponding-tag mapping.");
        if (updates.GroupBy(update => update.SourceTagId).Any(group => group.Count() > 1))
            return new(false, Error: "A source tag can only appear once.");
        if (updates.Any(update => update.SourceTagId <= 0
                || update.CorrespondingTagId is <= 0
                || update.SourceTagId == update.CorrespondingTagId))
            return new(false, Error: "Corresponding-tag mappings are invalid.");

        var strategy = db.Database.CreateExecutionStrategy();
        return await strategy.ExecuteAsync(async () =>
        {
            await using var transaction = db.Database.IsRelational()
                ? await db.Database.BeginTransactionAsync(ct)
                : null;
            await AcquireMappingLockAsync(db, ct);

            var availableSourceIds = (await LoadUnconvertedDraftsAsync(db, videoId, ct))
                .Select(row => row.SourceTagId)
                .ToHashSet();
            if (updates.Any(update => !availableSourceIds.Contains(update.SourceTagId)))
                return new CorrespondingTagSaveResult(false,
                    Error: "One or more source tags are no longer available for this video.");

            var requestedTagIds = updates.Select(update => update.SourceTagId)
                .Concat(updates.Where(update => update.CorrespondingTagId is not null)
                    .Select(update => update.CorrespondingTagId!.Value))
                .Distinct()
                .ToArray();
            var existingTagIds = await db.Set<Tag>().AsNoTracking()
                .Where(tag => requestedTagIds.Contains(tag.Id))
                .Select(tag => tag.Id)
                .ToListAsync(ct);
            if (existingTagIds.Count != requestedTagIds.Length)
                return new CorrespondingTagSaveResult(false,
                    Error: "One or more selected tags no longer exist.");

            var sourceIds = updates.Select(update => update.SourceTagId).ToArray();
            var existing = await db.Set<SegmentStudioCorrespondingTagMapping>()
                .Where(mapping => sourceIds.Contains(mapping.SourceTagId))
                .ToDictionaryAsync(mapping => mapping.SourceTagId, ct);
            var pendingUpdates = updates.Where(update =>
                    !MappingAlreadyHasDesiredValue(update, existing))
                .ToArray();
            if (pendingUpdates.Any(update => existing.TryGetValue(update.SourceTagId, out var mapping)
                    ? update.ExpectedUpdatedAt is null
                        || update.ExpectedUpdatedAt.Value != mapping.UpdatedAt
                    : update.ExpectedUpdatedAt is not null))
            {
                return new CorrespondingTagSaveResult(
                    false,
                    await GetSummaryAsync(db, videoId, ct),
                    "Corresponding-tag mappings changed in another session.",
                    Conflict: true);
            }

            var now = DateTime.UtcNow;
            foreach (var update in pendingUpdates)
            {
                if (update.CorrespondingTagId is null)
                {
                    if (existing.TryGetValue(update.SourceTagId, out var removed))
                        db.Remove(removed);
                    continue;
                }
                if (existing.TryGetValue(update.SourceTagId, out var mapping))
                {
                    mapping.CorrespondingTagId = update.CorrespondingTagId.Value;
                    mapping.UpdatedAt = now > mapping.UpdatedAt
                        ? now
                        : mapping.UpdatedAt.AddTicks(10);
                }
                else
                {
                    db.Add(new SegmentStudioCorrespondingTagMapping
                    {
                        SourceTagId = update.SourceTagId,
                        CorrespondingTagId = update.CorrespondingTagId.Value,
                        CreatedAt = now,
                        UpdatedAt = now,
                    });
                }
            }
            await db.SaveChangesAsync(ct);
            var summary = await GetSummaryAsync(db, videoId, ct);
            if (transaction is not null)
                await transaction.CommitAsync(ct);
            return new CorrespondingTagSaveResult(true, summary);
        });
    }

    private static bool MappingAlreadyHasDesiredValue(
        CorrespondingTagMappingUpdate update,
        IReadOnlyDictionary<int, SegmentStudioCorrespondingTagMapping> existing) =>
        existing.TryGetValue(update.SourceTagId, out var mapping)
            ? update.CorrespondingTagId == mapping.CorrespondingTagId
            : update.CorrespondingTagId is null;

    private static Task AcquireMappingLockAsync(DbContext db, CancellationToken ct) =>
        !db.Database.IsRelational()
            ? Task.CompletedTask
            : db.Database.ExecuteSqlInterpolatedAsync(
                $"SELECT pg_advisory_xact_lock(hashtextextended({"segment-studio:corresponding-tag-mappings"}, 0))",
                ct);

    public static async Task<CorrespondingTagConversionResult> ConvertAsync(
        DbContext db,
        int videoId,
        ConvertCorrespondingTagsRequest request,
        int? actorUserId,
        bool canManagePerformerSlots,
        CancellationToken ct)
    {
        if (request.OperationId == Guid.Empty)
            return new(false, Error: "An operation ID is required.");
        var reviewStates = (request.ReviewStates ?? [])
            .Select(state => state?.Trim().ToLowerInvariant() ?? "")
            .Distinct(StringComparer.Ordinal)
            .ToArray();
        if (reviewStates.Length == 0
            || reviewStates.Any(state => !ConvertibleReviewStates.Contains(state)))
            return new(false, Error: "Convert unreviewed, approved, or both review states.");
        var requestedMappings = (request.Mappings ?? [])
            .OrderBy(mapping => mapping.SourceTagId)
            .ToArray();
        if (requestedMappings.Length == 0
            || requestedMappings.Any(mapping => mapping.SourceTagId <= 0
                || mapping.CorrespondingTagId <= 0
                || mapping.SourceTagId == mapping.CorrespondingTagId)
            || requestedMappings.GroupBy(mapping => mapping.SourceTagId)
                .Any(group => group.Count() > 1))
            return new(false, Error: "Corresponding-tag mappings are invalid.");

        var fingerprint = Fingerprint(
            videoId,
            requestedMappings,
            reviewStates,
            request.ExpectedHistoryRevision);
        var strategy = db.Database.CreateExecutionStrategy();
        return await strategy.ExecuteAsync(async () =>
        {
            await using var transaction = db.Database.IsRelational()
                ? await db.Database.BeginTransactionAsync(ct)
                : null;
            await SegmentStudioReviewLock.AcquireAsync(db, videoId, ct);
            await AcquireMappingLockAsync(db, ct);

            var replay = await ReplayAsync(
                db, request.OperationId, fingerprint, actorUserId, ct);
            if (replay is not null)
            {
                if (transaction is not null)
                    await transaction.CommitAsync(ct);
                return replay;
            }
            var currentHistory = actorUserId is int historyUserId
                ? await SegmentStudioHistoryService.GetAsync(
                    db,
                    historyUserId,
                    videoId,
                    SegmentStudioModes.Full,
                    ct)
                : null;
            if (currentHistory is not null
                && currentHistory.Revision != request.ExpectedHistoryRevision)
            {
                if (transaction is not null)
                    await transaction.CommitAsync(ct);
                return new CorrespondingTagConversionResult(
                    false,
                    Error: "History changed in another session.",
                    History: currentHistory,
                    HistoryConflict: true);
            }

            var requestedSourceIds = requestedMappings
                .Select(mapping => mapping.SourceTagId)
                .ToArray();
            var mappings = await db.Set<SegmentStudioCorrespondingTagMapping>()
                .AsNoTracking()
                .Where(mapping => requestedSourceIds.Contains(mapping.SourceTagId))
                .ToDictionaryAsync(mapping => mapping.SourceTagId, ct);
            if (requestedMappings.Any(requested =>
                    !mappings.TryGetValue(requested.SourceTagId, out var current)
                    || current.CorrespondingTagId != requested.CorrespondingTagId
                    || current.UpdatedAt != requested.ExpectedUpdatedAt))
            {
                if (transaction is not null)
                    await transaction.CommitAsync(ct);
                return new CorrespondingTagConversionResult(
                    false,
                    Value: await GetSummaryAsync(db, videoId, ct),
                    Error: "Corresponding-tag mappings changed in another session.",
                    MappingConflict: true);
            }

            var drafts = await LoadUnconvertedDraftsAsync(db, videoId, ct);
            drafts = drafts.Where(row => requestedSourceIds.Contains(row.SourceTagId))
                .ToList();
            drafts = drafts.Where(row => reviewStates.Contains(row.ReviewState))
                .ToList();
            drafts = drafts.Where(row => mappings.ContainsKey(row.SourceTagId)).ToList();

            var itemIds = drafts.Select(row => row.ItemId).Distinct().ToArray();
            var lineageProtectedItemIds = await LoadProtectedItemIdsAsync(
                db, itemIds, ct);
            var beforeSlotRows = db.Model.FindEntityType(
                    typeof(SegmentStudioSegmentSlot)) is null
                ? []
                : await db.Set<SegmentStudioSegmentSlot>().AsNoTracking()
                    .Where(slot => itemIds.Contains(slot.ItemId))
                    .ToListAsync(ct);
            var slotPermissionProtectedItemIds = !canManagePerformerSlots
                ? beforeSlotRows.Select(slot => slot.ItemId)
                    .Where(itemId => !lineageProtectedItemIds.Contains(itemId))
                    .ToHashSet()
                : [];
            var protectedItemIds = lineageProtectedItemIds
                .Concat(slotPermissionProtectedItemIds)
                .ToHashSet();
            var convertible = drafts
                .Where(row => !protectedItemIds.Contains(row.ItemId))
                .GroupBy(row => row.ItemId)
                .Select(group => group.First())
                .ToArray();
            var items = await db.Set<SegmentStudioItem>()
                .Where(item => itemIds.Contains(item.Id))
                .ToDictionaryAsync(item => item.Id, ct);
            var tagIds = convertible.Select(row => row.SourceTagId)
                .Concat(convertible.Select(row => mappings[row.SourceTagId].CorrespondingTagId))
                .Distinct()
                .ToArray();
            var tagNames = await db.Set<Tag>().AsNoTracking()
                .Where(tag => tagIds.Contains(tag.Id))
                .ToDictionaryAsync(tag => tag.Id, tag => tag.Name, ct);
            var now = DateTime.UtcNow;
            var conversions = new List<CorrespondingTagConversion>();
            foreach (var row in convertible)
            {
                var item = items[row.ItemId];
                var targetTagId = mappings[row.SourceTagId].CorrespondingTagId;
                var previousRevision = item.Revision;
                if (canManagePerformerSlots
                    && db.Model.FindEntityType(typeof(SegmentStudioSegmentSlot)) is not null)
                {
                    await PerformerSlotRetaggingService.RemapAsync(
                        db,
                        item.Id,
                        row.SourceTagId,
                        targetTagId,
                        ct,
                        autoAssignMissingSlots: false);
                }
                item.TagId = targetTagId;
                item.Revision++;
                item.UpdatedAt = now;
                conversions.Add(new CorrespondingTagConversion(
                    item.Id,
                    row.SourceTagId,
                    tagNames.GetValueOrDefault(row.SourceTagId) ?? $"Tag {row.SourceTagId}",
                    targetTagId,
                    tagNames.GetValueOrDefault(targetTagId) ?? $"Tag {targetTagId}",
                    item.ReviewState!,
                    previousRevision,
                    item.Revision,
                    item.StartSec!.Value,
                    item.EndSec,
                    item.SourceKey!,
                    item.SourceRunId,
                    item.Confidence));
            }
            if (conversions.Count > 0
                && db.Model.FindEntityType(typeof(SegmentStudioLineageNode)) is not null)
            {
                var targetByItemId = conversions.ToDictionary(
                    conversion => conversion.ItemId,
                    conversion => conversion.CorrespondingTagId);
                var nodes = await db.Set<SegmentStudioLineageNode>()
                    .Where(node => node.ItemId != null
                        && targetByItemId.Keys.Contains(node.ItemId.Value))
                    .ToListAsync(ct);
                foreach (var node in nodes)
                {
                    node.LastKnownTagId = targetByItemId[node.ItemId!.Value];
                    node.UpdatedAt = now;
                }
            }
            await db.SaveChangesAsync(ct);

            SegmentStudioHistoryView? history = currentHistory;
            if (conversions.Count > 0 && actorUserId is int userId)
            {
                var convertedItemIds = conversions.Select(conversion => conversion.ItemId)
                    .ToArray();
                var afterSlotRows = canManagePerformerSlots
                    && db.Model.FindEntityType(typeof(SegmentStudioSegmentSlot)) is not null
                    ? await db.Set<SegmentStudioSegmentSlot>().AsNoTracking()
                        .Where(slot => convertedItemIds.Contains(slot.ItemId))
                        .ToListAsync(ct)
                    : [];
                var beforeState = BuildHistoryState(
                    conversions,
                    converted: false,
                    includePerformerSlots: canManagePerformerSlots,
                    slots: canManagePerformerSlots
                        ? beforeSlotRows.Where(slot => convertedItemIds.Contains(slot.ItemId))
                            .ToArray()
                        : []);
                var afterState = BuildHistoryState(
                    conversions,
                    converted: true,
                    includePerformerSlots: canManagePerformerSlots,
                    slots: afterSlotRows);
                var historyResult = await SegmentStudioHistoryService
                    .AppendTrustedFullWithinLockAsync(
                        db,
                        userId,
                        videoId,
                        request.ExpectedHistoryRevision,
                        "segments.corresponding-tags",
                        $"Converted {conversions.Count} corresponding tag{(conversions.Count == 1 ? "" : "s")}",
                        beforeState,
                        afterState,
                        ct);
                if (historyResult.Status != SegmentStudioHistoryMutationStatus.Updated)
                {
                    return new CorrespondingTagConversionResult(
                        false,
                        Error: historyResult.Error,
                        History: historyResult.Value,
                        HistoryConflict: historyResult.Status
                            == SegmentStudioHistoryMutationStatus.Conflict);
                }
                history = historyResult.Value;
            }

            var result = new CorrespondingTagConversionResult(
                true,
                conversions.Count,
                protectedItemIds.Count,
                lineageProtectedItemIds.Count,
                slotPermissionProtectedItemIds.Count,
                conversions,
                await GetSummaryAsync(db, videoId, ct),
                History: history);
            db.Add(new SegmentStudioSegmentOperation
            {
                OperationId = request.OperationId,
                Kind = ConversionOperationKind,
                ActorUserId = actorUserId,
                RequestFingerprint = fingerprint,
                ResultPayloadJson = JsonSerializer.Serialize(result),
                CreatedAt = now,
            });
            await db.SaveChangesAsync(ct);
            if (transaction is not null)
                await transaction.CommitAsync(ct);
            return result;
        });
    }

    private static async Task<HashSet<long>> LoadProtectedItemIdsAsync(
        DbContext db,
        IReadOnlyCollection<long> itemIds,
        CancellationToken ct)
    {
        if (itemIds.Count == 0
            || db.Model.FindEntityType(typeof(SegmentStudioLineageNode)) is null
            || db.Model.FindEntityType(typeof(SegmentStudioDerivationEdge)) is null)
            return [];
        var protectedIds = await (
                from node in db.Set<SegmentStudioLineageNode>().AsNoTracking()
                join edge in db.Set<SegmentStudioDerivationEdge>().AsNoTracking()
                    on node.Id equals edge.DerivedNodeId
                where node.ItemId != null && itemIds.Contains(node.ItemId.Value)
                select node.ItemId.GetValueOrDefault())
            .Concat(
                from node in db.Set<SegmentStudioLineageNode>().AsNoTracking()
                join edge in db.Set<SegmentStudioDerivationEdge>().AsNoTracking()
                    on node.Id equals edge.SourceNodeId
                where node.ItemId != null && itemIds.Contains(node.ItemId.Value)
                select node.ItemId.GetValueOrDefault())
            .Distinct()
            .ToListAsync(ct);
        return protectedIds.ToHashSet();
    }

    private static async Task<List<CandidateDraftRow>> LoadUnconvertedDraftsAsync(
        DbContext db,
        int videoId,
        CancellationToken ct)
    {
        var rows = await (
                from candidate in db.Set<SegmentStudioAnalysisCandidate>().AsNoTracking()
                join item in db.Set<SegmentStudioItem>().AsNoTracking()
                    on candidate.ItemId equals item.Id
                where candidate.VideoId == videoId
                    && candidate.SourceTagId != null
                    && item.NativeSegmentId == null
                    && item.VideoId == videoId
                    && item.SourceKey == "ext:ai.tagging"
                    && item.ReviewState != null
                    && item.TagId == candidate.SourceTagId
                select new CandidateDraftRow(
                    item.Id,
                    candidate.SourceTagId.GetValueOrDefault(),
                    item.ReviewState!))
            .ToListAsync(ct);
        return rows.GroupBy(row => new { row.ItemId, row.SourceTagId })
            .Select(group => group.First())
            .ToList();
    }

    private static async Task<CorrespondingTagConversionResult?> ReplayAsync(
        DbContext db,
        Guid operationId,
        string fingerprint,
        int? actorUserId,
        CancellationToken ct)
    {
        var receipt = await db.Set<SegmentStudioSegmentOperation>().AsNoTracking()
            .SingleOrDefaultAsync(operation => operation.OperationId == operationId, ct);
        if (receipt is null)
            return null;
        if (receipt.Kind != ConversionOperationKind
            || receipt.RequestFingerprint != fingerprint
            || receipt.ActorUserId != actorUserId)
        {
            return new(false,
                Error: "The operation ID was already used for a different request.");
        }
        var result = JsonSerializer.Deserialize<CorrespondingTagConversionResult>(
            receipt.ResultPayloadJson!);
        return result is null
            ? new(false, Error: "The saved conversion result could not be read.")
            : result with { Replayed = true };
    }

    private static string Fingerprint(
        int videoId,
        IReadOnlyList<CorrespondingTagConversionMapping> mappings,
        IReadOnlyList<string> reviewStates,
        long expectedHistoryRevision)
    {
        var canonical = JsonSerializer.Serialize(new
        {
            videoId,
            mappings = mappings.OrderBy(mapping => mapping.SourceTagId).ToArray(),
            reviewStates = reviewStates.Order(StringComparer.Ordinal).ToArray(),
            expectedHistoryRevision,
        });
        return Convert.ToHexString(SHA256.HashData(Encoding.UTF8.GetBytes(canonical)))
            .ToLowerInvariant();
    }

    private static JsonElement BuildHistoryState(
        IReadOnlyList<CorrespondingTagConversion> conversions,
        bool converted,
        bool includePerformerSlots,
        IReadOnlyCollection<SegmentStudioSegmentSlot> slots)
    {
        var segmentState = new
        {
            type = "segments",
            segments = conversions.Select(conversion => new
            {
                identity = new
                {
                    itemId = conversion.ItemId,
                    nativeSegmentId = (int?)null,
                    published = false,
                    revision = converted
                        ? conversion.Revision
                        : conversion.PreviousRevision,
                },
                values = new
                {
                    startSec = conversion.StartSec,
                    endSec = conversion.EndSec,
                    tagId = converted
                        ? conversion.CorrespondingTagId
                        : conversion.SourceTagId,
                    sourceKey = conversion.SourceKey,
                    sourceRunId = conversion.SourceRunId,
                    confidence = conversion.Confidence,
                    reviewState = conversion.ReviewState,
                },
            }).ToArray(),
        };
        if (!includePerformerSlots)
            return JsonSerializer.SerializeToElement(segmentState);

        var assignmentsByItem = slots.GroupBy(slot => slot.ItemId)
            .ToDictionary(group => group.Key, group => group
                .OrderBy(slot => slot.SlotDefinitionId)
                .ThenBy(slot => slot.PerformerId)
                .Select(slot => new
                {
                    slotDefinitionId = slot.SlotDefinitionId,
                    performerId = slot.PerformerId,
                })
                .ToArray());
        var slotState = new
        {
            type = "performerSlots",
            targets = conversions.Select(conversion => new
            {
                identity = new
                {
                    itemId = conversion.ItemId,
                    nativeSegmentId = (int?)null,
                },
                revision = (string?)null,
                assignments = assignmentsByItem.GetValueOrDefault(conversion.ItemId) ?? [],
            }).ToArray(),
        };
        return JsonSerializer.SerializeToElement(new
        {
            type = "composite",
            states = new object[] { segmentState, slotState },
        });
    }

    private static CorrespondingTagSummary EmptySummary() =>
        new(0, 0, 0, 0, []);

    private sealed record CandidateDraftRow(
        long ItemId,
        int SourceTagId,
        string ReviewState);
}
