using System.Security.Cryptography;
using System.Text;
using System.Text.Json;
using Cove.Core.Auth;
using Cove.Core.Entities;
using Cove.Core.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace SegmentStudio;

public sealed record BasicNativeHistoryRestoreRequest(
    Guid OperationId,
    long ExpectedHistoryRevision,
    long ActionSequence,
    string Direction);

public enum BasicNativeHistoryRestoreStatus
{
    Updated,
    NotFound,
    Forbidden,
    Conflict,
    Invalid,
}

public sealed record BasicNativeHistoryRestoreResult(
    BasicNativeHistoryRestoreStatus Status,
    string? Error = null,
    bool Replayed = false,
    SegmentStudioHistoryView? History = null);

public static class BasicNativeHistoryService
{
    private const string OperationKind = "basic-native-history-restore";
    private static readonly JsonSerializerOptions JsonOptions =
        new(JsonSerializerDefaults.Web);

    public static async Task<BasicNativeHistoryRestoreResult> RestoreAsync(
        DbContext db,
        int videoId,
        BasicNativeHistoryRestoreRequest request,
        CovePrincipal? principal,
        IAuthorizationService authorization,
        CancellationToken ct) =>
        await RestoreAsync(
            db,
            videoId,
            request,
            principal,
            authorization,
            blobs: null,
            ct);

    public static async Task<BasicNativeHistoryRestoreResult> RestoreAsync(
        DbContext db,
        int videoId,
        BasicNativeHistoryRestoreRequest request,
        CovePrincipal? principal,
        IAuthorizationService authorization,
        IBlobService? blobs,
        CancellationToken ct)
    {
        if (request.OperationId == Guid.Empty)
            return new(BasicNativeHistoryRestoreStatus.Invalid,
                Error: "Operation ID is required.");
        if (principal?.UserId is not int userId)
            return new(BasicNativeHistoryRestoreStatus.Forbidden,
                Error: "A signed-in user is required.");
        if (request.Direction is not ("backward" or "forward"))
            return new(BasicNativeHistoryRestoreStatus.Invalid,
                Error: "History direction is invalid.");
        await using var ownedTransaction =
            db.Database.IsRelational()
            && db.Database.CurrentTransaction is null
                ? await db.Database.BeginTransactionAsync(ct)
                : null;
        var write = await authorization.AuthorizeAsync(
            principal,
            Permissions.SegmentsWrite,
            EntityRef.Of(EntityKinds.Video, videoId),
            ct);
        if (!write.Allowed)
            return new(BasicNativeHistoryRestoreStatus.Forbidden,
                Error: write.Reason ?? "You cannot edit segments for this video.");
        var delete = await authorization.AuthorizeAsync(
            principal,
            Permissions.SegmentsDelete,
            EntityRef.Of(EntityKinds.Video, videoId),
            ct);
        if (!delete.Allowed)
            return new(BasicNativeHistoryRestoreStatus.Forbidden,
                Error: delete.Reason ?? "You cannot delete segments for this video.");
        if (!await db.Set<Video>().AsNoTracking()
                .AnyAsync(video => video.Id == videoId, ct))
            return new(BasicNativeHistoryRestoreStatus.NotFound,
                Error: "Video not found.");

        await SegmentStudioReviewLock.AcquireAsync(db, videoId, ct);
        var session = await db.Set<SegmentStudioHistorySession>()
            .SingleOrDefaultAsync(candidate =>
                candidate.UserId == userId
                && candidate.VideoId == videoId
                && candidate.Mode == SegmentStudioModes.Basic,
                ct);
        if (session is null)
            return new(BasicNativeHistoryRestoreStatus.Conflict,
                Error: "Basic history changed in another session.");
        var action = await db.Set<SegmentStudioHistoryAction>()
            .AsNoTracking()
            .SingleOrDefaultAsync(candidate =>
                candidate.SessionId == session.Id
                && candidate.Sequence == request.ActionSequence
                && candidate.ReceiptId != null,
                ct);
        if (action is null)
            return new(BasicNativeHistoryRestoreStatus.Conflict,
                Error: "The server-authored history action is no longer available.");
        var sourceState = ParseJson(
            request.Direction == "backward"
                ? action.AfterJson
                : action.BeforeJson);
        var targetState = ParseJson(
            request.Direction == "backward"
                ? action.BeforeJson
                : action.AfterJson);
        if (!TryReadState(sourceState, out var source)
            || !TryReadState(targetState, out var target))
            return new(BasicNativeHistoryRestoreStatus.Invalid,
                Error: "The stored native history state is invalid.");
        var fingerprint = Fingerprint(
            videoId,
            request,
            sourceState,
            targetState);
        var replay = await ReplayAsync(
            db, request.OperationId, fingerprint, principal, ct);
        if (replay is not null)
        {
            return replay with
            {
                History = await SegmentStudioHistoryService.GetAsync(
                    db, userId, videoId, SegmentStudioModes.Basic, ct),
            };
        }
        if (session.Revision != request.ExpectedHistoryRevision)
            return new(BasicNativeHistoryRestoreStatus.Conflict,
                Error: "Basic history changed in another session.");
        var expectedActionSequence = request.Direction == "backward"
            ? session.CursorSequence
            : session.CursorSequence + 1;
        if (request.ActionSequence != expectedActionSequence)
        {
            return new(
                BasicNativeHistoryRestoreStatus.Conflict,
                Error: "Basic history actions must be restored in cursor order.");
        }

        var targetTagIds = target.Select(snapshot => snapshot.TagId)
            .Distinct()
            .ToArray();
        if (targetTagIds.Length > 0
            && await db.Set<Tag>().AsNoTracking()
                .CountAsync(tag => targetTagIds.Contains(tag.Id), ct)
                != targetTagIds.Length)
            return new(BasicNativeHistoryRestoreStatus.Invalid,
                Error: "A tag used by this history state no longer exists.");

        if (action.Kind == "segments.moveToBin")
        {
            if (blobs is null)
            {
                return new(
                    BasicNativeHistoryRestoreStatus.Invalid,
                    Error: "Recycle-bin history restoration is unavailable.");
            }
            var binError = await RestoreBinTransitionAsync(
                db,
                videoId,
                request,
                source,
                target,
                principal,
                authorization,
                blobs,
                ct);
            if (binError is not null)
                return binError;
            db.Add(new SegmentStudioSegmentOperation
            {
                OperationId = request.OperationId,
                Kind = OperationKind,
                ActorUserId = principal?.UserId,
                RequestFingerprint = fingerprint,
                ResultPayloadJson = """{"status":"updated"}""",
                CreatedAt = DateTime.UtcNow,
            });
            AdvanceCursor(session, request);
            await db.SaveChangesAsync(ct);
            if (ownedTransaction is not null)
                await ownedTransaction.CommitAsync(ct);
            return new(
                BasicNativeHistoryRestoreStatus.Updated,
                History: await SegmentStudioHistoryService.GetAsync(
                    db, userId, videoId, SegmentStudioModes.Basic, ct));
        }

        var current = await db.Set<Segment>()
            .Where(segment =>
                segment.HostType == SegmentHostType.Video
                && segment.HostId == videoId
                && segment.Kind == "tag"
                && segment.TagId != null)
            .OrderBy(segment => segment.StartSec)
            .ThenBy(segment => segment.Id)
            .ToListAsync(ct);
        var currentIds = current.Select(segment => segment.Id).ToArray();
        var currentProvenance =
            db.Model.FindEntityType(typeof(FieldProvenance)) is null
                ? []
                : await db.Set<FieldProvenance>()
                    .AsNoTracking()
                    .Where(row =>
                        row.HostType == AffinityHostType.Segment
                        && currentIds.Contains(row.HostId))
                    .ToListAsync(ct);
        var currentProvenanceBySegment =
            currentProvenance.ToLookup(row => row.HostId);
        var sourceMatches = new List<Segment?>(source.Count);
        var matchedIds = new HashSet<int>();
        foreach (var snapshot in source)
        {
            var match = snapshot.NativeSegmentId is int nativeId
                ? current.SingleOrDefault(segment => segment.Id == nativeId)
                : null;
            if (match is not null
                && snapshot.UpdatedAt is DateTime expectedUpdatedAt
                && match.UpdatedAt != expectedUpdatedAt
                && !Matches(
                    match,
                    snapshot,
                    currentProvenanceBySegment[match.Id]))
                return new(BasicNativeHistoryRestoreStatus.Conflict,
                    Error: "A segment changed after this history action.");
            if (match is null)
            {
                var exact = current.Where(segment =>
                        !matchedIds.Contains(segment.Id)
                        && Matches(
                            segment,
                            snapshot,
                            currentProvenanceBySegment[segment.Id]))
                    .Take(2)
                    .ToArray();
                if (exact.Length > 1)
                    return new(BasicNativeHistoryRestoreStatus.Conflict,
                        Error: "The restored segment can no longer be identified uniquely.");
                match = exact.SingleOrDefault();
            }
            if (match is null)
                return new(BasicNativeHistoryRestoreStatus.Conflict,
                    Error: "A segment required by this history action no longer exists.");
            matchedIds.Add(match.Id);
            sourceMatches.Add(match);
        }

        var usedSegments = new HashSet<Segment>();
        var assignments = new List<(
            Segment Segment,
            NativeSnapshot Snapshot,
            bool IsNew)>(target.Count);
        var now = DateTime.UtcNow;
        for (var index = 0; index < target.Count; index++)
        {
            var snapshot = target[index];
            Segment? segment = null;
            var isNew = false;
            if (snapshot.NativeSegmentId is int targetId)
                segment = current.SingleOrDefault(candidate =>
                    candidate.Id == targetId && !usedSegments.Contains(candidate));
            if (segment is null
                && index < sourceMatches.Count
                && sourceMatches[index] is { } indexed
                && !usedSegments.Contains(indexed))
                segment = indexed;
            if (segment is null)
                segment = current.SingleOrDefault(candidate =>
                    !usedSegments.Contains(candidate)
                    && Matches(
                        candidate,
                        snapshot,
                        currentProvenanceBySegment[candidate.Id]));
            if (segment is null)
            {
                segment = new Segment
                {
                    HostType = SegmentHostType.Video,
                    HostId = videoId,
                    Kind = "tag",
                    CreatedAt = now,
                };
                current.Add(segment);
                isNew = true;
            }
            usedSegments.Add(segment);
            assignments.Add((segment, snapshot, isNew));
        }

        var removedSegments = sourceMatches
            .Where(segment => segment is not null)
            .Cast<Segment>()
            .Where(segment => !usedSegments.Contains(segment))
            .DistinctBy(segment => segment.Id)
            .ToArray();
        foreach (var segment in removedSegments)
        {
            if (await db.Set<SegmentStudioItem>().AsNoTracking()
                    .AnyAsync(item => item.NativeSegmentId == segment.Id, ct))
                return new(
                    BasicNativeHistoryRestoreStatus.Conflict,
                    Error: "A segment has Full-mode metadata and cannot be removed by Basic undo.");
        }
        var affectedNativeIds = assignments
            .Where(assignment => !assignment.IsNew)
            .Select(assignment => assignment.Segment.Id)
            .Concat(removedSegments.Select(segment => segment.Id))
            .Distinct()
            .ToArray();
        if (db.Model.FindEntityType(typeof(FieldProvenance)) is not null)
        {
            var existingProvenance = await db.Set<FieldProvenance>()
                .Where(row =>
                    row.HostType == AffinityHostType.Segment
                    && affectedNativeIds.Contains(row.HostId))
                .ToListAsync(ct);
            db.RemoveRange(existingProvenance);
        }
        foreach (var assignment in assignments)
        {
            Apply(assignment.Segment, assignment.Snapshot, now);
            if (assignment.IsNew)
                db.Add(assignment.Segment);
        }
        foreach (var segment in removedSegments)
            db.Remove(segment);

        try
        {
            await db.SaveChangesAsync(ct);
        }
        catch (DbUpdateException)
        {
            return new(BasicNativeHistoryRestoreStatus.Conflict,
                Error: "The native history state conflicts with protected extension metadata.");
        }
        if (db.Model.FindEntityType(typeof(FieldProvenance)) is not null)
        {
            db.AddRange(assignments.SelectMany(assignment =>
                assignment.Snapshot.FieldProvenance.Select(row =>
                    new FieldProvenance
                    {
                        HostType = AffinityHostType.Segment,
                        HostId = assignment.Segment.Id,
                        FieldKey = row.FieldKey,
                        ValueJson = row.ValueJson,
                        SourceKey = row.SourceKey,
                        SourceRunId = row.SourceRunId,
                        ModelKey = row.ModelKey,
                        Confidence = row.Confidence,
                        CreatedAt = row.CreatedAt,
                        UpdatedAt = row.UpdatedAt,
                    })));
            await db.SaveChangesAsync(ct);
        }

        db.Add(new SegmentStudioSegmentOperation
        {
            OperationId = request.OperationId,
            Kind = OperationKind,
            ActorUserId = principal?.UserId,
            RequestFingerprint = fingerprint,
            ResultPayloadJson = """{"status":"updated"}""",
            CreatedAt = DateTime.UtcNow,
        });
        AdvanceCursor(session, request);
        await db.SaveChangesAsync(ct);
        if (ownedTransaction is not null)
            await ownedTransaction.CommitAsync(ct);
        return new(
            BasicNativeHistoryRestoreStatus.Updated,
            History: await SegmentStudioHistoryService.GetAsync(
                db, userId, videoId, SegmentStudioModes.Basic, ct));
    }

    private static async Task<BasicNativeHistoryRestoreResult?>
        RestoreBinTransitionAsync(
            DbContext db,
            int videoId,
            BasicNativeHistoryRestoreRequest request,
            IReadOnlyList<NativeSnapshot> source,
            IReadOnlyList<NativeSnapshot> target,
            CovePrincipal principal,
            IAuthorizationService authorization,
            IBlobService blobs,
            CancellationToken ct)
    {
        if (source.Count != target.Count)
        {
            return new(
                BasicNativeHistoryRestoreStatus.Invalid,
                Error: "The stored recycling-bin history cardinality is invalid.");
        }
        if (request.Direction == "backward")
        {
            if (source.Any(snapshot => snapshot.RecycleBinItemId is null)
                || target.Any(snapshot => snapshot.NativeSegmentId is null))
            {
                return new(
                    BasicNativeHistoryRestoreStatus.Invalid,
                    Error: "The stored recycling-bin undo state is invalid.");
            }
            var entries = await db.Set<SegmentStudioNativeRecycleBinEntry>()
                .Where(entry => entry.VideoId == videoId)
                .OrderBy(entry => entry.Id)
                .ToListAsync(ct);
            var usedEntryIds = new HashSet<long>();
            var backwardTargetIndexes = PairBinTransitionSnapshots(
                source,
                target,
                binStateIsSource: true);
            if (backwardTargetIndexes is null)
            {
                return new(
                    BasicNativeHistoryRestoreStatus.Conflict,
                    Error: "The recycling-bin history states can no longer be paired.");
            }
            for (var index = 0; index < source.Count; index++)
            {
                var snapshot = source[index];
                var entry = snapshot.RecycleBinItemId is long entryId
                    ? entries.SingleOrDefault(candidate =>
                        candidate.Id == entryId
                        && !usedEntryIds.Contains(candidate.Id))
                    : null;
                if (entry is not null
                    && snapshot.Revision is long expectedRevision
                    && entry.Revision != expectedRevision
                    && !Matches(entry, snapshot))
                {
                    return new(
                        BasicNativeHistoryRestoreStatus.Conflict,
                        Error: "A recycling-bin segment changed after this history action.");
                }
                if (entry is null)
                {
                    var exact = entries.Where(candidate =>
                            !usedEntryIds.Contains(candidate.Id)
                            && Matches(candidate, snapshot))
                        .Take(2)
                        .ToArray();
                    if (exact.Length > 1)
                    {
                        return new(
                            BasicNativeHistoryRestoreStatus.Conflict,
                            Error: "The recycling-bin segment can no longer be identified uniquely.");
                    }
                    entry = exact.SingleOrDefault();
                }
                if (entry is null || !Matches(entry, snapshot))
                {
                    return new(
                        BasicNativeHistoryRestoreStatus.Conflict,
                        Error: "A recycling-bin segment no longer matches the state required for undo.");
                }
                usedEntryIds.Add(entry.Id);
                var restored = await BasicNativeRecycleBinService.RestoreAsync(
                    db,
                    entry.Id,
                    new(
                        DerivedOperationId(
                            request.OperationId,
                            index,
                            "restore"),
                        entry.Revision),
                    principal,
                    authorization,
                    blobs,
                    ct);
                if (restored.Status != SegmentTransitionStatus.Updated)
                    return FromTransition(restored.Status, restored.Error);
            }
            return null;
        }

        if (source.Any(snapshot => snapshot.NativeSegmentId is null)
            || target.Any(snapshot => snapshot.RecycleBinItemId is null))
        {
            return new(
                BasicNativeHistoryRestoreStatus.Invalid,
                Error: "The stored recycling-bin redo state is invalid.");
        }
        var current = await db.Set<Segment>()
            .Where(segment =>
                segment.HostType == SegmentHostType.Video
                && segment.HostId == videoId
                && segment.Kind == "tag"
                && segment.TagId != null)
            .OrderBy(segment => segment.StartSec)
            .ThenBy(segment => segment.Id)
            .ToListAsync(ct);
        var currentIds = current.Select(segment => segment.Id).ToArray();
        var provenance = db.Model.FindEntityType(typeof(FieldProvenance)) is null
            ? []
            : await db.Set<FieldProvenance>()
                .AsNoTracking()
                .Where(row =>
                    row.HostType == AffinityHostType.Segment
                    && currentIds.Contains(row.HostId))
                .ToListAsync(ct);
        var provenanceBySegment = provenance.ToLookup(row => row.HostId);
        var usedSegmentIds = new HashSet<int>();
        var forwardTargetIndexes = PairBinTransitionSnapshots(
            source,
            target,
            binStateIsSource: false);
        if (forwardTargetIndexes is null)
        {
            return new(
                BasicNativeHistoryRestoreStatus.Conflict,
                Error: "The recycling-bin history states can no longer be paired.");
        }
        for (var index = 0; index < source.Count; index++)
        {
            var snapshot = source[index];
            var targetSnapshot = target[forwardTargetIndexes[index]];
            var segment = snapshot.NativeSegmentId is int nativeId
                ? current.SingleOrDefault(candidate =>
                    candidate.Id == nativeId
                    && !usedSegmentIds.Contains(candidate.Id))
                : null;
            if (segment is not null
                && snapshot.UpdatedAt is DateTime expectedUpdatedAt
                && segment.UpdatedAt != expectedUpdatedAt
                && !Matches(
                    segment,
                    targetSnapshot,
                    provenanceBySegment[segment.Id]))
            {
                return new(
                    BasicNativeHistoryRestoreStatus.Conflict,
                    Error: "A segment changed after this history action.");
            }
            if (segment is null)
            {
                var exact = current.Where(candidate =>
                        !usedSegmentIds.Contains(candidate.Id)
                        && Matches(
                            candidate,
                            targetSnapshot,
                            provenanceBySegment[candidate.Id]))
                    .Take(2)
                    .ToArray();
                if (exact.Length > 1)
                {
                    return new(
                        BasicNativeHistoryRestoreStatus.Conflict,
                        Error: "The restored segment can no longer be identified uniquely.");
                }
                segment = exact.SingleOrDefault();
            }
            if (segment is null
                || !Matches(
                    segment,
                    targetSnapshot,
                    provenanceBySegment[segment.Id]))
            {
                return new(
                    BasicNativeHistoryRestoreStatus.Conflict,
                    Error: "A segment no longer matches the state required for redo.");
            }
            usedSegmentIds.Add(segment.Id);
            var moved = await BasicNativeRecycleBinService.MoveAsync(
                db,
                videoId,
                segment.Id,
                new(
                    DerivedOperationId(
                        request.OperationId,
                        index,
                        "move"),
                    segment.UpdatedAt),
                principal,
                authorization,
                blobs,
                ct);
            if (moved.Status != SegmentTransitionStatus.Updated)
                return FromTransition(moved.Status, moved.Error);
        }
        return null;
    }

    private static int[]? PairBinTransitionSnapshots(
        IReadOnlyList<NativeSnapshot> source,
        IReadOnlyList<NativeSnapshot> target,
        bool binStateIsSource)
    {
        var targetIndexes = new int[source.Count];
        var usedTargetIndexes = new HashSet<int>();
        for (var sourceIndex = 0; sourceIndex < source.Count; sourceIndex++)
        {
            var match = Enumerable.Range(0, target.Count)
                .FirstOrDefault(
                    targetIndex =>
                        !usedTargetIndexes.Contains(targetIndex)
                        && SameBinTransitionValues(
                            binStateIsSource
                                ? source[sourceIndex]
                                : target[targetIndex],
                            binStateIsSource
                                ? target[targetIndex]
                                : source[sourceIndex]),
                    -1);
            if (match < 0)
                return null;
            targetIndexes[sourceIndex] = match;
            usedTargetIndexes.Add(match);
        }
        return targetIndexes;
    }

    private static bool SameBinTransitionValues(
        NativeSnapshot binSnapshot,
        NativeSnapshot nativeSnapshot) =>
        binSnapshot.TagId == nativeSnapshot.TagId
        && binSnapshot.StartSec == nativeSnapshot.StartSec
        && binSnapshot.EndSec == nativeSnapshot.EndSec
        && binSnapshot.Kind == nativeSnapshot.Kind
        && binSnapshot.RefId == nativeSnapshot.RefId
        && binSnapshot.PayloadJson == nativeSnapshot.PayloadJson
        && binSnapshot.SourceKey == nativeSnapshot.SourceKey
        && binSnapshot.SourceRunId == nativeSnapshot.SourceRunId
        && binSnapshot.Confidence == nativeSnapshot.Confidence
        && binSnapshot.Title == nativeSnapshot.Title
        && binSnapshot.ColorHint == nativeSnapshot.ColorHint
        && (binSnapshot.ImageBlobId == nativeSnapshot.ImageBlobId
            || binSnapshot.ImageBlobId is null)
        && binSnapshot.CreatedAt == nativeSnapshot.CreatedAt
        && ProvenanceSignature(binSnapshot.FieldProvenance)
            == ProvenanceSignature(nativeSnapshot.FieldProvenance);

    private static BasicNativeHistoryRestoreResult FromTransition(
        SegmentTransitionStatus status,
        string? error) =>
        new(
            status switch
            {
                SegmentTransitionStatus.NotFound =>
                    BasicNativeHistoryRestoreStatus.NotFound,
                SegmentTransitionStatus.Forbidden =>
                    BasicNativeHistoryRestoreStatus.Forbidden,
                SegmentTransitionStatus.Invalid
                    or SegmentTransitionStatus.MissingImage =>
                    BasicNativeHistoryRestoreStatus.Invalid,
                _ => BasicNativeHistoryRestoreStatus.Conflict,
            },
            Error: error ?? "The recycling-bin history action could not be restored.");

    private static Guid DerivedOperationId(
        Guid operationId,
        int index,
        string kind)
    {
        var bytes = SHA256.HashData(Encoding.UTF8.GetBytes(
            $"{operationId:N}:{index}:{kind}"));
        return new Guid(bytes.AsSpan(0, 16));
    }

    private static void AdvanceCursor(
        SegmentStudioHistorySession session,
        BasicNativeHistoryRestoreRequest request)
    {
        session.CursorSequence = request.Direction == "backward"
            ? request.ActionSequence - 1
            : request.ActionSequence;
        session.Revision++;
        session.UpdatedAt = DateTime.UtcNow;
    }

    private static void Apply(
        Segment segment,
        NativeSnapshot snapshot,
        DateTime now)
    {
        segment.StartSec = snapshot.StartSec;
        segment.EndSec = snapshot.EndSec;
        segment.TagId = snapshot.TagId;
        segment.Kind = snapshot.Kind;
        segment.RefId = snapshot.RefId;
        segment.Payload = snapshot.PayloadJson is null
            ? null
            : JsonDocument.Parse(snapshot.PayloadJson);
        segment.SourceKey = snapshot.SourceKey;
        segment.SourceRunId = snapshot.SourceRunId;
        segment.Confidence = snapshot.Confidence;
        segment.Title = snapshot.Title;
        segment.ColorHint = snapshot.ColorHint;
        segment.ImageBlobId = snapshot.ImageBlobId;
        segment.CreatedAt = snapshot.CreatedAt;
        segment.UpdatedAt = now > segment.UpdatedAt
            ? now
            : segment.UpdatedAt.AddTicks(1);
    }

    private static bool Matches(
        Segment segment,
        NativeSnapshot snapshot,
        IEnumerable<FieldProvenance> provenance) =>
        segment.TagId == snapshot.TagId
        && segment.StartSec == snapshot.StartSec
        && segment.EndSec == snapshot.EndSec
        && (segment.Kind ?? "tag") == snapshot.Kind
        && segment.RefId == snapshot.RefId
        && segment.Payload?.RootElement.GetRawText() == snapshot.PayloadJson
        && segment.SourceKey == snapshot.SourceKey
        && segment.SourceRunId == snapshot.SourceRunId
        && segment.Confidence == snapshot.Confidence
        && segment.Title == snapshot.Title
        && segment.ColorHint == snapshot.ColorHint
        && segment.ImageBlobId == snapshot.ImageBlobId
        && segment.CreatedAt == snapshot.CreatedAt
        && ProvenanceSignature(provenance) ==
            ProvenanceSignature(snapshot.FieldProvenance);

    private static bool Matches(
        SegmentStudioNativeRecycleBinEntry entry,
        NativeSnapshot snapshot)
    {
        if (!TryParseProvenance(
                entry.FieldProvenanceJson,
                out var provenance))
            return false;
        return entry.TagId == snapshot.TagId
        && entry.StartSec == snapshot.StartSec
        && entry.EndSec == snapshot.EndSec
        && entry.Kind == snapshot.Kind
        && entry.RefId == snapshot.RefId
        && entry.PayloadJson == snapshot.PayloadJson
        && entry.SourceKey == snapshot.SourceKey
        && entry.SourceRunId == snapshot.SourceRunId
        && entry.Confidence == snapshot.Confidence
        && entry.Title == snapshot.Title
        && entry.ColorHint == snapshot.ColorHint
        && entry.ImageBlobId == snapshot.ImageBlobId
        && entry.NativeCreatedAt == snapshot.CreatedAt
        && ProvenanceSignature(provenance)
            == ProvenanceSignature(snapshot.FieldProvenance);
    }

    private static string ProvenanceSignature(
        IEnumerable<FieldProvenance> rows) =>
        JsonSerializer.Serialize(
            rows
                .OrderBy(row => row.FieldKey)
                .ThenBy(row => row.SourceKey)
                .ThenBy(row => row.SourceRunId)
                .ThenBy(row => row.ModelKey)
                .Select(row => new NativeFieldProvenanceSnapshot(
                    row.FieldKey,
                    row.ValueJson,
                    row.SourceKey,
                    row.SourceRunId,
                    row.ModelKey,
                    row.Confidence,
                    row.CreatedAt,
                    row.UpdatedAt)),
            JsonOptions);

    private static string ProvenanceSignature(
        IEnumerable<NativeFieldProvenanceSnapshot> rows) =>
        JsonSerializer.Serialize(
            rows
                .OrderBy(row => row.FieldKey)
                .ThenBy(row => row.SourceKey)
                .ThenBy(row => row.SourceRunId)
                .ThenBy(row => row.ModelKey),
            JsonOptions);

    private static bool TryReadState(
        JsonElement state,
        out IReadOnlyList<NativeSnapshot> snapshots)
    {
        snapshots = [];
        if (state.ValueKind != JsonValueKind.Object
            || !state.TryGetProperty("type", out var type)
            || type.ValueKind != JsonValueKind.String)
            return false;
        var elements = type.GetString() switch
        {
            "segment" => new[] { state },
            "segments" when state.TryGetProperty("segments", out var list)
                && list.ValueKind == JsonValueKind.Array =>
                list.EnumerateArray().ToArray(),
            _ => null,
        };
        if (elements is null)
            return false;
        var parsed = new List<NativeSnapshot>(elements.Length);
        foreach (var element in elements)
        {
            if (!element.TryGetProperty("identity", out var identity)
                || !element.TryGetProperty("values", out var values)
                || identity.ValueKind != JsonValueKind.Object
                || values.ValueKind != JsonValueKind.Object
                || !values.TryGetProperty("tagId", out var tag)
                || !values.TryGetProperty("startSec", out var start)
                || tag.ValueKind != JsonValueKind.Number
                || start.ValueKind != JsonValueKind.Number
                || !tag.TryGetInt32(out var tagId)
                || !start.TryGetDouble(out var startSec)
                || tagId <= 0
                || !double.IsFinite(startSec)
                || startSec < 0)
                return false;
            double? endSec = null;
            if (values.TryGetProperty("endSec", out var end)
                && end.ValueKind != JsonValueKind.Null)
            {
                if (end.ValueKind != JsonValueKind.Number
                    || !end.TryGetDouble(out var parsedEnd)
                    || !double.IsFinite(parsedEnd)
                    || parsedEnd < startSec)
                    return false;
                endSec = parsedEnd;
            }
            var nativeId = identity.TryGetProperty(
                    "nativeSegmentId", out var native)
                && native.ValueKind == JsonValueKind.Number
                && native.TryGetInt32(out var parsedNativeId)
                && parsedNativeId > 0
                    ? parsedNativeId
                    : (int?)null;
            var recycleBinItemId = identity.TryGetProperty(
                    "recycleBinItemId", out var recycleBinItem)
                && recycleBinItem.ValueKind == JsonValueKind.Number
                && recycleBinItem.TryGetInt64(out var parsedRecycleBinItemId)
                && parsedRecycleBinItemId > 0
                    ? parsedRecycleBinItemId
                    : (long?)null;
            var revision = identity.TryGetProperty(
                    "revision", out var revisionValue)
                && revisionValue.ValueKind == JsonValueKind.Number
                && revisionValue.TryGetInt64(out var parsedRevision)
                && parsedRevision > 0
                    ? parsedRevision
                    : (long?)null;
            var updatedAt = identity.TryGetProperty(
                    "updatedAt", out var updated)
                && updated.ValueKind == JsonValueKind.String
                && updated.TryGetDateTime(out var parsedUpdatedAt)
                    ? parsedUpdatedAt
                    : (DateTime?)null;
            var sourceKey = values.TryGetProperty("sourceKey", out var source)
                && source.ValueKind == JsonValueKind.String
                ? source.GetString()?.Trim()
                : null;
            string? sourceRunId = values.TryGetProperty(
                    "sourceRunId", out var run)
                && run.ValueKind == JsonValueKind.String
                    ? run.GetString()
                    : null;
            float? confidence = values.TryGetProperty(
                    "confidence", out var confidenceValue)
                && confidenceValue.ValueKind == JsonValueKind.Number
                && confidenceValue.TryGetSingle(out var parsedConfidence)
                    ? parsedConfidence
                    : null;
            if (!TryReadRequiredNullableString(
                    values, "refId", out var refIdText)
                || refIdText is not null
                    && !long.TryParse(refIdText, out _)
                || !TryReadRequiredNullableString(
                    values, "payloadJson", out var payloadJson)
                || !TryReadRequiredNullableString(
                    values, "title", out var title)
                || !TryReadRequiredNullableString(
                    values, "colorHint", out var colorHint)
                || !TryReadRequiredNullableString(
                    values, "imageBlobId", out var imageBlobId)
                || !values.TryGetProperty("kind", out var kindValue)
                || kindValue.ValueKind != JsonValueKind.String
                || kindValue.GetString() != "tag"
                || !values.TryGetProperty("createdAt", out var createdValue)
                || createdValue.ValueKind != JsonValueKind.String
                || !createdValue.TryGetDateTime(out var createdAt)
                || !values.TryGetProperty(
                    "fieldProvenance", out var provenanceValue)
                || provenanceValue.ValueKind != JsonValueKind.Array)
                return false;
            if (payloadJson is not null)
            {
                try
                {
                    using var _ = JsonDocument.Parse(payloadJson);
                }
                catch (JsonException)
                {
                    return false;
                }
            }
            IReadOnlyList<NativeFieldProvenanceSnapshot> fieldProvenance;
            try
            {
                fieldProvenance = JsonSerializer.Deserialize<
                    IReadOnlyList<NativeFieldProvenanceSnapshot>>(
                        provenanceValue.GetRawText(),
                        JsonOptions) ?? [];
            }
            catch (JsonException)
            {
                return false;
            }
            if (!ValidFieldProvenance(fieldProvenance))
                return false;
            parsed.Add(new(
                nativeId,
                recycleBinItemId,
                revision,
                updatedAt,
                tagId,
                startSec,
                endSec,
                "tag",
                refIdText is null ? null : long.Parse(refIdText),
                payloadJson,
                string.IsNullOrWhiteSpace(sourceKey) ? "user" : sourceKey,
                sourceRunId,
                confidence,
                title,
                colorHint,
                imageBlobId,
                createdAt,
                fieldProvenance));
        }
        snapshots = parsed;
        return true;
    }

    private static bool TryReadRequiredNullableString(
        JsonElement values,
        string propertyName,
        out string? value)
    {
        value = null;
        if (!values.TryGetProperty(propertyName, out var property))
            return false;
        if (property.ValueKind == JsonValueKind.Null)
            return true;
        if (property.ValueKind != JsonValueKind.String)
            return false;
        value = property.GetString();
        return true;
    }

    private static bool ValidFieldProvenance(
        IReadOnlyList<NativeFieldProvenanceSnapshot> rows)
    {
        if (rows.Count > 1000
            || rows.Any(row =>
                string.IsNullOrWhiteSpace(row.FieldKey)
                || row.FieldKey.Length > 100
                || string.IsNullOrWhiteSpace(row.SourceKey)
                || row.SourceRunId is null
                || row.ModelKey is null))
            return false;
        foreach (var row in rows.Where(row => row.ValueJson is not null))
        {
            try
            {
                using var _ = JsonDocument.Parse(row.ValueJson!);
            }
            catch (JsonException)
            {
                return false;
            }
        }
        return rows
            .Select(row => (
                row.FieldKey,
                row.SourceKey,
                row.SourceRunId,
                row.ModelKey))
            .Distinct()
            .Count() == rows.Count;
    }

    private static bool TryParseProvenance(
        string json,
        out IReadOnlyList<NativeFieldProvenanceSnapshot> rows)
    {
        rows = [];
        try
        {
            rows = JsonSerializer.Deserialize<
                IReadOnlyList<NativeFieldProvenanceSnapshot>>(
                    json,
                    JsonOptions) ?? [];
            return ValidFieldProvenance(rows);
        }
        catch (JsonException)
        {
            return false;
        }
    }

    private static async Task<BasicNativeHistoryRestoreResult?> ReplayAsync(
        DbContext db,
        Guid operationId,
        string fingerprint,
        CovePrincipal? principal,
        CancellationToken ct)
    {
        var receipt = await db.Set<SegmentStudioSegmentOperation>()
            .AsNoTracking()
            .SingleOrDefaultAsync(
                operation => operation.OperationId == operationId, ct);
        if (receipt is null)
            return null;
        if (receipt.Kind != OperationKind
            || receipt.RequestFingerprint != fingerprint
            || receipt.ActorUserId != principal?.UserId)
            return new(BasicNativeHistoryRestoreStatus.Conflict,
                Error: "The operation ID was already used for another request.");
        return new(BasicNativeHistoryRestoreStatus.Updated, Replayed: true);
    }

    private static string Fingerprint(
        int videoId,
        BasicNativeHistoryRestoreRequest request,
        JsonElement sourceState,
        JsonElement targetState)
    {
        var canonical = JsonSerializer.Serialize(new
        {
            videoId,
            request.ExpectedHistoryRevision,
            request.ActionSequence,
            request.Direction,
            source = sourceState,
            target = targetState,
        });
        return Convert.ToHexString(
            SHA256.HashData(Encoding.UTF8.GetBytes(canonical)))
            .ToLowerInvariant();
    }

    private static JsonElement ParseJson(string json)
    {
        using var document = JsonDocument.Parse(json);
        return document.RootElement.Clone();
    }

    private sealed record NativeSnapshot(
        int? NativeSegmentId,
        long? RecycleBinItemId,
        long? Revision,
        DateTime? UpdatedAt,
        int TagId,
        double StartSec,
        double? EndSec,
        string Kind,
        long? RefId,
        string? PayloadJson,
        string SourceKey,
        string? SourceRunId,
        float? Confidence,
        string? Title,
        string? ColorHint,
        string? ImageBlobId,
        DateTime CreatedAt,
        IReadOnlyList<NativeFieldProvenanceSnapshot> FieldProvenance);

    private sealed record NativeFieldProvenanceSnapshot(
        string FieldKey,
        string? ValueJson,
        string SourceKey,
        string SourceRunId,
        string ModelKey,
        float? Confidence,
        DateTime CreatedAt,
        DateTime UpdatedAt);
}
