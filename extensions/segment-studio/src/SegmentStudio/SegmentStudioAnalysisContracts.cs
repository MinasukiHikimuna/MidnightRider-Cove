namespace SegmentStudio;

/// <summary>
/// An analysis run as the runs endpoint reports it, with the candidates it produced.
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
    IReadOnlyList<SegmentStudioAnalysisCandidateResponse> Candidates,
    string? ErrorCode,
    string? ErrorMessage,
    DateTime CreatedAt,
    DateTime UpdatedAt,
    DateTime? CompletedAt);

/// <summary>One reviewable tag span belonging to a run.</summary>
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
