namespace SegmentStudio.Tests;

using Cove.Core.Entities;
using Microsoft.Data.Sqlite;
using Microsoft.EntityFrameworkCore;

public sealed class SegmentGroupServiceTests
{
    [Fact]
    public async Task StableItemModelMapsNativeAndOwnedReferenceDeleteBehavior()
    {
        await using var fixture = await SegmentGroupFixture.CreateAsync();

        var item = fixture.Context.Model.FindEntityType(typeof(SegmentStudioItem));
        Assert.NotNull(item);
        var foreignKeys = item.GetForeignKeys().ToDictionary(
            foreignKey => Assert.Single(foreignKey.Properties).Name,
            foreignKey => foreignKey);

        Assert.Equal(DeleteBehavior.Cascade, foreignKeys[nameof(SegmentStudioItem.NativeSegmentId)].DeleteBehavior);
        Assert.Equal(typeof(Segment), foreignKeys[nameof(SegmentStudioItem.NativeSegmentId)].PrincipalEntityType.ClrType);
        Assert.Equal(DeleteBehavior.Cascade, foreignKeys[nameof(SegmentStudioItem.VideoId)].DeleteBehavior);
        Assert.Equal(typeof(Video), foreignKeys[nameof(SegmentStudioItem.VideoId)].PrincipalEntityType.ClrType);
        Assert.Equal(DeleteBehavior.Restrict, foreignKeys[nameof(SegmentStudioItem.TagId)].DeleteBehavior);
        Assert.Equal(typeof(Tag), foreignKeys[nameof(SegmentStudioItem.TagId)].PrincipalEntityType.ClrType);
    }

    [Fact]
    public async Task OwnershipTransitionUpdatesItemBeforeDeletingTrackedNativeSegment()
    {
        await using var connection = new SqliteConnection("Data Source=:memory:");
        await connection.OpenAsync();
        var options = new DbContextOptionsBuilder<SegmentGroupDbContext>().UseSqlite(connection).Options;
        await using var db = new SegmentGroupDbContext(options);
        await db.Database.EnsureCreatedAsync();
        var segment = new Segment
        {
            Id = 500,
            HostType = SegmentHostType.Video,
            HostId = 100,
            StartSec = 1,
            TagId = 200,
            Kind = "tag",
            SourceKey = "user",
        };
        var item = new SegmentStudioItem
        {
            NativeSegmentId = segment.Id,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow,
        };
        db.AddRange(new Video { Id = 100 }, new Tag { Id = 200, Name = "Activity" }, segment, item);
        await db.SaveChangesAsync();

        item.NativeSegmentId = null;
        item.ReviewState = "rejected";
        item.VideoId = 100;
        item.StartSec = 1;
        item.TagId = 200;
        item.Kind = "tag";
        item.SourceKey = "user";
        item.UpdatedAt = DateTime.UtcNow;
        db.Remove(segment);
        await db.SaveChangesAsync();

        db.ChangeTracker.Clear();
        var restored = Assert.Single(await db.Set<SegmentStudioItem>().ToListAsync());
        Assert.Null(restored.NativeSegmentId);
        Assert.Equal("rejected", restored.ReviewState);
    }

    [Fact]
    public async Task ListingPreservesNewlyCreatedEmptyGroups()
    {
        await using var fixture = await SegmentGroupFixture.CreateAsync();

        var created = await SegmentGroupService.CreateAsync(fixture.Context, "Empty", CancellationToken.None);

        var listed = Assert.Single(await SegmentGroupService.ListAsync(fixture.Context, CancellationToken.None));
        Assert.Equal(created.Id, listed.Id);
        Assert.Empty(listed.Tags);
    }

    [Fact]
    public async Task SuccessfulMutationsWriteReceiptsWhileRejectedOrMissingMutationsDoNot()
    {
        await using var fixture = await SegmentGroupFixture.CreateAsync();

        var created = await SegmentGroupService.CreateAsync(fixture.Context, "Review", CancellationToken.None);
        Assert.Equal(1, await fixture.Context.Set<SegmentStudioSegmentGroupOperation>().CountAsync());

        var rejected = await SegmentGroupService.ReorderAsync(fixture.Context, [created.Id + 1], CancellationToken.None);
        Assert.Equal(SegmentGroupMutationStatus.Invalid, rejected.Status);
        Assert.False(await SegmentGroupService.DeleteAsync(fixture.Context, created.Id + 1, CancellationToken.None));

        Assert.Equal(1, await fixture.Context.Set<SegmentStudioSegmentGroupOperation>().CountAsync());
    }

    [Fact]
    public async Task EditorListingReturnsOnlyGroupsAndMembershipsForVisibleTags()
    {
        await using var fixture = await SegmentGroupFixture.CreateAsync();
        var visible = await SegmentGroupService.CreateAsync(fixture.Context, "Visible", CancellationToken.None);
        var unrelated = await SegmentGroupService.CreateAsync(fixture.Context, "Unrelated", CancellationToken.None);
        var empty = await SegmentGroupService.CreateAsync(fixture.Context, "Empty", CancellationToken.None);
        await SegmentGroupService.UpdateAsync(
            fixture.Context, visible.Id, new SegmentGroupUpdateRequest("Visible", [11, 12]), CancellationToken.None);
        await SegmentGroupService.UpdateAsync(
            fixture.Context, unrelated.Id, new SegmentGroupUpdateRequest("Unrelated", [13]), CancellationToken.None);

        var groups = await SegmentGroupService.ListForTagsAsync(fixture.Context, [12], CancellationToken.None);

        var group = Assert.Single(groups);
        Assert.Equal(visible.Id, group.Id);
        var membership = Assert.Single(group.Tags);
        Assert.Equal(12, membership.TagId);
        Assert.Null(membership.TagName);
        Assert.DoesNotContain(groups, candidate => candidate.Id == unrelated.Id || candidate.Id == empty.Id);
    }

    [Fact]
    public async Task ReplacingMembersPreservesExplicitOrderAndMovesTagsBetweenGroups()
    {
        await using var fixture = await SegmentGroupFixture.CreateAsync();

        var first = await SegmentGroupService.CreateAsync(fixture.Context, "First", CancellationToken.None);
        var second = await SegmentGroupService.CreateAsync(fixture.Context, "Second", CancellationToken.None);
        await SegmentGroupService.UpdateAsync(fixture.Context, first.Id, new SegmentGroupUpdateRequest("First", [11, 12]), CancellationToken.None);
        await SegmentGroupService.UpdateAsync(fixture.Context, second.Id, new SegmentGroupUpdateRequest("Second", [12, 13]), CancellationToken.None);

        var groups = await SegmentGroupService.ListAsync(fixture.Context, CancellationToken.None);
        Assert.Equal([11], groups.Single(group => group.Id == first.Id).Tags.Select(tag => tag.TagId));
        Assert.Equal([12, 13], groups.Single(group => group.Id == second.Id).Tags.Select(tag => tag.TagId));
    }

    [Fact]
    public async Task InvalidTagReplacementDoesNotPartiallyMutateAGroup()
    {
        await using var fixture = await SegmentGroupFixture.CreateAsync();
        var group = await SegmentGroupService.CreateAsync(fixture.Context, "Review", CancellationToken.None);
        await SegmentGroupService.UpdateAsync(fixture.Context, group.Id, new SegmentGroupUpdateRequest("Review", [11, 12]), CancellationToken.None);

        var result = await SegmentGroupService.UpdateAsync(fixture.Context, group.Id, new SegmentGroupUpdateRequest("Changed", [12, 999]), CancellationToken.None);

        Assert.Equal(SegmentGroupMutationStatus.Invalid, result.Status);
        var persisted = Assert.Single(await SegmentGroupService.ListAsync(fixture.Context, CancellationToken.None));
        Assert.Equal("Review", persisted.Name);
        Assert.Equal([11, 12], persisted.Tags.Select(tag => tag.TagId));
    }

    [Fact]
    public async Task ReorderingRequiresEveryGroupExactlyOnce()
    {
        await using var fixture = await SegmentGroupFixture.CreateAsync();
        var first = await SegmentGroupService.CreateAsync(fixture.Context, "First", CancellationToken.None);
        var second = await SegmentGroupService.CreateAsync(fixture.Context, "Second", CancellationToken.None);

        var invalid = await SegmentGroupService.ReorderAsync(fixture.Context, [second.Id], CancellationToken.None);
        Assert.Equal(SegmentGroupMutationStatus.Invalid, invalid.Status);

        var reordered = await SegmentGroupService.ReorderAsync(fixture.Context, [second.Id, first.Id], CancellationToken.None);
        Assert.Equal(SegmentGroupMutationStatus.Updated, reordered.Status);
        Assert.Equal([second.Id, first.Id], (await SegmentGroupService.ListAsync(fixture.Context, CancellationToken.None)).Select(group => group.Id));
    }

    [Fact]
    public async Task SegmentGroupChangesNeverMutateTags()
    {
        await using var fixture = await SegmentGroupFixture.CreateAsync();
        var before = await fixture.Context.Set<Tag>().AsNoTracking()
            .OrderBy(tag => tag.Id)
            .Select(tag => new { tag.Id, tag.Name, tag.TagGroupId })
            .ToListAsync();

        var group = await SegmentGroupService.CreateAsync(fixture.Context, "Review", CancellationToken.None);
        await SegmentGroupService.UpdateAsync(fixture.Context, group.Id, new SegmentGroupUpdateRequest("Renamed", [13, 11]), CancellationToken.None);
        _ = await SegmentGroupService.ListAsync(fixture.Context, CancellationToken.None);

        var after = await fixture.Context.Set<Tag>().AsNoTracking()
            .OrderBy(tag => tag.Id)
            .Select(tag => new { tag.Id, tag.Name, tag.TagGroupId })
            .ToListAsync();
        Assert.Equal(before, after);
    }

    [Fact]
    public async Task ReorderingNormalizesGapsLeftByDeletion()
    {
        await using var fixture = await SegmentGroupFixture.CreateAsync();
        var first = await SegmentGroupService.CreateAsync(fixture.Context, "First", CancellationToken.None);
        var removed = await SegmentGroupService.CreateAsync(fixture.Context, "Removed", CancellationToken.None);
        var third = await SegmentGroupService.CreateAsync(fixture.Context, "Third", CancellationToken.None);
        Assert.True(await SegmentGroupService.DeleteAsync(fixture.Context, removed.Id, CancellationToken.None));

        var result = await SegmentGroupService.ReorderAsync(fixture.Context, [third.Id, first.Id], CancellationToken.None);

        Assert.Equal(SegmentGroupMutationStatus.Updated, result.Status);
        var groups = await SegmentGroupService.ListAsync(fixture.Context, CancellationToken.None);
        Assert.Equal([third.Id, first.Id], groups.Select(group => group.Id));
        Assert.Equal([0, 1], groups.Select(group => group.SortOrder));
    }

    private sealed class SegmentGroupFixture : IAsyncDisposable
    {
        public SegmentGroupDbContext Context { get; }

        private SegmentGroupFixture(SegmentGroupDbContext context) => Context = context;

        public static async Task<SegmentGroupFixture> CreateAsync()
        {
            var options = new DbContextOptionsBuilder<SegmentGroupDbContext>()
                .UseInMemoryDatabase(Guid.NewGuid().ToString())
                .Options;
            var context = new SegmentGroupDbContext(options);
            context.AddRange(
                new Tag { Id = 11, Name = "Alpha" },
                new Tag { Id = 12, Name = "Beta" },
                new Tag { Id = 13, Name = "Gamma" });
            await context.SaveChangesAsync();
            return new SegmentGroupFixture(context);
        }

        public async ValueTask DisposeAsync() => await Context.DisposeAsync();
    }

    private sealed class SegmentGroupDbContext(DbContextOptions<SegmentGroupDbContext> options) : DbContext(options)
    {
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Tag>(builder =>
            {
                builder.HasKey(tag => tag.Id);
                builder.Ignore(tag => tag.TagGroup);
                builder.Ignore(tag => tag.Aliases);
                builder.Ignore(tag => tag.ParentRelations);
                builder.Ignore(tag => tag.ChildRelations);
                builder.Ignore(tag => tag.RemoteIds);
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
                    document => document == null ? null : document.RootElement.GetRawText(),
                    json => json == null ? null : System.Text.Json.JsonDocument.Parse(json));
            });
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
            modelBuilder.Entity<Performer>(builder =>
            {
                builder.HasKey(performer => performer.Id);
                builder.Ignore(performer => performer.Urls);
                builder.Ignore(performer => performer.Aliases);
                builder.Ignore(performer => performer.PerformerTags);
                builder.Ignore(performer => performer.VideoPerformers);
                builder.Ignore(performer => performer.ImagePerformers);
                builder.Ignore(performer => performer.GalleryPerformers);
                builder.Ignore(performer => performer.RemoteIds);
            });
            SegmentStudioModelConfiguration.Configure(modelBuilder);
        }
    }
}
