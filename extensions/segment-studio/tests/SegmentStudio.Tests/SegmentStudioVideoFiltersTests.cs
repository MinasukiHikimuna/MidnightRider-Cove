namespace SegmentStudio.Tests;

using System.Text.Json;
using Cove.Core.Entities;
using Microsoft.EntityFrameworkCore;

public sealed class SegmentStudioVideoFiltersTests
{
    private static readonly int[] Candidates = [1, 2, 3, 5];

    [Theory]
    [InlineData("has-segments", "equals", "true", new[] { 1, 2, 3 })]
    [InlineData("has-segments", "equals", "false", new[] { 5 })]
    [InlineData("review-state", "equals", "\"unreviewed\"", new[] { 1, 2 })]
    [InlineData("review-state", "equals", "\"approved\"", new[] { 1 })]
    [InlineData("review-state", "equals", "\"rejected\"", new[] { 1, 3 })]
    [InlineData("review-state", "equals", "\"draft\"", new int[0])]
    [InlineData("has-shot-boundaries", "equals", "true", new[] { 1, 3 })]
    [InlineData("has-shot-boundaries", "equals", "false", new[] { 2, 5 })]
    public async Task CompatibilityWorkflowMatchesPresenceReviewAndShotBoundaryFilters(
        string filterId, string modifier, string valueJson, int[] expected)
    {
        await using var fixture = await DiscoveryFixture.CreateAsync();

        Assert.Equal(expected, await MatchingAsync(fixture, SegmentStudioWorkflows.Compatibility, filterId, modifier, valueJson));
    }

    [Fact]
    public async Task ShotBoundaryFilterCountsNativeSetsOnTheEditorsPrimaryFile()
    {
        await using var fixture = await DiscoveryFixture.CreateAsync();
        var now = DateTime.UtcNow;
        // Video 2 has only Cove's native shots, on its primary file; video 5's set is on a file that is not
        // its primary file, so the editor doesn't show it.
        (await fixture.Context.Set<Video>().SingleAsync(video => video.Id == 2)).PrimaryFileId = 902;
        (await fixture.Context.Set<Video>().SingleAsync(video => video.Id == 5)).PrimaryFileId = 905;
        fixture.Context.AddRange(
            new VideoShotSet { Id = 1, FileId = 902, SourceKey = "user", DurationSec = 10, ShotCount = 1, CreatedAt = now, UpdatedAt = now },
            new VideoShotSet { Id = 2, FileId = 906, SourceKey = "user", DurationSec = 10, ShotCount = 1, CreatedAt = now, UpdatedAt = now });
        await fixture.Context.SaveChangesAsync();
        fixture.Context.ChangeTracker.Clear();

        Assert.True(NativeShotSupport.IsAvailable);
        Assert.Equal(new[] { 1, 2, 3 }, await MatchingAsync(fixture, SegmentStudioWorkflows.Compatibility, "has-shot-boundaries", "equals", "true"));
        Assert.Equal(new[] { 5 }, await MatchingAsync(fixture, SegmentStudioWorkflows.Compatibility, "has-shot-boundaries", "equals", "false"));
        Assert.Equal(new[] { 1, 2, 3 }, await MatchingAsync(fixture, SegmentStudioWorkflows.Full, "has-shot-boundaries", "equals", "true"));
        Assert.Empty(await MatchingAsync(fixture, SegmentStudioWorkflows.Basic, "has-shot-boundaries", "equals", "true"));
    }

    [Theory]
    [InlineData("includes", """{"value":[11]}""", new[] { 1 })]
    [InlineData("includes", """{"value":[12,13]}""", new[] { 1, 2, 3 })]
    [InlineData("includesall", """{"value":[12,13]}""", new[] { 1 })]
    [InlineData("includes", """{"value":[12],"excludes":[13]}""", new[] { 2 })]
    [InlineData("includes", """{"excludes":[13]}""", new[] { 2, 5 })]
    [InlineData("excludes", """{"value":[13]}""", new[] { 2, 5 })]
    [InlineData("includes", """{"value":[10]}""", new int[0])]
    [InlineData("includes", """{"value":[10],"depth":-1}""", new[] { 1, 2 })]
    [InlineData("includes", """{"value":[10],"excludes":[13],"depth":-1}""", new[] { 2 })]
    [InlineData("includes", """{"excludes":[10],"depth":-1}""", new[] { 3, 5 })]
    [InlineData("isnull", """{}""", new[] { 5 })]
    [InlineData("notnull", """{}""", new[] { 1, 2, 3 })]
    public async Task SegmentTagsSupportThePickersModifiersExclusionsAndSubTags(
        string modifier, string valueJson, int[] expected)
    {
        await using var fixture = await DiscoveryFixture.CreateAsync();

        Assert.Equal(expected, await MatchingAsync(fixture, SegmentStudioWorkflows.Compatibility, "segment-tags", modifier, valueJson));
    }

    [Fact]
    public async Task FullWorkflowCombinesPublishedNativeSegmentsWithOwnedDrafts()
    {
        await using var fixture = await DiscoveryFixture.CreateAsync();

        Assert.Equal(new[] { 1, 5 }, await MatchingAsync(fixture, SegmentStudioWorkflows.Full, "has-segments", "equals", "true"));
        Assert.Equal(new[] { 5 }, await MatchingAsync(fixture, SegmentStudioWorkflows.Full, "review-state", "equals", "\"unreviewed\""));
        Assert.Equal(new[] { 1 }, await MatchingAsync(fixture, SegmentStudioWorkflows.Full, "review-state", "equals", "\"approved\""));
    }

    [Fact]
    public async Task BasicWorkflowSeesNativeSegmentsAndNoFullOnlyData()
    {
        await using var fixture = await DiscoveryFixture.CreateAsync();

        Assert.Equal(new[] { 1 }, await MatchingAsync(fixture, SegmentStudioWorkflows.Basic, "has-segments", "equals", "true"));
        Assert.Equal(new[] { 1 }, await MatchingAsync(fixture, SegmentStudioWorkflows.Basic, "segment-tags", "includes", """{"value":[11]}"""));
        Assert.Empty(await MatchingAsync(fixture, SegmentStudioWorkflows.Basic, "segment-tags", "includes", """{"value":[12]}"""));
        Assert.Empty(await MatchingAsync(fixture, SegmentStudioWorkflows.Basic, "review-state", "equals", "\"approved\""));
        Assert.Empty(await MatchingAsync(fixture, SegmentStudioWorkflows.Basic, "has-shot-boundaries", "equals", "true"));
        Assert.Empty(await MatchingAsync(fixture, SegmentStudioWorkflows.Basic, "has-shot-boundaries", "equals", "false"));
    }

    [Fact]
    public async Task CountsFollowTheRequestedOrderAndReportVideosWithoutSegments()
    {
        await using var fixture = await DiscoveryFixture.CreateAsync();
        var beforeSegments = await fixture.Context.Set<SegmentStudioReviewSegment>().CountAsync();

        var counts = await SegmentStudioVideoFilters.CountsAsync(
            fixture.Context, SegmentStudioWorkflows.Compatibility, [5, 1, 1, 0, 2], CancellationToken.None);

        Assert.Equal(
            [
                new SegmentStudioVideoSegmentCounts(5, 0, 0, 0, 0),
                new SegmentStudioVideoSegmentCounts(1, 3, 1, 1, 1),
                new SegmentStudioVideoSegmentCounts(2, 1, 1, 0, 0),
            ],
            counts);
        Assert.Equal(beforeSegments, await fixture.Context.Set<SegmentStudioReviewSegment>().CountAsync());
    }

    [Fact]
    public async Task CountsOmitVideosTheCallerCannotRead()
    {
        await using var fixture = await DiscoveryFixture.CreateAsync();

        var counts = await SegmentStudioVideoFilters.CountsAsync(
            fixture.Context, SegmentStudioWorkflows.Compatibility, [fixture.HiddenVideoId, 1, 999], CancellationToken.None);

        Assert.Equal([1], counts.Select(item => item.VideoId));
    }

    [Fact]
    public async Task CountsUseTheWorkflowsSegmentRows()
    {
        await using var fixture = await DiscoveryFixture.CreateAsync();

        var full = await SegmentStudioVideoFilters.CountsAsync(fixture.Context, SegmentStudioWorkflows.Full, [1, 5], CancellationToken.None);
        var basic = await SegmentStudioVideoFilters.CountsAsync(fixture.Context, SegmentStudioWorkflows.Basic, [1, 5], CancellationToken.None);

        Assert.Equal([new(1, 1, 0, 1, 0), new(5, 1, 1, 0, 0)], full);
        Assert.Equal([1, 0], basic.Select(item => item.SegmentCount));
    }

    private static async Task<int[]> MatchingAsync(
        DiscoveryFixture fixture, string workflow, string filterId, string modifier, string valueJson)
    {
        var membership = await SegmentStudioVideoFilters.MembershipAsync(
            fixture.Context,
            workflow,
            filterId,
            modifier,
            JsonDocument.Parse(valueJson).RootElement.Clone(),
            CancellationToken.None);
        return Candidates.Where(membership.Contains).ToArray();
    }

    private sealed class DiscoveryFixture : IAsyncDisposable
    {
        public DiscoveryDbContext Context { get; }
        public int HiddenVideoId => 4;

        private DiscoveryFixture(DiscoveryDbContext context) => Context = context;

        public static async Task<DiscoveryFixture> CreateAsync()
        {
            var options = new DbContextOptionsBuilder<DiscoveryDbContext>()
                .UseInMemoryDatabase(Guid.NewGuid().ToString())
                .Options;
            var context = new DiscoveryDbContext(options, hiddenVideoId: 4);
            var now = DateTime.UtcNow;
            context.AddRange(
                new Video { Id = 1, Title = "Alpha", SearchText = "alpha segment", StudioId = 31, UpdatedAt = now.AddMinutes(-1) },
                new Video { Id = 2, Title = "Beta", SearchText = "beta segment", StudioId = 31, UpdatedAt = now.AddMinutes(-2) },
                new Video { Id = 3, Title = "Gamma", SearchText = "gamma rejected", StudioId = 32, UpdatedAt = now.AddMinutes(-3) },
                new Video { Id = 4, Title = "Hidden", SearchText = "hidden", UpdatedAt = now },
                new Video { Id = 5, Title = "Delta", SearchText = "delta empty", StudioId = 33, UpdatedAt = now.AddMinutes(-4) },
                new Studio { Id = 30, Name = "Visible Parent" },
                new Studio { Id = 31, Name = "Visible A", ParentId = 30 },
                new Studio { Id = 32, Name = "Visible B", ParentId = 30 },
                new Studio { Id = 33, Name = "Hidden" },
                new Tag { Id = 40, Name = "Parent" },
                new Tag { Id = 41, Name = "Direct" },
                new Tag { Id = 42, Name = "Occurrence", MinOccurrenceSec = 5 },
                new TagParent { ParentId = 40, ChildId = 41 },
                new TagParent { ParentId = 10, ChildId = 12 },
                new VideoTag { VideoId = 1, TagId = 41 },
                new VideoTag { VideoId = 4, TagId = 41 },
                new VideoPerformer { VideoId = 1, PerformerId = 21 },
                new VideoPerformer { VideoId = 2, PerformerId = 22 },
                new VideoPerformer { VideoId = 3, PerformerId = 21 },
                new VideoPerformer { VideoId = 3, PerformerId = 23 },
                new TagApplication
                {
                    Id = 1, HostType = AffinityHostType.Video, HostId = 3, TagId = 42,
                    SourceKey = "occurrence", TotalDurationSec = 8, HostDurationSec = 100,
                },
                new TagApplication
                {
                    Id = 2, HostType = AffinityHostType.Video, HostId = 2, TagId = 42,
                    SourceKey = "occurrence", TotalDurationSec = 3, HostDurationSec = 100,
                },
                new SegmentStudioShotBoundary
                {
                    Id = 1, VideoId = 1, StartSec = 0, EndSec = 10, CreatedAt = now, UpdatedAt = now,
                },
                new SegmentStudioShotBoundary
                {
                    Id = 2, VideoId = 3, StartSec = 0, EndSec = 10, CreatedAt = now, UpdatedAt = now,
                },
                new Segment
                {
                    Id = 501, HostType = SegmentHostType.Video, HostId = 1, Kind = "tag", TagId = 11,
                    StartSec = 1, EndSec = 2, SourceKey = "user", CreatedAt = now, UpdatedAt = now,
                },
                new SegmentStudioItem
                {
                    Id = 1, ReviewState = "unreviewed", VideoId = 5, StartSec = 1, EndSec = 2,
                    TagId = 11, Kind = "tag", SourceKey = "user", CreatedAt = now, UpdatedAt = now,
                },
                new SegmentStudioReviewSegment { SegmentId = 101, VideoId = 1, TagId = 11, ReviewState = "unreviewed" },
                new SegmentStudioReviewSegment { SegmentId = 102, VideoId = 1, TagId = 12, ReviewState = "approved" },
                new SegmentStudioReviewSegment { SegmentId = 103, VideoId = 1, TagId = 13, ReviewState = "rejected" },
                new SegmentStudioReviewSegment { SegmentId = 201, VideoId = 2, TagId = 12, ReviewState = "unreviewed" },
                new SegmentStudioReviewSegment { SegmentId = 301, VideoId = 3, TagId = 13, ReviewState = "rejected" },
                new SegmentStudioReviewSegment { SegmentId = 401, VideoId = 4, TagId = 11, ReviewState = "approved" });
            await context.SaveChangesAsync();
            context.ChangeTracker.Clear();
            return new DiscoveryFixture(context);
        }

        public async ValueTask DisposeAsync() => await Context.DisposeAsync();
    }

    private sealed class DiscoveryDbContext(DbContextOptions<DiscoveryDbContext> options, int hiddenVideoId) : DbContext(options)
    {
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Video>(builder =>
            {
                builder.HasKey(video => video.Id);
                builder.HasQueryFilter(video => video.Id != hiddenVideoId);
                builder.Ignore(video => video.Studio);
                builder.Ignore(video => video.ParentVideo);
                builder.Ignore(video => video.ChildVideos);
                builder.Ignore(video => video.Urls);
                builder.HasMany(video => video.Files)
                    .WithOne(file => file.Video)
                    .HasForeignKey(file => file.VideoId);
                builder.HasMany(video => video.VideoTags)
                    .WithOne(link => link.Video)
                    .HasForeignKey(link => link.VideoId);
                builder.HasMany(video => video.VideoPerformers)
                    .WithOne(link => link.Video)
                    .HasForeignKey(link => link.VideoId);
                builder.Ignore(video => video.VideoGalleries);
                builder.Ignore(video => video.GroupItems);
                builder.Ignore(video => video.RemoteIds);
                builder.Ignore(video => video.PlayHistory);
            });
            modelBuilder.Entity<BaseFileEntity>(builder =>
            {
                builder.HasKey(file => file.Id);
                builder.Ignore(file => file.ParentFolder);
                builder.Ignore(file => file.Fingerprints);
            });
            modelBuilder.Entity<SegmentStudioReviewSegment>(builder =>
            {
                builder.HasKey(segment => segment.SegmentId);
            });
            modelBuilder.Entity<Segment>(builder =>
            {
                builder.HasKey(segment => segment.Id);
                builder.Ignore(segment => segment.Tag);
                builder.Ignore(segment => segment.Payload);
            });
            modelBuilder.Entity<SegmentStudioItem>(builder =>
            {
                builder.HasKey(item => item.Id);
                builder.Ignore(item => item.Slots);
            });
            modelBuilder.Entity<VideoTag>(builder =>
            {
                builder.HasKey(link => new { link.VideoId, link.TagId });
                builder.Ignore(link => link.Tag);
            });
            modelBuilder.Entity<VideoPerformer>(builder =>
            {
                builder.HasKey(link => new { link.VideoId, link.PerformerId });
                builder.Ignore(link => link.Performer);
            });
            modelBuilder.Entity<Tag>(builder =>
            {
                builder.HasKey(tag => tag.Id);
                builder.Ignore(tag => tag.Aliases);
                builder.Ignore(tag => tag.ParentRelations);
                builder.Ignore(tag => tag.ChildRelations);
                builder.Ignore(tag => tag.RemoteIds);
                builder.Ignore(tag => tag.TagGroup);
                builder.Ignore(tag => tag.VideoTags);
                builder.Ignore(tag => tag.PerformerTags);
                builder.Ignore(tag => tag.ImageTags);
                builder.Ignore(tag => tag.GalleryTags);
                builder.Ignore(tag => tag.StudioTags);
                builder.Ignore(tag => tag.GroupTags);
            });
            modelBuilder.Entity<TagApplication>(builder =>
            {
                builder.HasKey(application => application.Id);
                builder.Ignore(application => application.Tag);
            });
            modelBuilder.Entity<TagParent>(builder =>
            {
                builder.HasKey(link => new { link.ParentId, link.ChildId });
                builder.Ignore(link => link.Parent);
                builder.Ignore(link => link.Child);
            });
            modelBuilder.Entity<Studio>(builder =>
            {
                builder.HasKey(studio => studio.Id);
                builder.HasQueryFilter(studio => studio.Id != 33);
                builder.Ignore(studio => studio.Parent);
                builder.Ignore(studio => studio.Children);
                builder.Ignore(studio => studio.Urls);
                builder.Ignore(studio => studio.Aliases);
                builder.Ignore(studio => studio.StudioTags);
                builder.Ignore(studio => studio.RemoteIds);
                builder.Ignore(studio => studio.Videos);
                builder.Ignore(studio => studio.Galleries);
                builder.Ignore(studio => studio.Images);
                builder.Ignore(studio => studio.Groups);
            });
            modelBuilder.Entity<SegmentStudioShotBoundary>(builder =>
            {
                builder.HasKey(boundary => boundary.Id);
            });
            modelBuilder.Entity<VideoShotSet>(builder =>
            {
                builder.HasKey(set => set.Id);
                builder.Ignore(set => set.File);
                builder.Ignore(set => set.Payload);
            });
        }
    }
}
