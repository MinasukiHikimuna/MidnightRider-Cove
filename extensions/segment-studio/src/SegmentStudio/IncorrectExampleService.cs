using System.Globalization;
using System.IO.Compression;
using System.Security.Cryptography;
using System.Text;
using System.Text.Json;
using Cove.Core.Auth;
using Cove.Core.Entities;
using Cove.Core.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace SegmentStudio;

public sealed record ToggleIncorrectExampleRequest(
    Guid OperationId,
    int? NativeSegmentId,
    long? ItemId,
    DateTime? ExpectedUpdatedAt,
    long? ExpectedRevision);

public sealed record RemoveIncorrectExampleRequest(
    Guid OperationId,
    long ExpectedExampleRevision,
    long ExpectedRepresentationRevision);

public sealed record IncorrectExampleItem(
    long Id,
    long Revision,
    string Representation,
    long? ItemId,
    long? NativeBinEntryId,
    int VideoId,
    string? TagName,
    double StartSec,
    double? EndSec,
    string? SourceKey,
    string? SourceRunId,
    float? Confidence,
    string? ImageBlobId,
    long RepresentationRevision,
    DateTime CreatedAt);

public sealed record IncorrectExampleToggleResult(
    SegmentTransitionStatus Status,
    bool Collected = false,
    long? ExampleId = null,
    long? ExampleRevision = null,
    string? Representation = null,
    long? ItemId = null,
    long? NativeBinEntryId = null,
    int? NativeSegmentId = null,
    long? Revision = null,
    string? Error = null,
    bool Replayed = false,
    string? Code = null,
    IncorrectExampleEditorDelta? EditorDelta = null);

public sealed record TrainingExportCaptureFrame(string FieldName, double TimestampSec);
public sealed record TrainingExportCaptureExample(
    long ExampleId,
    long ExpectedExampleRevision,
    long ExpectedRepresentationRevision,
    IReadOnlyList<TrainingExportCaptureFrame> Frames);
public sealed record TrainingExportCaptureRequest(
    Guid OperationId,
    IReadOnlyList<TrainingExportCaptureExample> Examples);
public sealed record TrainingFrameUpload(string FieldName, string ContentType, byte[] Content);
public sealed record TrainingExportResult(
    Guid Id,
    int ExampleCount,
    int FrameCount,
    DateTime CreatedAt,
    string DownloadUrl,
    bool Replayed = false);
public sealed record TrainingExportCompletionResult(
    Guid Id,
    int ClearedExampleCount,
    DateTime CompletedAt,
    bool Replayed = false);
public sealed record TrainingExportDownload(byte[] Content, string FileName);

public static class IncorrectExampleService
{
    private const string ToggleOperationKind = "incorrect-example-toggle";
    private const string CollectOperationKind = "incorrect-example-collect";
    private const string RemoveOperationKind = "incorrect-example-remove";
    private const int MaximumExamplesPerExport = 500;
    private const int MaximumFrameBytes = 20 * 1024 * 1024;
    private const int MaximumExportBytes = 500 * 1024 * 1024;
    private static readonly JsonSerializerOptions JsonOptions =
        new(JsonSerializerDefaults.Web);

    public static async Task<IReadOnlyList<IncorrectExampleItem>> ListAsync(
        DbContext db,
        int videoId,
        CancellationToken ct)
    {
        var examples = await db.Set<SegmentStudioIncorrectExample>().AsNoTracking()
            .Where(example => example.VideoId == videoId)
            .OrderBy(example => example.CreatedAt)
            .ThenBy(example => example.Id)
            .ToListAsync(ct);
        var itemIds = examples.Where(example => example.ItemId is not null)
            .Select(example => example.ItemId!.Value).ToArray();
        var binIds = examples.Where(example => example.NativeBinEntryId is not null)
            .Select(example => example.NativeBinEntryId!.Value).ToArray();
        var items = await db.Set<SegmentStudioItem>().AsNoTracking()
            .Where(item => itemIds.Contains(item.Id))
            .ToDictionaryAsync(item => item.Id, ct);
        var binEntries = await db.Set<SegmentStudioNativeRecycleBinEntry>().AsNoTracking()
            .Where(entry => binIds.Contains(entry.Id))
            .ToDictionaryAsync(entry => entry.Id, ct);
        var tagIds = items.Values.Where(item => item.TagId is not null)
            .Select(item => item.TagId!.Value)
            .Concat(binEntries.Values.Select(entry => entry.TagId))
            .Distinct()
            .ToArray();
        var tags = await db.Set<Tag>().AsNoTracking()
            .Where(tag => tagIds.Contains(tag.Id))
            .ToDictionaryAsync(tag => tag.Id, tag => tag.Name, ct);

        var result = new List<IncorrectExampleItem>(examples.Count);
        foreach (var example in examples)
        {
            if (example.ItemId is long itemId && items.TryGetValue(itemId, out var item)
                && item.TagId is int itemTagId && item.StartSec is double itemStart)
            {
                result.Add(new(
                    example.Id,
                    example.Revision,
                    "fullItem",
                    item.Id,
                    null,
                    videoId,
                    tags.GetValueOrDefault(itemTagId),
                    itemStart,
                    item.EndSec,
                    item.SourceKey,
                    item.SourceRunId,
                    item.Confidence,
                    item.ExtensionImageBlobId,
                    item.Revision,
                    example.CreatedAt));
            }
            else if (example.NativeBinEntryId is long binId
                     && binEntries.TryGetValue(binId, out var entry))
            {
                result.Add(new(
                    example.Id,
                    example.Revision,
                    "basicNativeBin",
                    null,
                    entry.Id,
                    videoId,
                    tags.GetValueOrDefault(entry.TagId),
                    entry.StartSec,
                    entry.EndSec,
                    entry.SourceKey,
                    entry.SourceRunId,
                    entry.Confidence,
                    entry.ImageBlobId,
                    entry.Revision,
                    example.CreatedAt));
            }
        }
        return result;
    }

    public static async Task<IncorrectExampleToggleResult> ToggleAsync(
        DbContext db,
        int videoId,
        ToggleIncorrectExampleRequest request,
        CovePrincipal? principal,
        IAuthorizationService authorization,
        IBlobService blobs,
        CancellationToken ct,
        string mode = SegmentStudioModes.Full,
        INativeAiProvenanceIngestionService? nativeAiIngestion = null)
    {
        if (request.OperationId == Guid.Empty)
            return new(SegmentTransitionStatus.Invalid, Error: "Operation ID is required.");
        if ((request.NativeSegmentId is null) == (request.ItemId is null))
            return new(SegmentTransitionStatus.Invalid, Error: "Provide exactly one segment identity.");
        mode = SegmentStudioModes.NormalizePublic(mode);
        var fingerprint = Fingerprint(new
        {
            videoId,
            mode,
            request.NativeSegmentId,
            request.ItemId,
            request.ExpectedUpdatedAt,
            request.ExpectedRevision,
        });
        var access = await AuthorizeManageAsync(
            videoId, principal, authorization, requireDelete: true, ct);
        if (access is not null)
            return access;
        await SegmentStudioReviewLock.AcquireAsync(db, videoId, ct);
        var replay = await ReplayAsync(
            db, request.OperationId, ToggleOperationKind, fingerprint,
            principal?.UserId, ct);
        if (replay is not null)
            return replay;

        IncorrectExampleToggleResult result;
        if (request.NativeSegmentId is int nativeSegmentId)
        {
            result = await CollectNativeAsync(
                db, videoId, nativeSegmentId, request, mode,
                principal, authorization, blobs, nativeAiIngestion, ct);
        }
        else
        {
            var existing = await db.Set<SegmentStudioIncorrectExample>()
                .SingleOrDefaultAsync(example => example.ItemId == request.ItemId, ct);
            result = existing is null
                ? await CollectItemAsync(db, videoId, request, principal, ct)
                : await RemoveItemAsync(
                    db, videoId, existing, request.ExpectedRevision,
                    expectedExampleRevision: existing.Revision, ct);
        }
        if (result.Status != SegmentTransitionStatus.Updated)
            return result;

        if (mode == SegmentStudioModes.Basic)
        {
            result = result with
            {
                EditorDelta = IncorrectExampleEditorDeltaService.RemovedNative(
                    request.NativeSegmentId!.Value),
            };
        }
        else if (result.ItemId is long itemId)
        {
            var removedIds = request.NativeSegmentId is int removedNativeSegmentId
                ? new long[] { removedNativeSegmentId }
                : [];
            var identityChanges = request.NativeSegmentId is int previousId
                ? new[]
                {
                    new IncorrectExampleSegmentIdentityChange(
                        previousId, -itemId),
                }
                : [];
            result = result with
            {
                EditorDelta = await IncorrectExampleEditorDeltaService
                    .LoadItemClosureAsync(
                        db, videoId, [itemId], removedIds,
                        identityChanges, ct),
            };
        }

        AddReceipt(
            db,
            request.OperationId,
            ToggleOperationKind,
            fingerprint,
            principal?.UserId,
            request.NativeSegmentId,
            result.ItemId,
            result);
        await db.SaveChangesAsync(ct);
        return result;
    }

    public static async Task<IncorrectExampleToggleResult> CollectAsync(
        DbContext db,
        int videoId,
        ToggleIncorrectExampleRequest request,
        CovePrincipal? principal,
        IAuthorizationService authorization,
        IBlobService blobs,
        CancellationToken ct,
        string mode = SegmentStudioModes.Full,
        INativeAiProvenanceIngestionService? nativeAiIngestion = null)
    {
        if (request.OperationId == Guid.Empty)
            return new(SegmentTransitionStatus.Invalid, Error: "Operation ID is required.");
        if ((request.NativeSegmentId is null) == (request.ItemId is null))
            return new(SegmentTransitionStatus.Invalid, Error: "Provide exactly one segment identity.");
        mode = SegmentStudioModes.NormalizePublic(mode);
        var fingerprint = Fingerprint(new
        {
            videoId,
            mode,
            request.NativeSegmentId,
            request.ItemId,
            request.ExpectedUpdatedAt,
            request.ExpectedRevision,
        });
        var access = await AuthorizeManageAsync(
            videoId, principal, authorization, requireDelete: true, ct);
        if (access is not null)
            return access;
        await SegmentStudioReviewLock.AcquireAsync(db, videoId, ct);
        var replay = await ReplayAsync(
            db, request.OperationId, CollectOperationKind, fingerprint,
            principal?.UserId, ct);
        if (replay is not null)
            return replay;

        IncorrectExampleToggleResult result;
        if (request.NativeSegmentId is int nativeSegmentId)
        {
            result = await CollectNativeAsync(
                db, videoId, nativeSegmentId, request, mode,
                principal, authorization, blobs, nativeAiIngestion, ct);
        }
        else
        {
            var existing = await db.Set<SegmentStudioIncorrectExample>()
                .SingleOrDefaultAsync(example =>
                    example.VideoId == videoId
                    && example.ItemId == request.ItemId, ct);
            if (existing is null)
            {
                result = await CollectItemAsync(
                    db, videoId, request, principal, ct);
            }
            else
            {
                var item = await db.Set<SegmentStudioItem>().AsNoTracking()
                    .SingleOrDefaultAsync(candidate =>
                        candidate.Id == request.ItemId
                        && candidate.VideoId == videoId, ct);
                result = item is null
                    ? new(
                        SegmentTransitionStatus.NotFound,
                        Error: "Collected segment not found.")
                    : new(
                        SegmentTransitionStatus.Updated,
                        Collected: true,
                        ExampleId: existing.Id,
                        ExampleRevision: existing.Revision,
                        Representation: "fullItem",
                        ItemId: item.Id,
                        Revision: item.Revision);
            }
        }
        if (result.Status != SegmentTransitionStatus.Updated)
            return result;

        if (mode == SegmentStudioModes.Basic)
        {
            result = result with
            {
                EditorDelta = IncorrectExampleEditorDeltaService.RemovedNative(
                    request.NativeSegmentId!.Value),
            };
        }
        else if (result.ItemId is long itemId)
        {
            var removedIds = request.NativeSegmentId is int removedNativeSegmentId
                ? new long[] { removedNativeSegmentId }
                : [];
            var identityChanges = request.NativeSegmentId is int previousId
                ? new[]
                {
                    new IncorrectExampleSegmentIdentityChange(
                        previousId, -itemId),
                }
                : [];
            result = result with
            {
                EditorDelta = await IncorrectExampleEditorDeltaService
                    .LoadItemClosureAsync(
                        db, videoId, [itemId], removedIds,
                        identityChanges, ct),
            };
        }

        AddReceipt(
            db,
            request.OperationId,
            CollectOperationKind,
            fingerprint,
            principal?.UserId,
            request.NativeSegmentId,
            result.ItemId,
            result);
        await db.SaveChangesAsync(ct);
        return result;
    }

    public static async Task<IncorrectExampleToggleResult> RemoveAsync(
        DbContext db,
        int videoId,
        long exampleId,
        RemoveIncorrectExampleRequest request,
        CovePrincipal? principal,
        IAuthorizationService authorization,
        IBlobService blobs,
        CancellationToken ct)
    {
        if (request.OperationId == Guid.Empty)
            return new(SegmentTransitionStatus.Invalid, Error: "Operation ID is required.");
        var fingerprint = Fingerprint(new
        {
            videoId,
            exampleId,
            request.ExpectedExampleRevision,
            request.ExpectedRepresentationRevision,
        });
        var access = await AuthorizeManageAsync(
            videoId, principal, authorization, requireDelete: true, ct);
        if (access is not null)
            return access;
        await SegmentStudioReviewLock.AcquireAsync(db, videoId, ct);
        var replay = await ReplayAsync(
            db, request.OperationId, RemoveOperationKind, fingerprint,
            principal?.UserId, ct);
        if (replay is not null)
            return replay;
        var example = await db.Set<SegmentStudioIncorrectExample>()
            .SingleOrDefaultAsync(candidate =>
                candidate.Id == exampleId && candidate.VideoId == videoId, ct);
        if (example is null)
            return new(SegmentTransitionStatus.NotFound, Error: "Incorrect example not found.");
        if (example.Revision != request.ExpectedExampleRevision)
            return new(
                SegmentTransitionStatus.Conflict,
                ExampleId: example.Id,
                ExampleRevision: example.Revision,
                Error: "This incorrect example changed. Reload before removing it.");

        IncorrectExampleToggleResult result;
        if (example.ItemId is long)
        {
            result = await RemoveItemAsync(
                db, videoId, example, request.ExpectedRepresentationRevision,
                request.ExpectedExampleRevision, ct);
        }
        else if (example.NativeBinEntryId is long binEntryId)
        {
            var entry = await db.Set<SegmentStudioNativeRecycleBinEntry>()
                .AsNoTracking()
                .SingleOrDefaultAsync(candidate => candidate.Id == binEntryId, ct);
            if (entry is null)
                return new(SegmentTransitionStatus.NotFound, Error: "Collected recycling-bin segment not found.");
            if (entry.Revision != request.ExpectedRepresentationRevision)
                return new(
                    SegmentTransitionStatus.Conflict,
                    ExampleId: example.Id,
                    ExampleRevision: example.Revision,
                    Representation: "basicNativeBin",
                    NativeBinEntryId: entry.Id,
                    Revision: entry.Revision,
                    Error: "This collected segment changed. Reload before restoring it.");
            var restored = await BasicNativeRecycleBinService.RestoreAsync(
                db,
                entry.Id,
                new(
                    DeriveOperationId(request.OperationId, "basic-feedback-restore"),
                    entry.Revision),
                principal,
                authorization,
                blobs,
                ct,
                permittedIncorrectExampleId: example.Id);
            if (restored.Status != SegmentTransitionStatus.Updated)
                return new(
                    restored.Status,
                    ExampleId: example.Id,
                    ExampleRevision: example.Revision,
                    Representation: "basicNativeBin",
                    NativeBinEntryId: entry.Id,
                    Revision: entry.Revision,
                    Error: restored.Error,
                    Code: restored.Code);
            result = new(
                SegmentTransitionStatus.Updated,
                Collected: false,
                ExampleId: example.Id,
                ExampleRevision: example.Revision,
                Representation: "native",
                NativeSegmentId: restored.NativeSegmentId,
                Revision: restored.Revision);
        }
        else
        {
            return new(SegmentTransitionStatus.Conflict, Error: "The incorrect example representation is invalid.");
        }

        await db.SaveChangesAsync(ct);
        if (result.Status == SegmentTransitionStatus.Updated)
        {
            if (result.Representation == "fullItem" && result.ItemId is long itemId)
            {
                result = result with
                {
                    EditorDelta = await IncorrectExampleEditorDeltaService
                        .LoadItemClosureAsync(
                            db, videoId, [itemId], [], [], ct),
                };
            }
            else if (result.Representation == "native"
                && result.NativeSegmentId is int nativeSegmentId)
            {
                result = result with
                {
                    EditorDelta = await IncorrectExampleEditorDeltaService
                        .LoadBasicNativeAsync(
                            db, videoId, nativeSegmentId,
                            await CanReadProvenanceAsync(
                                principal, authorization, ct),
                            ct),
                };
            }
        }

        AddReceipt(
            db,
            request.OperationId,
            RemoveOperationKind,
            fingerprint,
            principal?.UserId,
            null,
            result.ItemId,
            result);
        await db.SaveChangesAsync(ct);
        return result;
    }

    public static IReadOnlyList<double> FrameTimestamps(double startSec, double? endSec)
    {
        if (endSec is null || !double.IsFinite(endSec.Value) || endSec <= startSec)
            return [RoundTimestamp(startSec)];
        var duration = endSec.Value - startSec;
        double[] offsets = duration switch
        {
            < 30 => [4],
            < 60 => [4, 20],
            < 120 => [4, 20, 50],
            _ => [4, 20, 50, 100],
        };
        var lastInside = Math.Max(startSec, endSec.Value - 0.001);
        return offsets
            .Select(offset => RoundTimestamp(Math.Min(lastInside, startSec + offset)))
            .Distinct()
            .ToArray();
    }

    public static async Task<TrainingExportResult> CaptureExportAsync(
        DbContext db,
        int videoId,
        int? userId,
        TrainingExportCaptureRequest request,
        IReadOnlyList<TrainingFrameUpload> uploads,
        IBlobService blobs,
        CancellationToken ct)
    {
        if (request.OperationId == Guid.Empty)
            throw new IncorrectExampleException("Operation ID is required.");
        if (request.Examples.Count is < 1 or > MaximumExamplesPerExport)
            throw new IncorrectExampleException(
                $"Select between 1 and {MaximumExamplesPerExport} incorrect examples.");
        if (request.Examples.Select(example => example.ExampleId).Distinct().Count()
            != request.Examples.Count)
            throw new IncorrectExampleException("An incorrect example can only appear once.");

        var fingerprint = Fingerprint(new
        {
            videoId,
            examples = request.Examples.Select(example => new
            {
                example.ExampleId,
                example.ExpectedExampleRevision,
                example.ExpectedRepresentationRevision,
                frames = example.Frames.Select(frame => new
                {
                    frame.FieldName,
                    timestampSec = RoundTimestamp(frame.TimestampSec),
                }),
            }),
        });
        var replay = await FindCaptureReplayAsync(
            db, videoId, userId, request.OperationId, fingerprint, ct);
        if (replay is not null)
            return replay;

        await SegmentStudioReviewLock.AcquireAsync(db, videoId, ct);
        replay = await FindCaptureReplayAsync(
            db, videoId, userId, request.OperationId, fingerprint, ct);
        if (replay is not null)
            return replay;

        var exampleIds = request.Examples.Select(example => example.ExampleId).ToArray();
        var workingExamples = await db.Set<SegmentStudioIncorrectExample>().AsNoTracking()
            .Where(example => example.VideoId == videoId && exampleIds.Contains(example.Id))
            .ToDictionaryAsync(example => example.Id, ct);
        if (workingExamples.Count != exampleIds.Length)
            throw new IncorrectExampleConflictException(
                "The incorrect-example collection changed. Reload before exporting.");
        if (uploads.Select(upload => upload.FieldName)
                .Distinct(StringComparer.Ordinal).Count() != uploads.Count)
            throw new IncorrectExampleException("Every uploaded frame needs a unique field name.");
        var uploadMap = uploads.ToDictionary(
            upload => upload.FieldName, StringComparer.Ordinal);
        var requestedFieldNames = request.Examples
            .SelectMany(example => example.Frames)
            .Select(frame => frame.FieldName)
            .ToArray();
        if (requestedFieldNames.Distinct(StringComparer.Ordinal).Count()
                != requestedFieldNames.Length
            || requestedFieldNames.Length != uploads.Count
            || requestedFieldNames.Any(fieldName => !uploadMap.ContainsKey(fieldName)))
            throw new IncorrectExampleException("The uploaded frame set is incomplete or unexpected.");
        var totalBytes = 0;
        foreach (var upload in uploads)
        {
            if (!string.Equals(upload.ContentType, "image/jpeg", StringComparison.OrdinalIgnoreCase)
                || upload.Content.Length is < 4 or > MaximumFrameBytes
                || upload.Content[0] != 0xff
                || upload.Content[1] != 0xd8)
                throw new IncorrectExampleException("Every frame must be a non-empty JPEG image.");
            totalBytes = checked(totalBytes + upload.Content.Length);
            if (totalBytes > MaximumExportBytes)
                throw new IncorrectExampleException("The uploaded frame set is too large.");
        }

        var captures = new List<CaptureCandidate>(request.Examples.Count);
        foreach (var expected in request.Examples)
        {
            var example = workingExamples[expected.ExampleId];
            if (example.Revision != expected.ExpectedExampleRevision)
                throw new IncorrectExampleConflictException(
                    "An incorrect example changed. Reload before exporting.");
            var candidate = await LoadCaptureCandidateAsync(db, example, ct)
                ?? throw new IncorrectExampleConflictException(
                    "A collected segment is no longer available.");
            if (candidate.RepresentationRevision != expected.ExpectedRepresentationRevision)
                throw new IncorrectExampleConflictException(
                    "A collected segment changed. Reload before exporting.");
            if (!await IsEligibleAtExportAsync(db, candidate, ct))
                throw new IncorrectExampleException(
                    "Every exported example must retain registered AI provenance.");
            var expectedTimestamps = FrameTimestamps(candidate.Snapshot.StartSec, candidate.Snapshot.EndSec);
            var requestedTimestamps = expected.Frames
                .Select(frame => RoundTimestamp(frame.TimestampSec))
                .ToArray();
            if (!expectedTimestamps.SequenceEqual(requestedTimestamps))
                throw new IncorrectExampleException(
                    "The uploaded frame timestamps do not match the segment sampling plan.");
            captures.Add(candidate with { Request = expected });
        }

        var exportId = Guid.NewGuid();
        var createdAt = DateTime.UtcNow;
        var copiedBlobIds = new List<string>(uploads.Count);
        var storedFrames = new Dictionary<string, string>(StringComparer.Ordinal);
        try
        {
            foreach (var upload in uploads)
            {
                await using var stream = new MemoryStream(upload.Content, writable: false);
                var blobId = await blobs.StoreBlobAsync(stream, "image/jpeg", ct);
                storedFrames.Add(upload.FieldName, blobId);
                copiedBlobIds.Add(blobId);
            }

            var manifestJson = BuildPublicManifest(
                exportId,
                createdAt,
                captures.Select(candidate => candidate.Snapshot).ToArray());
            db.Add(new SegmentStudioTrainingExport
            {
                Id = exportId,
                VideoId = videoId,
                CaptureOperationId = request.OperationId,
                MetadataJson = JsonSerializer.Serialize(new
                {
                    schemaVersion = 2,
                    requestFingerprint = fingerprint,
                }, JsonOptions),
                ManifestJson = manifestJson,
                ExampleCount = captures.Count,
                RequestedByUserId = userId,
                CreatedAt = createdAt,
            });
            var exportExamples = captures.Select((candidate, position) =>
                new SegmentStudioTrainingExportExample
                {
                    ExportId = exportId,
                    Position = position,
                    CapturedExampleId = candidate.Example.Id,
                    CapturedExampleRevision = candidate.Example.Revision,
                    ItemId = candidate.Example.ItemId,
                    NativeBinEntryId = candidate.Example.NativeBinEntryId,
                    SnapshotJson = candidate.Example.SnapshotJson,
                }).ToArray();
            db.AddRange(exportExamples);
            await db.SaveChangesAsync(ct);
            foreach (var pair in captures.Select((candidate, position) =>
                         new { Candidate = candidate, ExportExample = exportExamples[position] }))
            {
                db.AddRange(pair.Candidate.Request!.Frames.Select((frame, position) =>
                    new SegmentStudioTrainingExportFrame
                    {
                        ExportExampleId = pair.ExportExample.Id,
                        Position = position,
                        TimestampSec = RoundTimestamp(frame.TimestampSec),
                        ImageBlobId = storedFrames[frame.FieldName],
                    }));
            }
            await db.SaveChangesAsync(ct);
        }
        catch
        {
            foreach (var copiedBlobId in copiedBlobIds)
                await blobs.DeleteBlobAsync(copiedBlobId, CancellationToken.None);
            throw;
        }

        return new(
            exportId,
            captures.Count,
            uploads.Count,
            createdAt,
            $"/api/plugins/segment-studio/training-exports/{exportId:D}/download");
    }

    public static async Task<TrainingExportDownload?> BuildDownloadAsync(
        DbContext db,
        Guid exportId,
        IBlobService blobs,
        CancellationToken ct)
    {
        var export = await db.Set<SegmentStudioTrainingExport>().AsNoTracking()
            .SingleOrDefaultAsync(row => row.Id == exportId, ct);
        if (export is null)
            return null;
        var exportExamples = await db.Set<SegmentStudioTrainingExportExample>()
            .AsNoTracking()
            .Where(row => row.ExportId == exportId)
            .OrderBy(row => row.Position)
            .ToListAsync(ct);
        IReadOnlyList<DownloadExample> examples;
        string manifestJson;
        if (exportExamples.Count > 0)
        {
            var exportExampleIds = exportExamples.Select(row => row.Id).ToArray();
            var frames = await db.Set<SegmentStudioTrainingExportFrame>().AsNoTracking()
                .Where(row => exportExampleIds.Contains(row.ExportExampleId))
                .OrderBy(row => row.ExportExampleId)
                .ThenBy(row => row.Position)
                .ToListAsync(ct);
            var framesByExample = frames.ToLookup(frame => frame.ExportExampleId);
            examples = exportExamples.Select(row => new DownloadExample(
                DeserializeSnapshot(row.SnapshotJson),
                framesByExample[row.Id].Select(frame =>
                    new DownloadFrame(frame.TimestampSec, frame.ImageBlobId)).ToArray()))
                .ToArray();
            manifestJson = export.ManifestJson;
        }
        else
        {
            (examples, manifestJson) = await BuildLegacyDownloadAsync(
                db, export, ct);
        }

        var metadataJson = JsonSerializer.Serialize(
            examples.Select(example => new
            {
                tagName = example.Snapshot.TagName,
                startTime = example.Snapshot.StartSec,
                endTime = example.Snapshot.EndSec,
            }),
            new JsonSerializerOptions(JsonOptions) { WriteIndented = true });
        await using var output = new MemoryStream();
        using (var archive = new ZipArchive(output, ZipArchiveMode.Create, leaveOpen: true))
        {
            await WriteTextEntryAsync(
                archive, "metadata.json", metadataJson, export.CreatedAt, ct);
            await WriteTextEntryAsync(
                archive, "manifest.json", manifestJson, export.CreatedAt, ct);
            var folders = UniqueTagFolders(examples.Select(example => example.Snapshot.TagName));
            for (var exampleIndex = 0; exampleIndex < examples.Count; exampleIndex++)
            {
                var example = examples[exampleIndex];
                var reference = $"example-{exampleIndex + 1:000}";
                foreach (var frame in example.Frames)
                {
                    var blob = await blobs.GetBlobAsync(frame.ImageBlobId, ct)
                        ?? throw new IncorrectExampleConflictException(
                            "An immutable export frame is missing.");
                    await using var stream = blob.Stream;
                    var timestamp = frame.TimestampSec.ToString("0.###", CultureInfo.InvariantCulture);
                    var entry = archive.CreateEntry(
                        $"frames/{folders[exampleIndex]}/{reference}_{timestamp}.jpg",
                        CompressionLevel.Optimal);
                    entry.LastWriteTime = ZipTimestamp(export.CreatedAt);
                    await using var target = entry.Open();
                    await stream.CopyToAsync(target, ct);
                }
            }
        }
        return new(
            output.ToArray(),
            $"segment-studio-ai-feedback-{export.CreatedAt:yyyyMMddTHHmmssZ}-{export.Id:N}.zip");
    }

    public static async Task<TrainingExportCompletionResult?> CompleteExportAsync(
        DbContext db,
        Guid exportId,
        CancellationToken ct)
    {
        var export = await db.Set<SegmentStudioTrainingExport>()
            .SingleOrDefaultAsync(row => row.Id == exportId, ct);
        if (export is null)
            return null;
        if (export.CompletedAt is DateTime completedAt)
            return new(export.Id, 0, completedAt, Replayed: true);

        await SegmentStudioReviewLock.AcquireAsync(db, export.VideoId, ct);
        await db.Entry(export).ReloadAsync(ct);
        if (export.CompletedAt is DateTime lockedCompletedAt)
            return new(export.Id, 0, lockedCompletedAt, Replayed: true);
        var captured = await db.Set<SegmentStudioTrainingExportExample>().AsNoTracking()
            .Where(row => row.ExportId == exportId)
            .ToListAsync(ct);
        var capturedIds = captured.Select(row => row.CapturedExampleId).ToArray();
        var current = await db.Set<SegmentStudioIncorrectExample>()
            .Where(example => capturedIds.Contains(example.Id))
            .ToListAsync(ct);
        var capturedById = captured.ToDictionary(row => row.CapturedExampleId);
        var removable = current.Where(example =>
        {
            var row = capturedById[example.Id];
            return example.Revision == row.CapturedExampleRevision
                   && example.ItemId == row.ItemId
                   && example.NativeBinEntryId == row.NativeBinEntryId;
        }).ToArray();
        db.RemoveRange(removable);
        export.CompletedAt = DateTime.UtcNow;
        await db.SaveChangesAsync(ct);
        return new(export.Id, removable.Length, export.CompletedAt.Value);
    }

    public static async Task<int?> GetExportVideoIdAsync(
        DbContext db,
        Guid exportId,
        CancellationToken ct) =>
        await db.Set<SegmentStudioTrainingExport>().AsNoTracking()
            .Where(row => row.Id == exportId)
            .Select(row => (int?)row.VideoId)
            .SingleOrDefaultAsync(ct);

    private static async Task<IncorrectExampleToggleResult> CollectNativeAsync(
        DbContext db,
        int videoId,
        int nativeSegmentId,
        ToggleIncorrectExampleRequest request,
        string mode,
        CovePrincipal? principal,
        IAuthorizationService authorization,
        IBlobService blobs,
        INativeAiProvenanceIngestionService? nativeAiIngestion,
        CancellationToken ct)
    {
        if (request.ExpectedUpdatedAt is null)
            return new(SegmentTransitionStatus.Invalid, Error: "The native segment version is required.");
        var segment = await db.Set<Segment>().AsNoTracking()
            .SingleOrDefaultAsync(candidate =>
                candidate.Id == nativeSegmentId
                && candidate.HostType == SegmentHostType.Video
                && candidate.HostId == videoId
                && candidate.Kind == "tag"
                && candidate.TagId != null, ct);
        if (segment is null)
            return new(SegmentTransitionStatus.NotFound, Error: "Segment not found.");
        if (segment.UpdatedAt != request.ExpectedUpdatedAt)
            return new(
                SegmentTransitionStatus.Conflict,
                NativeSegmentId: segment.Id,
                Error: "This segment changed in another session. Reload before collecting it.");
        var normalizedSourceKey = segment.SourceKey.Trim().ToLowerInvariant();
        var registeredNativeAiSource = await db.Set<SegmentStudioSource>()
            .AsNoTracking()
            .AnyAsync(source =>
                source.Key == normalizedSourceKey
                && source.Category == "ai",
                ct);
        if (registeredNativeAiSource
            && normalizedSourceKey.StartsWith(
                "ext:ai.", StringComparison.Ordinal))
        {
            if (nativeAiIngestion is null)
                throw new InvalidOperationException(
                    "Native Cove AI provenance enrichment is unavailable.");
            await nativeAiIngestion.IngestAsync(
                db,
                new NativeAiIngestionRequest(
                    SegmentId: nativeSegmentId,
                    VideoId: videoId,
                    BatchSize: 1),
                ct);
        }
        var linkedItem = await db.Set<SegmentStudioItem>().AsNoTracking()
            .SingleOrDefaultAsync(item => item.NativeSegmentId == nativeSegmentId, ct);
        var assertions = linkedItem is null
            ? []
            : await LoadActiveProvenanceAsync(db, linkedItem.Id, ct);
        var fieldProvenance = await LoadNativeFieldProvenanceAsync(db, nativeSegmentId, ct);
        var nativeSourceKeys = fieldProvenance.Select(row => row.SourceKey)
            .Append(segment.SourceKey)
            .Where(key => !string.IsNullOrWhiteSpace(key))
            .Distinct(StringComparer.OrdinalIgnoreCase)
            .ToArray();
        var registeredSources = await LoadRegisteredSourcesAsync(
            db, nativeSourceKeys, ct);
        if (!assertions.Any(IsAi) && !registeredSources.Any(IsAi))
            return Ineligible();
        var tagName = await db.Set<Tag>().AsNoTracking()
            .Where(tag => tag.Id == segment.TagId)
            .Select(tag => tag.Name)
            .SingleAsync(ct);
        var snapshot = CreateSnapshot(
            segment,
            tagName,
            nativeSegmentId,
            assertions,
            fieldProvenance,
            registeredSources);

        if (mode == SegmentStudioModes.Basic)
        {
            var moved = await BasicNativeRecycleBinService.MoveAsync(
                db,
                videoId,
                nativeSegmentId,
                new(
                    DeriveOperationId(request.OperationId, "basic-feedback-bin"),
                    request.ExpectedUpdatedAt.Value),
                principal,
                authorization,
                blobs,
                ct,
                preserveStableAnchor: true);
            if (moved.Status != SegmentTransitionStatus.Updated || moved.ItemId is null)
                return FromTransition(moved);
            var example = new SegmentStudioIncorrectExample
            {
                NativeBinEntryId = moved.ItemId,
                VideoId = videoId,
                SnapshotJson = snapshot,
                Revision = 1,
                CreatedByUserId = principal?.UserId,
                CreatedAt = DateTime.UtcNow,
            };
            db.Add(example);
            await db.SaveChangesAsync(ct);
            return new(
                SegmentTransitionStatus.Updated,
                Collected: true,
                ExampleId: example.Id,
                ExampleRevision: example.Revision,
                Representation: "basicNativeBin",
                NativeBinEntryId: moved.ItemId,
                Revision: moved.Revision);
        }

        var transition = await SegmentOwnershipTransitionService.MoveNativeToOwnedAsync(
            db,
            videoId,
            nativeSegmentId,
            new(
                DeriveOperationId(request.OperationId, "full-feedback-reject"),
                request.ExpectedUpdatedAt.Value,
                ReviewState: "rejected",
                PreserveLineage: true),
            principal,
            authorization,
            blobs,
            ct);
        if (transition.Status != SegmentTransitionStatus.Updated || transition.ItemId is null)
            return FromTransition(transition);
        var fullExample = new SegmentStudioIncorrectExample
        {
            ItemId = transition.ItemId,
            VideoId = videoId,
            SnapshotJson = snapshot,
            Revision = 1,
            CreatedByUserId = principal?.UserId,
            CreatedAt = DateTime.UtcNow,
        };
        db.Add(fullExample);
        await db.SaveChangesAsync(ct);
        return new(
            SegmentTransitionStatus.Updated,
            Collected: true,
            ExampleId: fullExample.Id,
            ExampleRevision: fullExample.Revision,
            Representation: "fullItem",
            ItemId: transition.ItemId,
            Revision: transition.Revision);
    }

    private static async Task<IncorrectExampleToggleResult> CollectItemAsync(
        DbContext db,
        int videoId,
        ToggleIncorrectExampleRequest request,
        CovePrincipal? principal,
        CancellationToken ct)
    {
        var item = await db.Set<SegmentStudioItem>()
            .SingleOrDefaultAsync(candidate =>
                candidate.Id == request.ItemId
                && candidate.VideoId == videoId
                && candidate.NativeSegmentId == null
                && candidate.Kind == "tag"
                && candidate.TagId != null
                && candidate.StartSec != null, ct);
        if (item is null)
            return new(SegmentTransitionStatus.NotFound, Error: "Segment not found.");
        if (request.ExpectedRevision != item.Revision)
            return new(
                SegmentTransitionStatus.Conflict,
                ItemId: item.Id,
                Revision: item.Revision,
                Error: "This segment changed in another session. Reload before collecting it.");
        var assertions = await LoadActiveProvenanceAsync(db, item.Id, ct);
        if (!assertions.Any(IsAi))
            return Ineligible();
        var tagName = await db.Set<Tag>().AsNoTracking()
            .Where(tag => tag.Id == item.TagId)
            .Select(tag => tag.Name)
            .SingleAsync(ct);
        var snapshot = CreateSnapshot(item, tagName, assertions);
        item.ReviewState = "rejected";
        item.Revision++;
        item.UpdatedAt = DateTime.UtcNow;
        await DerivedSegmentRejectionService.RejectDescendantsAsync(db, item.Id, ct);
        var example = new SegmentStudioIncorrectExample
        {
            ItemId = item.Id,
            VideoId = videoId,
            SnapshotJson = snapshot,
            Revision = 1,
            CreatedByUserId = principal?.UserId,
            CreatedAt = DateTime.UtcNow,
        };
        db.Add(example);
        await db.SaveChangesAsync(ct);
        return new(
            SegmentTransitionStatus.Updated,
            Collected: true,
            ExampleId: example.Id,
            ExampleRevision: example.Revision,
            Representation: "fullItem",
            ItemId: item.Id,
            Revision: item.Revision);
    }

    private static async Task<IncorrectExampleToggleResult> RemoveItemAsync(
        DbContext db,
        int videoId,
        SegmentStudioIncorrectExample example,
        long? expectedRepresentationRevision,
        long expectedExampleRevision,
        CancellationToken ct)
    {
        if (example.Revision != expectedExampleRevision)
            return new(
                SegmentTransitionStatus.Conflict,
                ExampleId: example.Id,
                ExampleRevision: example.Revision,
                Error: "This incorrect example changed. Reload before removing it.");
        var item = await db.Set<SegmentStudioItem>()
            .SingleOrDefaultAsync(candidate =>
                candidate.Id == example.ItemId
                && candidate.VideoId == videoId
                && candidate.NativeSegmentId == null, ct);
        if (item is null)
            return new(SegmentTransitionStatus.NotFound, Error: "Collected segment not found.");
        if (expectedRepresentationRevision != item.Revision)
            return new(
                SegmentTransitionStatus.Conflict,
                ExampleId: example.Id,
                ExampleRevision: example.Revision,
                Representation: "fullItem",
                ItemId: item.Id,
                Revision: item.Revision,
                Error: "This segment changed in another session. Reload before removing it.");
        db.Remove(example);
        item.ReviewState = "unreviewed";
        item.Revision++;
        item.UpdatedAt = DateTime.UtcNow;
        return new(
            SegmentTransitionStatus.Updated,
            Collected: false,
            ExampleId: example.Id,
            ExampleRevision: example.Revision,
            Representation: "fullItem",
            ItemId: item.Id,
            Revision: item.Revision);
    }

    private static async Task<CaptureCandidate?> LoadCaptureCandidateAsync(
        DbContext db,
        SegmentStudioIncorrectExample example,
        CancellationToken ct)
    {
        var snapshot = DeserializeSnapshot(example.SnapshotJson);
        if (example.ItemId is long itemId)
        {
            var item = await db.Set<SegmentStudioItem>().AsNoTracking()
                .SingleOrDefaultAsync(candidate =>
                    candidate.Id == itemId
                    && candidate.VideoId == example.VideoId
                    && candidate.NativeSegmentId == null, ct);
            return item is null
                ? null
                : new(example, snapshot, item.Revision, item, null, null);
        }
        if (example.NativeBinEntryId is long binEntryId)
        {
            var entry = await db.Set<SegmentStudioNativeRecycleBinEntry>().AsNoTracking()
                .SingleOrDefaultAsync(candidate =>
                    candidate.Id == binEntryId
                    && candidate.VideoId == example.VideoId, ct);
            return entry is null
                ? null
                : new(example, snapshot, entry.Revision, null, entry, null);
        }
        return null;
    }

    private static async Task<bool> IsEligibleAtExportAsync(
        DbContext db,
        CaptureCandidate candidate,
        CancellationToken ct)
    {
        if (candidate.Item is not null)
        {
            var assertions = await LoadActiveProvenanceAsync(
                db, candidate.Item.Id, ct);
            if (assertions.Any(IsAi))
                return true;
            if (candidate.Snapshot.OriginalNativeSegmentId is null)
                return false;
        }
        var sourceKeys = candidate.BinEntry is null
            ? candidate.Snapshot.RegisteredSources.Select(source => source.Key)
            : ParseFieldProvenance(candidate.BinEntry.FieldProvenanceJson)
                .Select(row => row.SourceKey)
                .Append(candidate.BinEntry.SourceKey)
                .Concat(candidate.Snapshot.ActiveProvenance
                    .Select(assertion => assertion.SourceKey));
        var sources = await LoadRegisteredSourcesAsync(
            db,
            sourceKeys.Where(key => !string.IsNullOrWhiteSpace(key)).ToArray(),
            ct);
        return sources.Any(IsAi);
    }

    private static async Task<IReadOnlyList<ActiveProvenanceSnapshot>>
        LoadActiveProvenanceAsync(
            DbContext db,
            long itemId,
            CancellationToken ct) =>
        await (
            from assertion in db.Set<SegmentStudioSegmentProvenance>().AsNoTracking()
            join node in db.Set<SegmentStudioLineageNode>().AsNoTracking()
                on assertion.LineageNodeId equals node.Id
            join source in db.Set<SegmentStudioSource>().AsNoTracking()
                on assertion.SourceId equals source.Id
            join activityCandidate in db.Set<SegmentStudioProvenanceActivity>().AsNoTracking()
                on assertion.ActivityId equals activityCandidate.Id into activities
            from activity in activities.DefaultIfEmpty()
            where node.ItemId == itemId
                  && assertion.SupersededAt == null
                  && (assertion.Relation == "origin"
                      || assertion.Relation == "inherited")
            orderby assertion.CreatedAt, assertion.Id
            select new ActiveProvenanceSnapshot(
                source.Key,
                source.DisplayName,
                source.Category,
                source.Provider,
                assertion.Relation,
                activity == null ? null : activity.ExternalRunId,
                assertion.ModelKey,
                assertion.ModelIdentifier,
                assertion.ModelVersion,
                assertion.Confidence,
                assertion.RecordedAt,
                assertion.MetadataJson))
            .ToListAsync(ct);

    private static async Task<IReadOnlyList<NativeFieldProvenanceSnapshot>>
        LoadNativeFieldProvenanceAsync(
            DbContext db,
            int nativeSegmentId,
            CancellationToken ct)
    {
        if (db.Model.FindEntityType(typeof(FieldProvenance)) is null)
            return [];
        return await db.Set<FieldProvenance>().AsNoTracking()
            .Where(row =>
                row.HostType == AffinityHostType.Segment
                && row.HostId == nativeSegmentId)
            .OrderBy(row => row.Id)
            .Select(row => new NativeFieldProvenanceSnapshot(
                row.FieldKey,
                row.ValueJson,
                row.SourceKey,
                row.SourceRunId,
                row.ModelKey,
                row.Confidence,
                row.CreatedAt,
                row.UpdatedAt))
            .ToListAsync(ct);
    }

    private static async Task<IReadOnlyList<RegisteredSourceSnapshot>>
        LoadRegisteredSourcesAsync(
            DbContext db,
            IEnumerable<string> sourceKeys,
            CancellationToken ct)
    {
        var normalized = sourceKeys
            .Where(key => !string.IsNullOrWhiteSpace(key))
            .Select(key => key.Trim().ToLowerInvariant())
            .Distinct()
            .ToArray();
        if (normalized.Length == 0)
            return [];
        return await db.Set<SegmentStudioSource>().AsNoTracking()
            .Where(source => normalized.Contains(source.Key))
            .OrderBy(source => source.Key)
            .Select(source => new RegisteredSourceSnapshot(
                source.Key,
                source.DisplayName,
                source.Category,
                source.Provider,
                source.DefaultModelIdentifier))
            .ToListAsync(ct);
    }

    private static string CreateSnapshot(
        Segment segment,
        string tagName,
        int nativeSegmentId,
        IReadOnlyList<ActiveProvenanceSnapshot> assertions,
        IReadOnlyList<NativeFieldProvenanceSnapshot> fieldProvenance,
        IReadOnlyList<RegisteredSourceSnapshot> registeredSources) =>
        JsonSerializer.Serialize(new IncorrectExampleSnapshot(
            2,
            tagName,
            segment.TagId!.Value,
            segment.StartSec,
            segment.EndSec,
            segment.Kind ?? "tag",
            segment.RefId,
            segment.Payload?.RootElement.GetRawText(),
            segment.SourceKey,
            segment.SourceRunId,
            segment.Confidence,
            segment.Title,
            segment.ColorHint,
            segment.ImageBlobId,
            nativeSegmentId,
            assertions,
            fieldProvenance,
            registeredSources,
            DateTime.UtcNow), JsonOptions);

    private static string CreateSnapshot(
        SegmentStudioItem item,
        string tagName,
        IReadOnlyList<ActiveProvenanceSnapshot> assertions) =>
        JsonSerializer.Serialize(new IncorrectExampleSnapshot(
            2,
            tagName,
            item.TagId!.Value,
            item.StartSec!.Value,
            item.EndSec,
            item.Kind ?? "tag",
            item.RefId,
            item.PayloadJson,
            item.SourceKey,
            item.SourceRunId,
            item.Confidence,
            item.Title,
            item.ColorHint,
            item.ExtensionImageBlobId,
            null,
            assertions,
            [],
            [],
            DateTime.UtcNow), JsonOptions);

    private static IncorrectExampleSnapshot DeserializeSnapshot(string json)
    {
        try
        {
            var snapshot = JsonSerializer.Deserialize<IncorrectExampleSnapshot>(
                json, JsonOptions);
            if (snapshot is not null)
            {
                return snapshot with
                {
                    ActiveProvenance = snapshot.ActiveProvenance ?? [],
                    NativeFieldProvenance = snapshot.NativeFieldProvenance ?? [],
                    RegisteredSources = snapshot.RegisteredSources ?? [],
                };
            }
        }
        catch (JsonException)
        {
        }
        using var document = JsonDocument.Parse(json);
        var root = document.RootElement;
        return new(
            1,
            ReadString(root, "tagName") ?? "Tag segment",
            ReadInt(root, "tagId") ?? 0,
            ReadDouble(root, "startSec") ?? 0,
            ReadDouble(root, "endSec"),
            "tag",
            null,
            null,
            ReadString(root, "sourceKey"),
            ReadString(root, "sourceRunId"),
            ReadFloat(root, "confidence"),
            ReadString(root, "title"),
            null,
            ReadString(root, "imageBlobId"),
            ReadInt(root, "originalNativeSegmentId"),
            [],
            [],
            [],
            ReadDateTime(root, "capturedAt") ?? DateTime.UnixEpoch);
    }

    private static IReadOnlyList<NativeFieldProvenanceSnapshot> ParseFieldProvenance(
        string json)
    {
        try
        {
            return JsonSerializer.Deserialize<IReadOnlyList<NativeFieldProvenanceSnapshot>>(
                       json, JsonOptions) ?? [];
        }
        catch (JsonException)
        {
            return [];
        }
    }

    private static string BuildPublicManifest(
        Guid exportId,
        DateTime createdAt,
        IReadOnlyList<IncorrectExampleSnapshot> examples)
    {
        var captured = examples.Select(snapshot => new DownloadExample(
            snapshot,
            FrameTimestamps(snapshot.StartSec, snapshot.EndSec)
                .Select(timestamp => new DownloadFrame(timestamp, ""))
                .ToArray())).ToArray();
        return BuildPublicManifest(exportId, createdAt, captured);
    }

    private static string BuildPublicManifest(
        Guid exportId,
        DateTime createdAt,
        IReadOnlyList<DownloadExample> examples)
    {
        var manifest = new
        {
            schemaVersion = 1,
            exportReference = "export-001",
            createdAt,
            examples = examples.Select((example, index) => new
            {
                reference = $"example-{index + 1:000}",
                tagName = example.Snapshot.TagName,
                startTime = example.Snapshot.StartSec,
                endTime = example.Snapshot.EndSec,
                frameTimestamps = example.Frames.Select(frame => frame.TimestampSec),
                provenance = PublicProvenance(example.Snapshot),
            }),
        };
        return JsonSerializer.Serialize(
            manifest,
            new JsonSerializerOptions(JsonOptions) { WriteIndented = true });
    }

    private static IReadOnlyList<object> PublicProvenance(
        IncorrectExampleSnapshot snapshot)
    {
        if (snapshot.ActiveProvenance.Any(IsAi))
        {
            return snapshot.ActiveProvenance.Select(assertion => (object)new
            {
                source = assertion.SourceKey,
                sourceCategory = assertion.SourceCategory,
                sourceProvider = assertion.SourceProvider,
                relation = assertion.Relation,
                run = assertion.ExternalRunId,
                modelKey = assertion.ModelKey,
                model = assertion.ModelIdentifier,
                modelVersion = assertion.ModelVersion,
                confidence = assertion.Confidence,
                recordedAt = assertion.RecordedAt,
            }).ToArray();
        }
        var fieldsBySource = snapshot.NativeFieldProvenance
            .GroupBy(row => row.SourceKey, StringComparer.OrdinalIgnoreCase)
            .ToDictionary(group => group.Key, group => group.First(),
                StringComparer.OrdinalIgnoreCase);
        return snapshot.RegisteredSources.Select(source =>
        {
            fieldsBySource.TryGetValue(source.Key, out var field);
            return (object)new
            {
                source = source.Key,
                sourceCategory = source.Category,
                sourceProvider = source.Provider,
                relation = "native",
                run = field?.SourceRunId ?? snapshot.SourceRunId,
                modelKey = field?.ModelKey,
                model = source.DefaultModelIdentifier,
                modelVersion = (string?)null,
                confidence = field?.Confidence ?? snapshot.Confidence,
                recordedAt = field?.UpdatedAt,
            };
        }).ToArray();
    }

    private static async Task<(IReadOnlyList<DownloadExample>, string)>
        BuildLegacyDownloadAsync(
            DbContext db,
            SegmentStudioTrainingExport export,
            CancellationToken ct)
    {
        using var storedManifest = JsonDocument.Parse(export.ManifestJson);
        var snapshots = storedManifest.RootElement.TryGetProperty(
                "examples", out var examplesElement)
            ? examplesElement.EnumerateArray()
                .Select(element => DeserializeSnapshot(element.GetRawText()))
                .ToArray()
            : [];
        var legacyFrames = await db.Set<SegmentStudioTrainingExportItem>().AsNoTracking()
            .Where(row => row.ExportId == export.Id)
            .OrderBy(row => row.ItemId)
            .ToListAsync(ct);
        var examples = snapshots.Select((snapshot, index) =>
        {
            var frame = index < legacyFrames.Count
                        && legacyFrames[index].ImageBlobId is string blobId
                ? new[] { new DownloadFrame(
                    FrameTimestamps(snapshot.StartSec, snapshot.EndSec).First(),
                    blobId) }
                : [];
            return new DownloadExample(snapshot, frame);
        }).ToArray();
        return (examples, BuildPublicManifest(export.Id, export.CreatedAt, examples));
    }

    private static async Task<TrainingExportResult?> FindCaptureReplayAsync(
        DbContext db,
        int videoId,
        int? userId,
        Guid operationId,
        string fingerprint,
        CancellationToken ct)
    {
        var export = await db.Set<SegmentStudioTrainingExport>().AsNoTracking()
            .SingleOrDefaultAsync(row => row.CaptureOperationId == operationId, ct);
        if (export is null)
            return null;
        if (export.VideoId != videoId
            || export.RequestedByUserId != userId
            || !MetadataFingerprintMatches(export.MetadataJson, fingerprint))
            throw new IncorrectExampleConflictException(
                "This export operation ID was already used for another request.");
        var frameCount = await (
            from frame in db.Set<SegmentStudioTrainingExportFrame>().AsNoTracking()
            join example in db.Set<SegmentStudioTrainingExportExample>().AsNoTracking()
                on frame.ExportExampleId equals example.Id
            where example.ExportId == export.Id
            select frame.Id).CountAsync(ct);
        return new(
            export.Id,
            export.ExampleCount,
            frameCount,
            export.CreatedAt,
            $"/api/plugins/segment-studio/training-exports/{export.Id:D}/download",
            Replayed: true);
    }

    private static bool MetadataFingerprintMatches(string metadataJson, string fingerprint)
    {
        try
        {
            using var document = JsonDocument.Parse(metadataJson);
            return document.RootElement.TryGetProperty(
                       "requestFingerprint", out var value)
                   && value.GetString() == fingerprint;
        }
        catch (JsonException)
        {
            return false;
        }
    }

    private static async Task<IncorrectExampleToggleResult?> AuthorizeManageAsync(
        int videoId,
        CovePrincipal? principal,
        IAuthorizationService authorization,
        bool requireDelete,
        CancellationToken ct)
    {
        var write = await authorization.AuthorizeAsync(
            principal,
            Permissions.SegmentsWrite,
            EntityRef.Of(EntityKinds.Video, videoId),
            ct);
        if (!write.Allowed)
            return new(SegmentTransitionStatus.Forbidden,
                Error: write.Reason ?? "You cannot manage feedback for this video.");
        if (!requireDelete)
            return null;
        var delete = await authorization.AuthorizeAsync(
            principal,
            Permissions.SegmentsDelete,
            EntityRef.Of(EntityKinds.Video, videoId),
            ct);
        return delete.Allowed
            ? null
            : new(SegmentTransitionStatus.Forbidden,
                Error: delete.Reason ?? "You cannot collect feedback for this video.");
    }

    private static IncorrectExampleToggleResult Ineligible() =>
        new(
            SegmentTransitionStatus.Invalid,
            Error: "Only segments with registered AI provenance can be collected.",
            Code: "AI_PROVENANCE_REQUIRED");

    private static IncorrectExampleToggleResult FromTransition(
        SegmentTransitionResult transition) =>
        new(
            transition.Status,
            ItemId: transition.ItemId,
            NativeSegmentId: transition.NativeSegmentId,
            Revision: transition.Revision,
            Error: transition.Error,
            Code: transition.Code);

    private static bool IsAi(ActiveProvenanceSnapshot assertion) =>
        string.Equals(assertion.SourceCategory, "ai", StringComparison.OrdinalIgnoreCase);

    private static bool IsAi(RegisteredSourceSnapshot source) =>
        string.Equals(source.Category, "ai", StringComparison.OrdinalIgnoreCase);

    private static void AddReceipt(
        DbContext db,
        Guid operationId,
        string kind,
        string fingerprint,
        int? userId,
        int? sourceNativeSegmentId,
        long? itemId,
        IncorrectExampleToggleResult result) =>
        db.Add(new SegmentStudioSegmentOperation
        {
            OperationId = operationId,
            Kind = kind,
            ActorUserId = userId,
            RequestFingerprint = fingerprint,
            ItemId = itemId,
            SourceNativeSegmentId = sourceNativeSegmentId,
            ResultPayloadJson = JsonSerializer.Serialize(result, JsonOptions),
            CreatedAt = DateTime.UtcNow,
        });

    private static async Task<IncorrectExampleToggleResult?> ReplayAsync(
        DbContext db,
        Guid operationId,
        string kind,
        string fingerprint,
        int? userId,
        CancellationToken ct)
    {
        var receipt = await db.Set<SegmentStudioSegmentOperation>().AsNoTracking()
            .SingleOrDefaultAsync(row => row.OperationId == operationId, ct);
        if (receipt is null)
            return null;
        if (receipt.Kind != kind
            || receipt.RequestFingerprint != fingerprint
            || receipt.ActorUserId != userId)
            return new(
                SegmentTransitionStatus.Conflict,
                Error: "This operation ID was already used for another request.");
        var result = JsonSerializer.Deserialize<IncorrectExampleToggleResult>(
            receipt.ResultPayloadJson!, JsonOptions);
        if (result is null)
            return new(
                SegmentTransitionStatus.Conflict,
                Error: "The stored operation result is invalid.");
        return result with
        {
            Status = SegmentTransitionStatus.Conflict,
            Replayed = true,
            EditorDelta = null,
            Error = "This feedback response was already applied. Reload before retrying it.",
            Code = "OPERATION_REPLAYED",
        };
    }

    private static async Task<bool> CanReadProvenanceAsync(
        CovePrincipal? principal,
        IAuthorizationService authorization,
        CancellationToken ct) =>
        (await authorization.AuthorizeAsync(
            principal,
            SegmentStudioExtension.ProvenanceReadPermission,
            entity: null,
            ct)).Allowed;

    private static Guid DeriveOperationId(Guid operationId, string purpose) =>
        new(SHA256.HashData(Encoding.UTF8.GetBytes(
            $"incorrect-example:{purpose}:{operationId:D}"))[..16]);

    private static string Fingerprint(object value) =>
        Convert.ToHexString(SHA256.HashData(Encoding.UTF8.GetBytes(
            JsonSerializer.Serialize(value, JsonOptions)))).ToLowerInvariant();

    private static double RoundTimestamp(double value) =>
        Math.Round(value, 3, MidpointRounding.AwayFromZero);

    private static IReadOnlyList<string> UniqueTagFolders(
        IEnumerable<string> tagNames)
    {
        var foldersByTagName = new Dictionary<string, string>(StringComparer.Ordinal);
        var usedFolders = new HashSet<string>(StringComparer.OrdinalIgnoreCase);
        return tagNames.Select(tagName =>
        {
            if (foldersByTagName.TryGetValue(tagName, out var existing))
                return existing;
            var baseName = SafePathPart(tagName);
            var folder = baseName;
            var suffix = 2;
            while (!usedFolders.Add(folder))
                folder = $"{baseName}-{suffix++}";
            foldersByTagName[tagName] = folder;
            return folder;
        }).ToArray();
    }

    private static string SafePathPart(string value)
    {
        var result = new string(value.Trim().Select(character =>
                char.IsLetterOrDigit(character) || character is '-' or '_' or ' '
                    ? character
                    : '-')
            .ToArray()).Trim(' ', '-', '.');
        while (result.Contains("--", StringComparison.Ordinal))
            result = result.Replace("--", "-", StringComparison.Ordinal);
        return string.IsNullOrWhiteSpace(result)
            ? "tag"
            : result.Length <= 80 ? result : result[..80];
    }

    private static async Task WriteTextEntryAsync(
        ZipArchive archive,
        string path,
        string content,
        DateTime createdAt,
        CancellationToken ct)
    {
        var entry = archive.CreateEntry(path, CompressionLevel.Optimal);
        entry.LastWriteTime = ZipTimestamp(createdAt);
        await using var stream = entry.Open();
        await using var writer = new StreamWriter(
            stream, new UTF8Encoding(encoderShouldEmitUTF8Identifier: false),
            leaveOpen: true);
        await writer.WriteAsync(content.AsMemory(), ct);
        await writer.FlushAsync(ct);
    }

    private static DateTimeOffset ZipTimestamp(DateTime value)
    {
        var utc = value.Kind == DateTimeKind.Utc
            ? value
            : value.ToUniversalTime();
        if (utc.Year < 1980)
            utc = new DateTime(1980, 1, 1, 0, 0, 0, DateTimeKind.Utc);
        return new DateTimeOffset(utc);
    }

    private static string? ReadString(JsonElement root, string property) =>
        root.TryGetProperty(property, out var value)
        && value.ValueKind == JsonValueKind.String
            ? value.GetString()
            : null;
    private static int? ReadInt(JsonElement root, string property) =>
        root.TryGetProperty(property, out var value) && value.TryGetInt32(out var parsed)
            ? parsed
            : null;
    private static double? ReadDouble(JsonElement root, string property) =>
        root.TryGetProperty(property, out var value) && value.TryGetDouble(out var parsed)
            ? parsed
            : null;
    private static float? ReadFloat(JsonElement root, string property) =>
        root.TryGetProperty(property, out var value) && value.TryGetSingle(out var parsed)
            ? parsed
            : null;
    private static DateTime? ReadDateTime(JsonElement root, string property) =>
        root.TryGetProperty(property, out var value)
        && value.ValueKind == JsonValueKind.String
        && value.TryGetDateTime(out var parsed)
            ? parsed
            : null;

    private sealed record ActiveProvenanceSnapshot(
        string SourceKey,
        string SourceDisplayName,
        string? SourceCategory,
        string? SourceProvider,
        string Relation,
        string? ExternalRunId,
        string? ModelKey,
        string? ModelIdentifier,
        string? ModelVersion,
        float? Confidence,
        DateTime? RecordedAt,
        string MetadataJson);

    private sealed record NativeFieldProvenanceSnapshot(
        string FieldKey,
        string? ValueJson,
        string SourceKey,
        string SourceRunId,
        string ModelKey,
        float? Confidence,
        DateTime CreatedAt,
        DateTime UpdatedAt);

    private sealed record RegisteredSourceSnapshot(
        string Key,
        string DisplayName,
        string? Category,
        string? Provider,
        string? DefaultModelIdentifier);

    private sealed record IncorrectExampleSnapshot(
        int SchemaVersion,
        string TagName,
        int TagId,
        double StartSec,
        double? EndSec,
        string Kind,
        long? RefId,
        string? PayloadJson,
        string? SourceKey,
        string? SourceRunId,
        float? Confidence,
        string? Title,
        string? ColorHint,
        string? ImageBlobId,
        int? OriginalNativeSegmentId,
        IReadOnlyList<ActiveProvenanceSnapshot> ActiveProvenance,
        IReadOnlyList<NativeFieldProvenanceSnapshot> NativeFieldProvenance,
        IReadOnlyList<RegisteredSourceSnapshot> RegisteredSources,
        DateTime CapturedAt);

    private sealed record CaptureCandidate(
        SegmentStudioIncorrectExample Example,
        IncorrectExampleSnapshot Snapshot,
        long RepresentationRevision,
        SegmentStudioItem? Item,
        SegmentStudioNativeRecycleBinEntry? BinEntry,
        TrainingExportCaptureExample? Request);
    private sealed record DownloadFrame(double TimestampSec, string ImageBlobId);
    private sealed record DownloadExample(
        IncorrectExampleSnapshot Snapshot,
        IReadOnlyList<DownloadFrame> Frames);
}

public class IncorrectExampleException(string message) : InvalidOperationException(message);
public sealed class IncorrectExampleConflictException(string message)
    : IncorrectExampleException(message);
