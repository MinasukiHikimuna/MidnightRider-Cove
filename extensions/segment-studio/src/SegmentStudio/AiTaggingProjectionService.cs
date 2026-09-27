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
    IReadOnlyList<AiTaggingCandidate> Candidates)
{
    /// <summary>The AI Core run the candidates came from, kept in their provenance.</summary>
    public string? AiRunId { get; init; }

    /// <summary>The models the AI server reported, matched to candidates by category.</summary>
    public IReadOnlyList<AiModelDescriptor> Models { get; init; } = [];
}

public sealed record AiTaggingProjectionResult(int CandidateCount);

public interface IAiTaggingProjectionService
{
    Task<AiTaggingProjectionResult> ProjectAsync(
        DbContext db, AiTaggingProjectionRequest request, CancellationToken ct);
}

/// <summary>
/// Writes the tag spans of a native AI run into Segment Studio's review queue.
///
/// The spans become analysis candidates, each paired with a draft item, so no
/// segment reaches the library until a reviewer accepts it. A model label that is
/// not yet a Cove tag does become one, so the draft has a tag to point at. A user
/// who wants ordinary Cove segments instead runs the AI Tagging extension's
/// capability, which writes them directly; this projection deliberately has no
/// path that does.
///
/// The projection is carried over from Segment Studio's standalone analysis
/// service; the aggregation half is <see cref="AiTaggingCandidateBuilder"/>.
///
/// Every AI tagging draft also gets the AI provenance that service recorded: one
/// activity per run and an origin assertion per candidate. Collecting a draft as AI
/// feedback, and exporting it, require that provenance. The caller runs the
/// projection in a transaction, so drafts and their provenance commit together.
/// </summary>
public sealed class AiTaggingProjectionService(
    ITagRepository tags,
    ISegmentSourceRegistry sourceRegistry,
    IProvenanceActivityService activityService,
    ILineageNodeService lineageNodeService,
    ISegmentProvenanceService provenanceService)
    : IAiTaggingProjectionService
{
    /// <summary>The source every draft of a native AI tagging run is attributed to.</summary>
    public const string SourceKey = "ext:ai.tagging";

    private static readonly JsonSerializerOptions JsonOptions = new(JsonSerializerDefaults.Web);

    /// <summary>
    /// Terminal status for a run that produced its results. It must be one the
    /// `CK_segment_studio_analysis_runs_status` check constraint permits, or the
    /// final save of a finished run fails and discards everything it produced; a
    /// test checks it against the constraint in the embedded migrations.
    /// </summary>
    public const string CompletedStatus = "completed";

    public async Task<AiTaggingProjectionResult> ProjectAsync(
        DbContext db, AiTaggingProjectionRequest request, CancellationToken ct)
    {
        ArgumentNullException.ThrowIfNull(db);
        ArgumentNullException.ThrowIfNull(request);

        // Taken first, as every other service that changes a video's segments does,
        // so recording provenance cannot invert the lock order of a concurrent collect.
        await SegmentStudioReviewLock.AcquireAsync(db, request.VideoId, ct);

        var now = DateTime.UtcNow;
        var run = await db.Set<SegmentStudioAnalysisRun>()
            .FirstOrDefaultAsync(candidate => candidate.Id == request.RunId, ct);
        if (run is null)
        {
            // A native AI run has no Segment Studio run row of its own, so one is
            // created here: the candidates are keyed by it, and each draft records
            // it as its source run.
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

        var candidates = await ProjectReviewCandidatesAsync(db, run, request.Candidates, ct);
        await db.SaveChangesAsync(ct);
        await RecordProvenanceAsync(db, run, request, candidates, ct);
        return new AiTaggingProjectionResult(candidates.Length);
    }

    /// <summary>
    /// Records the run as an AI activity and each draft's origin under it. The
    /// activity is keyed by the analysis run and an assertion by its draft, model
    /// and activity, so a retried dispatch records nothing twice.
    /// </summary>
    private async Task RecordProvenanceAsync(
        DbContext db,
        SegmentStudioAnalysisRun run,
        AiTaggingProjectionRequest request,
        IReadOnlyList<SegmentStudioAnalysisCandidate> candidates,
        CancellationToken ct)
    {
        // A reused draft may be one a user made by hand that matches an AI span;
        // only AI tagging drafts are attributed to the AI.
        var linked = candidates
            .Where(candidate => candidate.Item?.SourceKey == SourceKey)
            .ToArray();
        if (linked.Length == 0)
            return;

        // The baseline seeds this source. Registering it upserts and locks the row
        // every AI path shares until this transaction commits, so it is only done
        // when the row is missing or no longer marked as AI.
        var source = await db.Set<SegmentStudioSource>().AsNoTracking()
            .SingleOrDefaultAsync(candidate => candidate.Key == SourceKey, ct);
        if (source?.Category != "ai")
        {
            source = await sourceRegistry.RegisterAsync(
                db,
                new SegmentSourceRegistration(
                    SourceKey,
                    "Cove AI Tagging",
                    "ai",
                    "Cove",
                    null,
                    "Native Cove AI segment source.",
                    "{}"),
                ct);
        }
        var activity = await activityService.CaptureAsync(
            db,
            new ProvenanceActivityCapture(
                Guid.NewGuid(),
                $"ai-run:{source.Key}:{run.Id}",
                "ai-analysis",
                source.Id,
                run.Id.ToString(),
                run.Status,
                null,
                run.CompletedAt,
                null,
                JsonSerializer.Serialize(request.Models, JsonOptions),
                JsonSerializer.Serialize(new { candidateCount = candidates.Count }, JsonOptions),
                JsonSerializer.Serialize(new
                {
                    aiRunId = request.AiRunId,
                    sourceFingerprint = run.SourceFingerprint,
                }, JsonOptions)),
            ct);

        var modelsByCategory = request.Models
            .SelectMany(model => (model.Categories ?? [])
                .Select(category => new { Category = category, Model = model }))
            .GroupBy(entry => entry.Category, StringComparer.OrdinalIgnoreCase)
            .ToDictionary(
                group => group.Key,
                group => group.Select(entry => entry.Model).Distinct().ToArray(),
                StringComparer.OrdinalIgnoreCase);
        var origins = linked.Select(candidate =>
        {
            var models = modelsByCategory.GetValueOrDefault(candidate.ModelKey) ?? [];
            var model = models.Length == 1 ? models[0] : null;
            return new AiTaggingOrigin(
                candidate.Item!.Id,
                candidate.ModelKey,
                model?.Name,
                model?.Version,
                candidate.Confidence is double confidence ? (float)confidence : null,
                candidate.CreatedAt,
                JsonSerializer.Serialize(new
                {
                    candidate.CandidateKey,
                    candidate.Kind,
                    candidate.TagName,
                    candidate.Title,
                    candidate.ObservationCount,
                    modelCandidates = models.Length > 1 ? models : null,
                }, JsonOptions));
        }).ToArray();

        // A long video yields thousands of drafts, so on PostgreSQL their origins are
        // written in bulk; the writer leaves the few drafts it cannot take to the
        // services, as it does every draft on other providers.
        var written = AiTaggingProvenanceWriter.Supports(db)
            ? await AiTaggingProvenanceWriter.RecordAsync(db, source.Id, activity.Id, origins, ct)
            : new HashSet<long>();
        foreach (var origin in origins.Where(origin => !written.Contains(origin.ItemId)))
        {
            var node = await lineageNodeService.EnsureAsync(db, origin.ItemId, ct);
            await provenanceService.AppendAsync(
                db,
                new SegmentProvenanceAppend(
                    node.Id,
                    source.Id,
                    "origin",
                    activity.Id,
                    origin.ModelKey,
                    origin.ModelIdentifier,
                    origin.ModelVersion,
                    origin.Confidence,
                    origin.RecordedAt,
                    origin.MetadataJson),
                ct);
        }
    }

    /// <summary>
    /// Replaces this run's candidates and pairs each with the item a reviewer will
    /// accept or reject. An item is reused when one already matches the span
    /// exactly, so re-running an analysis does not multiply drafts.
    /// </summary>
    private async Task<SegmentStudioAnalysisCandidate[]> ProjectReviewCandidatesAsync(
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
                SourceKey = SourceKey,
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
        return candidates;
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
