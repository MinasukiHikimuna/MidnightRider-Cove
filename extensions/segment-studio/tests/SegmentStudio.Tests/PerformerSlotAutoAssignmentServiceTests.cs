namespace SegmentStudio.Tests;

using Cove.Core.Entities;
using Cove.Core.Enums;
using Microsoft.EntityFrameworkCore;

public sealed class PerformerSlotAutoAssignmentServiceTests
{
    private static readonly Guid FirstSlotId = Guid.Parse("20000000-0000-0000-0000-000000000001");
    private static readonly Guid SecondSlotId = Guid.Parse("20000000-0000-0000-0000-000000000002");

    [Fact]
    public void AssignsTheOnlyCompleteGenderHintCombination()
    {
        var result = PerformerSlotAutoAssignmentService.FindUniqueAssignment(
            [
                new(FirstSlotId, "Receiver", 0, ["Female"]),
                new(SecondSlotId, "Giver", 1, ["Male"]),
            ],
            [
                new(101, "First", "Male"),
                new(102, "Second", "Female"),
            ],
            allowSamePerformerInMultipleSlots: false);

        Assert.NotNull(result);
        Assert.Equal(102, result[FirstSlotId]);
        Assert.Equal(101, result[SecondSlotId]);
    }

    [Fact]
    public void LeavesAmbiguousAssignmentsUnfilled()
    {
        var result = PerformerSlotAutoAssignmentService.FindUniqueAssignment(
            [
                new(FirstSlotId, "First", 0, ["Female"]),
                new(SecondSlotId, "Second", 1, ["Male"]),
            ],
            [
                new(101, "First", "Male"),
                new(102, "Second", "Female"),
                new(103, "Third", "Female"),
            ],
            allowSamePerformerInMultipleSlots: false);

        Assert.Null(result);
    }

    [Fact]
    public void UnhintedSlotsAcceptAnyRemainingVideoPerformer()
    {
        var result = PerformerSlotAutoAssignmentService.FindUniqueAssignment(
            [
                new(FirstSlotId, "Receiver", 0, ["Female"]),
                new(SecondSlotId, "Other", 1, []),
            ],
            [
                new(101, "First", "Male"),
                new(102, "Second", "Female"),
            ],
            allowSamePerformerInMultipleSlots: false);

        Assert.NotNull(result);
        Assert.Equal(102, result[FirstSlotId]);
        Assert.Equal(101, result[SecondSlotId]);
    }

    [Fact]
    public void FillsUniqueMissingSlotWithoutReplacingCompatibleAssignment()
    {
        var result = PerformerSlotAutoAssignmentService.FindUniqueAssignment(
            [
                new(FirstSlotId, "Receiver", 0, ["Female"]),
                new(SecondSlotId, "Giver", 1, ["Male"]),
            ],
            [
                new(101, "First", "Male"),
                new(102, "Second", "Female"),
            ],
            allowSamePerformerInMultipleSlots: false,
            existingAssignments: new Dictionary<Guid, int> { [FirstSlotId] = 102 });

        Assert.NotNull(result);
        Assert.Equal(102, result[FirstSlotId]);
        Assert.Equal(101, result[SecondSlotId]);
    }

    [Fact]
    public void TreatsSameLabeledSlotsAsSemanticallyInterchangeable()
    {
        var result = PerformerSlotAutoAssignmentService.FindUniqueAssignment(
            [
                new(FirstSlotId, "Participant", 0, ["Female"]),
                new(SecondSlotId, "Participant", 1, ["Female"]),
            ],
            [
                new(101, "First", "Female"),
                new(102, "Second", "Female"),
            ],
            allowSamePerformerInMultipleSlots: false);

        Assert.NotNull(result);
        Assert.Equal([101, 102], result.Values.Order());
    }

    [Fact]
    public void UsesStableAlphabeticalFallbackForUnlabeledUnhintedSlots()
    {
        var result = PerformerSlotAutoAssignmentService.FindUniqueAssignment(
            [
                new(SecondSlotId, null, 1, []),
                new(FirstSlotId, null, 0, []),
            ],
            [
                new(101, "Zulu", "Male"),
                new(102, "Alpha", "Female"),
            ],
            allowSamePerformerInMultipleSlots: false);

        Assert.NotNull(result);
        Assert.Equal(102, result[FirstSlotId]);
        Assert.Equal(101, result[SecondSlotId]);
    }

    [Fact]
    public async Task BulkAssignsNativeSegmentsWithMissingOrPublishedAnchorsAndSkipsAssignedDrafts()
    {
        await using var db = CreateContext();
        var now = DateTime.UtcNow;
        db.AddRange(
            new Performer { Id = 101, Name = "First", Gender = GenderEnum.Male },
            new Performer { Id = 102, Name = "Second", Gender = GenderEnum.Female },
            new VideoPerformer { VideoId = 77, PerformerId = 101 },
            new VideoPerformer { VideoId = 77, PerformerId = 102 },
            new Segment { Id = 201, HostType = SegmentHostType.Video, HostId = 77, Kind = "tag", TagId = 11 },
            new Segment { Id = 202, HostType = SegmentHostType.Video, HostId = 77, Kind = "tag", TagId = 11 },
            new SegmentStudioSlotDefinitionSet
                { Id = Guid.Parse("10000000-0000-0000-0000-000000000001"), TagId = 11, CreatedAt = now },
            new SegmentStudioSlotDefinition
                { Id = FirstSlotId, SlotDefinitionSetId = Guid.Parse("10000000-0000-0000-0000-000000000001"), SortOrder = 0, CreatedAt = now },
            new SegmentStudioSlotDefinition
                { Id = SecondSlotId, SlotDefinitionSetId = Guid.Parse("10000000-0000-0000-0000-000000000001"), SortOrder = 1, CreatedAt = now },
            new SegmentStudioSlotDefinitionGenderHint { SlotDefinitionId = FirstSlotId, GenderHint = "FEMALE" },
            new SegmentStudioSlotDefinitionGenderHint { SlotDefinitionId = SecondSlotId, GenderHint = "MALE" },
            new SegmentStudioItem { NativeSegmentId = 202, CreatedAt = now, UpdatedAt = now },
            new SegmentStudioItem
            {
                Id = 301, VideoId = 77, TagId = 11, ReviewState = "approved",
                CreatedAt = now, UpdatedAt = now,
            });
        await db.SaveChangesAsync();
        db.Add(new SegmentStudioSegmentSlot
        {
            ItemId = 301, SlotDefinitionId = FirstSlotId, PerformerId = 102, CreatedAt = now,
        });
        await db.SaveChangesAsync();

        var result = await PerformerSlotAutoAssignmentService.AssignEmptySegmentsAsync(
            db, 77, CancellationToken.None);

        Assert.Equal(2, result.AssignedSegmentCount);
        Assert.Equal(4, result.AssignedSlotCount);
        Assert.Equal(2, await db.Set<SegmentStudioSegmentSlot>().CountAsync(slot =>
            slot.Item.NativeSegmentId == 201));
        Assert.Equal(2, await db.Set<SegmentStudioSegmentSlot>().CountAsync(slot =>
            slot.Item.NativeSegmentId == 202));
        Assert.Single(await db.Set<SegmentStudioSegmentSlot>().Where(slot => slot.ItemId == 301).ToListAsync());
    }

    private static AutoAssignmentDbContext CreateContext()
    {
        var options = new DbContextOptionsBuilder<AutoAssignmentDbContext>()
            .UseInMemoryDatabase(Guid.NewGuid().ToString()).Options;
        return new(options);
    }

    private sealed class AutoAssignmentDbContext(DbContextOptions<AutoAssignmentDbContext> options)
        : DbContext(options)
    {
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Ignore<Group>();
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
            modelBuilder.Entity<VideoPerformer>(builder =>
            {
                builder.HasKey(link => new { link.VideoId, link.PerformerId });
                builder.Ignore(link => link.Video);
                builder.Ignore(link => link.Performer);
            });
            modelBuilder.Entity<Segment>(builder =>
            {
                builder.HasKey(segment => segment.Id);
                builder.Ignore(segment => segment.Tag);
                builder.Ignore(segment => segment.Payload);
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
        }
    }
}
