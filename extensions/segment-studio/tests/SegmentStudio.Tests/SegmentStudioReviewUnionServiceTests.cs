namespace SegmentStudio.Tests;

using Cove.Core.Auth;
using Cove.Core.Entities;
using Microsoft.EntityFrameworkCore;
using Npgsql;
using System.Text.Json;

public sealed class SegmentStudioReviewUnionServiceTests
{
    [Fact]
    public async Task UnionTreatsNativeAsApprovedAndCountsAuthorizedDraftsExactly()
    {
        await using var fixture = await ReviewUnionFixture.CreateAsync();

        var (result, error) = await SegmentStudioReviewUnionService.SearchAuthorizedAsync(
            fixture.Context,
            new ReviewUnionRequest(ReviewStates: ["approved"], Page: 1, PerPage: 20),
            CovePrincipal.System(),
            new HideVideoAuthorization(fixture.HiddenVideoId),
            CancellationToken.None);

        Assert.Null(error);
        Assert.NotNull(result);
        Assert.Equal(new ReviewUnionCounts(Unreviewed: 1, Approved: 2, Rejected: 1, Unpublished: 3, Total: 4), result.Counts);
        Assert.Equal(2, result.Total);
        Assert.Collection(result.Items,
            native =>
            {
                Assert.Equal("native", native.Residence);
                Assert.True(native.Published);
                Assert.Equal("approved", native.ReviewState);
                Assert.Equal(fixture.NativeSegmentId, native.NativeSegmentId);
            },
            draft =>
            {
                Assert.Equal("extension", draft.Residence);
                Assert.False(draft.Published);
                Assert.Equal("approved", draft.ReviewState);
                Assert.NotNull(draft.ItemId);
            });
    }

    [Fact]
    public async Task BasicInventoryContainsOnlyPublishedAndRejectedRecords()
    {
        await using var fixture = await ReviewUnionFixture.CreateAsync();

        var (result, error) = await SegmentStudioReviewUnionService.SearchAuthorizedAsync(
            fixture.Context,
            new ReviewUnionRequest(Page: 1, PerPage: 20, BasicInventoryOnly: true),
            CovePrincipal.System(),
            new HideVideoAuthorization(fixture.HiddenVideoId),
            CancellationToken.None);

        Assert.Null(error);
        Assert.NotNull(result);
        Assert.Equal(new ReviewUnionCounts(Unreviewed: 0, Approved: 1, Rejected: 1, Unpublished: 1, Total: 2), result.Counts);
        Assert.Collection(result.Items,
            native => Assert.True(native.Published),
            rejected =>
            {
                Assert.False(rejected.Published);
                Assert.Equal("rejected", rejected.ReviewState);
            });
    }

    [Fact]
    public async Task UnionAppliesSearchOrderingAndPaginationWithoutDuplicatingAnchoredNativeSegment()
    {
        await using var fixture = await ReviewUnionFixture.CreateAsync();

        var (result, error) = await SegmentStudioReviewUnionService.SearchAuthorizedAsync(
            fixture.Context,
            new ReviewUnionRequest(Query: "activity", Sort: "time", Direction: "desc", Page: 2, PerPage: 2),
            CovePrincipal.System(),
            new HideVideoAuthorization(fixture.HiddenVideoId),
            CancellationToken.None);

        Assert.Null(error);
        Assert.NotNull(result);
        Assert.Equal(4, result.Total);
        Assert.Equal(2, result.Items.Count);
        Assert.Equal([4.0, 1.0], result.Items.Select(item => item.StartSec));
        Assert.Equal(result.Items.Count, result.Items.Select(item => item.Key).Distinct().Count());
    }

    [Theory]
    [InlineData("unknown", "asc", "Sort is invalid.")]
    [InlineData("time", "sideways", "Direction is invalid.")]
    public async Task UnionRejectsInvalidOrdering(string sort, string direction, string expectedError)
    {
        await using var fixture = await ReviewUnionFixture.CreateAsync();

        var (result, error) = await SegmentStudioReviewUnionService.SearchAuthorizedAsync(
            fixture.Context,
            new ReviewUnionRequest(Sort: sort, Direction: direction),
            CovePrincipal.System(),
            new HideVideoAuthorization(fixture.HiddenVideoId),
            CancellationToken.None);

        Assert.Null(result);
        Assert.Equal(expectedError, error);
    }

    [Fact]
    public async Task UnionQueryTranslatesAndPaginatesOnPostgreSql()
    {
        var connectionString = Environment.GetEnvironmentVariable("COVE__Postgres__ConnectionString")
            ?? Environment.GetEnvironmentVariable("DATABASE_URL");
        if (string.IsNullOrWhiteSpace(connectionString))
            return;

        var schema = $"segment_studio_union_test_{Guid.NewGuid():N}";
        var builder = new NpgsqlConnectionStringBuilder(connectionString) { SearchPath = schema };
        await using var admin = new NpgsqlConnection(connectionString);
        await admin.OpenAsync();
        await using (var createSchema = new NpgsqlCommand($"CREATE SCHEMA \"{schema}\"", admin))
            await createSchema.ExecuteNonQueryAsync();
        try
        {
            var options = new DbContextOptionsBuilder<ReviewUnionDbContext>()
                .UseNpgsql(builder.ConnectionString).Options;
            await using var context = new ReviewUnionDbContext(options);
            await context.Database.ExecuteSqlRawAsync(context.Database.GenerateCreateScript());
            await ReviewUnionFixture.SeedAsync(context);

            var (result, error) = await SegmentStudioReviewUnionService.SearchAuthorizedAsync(
                context,
                new ReviewUnionRequest(ReviewStates: ["approved"], Page: 1, PerPage: 1),
                CovePrincipal.System(),
                new HideVideoAuthorization(ReviewUnionFixture.HiddenVideo),
                CancellationToken.None);

            Assert.Null(error);
            Assert.NotNull(result);
            Assert.Equal(2, result.Total);
            Assert.Single(result.Items);
            Assert.Equal(new ReviewUnionCounts(1, 2, 1, 3, 4), result.Counts);
        }
        finally
        {
            await using var dropSchema = new NpgsqlCommand($"DROP SCHEMA \"{schema}\" CASCADE", admin);
            await dropSchema.ExecuteNonQueryAsync();
        }
    }

    private sealed class ReviewUnionFixture : IAsyncDisposable
    {
        public const int HiddenVideo = 2;
        public ReviewUnionDbContext Context { get; }
        public int NativeSegmentId => 101;
        public int HiddenVideoId => HiddenVideo;

        private ReviewUnionFixture(ReviewUnionDbContext context) => Context = context;

        public static async Task<ReviewUnionFixture> CreateAsync()
        {
            var options = new DbContextOptionsBuilder<ReviewUnionDbContext>()
                .UseInMemoryDatabase(Guid.NewGuid().ToString()).Options;
            var fixture = new ReviewUnionFixture(new(options));
            await SeedAsync(fixture.Context);
            return fixture;
        }

        public static async Task SeedAsync(ReviewUnionDbContext context)
        {
            var now = new DateTime(2026, 7, 22, 10, 0, 0, DateTimeKind.Utc);
            context.AddRange(
                new Video { Id = 1, Title = "Visible", UpdatedAt = now },
                new Video { Id = HiddenVideo, Title = "Hidden", UpdatedAt = now },
                new Tag { Id = 10, Name = "Activity" },
                new Segment
                {
                    Id = 101, HostType = SegmentHostType.Video, HostId = 1,
                    Kind = "tag", TagId = 10, StartSec = 1, EndSec = 2, SourceKey = "user",
                    CreatedAt = now, UpdatedAt = now,
                },
                new Segment
                {
                    Id = 102, HostType = SegmentHostType.Video, HostId = HiddenVideo,
                    Kind = "tag", TagId = 10, StartSec = 2, EndSec = 3, SourceKey = "user",
                    CreatedAt = now, UpdatedAt = now,
                },
                new SegmentStudioItem { NativeSegmentId = 101, CreatedAt = now, UpdatedAt = now },
                Draft(1, "unreviewed", 4, now),
                Draft(1, "approved", 7, now),
                Draft(1, "rejected", 10, now),
                Draft(HiddenVideo, "approved", 13, now));
            await context.SaveChangesAsync();
            context.ChangeTracker.Clear();
        }

        private static SegmentStudioItem Draft(int videoId, string state, double start, DateTime now) => new()
        {
            ReviewState = state,
            VideoId = videoId,
            StartSec = start,
            EndSec = start + 1,
            TagId = 10,
            Kind = "tag",
            SourceKey = "user",
            Revision = 1,
            CreatedAt = now,
            UpdatedAt = now.AddSeconds(start),
        };

        public async ValueTask DisposeAsync() => await Context.DisposeAsync();
    }

    private sealed class ReviewUnionDbContext(DbContextOptions<ReviewUnionDbContext> options) : DbContext(options)
    {
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Video>(builder => { builder.HasKey(video => video.Id); builder.Ignore(video => video.Studio); builder.Ignore(video => video.ParentVideo); builder.Ignore(video => video.ChildVideos); builder.Ignore(video => video.Urls); builder.Ignore(video => video.Files); builder.Ignore(video => video.VideoTags); builder.Ignore(video => video.VideoPerformers); builder.Ignore(video => video.VideoGalleries); builder.Ignore(video => video.GroupItems); builder.Ignore(video => video.RemoteIds); builder.Ignore(video => video.PlayHistory); });
            modelBuilder.Entity<Tag>(builder => { builder.HasKey(tag => tag.Id); builder.Ignore(tag => tag.TagGroup); builder.Ignore(tag => tag.Aliases); builder.Ignore(tag => tag.ParentRelations); builder.Ignore(tag => tag.ChildRelations); builder.Ignore(tag => tag.RemoteIds); builder.Ignore(tag => tag.VideoTags); builder.Ignore(tag => tag.PerformerTags); builder.Ignore(tag => tag.ImageTags); builder.Ignore(tag => tag.GalleryTags); builder.Ignore(tag => tag.StudioTags); builder.Ignore(tag => tag.GroupTags); });
            modelBuilder.Entity<Segment>(builder => { builder.HasKey(segment => segment.Id); builder.Ignore(segment => segment.Tag); builder.Property(segment => segment.Payload).HasConversion(document => document == null ? null : document.RootElement.GetRawText(), json => json == null ? null : JsonDocument.Parse(json)); });
            modelBuilder.Entity<Performer>(builder => { builder.HasKey(performer => performer.Id); builder.Ignore(performer => performer.Urls); builder.Ignore(performer => performer.Aliases); builder.Ignore(performer => performer.PerformerTags); builder.Ignore(performer => performer.VideoPerformers); builder.Ignore(performer => performer.ImagePerformers); builder.Ignore(performer => performer.GalleryPerformers); builder.Ignore(performer => performer.RemoteIds); });
            SegmentStudioModelConfiguration.Configure(modelBuilder);
        }
    }

    private sealed class HideVideoAuthorization(int hiddenVideoId) : IAuthorizationService
    {
        private AuthorizationResult Result(EntityRef? entity) => entity?.Id == hiddenVideoId.ToString()
            ? AuthorizationResult.Deny("Hidden", Permissions.SegmentsRead)
            : AuthorizationResult.Allow();
        public AuthorizationResult Authorize(CovePrincipal? principal, string permission, EntityRef? entity = null) => Result(entity);
        public Task<AuthorizationResult> AuthorizeAsync(CovePrincipal? principal, string permission, EntityRef? entity, CancellationToken ct) => Task.FromResult(Result(entity));
        public void Require(CovePrincipal? principal, string permission, EntityRef? entity = null) { }
        public bool Has(CovePrincipal? principal, string permission) => true;
    }
}
