namespace MergeOpportunities;

/// <summary>
/// User review outcome for one candidate group. Candidate groups themselves are recomputed
/// from core tables on every request; this table only remembers what the user decided.
/// </summary>
public sealed class MergeOpportunityDecision
{
    public string Key { get; set; } = string.Empty;
    public string Decision { get; set; } = string.Empty;
    public int? TargetEntityId { get; set; }
    public string? Note { get; set; }
    public DateTime DecidedAt { get; set; }
}

public sealed record RemoteIdRef(string Provider, string RemoteId);

public sealed record CandidateMember(
    int EntityId,
    string Name,
    int VideoCount,
    bool IsOrphan,
    IReadOnlyList<RemoteIdRef> RemoteIds,
    string ImageUrl);

public sealed record CandidateDecision(string Decision, int? TargetEntityId, DateTime DecidedAt);

public sealed record CandidateSummary(
    string Key,
    string EntityType,
    string Kind,
    string Label,
    int MemberCount,
    int TotalVideoCount,
    IReadOnlyList<CandidateMember> Members,
    CandidateDecision? Decision);

public sealed record CandidateList(IReadOnlyList<CandidateSummary> Candidates);

public sealed record SharedScene(string Title, int? StudioId, string? StudioName, int MemberCount, IReadOnlyList<int> VideoIds);

public sealed record CandidateDetail(CandidateSummary Summary, IReadOnlyList<SharedScene> SharedScenes);

public sealed record AttachResult(string EntityType, int TargetId, IReadOnlyList<int> SourceIds, int Added);

internal sealed record DecisionRequest(string Decision, int? TargetEntityId, string? Note);

internal sealed record AttachRequest(string EntityType, int TargetId, List<int> SourceIds);
