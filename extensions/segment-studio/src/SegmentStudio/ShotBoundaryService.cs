using System.Globalization;
using System.Security.Cryptography;
using System.Text;
using System.Text.Json;
using Microsoft.EntityFrameworkCore;

namespace SegmentStudio;

public sealed record SplitShotBoundaryRequest(Guid OperationId, double TimeSec);
public sealed record MergeShotBoundaryRequest(Guid OperationId, double TimeSec);
public sealed record RestoreShotBoundariesRequest(
    Guid OperationId,
    string ExpectedFingerprint,
    IReadOnlyList<ShotBoundaryRestoreItem> Boundaries);
public sealed record ShotBoundaryRestoreItem(
    long Id, double StartSec, double EndSec, string Source, string? Metadata,
    long Revision, DateTime CreatedAt, DateTime UpdatedAt);
public sealed record ShotBoundaryResponse(
    long Id, int VideoId, double StartSec, double EndSec, string Source, string? Metadata,
    long Revision, DateTime CreatedAt, DateTime UpdatedAt);

public enum ShotBoundaryMutationStatus { Updated, Invalid, Conflict }

public sealed record ShotBoundaryMutationResult(
    ShotBoundaryMutationStatus Status,
    IReadOnlyList<ShotBoundaryResponse>? Boundaries = null,
    string? Error = null);

public static class ShotBoundaryService
{
    private const double Tolerance = 0.001;

    public static async Task<IReadOnlyList<ShotBoundaryResponse>> ListAsync(
        DbContext db, int videoId, CancellationToken ct) =>
        await db.Set<SegmentStudioShotBoundary>().AsNoTracking()
            .Where(row => row.VideoId == videoId)
            .OrderBy(row => row.StartSec).ThenBy(row => row.Id)
            .Select(row => new ShotBoundaryResponse(
                row.Id, row.VideoId, row.StartSec, row.EndSec, row.Source, row.MetadataJson,
                row.Revision, row.CreatedAt, row.UpdatedAt))
            .ToListAsync(ct);

    public static async Task<ShotBoundaryMutationResult> SplitAsync(
        DbContext db, int videoId, SplitShotBoundaryRequest request, double durationSec, CancellationToken ct)
    {
        if (request.OperationId == Guid.Empty)
            return Invalid("An operation ID is required.");
        if (!double.IsFinite(request.TimeSec) || !double.IsFinite(durationSec)
            || durationSec <= Tolerance || request.TimeSec <= Tolerance
            || request.TimeSec >= durationSec - Tolerance)
            return Invalid("The boundary must be inside the video.");

        await AcquireMutationLocksAsync(db, request.OperationId, videoId, ct);
        var fingerprint = FormattableString.Invariant(
            $"split:{videoId}:{request.TimeSec:R}:{durationSec:R}");
        var replay = await CheckReplayAsync(db, request.OperationId, fingerprint, videoId, ct);
        if (replay is not null) return replay;

        var rows = await db.Set<SegmentStudioShotBoundary>()
            .Where(row => row.VideoId == videoId)
            .OrderBy(row => row.StartSec).ThenBy(row => row.Id)
            .ToListAsync(ct);
        var now = DateTime.UtcNow;
        if (rows.Count == 0)
        {
            db.AddRange(
                NewBoundary(videoId, 0, request.TimeSec, now),
                NewBoundary(videoId, request.TimeSec, durationSec, now));
        }
        else
        {
            if (rows.Any(row => NearlyEqual(row.StartSec, request.TimeSec)
                || NearlyEqual(row.EndSec, request.TimeSec)))
                return Invalid("A shot boundary already exists at this time.");
            var containing = rows.SingleOrDefault(row =>
                row.StartSec < request.TimeSec && request.TimeSec < row.EndSec);
            if (containing is null)
                return Invalid("The playhead is not inside an existing shot.");
            var oldEnd = containing.EndSec;
            containing.EndSec = request.TimeSec;
            containing.Revision++;
            containing.UpdatedAt = now;
            db.Add(NewBoundary(videoId, request.TimeSec, oldEnd, now, containing.Source, containing.MetadataJson));
        }
        AddReceipt(db, request.OperationId, videoId, "split", fingerprint, now);
        await db.SaveChangesAsync(ct);
        return new(ShotBoundaryMutationStatus.Updated, await ListAsync(db, videoId, ct));
    }

    public static async Task<ShotBoundaryMutationResult> MergeAsync(
        DbContext db, int videoId, MergeShotBoundaryRequest request, CancellationToken ct)
    {
        if (request.OperationId == Guid.Empty || !double.IsFinite(request.TimeSec))
            return Invalid("A valid operation ID and boundary time are required.");
        await AcquireMutationLocksAsync(db, request.OperationId, videoId, ct);
        var fingerprint = FormattableString.Invariant($"merge:{videoId}:{request.TimeSec:R}");
        var replay = await CheckReplayAsync(db, request.OperationId, fingerprint, videoId, ct);
        if (replay is not null) return replay;

        var rows = await db.Set<SegmentStudioShotBoundary>()
            .Where(row => row.VideoId == videoId)
            .OrderBy(row => row.StartSec).ThenBy(row => row.Id)
            .ToListAsync(ct);
        var rightIndex = rows.FindIndex(row => NearlyEqual(row.StartSec, request.TimeSec));
        if (rightIndex <= 0)
            return Invalid("There is no removable shot boundary at this time.");
        var left = rows[rightIndex - 1];
        var right = rows[rightIndex];
        if (!NearlyEqual(left.EndSec, right.StartSec))
            return Invalid("Only adjacent shots can be merged.");
        left.EndSec = right.EndSec;
        left.Revision++;
        left.UpdatedAt = DateTime.UtcNow;
        db.Remove(right);
        AddReceipt(db, request.OperationId, videoId, "merge", fingerprint, left.UpdatedAt);
        await db.SaveChangesAsync(ct);
        return new(ShotBoundaryMutationStatus.Updated, await ListAsync(db, videoId, ct));
    }

    public static async Task<ShotBoundaryMutationResult> RestoreAsync(
        DbContext db, int videoId, RestoreShotBoundariesRequest request,
        double durationSec, CancellationToken ct)
    {
        if (request.OperationId == Guid.Empty || request.Boundaries is null
            || string.IsNullOrWhiteSpace(request.ExpectedFingerprint)
            || !double.IsFinite(durationSec) || durationSec <= Tolerance)
            return Invalid("A valid operation ID, duration, and shot snapshot are required.");
        var ordered = request.Boundaries.OrderBy(row => row.StartSec).ThenBy(row => row.Id).ToArray();
        if (!IsValidRestoreSnapshot(ordered, durationSec))
            return Invalid("The undo snapshot must be empty or a complete, contiguous set of valid shots.");

        await AcquireMutationLocksAsync(db, request.OperationId, videoId, ct);
        var fingerprint = $"restore:{videoId}:{request.ExpectedFingerprint}:{RestoreFingerprint(ordered)}";
        var replay = await CheckReplayAsync(db, request.OperationId, fingerprint, videoId, ct);
        if (replay is not null) return replay;

        var current = await db.Set<SegmentStudioShotBoundary>()
            .Where(row => row.VideoId == videoId)
            .OrderBy(row => row.StartSec).ThenBy(row => row.Id)
            .ToListAsync(ct);
        if (!string.Equals(Fingerprint(current), request.ExpectedFingerprint, StringComparison.Ordinal))
            return new(ShotBoundaryMutationStatus.Conflict, Error: "The shots changed before undo could be applied.");

        db.RemoveRange(current);
        db.AddRange(ordered.Select(row => new SegmentStudioShotBoundary
        {
            Id = row.Id,
            VideoId = videoId,
            StartSec = row.StartSec,
            EndSec = row.EndSec,
            Source = row.Source,
            MetadataJson = row.Metadata,
            Revision = row.Revision,
            CreatedAt = row.CreatedAt,
            UpdatedAt = row.UpdatedAt,
        }));
        AddReceipt(db, request.OperationId, videoId, "restore", fingerprint, DateTime.UtcNow);
        await db.SaveChangesAsync(ct);
        return new(ShotBoundaryMutationStatus.Updated, await ListAsync(db, videoId, ct));
    }

    private static async Task<ShotBoundaryMutationResult?> CheckReplayAsync(
        DbContext db, Guid operationId, string fingerprint, int videoId, CancellationToken ct)
    {
        var receipt = await db.Set<SegmentStudioShotBoundaryOperation>().AsNoTracking()
            .SingleOrDefaultAsync(row => row.OperationId == operationId, ct);
        if (receipt is null) return null;
        return receipt.VideoId == videoId && receipt.RequestFingerprint == fingerprint
            ? new(ShotBoundaryMutationStatus.Updated, await ListAsync(db, videoId, ct))
            : new(ShotBoundaryMutationStatus.Conflict, Error: "The operation ID was already used for another shot edit.");
    }

    private static SegmentStudioShotBoundary NewBoundary(
        int videoId, double start, double end, DateTime now,
        string source = "manual", string? metadata = null) => new()
        {
            VideoId = videoId, StartSec = start, EndSec = end, Source = source,
            MetadataJson = metadata, Revision = 0, CreatedAt = now, UpdatedAt = now,
        };

    private static void AddReceipt(DbContext db, Guid id, int videoId, string kind, string fingerprint, DateTime now) =>
        db.Add(new SegmentStudioShotBoundaryOperation
        {
            OperationId = id, VideoId = videoId, Kind = kind,
            RequestFingerprint = fingerprint, CreatedAt = now,
        });

    private static bool NearlyEqual(double left, double right) => Math.Abs(left - right) <= Tolerance;

    private static bool IsValidRestoreSnapshot(
        IReadOnlyList<ShotBoundaryRestoreItem> boundaries, double durationSec)
    {
        if (boundaries.Count == 0)
            return true;
        return boundaries.Select(row => row.Id).Distinct().Count() == boundaries.Count
            && boundaries.All(row => row.Id > 0 && row.Revision >= 0
                && double.IsFinite(row.StartSec) && double.IsFinite(row.EndSec)
                && row.StartSec >= 0 && row.EndSec > row.StartSec
                && row.Source is "manual" or "pyscenedetect" or "omnishotcut"
                && IsValidMetadata(row.Metadata)
                && IsUtcTimestamp(row.CreatedAt) && IsUtcTimestamp(row.UpdatedAt)
                && row.UpdatedAt >= row.CreatedAt)
            && NearlyEqual(boundaries[0].StartSec, 0)
            && NearlyEqual(boundaries[^1].EndSec, durationSec)
            && boundaries.Zip(boundaries.Skip(1),
                    (left, right) => NearlyEqual(left.EndSec, right.StartSec))
                .All(adjacent => adjacent);
    }

    private static bool IsValidMetadata(string? metadata)
    {
        if (metadata is null)
            return true;
        try
        {
            using var _ = JsonDocument.Parse(metadata);
            return true;
        }
        catch (JsonException)
        {
            return false;
        }
    }

    private static bool IsUtcTimestamp(DateTime value) =>
        value != default && value.Kind == DateTimeKind.Utc;

    private static string RestoreFingerprint(IEnumerable<ShotBoundaryRestoreItem> boundaries)
    {
        var canonical = JsonSerializer.Serialize(boundaries.Select(row => new
        {
            row.Id,
            StartSec = row.StartSec.ToString("R", CultureInfo.InvariantCulture),
            EndSec = row.EndSec.ToString("R", CultureInfo.InvariantCulture),
            row.Source,
            row.Metadata,
            row.Revision,
            CreatedAt = row.CreatedAt.ToString("O", CultureInfo.InvariantCulture),
            UpdatedAt = row.UpdatedAt.ToString("O", CultureInfo.InvariantCulture),
        }));
        return Convert.ToHexString(SHA256.HashData(Encoding.UTF8.GetBytes(canonical)));
    }

    public static string Fingerprint(IEnumerable<SegmentStudioShotBoundary> boundaries) =>
        string.Join(",", boundaries.OrderBy(row => row.StartSec).ThenBy(row => row.Id)
            .Select(row => $"{row.Id}:{row.Revision}"));

    internal static async Task AcquireMutationLocksAsync(
        DbContext db, Guid operationId, int videoId, CancellationToken ct)
    {
        if (db.Database.ProviderName?.Contains("Npgsql", StringComparison.Ordinal) != true)
            return;
        if (db.Database.CurrentTransaction is null)
            throw new InvalidOperationException("Shot-boundary mutations require a database transaction.");
        var operationLock = BitConverter.ToInt64(SHA256.HashData(operationId.ToByteArray()), 0);
        await db.Database.ExecuteSqlInterpolatedAsync(
            $"SELECT pg_advisory_xact_lock({operationLock})", ct);
        await db.Database.ExecuteSqlInterpolatedAsync(
            $"SELECT pg_advisory_xact_lock(1397247828, {videoId})", ct);
    }

    private static ShotBoundaryMutationResult Invalid(string error) =>
        new(ShotBoundaryMutationStatus.Invalid, Error: error);
    private static ShotBoundaryResponse ToResponse(SegmentStudioShotBoundary row) =>
        new(row.Id, row.VideoId, row.StartSec, row.EndSec, row.Source, row.MetadataJson,
            row.Revision, row.CreatedAt, row.UpdatedAt);
}
