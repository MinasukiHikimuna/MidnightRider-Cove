using System.Text.Json;
using System.Text.Json.Serialization;
using System.Diagnostics;
using Cove.Core.Entities;
using Cove.Core.Interfaces;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace SegmentStudio;

public sealed record StartSegmentStudioAnalysisRequest(
    IReadOnlyList<SegmentStudioAnalysisKind>? Analyses = null,
    SegmentStudioAnalysisAiOptions? Ai = null,
    SegmentStudioAnalysisOmniShotCutOptions? OmniShotCut = null,
    bool ReplaceShotBoundaries = false,
    string? ExpectedShotBoundaryFingerprint = null);

public sealed class SegmentStudioAnalysisPersistenceException(
    string code, string message) : InvalidOperationException(message)
{
    public string Code { get; } = code;
}

public sealed record SegmentStudioAnalysisRunResponse(
    Guid Id,
    int VideoId,
    int VideoFileId,
    string Status,
    IReadOnlyList<SegmentStudioAnalysisKind> Analyses,
    string? JobId,
    Guid? ServiceRunId,
    string? SourceFingerprint,
    IReadOnlyList<SegmentStudioAnalysisCandidateResponse> Candidates,
    string? ErrorCode,
    string? ErrorMessage,
    DateTime CreatedAt,
    DateTime UpdatedAt,
    DateTime? CompletedAt);

public sealed record SegmentStudioAnalysisCandidateResponse(
    long Id,
    string CandidateKey,
    string Kind,
    string TagName,
    string Title,
    double StartSec,
    double EndSec,
    double? Confidence,
    string ModelKey,
    int ObservationCount,
    string ReviewState);

public interface ISegmentStudioVideoAnalysisService
{
    Task<SegmentStudioAnalysisRun> CreateRunAsync(
        DbContext db, int videoId, StartSegmentStudioAnalysisRequest request, CancellationToken ct);
    Task<SegmentStudioAnalysisRun> CreateRunAsync(
        DbContext db,
        int videoId,
        StartSegmentStudioAnalysisRequest request,
        string mode,
        CancellationToken ct);
    Task ExecuteRunAsync(DbContext db, Guid runId, StartSegmentStudioAnalysisRequest request, CancellationToken ct);
    Task ExecuteRunAsync(
        DbContext db,
        Guid runId,
        StartSegmentStudioAnalysisRequest request,
        string mode,
        CancellationToken ct);
    Task ExecuteRunAsync(
        DbContext db,
        Guid runId,
        StartSegmentStudioAnalysisRequest request,
        string mode,
        IProgress<SegmentStudioAnalysisProgress> progress,
        CancellationToken ct)
        => ExecuteRunAsync(db, runId, request, mode, ct);
}

public sealed class SegmentStudioVideoAnalysisService(
    ISegmentStudioAnalysisClient client,
    ITagRepository tags,
    ISegmentStudioAnalysisProvenanceService provenance,
    ILogger<SegmentStudioVideoAnalysisService> logger) : ISegmentStudioVideoAnalysisService
{
    private static readonly JsonSerializerOptions JsonOptions = new(JsonSerializerDefaults.Web)
    {
        DefaultIgnoreCondition = JsonIgnoreCondition.WhenWritingNull,
        Converters = { new JsonStringEnumConverter<SegmentStudioAnalysisKind>(JsonNamingPolicy.CamelCase) },
    };

    public async Task<SegmentStudioAnalysisRun> CreateRunAsync(
        DbContext db, int videoId, StartSegmentStudioAnalysisRequest request, CancellationToken ct)
        => await CreateRunAsync(
            db, videoId, request, SegmentStudioModes.Full, ct);

    public async Task<SegmentStudioAnalysisRun> CreateRunAsync(
        DbContext db,
        int videoId,
        StartSegmentStudioAnalysisRequest request,
        string mode,
        CancellationToken ct)
    {
        var analyses = NormalizeAnalyses(request.Analyses, mode);
        if (request.ReplaceShotBoundaries
            && !analyses.Contains(SegmentStudioAnalysisKind.OmniShotCut))
        {
            throw new ArgumentException(
                "Replacing shot boundaries requires shot-boundary analysis.",
                nameof(request));
        }
        if (request.ReplaceShotBoundaries
            && request.ExpectedShotBoundaryFingerprint is null)
        {
            throw new ArgumentException(
                "Replacing shot boundaries requires their expected fingerprint.",
                nameof(request));
        }
        if (!request.ReplaceShotBoundaries
            && request.ExpectedShotBoundaryFingerprint is not null)
        {
            throw new ArgumentException(
                "A shot-boundary fingerprint is only valid when replacing boundaries.",
                nameof(request));
        }
        var sourceVideoId = await db.Set<Video>().AsNoTracking()
            .Where(video => video.Id == videoId)
            .Select(video => (int?)(video.ParentVideoId ?? video.Id))
            .SingleOrDefaultAsync(ct)
            ?? throw new KeyNotFoundException("Video or source file not found.");
        var videoFile = await db.Set<VideoFile>().AsNoTracking()
            .Where(file => file.VideoId == sourceVideoId)
            .OrderBy(file => file.Id)
            .Select(file => new { file.Id })
            .FirstOrDefaultAsync(ct)
            ?? throw new KeyNotFoundException("Video or source file not found.");
        var now = DateTime.UtcNow;
        var run = new SegmentStudioAnalysisRun
        {
            Id = Guid.NewGuid(),
            VideoId = videoId,
            VideoFileId = videoFile.Id,
            Status = "queued",
            AnalysesJson = JsonSerializer.Serialize(analyses, JsonOptions),
            CreatedAt = now,
            UpdatedAt = now,
        };
        db.Add(run);
        await db.SaveChangesAsync(ct);
        logger.LogInformation(
            "Queued Segment Studio analysis run {RunId} for video {VideoId}, file {VideoFileId}, mode {Mode}, analyses {Analyses}",
            run.Id,
            run.VideoId,
            run.VideoFileId,
            mode,
            string.Join(",", analyses));
        return run;
    }

    public async Task ExecuteRunAsync(
        DbContext db, Guid runId, StartSegmentStudioAnalysisRequest request, CancellationToken ct)
        => await ExecuteRunAsync(
            db, runId, request, SegmentStudioModes.Full, ct);

    public async Task ExecuteRunAsync(
        DbContext db,
        Guid runId,
        StartSegmentStudioAnalysisRequest request,
        string mode,
        CancellationToken ct)
        => await ExecuteRunAsync(db, runId, request, mode, progress: null, ct);

    public async Task ExecuteRunAsync(
        DbContext db,
        Guid runId,
        StartSegmentStudioAnalysisRequest request,
        string mode,
        IProgress<SegmentStudioAnalysisProgress>? progress,
        CancellationToken ct)
    {
        var normalizedMode = SegmentStudioModes.NormalizePublic(mode);
        var run = await db.Set<SegmentStudioAnalysisRun>().SingleAsync(candidate => candidate.Id == runId, ct);
        run.Status = "running";
        run.UpdatedAt = DateTime.UtcNow;
        await db.SaveChangesAsync(ct);
        var started = Stopwatch.GetTimestamp();
        logger.LogInformation(
            "Starting Segment Studio analysis run {RunId} for video {VideoId}, file {VideoFileId}, mode {Mode}",
            run.Id,
            run.VideoId,
            run.VideoFileId,
            normalizedMode);

        try
        {
            var sourcePath = await db.Set<VideoFile>().AsNoTracking()
                .Where(file => file.Id == run.VideoFileId)
                .Select(file => file.Path)
                .SingleAsync(ct);
            var analyses = NormalizeAnalyses(request.Analyses, normalizedMode);
            var response = await client.AnalyzeVideoAsync(new SegmentStudioAnalyzeVideoRequest(
                run.Id, sourcePath, analyses, Ai: request.Ai, OmniShotCut: request.OmniShotCut),
                progress,
                ct);
            var strategy = db.Database.CreateExecutionStrategy();
            await strategy.ExecuteAsync(async () =>
            {
                db.ChangeTracker.Clear();
                var persistedRun = await db.Set<SegmentStudioAnalysisRun>()
                    .SingleAsync(candidate => candidate.Id == runId, ct);
                await using var transaction = db.Database.IsRelational()
                    ? await db.Database.BeginTransactionAsync(ct)
                    : null;
                var modelTagIdsByName = new Dictionary<string, int>(
                    StringComparer.Ordinal);
                if (normalizedMode == SegmentStudioModes.Full
                    && response.Ai is not null)
                {
                    modelTagIdsByName = await ResolveModelTagIdsAsync(
                        db,
                        response.Ai.Segments
                            .Select(candidate => candidate.TagName)
                            .ToArray(),
                        ct);
                }
                SegmentStudioAnalysisCandidate[] candidates = [];
                if (response.Ai is not null)
                {
                    if (normalizedMode == SegmentStudioModes.Basic)
                    {
                        await ProjectBasicNativeSegmentsAsync(
                            db,
                            persistedRun,
                            response.Ai.Segments,
                            response.Ai.Models,
                            ct);
                    }
                    else
                    {
                    var existing = await db.Set<SegmentStudioAnalysisCandidate>()
                        .Where(candidate => candidate.RunId == runId).ToListAsync(ct);
                    db.RemoveRange(existing);
                    candidates = response.Ai.Segments.Select(candidate => new SegmentStudioAnalysisCandidate
                    {
                        RunId = runId,
                        VideoId = persistedRun.VideoId,
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
                        CreatedAt = DateTime.UtcNow,
                    }).ToArray();
                    db.AddRange(candidates);

                    var matchingTagIds = modelTagIdsByName.Values.Distinct().ToArray();
                    var reusableItems = await db.Set<SegmentStudioItem>()
                        .Where(item => item.VideoId == persistedRun.VideoId
                            && item.TagId != null
                            && matchingTagIds.Contains(item.TagId.Value))
                        .ToListAsync(ct);
                    var now = DateTime.UtcNow;
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
                            VideoId = persistedRun.VideoId,
                            StartSec = candidate.StartSec,
                            EndSec = candidate.EndSec,
                            TagId = tagId,
                            Kind = candidate.Kind,
                            ReviewState = "unreviewed",
                            SourceKey = "ext:ai.tagging",
                            SourceRunId = runId.ToString(),
                            Confidence = candidate.Confidence is double confidence ? (float)confidence : null,
                            Title = candidate.Title,
                            Revision = 1,
                            CreatedAt = now,
                            UpdatedAt = now,
                        };
                        candidate.Item = created;
                        reusableItems.Add(created);
                    }
                    }
                }
                if (normalizedMode == SegmentStudioModes.Full
                    && response.OmniShotCut is not null)
                {
                    await ShotBoundaryService.AcquireMutationLocksAsync(
                        db, runId, persistedRun.VideoId, ct);
                    var existing = await db.Set<SegmentStudioShotBoundary>()
                        .Where(boundary => boundary.VideoId == persistedRun.VideoId)
                        .ToListAsync(ct);
                    var shouldPersist = existing.Count == 0 || request.ReplaceShotBoundaries;
                    if (shouldPersist
                        && !IsValidShotBoundaryResult(
                            response.OmniShotCut.Boundaries,
                            response.Source.DurationSeconds))
                    {
                        throw new SegmentStudioAnalysisPersistenceException(
                            "invalid_shot_boundaries",
                            "Shot-boundary analysis returned invalid video coverage; existing boundaries were preserved.");
                    }
                    if (request.ReplaceShotBoundaries)
                    {
                        var actualFingerprint = ShotBoundaryService.Fingerprint(existing);
                        if (!string.Equals(
                                actualFingerprint,
                                request.ExpectedShotBoundaryFingerprint,
                                StringComparison.Ordinal))
                        {
                            throw new SegmentStudioAnalysisPersistenceException(
                                "shot_boundaries_changed",
                                "Shot boundaries changed while analysis was running; the newer boundaries were preserved.");
                        }
                        db.RemoveRange(existing);
                    }
                    if (shouldPersist)
                    {
                        var now = DateTime.UtcNow;
                        db.AddRange(response.OmniShotCut.Boundaries.Select(boundary => new SegmentStudioShotBoundary
                        {
                            VideoId = persistedRun.VideoId,
                            StartSec = boundary.StartSeconds,
                            EndSec = boundary.EndSeconds,
                            Source = "omnishotcut",
                            MetadataJson = JsonSerializer.Serialize(new
                            {
                                runId,
                                response.OmniShotCut.ModelRevision,
                                response.OmniShotCut.Mode,
                                boundary.TransitionAfter,
                            }, JsonOptions),
                            Revision = 1,
                            CreatedAt = now,
                            UpdatedAt = now,
                        }));
                    }
                }

                persistedRun.Status = "completed";
                persistedRun.ServiceRunId = response.RunId;
                persistedRun.SourceFingerprint = response.Source.Fingerprint;
                persistedRun.ResultJson = JsonSerializer.Serialize(response, JsonOptions);
                persistedRun.ErrorCode = null;
                persistedRun.ErrorMessage = null;
                persistedRun.UpdatedAt = DateTime.UtcNow;
                persistedRun.CompletedAt = persistedRun.UpdatedAt;
                await db.SaveChangesAsync(ct);
                if (normalizedMode == SegmentStudioModes.Full)
                {
                    await provenance.ProjectAsync(
                        db,
                        persistedRun,
                        new SegmentStudioAnalyzeVideoRequest(
                            runId,
                            sourcePath,
                            analyses,
                            Ai: request.Ai,
                            OmniShotCut: request.OmniShotCut),
                        response,
                        candidates,
                        ct);
                }
                if (transaction is not null)
                    await transaction.CommitAsync(ct);
            });
            logger.LogInformation(
                "Completed Segment Studio analysis run {RunId} as service run {ServiceRunId} in {ElapsedMs} ms with {CandidateCount} candidate(s) and {BoundaryCount} shot boundary result(s)",
                runId,
                response.RunId,
                Stopwatch.GetElapsedTime(started).TotalMilliseconds,
                response.Ai?.Segments.Count ?? 0,
                response.OmniShotCut?.Boundaries.Count ?? 0);
        }
        catch (OperationCanceledException)
        {
            await MarkFailedAsync(
                db, runId, "cancelled", "Analysis was cancelled.", "cancelled");
            logger.LogWarning(
                "Cancelled Segment Studio analysis run {RunId} after {ElapsedMs} ms",
                runId,
                Stopwatch.GetElapsedTime(started).TotalMilliseconds);
            throw;
        }
        catch (SegmentStudioAnalysisServiceException exception)
        {
            await MarkFailedAsync(db, runId, exception.Code, exception.Message);
            logger.LogWarning(
                exception,
                "Segment Studio analysis run {RunId} failed after {ElapsedMs} ms: status={StatusCode}, code={ErrorCode}, phase={Phase}, retryable={Retryable}, upstreamStatus={UpstreamStatus}, upstreamCode={UpstreamCode}",
                runId,
                Stopwatch.GetElapsedTime(started).TotalMilliseconds,
                (int)exception.StatusCode,
                exception.Code,
                exception.Phase,
                exception.Retryable,
                exception.UpstreamHttpStatus,
                exception.UpstreamErrorCode);
            throw;
        }
        catch (SegmentStudioAnalysisNotConfiguredException exception)
        {
            var message = exception.Message;
            await MarkFailedAsync(db, runId, "analysis_not_configured", message);
            logger.LogWarning(
                exception,
                "Segment Studio analysis run {RunId} is not configured after {ElapsedMs} ms",
                runId,
                Stopwatch.GetElapsedTime(started).TotalMilliseconds);
            throw new InvalidOperationException(message);
        }
        catch (SegmentStudioAnalysisPersistenceException exception)
        {
            await MarkFailedAsync(db, runId, exception.Code, exception.Message);
            logger.LogWarning(
                exception,
                "Segment Studio analysis run {RunId} could not persist its result after {ElapsedMs} ms: code={ErrorCode}",
                runId,
                Stopwatch.GetElapsedTime(started).TotalMilliseconds,
                exception.Code);
            throw;
        }
        catch (Exception exception)
        {
            await MarkFailedAsync(
                db, runId, "analysis_failed", "The video analysis could not be completed.");
            logger.LogError(
                exception,
                "Segment Studio analysis run {RunId} failed unexpectedly after {ElapsedMs} ms",
                runId,
                Stopwatch.GetElapsedTime(started).TotalMilliseconds);
            throw;
        }
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

    private static bool IsValidShotBoundaryResult(
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

    private static async Task ProjectBasicNativeSegmentsAsync(
        DbContext db,
        SegmentStudioAnalysisRun run,
        IReadOnlyList<SegmentStudioAnalysisSegment> analysisSegments,
        IReadOnlyList<SegmentStudioAnalysisModel> models,
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
            SegmentStudioAnalysisSegment Candidate,
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
            return;
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
    }

    public static IReadOnlyList<SegmentStudioAnalysisKind> NormalizeAnalyses(
        IReadOnlyList<SegmentStudioAnalysisKind>? analyses,
        string mode = SegmentStudioModes.Full)
    {
        var normalizedMode = SegmentStudioModes.NormalizePublic(mode);
        SegmentStudioAnalysisKind[] normalized = analyses is null or { Count: 0 }
            ? normalizedMode == SegmentStudioModes.Basic
                ? [SegmentStudioAnalysisKind.AiTagging]
                : [
                    SegmentStudioAnalysisKind.AiTagging,
                    SegmentStudioAnalysisKind.OmniShotCut,
                ]
            : analyses.Distinct().ToArray();
        if (normalized.Any(analysis => !Enum.IsDefined(analysis)))
            throw new ArgumentException("An unsupported analysis was requested.", nameof(analyses));
        if (normalizedMode == SegmentStudioModes.Basic
            && normalized.Contains(SegmentStudioAnalysisKind.OmniShotCut))
        {
            throw new ArgumentException(
                "Shot-boundary analysis is unavailable in Basic mode.",
                nameof(analyses));
        }
        return normalized;
    }

    private static async Task MarkFailedAsync(
        DbContext db, Guid runId, string code, string message, string status = "failed")
    {
        db.ChangeTracker.Clear();
        var run = await db.Set<SegmentStudioAnalysisRun>()
            .SingleAsync(candidate => candidate.Id == runId, CancellationToken.None);
        run.Status = status;
        run.ErrorCode = code;
        run.ErrorMessage = message;
        run.UpdatedAt = DateTime.UtcNow;
        run.CompletedAt = run.UpdatedAt;
        await db.SaveChangesAsync(CancellationToken.None);
    }
}
