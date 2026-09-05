namespace SegmentStudio.Tests;

using Cove.Core.Entities;
using Cove.Core.Enums;
using Microsoft.EntityFrameworkCore;

public sealed class PerformerSlotEditorServiceTests
{
    private static readonly Guid SetId = Guid.Parse("10000000-0000-0000-0000-000000000001");
    private static readonly Guid FirstSlotId = Guid.Parse("20000000-0000-0000-0000-000000000001");
    private static readonly Guid SecondSlotId = Guid.Parse("20000000-0000-0000-0000-000000000002");

    [Fact]
    public async Task ReturnsOrderedDefinitionsAssignmentsAndHintsForRequestedSegments()
    {
        await using var db = CreateContext();
        var now = new DateTime(2026, 7, 21, 18, 0, 0, DateTimeKind.Utc);
        db.AddRange(
            new Performer { Id = 201, Name = "Alexis Example", Gender = GenderEnum.Male },
            new Performer { Id = 202, Name = "Video First", Gender = GenderEnum.Male },
            new Performer { Id = 203, Name = "Hint Match", Gender = GenderEnum.Female },
            new Segment { Id = 101, HostType = SegmentHostType.Video, HostId = 77, Kind = "tag", TagId = 11 },
            new VideoPerformer { VideoId = 77, PerformerId = 202 },
            new SegmentStudioSlotDefinitionSet { Id = SetId, TagId = 11, CreatedAt = now },
            Definition(SecondSlotId, 1, null, now),
            Definition(FirstSlotId, 0, "Receiver", now),
            new SegmentStudioSlotDefinitionGenderHint { SlotDefinitionId = FirstSlotId, GenderHint = "FEMALE" },
            new SegmentStudioSlotDefinitionGenderHint { SlotDefinitionId = FirstSlotId, GenderHint = "TRANSGENDER_FEMALE" },
            new SegmentStudioSegmentSlot
            {
                Item = NativeItem(101, now),
                SlotDefinitionId = FirstSlotId,
                PerformerId = 201,
                CreatedAt = now,
            },
            new SegmentStudioSegmentSlot
            {
                Item = NativeItem(999, now),
                SlotDefinitionId = SecondSlotId,
                PerformerId = 201,
                CreatedAt = now,
            });
        await db.SaveChangesAsync();
        db.ChangeTracker.Clear();

        var result = await PerformerSlotEditorService.LoadAsync(
            db,
            new Dictionary<int, int> { [101] = 11, [102] = 12 },
            CancellationToken.None);

        Assert.Collection(
            result,
            first =>
            {
                Assert.Equal(101, first.SegmentId);
                Assert.Equal(FirstSlotId, first.SlotDefinitionId);
                Assert.Equal("Receiver", first.Label);
                Assert.Equal(0, first.SortOrder);
                Assert.Equal(["FEMALE", "TRANSGENDER_FEMALE"], first.GenderHints);
                Assert.Equal(201, first.PerformerId);
                Assert.Equal("Alexis Example", first.PerformerName);
            },
            second =>
            {
                Assert.Equal(101, second.SegmentId);
                Assert.Equal(SecondSlotId, second.SlotDefinitionId);
                Assert.Null(second.Label);
                Assert.Equal(1, second.SortOrder);
                Assert.Empty(second.GenderHints);
                Assert.Null(second.PerformerId);
                Assert.Null(second.PerformerName);
            });
        Assert.DoesNotContain(result, slot => slot.SegmentId == 999);
        var candidates = await PerformerSlotEditorService.LoadCandidatesAsync(db, 77, CancellationToken.None);
        Assert.Equal([202, 201, 203], candidates.Select(candidate => candidate.PerformerId));
        Assert.True(candidates[0].IsVideoPerformer);
        Assert.Equal("Female", candidates.Single(candidate => candidate.PerformerId == 203).Gender);
    }

    [Fact]
    public async Task ReturnsNoSlotsWhenNoRequestedTagHasDefinitions()
    {
        await using var db = CreateContext();

        var result = await PerformerSlotEditorService.LoadAsync(
            db,
            new Dictionary<int, int> { [101] = 11 },
            CancellationToken.None);

        Assert.Empty(result);
    }

    private static SegmentStudioSlotDefinition Definition(Guid id, int sortOrder, string? label, DateTime createdAt) =>
        new()
        {
            Id = id,
            SlotDefinitionSetId = SetId,
            SortOrder = sortOrder,
            Label = label,
            CreatedAt = createdAt,
        };

    private static SegmentStudioItem NativeItem(int segmentId, DateTime createdAt) => new()
        { NativeSegmentId = segmentId, CreatedAt = createdAt, UpdatedAt = createdAt };

    private static PerformerSlotEditorDbContext CreateContext()
    {
        var options = new DbContextOptionsBuilder<PerformerSlotEditorDbContext>()
            .UseInMemoryDatabase(Guid.NewGuid().ToString())
            .Options;
        return new PerformerSlotEditorDbContext(options);
    }

    private sealed class PerformerSlotEditorDbContext(DbContextOptions<PerformerSlotEditorDbContext> options)
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
            modelBuilder.Entity<VideoPerformer>(builder =>
            {
                builder.HasKey(link => new { link.VideoId, link.PerformerId });
                builder.Ignore(link => link.Video);
                builder.Ignore(link => link.Performer);
            });
        }
    }
}
