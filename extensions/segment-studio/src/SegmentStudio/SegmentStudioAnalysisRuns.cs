using System.Text.Json;
using Cove.Core.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace SegmentStudio;

/// <summary>
/// Lists a video's analysis runs for the runs endpoint. The editor reads it to
/// notice a run that completes while it is open.
/// </summary>
public static class SegmentStudioAnalysisRuns
{
    /// <summary>How many of a video's most recent runs are returned.</summary>
    public const int Limit = 20;

    private static readonly JsonSerializerOptions JsonOptions = new(JsonSerializerDefaults.Web);

    /// <summary>
    /// Returns the video's most recent runs, newest first. A run still marked queued
    /// or running whose job has ended is closed first, as cancelled or failed, so a
    /// run an interrupted job left behind does not stay running forever. A run that
    /// has no job yet gets a minute to be picked up.
    /// </summary>
    public static async Task<IReadOnlyList<SegmentStudioAnalysisRunResponse>> ListAsync(
        DbContext db,
        int videoId,
        Func<string, JobStatus?> jobStatus,
        DateTime now,
        CancellationToken ct)
    {
        ArgumentNullException.ThrowIfNull(db);
        ArgumentNullException.ThrowIfNull(jobStatus);

        var runs = await db.Set<SegmentStudioAnalysisRun>()
            .Where(run => run.VideoId == videoId)
            .OrderByDescending(run => run.CreatedAt)
            .Take(Limit)
            .ToListAsync(ct);
        foreach (var run in runs.Where(run => run.Status == "queued" || run.Status == "running"))
        {
            var status = string.IsNullOrWhiteSpace(run.JobId) ? null : jobStatus(run.JobId);
            if (status is JobStatus.Pending or JobStatus.Running)
                continue;
            if (status is null && run.JobId is null && now - run.CreatedAt < TimeSpan.FromMinutes(1))
                continue;
            var cancelled = status == JobStatus.Cancelled;
            run.Status = cancelled ? "cancelled" : "failed";
            run.ErrorCode = cancelled ? "cancelled" : "job_interrupted";
            run.ErrorMessage = cancelled
                ? "Analysis was cancelled before it started."
                : "The analysis job ended before the run completed.";
            run.UpdatedAt = now;
            run.CompletedAt = now;
        }
        await db.SaveChangesAsync(ct);
        return runs.Select(ToResponse).ToArray();
    }

    private static SegmentStudioAnalysisRunResponse ToResponse(SegmentStudioAnalysisRun run) =>
        new(
            run.Id,
            run.VideoId,
            run.VideoFileId,
            run.Status,
            JsonSerializer.Deserialize<IReadOnlyList<string>>(run.AnalysesJson, JsonOptions) ?? [],
            run.JobId,
            run.ServiceRunId,
            run.SourceFingerprint,
            run.ErrorCode,
            run.ErrorMessage,
            run.CreatedAt,
            run.UpdatedAt,
            run.CompletedAt);
}
