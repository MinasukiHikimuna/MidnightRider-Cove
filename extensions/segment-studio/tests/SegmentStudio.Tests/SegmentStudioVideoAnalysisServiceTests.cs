namespace SegmentStudio.Tests;

using System.Net;
using System.Text.Json;
using Cove.Core.Entities;
using Microsoft.EntityFrameworkCore;

public sealed class SegmentStudioVideoAnalysisServiceTests
{
    [Fact]
    public void PersistenceTransactionIsWrappedInExecutionStrategy()
    {
        var source = File.ReadAllText(Path.Combine(
            AppContext.BaseDirectory, "..", "..", "..", "..", "..",
            "src", "SegmentStudio", "SegmentStudioVideoAnalysisService.cs"));

        var strategy = source.IndexOf("db.Database.CreateExecutionStrategy()", StringComparison.Ordinal);
        var execute = source.IndexOf("strategy.ExecuteAsync", strategy, StringComparison.Ordinal);
        var transaction = source.IndexOf("BeginTransactionAsync", execute, StringComparison.Ordinal);

        Assert.True(strategy >= 0);
        Assert.True(execute > strategy);
        Assert.True(transaction > execute);
    }

    [Fact]
    public async Task ChildVideoUsesItsParentVideoFile()
    {
        await using var db = CreateContext();
        db.Add(new Video { Id = 7 });
        db.Add(new Video { Id = 8, ParentVideoId = 7 });
        db.Add(new VideoFile { Id = 10, VideoId = 7, Path = "/mnt/media/source.mp4" });
        await db.SaveChangesAsync();
        var client = new FakeClient(Response() with { Ai = null, OmniShotCut = null });
        var service = CreateService(client);

        var run = await service.CreateRunAsync(
            db, 8, new([SegmentStudioAnalysisKind.AiTagging]), default);
        await service.ExecuteRunAsync(
            db, run.Id, new([SegmentStudioAnalysisKind.AiTagging]), default);

        Assert.Equal(10, run.VideoFileId);
        Assert.Equal("/mnt/media/source.mp4", client.Request!.SourcePath);
    }

    [Fact]
    public async Task ExecuteRunStoresCandidatesDraftsAndOmniShotCutBoundaries()
    {
        await using var db = CreateContext();
        db.Add(new Video { Id = 7 });
        db.Add(new VideoFile { Id = 10, VideoId = 7, Path = "/mnt/media/source.mp4" });
        db.Add(new Tag { Id = 20, Name = "Example tag" });
        await db.SaveChangesAsync();
        var client = new FakeClient(Response());
        var service = CreateService(client);

        var run = await service.CreateRunAsync(db, 7, new(), default);
        await service.ExecuteRunAsync(db, run.Id, new(), default);

        var savedRun = await db.Set<SegmentStudioAnalysisRun>().SingleAsync();
        Assert.Equal("completed", savedRun.Status);
        Assert.Equal("/mnt/media/source.mp4", client.Request!.SourcePath);
        Assert.NotNull(Assert.Single(
            await db.Set<SegmentStudioAnalysisCandidate>().ToListAsync()).ItemId);
        var draft = Assert.Single(await db.Set<SegmentStudioItem>().ToListAsync());
        Assert.Equal("unreviewed", draft.ReviewState);
        Assert.Equal(20, draft.TagId);
        Assert.Equal("ext:ai.tagging", draft.SourceKey);
        Assert.Equal("Cove AI Tagging",
            Assert.Single(await db.Set<SegmentStudioSource>().ToListAsync()).DisplayName);
        var activity = Assert.Single(await db.Set<SegmentStudioProvenanceActivity>().ToListAsync());
        Assert.Equal("ai-analysis", activity.Kind);
        var assertion = Assert.Single(await db.Set<SegmentStudioSegmentProvenance>().ToListAsync());
        Assert.Equal("Example tag", assertion.ModelKey);
        Assert.Equal("1", assertion.ModelIdentifier);
        Assert.Equal("1", assertion.ModelVersion);
        Assert.Equal(0.8f, assertion.Confidence);
        Assert.Contains("observationCount", assertion.MetadataJson);
        Assert.Equal(2, await db.Set<SegmentStudioShotBoundary>().CountAsync());
        Assert.All(await db.Set<SegmentStudioShotBoundary>().ToListAsync(),
            boundary => Assert.Equal("omnishotcut", boundary.Source));
    }

    [Fact]
    public async Task BasicRunCreatesIdempotentNativeSegmentsWithoutReviewOrShots()
    {
        await using var db = CreateContext();
        db.Add(new Video { Id = 7 });
        db.Add(new VideoFile {
            Id = 10, VideoId = 7, Path = "/mnt/media/source.mp4",
        });
        db.Add(new Tag { Id = 20, Name = "Example tag" });
        await db.SaveChangesAsync();
        var client = new FakeClient(Response());
        var service = CreateService(client);

        var first = await service.CreateRunAsync(
            db, 7, new(), SegmentStudioModes.Basic, default);
        await service.ExecuteRunAsync(
            db, first.Id, new(), SegmentStudioModes.Basic, default);
        var second = await service.CreateRunAsync(
            db, 7, new(), SegmentStudioModes.Basic, default);
        await service.ExecuteRunAsync(
            db, second.Id, new(), SegmentStudioModes.Basic, default);
        await service.ExecuteRunAsync(
            db, second.Id, new(), SegmentStudioModes.Basic, default);

        Assert.Equal(
            [SegmentStudioAnalysisKind.AiTagging],
            client.Request!.Analyses);
        var native = Assert.Single(await db.Set<Segment>().ToListAsync());
        Assert.Equal(7, native.HostId);
        Assert.Equal(20, native.TagId);
        Assert.Equal("ext:ai.tagging", native.SourceKey);
        Assert.Equal(second.Id.ToString(), native.SourceRunId);
        var fieldEvidence = await db.Set<FieldProvenance>()
            .Where(row =>
                row.HostType == AffinityHostType.Segment
                && row.HostId == native.Id)
            .ToListAsync();
        Assert.Equal(10, fieldEvidence.Count);
        Assert.All(
            fieldEvidence,
            row => Assert.Equal("model", row.ModelKey));
        Assert.Equal(
            new[] { first.Id.ToString(), second.Id.ToString() }
                .Order()
                .ToArray(),
            fieldEvidence
                .Select(row => row.SourceRunId)
                .Distinct()
                .Order()
                .ToArray());
        Assert.Empty(await db.Set<SegmentStudioItem>().ToListAsync());
        Assert.Empty(await db.Set<SegmentStudioAnalysisCandidate>().ToListAsync());
        Assert.Empty(await db.Set<SegmentStudioShotBoundary>().ToListAsync());
    }

    [Fact]
    public void BasicAnalysisRejectsShotBoundaryRequests()
    {
        var exception = Assert.Throws<ArgumentException>(() =>
            SegmentStudioVideoAnalysisService.NormalizeAnalyses(
                [SegmentStudioAnalysisKind.OmniShotCut],
                SegmentStudioModes.Basic));

        Assert.Contains("unavailable in Basic mode", exception.Message);
    }

    [Fact]
    public async Task RepeatedRunReusesMatchingDraftsAndPreservesExistingBoundaries()
    {
        await using var db = CreateContext();
        db.Add(new Video { Id = 7 });
        db.Add(new VideoFile { Id = 10, VideoId = 7, Path = "/mnt/media/source.mp4" });
        db.Add(new Tag { Id = 20, Name = "Example tag" });
        await db.SaveChangesAsync();
        var service = CreateService(new FakeClient(Response()));

        var first = await service.CreateRunAsync(db, 7, new(), default);
        await service.ExecuteRunAsync(db, first.Id, new(), default);
        var boundaryIds = await db.Set<SegmentStudioShotBoundary>()
            .OrderBy(boundary => boundary.Id)
            .Select(boundary => boundary.Id)
            .ToArrayAsync();

        var second = await service.CreateRunAsync(db, 7, new(), default);
        await service.ExecuteRunAsync(db, second.Id, new(), default);

        Assert.Single(await db.Set<SegmentStudioItem>().ToListAsync());
        var candidates = await db.Set<SegmentStudioAnalysisCandidate>()
            .OrderBy(candidate => candidate.CreatedAt)
            .ToListAsync();
        Assert.Equal(2, candidates.Count);
        Assert.Equal(candidates[0].ItemId, candidates[1].ItemId);
        Assert.Equal(boundaryIds, await db.Set<SegmentStudioShotBoundary>()
            .OrderBy(boundary => boundary.Id)
            .Select(boundary => boundary.Id)
            .ToArrayAsync());
    }

    [Fact]
    public async Task MatchingManualDraftIsReusedWithoutChangingItsSource()
    {
        await using var db = CreateContext();
        var now = DateTime.UtcNow;
        db.Add(new Video { Id = 7 });
        db.Add(new VideoFile { Id = 10, VideoId = 7, Path = "/mnt/media/source.mp4" });
        db.Add(new Tag { Id = 20, Name = "Example tag" });
        db.Add(new SegmentStudioItem
        {
            VideoId = 7, TagId = 20, StartSec = 1, EndSec = 4, Kind = "tag",
            Title = "Example", ReviewState = "approved", SourceKey = "user",
            Revision = 1, CreatedAt = now, UpdatedAt = now,
        });
        await db.SaveChangesAsync();
        var service = CreateService(new FakeClient(Response()));

        var run = await service.CreateRunAsync(db, 7, new(), default);
        await service.ExecuteRunAsync(db, run.Id, new(), default);

        var item = Assert.Single(await db.Set<SegmentStudioItem>().ToListAsync());
        Assert.Equal("user", item.SourceKey);
        Assert.Equal("approved", item.ReviewState);
        Assert.Equal(item.Id,
            Assert.Single(await db.Set<SegmentStudioAnalysisCandidate>().ToListAsync()).ItemId);
    }

    [Fact]
    public async Task ExecuteRunStoresSanitizedFailure()
    {
        await using var db = CreateContext();
        db.Add(new Video { Id = 7 });
        db.Add(new VideoFile { Id = 10, VideoId = 7, Path = "/mnt/media/source.mp4" });
        await db.SaveChangesAsync();
        var service = CreateService(new FakeClient(
            new SegmentStudioAnalysisServiceException(
                HttpStatusCode.ServiceUnavailable, "gpu_busy", "Analysis service is busy.", true)));
        var run = await service.CreateRunAsync(
            db, 7, new([SegmentStudioAnalysisKind.OmniShotCut]), default);

        await Assert.ThrowsAsync<SegmentStudioAnalysisServiceException>(
            () => service.ExecuteRunAsync(
                db, run.Id, new([SegmentStudioAnalysisKind.OmniShotCut]), default));

        var savedRun = await db.Set<SegmentStudioAnalysisRun>().SingleAsync();
        Assert.Equal("failed", savedRun.Status);
        Assert.Equal("gpu_busy", savedRun.ErrorCode);
        Assert.Equal("Analysis service is busy.", savedRun.ErrorMessage);
    }

    [Fact]
    public async Task BackfillLinksExistingDraftAndRestoresDetailedProvenance()
    {
        await using var db = CreateContext();
        db.Add(new Video { Id = 7 });
        db.Add(new VideoFile { Id = 10, VideoId = 7, Path = "/mnt/media/source.mp4" });
        db.Add(new Tag { Id = 20, Name = "Example tag" });
        await db.SaveChangesAsync();
        var service = CreateService(new FakeClient(Response()));
        var run = await service.CreateRunAsync(db, 7, new(), default);
        await service.ExecuteRunAsync(db, run.Id, new(), default);

        db.RemoveRange(await db.Set<SegmentStudioSegmentProvenance>().ToListAsync());
        db.RemoveRange(await db.Set<SegmentStudioLineageNode>().ToListAsync());
        db.RemoveRange(await db.Set<SegmentStudioProvenanceActivity>().ToListAsync());
        var candidate = await db.Set<SegmentStudioAnalysisCandidate>().SingleAsync();
        candidate.ItemId = null;
        candidate.Item = null;
        await db.SaveChangesAsync();

        var count = await service.BackfillProvenanceAsync(db, run.Id, default);

        Assert.Equal(1, count);
        Assert.NotNull((await db.Set<SegmentStudioAnalysisCandidate>().SingleAsync()).ItemId);
        Assert.Single(await db.Set<SegmentStudioLineageNode>().ToListAsync());
        Assert.Single(await db.Set<SegmentStudioProvenanceActivity>().ToListAsync());
        Assert.Single(await db.Set<SegmentStudioSegmentProvenance>().ToListAsync());
    }

    private static AnalysisDbContext CreateContext() => new(
        new DbContextOptionsBuilder<AnalysisDbContext>()
            .UseInMemoryDatabase(Guid.NewGuid().ToString()).Options);

    private static SegmentStudioVideoAnalysisService CreateService(
        ISegmentStudioAnalysisClient client) => new(
        client,
        new SegmentStudioAnalysisProvenanceService(
            new SegmentSourceRegistry(),
            new ProvenanceActivityService(),
            new LineageNodeService(),
            new SegmentProvenanceService()));

    private static SegmentStudioAnalyzeVideoResponse Response() => new(
        "1",
        Guid.NewGuid(),
        Guid.NewGuid(),
        "0.1.0",
        "completed",
        new("fingerprint", 100, 200, 10, 25, 1280, 720, 250),
        new("cache", "v1", null, null),
        new(
            [new("model", "Model", 1, JsonDocument.Parse("\"1\"").RootElement, ["Example tag"])],
            2,
            [new("candidate-1", "tag", "Example tag", "Example", 1, 4, .8, "Example tag", 2)]),
        new(
            "revision",
            "clean_shot",
            [new(0, 5, "cut"), new(5, 10, null)],
            new Dictionary<string, IReadOnlyDictionary<string, int>>()),
        new(1, 2, 3, 4, 10),
        []);

    private sealed class FakeClient : ISegmentStudioAnalysisClient
    {
        private readonly SegmentStudioAnalyzeVideoResponse? _response;
        private readonly Exception? _exception;

        public FakeClient(SegmentStudioAnalyzeVideoResponse response) => _response = response;
        public FakeClient(Exception exception) => _exception = exception;
        public SegmentStudioAnalyzeVideoRequest? Request { get; private set; }

        public Task<SegmentStudioAnalysisReadyResponse> ReadyAsync(CancellationToken ct = default) =>
            throw new NotSupportedException();
        public Task<IReadOnlyList<SegmentStudioAnalysisCatalogModel>> GetCatalogAsync(CancellationToken ct = default) =>
            throw new NotSupportedException();
        public Task<SegmentStudioAnalyzeVideoResponse> AnalyzeVideoAsync(
            SegmentStudioAnalyzeVideoRequest request, CancellationToken ct = default)
        {
            Request = request;
            return _exception is not null
                ? Task.FromException<SegmentStudioAnalyzeVideoResponse>(_exception)
                : Task.FromResult(_response!);
        }
    }

    private sealed class AnalysisDbContext(DbContextOptions<AnalysisDbContext> options) : DbContext(options)
    {
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<BaseFileEntity>().HasKey(file => file.Id);
            modelBuilder.Entity<BaseFileEntity>().HasDiscriminator<string>("FileType")
                .HasValue<BaseFileEntity>("Base")
                .HasValue<VideoFile>("Video");
            modelBuilder.Entity<BaseFileEntity>().Ignore(file => file.ParentFolder);
            modelBuilder.Entity<BaseFileEntity>().Ignore(file => file.Fingerprints);
            modelBuilder.Entity<VideoFile>().Ignore(file => file.Video);
            modelBuilder.Entity<VideoFile>().Ignore(file => file.Captions);
            modelBuilder.Entity<Video>(builder =>
            {
                builder.HasKey(video => video.Id);
                builder.Ignore(video => video.Studio);
                builder.Ignore(video => video.ParentVideo);
                builder.Ignore(video => video.ChildVideos);
                builder.Ignore(video => video.Urls);
                builder.Ignore(video => video.Files);
                builder.Ignore(video => video.VideoTags);
                builder.Ignore(video => video.VideoPerformers);
                builder.Ignore(video => video.VideoGalleries);
                builder.Ignore(video => video.GroupItems);
                builder.Ignore(video => video.RemoteIds);
                builder.Ignore(video => video.PlayHistory);
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
            modelBuilder.Entity<Segment>(builder =>
            {
                builder.HasKey(segment => segment.Id);
                builder.Ignore(segment => segment.Tag);
                builder.Property(segment => segment.Payload).HasConversion(
                    document => document == null
                        ? null
                        : document.RootElement.GetRawText(),
                    json => json == null
                        ? null
                        : JsonDocument.Parse(json));
            });
            modelBuilder.Entity<FieldProvenance>()
                .HasKey(row => row.Id);
            modelBuilder.Entity<SegmentStudioAnalysisRun>().HasKey(run => run.Id);
            modelBuilder.Entity<SegmentStudioAnalysisCandidate>().HasKey(candidate => candidate.Id);
            modelBuilder.Entity<SegmentStudioAnalysisCandidate>().Ignore(candidate => candidate.Run);
            modelBuilder.Entity<SegmentStudioItem>(builder =>
            {
                builder.HasKey(item => item.Id);
                builder.Ignore(item => item.Slots);
            });
            modelBuilder.Entity<SegmentStudioShotBoundary>().HasKey(boundary => boundary.Id);
            modelBuilder.Entity<SegmentStudioSource>(builder =>
            {
                builder.HasKey(source => source.Id);
                builder.HasIndex(source => source.Key).IsUnique();
            });
            modelBuilder.Entity<SegmentStudioProvenanceActivity>(builder =>
            {
                builder.HasKey(activity => activity.Id);
                builder.HasIndex(activity => activity.Key).IsUnique();
            });
            modelBuilder.Entity<SegmentStudioLineageNode>(builder =>
            {
                builder.HasKey(node => node.Id);
                builder.HasIndex(node => node.ItemId).IsUnique();
            });
            modelBuilder.Entity<SegmentStudioSegmentProvenance>(
                builder => builder.HasKey(assertion => assertion.Id));
            modelBuilder.Entity<SegmentStudioDerivationEdge>(
                builder => builder.HasKey(edge => edge.Id));
        }
    }
}
