namespace SegmentStudio;

/// <summary>
/// One shot of a video, as a half-open span plus the transition that ends it.
/// </summary>
/// <remarks>
/// Produced by a native shot-boundary analysis and consumed by
/// <see cref="IShotBoundaryProjectionService"/>. A boundary set is validated as a
/// contiguous partition of the whole video, so spans meet exactly and the last
/// one ends at the duration.
/// </remarks>
public sealed record SegmentStudioAnalysisBoundary(
    double StartSeconds,
    double EndSeconds,
    string? TransitionAfter);

/// <summary>
/// An analysis run as the review UI lists it, with the candidates it produced.
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

/// <summary>
/// A projection could not be stored. Carries a stable code so the caller can
/// distinguish a conflict from a validation failure without matching on text.
/// </summary>
public sealed class SegmentStudioAnalysisPersistenceException(
    string code, string message) : InvalidOperationException(message)
{
    public string Code { get; } = code;
}
