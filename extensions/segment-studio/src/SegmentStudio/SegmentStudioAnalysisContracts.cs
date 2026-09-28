namespace SegmentStudio;

/// <summary>
/// An analysis run as the runs endpoint reports it. The candidates a run produced
/// are reviewed as drafts in the editor, so the endpoint does not return them.
/// </summary>
public sealed record SegmentStudioAnalysisRunResponse(
    Guid Id,
    int VideoId,
    int VideoFileId,
    string Status,
    IReadOnlyList<string> Analyses,
    string? JobId,
    Guid? ServiceRunId,
    string? SourceFingerprint,
    string? ErrorCode,
    string? ErrorMessage,
    DateTime CreatedAt,
    DateTime UpdatedAt,
    DateTime? CompletedAt);
