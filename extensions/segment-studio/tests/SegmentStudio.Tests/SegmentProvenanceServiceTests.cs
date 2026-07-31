using Microsoft.Data.Sqlite;
using Microsoft.EntityFrameworkCore;
using SegmentStudio;

namespace SegmentStudio.Tests;

public sealed class SegmentProvenanceServiceTests
{
    [Fact]
    public async Task AppendPreservesNullLegacyEvidenceAndReturnsSourceDisplayData()
    {
        await using var fixture = await ProvenanceFixture.CreateAsync();
        var node = await new LineageNodeService().EnsureAsync(fixture.Context, fixture.Item.Id, CancellationToken.None);
        var source = await new SegmentSourceRegistry().RegisterAsync(
            fixture.Context,
            new SegmentSourceRegistration(
                "stash-marker-studio:manual", "SMS Manual", "manual", "SMS", null, null, "{}"),
            CancellationToken.None);

        var assertion = await new SegmentProvenanceService().AppendAsync(
            fixture.Context,
            new SegmentProvenanceAppend(
                node.Id, source.Id, "origin", null, null, null, null, null, null,
                """{"sourceLabel":"Marker Source: Manual"}"""),
            CancellationToken.None);
        var results = await new SegmentProvenanceService().GetForItemAsync(
            fixture.Context, fixture.Item.Id, CancellationToken.None);

        Assert.Null(assertion.Confidence);
        var result = Assert.Single(results);
        Assert.Equal("stash-marker-studio:manual", result.SourceKey);
        Assert.Equal("origin", result.Relation);
        Assert.Null(result.ActivityExternalRunId);
        Assert.Null(result.ModelIdentifier);
    }

    [Fact]
    public async Task AppendIsIdempotentForTheSameActiveEvidence()
    {
        await using var fixture = await ProvenanceFixture.CreateAsync();
        var node = await new LineageNodeService().EnsureAsync(fixture.Context, fixture.Item.Id, CancellationToken.None);
        var source = await new SegmentSourceRegistry().RegisterAsync(
            fixture.Context,
            new SegmentSourceRegistration("user", "User", "manual", "Cove", null, null, "{}"),
            CancellationToken.None);
        var request = new SegmentProvenanceAppend(
            node.Id, source.Id, "origin", null, null, null, null, null, null, "{}");
        var service = new SegmentProvenanceService();

        var first = await service.AppendAsync(fixture.Context, request, CancellationToken.None);
        var second = await service.AppendAsync(fixture.Context, request, CancellationToken.None);

        Assert.Equal(first.Id, second.Id);
        Assert.Single(await fixture.Context.Set<SegmentStudioSegmentProvenance>().ToListAsync());
    }

    [Fact]
    public async Task MultipleSourcesAndRelationsRemainDistinct()
    {
        await using var fixture = await ProvenanceFixture.CreateAsync();
        var node = await new LineageNodeService().EnsureAsync(fixture.Context, fixture.Item.Id, CancellationToken.None);
        var registry = new SegmentSourceRegistry();
        var user = await registry.RegisterAsync(fixture.Context,
            new SegmentSourceRegistration("user", "User", "manual", "Cove", null, null, "{}"),
            CancellationToken.None);
        var imported = await registry.RegisterAsync(fixture.Context,
            new SegmentSourceRegistration("tpdb", "TPDB", "external", "TPDB", null, null, "{}"),
            CancellationToken.None);
        var service = new SegmentProvenanceService();

        await service.AppendAsync(fixture.Context,
            new SegmentProvenanceAppend(node.Id, user.Id, "origin", null, null, null, null, null, null, "{}"),
            CancellationToken.None);
        await service.AppendAsync(fixture.Context,
            new SegmentProvenanceAppend(node.Id, imported.Id, "inherited", null, null, null, null, null, null, "{}"),
            CancellationToken.None);

        var results = await service.GetForItemAsync(fixture.Context, fixture.Item.Id, CancellationToken.None);
        Assert.Equal(["origin", "inherited"], results.Select(result => result.Relation));
    }

    [Fact]
    public async Task ConfidenceAndActivitySourceAreValidated()
    {
        await using var fixture = await ProvenanceFixture.CreateAsync();
        var node = await new LineageNodeService().EnsureAsync(fixture.Context, fixture.Item.Id, CancellationToken.None);
        var registry = new SegmentSourceRegistry();
        var first = await registry.RegisterAsync(fixture.Context,
            new SegmentSourceRegistration("user", "User", "manual", "Cove", null, null, "{}"),
            CancellationToken.None);
        var second = await registry.RegisterAsync(fixture.Context,
            new SegmentSourceRegistration("tpdb", "TPDB", "external", "TPDB", null, null, "{}"),
            CancellationToken.None);
        var activity = await new ProvenanceActivityService().CaptureAsync(
            fixture.Context,
            new ProvenanceActivityCapture(
                Guid.NewGuid(), "import:test", "import", first.Id, null, null,
                null, null, null, null, null, "{}"),
            CancellationToken.None);
        var service = new SegmentProvenanceService();

        await Assert.ThrowsAsync<ArgumentOutOfRangeException>(() => service.AppendAsync(
            fixture.Context,
            new SegmentProvenanceAppend(node.Id, first.Id, "origin", null, null, null, null, 1.1f, null, "{}"),
            CancellationToken.None));
        await Assert.ThrowsAsync<ArgumentException>(() => service.AppendAsync(
            fixture.Context,
            new SegmentProvenanceAppend(node.Id, second.Id, "origin", activity.Id, null, null, null, null, null, "{}"),
            CancellationToken.None));
        await Assert.ThrowsAsync<ArgumentException>(() => service.AppendAsync(
            fixture.Context,
            new SegmentProvenanceAppend(node.Id, first.Id, "origin", null, null, null, null, null, null, null!),
            CancellationToken.None));
    }

    [Fact]
    public async Task ActivityCaptureIsIdempotentByStableKey()
    {
        await using var fixture = await ProvenanceFixture.CreateAsync();
        var source = await new SegmentSourceRegistry().RegisterAsync(fixture.Context,
            new SegmentSourceRegistration("user", "User", "manual", "Cove", null, null, "{}"),
            CancellationToken.None);
        var request = new ProvenanceActivityCapture(
            Guid.NewGuid(), "manual:test", "manual", source.Id, null, null,
            null, null, null, null, null, "{}");
        var service = new ProvenanceActivityService();

        var first = await service.CaptureAsync(fixture.Context, request, CancellationToken.None);
        var second = await service.CaptureAsync(fixture.Context, request with { Id = Guid.NewGuid() }, CancellationToken.None);

        Assert.Equal(first.Id, second.Id);
        Assert.Single(await fixture.Context.Set<SegmentStudioProvenanceActivity>().ToListAsync());
    }

    [Fact]
    public async Task LineageNodeRemainsStableAndRefreshesWhenItemRepresentationChanges()
    {
        await using var fixture = await ProvenanceFixture.CreateAsync();
        var service = new LineageNodeService();
        var first = await service.EnsureAsync(fixture.Context, fixture.Item.Id, CancellationToken.None);
        fixture.Context.Add(new Cove.Core.Entities.Segment
        {
            Id = 42,
            HostType = Cove.Core.Entities.SegmentHostType.Video,
            HostId = 9,
            TagId = 13,
            StartSec = 4,
            EndSec = 5,
            SourceKey = "user",
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow,
        });
        fixture.Item.NativeSegmentId = 42;
        fixture.Item.VideoId = null;
        fixture.Item.TagId = null;
        fixture.Item.StartSec = null;
        fixture.Item.EndSec = null;
        fixture.Item.ReviewState = null;
        fixture.Item.Kind = null;
        fixture.Item.SourceKey = null;
        await fixture.Context.SaveChangesAsync();

        var second = await service.EnsureAsync(fixture.Context, fixture.Item.Id, CancellationToken.None);

        Assert.Equal(first.Id, second.Id);
        Assert.Equal(9, second.LastKnownVideoId);
        Assert.Equal(13, second.LastKnownTagId);
        Assert.Equal(4, second.LastKnownStartSec);
    }

    private sealed class ProvenanceFixture : IAsyncDisposable
    {
        private readonly SqliteConnection _connection;

        private ProvenanceFixture(SqliteConnection connection, ProvenanceDbContext context, SegmentStudioItem item)
        {
            _connection = connection;
            Context = context;
            Item = item;
        }

        public ProvenanceDbContext Context { get; }
        public SegmentStudioItem Item { get; }

        public static async Task<ProvenanceFixture> CreateAsync()
        {
            var connection = new SqliteConnection("Data Source=:memory:");
            await connection.OpenAsync();
            var options = new DbContextOptionsBuilder<ProvenanceDbContext>().UseSqlite(connection).Options;
            var context = new ProvenanceDbContext(options);
            await context.Database.EnsureCreatedAsync();
            var item = new SegmentStudioItem
            {
                VideoId = 7,
                TagId = 11,
                StartSec = 1.5,
                EndSec = 2.5,
                ReviewState = "unreviewed",
                Kind = "tag",
                SourceKey = "user",
                Revision = 1,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow,
            };
            context.Add(item);
            await context.SaveChangesAsync();
            return new ProvenanceFixture(connection, context, item);
        }

        public async ValueTask DisposeAsync()
        {
            await Context.DisposeAsync();
            await _connection.DisposeAsync();
        }
    }

    private sealed class ProvenanceDbContext(DbContextOptions<ProvenanceDbContext> options) : DbContext(options)
    {
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<SegmentStudioItem>().HasKey(item => item.Id);
            modelBuilder.Entity<SegmentStudioItem>().Ignore(item => item.Slots);
            modelBuilder.Entity<SegmentStudioSource>().HasKey(source => source.Id);
            modelBuilder.Entity<SegmentStudioProvenanceActivity>().HasKey(activity => activity.Id);
            modelBuilder.Entity<SegmentStudioLineageNode>().HasKey(node => node.Id);
            modelBuilder.Entity<SegmentStudioLineageNode>().HasIndex(node => node.ItemId).IsUnique();
            modelBuilder.Entity<SegmentStudioSegmentProvenance>().HasKey(assertion => assertion.Id);
            modelBuilder.Entity<SegmentStudioDerivationEdge>().HasKey(edge => edge.Id);
            modelBuilder.Entity<Cove.Core.Entities.Segment>(builder =>
            {
                builder.HasKey(segment => segment.Id);
                builder.Ignore(segment => segment.Payload);
                builder.Ignore(segment => segment.Tag);
            });
        }
    }
}
