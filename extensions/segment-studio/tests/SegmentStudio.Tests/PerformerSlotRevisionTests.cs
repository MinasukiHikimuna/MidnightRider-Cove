namespace SegmentStudio.Tests;

using System.Data.Common;
using Cove.Core.Entities;
using Microsoft.Data.Sqlite;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Diagnostics;

public sealed class PerformerSlotRevisionTests
{
    private static readonly DateTime Now = new(2026, 10, 16, 12, 0, 0, DateTimeKind.Utc);
    private static readonly Guid PairSetId = Guid.Parse("10000000-0000-0000-0000-000000000001");
    private static readonly Guid SoloSetId = Guid.Parse("10000000-0000-0000-0000-000000000002");
    private static readonly Guid GiverId = Guid.Parse("20000000-0000-0000-0000-000000000001");
    private static readonly Guid ReceiverId = Guid.Parse("20000000-0000-0000-0000-000000000002");
    private static readonly Guid SoloId = Guid.Parse("20000000-0000-0000-0000-000000000003");

    [Fact]
    public async Task EditorRevisionsMatchTheRevisionASlotSaveChecksAgainst()
    {
        await using var db = new RevisionDbContext(new DbContextOptionsBuilder<RevisionDbContext>()
            .UseInMemoryDatabase(Guid.NewGuid().ToString())
            .Options);
        Seed(db, itemsPerTag: 3);
        db.Add(new SegmentStudioSegmentSlot { ItemId = 1, SlotDefinitionId = GiverId, PerformerId = 501, CreatedAt = Now });
        await db.SaveChangesAsync();
        db.ChangeTracker.Clear();
        var ownedItemTagIds = await OwnedItemTagIdsAsync(db);
        var slots = await PerformerSlotEditorService.LoadUnifiedAsync(
            db, new Dictionary<int, int>(), ownedItemTagIds, CancellationToken.None);

        var revisions = await PerformerSlotMutationService.LoadUnifiedAssignmentRevisionsAsync(
            db, new Dictionary<int, int>(), ownedItemTagIds, slots, CancellationToken.None);

        // Items whose tag has no slot definitions have no revision, as before.
        Assert.Equal(
            ownedItemTagIds.Where(pair => pair.Value != 13).Select(pair => -pair.Key).Order(),
            revisions.Keys.Order());
        foreach (var (itemId, tagId) in ownedItemTagIds.Where(pair => pair.Value != 13))
        {
            // A save with a stale revision answers with the current one, computed by the save path.
            var conflict = await PerformerSlotMutationService.UpdateOwnedAssignmentsAsync(
                db, 77, itemId, new SlotAssignmentUpdate("stale", []), CancellationToken.None);
            Assert.Equal(SlotMutationStatus.Conflict, conflict.Status);
            Assert.Equal(conflict.Value!.Revision, revisions[-itemId]);
        }
    }

    [Fact]
    public async Task EditorRevisionQueriesDoNotGrowWithTheNumberOfSegments()
    {
        var few = await CountRevisionCommandsAsync(itemsPerTag: 2);
        var many = await CountRevisionCommandsAsync(itemsPerTag: 60);

        Assert.Equal(few, many);
        Assert.True(many <= 3, $"Expected at most 3 queries, saw {many}.");
    }

    private static async Task<int> CountRevisionCommandsAsync(int itemsPerTag)
    {
        await using var connection = new SqliteConnection("Data Source=:memory:");
        await connection.OpenAsync();
        var counter = new CommandCounter();
        await using var db = new RevisionDbContext(new DbContextOptionsBuilder<RevisionDbContext>()
            .UseSqlite(connection)
            .AddInterceptors(counter)
            .Options);
        await db.Database.EnsureCreatedAsync();
        Seed(db, itemsPerTag);
        await db.SaveChangesAsync();
        db.ChangeTracker.Clear();
        var ownedItemTagIds = await OwnedItemTagIdsAsync(db);
        var slots = await PerformerSlotEditorService.LoadUnifiedAsync(
            db, new Dictionary<int, int>(), ownedItemTagIds, CancellationToken.None);

        counter.Count = 0;
        var revisions = await PerformerSlotMutationService.LoadUnifiedAssignmentRevisionsAsync(
            db, new Dictionary<int, int>(), ownedItemTagIds, slots, CancellationToken.None);

        Assert.Equal(itemsPerTag * 2, revisions.Count);
        return counter.Count;
    }

    private static async Task<Dictionary<long, int>> OwnedItemTagIdsAsync(RevisionDbContext db) =>
        await db.Set<SegmentStudioItem>().AsNoTracking()
            .ToDictionaryAsync(item => item.Id, item => item.TagId!.Value);

    // Tags 11 and 12 have slot definitions; tag 13 has none.
    private static void Seed(RevisionDbContext db, int itemsPerTag)
    {
        db.AddRange(
            new Tag { Id = 11, Name = "Pair" },
            new Tag { Id = 12, Name = "Solo" },
            new Tag { Id = 13, Name = "Plain" },
            new Performer { Id = 501, Name = "Example Performer" },
            new SegmentStudioSlotDefinitionSet { Id = PairSetId, TagId = 11, CreatedAt = Now },
            new SegmentStudioSlotDefinitionSet { Id = SoloSetId, TagId = 12, AllowSamePerformerInMultipleSlots = true, CreatedAt = Now },
            new SegmentStudioSlotDefinition { Id = ReceiverId, SlotDefinitionSetId = PairSetId, SortOrder = 1, Label = "Receiver", CreatedAt = Now },
            new SegmentStudioSlotDefinition { Id = GiverId, SlotDefinitionSetId = PairSetId, SortOrder = 0, Label = "Giver", CreatedAt = Now },
            new SegmentStudioSlotDefinition { Id = SoloId, SlotDefinitionSetId = SoloSetId, SortOrder = 0, CreatedAt = Now },
            new SegmentStudioSlotDefinitionGenderHint { SlotDefinitionId = GiverId, GenderHint = "MALE" },
            new SegmentStudioSlotDefinitionGenderHint { SlotDefinitionId = GiverId, GenderHint = "FEMALE" });
        var itemId = 1L;
        foreach (var tagId in new[] { 11, 12, 13 })
        {
            for (var index = 0; index < itemsPerTag; index++)
            {
                db.Add(new SegmentStudioItem
                {
                    Id = itemId++,
                    VideoId = 77,
                    TagId = tagId,
                    StartSec = index * 10,
                    EndSec = index * 10 + 5,
                    Kind = "tag",
                    SourceKey = "user",
                    ReviewState = "unreviewed",
                    CreatedAt = Now,
                    UpdatedAt = Now,
                });
            }
        }
    }

    private sealed class CommandCounter : DbCommandInterceptor
    {
        public int Count { get; set; }

        public override ValueTask<InterceptionResult<DbDataReader>> ReaderExecutingAsync(
            DbCommand command, CommandEventData eventData, InterceptionResult<DbDataReader> result,
            CancellationToken cancellationToken = default)
        {
            Count++;
            return base.ReaderExecutingAsync(command, eventData, result, cancellationToken);
        }
    }

    private sealed class RevisionDbContext(DbContextOptions<RevisionDbContext> options) : DbContext(options)
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
            modelBuilder.Entity<SegmentStudioSlotDefinitionSet>(builder => builder.HasKey(set => set.Id));
            modelBuilder.Entity<SegmentStudioSlotDefinition>(builder => builder.HasKey(definition => definition.Id));
            modelBuilder.Entity<SegmentStudioSlotDefinitionGenderHint>(builder =>
                builder.HasKey(hint => new { hint.SlotDefinitionId, hint.GenderHint }));
            modelBuilder.Entity<SegmentStudioItem>(builder => builder.HasKey(item => item.Id));
            modelBuilder.Entity<SegmentStudioSegmentSlot>(builder =>
            {
                builder.HasKey(slot => new { slot.ItemId, slot.SlotDefinitionId });
                builder.HasOne(slot => slot.Item).WithMany(item => item.Slots).HasForeignKey(slot => slot.ItemId);
            });
            modelBuilder.Entity<Segment>(builder =>
            {
                builder.HasKey(segment => segment.Id);
                builder.Ignore(segment => segment.Tag);
                builder.Ignore(segment => segment.Payload);
            });
        }
    }
}
