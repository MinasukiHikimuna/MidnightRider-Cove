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
    string Mode,
    string? SourceFingerprint,
    IReadOnlyList<AiTaggingCandidate> Candidates,
    IReadOnlyList<AiModelDescriptor> Models);

public sealed record AiTaggingProjectionResult(int CandidateCount, int SegmentCount);

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
        run.Status = "succeeded";
        run.SourceFingerprint = request.SourceFingerprint;
        run.UpdatedAt = now;
        run.CompletedAt = now;

        if (SegmentStudioModes.NormalizePublic(request.Mode) == SegmentStudioModes.Basic)
        {
            await db.SaveChangesAsync(ct);
            var segmentCount = await ProjectBasicNativeSegmentsAsync(
                db, run, request.Candidates, request.Models, ct);
            return new AiTaggingProjectionResult(0, segmentCount);
        }

        var candidateCount = await ProjectReviewCandidatesAsync(db, run, request.Candidates, ct);
        await db.SaveChangesAsync(ct);
        return new AiTaggingProjectionResult(candidateCount, 0);
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

    private static async Task<int> ProjectBasicNativeSegmentsAsync(
        DbContext db,
        SegmentStudioAnalysisRun run,
        IReadOnlyList<AiTaggingCandidate> analysisSegments,
        IReadOnlyList<AiModelDescriptor> models,
        CancellationToken ct)
    {
        var requestedTagNames = analysisSegments
            .Select(segment => segment.TagName.ToUpper())
            .Distinct()
            .ToArray();
        var matchingTags = await db.Set<Tag>().AsNoTracking()
            .Where(tag => requestedTagNames.Contains(tag.Name.ToUpper()))
            .Select(tag => new { tag.Id, tag.Name })
            .ToListAsync(ct);
        var tagsByName = matchingTags
            .GroupBy(tag => tag.Name, StringComparer.OrdinalIgnoreCase)
            .Where(group => group.Count() == 1)
            .ToDictionary(
                group => group.Key,
                group => group.Single().Id,
                StringComparer.OrdinalIgnoreCase);
        var matchingTagIds = tagsByName.Values.Distinct().ToArray();
        var existing = await db.Set<Segment>()
            .Where(segment =>
                segment.HostType == SegmentHostType.Video
                && segment.HostId == run.VideoId
                && segment.TagId != null
                && matchingTagIds.Contains(segment.TagId.Value)
                && segment.SourceKey == "ext:ai.tagging")
            .ToListAsync(ct);
        var existingByProjection = existing
            .GroupBy(segment => (
                TagId: segment.TagId!.Value,
                segment.StartSec,
                EndSec: segment.EndSec ?? segment.StartSec,
                Kind: segment.Kind ?? "tag",
                Title: segment.Title ?? ""))
            .ToDictionary(group => group.Key, group => group.First());
        var modelsByCategory = models
            .SelectMany(model => (model.Categories ?? [])
                .Select(category => new { Category = category, Model = model }))
            .GroupBy(candidate => candidate.Category,
                StringComparer.OrdinalIgnoreCase)
            .ToDictionary(
                group => group.Key,
                group => group.Select(candidate => candidate.Model).ToArray(),
                StringComparer.OrdinalIgnoreCase);
        var now = DateTime.UtcNow;
        var projected = new List<(
            Segment Segment,
            AiTaggingCandidate Candidate,
            string ModelKey)>();
        foreach (var candidate in analysisSegments
                     .Where(candidate =>
                         tagsByName.ContainsKey(candidate.TagName)))
        {
            var tagId = tagsByName[candidate.TagName];
            var projection = (
                TagId: tagId,
                StartSec: candidate.StartSeconds,
                EndSec: candidate.EndSeconds,
                Kind: candidate.Kind,
                Title: candidate.Title);
            if (existingByProjection.TryGetValue(projection, out var reused))
            {
                reused.SourceRunId = run.Id.ToString();
                reused.Confidence = candidate.Confidence is double reusedConfidence
                    ? (float)reusedConfidence
                    : null;
                reused.UpdatedAt = now;
                var reusedModels =
                    modelsByCategory.GetValueOrDefault(candidate.ModelKey)
                    ?? [];
                projected.Add((
                    reused,
                    candidate,
                    reusedModels.Length == 1
                        ? reusedModels[0].ConfigName
                        : candidate.ModelKey));
                continue;
            }
            var created = new Segment
            {
                HostType = SegmentHostType.Video,
                HostId = run.VideoId,
                TagId = tagId,
                StartSec = candidate.StartSeconds,
                EndSec = candidate.EndSeconds,
                Kind = candidate.Kind,
                Title = candidate.Title,
                SourceKey = "ext:ai.tagging",
                SourceRunId = run.Id.ToString(),
                Confidence = candidate.Confidence is double createdConfidence
                    ? (float)createdConfidence
                    : null,
                CreatedAt = now,
                UpdatedAt = now,
            };
            db.Add(created);
            existingByProjection[projection] = created;
            var createdModels =
                modelsByCategory.GetValueOrDefault(candidate.ModelKey)
                ?? [];
            projected.Add((
                created,
                candidate,
                createdModels.Length == 1
                    ? createdModels[0].ConfigName
                    : candidate.ModelKey));
        }
        await db.SaveChangesAsync(ct);
        if (db.Model.FindEntityType(typeof(FieldProvenance)) is null)
            return projected.Count;
        var projectedIds = projected
            .Select(projection => projection.Segment.Id)
            .Distinct()
            .ToArray();
        var sourceRunId = run.Id.ToString();
        var existingEvidence = await db.Set<FieldProvenance>()
            .Where(row =>
                row.HostType == AffinityHostType.Segment
                && projectedIds.Contains(row.HostId)
                && row.SourceKey == "ext:ai.tagging"
                && row.SourceRunId == sourceRunId)
            .ToListAsync(ct);
        var existingByKey = existingEvidence.ToDictionary(row => (
            row.HostId,
            row.FieldKey,
            row.SourceKey,
            row.SourceRunId,
            row.ModelKey));
        var projectedKeys = new HashSet<(
            int HostId,
            string FieldKey,
            string SourceKey,
            string? SourceRunId,
            string? ModelKey)>();
        foreach (var projection in projected)
        {
            var fields = new Dictionary<string, object?>
            {
                ["tag_id"] = projection.Segment.TagId,
                ["start_sec"] = projection.Segment.StartSec,
                ["end_sec"] = projection.Segment.EndSec,
                ["kind"] = projection.Segment.Kind,
                ["title"] = projection.Segment.Title,
            };
            foreach (var field in fields)
            {
                var key = (
                    projection.Segment.Id,
                    field.Key,
                    "ext:ai.tagging",
                    sourceRunId,
                    projection.ModelKey);
                projectedKeys.Add(key);
                var valueJson = JsonSerializer.Serialize(
                    field.Value, JsonOptions);
                float? confidence =
                    projection.Candidate.Confidence is double value
                        ? (float)value
                        : null;
                if (existingByKey.TryGetValue(key, out var evidence))
                {
                    evidence.ValueJson = valueJson;
                    evidence.Confidence = confidence;
                    evidence.UpdatedAt = now;
                    continue;
                }
                var created = new FieldProvenance
                {
                    HostType = AffinityHostType.Segment,
                    HostId = projection.Segment.Id,
                    FieldKey = field.Key,
                    ValueJson = valueJson,
                    SourceKey = "ext:ai.tagging",
                    SourceRunId = sourceRunId,
                    ModelKey = projection.ModelKey,
                    Confidence = confidence,
                    CreatedAt = now,
                    UpdatedAt = now,
                };
                db.Add(created);
                existingByKey[key] = created;
            }
        }
        db.RemoveRange(existingEvidence.Where(evidence =>
            !projectedKeys.Contains((
                evidence.HostId,
                evidence.FieldKey,
                evidence.SourceKey,
                evidence.SourceRunId,
                evidence.ModelKey))));
        return projected.Count;
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
