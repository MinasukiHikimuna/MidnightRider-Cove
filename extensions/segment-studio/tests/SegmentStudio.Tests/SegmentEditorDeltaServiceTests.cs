namespace SegmentStudio.Tests;

using Cove.Core.Entities;
using Microsoft.Data.Sqlite;
using Microsoft.EntityFrameworkCore;

public sealed class SegmentEditorDeltaServiceTests
{
    private static readonly DateTime Now = new(2026, 10, 16, 12, 0, 0, DateTimeKind.Utc);
    private static readonly Guid SetId = Guid.Parse("10000000-0000-0000-0000-000000000001");
    private static readonly Guid SlotId = Guid.Parse("20000000-0000-0000-0000-000000000001");

    [Fact]
    public async Task MutationDeltaCarriesTheDraftAndItsPerformerSlots()
    {
        await using var fixture = await Fixture.CreateAsync();

        var delta = await SegmentEditorDeltaService.LoadMutationDeltaAsync(
            fixture.Db, 7, [20], includePerformerSlots: true, CancellationToken.None);

        Assert.NotNull(delta);
        var draft = Assert.Single(delta.UpsertedSegments);
        Assert.Equal((-20L, 20L, "extension", "Pair"), (draft.Id, draft.ItemId, draft.Residence, draft.TagName));
        var slot = Assert.Single(delta.PerformerSlots!);
        Assert.Equal((-20L, SlotId, 501), (slot.SegmentId, slot.SlotDefinitionId, slot.PerformerId));
        Assert.Equal([-20L], delta.PerformerSlotRevisions!.Keys);
        Assert.NotNull(delta.ApprovedSetVersion);
    }

    [Fact]
    public async Task MutationDeltaLeavesOutSlotsTheCallerCannotRead()
    {
        await using var fixture = await Fixture.CreateAsync();

        var delta = await SegmentEditorDeltaService.LoadMutationDeltaAsync(
            fixture.Db, 7, [20], includePerformerSlots: false, CancellationToken.None);

        Assert.Single(delta!.UpsertedSegments);
        Assert.Null(delta.PerformerSlots);
        Assert.Null(delta.PerformerSlotRevisions);
    }

    [Fact]
    public async Task NativeMutationDeltaFindsAnchoredSegmentsOfTheVideoOnly()
    {
        await using var fixture = await Fixture.CreateAsync();

        // Native anchors carry no video id, so the native segment's host decides which video it is on.
        var delta = await SegmentEditorDeltaService.LoadNativeMutationDeltaAsync(
            fixture.Db, 7, [40, 41], includePerformerSlots: true, CancellationToken.None);

        var native = Assert.Single(delta!.UpsertedSegments);
        Assert.Equal((40L, 30L, 40, "native", true, "approved"),
            (native.Id, native.ItemId, native.NativeSegmentId, native.Residence, native.Published, native.ReviewState));
        var slot = Assert.Single(delta.PerformerSlots!);
        Assert.Equal((40L, SlotId), (slot.SegmentId, slot.SlotDefinitionId));
        Assert.Null(slot.PerformerId);
        Assert.Equal([40L], delta.PerformerSlotRevisions!.Keys);
    }

    private sealed class Fixture : IAsyncDisposable
    {
        private readonly SqliteConnection _connection;

        private Fixture(SqliteConnection connection, DeltaDbContext db)
        {
            _connection = connection;
            Db = db;
        }

        public DeltaDbContext Db { get; }

        public static async Task<Fixture> CreateAsync()
        {
            var connection = new SqliteConnection("Data Source=:memory:");
            await connection.OpenAsync();
            var db = new DeltaDbContext(new DbContextOptionsBuilder<DeltaDbContext>()
                .UseSqlite(connection)
                .Options);
            await db.Database.EnsureCreatedAsync();
            db.AddRange(
                new Tag { Id = 9, Name = "Pair", SortName = "Pair" },
                new Performer { Id = 501, Name = "Example Performer" },
                new SegmentStudioSlotDefinitionSet { Id = SetId, TagId = 9, CreatedAt = Now },
                new SegmentStudioSlotDefinition { Id = SlotId, SlotDefinitionSetId = SetId, SortOrder = 0, Label = "Giver", CreatedAt = Now },
                new Segment { Id = 40, HostType = SegmentHostType.Video, HostId = 7, Kind = "tag", TagId = 9, StartSec = 30, EndSec = 40, UpdatedAt = Now },
                new Segment { Id = 41, HostType = SegmentHostType.Video, HostId = 8, Kind = "tag", TagId = 9, StartSec = 30, EndSec = 40, UpdatedAt = Now },
                new SegmentStudioItem
                {
                    Id = 20, VideoId = 7, TagId = 9, StartSec = 2, EndSec = 8, Kind = "tag",
                    ReviewState = "unreviewed", SourceKey = "user", Revision = 3, CreatedAt = Now, UpdatedAt = Now,
                },
                new SegmentStudioItem { Id = 30, NativeSegmentId = 40, CreatedAt = Now, UpdatedAt = Now },
                new SegmentStudioItem { Id = 31, NativeSegmentId = 41, CreatedAt = Now, UpdatedAt = Now });
            await db.SaveChangesAsync();
            db.Add(new SegmentStudioSegmentSlot { ItemId = 20, SlotDefinitionId = SlotId, PerformerId = 501, CreatedAt = Now });
            await db.SaveChangesAsync();
            db.ChangeTracker.Clear();
            return new Fixture(connection, db);
        }

        public async ValueTask DisposeAsync()
        {
            await Db.DisposeAsync();
            await _connection.DisposeAsync();
        }
    }

    private sealed class DeltaDbContext(DbContextOptions<DeltaDbContext> options) : DbContext(options)
    {
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Ignore<Group>();
            modelBuilder.Ignore<TagGroup>();
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
            modelBuilder.Entity<Performer>(builder =>
            {
                builder.HasKey(performer => performer.Id);
                builder.Ignore(performer => performer.Urls);
                builder.Ignore(performer => performer.Aliases);
                builder.Ignore(performer => performer.PerformerTags);
                builder.Ignore(performer => performer.VideoPerformers);
                builder.Ignore(performer => performer.ImagePerformers);
                builder.Ignore(performer => performer.GalleryPerformers);
                builder.Ignore(performer => performer.AudioPerformers);
                builder.Ignore(performer => performer.TextPerformers);
                builder.Ignore(performer => performer.RemoteIds);
            });
            modelBuilder.Entity<Segment>(builder =>
            {
                builder.HasKey(segment => segment.Id);
                builder.Ignore(segment => segment.Tag);
                builder.Ignore(segment => segment.Payload);
            });
            modelBuilder.Entity<SegmentStudioItem>(builder => builder.HasKey(item => item.Id));
            modelBuilder.Entity<SegmentStudioSegmentSlot>(builder =>
            {
                builder.HasKey(slot => new { slot.ItemId, slot.SlotDefinitionId });
                builder.HasOne(slot => slot.Item).WithMany(item => item.Slots).HasForeignKey(slot => slot.ItemId);
            });
            modelBuilder.Entity<SegmentStudioSlotDefinitionSet>(builder => builder.HasKey(set => set.Id));
            modelBuilder.Entity<SegmentStudioSlotDefinition>(builder => builder.HasKey(definition => definition.Id));
            modelBuilder.Entity<SegmentStudioSlotDefinitionGenderHint>(builder =>
                builder.HasKey(hint => new { hint.SlotDefinitionId, hint.GenderHint }));
            modelBuilder.Entity<SegmentStudioLineageNode>().HasKey(node => node.Id);
            modelBuilder.Entity<SegmentStudioDerivationEdge>().HasKey(edge => edge.Id);
        }
    }
}
