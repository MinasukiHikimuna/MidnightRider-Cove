namespace AnimatedTagPreviews;

public sealed record GeneratePreviewRequest(
    int? SourceFileId,
    double StartSeconds,
    double DurationSeconds,
    double AnchorX,
    double AnchorY,
    double Zoom,
    int? Width = null,
    double PlaybackSpeed = 1);

public sealed record PreviewRecipe(
    int SourceVideoId,
    int SourceFileId,
    double StartSeconds,
    double DurationSeconds,
    double AnchorX,
    double AnchorY,
    double Zoom,
    int Width,
    string VideoCodec,
    int BitrateKbps,
    int FrameRate,
    DateTimeOffset CreatedAt,
    double PlaybackSpeed = 1,
    string AspectRatio = "1:1");

public sealed record PreviewRecord(
    int TagId,
    string BlobId,
    string Version,
    PreviewRecipe? Recipe,
    string Origin = "generated",
    UploadedPreviewMetadata? Upload = null)
{
    public DateTimeOffset CreatedAt => Recipe?.CreatedAt ?? Upload?.CreatedAt ?? DateTimeOffset.UnixEpoch;
}

public sealed record UploadedPreviewMetadata(
    double DurationSeconds,
    int Width,
    int Height,
    string VideoCodec,
    double FrameRate,
    DateTimeOffset CreatedAt);

public sealed record UploadPreviewResponse(int TagId, string Version, bool ReplacedExisting);

public sealed record PreviewCandidateRecord(
    string CandidateId,
    int VideoId,
    int TagId,
    string BlobId,
    PreviewRecipe Recipe,
    DateTimeOffset CreatedAt,
    DateTimeOffset? ApprovalStartedAt = null,
    string? PreviousBlobId = null,
    string? PreviousVersion = null);

public sealed record PreviewApprovalReceipt(
    string CandidateId,
    int VideoId,
    int TagId,
    string Version,
    bool ReplacedExisting,
    string? PreviousBlobId,
    string? PreviousVersion,
    DateTimeOffset ApprovedAt);

public sealed record PreviewIndexItem(int TagId, string Version, string MediaUrl);

public sealed record PreviewIndexResponse(string Version, IReadOnlyList<PreviewIndexItem> Items);

public sealed record PreviewSourceDetails(int VideoId, double StartSeconds);

public sealed record PreviewDetailsResponse(
    int TagId,
    string Version,
    string Origin,
    PreviewSourceDetails? Source,
    bool HasCustomImage);

public sealed record GeneratePreviewResponse(string JobId, int VideoId, int TagId);

public sealed record PreviewJobResponse(
    string Id,
    int VideoId,
    int TagId,
    string Status,
    double Progress,
    string? Message,
    DateTime StartedAt,
    DateTime? CompletedAt,
    string? Error,
    string? CandidateId);

public sealed record CancelPreviewJobResponse(string JobId, bool Cancelled);

public sealed record ApprovePreviewCandidateResponse(
    string CandidateId,
    int VideoId,
    int TagId,
    string Version,
    bool ReplacedExisting,
    bool AlreadyApproved);

public sealed record DiscardPreviewCandidateResponse(
    string CandidateId,
    int VideoId,
    int TagId,
    bool Discarded,
    bool BlobDeleted,
    bool BlobRetained);

public sealed record DeletePreviewResponse(int TagId, bool Deleted, bool BlobDeleted);

public sealed record OrphanCleanupResponse(
    bool DryRun,
    int Count,
    IReadOnlyList<string> BlobIds,
    int OwnedBlobCount,
    int ReferencedBlobCount,
    int DeletedBlobCount,
    IReadOnlyList<string> FailedBlobIds,
    string SnapshotVersion,
    int ExpiredApprovalReceiptCount = 0,
    int StalePreviewCandidateCount = 0,
    int StalePreviewRecordCount = 0);

public sealed record ToolHealth(bool Available, bool Compatible, string? Version, string? Message);

public sealed record PreviewHealthResponse(bool Healthy, ToolHealth Ffmpeg, ToolHealth Ffprobe, ToolHealth Vp9Encoder);

public sealed record PreviewSettings(
    double DefaultDurationSeconds,
    double MaximumDurationSeconds,
    int DefaultWidth,
    int MaximumWidth,
    int FrameRate,
    int MinimumBitrateKbps,
    int MaximumBitrateKbps,
    int EncodingTimeoutSeconds,
    IReadOnlyList<string> EnabledSurfaces,
    bool HoverRestart,
    bool HoverUnmute,
    string AspectRatio = "4:3",
    string CardFit = "inherit",
    bool MatchCardAspectRatio = true)
{
    public static PreviewSettings Default { get; } = new(
        DefaultDurationSeconds: 5,
        MaximumDurationSeconds: 10,
        DefaultWidth: 720,
        MaximumWidth: 720,
        FrameRate: 24,
        MinimumBitrateKbps: 300,
        MaximumBitrateKbps: 2500,
        EncodingTimeoutSeconds: 120,
        EnabledSurfaces: ["card", "hero"],
        HoverRestart: true,
        HoverUnmute: false,
        AspectRatio: "4:3",
        CardFit: "inherit",
        MatchCardAspectRatio: true);
}

public static class PreviewAspectRatios
{
    public static readonly IReadOnlyDictionary<string, (int Width, int Height)> Supported =
        new Dictionary<string, (int, int)>(StringComparer.Ordinal)
        { ["1:1"] = (1, 1), ["4:3"] = (4, 3), ["16:9"] = (16, 9) };

    public static (int Width, int Height) Get(string value)
        => Supported.TryGetValue(value, out var ratio) ? ratio : Supported["1:1"];

    public static int OutputHeight(int width, string value)
    {
        var ratio = Get(value);
        return (int)Math.Round((double)width * ratio.Height / ratio.Width);
    }
}

public sealed record ValidationResult<T>(T? Value, IReadOnlyList<string> Errors)
{
    public bool IsValid => Errors.Count == 0;

    public static ValidationResult<T> Success(T value) => new(value, []);
    public static ValidationResult<T> Failure(params string[] errors) => new(default, errors);
}

public sealed record OwnedBlobRecord(string BlobId, int TagId, DateTimeOffset CreatedAt);

internal sealed record OwnedPreviewJob(
    string JobId,
    int VideoId,
    int TagId,
    PreviewCommitGuard CommitGuard,
    PreviewJobExecution Execution,
    DateTimeOffset CreatedAt);
