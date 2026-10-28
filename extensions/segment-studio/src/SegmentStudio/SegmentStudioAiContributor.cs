using AI.Extensions.Abstractions;
using System.Text.Json;
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
/// others is dropped without an error. Every capability Segment Studio advertises
/// therefore lives here and is routed by claim id.
/// </remarks>
public sealed class SegmentStudioAiContributor(
    IServiceScopeFactory scopeFactory,
    ILogger<SegmentStudioAiContributor> logger) : IAiCapabilityContributor
{
    public const string ExtensionId = "com.midnightrider.segment-studio";

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
        Capabilities =
        [
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

        var runId = RunIdFor(request.Context.RunId, videoId.Value);
        var projectionRequest = new AiTaggingProjectionRequest(
            videoId.Value,
            file.Id,
            runId,
            fingerprint,
            candidates)
        {
            AiRunId = request.Context.RunId,
            Models = request.Result.Models,
        };

        try
        {
            var raw = AiRawResultBuilder.Build(request.Result.Frames, request.Result.Models);
            var threshold = await ReadRequestedThresholdAsync(db, request.Context.RunId, videoId.Value, ct);

            // Candidates, their draft items, the run row and its raw predictions are
            // one unit: a partial write would leave a reviewer looking at an
            // incomplete queue. The transaction is opened through the execution
            // strategy because Cove configures a retrying strategy that owns
            // transaction boundaries. A run with nothing above the review floor
            // still gets its run row, so the predictions below it are kept.
            var strategy = db.Database.CreateExecutionStrategy();
            var firstAttempt = true;
            var result = await strategy.ExecuteAsync(async () =>
            {
                if (!firstAttempt) db.ChangeTracker.Clear();
                firstAttempt = false;

                await using var transaction = await db.Database.BeginTransactionAsync(ct);
                var projected = await projection.ProjectAsync(db, projectionRequest, ct);
                await StoreRawResultAsync(db, runId, videoId.Value, request, raw, threshold, ct);
                await transaction.CommitAsync(ct);
                return projected;
            });

            logger.LogInformation(
                "Segment Studio stored {CandidateCount} tag candidate(s), left out {AlreadyPublishedCount} already published, and kept {PredictionCount} raw prediction(s) for video {VideoId} from run {RunId}.",
                result.CandidateCount, result.AlreadyPublishedCount, raw.PredictionCount, videoId.Value, request.Context.RunId);
            if (result.AlreadyPublishedCount > 0)
                notes.Add($"Left out {result.AlreadyPublishedCount} tag span(s) that published segments already cover.");
            if (result.CandidateCount == 0)
            {
                if (result.AlreadyPublishedCount == 0)
                    notes.Add("Tagging produced no predictions above the confidence floor.");
                return 0;
            }
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

    /// <summary>Writes or replaces the run's raw row; the caller owns the transaction.</summary>
    private static async Task StoreRawResultAsync(
        DbContext db,
        Guid runId,
        int videoId,
        AiDispatchRequest request,
        AiRawResult raw,
        double? threshold,
        CancellationToken ct)
    {
        var row = await db.Set<SegmentStudioAiRawResult>()
            .FirstOrDefaultAsync(candidate => candidate.RunId == runId, ct);
        if (row is null)
        {
            row = new SegmentStudioAiRawResult { RunId = runId, CreatedAt = DateTime.UtcNow };
            db.Add(row);
        }
        row.VideoId = videoId;
        row.AiRunId = request.Context.RunId;
        row.Threshold = threshold;
        row.FrameIntervalSeconds = request.Result.FrameIntervalSeconds ?? request.Context.FrameIntervalSeconds;
        row.DurationSeconds = request.Result.DurationSeconds ?? request.Context.DurationSeconds;
        row.FrameCount = raw.FrameCount;
        row.ModelsJson = raw.ModelsJson;
        row.SchemaVersion = AiRawResultBuilder.SchemaVersion;
        row.PayloadJson = raw.PayloadJson;
        await db.SaveChangesAsync(ct);
    }

    /// <summary>
    /// The threshold the AI run asked the server for, from AI Core's journal of the
    /// run, which it writes before analysis starts. The dispatch does not carry it.
    /// Null when the request named none: the server then applied a default that is
    /// recorded nowhere.
    /// </summary>
    private static async Task<double?> ReadRequestedThresholdAsync(
        DbContext db, string aiRunId, int videoId, CancellationToken ct)
    {
        var request = await db.Set<AiRun>().AsNoTracking()
            .Where(run => run.RunKey == aiRunId
                && run.TargetType == AiRunTargetType.Video
                && run.TargetId == videoId)
            .Select(run => run.Request)
            .FirstOrDefaultAsync(ct);
        if (request?.RootElement is not { ValueKind: JsonValueKind.Object } root)
            return null;
        foreach (var property in root.EnumerateObject())
        {
            if (!string.Equals(property.Name, "threshold", StringComparison.OrdinalIgnoreCase))
                continue;
            return property.Value.ValueKind == JsonValueKind.Number
                && property.Value.TryGetDouble(out var threshold)
                    ? threshold
                    : null;
        }
        return null;
    }

    private static int? ResolveVideoId(AiRunContext context)
        => string.Equals(context.HostEntityType, "video", StringComparison.OrdinalIgnoreCase)
            && context.HostEntityId is > 0
            ? context.HostEntityId
            : null;

    /// <summary>
    /// A stable analysis-run id per (run, video), so a retried dispatch reconciles
    /// with the candidates the first attempt stored instead of duplicating them.
    /// </summary>
    private static Guid RunIdFor(string runId, int videoId)
        => new(System.Security.Cryptography.MD5.HashData(
            System.Text.Encoding.UTF8.GetBytes($"ai-tagging:{runId}:{videoId}")));
}
