using System.Text.Json;
using AI.Extensions.Abstractions;
using Cove.Core.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;

namespace SegmentStudio;

/// <summary>
/// Segment Studio's single entry point for the results of a native AI run.
/// </summary>
/// <remarks>
/// AI Core groups a run's claims by extension id and dispatches each group to one
/// contributor, so an extension receives exactly one dispatch however many
/// capabilities it advertises. Registering a second contributor under the same
/// extension id does not add a second dispatch: the claims merge into a single
/// group and only the first contributor is called, so every claim belonging to the
/// others is dropped without an error. Both capabilities therefore live here and
/// are routed by claim id.
/// </remarks>
public sealed class SegmentStudioAiContributor(
    IServiceScopeFactory scopeFactory,
    ILogger<SegmentStudioAiContributor> logger) : IAiCapabilityContributor
{
    public const string ExtensionId = "com.midnightrider.segment-studio";

    public const string ShotBoundaryCapabilityId = "segment-studio.shot-boundaries";
    public const string ShotBoundaryClaimId = "segment-studio.video.shot-boundaries";
    private const string ShotBoundaryOutputKey = "shot_boundaries";
    private const string ShotBoundaryWantCapability = "temporal_segmentation";
    private const string ShotBoundaryWantScope = "asset";
    private const string ShotBoundarySlotId = "detector";

    public const string TaggingCapabilityId = "segment-studio.ai-tagging";
    public const string TaggingClaimId = "segment-studio.video.ai-tagging";
    private const string TaggingOutputKey = "tagging";
    private const string TaggingWantCapability = "tagging";
    private const string TaggingWantScope = "frame";
    private const string TaggingSlotId = "tagger";

    /// <summary>
    /// Predictions weaker than this are not worth a reviewer's time. It matches the
    /// floor the superseded analysis service applied.
    /// </summary>
    private const double CandidateConfidenceFloor = 0.35;

    private static readonly AiCapabilityDescriptor Descriptor = new(
        ExtensionId,
        "Segment Studio",
        [
            new AiCapabilityClaim(
                ShotBoundaryClaimId,
                "Shot Boundaries",
                AiMediaKinds.Video,
                ShotBoundaryWantCapability,
                ShotBoundaryWantScope,
                ShotBoundaryOutputKey,
                Description: "Detect shot cuts and transitions across the whole video.")
            {
                CapabilityId = ShotBoundaryCapabilityId,
                ModelBindingSlotId = ShotBoundarySlotId,
            },
            new AiCapabilityClaim(
                TaggingClaimId,
                "AI Tagging (Segment Studio review)",
                AiMediaKinds.Video,
                TaggingWantCapability,
                TaggingWantScope,
                TaggingOutputKey,
                Description: "Tag what happens across a video and collect the results for review.")
            {
                CapabilityId = TaggingCapabilityId,
                ModelBindingSlotId = TaggingSlotId,
            },
        ])
    {
        // Two features, not one: shot boundaries and tagging are independently
        // useful, so they stay separately selectable in the Run AI dialog and
        // separately addressable by a run preset.
        Capabilities =
        [
            new AiCapabilityFeature(
                ShotBoundaryCapabilityId,
                "Shot Boundaries",
                [ShotBoundaryClaimId],
                [
                    new AiModelBindingSlot(
                        ShotBoundarySlotId,
                        "Shot-boundary model",
                        ShotBoundaryWantCapability,
                        RequiredCapabilities: [ShotBoundaryWantCapability],
                        RequiredScopes: [ShotBoundaryWantScope],
                        RequiredCategories: [ShotBoundaryOutputKey],
                        Description: "Model that partitions a video into shots."),
                ],
                "Split a video into shots, so segments can be aligned to real cuts."),
            new AiCapabilityFeature(
                TaggingCapabilityId,
                "AI Tagging (Segment Studio review)",
                [TaggingClaimId],
                [
                    new AiModelBindingSlot(
                        TaggingSlotId,
                        "Tagging model",
                        TaggingWantCapability,
                        RequiredCapabilities: [TaggingWantCapability],
                        RequiredScopes: [TaggingWantScope],
                        Description: "Model that predicts tags for sampled frames."),
                ],
                "Collect AI tag predictions as spans Segment Studio can review."),
        ],
    };

    public AiCapabilityDescriptor Describe() => Descriptor;

    public async Task<AiDispatchResult> DispatchAsync(
        AiDispatchRequest request, CancellationToken ct = default)
    {
        var notes = new List<string>();
        var written = new Dictionary<string, int>(StringComparer.OrdinalIgnoreCase);

        foreach (var claim in request.Claims)
        {
            switch (claim.ClaimId)
            {
                case ShotBoundaryClaimId:
                    written[ShotBoundaryOutputKey] = written.GetValueOrDefault(ShotBoundaryOutputKey)
                        + await ProjectShotBoundariesAsync(request, notes, ct);
                    break;

                case TaggingClaimId:
                    written[TaggingOutputKey] = written.GetValueOrDefault(TaggingOutputKey)
                        + await ProjectTagsAsync(request, notes, ct);
                    break;

                default:
                    // A claim this contributor advertises but does not route would
                    // otherwise vanish silently, which is exactly how a dropped
                    // capability hides inside a run that reports success.
                    logger.LogWarning(
                        "Segment Studio received claim {ClaimId} from run {RunId} but has no handler for it.",
                        claim.ClaimId, request.Context.RunId);
                    notes.Add($"Segment Studio does not handle claim {claim.ClaimId}; it produced nothing.");
                    break;
            }
        }

        // One line per dispatch naming every claim and what it wrote, so a claim that
        // produced nothing is visible in the log rather than only in the run summary.
        logger.LogInformation(
            "Segment Studio handled {ClaimCount} claim(s) for run {RunId}: {Written}.",
            request.Claims.Count,
            request.Context.RunId,
            written.Count == 0
                ? "nothing"
                : string.Join(", ", written.Select(entry => $"{entry.Key}={entry.Value}")));

        return new AiDispatchResult(ExtensionId, request.Claims.Count, written, notes);
    }

    private async Task<int> ProjectShotBoundariesAsync(
        AiDispatchRequest request, List<string> notes, CancellationToken ct)
    {
        var videoId = ResolveVideoId(request.Context);
        if (videoId is null)
        {
            notes.Add("Run was not anchored to a Cove video; shot boundaries were not stored.");
            return 0;
        }

        var payload = ReadShotBoundaryPayload(request.Result);
        if (payload is null)
        {
            notes.Add("The AI server returned no shot-boundary output for this video.");
            return 0;
        }

        var (boundaries, durationSeconds, modelKey, mode) = payload.Value;
        if (boundaries.Count == 0)
        {
            notes.Add("Shot-boundary analysis produced no boundaries.");
            return 0;
        }

        // Prefer the duration the analysis itself reported: the boundary partition is
        // validated against it, so a duration from elsewhere could fail a result that
        // is internally consistent.
        var duration = durationSeconds ?? request.Context.DurationSeconds ?? 0;

        using var scope = scopeFactory.CreateScope();
        var db = scope.ServiceProvider.GetRequiredService<DbContext>();
        var projection = scope.ServiceProvider.GetRequiredService<IShotBoundaryProjectionService>();

        var projectionRequest = new ShotBoundaryProjectionRequest(
            videoId.Value,
            boundaries,
            duration,
            OperationIdFor(request.Context.RunId, videoId.Value),
            request.Context.RunId,
            modelKey ?? "unknown",
            mode);

        try
        {
            // Replacing a boundary set is all-or-nothing, and the mutation locks are
            // transaction-scoped advisory locks, so the projection runs inside one
            // transaction — opened through the execution strategy, because Cove
            // configures a retrying strategy that owns transaction boundaries.
            var strategy = db.Database.CreateExecutionStrategy();
            var firstAttempt = true;
            var result = await strategy.ExecuteAsync(async () =>
            {
                if (!firstAttempt) db.ChangeTracker.Clear();
                firstAttempt = false;

                await using var transaction = await db.Database.BeginTransactionAsync(ct);
                var projected = await projection.ProjectAsync(db, projectionRequest, ct);
                if (projected.SkippedReason is not null)
                    return projected;

                await db.SaveChangesAsync(ct);
                await transaction.CommitAsync(ct);
                return projected;
            });

            if (result.SkippedReason is { } reason)
            {
                notes.Add(reason switch
                {
                    "boundaries_exist" =>
                        "This video already has shot boundaries; they were kept so manual edits are not lost.",
                    _ => $"Shot boundaries were not stored ({reason}).",
                });
                return 0;
            }

            logger.LogInformation(
                "Segment Studio stored {BoundaryCount} shot boundary/boundaries for video {VideoId} from run {RunId}.",
                result.Written, videoId.Value, request.Context.RunId);
            return result.Written;
        }
        catch (SegmentStudioAnalysisPersistenceException exception)
        {
            logger.LogWarning(
                exception,
                "Segment Studio rejected shot boundaries for video {VideoId} from run {RunId}: {Code}.",
                videoId.Value, request.Context.RunId, exception.Code);
            notes.Add(exception.Message);
            return 0;
        }
    }

    private async Task<int> ProjectTagsAsync(
        AiDispatchRequest request, List<string> notes, CancellationToken ct)
    {
        var videoId = ResolveVideoId(request.Context);
        if (videoId is null)
        {
            notes.Add("Run was not anchored to a Cove video; tag candidates were not stored.");
            return 0;
        }

        if (request.Result.Frames.Count == 0)
        {
            notes.Add("The AI server returned no per-frame tagging output for this video.");
            return 0;
        }

        using var scope = scopeFactory.CreateScope();
        var db = scope.ServiceProvider.GetRequiredService<DbContext>();
        var projection = scope.ServiceProvider.GetRequiredService<IAiTaggingProjectionService>();

        // Analysis follows the same source file the rest of Segment Studio uses: for
        // a derived video that is its parent's file, not its own.
        var sourceVideoId = await db.Set<Video>().AsNoTracking()
            .Where(video => video.Id == videoId.Value)
            .Select(video => (int?)(video.ParentVideoId ?? video.Id))
            .FirstOrDefaultAsync(ct);
        var file = await db.Set<VideoFile>().AsNoTracking()
            .Where(candidate => candidate.VideoId == sourceVideoId)
            .OrderBy(candidate => candidate.Id)
            .Select(candidate => new { candidate.Id, candidate.Path })
            .FirstOrDefaultAsync(ct);
        if (file is null)
        {
            notes.Add("The video has no file on disk; tag candidates were not stored.");
            return 0;
        }

        // A span stands for a region of one particular file, so the candidate key is
        // derived from the file's identity: re-running over an unchanged file
        // re-derives the same keys, and replacing the file invalidates them.
        var fingerprint = SourceFingerprint.For(file.Path);

        var duration = request.Result.DurationSeconds ?? request.Context.DurationSeconds ?? 0;
        if (duration <= 0)
        {
            notes.Add("The run reported no duration; tag candidates were not stored.");
            return 0;
        }

        var interval = request.Result.FrameIntervalSeconds
            ?? request.Context.FrameIntervalSeconds
            ?? AiTaggingCandidateBuilder.FallbackFrameIntervalSeconds;

        var candidates = AiTaggingCandidateBuilder.Build(
            request.Result.Frames, fingerprint, duration, interval, CandidateConfidenceFloor);
        if (candidates.Count == 0)
        {
            notes.Add("Tagging produced no predictions above the confidence floor.");
            return 0;
        }

        var projectionRequest = new AiTaggingProjectionRequest(
            videoId.Value,
            file.Id,
            RunIdFor(request.Context.RunId, videoId.Value),
            fingerprint,
            candidates);

        try
        {
            // Candidates, their draft items and the run row are one unit: a partial
            // write would leave a reviewer looking at an incomplete queue. The
            // transaction is opened through the execution strategy because Cove
            // configures a retrying strategy that owns transaction boundaries.
            var strategy = db.Database.CreateExecutionStrategy();
            var firstAttempt = true;
            var result = await strategy.ExecuteAsync(async () =>
            {
                if (!firstAttempt) db.ChangeTracker.Clear();
                firstAttempt = false;

                await using var transaction = await db.Database.BeginTransactionAsync(ct);
                var projected = await projection.ProjectAsync(db, projectionRequest, ct);
                await transaction.CommitAsync(ct);
                return projected;
            });

            logger.LogInformation(
                "Segment Studio stored {CandidateCount} tag candidate(s) for video {VideoId} from run {RunId}.",
                result.CandidateCount, videoId.Value, request.Context.RunId);
            notes.Add($"Stored {result.CandidateCount} tag candidate(s) for review.");
            return result.CandidateCount;
        }
        catch (Exception error) when (error is not OperationCanceledException)
        {
            logger.LogError(
                error,
                "Failed to project AI tag candidates for video {VideoId} from run {RunId}",
                videoId.Value, request.Context.RunId);
            notes.Add("Storing tag candidates failed; the run's tagging output was not applied.");
            return 0;
        }
    }

    private static int? ResolveVideoId(AiRunContext context)
        => string.Equals(context.HostEntityType, "video", StringComparison.OrdinalIgnoreCase)
            && context.HostEntityId is > 0
            ? context.HostEntityId
            : null;

    /// <summary>
    /// A stable operation id per (run, video), so the advisory locks and any replay
    /// bookkeeping behave the same way they do for a user-driven edit.
    /// </summary>
    private static Guid OperationIdFor(string runId, int videoId)
        => new(System.Security.Cryptography.MD5.HashData(
            System.Text.Encoding.UTF8.GetBytes($"shot-boundaries:{runId}:{videoId}")));

    /// <summary>
    /// A stable analysis-run id per (run, video), so a retried dispatch reconciles
    /// with the candidates the first attempt stored instead of duplicating them.
    /// </summary>
    private static Guid RunIdFor(string runId, int videoId)
        => new(System.Security.Cryptography.MD5.HashData(
            System.Text.Encoding.UTF8.GetBytes($"ai-tagging:{runId}:{videoId}")));

    private static (IReadOnlyList<SegmentStudioAnalysisBoundary> Boundaries,
        double? DurationSeconds, string? ModelKey, string? Mode)? ReadShotBoundaryPayload(AiAnalyzeResult result)
    {
        // Asset-scope output arrives as raw JSON in the analysis node's `other`
        // block, because the shape is defined by the model rather than by the AI
        // server's own vocabulary.
        if (result.AssetAnalysis?.Other is not { } other
            || !other.TryGetValue(ShotBoundaryOutputKey, out var raw)
            || string.IsNullOrWhiteSpace(raw))
            return null;

        try
        {
            using var document = JsonDocument.Parse(raw);
            var root = document.RootElement;
            if (root.ValueKind != JsonValueKind.Object
                || !root.TryGetProperty("boundaries", out var boundariesElement)
                || boundariesElement.ValueKind != JsonValueKind.Array)
                return null;

            var boundaries = new List<SegmentStudioAnalysisBoundary>(boundariesElement.GetArrayLength());
            foreach (var element in boundariesElement.EnumerateArray())
            {
                if (!TryReadDouble(element, "start_seconds", out var start)
                    || !TryReadDouble(element, "end_seconds", out var end))
                    return null;
                boundaries.Add(new SegmentStudioAnalysisBoundary(start, end, ReadString(element, "transition_after")));
            }

            return (
                boundaries,
                TryReadDouble(root, "duration_seconds", out var duration) ? duration : null,
                ReadString(root, "model"),
                ReadString(root, "mode"));
        }
        catch (JsonException)
        {
            return null;
        }
    }

    private static bool TryReadDouble(JsonElement element, string name, out double value)
    {
        value = 0;
        return element.ValueKind == JsonValueKind.Object
            && element.TryGetProperty(name, out var property)
            && property.ValueKind == JsonValueKind.Number
            && property.TryGetDouble(out value);
    }

    private static string? ReadString(JsonElement element, string name)
        => element.ValueKind == JsonValueKind.Object
            && element.TryGetProperty(name, out var property)
            && property.ValueKind == JsonValueKind.String
                ? property.GetString()
                : null;
}
