using System.Text.Json;
using AI.Extensions.Abstractions;
using Cove.Core.Entities;
using Cove.Core.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace SegmentStudio;

public sealed record AiTaggingProjectionRequest(
    int VideoId,
    int VideoFileId,
    Guid RunId,
    string? SourceFingerprint,
    IReadOnlyList<AiTaggingCandidate> Candidates);

public sealed record AiTaggingProjectionResult(int CandidateCount);

public interface IAiTaggingProjectionService
{
    Task<AiTaggingProjectionResult> ProjectAsync(
        DbContext db, AiTaggingProjectionRequest request, CancellationToken ct);
}

/// <summary>
/// Writes the tag spans of a native AI run into Segment Studio.
///
/// What that means depends on the user's output mode, and the difference is the
/// reason this is not a single code path. In Full mode the spans become
/// reviewable analysis candidates, each paired with a draft item, so nothing
/// reaches the library until a reviewer accepts it. In Basic mode there is no
/// review queue, so the spans are projected straight onto native Cove segments
/// with field provenance recorded against the run that produced them.
///
/// This is the projection half of what the external analysis service used to do;
/// the aggregation half is <see cref="AiTaggingCandidateBuilder"/>. Both moved
/// here unchanged in behaviour when native analysis replaced that service.
/// </summary>
public sealed class AiTaggingProjectionService(ITagRepository tags)
    : IAiTaggingProjectionService
{
    private static readonly JsonSerializerOptions JsonOptions = new(JsonSerializerDefaults.Web);

    /// <summary>
    /// The statuses the `CK_segment_studio_analysis_runs_status` check constraint
    /// permits. Pinned here because the tests run on SQLite, which does not enforce
    /// check constraints: a status outside this set passes every test and then fails
    /// against PostgreSQL at the end of a completed analysis, discarding its results.
    /// </summary>
    public static readonly IReadOnlyList<string> AllowedRunStatuses =
        ["queued", "running", "completed", "failed", "cancelled"];

    /// <summary>Terminal status for a run that produced its results.</summary>
    public const string CompletedStatus = "completed";

    public async Task<AiTaggingProjectionResult> ProjectAsync(
        DbContext db, AiTaggingProjectionRequest request, CancellationToken ct)
    {
        ArgumentNullException.ThrowIfNull(db);
        ArgumentNullException.ThrowIfNull(request);

        var now = DateTime.UtcNow;
        var run = await db.Set<SegmentStudioAnalysisRun>()
            .FirstOrDefaultAsync(candidate => candidate.Id == request.RunId, ct);
        if (run is null)
        {
            // The native flow has no user-initiated Full Scan to attach to, so the
            // run row is created here: candidates and provenance are both keyed by
            // it, and the review UI lists runs.
            run = new SegmentStudioAnalysisRun
            {
                Id = request.RunId,
                VideoId = request.VideoId,
                VideoFileId = request.VideoFileId,
                AnalysesJson = """["aiTagging"]""",
                CreatedAt = now,
            };
            db.Add(run);
        }
        run.Status = CompletedStatus;
        run.SourceFingerprint = request.SourceFingerprint;
        run.UpdatedAt = now;
        run.CompletedAt = now;

        var candidateCount = await ProjectReviewCandidatesAsync(db, run, request.Candidates, ct);
        await db.SaveChangesAsync(ct);
        return new AiTaggingProjectionResult(candidateCount);
    }

    /// <summary>
    /// Replaces this run's candidates and pairs each with the item a reviewer will
    /// accept or reject. An item is reused when one already matches the span
    /// exactly, so re-running an analysis does not multiply drafts.
    /// </summary>
    private async Task<int> ProjectReviewCandidatesAsync(
        DbContext db,
        SegmentStudioAnalysisRun run,
        IReadOnlyList<AiTaggingCandidate> analysisSegments,
        CancellationToken ct)
    {
        var modelTagIdsByName = await ResolveModelTagIdsAsync(
            db, analysisSegments.Select(candidate => candidate.TagName).ToArray(), ct);

        var existing = await db.Set<SegmentStudioAnalysisCandidate>()
            .Where(candidate => candidate.RunId == run.Id).ToListAsync(ct);
        db.RemoveRange(existing);

        var now = DateTime.UtcNow;
        var candidates = analysisSegments.Select(candidate => new SegmentStudioAnalysisCandidate
        {
            RunId = run.Id,
            VideoId = run.VideoId,
            CandidateKey = candidate.CandidateKey,
            Kind = candidate.Kind,
            TagName = candidate.TagName,
            Title = candidate.Title,
            StartSec = candidate.StartSeconds,
            EndSec = candidate.EndSeconds,
            Confidence = candidate.Confidence,
            ModelKey = candidate.ModelKey,
            ObservationCount = candidate.ObservationCount,
            ReviewState = "unreviewed",
            CreatedAt = now,
        }).ToArray();
        db.AddRange(candidates);

        var matchingTagIds = modelTagIdsByName.Values.Distinct().ToArray();
        var reusableItems = await db.Set<SegmentStudioItem>()
            .Where(item => item.VideoId == run.VideoId
                && item.TagId != null
                && matchingTagIds.Contains(item.TagId.Value))
            .ToListAsync(ct);
        foreach (var candidate in candidates
                     .Where(candidate => modelTagIdsByName.ContainsKey(candidate.TagName.Trim())))
        {
            var tagId = modelTagIdsByName[candidate.TagName.Trim()];
            candidate.SourceTagId = tagId;
            var reusable = reusableItems.FirstOrDefault(item =>
                item.TagId == tagId
                && item.StartSec == candidate.StartSec
                && item.EndSec == candidate.EndSec
                && item.Kind == candidate.Kind
                && item.Title == candidate.Title);
            if (reusable is not null)
            {
                candidate.Item = reusable;
                continue;
            }
            var created = new SegmentStudioItem
            {
                VideoId = run.VideoId,
                StartSec = candidate.StartSec,
                EndSec = candidate.EndSec,
                TagId = tagId,
                Kind = candidate.Kind,
                ReviewState = "unreviewed",
                SourceKey = "ext:ai.tagging",
                SourceRunId = run.Id.ToString(),
                Confidence = candidate.Confidence is double confidence ? (float)confidence : null,
                Title = candidate.Title,
                Revision = 1,
                CreatedAt = now,
                UpdatedAt = now,
            };
            candidate.Item = created;
            reusableItems.Add(created);
        }
        return candidates.Length;
    }

    private async Task<Dictionary<string, int>> ResolveModelTagIdsAsync(
        DbContext db,
        IReadOnlyList<string> names,
        CancellationToken ct)
    {
        var requested = names
            .Where(name => !string.IsNullOrWhiteSpace(name))
            .Select(name => name.Trim())
            .Distinct(StringComparer.Ordinal)
            .ToArray();
        var normalized = requested.Select(name => name.ToLowerInvariant())
            .Distinct(StringComparer.Ordinal)
            .ToArray();
        var existing = await db.Set<Tag>()
            .Where(tag => normalized.Contains(tag.Name.Trim().ToLower()))
            .ToListAsync(ct);
        var existingByName = existing
            .GroupBy(tag => tag.Name.Trim(), StringComparer.OrdinalIgnoreCase)
            .ToDictionary(group => group.Key, group => group.ToArray(),
                StringComparer.OrdinalIgnoreCase);
        var resolved = new Dictionary<string, int>(
            StringComparer.Ordinal);
        var missing = new List<string>();
        foreach (var name in requested)
        {
            if (!existingByName.TryGetValue(name, out var matches))
            {
                missing.Add(name);
                continue;
            }
            if (matches.Length == 1)
            {
                resolved[name] = matches[0].Id;
                continue;
            }
            var exact = matches.Where(tag => string.Equals(
                    tag.Name.Trim(), name, StringComparison.Ordinal))
                .ToArray();
            if (exact.Length == 1)
                resolved[name] = exact[0].Id;
        }
        var creatable = missing
            .GroupBy(name => name, StringComparer.OrdinalIgnoreCase)
            .Where(group => group.Count() == 1)
            .Select(group => group.Single())
            .ToArray();
        if (creatable.Length == 0)
            return resolved;
        var created = await tags.FindOrCreateByNamesAsync(creatable, ct);
        foreach (var name in creatable)
        {
            if (created.TryGetValue(name, out var tag))
                resolved[name] = tag.Id;
        }
        return resolved;
    }

}
