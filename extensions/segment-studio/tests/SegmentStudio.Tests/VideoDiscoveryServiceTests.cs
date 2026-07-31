namespace SegmentStudio.Tests;

using Cove.Core.Entities;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Primitives;
using System.Reflection;

public sealed class VideoDiscoveryServiceTests
{
    [Theory]
    [InlineData("17", "19", 17)]
    [InlineData(null, "19", 19)]
    public void EndpointQueryPrefersSegmentTagIdAndAcceptsLegacyTagId(
        string? segmentTagId,
        string? tagId,
        int expected)
    {
        var values = new Dictionary<string, StringValues>();
        if (segmentTagId is not null) values["segmentTagId"] = segmentTagId;
        if (tagId is not null) values["tagId"] = tagId;
        values["videoTagIds"] = "41,42,41";
        values["performerIds"] = "21,invalid,22";
        values["studioId"] = "31";
        values["hasShotBoundaries"] = "true";

        var method = typeof(SegmentStudioExtension).GetMethod(
            "ParseDiscoveryQuery",
            BindingFlags.NonPublic | BindingFlags.Static);
        var parsed = Assert.IsType<VideoDiscoveryQuery>(
            method?.Invoke(null, [new QueryCollection(values), true, false]));

        Assert.Equal(expected, parsed.SegmentTagId);
        Assert.Equal([41, 42], parsed.VideoTagIds);
        Assert.Equal([21, 22], parsed.PerformerIds);
        Assert.Equal(31, parsed.StudioId);
        Assert.True(parsed.HasShotBoundaries);
        Assert.Equal("full", parsed.Workflow);
    }

    [Fact]
    public void BasicEndpointQueryIgnoresCraftedFullWorkflowFilters()
    {
        var values = new Dictionary<string, StringValues>
        {
            ["workflow"] = "full",
            ["reviewState"] = "rejected",
            ["hasShotBoundaries"] = "true",
            ["sort"] = "unreviewed_count",
        };
        var method = typeof(SegmentStudioExtension).GetMethod(
            "ParseDiscoveryQuery",
            BindingFlags.NonPublic | BindingFlags.Static);

        var parsed = Assert.IsType<VideoDiscoveryQuery>(
            method?.Invoke(null, [new QueryCollection(values), false, false]));

        Assert.Equal("basic", parsed.Workflow);
        Assert.Null(parsed.ReviewState);
        Assert.Null(parsed.HasShotBoundaries);
        Assert.Null(parsed.Sort);
    }

    [Fact]
    public void EndpointQueryPreservesRandomSortSeed()
    {
        var values = new Dictionary<string, StringValues>
        {
            ["sort"] = "random",
            ["direction"] = "desc",
            ["seed"] = "2468",
        };
        var method = typeof(SegmentStudioExtension).GetMethod(
            "ParseDiscoveryQuery",
            BindingFlags.NonPublic | BindingFlags.Static);

        var parsed = Assert.IsType<VideoDiscoveryQuery>(
            method?.Invoke(null, [new QueryCollection(values), false, false]));

        Assert.Equal("random", parsed.Sort);
        Assert.Equal("desc", parsed.Direction);
        Assert.Equal(2468, parsed.Seed);
    }

    [Fact]
    public async Task ListingIsReadOnlyAndReturnsPagedReviewCounts()
    {
        await using var fixture = await DiscoveryFixture.CreateAsync();
        var beforeSegments = await fixture.Context.Set<SegmentStudioReviewSegment>().CountAsync();

        var result = await VideoDiscoveryService.FindAsync(
            fixture.Context,
            new VideoDiscoveryQuery(Page: 1, PerPage: 2, Sort: "title", Direction: "asc"),
            CancellationToken.None);

        Assert.Equal(4, result.TotalCount);
        Assert.Equal(2, result.Items.Count);
        Assert.Equal(["Alpha", "Beta"], result.Items.Select(item => item.Title));
        var alpha = result.Items[0];
        Assert.Equal(3, alpha.SegmentCount);
        Assert.Equal(1, alpha.UnreviewedCount);
        Assert.Equal(1, alpha.ApprovedCount);
        Assert.Equal(1, alpha.RejectedCount);
        Assert.Equal(beforeSegments, await fixture.Context.Set<SegmentStudioReviewSegment>().CountAsync());
    }

    [Theory]
    [InlineData(true, null, new[] { "Alpha", "Beta", "Gamma" })]
    [InlineData(false, null, new[] { "Delta" })]
    [InlineData(null, "unreviewed", new[] { "Alpha", "Beta" })]
    [InlineData(null, "approved", new[] { "Alpha" })]
    [InlineData(null, "rejected", new[] { "Alpha", "Gamma" })]
    public async Task AppliesSegmentPresenceAndReviewFilters(
        bool? hasSegments,
        string? reviewState,
        string[] expectedTitles)
    {
        await using var fixture = await DiscoveryFixture.CreateAsync();

        var result = await VideoDiscoveryService.FindAsync(
            fixture.Context,
            new VideoDiscoveryQuery(
                Page: 1,
                PerPage: 20,
                Sort: "title",
                Direction: "asc",
                HasSegments: hasSegments,
                ReviewState: reviewState),
            CancellationToken.None);

        Assert.Equal(expectedTitles, result.Items.Select(item => item.Title));
    }

    [Fact]
    public async Task FiltersSegmentsBySegmentTagAndSearchText()
    {
        await using var fixture = await DiscoveryFixture.CreateAsync();

        var result = await VideoDiscoveryService.FindAsync(
            fixture.Context,
            new VideoDiscoveryQuery(Page: 1, PerPage: 20, Query: "alp", SegmentTagId: 11),
            CancellationToken.None);

        var item = Assert.Single(result.Items);
        Assert.Equal("Alpha", item.Title);
    }

    [Fact]
    public async Task UsesFileBasenameWhenMetadataTitleIsMissing()
    {
        await using var fixture = await DiscoveryFixture.CreateAsync();
        fixture.Context.Add(new Video
        {
            Id = 6,
            FileSearchText = "/library/Folder/Fallback title.mp4",
            SearchText = "fallback title",
            UpdatedAt = DateTime.UtcNow,
            Files = [new VideoFile { Id = 61, Basename = "Fallback title.mp4" }],
        });
        await fixture.Context.SaveChangesAsync();

        var result = await VideoDiscoveryService.FindAsync(
            fixture.Context,
            new VideoDiscoveryQuery(Page: 1, PerPage: 20, Query: "fallback"),
            CancellationToken.None);

        Assert.Equal("Fallback title.mp4", Assert.Single(result.Items).Title);
    }

    [Fact]
    public async Task AppliesStablePagingAndAggregateSorting()
    {
        await using var fixture = await DiscoveryFixture.CreateAsync();

        var firstPage = await VideoDiscoveryService.FindAsync(
            fixture.Context,
            new VideoDiscoveryQuery(Page: 1, PerPage: 1, Sort: "segment_count", Direction: "desc"),
            CancellationToken.None);
        var secondPage = await VideoDiscoveryService.FindAsync(
            fixture.Context,
            new VideoDiscoveryQuery(Page: 2, PerPage: 1, Sort: "segment_count", Direction: "desc"),
            CancellationToken.None);

        Assert.Equal("Alpha", Assert.Single(firstPage.Items).Title);
        Assert.Equal("Beta", Assert.Single(secondPage.Items).Title);
        Assert.Equal(4, firstPage.TotalCount);
        Assert.Equal(2, secondPage.Page);
    }

    [Fact]
    public async Task RandomSortingIsSeededAndStableAcrossPages()
    {
        await using var fixture = await DiscoveryFixture.CreateAsync();

        var full = await VideoDiscoveryService.FindAsync(
            fixture.Context,
            new VideoDiscoveryQuery(Page: 1, PerPage: 20, Sort: "random", Direction: "asc", Seed: 1),
            CancellationToken.None);
        var repeated = await VideoDiscoveryService.FindAsync(
            fixture.Context,
            new VideoDiscoveryQuery(Page: 1, PerPage: 20, Sort: "random", Direction: "asc", Seed: 1),
            CancellationToken.None);
        var firstPage = await VideoDiscoveryService.FindAsync(
            fixture.Context,
            new VideoDiscoveryQuery(Page: 1, PerPage: 2, Sort: "random", Direction: "asc", Seed: 1),
            CancellationToken.None);
        var secondPage = await VideoDiscoveryService.FindAsync(
            fixture.Context,
            new VideoDiscoveryQuery(Page: 2, PerPage: 2, Sort: "random", Direction: "asc", Seed: 1),
            CancellationToken.None);
        var reshuffled = await VideoDiscoveryService.FindAsync(
            fixture.Context,
            new VideoDiscoveryQuery(Page: 1, PerPage: 20, Sort: "random", Direction: "asc", Seed: 2),
            CancellationToken.None);
        var descending = await VideoDiscoveryService.FindAsync(
            fixture.Context,
            new VideoDiscoveryQuery(Page: 1, PerPage: 20, Sort: "random", Direction: "desc", Seed: 1),
            CancellationToken.None);

        var fullIds = full.Items.Select(item => item.VideoId).ToArray();
        Assert.Equal([2, 3, 1, 5], fullIds);
        Assert.Equal(fullIds, repeated.Items.Select(item => item.VideoId));
        Assert.Equal(
            fullIds,
            firstPage.Items.Concat(secondPage.Items).Select(item => item.VideoId));
        Assert.False(fullIds.SequenceEqual(reshuffled.Items.Select(item => item.VideoId)));
        Assert.Equal(fullIds.Reverse(), descending.Items.Select(item => item.VideoId));
    }

    [Fact]
    public async Task VideoTagsMatchAnyDirectOrQualifyingOccurrenceDerivedTag()
    {
        await using var fixture = await DiscoveryFixture.CreateAsync();

        var result = await VideoDiscoveryService.FindAsync(
            fixture.Context,
            new VideoDiscoveryQuery(
                Page: 1,
                PerPage: 20,
                Sort: "title",
                Direction: "asc",
                VideoTagIds: [41, 42]),
            CancellationToken.None);

        Assert.Equal(["Alpha", "Gamma"], result.Items.Select(item => item.Title));
    }

    [Fact]
    public async Task VideoTagsExcludeOccurrenceApplicationsBelowTheTagThreshold()
    {
        await using var fixture = await DiscoveryFixture.CreateAsync();

        var result = await VideoDiscoveryService.FindAsync(
            fixture.Context,
            new VideoDiscoveryQuery(Page: 1, PerPage: 20, VideoTagIds: [42]),
            CancellationToken.None);

        Assert.Equal("Gamma", Assert.Single(result.Items).Title);
    }

    [Fact]
    public async Task PerformersMatchAnySelectedPerformer()
    {
        await using var fixture = await DiscoveryFixture.CreateAsync();

        var result = await VideoDiscoveryService.FindAsync(
            fixture.Context,
            new VideoDiscoveryQuery(
                Page: 1,
                PerPage: 20,
                Sort: "title",
                Direction: "asc",
                PerformerIds: [22, 23]),
            CancellationToken.None);

        Assert.Equal(["Beta", "Gamma"], result.Items.Select(item => item.Title));
    }

    [Fact]
    public async Task StudioMatchesExactly()
    {
        await using var fixture = await DiscoveryFixture.CreateAsync();

        var result = await VideoDiscoveryService.FindAsync(
            fixture.Context,
            new VideoDiscoveryQuery(
                Page: 1,
                PerPage: 20,
                Sort: "title",
                Direction: "asc",
                StudioId: 31),
            CancellationToken.None);

        Assert.Equal(["Alpha", "Beta"], result.Items.Select(item => item.Title));
    }

    [Fact]
    public async Task StudioFilterRespectsStudioVisibilityQueryFilter()
    {
        await using var fixture = await DiscoveryFixture.CreateAsync();

        var result = await VideoDiscoveryService.FindAsync(
            fixture.Context,
            new VideoDiscoveryQuery(Page: 1, PerPage: 20, StudioId: 33),
            CancellationToken.None);

        Assert.Empty(result.Items);
        Assert.Equal(0, result.TotalCount);
    }

    [Theory]
    [InlineData(true, new[] { "Alpha", "Gamma" })]
    [InlineData(false, new[] { "Beta", "Delta" })]
    public async Task FiltersByStoredShotBoundaryPresence(bool hasShotBoundaries, string[] expectedTitles)
    {
        await using var fixture = await DiscoveryFixture.CreateAsync();

        var result = await VideoDiscoveryService.FindAsync(
            fixture.Context,
            new VideoDiscoveryQuery(
                Page: 1,
                PerPage: 20,
                Sort: "title",
                Direction: "asc",
                HasShotBoundaries: hasShotBoundaries),
            CancellationToken.None);

        Assert.Equal(expectedTitles, result.Items.Select(item => item.Title));
    }

    [Fact]
    public async Task DifferentDiscoveryCategoriesCombineWithAndBeforePaging()
    {
        await using var fixture = await DiscoveryFixture.CreateAsync();

        var result = await VideoDiscoveryService.FindAsync(
            fixture.Context,
            new VideoDiscoveryQuery(
                Page: 1,
                PerPage: 1,
                Sort: "title",
                Direction: "asc",
                HasSegments: true,
                ReviewState: "rejected",
                SegmentTagId: 13,
                VideoTagIds: [42],
                PerformerIds: [23],
                StudioId: 32,
                HasShotBoundaries: true),
            CancellationToken.None);

        Assert.Equal(1, result.TotalCount);
        Assert.Equal("Gamma", Assert.Single(result.Items).Title);
    }

    [Fact]
    public async Task RespectsVideoVisibilityQueryFilter()
    {
        await using var fixture = await DiscoveryFixture.CreateAsync();

        var result = await VideoDiscoveryService.FindAsync(
            fixture.Context,
            new VideoDiscoveryQuery(Page: 1, PerPage: 20),
            CancellationToken.None);

        Assert.DoesNotContain(result.Items, item => item.VideoId == fixture.HiddenVideoId);
        Assert.Equal(4, result.TotalCount);

        var filtered = await VideoDiscoveryService.FindAsync(
            fixture.Context,
            new VideoDiscoveryQuery(Page: 1, PerPage: 20, VideoTagIds: [41]),
            CancellationToken.None);

        Assert.Equal("Alpha", Assert.Single(filtered.Items).Title);
        Assert.DoesNotContain(filtered.Items, item => item.VideoId == fixture.HiddenVideoId);
    }

    [Fact]
    public async Task FullWorkflowAggregatesPublishedNativeSegmentsAndOwnedDrafts()
    {
        await using var fixture = await DiscoveryFixture.CreateAsync();

        var result = await VideoDiscoveryService.FindAsync(
            fixture.Context,
            new VideoDiscoveryQuery(
                Page: 1,
                PerPage: 20,
                Sort: "title",
                Direction: "asc",
                ReviewState: "unreviewed",
                Workflow: "full"),
            CancellationToken.None);

        var draftOnly = Assert.Single(result.Items);
        Assert.Equal("Delta", draftOnly.Title);
        Assert.Equal(1, draftOnly.SegmentCount);
        Assert.Equal(1, draftOnly.UnreviewedCount);
        Assert.Equal(0, draftOnly.ApprovedCount);
    }

    [Fact]
    public async Task BasicWorkflowCountsOnlyNativeSegments()
    {
        await using var fixture = await DiscoveryFixture.CreateAsync();

        var result = await VideoDiscoveryService.FindAsync(
            fixture.Context,
            new VideoDiscoveryQuery(
                Page: 1,
                PerPage: 20,
                Sort: "title",
                Direction: "asc",
                HasSegments: true,
                Workflow: "basic"),
            CancellationToken.None);

        Assert.DoesNotContain(result.Items, item => item.Title == "Delta");
        Assert.All(result.Items, item =>
        {
            Assert.Equal(0, item.UnreviewedCount);
            Assert.Equal(0, item.ApprovedCount);
            Assert.Equal(0, item.RejectedCount);
        });
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
                new Studio { Id = 31, Name = "Visible A" },
                new Studio { Id = 32, Name = "Visible B" },
                new Studio { Id = 33, Name = "Hidden" },
                new Tag { Id = 41, Name = "Direct" },
                new Tag { Id = 42, Name = "Occurrence", MinOccurrenceSec = 5 },
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
        }
    }
}
