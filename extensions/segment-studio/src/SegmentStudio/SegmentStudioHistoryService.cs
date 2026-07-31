using System.Text.Json;
using Microsoft.EntityFrameworkCore;

namespace SegmentStudio;

public sealed record SegmentStudioHistoryRecordRequest(
    long? ExpectedRevision,
    string Kind,
    string Label,
    JsonElement BeforeState,
    JsonElement AfterState,
    Guid? ReceiptId = null);

public sealed record SegmentStudioHistoryCursorRequest(
    Guid OperationId,
    long ExpectedRevision,
    long TargetSequence);

public sealed record SegmentStudioHistoryActionView(
    long Sequence,
    string Kind,
    string Label,
    JsonElement BeforeState,
    JsonElement AfterState,
    DateTime CreatedAt);

public sealed record SegmentStudioHistoryView(
    long Revision,
    long CursorSequence,
    long BaselineSequence,
    IReadOnlyList<SegmentStudioHistoryActionView> Actions);

public enum SegmentStudioHistoryMutationStatus
{
    Updated,
    Conflict,
    Invalid,
}

public sealed record SegmentStudioHistoryMutationResult(
    SegmentStudioHistoryMutationStatus Status,
    SegmentStudioHistoryView? Value = null,
    string? Error = null);

public static class SegmentStudioHistoryService
{
    public const int RetainedActionCount = 10;

    public static async Task<SegmentStudioHistoryView> GetAsync(
        DbContext db,
        int userId,
        int videoId,
        CancellationToken ct) =>
        await GetAsync(db, userId, videoId, SegmentStudioModes.Full, ct);

    public static async Task<SegmentStudioHistoryView> GetAsync(
        DbContext db,
        int userId,
        int videoId,
        string mode,
        CancellationToken ct)
    {
        mode = SegmentStudioModes.NormalizePublic(mode);
        var session = await db.Set<SegmentStudioHistorySession>()
            .AsNoTracking()
            .SingleOrDefaultAsync(candidate =>
                candidate.UserId == userId
                && candidate.VideoId == videoId
                && candidate.Mode == mode, ct);
        if (session is null)
            return Empty();
        return await BuildViewAsync(db, session, ct);
    }

    public static async Task<SegmentStudioHistoryMutationResult> AppendAsync(
        DbContext db,
        int userId,
        int videoId,
        SegmentStudioHistoryRecordRequest request,
        CancellationToken ct) =>
        await AppendAsync(
            db, userId, videoId, SegmentStudioModes.Full, request, ct);

    public static async Task<SegmentStudioHistoryMutationResult> AppendAsync(
        DbContext db,
        int userId,
        int videoId,
        string mode,
        SegmentStudioHistoryRecordRequest request,
        CancellationToken ct)
    {
        mode = SegmentStudioModes.NormalizePublic(mode);
        var kind = request.Kind?.Trim() ?? "";
        var label = request.Label?.Trim() ?? "";
        if (kind.Length is < 1 or > 64 || label.Length is < 1 or > 256)
            return new(SegmentStudioHistoryMutationStatus.Invalid, Error: "History action metadata is invalid.");
        if (mode != SegmentStudioModes.Basic
            && (request.BeforeState.ValueKind is JsonValueKind.Undefined
                || request.AfterState.ValueKind is JsonValueKind.Undefined))
            return new(SegmentStudioHistoryMutationStatus.Invalid,
                Error: "History action state is required.");
        if (mode == SegmentStudioModes.Basic
            && (request.ReceiptId is null
                || request.ReceiptId == Guid.Empty))
            return new(
                SegmentStudioHistoryMutationStatus.Invalid,
                Error: "A server-authored history receipt is required in Basic mode.");

        var strategy = db.Database.CreateExecutionStrategy();
        return await strategy.ExecuteAsync(async () =>
        {
            await using var transaction = db.Database.IsRelational()
                ? await db.Database.BeginTransactionAsync(ct)
                : null;
            await SegmentStudioReviewLock.AcquireAsync(db, videoId, ct);
            BasicNativeHistoryReceipt? trustedReceipt = null;
            if (mode == SegmentStudioModes.Basic)
            {
                try
                {
                    trustedReceipt =
                        await BasicNativeHistoryReceiptService.LoadAsync(
                            db,
                            request.ReceiptId!.Value,
                            userId,
                            ct);
                }
                catch (InvalidOperationException exception)
                {
                    return new SegmentStudioHistoryMutationResult(
                        SegmentStudioHistoryMutationStatus.Invalid,
                        Error: exception.Message);
                }
                if (trustedReceipt is null
                    || trustedReceipt.VideoId != videoId
                    || !IsBasicHistoryAction(
                        trustedReceipt.Kind,
                        trustedReceipt.BeforeState,
                        trustedReceipt.AfterState))
                {
                    return new SegmentStudioHistoryMutationResult(
                        SegmentStudioHistoryMutationStatus.Invalid,
                        Error: "The server-authored history receipt does not match this action.");
                }
                kind = trustedReceipt.Kind;
                label = trustedReceipt.Label;
            }
            var session = await db.Set<SegmentStudioHistorySession>()
                .SingleOrDefaultAsync(candidate =>
                    candidate.UserId == userId
                    && candidate.VideoId == videoId
                    && candidate.Mode == mode, ct);
            if (session is null)
            {
                if (request.ExpectedRevision is > 0)
                    return new SegmentStudioHistoryMutationResult(
                        SegmentStudioHistoryMutationStatus.Conflict,
                        Empty(),
                        "History changed in another session.");
                var now = DateTime.UtcNow;
                session = new SegmentStudioHistorySession
                {
                    UserId = userId,
                    VideoId = videoId,
                    Mode = mode,
                    CursorSequence = 0,
                    Revision = 0,
                    CreatedAt = now,
                    UpdatedAt = now,
                };
                db.Add(session);
                await db.SaveChangesAsync(ct);
            }
            var replayedAction = mode == SegmentStudioModes.Basic
                ? await db.Set<SegmentStudioHistoryAction>()
                    .AsNoTracking()
                    .SingleOrDefaultAsync(action =>
                        action.ReceiptId == request.ReceiptId, ct)
                : null;
            if (replayedAction is not null)
            {
                if (replayedAction.SessionId != session.Id)
                {
                    return new SegmentStudioHistoryMutationResult(
                        SegmentStudioHistoryMutationStatus.Conflict,
                        await BuildViewAsync(db, session, ct),
                        "The history receipt was already used in another session.");
                }
                if (transaction is not null)
                    await transaction.CommitAsync(ct);
                return new SegmentStudioHistoryMutationResult(
                    SegmentStudioHistoryMutationStatus.Updated,
                    await BuildViewAsync(db, session, ct));
            }
            if (request.ExpectedRevision.HasValue
                && request.ExpectedRevision.Value != session.Revision)
            {
                return new SegmentStudioHistoryMutationResult(
                    SegmentStudioHistoryMutationStatus.Conflict,
                    await BuildViewAsync(db, session, ct),
                    "History changed in another session.");
            }

            var future = await db.Set<SegmentStudioHistoryAction>()
                .Where(action => action.SessionId == session.Id && action.Sequence > session.CursorSequence)
                .ToListAsync(ct);
            await BasicNativeHistoryReceiptService.ExpireAsync(
                db, future.Select(action => action.ReceiptId), ct);
            db.RemoveRange(future);
            var maximumSequence = await db.Set<SegmentStudioHistoryAction>()
                .Where(action => action.SessionId == session.Id)
                .Select(action => (long?)action.Sequence)
                .MaxAsync(ct) ?? 0;
            var sequence = maximumSequence + 1;
            db.Add(new SegmentStudioHistoryAction
            {
                SessionId = session.Id,
                Sequence = sequence,
                ReceiptId = request.ReceiptId,
                Kind = kind,
                Label = label,
                BeforeJson = (
                    trustedReceipt?.BeforeState
                    ?? request.BeforeState).GetRawText(),
                AfterJson = (
                    trustedReceipt?.AfterState
                    ?? request.AfterState).GetRawText(),
                CreatedAt = DateTime.UtcNow,
            });
            session.CursorSequence = sequence;
            session.Revision++;
            session.UpdatedAt = DateTime.UtcNow;
            await db.SaveChangesAsync(ct);

            var stale = await db.Set<SegmentStudioHistoryAction>()
                .Where(action => action.SessionId == session.Id)
                .OrderByDescending(action => action.Sequence)
                .Skip(RetainedActionCount)
                .ToListAsync(ct);
            if (stale.Count > 0)
            {
                await BasicNativeHistoryReceiptService.ExpireAsync(
                    db, stale.Select(action => action.ReceiptId), ct);
                db.RemoveRange(stale);
                await db.SaveChangesAsync(ct);
            }
            if (transaction is not null)
                await transaction.CommitAsync(ct);
            return new SegmentStudioHistoryMutationResult(
                SegmentStudioHistoryMutationStatus.Updated,
                await BuildViewAsync(db, session, ct));
        });
    }

    public static async Task<SegmentStudioHistoryMutationResult> MoveCursorAsync(
        DbContext db,
        int userId,
        int videoId,
        SegmentStudioHistoryCursorRequest request,
        CancellationToken ct) =>
        await MoveCursorAsync(
            db, userId, videoId, SegmentStudioModes.Full, request, ct);

    public static async Task<SegmentStudioHistoryMutationResult> MoveCursorAsync(
        DbContext db,
        int userId,
        int videoId,
        string mode,
        SegmentStudioHistoryCursorRequest request,
        CancellationToken ct)
    {
        mode = SegmentStudioModes.NormalizePublic(mode);
        var strategy = db.Database.CreateExecutionStrategy();
        return await strategy.ExecuteAsync(async () =>
        {
            await using var transaction = db.Database.IsRelational()
                ? await db.Database.BeginTransactionAsync(ct)
                : null;
            await SegmentStudioReviewLock.AcquireAsync(db, videoId, ct);
            var session = await db.Set<SegmentStudioHistorySession>()
                .SingleOrDefaultAsync(candidate =>
                    candidate.UserId == userId
                    && candidate.VideoId == videoId
                    && candidate.Mode == mode, ct);
            if (session is null)
                return new SegmentStudioHistoryMutationResult(
                    SegmentStudioHistoryMutationStatus.Conflict,
                    Empty(),
                    "History is no longer available.");
            var view = await BuildViewAsync(db, session, ct);
            if (session.Revision != request.ExpectedRevision)
                return new SegmentStudioHistoryMutationResult(
                    SegmentStudioHistoryMutationStatus.Conflict,
                    view,
                    "History changed in another session.");
            var validTarget = request.TargetSequence == view.BaselineSequence
                || view.Actions.Any(action => action.Sequence == request.TargetSequence);
            if (!validTarget)
                return new SegmentStudioHistoryMutationResult(
                    SegmentStudioHistoryMutationStatus.Invalid,
                    view,
                    "The selected history state is no longer retained.");
            if (mode == SegmentStudioModes.Basic
                )
            {
                return new SegmentStudioHistoryMutationResult(
                    SegmentStudioHistoryMutationStatus.Invalid,
                    view,
                    "Basic history state and cursor must be restored together.");
            }
            session.CursorSequence = request.TargetSequence;
            session.Revision++;
            session.UpdatedAt = DateTime.UtcNow;
            await db.SaveChangesAsync(ct);
            if (transaction is not null)
                await transaction.CommitAsync(ct);
            return new SegmentStudioHistoryMutationResult(
                SegmentStudioHistoryMutationStatus.Updated,
                await BuildViewAsync(db, session, ct));
        });
    }

    public static async Task ClearVideoAsync(DbContext db, int videoId, CancellationToken ct)
    {
        await SegmentStudioReviewLock.AcquireAsync(db, videoId, ct);
        var sessions = await db.Set<SegmentStudioHistorySession>()
            .Where(session => session.VideoId == videoId)
            .ToListAsync(ct);
        var basicSessionIds = sessions
            .Where(session => session.Mode == SegmentStudioModes.Basic)
            .Select(session => session.Id)
            .ToArray();
        var receiptIds = basicSessionIds.Length == 0
            ? []
            : await db.Set<SegmentStudioHistoryAction>()
                .Where(action => basicSessionIds.Contains(action.SessionId))
                .Select(action => action.ReceiptId)
                .ToListAsync(ct);
        await BasicNativeHistoryReceiptService.ExpireAsync(
            db, receiptIds, ct);
        await BasicNativeHistoryReceiptService.ExpireForVideoAsync(
            db, videoId, userId: null, ct);
        if (sessions.Count > 0)
            db.RemoveRange(sessions);
        await db.SaveChangesAsync(ct);
    }

    public static async Task ClearBasicVideoAsync(
        DbContext db,
        int videoId,
        CancellationToken ct)
    {
        await SegmentStudioReviewLock.AcquireAsync(db, videoId, ct);
        var sessions = await db.Set<SegmentStudioHistorySession>()
            .Where(session =>
                session.VideoId == videoId
                && session.Mode == SegmentStudioModes.Basic)
            .ToListAsync(ct);
        var sessionIds = sessions.Select(session => session.Id).ToArray();
        var receiptIds = sessionIds.Length == 0
            ? []
            : await db.Set<SegmentStudioHistoryAction>()
                .Where(action => sessionIds.Contains(action.SessionId))
                .Select(action => action.ReceiptId)
                .ToListAsync(ct);
        await BasicNativeHistoryReceiptService.ExpireAsync(
            db, receiptIds, ct);
        await BasicNativeHistoryReceiptService.ExpireForVideoAsync(
            db, videoId, userId: null, ct);
        if (sessions.Count > 0)
            db.RemoveRange(sessions);
        await db.SaveChangesAsync(ct);
    }

    public static async Task ClearBasicUserAsync(
        DbContext db,
        int userId,
        CancellationToken ct)
    {
        var sessions = await db.Set<SegmentStudioHistorySession>()
            .Where(session =>
                session.UserId == userId
                && session.Mode == SegmentStudioModes.Basic)
            .ToListAsync(ct);
        var sessionIds = sessions.Select(session => session.Id).ToArray();
        var receiptIds = sessionIds.Length == 0
            ? []
            : await db.Set<SegmentStudioHistoryAction>()
                .Where(action => sessionIds.Contains(action.SessionId))
                .Select(action => action.ReceiptId)
                .ToListAsync(ct);
        await BasicNativeHistoryReceiptService.ExpireAsync(
            db, receiptIds, ct);
        await BasicNativeHistoryReceiptService.ExpireForUserAsync(
            db, userId, ct);
        if (sessions.Count > 0)
            db.RemoveRange(sessions);
        await db.SaveChangesAsync(ct);
    }

    private static SegmentStudioHistoryView Empty() => new(0, 0, 0, []);

    private static async Task<SegmentStudioHistoryView> BuildViewAsync(
        DbContext db,
        SegmentStudioHistorySession session,
        CancellationToken ct)
    {
        var actions = await db.Set<SegmentStudioHistoryAction>()
            .AsNoTracking()
            .Where(action => action.SessionId == session.Id)
            .OrderBy(action => action.Sequence)
            .ToListAsync(ct);
        var views = actions.Select(action => new SegmentStudioHistoryActionView(
            action.Sequence,
            action.Kind,
            action.Label,
            ParseJson(action.BeforeJson),
            ParseJson(action.AfterJson),
            action.CreatedAt)).ToArray();
        var baseline = views.Length == 0 ? 0 : views[0].Sequence - 1;
        var cursor = views.Length == 0
            ? 0
            : Math.Min(Math.Max(session.CursorSequence, baseline), views[^1].Sequence);
        return new(session.Revision, cursor, baseline, views);
    }

    private static JsonElement ParseJson(string json)
    {
        using var document = JsonDocument.Parse(json);
        return document.RootElement.Clone();
    }

    private static bool IsBasicHistoryAction(
        string kind,
        JsonElement beforeState,
        JsonElement afterState)
    {
        if (kind is not (
            "segment.update"
            or "segment.create"
            or "segment.duplicate"
            or "segment.split"
            or "segments.merge"
            or "segments.tag"
            or "segments.moveToBin"))
            return false;
        return IsNativeSegmentState(beforeState)
            && IsNativeSegmentState(afterState);
    }

    private static bool IsNativeSegmentState(JsonElement state)
    {
        if (state.ValueKind != JsonValueKind.Object
            || !state.TryGetProperty("type", out var type)
            || type.ValueKind != JsonValueKind.String
            || type.GetString() is not ("segment" or "segments"))
            return false;
        return !ContainsProperty(state, "reviewState")
            && !ContainsProperty(state, "itemId");
    }

    private static bool ContainsProperty(JsonElement value, string propertyName)
    {
        if (value.ValueKind == JsonValueKind.Object)
        {
            foreach (var property in value.EnumerateObject())
            {
                if (property.NameEquals(propertyName)
                    || ContainsProperty(property.Value, propertyName))
                    return true;
            }
        }
        else if (value.ValueKind == JsonValueKind.Array)
        {
            foreach (var item in value.EnumerateArray())
            {
                if (ContainsProperty(item, propertyName))
                    return true;
            }
        }
        return false;
    }
}
