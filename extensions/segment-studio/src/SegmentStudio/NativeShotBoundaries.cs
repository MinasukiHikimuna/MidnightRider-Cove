using System.Text.Json;
using System.Text.Json.Nodes;
using Cove.Core.DTOs;
using Cove.Core.Entities;
using Cove.Core.Interfaces;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;

namespace SegmentStudio;

/// <summary>
/// Shot boundaries stored natively by Cove (<c>IVideoShotService</c>), presented in the shape the editor
/// already uses for Segment Studio's own rows. Every method returns null when the video should keep using
/// Segment Studio's legacy table instead: when the host has no native shot storage, or when the video has no
/// native set but still has legacy rows.
/// </summary>
/// <remarks>
/// This is the only type that names Cove's shot types, and the entry points taking an
/// <see cref="IServiceProvider"/> don't, so their callers compile on any host. Hosts older than the native
/// storage never run them: <see cref="ShotBoundaryStore"/> checks <see cref="NativeShotSupport"/> first, and
/// the CLR resolves the shot types only when one of these methods is compiled.
/// </remarks>
internal static class NativeShotBoundaries
{
    internal static Task<IReadOnlyList<ShotBoundaryResponse>?> ListAsync(
        DbContext db, IServiceProvider services, int videoId, CancellationToken ct) =>
        ListAsync(db, services.GetService<IVideoShotService>(), videoId, ct);

    internal static async Task<IReadOnlyList<ShotBoundaryResponse>?> ListAsync(
        DbContext db, IVideoShotService? shots, int videoId, CancellationToken ct)
    {
        if (shots is null)
            return null;
        var set = await shots.GetForVideoAsync(videoId, ct);
        if (set is null && await HasLegacyRowsAsync(db, videoId, ct))
            return null;
        return ToResponses(videoId, set);
    }

    internal static Task<ShotBoundaryMutationResult?> SplitAsync(
        DbContext db, IServiceProvider services, int videoId, SplitShotBoundaryRequest request, CancellationToken ct) =>
        SplitAsync(db, services.GetService<IVideoShotService>(), PrimaryFileResolver(db), videoId, request, ct);

    internal static async Task<ShotBoundaryMutationResult?> SplitAsync(
        DbContext db, IVideoShotService? shots, Func<int, CancellationToken, Task<int?>> primaryFileId,
        int videoId, SplitShotBoundaryRequest request, CancellationToken ct)
    {
        if (shots is null)
            return null;
        if (request.OperationId == Guid.Empty || !double.IsFinite(request.TimeSec))
            return Invalid("A valid operation ID and boundary time are required.");
        var set = await shots.GetForVideoAsync(videoId, ct);
        if (set is null && await HasLegacyRowsAsync(db, videoId, ct))
            return null;

        await ShotBoundaryService.AcquireMutationLocksAsync(db, request.OperationId, videoId, ct);
        var fingerprint = FormattableString.Invariant($"native-split:{videoId}:{request.TimeSec:R}");
        if (await ReplayAsync(db, shots, request.OperationId, fingerprint, videoId, ct) is { } replay)
            return replay;

        set = await shots.GetForVideoAsync(videoId, ct);
        var fileId = set?.FileId ?? await primaryFileId(videoId, ct);
        if (fileId is null)
            return Invalid("The video has no primary file to draw shots on.");
        var result = await shots.SplitAsync(new VideoShotSplitRequest
        {
            FileId = fileId.Value,
            AtSec = request.TimeSec,
            Expected = VersionOf(set),
        }, ct);
        return await CompleteAsync(db, videoId, request.OperationId, "split", fingerprint, result, ct);
    }

    internal static Task<ShotBoundaryMutationResult?> MergeAsync(
        DbContext db, IServiceProvider services, int videoId, MergeShotBoundaryRequest request, CancellationToken ct) =>
        MergeAsync(db, services.GetService<IVideoShotService>(), videoId, request, ct);

    internal static async Task<ShotBoundaryMutationResult?> MergeAsync(
        DbContext db, IVideoShotService? shots, int videoId, MergeShotBoundaryRequest request, CancellationToken ct)
    {
        if (shots is null)
            return null;
        if (request.OperationId == Guid.Empty || !double.IsFinite(request.TimeSec))
            return Invalid("A valid operation ID and boundary time are required.");
        var set = await shots.GetForVideoAsync(videoId, ct);
        if (set is null && await HasLegacyRowsAsync(db, videoId, ct))
            return null;

        await ShotBoundaryService.AcquireMutationLocksAsync(db, request.OperationId, videoId, ct);
        var fingerprint = FormattableString.Invariant($"native-merge:{videoId}:{request.TimeSec:R}");
        if (await ReplayAsync(db, shots, request.OperationId, fingerprint, videoId, ct) is { } replay)
            return replay;

        set = await shots.GetForVideoAsync(videoId, ct);
        if (set is null)
            return Invalid("There is no removable shot boundary at this time.");
        var result = await shots.MergeAsync(new VideoShotMergeRequest
        {
            FileId = set.FileId,
            CutSec = request.TimeSec,
            Expected = VersionOf(set)!,
        }, ct);
        return await CompleteAsync(db, videoId, request.OperationId, "merge", fingerprint, result, ct);
    }

    internal static Task<ShotBoundaryMutationResult?> RestoreAsync(
        DbContext db, IServiceProvider services, int videoId, RestoreShotBoundariesRequest request, CancellationToken ct) =>
        RestoreAsync(db, services.GetService<IVideoShotService>(), PrimaryFileResolver(db), videoId, request, ct);

    internal static async Task<ShotBoundaryMutationResult?> RestoreAsync(
        DbContext db, IVideoShotService? shots, Func<int, CancellationToken, Task<int?>> primaryFileId,
        int videoId, RestoreShotBoundariesRequest request, CancellationToken ct)
    {
        if (shots is null)
            return null;
        if (request.OperationId == Guid.Empty || request.Boundaries is null
            || string.IsNullOrWhiteSpace(request.ExpectedFingerprint))
            return Invalid("A valid operation ID and shot snapshot are required.");
        var set = await shots.GetForVideoAsync(videoId, ct);
        if (set is null && await HasLegacyRowsAsync(db, videoId, ct))
            return null;
        var ordered = request.Boundaries.OrderBy(row => row.StartSec).ThenBy(row => row.Id).ToArray();
        if (ordered.Any(row => !double.IsFinite(row.StartSec) || !double.IsFinite(row.EndSec) || row.EndSec <= row.StartSec))
            return Invalid("The undo snapshot must be empty or a complete, contiguous set of valid shots.");

        await ShotBoundaryService.AcquireMutationLocksAsync(db, request.OperationId, videoId, ct);
        var fingerprint = $"native-restore:{videoId}:{request.ExpectedFingerprint}:{ShotBoundaryService.SnapshotFingerprint(ordered)}";
        if (await ReplayAsync(db, shots, request.OperationId, fingerprint, videoId, ct) is { } replay)
            return replay;

        set = await shots.GetForVideoAsync(videoId, ct);
        if (!string.Equals(ShotBoundaryService.Fingerprint(ToResponses(videoId, set)), request.ExpectedFingerprint, StringComparison.Ordinal))
            return new(ShotBoundaryMutationStatus.Conflict, Error: "The shots changed before undo could be applied.");

        VideoShotEditResult result;
        if (ordered.Length == 0)
        {
            if (set is null)
                return await CompleteAsync(db, videoId, request.OperationId, "restore", fingerprint,
                    new VideoShotEditResult { Status = VideoShotEditStatus.Deleted }, ct);
            result = await shots.DeleteAsync(new VideoShotDeleteRequest { FileId = set.FileId, Expected = VersionOf(set) }, ct);
        }
        else
        {
            var fileId = set?.FileId ?? await primaryFileId(videoId, ct);
            if (fileId is null)
                return Invalid("The video has no primary file to draw shots on.");
            result = await shots.ReplaceShotsAsync(new VideoShotReplaceRequest
            {
                FileId = fileId.Value,
                Shots = ToInputs(ordered),
                Expected = VersionOf(set),
            }, ct);
        }
        return await CompleteAsync(db, videoId, request.OperationId, "restore", fingerprint, result, ct);
    }

    /// <summary>
    /// Maps a native set to editor rows. Each row carries the set's revision, so the editor's fingerprint
    /// changes with every edit of the set; shot type, transition and frames travel in the metadata so that
    /// undo can restore them.
    /// </summary>
    internal static IReadOnlyList<ShotBoundaryResponse> ToResponses(int videoId, VideoShotSetDto? set)
    {
        if (set?.Shots is not { } shots)
            return [];
        var source = string.IsNullOrWhiteSpace(set.Model) ? set.SourceKey : set.Model;
        var createdAt = AsUtc(set.CreatedAt);
        var updatedAt = AsUtc(set.UpdatedAt);
        return shots.OrderBy(shot => shot.StartSec).ThenBy(shot => shot.Id)
            .Select(shot => new ShotBoundaryResponse(
                shot.Id, videoId, shot.StartSec, shot.EndSec, source, Metadata(shot),
                set.Revision, createdAt, updatedAt))
            .ToList();
    }

    private static string? Metadata(VideoShotDto shot)
    {
        var node = new JsonObject();
        if (shot.ShotType is not null) node["shotType"] = shot.ShotType;
        if (shot.TransitionIn is not null) node["transitionIn"] = shot.TransitionIn;
        if (shot.StartFrame is not null) node["startFrame"] = shot.StartFrame;
        if (shot.EndFrame is not null) node["endFrame"] = shot.EndFrame;
        return node.Count == 0 ? null : node.ToJsonString();
    }

    private static IReadOnlyList<VideoShotInput> ToInputs(IReadOnlyList<ShotBoundaryRestoreItem> rows)
    {
        var parsed = rows.Select(row => (Row: row, Meta: ParseMetadata(row.Metadata))).ToList();
        // Cove stores frames for every shot of a set or for none of them.
        var withFrames = parsed.All(item => item.Meta.StartFrame is not null && item.Meta.EndFrame is not null);
        return parsed.Select(item => new VideoShotInput
        {
            StartSec = item.Row.StartSec,
            EndSec = item.Row.EndSec,
            StartFrame = withFrames ? item.Meta.StartFrame : null,
            EndFrame = withFrames ? item.Meta.EndFrame : null,
            ShotType = item.Meta.ShotType,
            TransitionIn = item.Meta.TransitionIn,
        }).ToList();
    }

    private static (string? ShotType, string? TransitionIn, int? StartFrame, int? EndFrame) ParseMetadata(string? metadata)
    {
        if (string.IsNullOrWhiteSpace(metadata))
            return default;
        try
        {
            using var document = JsonDocument.Parse(metadata);
            var root = document.RootElement;
            if (root.ValueKind != JsonValueKind.Object)
                return default;
            return (String(root, "shotType"), String(root, "transitionIn"), Int(root, "startFrame"), Int(root, "endFrame"));
        }
        catch (JsonException)
        {
            return default;
        }

        static string? String(JsonElement root, string name) =>
            root.TryGetProperty(name, out var value) && value.ValueKind == JsonValueKind.String ? value.GetString() : null;
        static int? Int(JsonElement root, string name) =>
            root.TryGetProperty(name, out var value) && value.ValueKind == JsonValueKind.Number && value.TryGetInt32(out var number)
                ? number : null;
    }

    private static async Task<ShotBoundaryMutationResult?> ReplayAsync(
        DbContext db, IVideoShotService shots, Guid operationId, string fingerprint, int videoId, CancellationToken ct)
    {
        var receipt = await db.Set<SegmentStudioShotBoundaryOperation>().AsNoTracking()
            .SingleOrDefaultAsync(row => row.OperationId == operationId, ct);
        if (receipt is null)
            return null;
        return receipt.VideoId == videoId && receipt.RequestFingerprint == fingerprint
            ? new(ShotBoundaryMutationStatus.Updated, ToResponses(videoId, await shots.GetForVideoAsync(videoId, ct)))
            : new(ShotBoundaryMutationStatus.Conflict, Error: "The operation ID was already used for another shot edit.");
    }

    private static async Task<ShotBoundaryMutationResult> CompleteAsync(
        DbContext db, int videoId, Guid operationId, string kind, string fingerprint, VideoShotEditResult result, CancellationToken ct)
    {
        switch (result.Status)
        {
            case VideoShotEditStatus.Updated:
            case VideoShotEditStatus.Deleted:
                db.Add(new SegmentStudioShotBoundaryOperation
                {
                    OperationId = operationId, VideoId = videoId, Kind = kind,
                    RequestFingerprint = fingerprint, CreatedAt = DateTime.UtcNow,
                });
                await db.SaveChangesAsync(ct);
                return new(ShotBoundaryMutationStatus.Updated,
                    result.Status == VideoShotEditStatus.Deleted ? [] : ToResponses(videoId, result.Set));
            case VideoShotEditStatus.Conflict:
                return new(ShotBoundaryMutationStatus.Conflict, Error: result.Error ?? "The shots changed; reload and try again.");
            default:
                return Invalid(result.Error ?? "The shot edit was refused.");
        }
    }

    private static VideoShotSetVersion? VersionOf(VideoShotSetDto? set) =>
        set is null ? null : new VideoShotSetVersion { SetId = set.Id, Revision = set.Revision };

    private static Task<bool> HasLegacyRowsAsync(DbContext db, int videoId, CancellationToken ct) =>
        db.Set<SegmentStudioShotBoundary>().AnyAsync(row => row.VideoId == videoId, ct);

    private static Func<int, CancellationToken, Task<int?>> PrimaryFileResolver(DbContext db) =>
        (videoId, ct) => db.Set<Video>().AsNoTracking()
            .Where(video => video.Id == videoId)
            .Select(video => video.PrimaryFileId)
            .SingleOrDefaultAsync(ct);

    // Cove stores UTC; a value read back without a kind is UTC already.
    private static DateTime AsUtc(DateTime value) => value.Kind switch
    {
        DateTimeKind.Utc => value,
        DateTimeKind.Local => value.ToUniversalTime(),
        _ => DateTime.SpecifyKind(value, DateTimeKind.Utc),
    };

    private static ShotBoundaryMutationResult Invalid(string error) =>
        new(ShotBoundaryMutationStatus.Invalid, Error: error);
}

/// <summary>Whether the host Cove stores shot boundaries natively. Names no Cove shot type.</summary>
internal static class NativeShotSupport
{
    internal static bool IsAvailable { get; } =
        Type.GetType("Cove.Core.Interfaces.IVideoShotService, Cove.Core", throwOnError: false) is not null;
}
