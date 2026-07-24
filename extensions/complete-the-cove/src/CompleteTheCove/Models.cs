namespace CompleteTheCove;

public sealed record RemoteKey(string Endpoint, string RemoteId)
{
    public string Normalized => $"{Endpoint.Trim().TrimEnd('/').ToLowerInvariant()}\u001f{RemoteId.Trim()}";
}

public sealed record SourceTag(
    int Id, string Name, string? SortName, string? Description, bool Favorite,
    IReadOnlyList<string> Aliases, IReadOnlyList<RemoteKey> RemoteIds, bool Organized);

public sealed record SourcePerformer(
    int Id, string Name, string? Disambiguation, string? Gender, string? Birthdate,
    string? DeathDate, string? Ethnicity, string? Country, string? EyeColor,
    string? HairColor, int? HeightCm, int? Weight, string? Measurements,
    string? FakeTits, double? PenisLength, string? Circumcised, string? CareerStart,
    string? CareerEnd, string? Tattoos, string? Piercings, bool Favorite,
    string? Details, IReadOnlyList<string> Urls, IReadOnlyList<string> Aliases,
    IReadOnlyList<RemoteKey> RemoteIds);

public sealed record SourceStudio(
    int Id, string Name, bool Favorite, string? Details, bool Organized,
    IReadOnlyList<string> Urls, IReadOnlyList<string> Aliases,
    IReadOnlyList<RemoteKey> RemoteIds, SourceStudio? Parent = null);

public sealed record SourceVideo(
    int Id, string? Title, string? Code, string? Details, string? Director,
    string? Date, bool Organized, bool IsVr, string? Captions,
    IReadOnlyList<string> Urls, IReadOnlyList<RemoteKey> RemoteIds,
    SourceStudio? Studio, IReadOnlyList<SourceTag> Tags,
    IReadOnlyList<SourcePerformer> Performers, string? CoverUrl = null);

public sealed record RefreshTotals(int Targets, int Examined, int Missing, int Removed, int Failed);
public sealed record CompletionProviderProgress(
    string Endpoint, DateTime LastSuccessfulRefreshAt, DateTime? LastRefreshAt,
    string? LastRefreshError, int EligibleVideoCount, int OwnedVideoCount);
public sealed record CompletionTargetOverviewItem(
    string Type, int EntityId, string DisplayName, DateTime SelectedAt,
    DateTime? LastRefreshAt, string? LastRefreshError, int MissingVideoCount,
    IReadOnlyList<CompletionProviderProgress> Providers);
public sealed record CompletionTargetOverviewTotals(int All, int Performer, int Studio, int Tag);
public sealed record CompletionTargetOverview(
    IReadOnlyList<CompletionTargetOverviewItem> Items, CompletionTargetOverviewTotals Totals);
public enum CompletionTargetType { Performer, Studio, Tag }

public sealed class CompletionTarget
{
    public int Id { get; set; }
    public CompletionTargetType EntityType { get; set; }
    public int EntityId { get; set; }
    public required string DisplayName { get; set; }
    public required string RemoteEndpoint { get; set; }
    public required string RemoteId { get; set; }
    public DateTime SelectedAt { get; set; } = DateTime.UtcNow;
    public DateTime? LastRefreshAt { get; set; }
    public string? LastRefreshError { get; set; }
    public DateTime? LastSuccessfulRefreshAt { get; set; }
    public int? EligibleVideoCount { get; set; }
    public int? OwnedVideoCount { get; set; }
    public List<CompletionVideoTarget> Videos { get; set; } = [];
}

public sealed class CompletionVideo
{
    public int Id { get; set; }
    public required string RemoteEndpoint { get; set; }
    public required string RemoteId { get; set; }
    public string? Title { get; set; }
    public string? Code { get; set; }
    public string? Details { get; set; }
    public DateOnly? ReleaseDate { get; set; }
    public string? StudioRemoteId { get; set; }
    public int? CoveStudioId { get; set; }
    public string? StudioName { get; set; }
    public string? ParentStudioRemoteId { get; set; }
    public string? ParentStudioName { get; set; }
    public string? CoverBlobId { get; set; }
    public string? CoverSourceUrl { get; set; }
    public string? CoverError { get; set; }
    public bool IsIgnored { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
    public List<CompletionVideoTarget> Targets { get; set; } = [];
    public List<CompletionVideoPerformer> Performers { get; set; } = [];
    public List<CompletionVideoTag> Tags { get; set; } = [];
    public List<CompletionVideoUrl> Urls { get; set; } = [];
}

public sealed class CompletionVideoTarget
{
    public int VideoId { get; set; }
    public CompletionVideo? Video { get; set; }
    public int TargetId { get; set; }
    public CompletionTarget? Target { get; set; }
}

public sealed class CompletionVideoPerformer
{
    public int Id { get; set; }
    public int VideoId { get; set; }
    public CompletionVideo? Video { get; set; }
    public required string RemoteId { get; set; }
    public int? CovePerformerId { get; set; }
    public required string Name { get; set; }
    public string? Disambiguation { get; set; }
}

public sealed class CompletionVideoTag
{
    public int Id { get; set; }
    public int VideoId { get; set; }
    public CompletionVideo? Video { get; set; }
    public required string RemoteId { get; set; }
    public int? CoveTagId { get; set; }
    public required string Name { get; set; }
}

public sealed class CompletionVideoUrl
{
    public int Id { get; set; }
    public int VideoId { get; set; }
    public CompletionVideo? Video { get; set; }
    public required string Url { get; set; }
}
