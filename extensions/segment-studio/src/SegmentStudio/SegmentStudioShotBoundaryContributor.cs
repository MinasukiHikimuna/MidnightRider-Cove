using System.Text.Json;
using AI.Extensions.Abstractions;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;

namespace SegmentStudio;

/// <summary>
/// Surfaces shot-boundary detection as a capability in Cove's native Run AI dialog.
/// </summary>
/// <remarks>
/// The AI server runs a shot-boundary model at <c>asset</c> scope — it sees the
/// whole video rather than sampled frames — and returns its result in the
/// asset-level analysis node rather than per frame. AI Core dispatches that
/// result here, and this projects it onto Segment Studio's shot boundaries.
/// </remarks>
public sealed class SegmentStudioShotBoundaryContributor(
    IServiceScopeFactory scopeFactory,
    ILogger<SegmentStudioShotBoundaryContributor> logger) : IAiCapabilityContributor
{
    public const string ExtensionId = "com.midnightrider.segment-studio";
    public const string CapabilityId = "segment-studio.shot-boundaries";
    public const string ClaimId = "segment-studio.video.shot-boundaries";

    /// <summary>Category the AI server publishes shot boundaries under.</summary>
    private const string OutputKey = "shot_boundaries";

    /// <summary>Capability an asset-scope shot-boundary model advertises.</summary>
    private const string WantCapability = "temporal_segmentation";

    private const string WantScope = "asset";

    private const string ModelBindingSlotId = "detector";

    private static readonly AiCapabilityDescriptor Descriptor = new(
        ExtensionId,
        "Segment Studio",
        [
            new AiCapabilityClaim(
                ClaimId,
                "Shot Boundaries",
                AiMediaKinds.Video,
                WantCapability,
                WantScope,
                OutputKey,
                Description: "Detect shot cuts and transitions across the whole video.")
            {
                // Links this claim to the feature and its model binding slot, so
                // model resolution and the Run AI summary can find the slot.
                CapabilityId = CapabilityId,
                ModelBindingSlotId = ModelBindingSlotId,
            },
        ])
    {
        Capabilities =
        [
            new AiCapabilityFeature(
                CapabilityId,
                "Shot Boundaries",
                [ClaimId],
                [
                    new AiModelBindingSlot(
                        ModelBindingSlotId,
                        "Shot-boundary model",
                        WantCapability,
                        RequiredCapabilities: [WantCapability],
                        RequiredScopes: [WantScope],
                        RequiredCategories: [OutputKey],
                        Description: "Model that partitions a video into shots."),
                ],
                "Split a video into shots, so segments can be aligned to real cuts."),
        ],
    };

    public AiCapabilityDescriptor Describe() => Descriptor;

    public async Task<AiDispatchResult> DispatchAsync(AiDispatchRequest request, CancellationToken ct = default)
    {
        var notes = new List<string>();
        var written = 0;

        var videoId = ResolveVideoId(request.Context);
        if (videoId is null)
        {
            notes.Add("Run was not anchored to a Cove video; shot boundaries were not stored.");
            return Result(request, written, notes);
        }

        var payload = ReadShotBoundaryPayload(request.Result);
        if (payload is null)
        {
            notes.Add("The AI server returned no shot-boundary output for this video.");
            return Result(request, written, notes);
        }

        var (boundaries, durationSeconds, modelKey, mode) = payload.Value;
        if (boundaries.Count == 0)
        {
            notes.Add("Shot-boundary analysis produced no boundaries.");
            return Result(request, written, notes);
        }

        // Prefer the duration the analysis itself reported: the boundary partition
        // is validated against it, so a duration from elsewhere could fail a result
        // that is internally consistent.
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
                return Result(request, written, notes);
            }

            written = result.Written;
            logger.LogInformation(
                "Segment Studio stored {BoundaryCount} shot boundary/boundaries for video {VideoId} from run {RunId}.",
                written, videoId.Value, request.Context.RunId);
        }
        catch (SegmentStudioAnalysisPersistenceException exception)
        {
            logger.LogWarning(
                exception,
                "Segment Studio rejected shot boundaries for video {VideoId} from run {RunId}: {Code}.",
                videoId.Value, request.Context.RunId, exception.Code);
            notes.Add(exception.Message);
        }

        return Result(request, written, notes);
    }

    private AiDispatchResult Result(AiDispatchRequest request, int written, List<string> notes)
        => new(
            ExtensionId,
            request.Claims.Count,
            new Dictionary<string, int> { [OutputKey] = written },
            notes);

    private static int? ResolveVideoId(AiRunContext context)
        => string.Equals(context.HostEntityType, "video", StringComparison.OrdinalIgnoreCase)
            && context.HostEntityId is > 0
            ? context.HostEntityId
            : null;

    /// <summary>
    /// A stable operation id per (run, video), so the advisory locks and any
    /// replay bookkeeping behave the same way they do for a user-driven edit.
    /// </summary>
    private static Guid OperationIdFor(string runId, int videoId)
    {
        var bytes = System.Security.Cryptography.MD5.HashData(
            System.Text.Encoding.UTF8.GetBytes($"shot-boundaries:{runId}:{videoId}"));
        return new Guid(bytes);
    }

    private static (IReadOnlyList<SegmentStudioAnalysisBoundary> Boundaries,
        double? DurationSeconds, string? ModelKey, string? Mode)? ReadShotBoundaryPayload(AiAnalyzeResult result)
    {
        // Asset-scope output arrives as raw JSON in the analysis node's `other`
        // block, because the shape is defined by the model rather than by the
        // AI server's own vocabulary.
        if (result.AssetAnalysis?.Other is not { } other
            || !other.TryGetValue(OutputKey, out var raw)
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
