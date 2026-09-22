using AI.Extensions.Abstractions;
using Cove.Core.Entities;
using Cove.Core.Interfaces;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;

namespace SegmentStudio;

/// <summary>
/// Surfaces AI tagging as a capability in Cove's native Run AI dialog and turns
/// its per-frame predictions into Segment Studio's reviewable tag spans.
/// </summary>
/// <remarks>
/// Tagging models score individual frames, so unlike shot boundaries the useful
/// result is not in the asset-level node: it is spread across every frame of the
/// run. <see cref="AiTaggingCandidateBuilder"/> collapses those observations into
/// spans and <see cref="IAiTaggingProjectionService"/> writes them.
/// </remarks>
public sealed class SegmentStudioAiTaggingContributor(
    IServiceScopeFactory scopeFactory,
    IAiTaggingProjectionSettingsStore settings,
    ILogger<SegmentStudioAiTaggingContributor> logger) : IAiCapabilityContributor
{
    public const string ExtensionId = "com.midnightrider.segment-studio";
    public const string CapabilityId = "segment-studio.ai-tagging";
    public const string ClaimId = "segment-studio.video.ai-tagging";

    private const string OutputKey = "tagging";
    private const string WantCapability = "tagging";
    private const string WantScope = "frame";
    private const string ModelBindingSlotId = "tagger";

    /// <summary>
    /// Predictions weaker than this are not worth a reviewer's time. It matches
    /// the floor the superseded analysis service applied.
    /// </summary>
    private const double CandidateConfidenceFloor = 0.35;

    private static readonly AiCapabilityDescriptor Descriptor = new(
        ExtensionId,
        "Segment Studio",
        [
            new AiCapabilityClaim(
                ClaimId,
                "AI Tagging",
                AiMediaKinds.Video,
                WantCapability,
                WantScope,
                OutputKey,
                Description: "Tag what happens across a video and collect the results for review.")
            {
                CapabilityId = CapabilityId,
                ModelBindingSlotId = ModelBindingSlotId,
            },
        ])
    {
        Capabilities =
        [
            new AiCapabilityFeature(
                CapabilityId,
                "AI Tagging",
                [ClaimId],
                [
                    new AiModelBindingSlot(
                        ModelBindingSlotId,
                        "Tagging model",
                        WantCapability,
                        RequiredCapabilities: [WantCapability],
                        RequiredScopes: [WantScope],
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

        var videoId = ResolveVideoId(request.Context);
        if (videoId is null)
        {
            notes.Add("Run was not anchored to a Cove video; tag candidates were not stored.");
            return Result(request, 0, notes);
        }

        if (request.Result.Frames.Count == 0)
        {
            notes.Add("The AI server returned no per-frame tagging output for this video.");
            return Result(request, 0, notes);
        }

        using var scope = scopeFactory.CreateScope();
        var db = scope.ServiceProvider.GetRequiredService<DbContext>();
        var projection = scope.ServiceProvider.GetRequiredService<IAiTaggingProjectionService>();

        // Analysis follows the same source file the rest of Segment Studio uses:
        // for a derived video that is its parent's file, not its own.
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
            return Result(request, 0, notes);
        }

        // A span stands for a region of one particular file, so the candidate key
        // is derived from the file's identity: re-running over an unchanged file
        // re-derives the same keys, and replacing the file invalidates them.
        var fingerprint = SourceFingerprint.For(file.Path);

        var duration = request.Result.DurationSeconds ?? request.Context.DurationSeconds ?? 0;
        if (duration <= 0)
        {
            notes.Add("The run reported no duration; tag candidates were not stored.");
            return Result(request, 0, notes);
        }

        var interval = request.Result.FrameIntervalSeconds
            ?? request.Context.FrameIntervalSeconds
            ?? AiTaggingCandidateBuilder.FallbackFrameIntervalSeconds;

        var candidates = AiTaggingCandidateBuilder.Build(
            request.Result.Frames, fingerprint, duration, interval, CandidateConfidenceFloor);
        if (candidates.Count == 0)
        {
            notes.Add("Tagging produced no predictions above the confidence floor.");
            return Result(request, 0, notes);
        }

        var mode = (await settings.LoadAsync(ct)).Mode;
        var projectionRequest = new AiTaggingProjectionRequest(
            videoId.Value,
            file.Id,
            RunIdFor(request.Context.RunId, videoId.Value),
            mode,
            fingerprint,
            candidates,
            request.Result.Models);

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
                if (!firstAttempt)
                    db.ChangeTracker.Clear();
                firstAttempt = false;
                await using var transaction = await db.Database.BeginTransactionAsync(ct);
                var projected = await projection.ProjectAsync(db, projectionRequest, ct);
                await transaction.CommitAsync(ct);
                return projected;
            });

            var written = result.CandidateCount + result.SegmentCount;
            notes.Add(result.CandidateCount > 0
                ? $"Stored {result.CandidateCount} tag candidate(s) for review."
                : $"Applied {result.SegmentCount} tag segment(s) directly.");
            return Result(request, written, notes);
        }
        catch (Exception error) when (error is not OperationCanceledException)
        {
            logger.LogError(
                error,
                "Failed to project AI tag candidates for video {VideoId} from run {RunId}",
                videoId.Value,
                request.Context.RunId);
            notes.Add("Storing tag candidates failed; the run's tagging output was not applied.");
            return Result(request, 0, notes);
        }
    }

    private static AiDispatchResult Result(
        AiDispatchRequest request, int written, IReadOnlyList<string> notes)
        => new(
            ExtensionId,
            request.Claims.Count,
            new Dictionary<string, int>(StringComparer.OrdinalIgnoreCase) { [OutputKey] = written },
            notes);

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
