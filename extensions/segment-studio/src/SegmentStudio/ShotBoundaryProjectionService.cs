using System.Text.Json;
using Microsoft.EntityFrameworkCore;

namespace SegmentStudio;

/// <summary>
/// Writes shot boundaries for a video, independently of how they were produced.
/// </summary>
/// <remarks>
/// Shot boundaries are a contiguous partition of the whole video, so they are
/// replaced as a set rather than merged. Validation, locking and the write are
/// kept here so any producer — today the AI capability contributor — shares one
/// implementation of that invariant.
/// </remarks>
public interface IShotBoundaryProjectionService
{
    Task<ShotBoundaryProjectionResult> ProjectAsync(
        DbContext db,
        ShotBoundaryProjectionRequest request,
        CancellationToken ct = default);
}

public sealed record ShotBoundaryProjectionRequest(
    int VideoId,
    IReadOnlyList<SegmentStudioAnalysisBoundary> Boundaries,
    double DurationSeconds,
    Guid OperationId,
    string RunId,
    string ModelKey,
    string? Mode)
{
    /// <summary>
    /// Replace boundaries that already exist. Off by default: a video's existing
    /// boundaries may include manual splits and merges, and losing those to a
    /// re-run the user did not explicitly ask for is not recoverable.
    /// </summary>
    public bool Replace { get; init; }
}

public sealed record ShotBoundaryProjectionResult(int Written, bool Replaced, string? SkippedReason)
{
    public static ShotBoundaryProjectionResult Skipped(string reason) => new(0, false, reason);
}

public sealed class ShotBoundaryProjectionService : IShotBoundaryProjectionService
{
    private const string SourceKey = "omnishotcut";

    private static readonly JsonSerializerOptions JsonOptions = new(JsonSerializerDefaults.Web);

    public async Task<ShotBoundaryProjectionResult> ProjectAsync(
        DbContext db,
        ShotBoundaryProjectionRequest request,
        CancellationToken ct = default)
    {
        if (request.Boundaries.Count == 0)
            return ShotBoundaryProjectionResult.Skipped("no_boundaries");

        await ShotBoundaryService.AcquireMutationLocksAsync(db, request.OperationId, request.VideoId, ct);

        var existing = await db.Set<SegmentStudioShotBoundary>()
            .Where(boundary => boundary.VideoId == request.VideoId)
            .ToListAsync(ct);

        if (existing.Count > 0 && !request.Replace)
            return ShotBoundaryProjectionResult.Skipped("boundaries_exist");

        if (!IsValidShotBoundaryResult(request.Boundaries, request.DurationSeconds))
        {
            throw new SegmentStudioAnalysisPersistenceException(
                "invalid_shot_boundaries",
                "Shot-boundary analysis returned invalid video coverage; existing boundaries were preserved.");
        }

        var replaced = existing.Count > 0;
        if (replaced)
            db.RemoveRange(existing);

        var now = DateTime.UtcNow;
        db.AddRange(request.Boundaries.Select(boundary => new SegmentStudioShotBoundary
        {
            VideoId = request.VideoId,
            StartSec = boundary.StartSeconds,
            EndSec = boundary.EndSeconds,
            Source = SourceKey,
            MetadataJson = JsonSerializer.Serialize(new
            {
                runId = request.RunId,
                model = request.ModelKey,
                mode = request.Mode,
                boundary.TransitionAfter,
            }, JsonOptions),
            Revision = 1,
            CreatedAt = now,
            UpdatedAt = now,
        }));

        return new ShotBoundaryProjectionResult(request.Boundaries.Count, replaced, null);
    }

    /// <summary>
    /// Shot boundaries must form a contiguous, gapless partition of the whole
    /// video: ordered, starting at 0, each starting where the previous ended,
    /// and ending at the video duration.
    /// </summary>
    public static bool IsValidShotBoundaryResult(
        IReadOnlyList<SegmentStudioAnalysisBoundary> boundaries,
        double durationSeconds)
    {
        const double tolerance = 0.001;
        if (!double.IsFinite(durationSeconds)
            || durationSeconds <= tolerance
            || boundaries.Count == 0)
            return false;
        for (var index = 0; index < boundaries.Count; index++)
        {
            var boundary = boundaries[index];
            if (!double.IsFinite(boundary.StartSeconds)
                || !double.IsFinite(boundary.EndSeconds)
                || boundary.StartSeconds < 0
                || boundary.EndSeconds <= boundary.StartSeconds
                || boundary.EndSeconds > durationSeconds + tolerance)
                return false;
            var expectedStart = index == 0
                ? 0
                : boundaries[index - 1].EndSeconds;
            if (Math.Abs(boundary.StartSeconds - expectedStart) > tolerance)
                return false;
        }
        return Math.Abs(boundaries[^1].EndSeconds - durationSeconds) <= tolerance;
    }
}
