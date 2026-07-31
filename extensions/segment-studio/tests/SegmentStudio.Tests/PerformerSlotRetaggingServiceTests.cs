using Cove.Core.Entities;
using Cove.Core.Enums;
using Microsoft.EntityFrameworkCore;

namespace SegmentStudio.Tests;

public sealed class PerformerSlotRetaggingServiceTests
{
    [Fact]
    public async Task KeepsFirstDuplicatePerformerAndUnrelatedMatchesWhenTargetRequiresUniquePerformers()
    {
        await using var db = CreateContext();
        var source = AddSet(db, 10, true, ("Giver", 0), ("Receiver", 1), ("Observer", 2));
        var target = AddSet(db, 20, false, ("Giver", 0), ("Receiver", 1), ("Observer", 2));
        db.AddRange(
            Assignment(source[0], 7),
            Assignment(source[1], 7),
            Assignment(source[2], 9));
        await db.SaveChangesAsync();

        await PerformerSlotRetaggingService.RemapAsync(db, 100, 10, 20, CancellationToken.None);
        await db.SaveChangesAsync();

        var saved = await db.Set<SegmentStudioSegmentSlot>()
            .OrderBy(slot => slot.SlotDefinitionId)
            .ToDictionaryAsync(slot => slot.SlotDefinitionId, slot => slot.PerformerId);
        Assert.Equal(7, saved[target[0]]);
        Assert.DoesNotContain(target[1], saved.Keys);
        Assert.Equal(9, saved[target[2]]);
    }

    [Fact]
    public async Task RemovesAssignmentsWhoseLabelsDoNotExistOnTarget()
    {
        await using var db = CreateContext();
        var source = AddSet(db, 10, false, ("Giver", 0), ("Extra", 1));
        var target = AddSet(db, 20, false, ("Giver", 0));
        db.AddRange(Assignment(source[0], 7), Assignment(source[1], 9));
        await db.SaveChangesAsync();

        await PerformerSlotRetaggingService.RemapAsync(db, 100, 10, 20, CancellationToken.None);
        await db.SaveChangesAsync();

        var saved = Assert.Single(await db.Set<SegmentStudioSegmentSlot>().ToListAsync());
        Assert.Equal(target[0], saved.SlotDefinitionId);
        Assert.Equal(7, saved.PerformerId);
    }

    [Fact]
    public async Task PairsRepeatedLabelsBySortOrder()
    {
        await using var db = CreateContext();
        var source = AddSet(db, 10, false, ("Giver", 0), ("Giver", 1));
        var target = AddSet(db, 20, false, ("Giver", 0), ("Giver", 1));
        db.AddRange(Assignment(source[0], 7), Assignment(source[1], 9));
        await db.SaveChangesAsync();

        await PerformerSlotRetaggingService.RemapAsync(db, 100, 10, 20, CancellationToken.None);
        await db.SaveChangesAsync();

        var saved = await db.Set<SegmentStudioSegmentSlot>()
            .ToDictionaryAsync(slot => slot.SlotDefinitionId, slot => slot.PerformerId);
        Assert.Equal(7, saved[target[0]]);
        Assert.Equal(9, saved[target[1]]);
    }

    [Fact]
    public async Task DuplicatePerformerDoesNotConsumeARepeatedTargetSlot()
    {
        await using var db = CreateContext();
        var source = AddSet(db, 10, true, ("Giver", 0), ("Giver", 1), ("Giver", 2));
        var target = AddSet(db, 20, false, ("Giver", 0), ("Giver", 1));
        db.AddRange(
            Assignment(source[0], 7),
            Assignment(source[1], 7),
            Assignment(source[2], 9));
        await db.SaveChangesAsync();

        await PerformerSlotRetaggingService.RemapAsync(db, 100, 10, 20, CancellationToken.None);
        await db.SaveChangesAsync();

        var saved = await db.Set<SegmentStudioSegmentSlot>()
            .ToDictionaryAsync(slot => slot.SlotDefinitionId, slot => slot.PerformerId);
        Assert.Equal(7, saved[target[0]]);
        Assert.Equal(9, saved[target[1]]);
    }

    [Fact]
    public async Task RemovesAssignmentWhenPerformerDoesNotMatchTargetGenderHint()
    {
        await using var db = CreateContext();
        var source = AddSet(db, 10, false, ("Partner", 0));
        var target = AddSet(db, 20, false, ("Partner", 0));
        db.AddRange(
            new Performer { Id = 7, Name = "Example", Gender = GenderEnum.Male },
            new SegmentStudioSlotDefinitionGenderHint
            {
                SlotDefinitionId = target[0],
                GenderHint = "FEMALE",
            },
            Assignment(source[0], 7));
        await db.SaveChangesAsync();

        await PerformerSlotRetaggingService.RemapAsync(db, 100, 10, 20, CancellationToken.None);
        await db.SaveChangesAsync();

        Assert.Empty(await db.Set<SegmentStudioSegmentSlot>().ToListAsync());
    }

    [Theory]
    [InlineData(GenderEnum.Female, "FEMALE")]
    [InlineData(GenderEnum.TransgenderFemale, "TRANSGENDER_FEMALE")]
    public async Task KeepsAssignmentWhenPerformerMatchesTargetGenderHint(
        GenderEnum performerGender,
        string genderHint)
    {
        await using var db = CreateContext();
        var source = AddSet(db, 10, false, ("Partner", 0));
        var target = AddSet(db, 20, false, ("Partner", 0));
        db.AddRange(
            new Performer { Id = 7, Name = "Example", Gender = performerGender },
            new SegmentStudioSlotDefinitionGenderHint
            {
                SlotDefinitionId = target[0],
                GenderHint = genderHint,
            },
            Assignment(source[0], 7));
        await db.SaveChangesAsync();

        await PerformerSlotRetaggingService.RemapAsync(db, 100, 10, 20, CancellationToken.None);
        await db.SaveChangesAsync();

        var saved = Assert.Single(await db.Set<SegmentStudioSegmentSlot>().ToListAsync());
        Assert.Equal(target[0], saved.SlotDefinitionId);
        Assert.Equal(7, saved.PerformerId);
    }

    [Theory]
    [InlineData(false, 0)]
    [InlineData(true, 1)]
    public async Task AutoCompletesEmptyRetagOnlyWhenPerformerAccessWasAuthorized(
        bool autoAssignMissingSlots,
        int expectedAssignments)
    {
        await using var db = CreateContext();
        AddSet(db, 10, false, ("Old", 0));
        var target = AddSet(db, 20, false, ("New", 0));
        db.AddRange(
            new Performer { Id = 7, Name = "Example", Gender = GenderEnum.Male },
            new VideoPerformer { VideoId = 77, PerformerId = 7 },
            new SegmentStudioItem { Id = 100, VideoId = 77, TagId = 10 },
            new SegmentStudioSlotDefinitionGenderHint
            {
                SlotDefinitionId = target[0],
                GenderHint = "MALE",
            });
        await db.SaveChangesAsync();

        await PerformerSlotRetaggingService.RemapAsync(
            db, 100, 10, 20, CancellationToken.None, autoAssignMissingSlots);
        await db.SaveChangesAsync();

        var saved = await db.Set<SegmentStudioSegmentSlot>().ToListAsync();
        Assert.Equal(expectedAssignments, saved.Count);
        if (autoAssignMissingSlots)
        {
            Assert.Equal(target[0], saved[0].SlotDefinitionId);
            Assert.Equal(7, saved[0].PerformerId);
        }
    }

    private static RetaggingDbContext CreateContext() =>
        new(new DbContextOptionsBuilder<RetaggingDbContext>()
            .UseInMemoryDatabase(Guid.NewGuid().ToString())
            .Options);

    private static Guid[] AddSet(
        DbContext db,
        int tagId,
        bool allowSamePerformer,
        params (string? Label, int SortOrder)[] slots)
    {
        var setId = Guid.NewGuid();
        db.Add(new SegmentStudioSlotDefinitionSet
        {
            Id = setId,
            TagId = tagId,
            AllowSamePerformerInMultipleSlots = allowSamePerformer,
            CreatedAt = DateTime.UtcNow,
        });
        return slots.Select(slot =>
        {
            var id = Guid.NewGuid();
            db.Add(new SegmentStudioSlotDefinition
            {
                Id = id,
                SlotDefinitionSetId = setId,
                Label = slot.Label,
                SortOrder = slot.SortOrder,
                CreatedAt = DateTime.UtcNow,
            });
            return id;
        }).ToArray();
    }

    private static SegmentStudioSegmentSlot Assignment(Guid definitionId, int performerId) => new()
    {
        ItemId = 100,
        SlotDefinitionId = definitionId,
        PerformerId = performerId,
        CreatedAt = DateTime.UtcNow,
    };

    private sealed class RetaggingDbContext(DbContextOptions<RetaggingDbContext> options)
        : DbContext(options)
    {
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
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
            modelBuilder.Entity<SegmentStudioSlotDefinitionSet>().HasKey(set => set.Id);
            modelBuilder.Entity<SegmentStudioItem>(builder =>
            {
                builder.HasKey(item => item.Id);
                builder.Ignore(item => item.Slots);
            });
            modelBuilder.Entity<VideoPerformer>(builder =>
            {
                builder.HasKey(link => new { link.VideoId, link.PerformerId });
                builder.Ignore(link => link.Video);
                builder.Ignore(link => link.Performer);
            });
            modelBuilder.Entity<SegmentStudioSlotDefinition>(builder =>
            {
                builder.HasKey(definition => definition.Id);
                builder.Ignore(definition => definition.SlotDefinitionSet);
                builder.Ignore(definition => definition.GenderHints);
            });
            modelBuilder.Entity<SegmentStudioSlotDefinitionGenderHint>(builder =>
            {
                builder.HasKey(hint => new { hint.SlotDefinitionId, hint.GenderHint });
                builder.Ignore(hint => hint.SlotDefinition);
            });
            modelBuilder.Entity<SegmentStudioSegmentSlot>(builder =>
            {
                builder.HasKey(slot => new { slot.ItemId, slot.SlotDefinitionId });
                builder.Ignore(slot => slot.Item);
                builder.Ignore(slot => slot.SlotDefinition);
            });
        }
    }
}
