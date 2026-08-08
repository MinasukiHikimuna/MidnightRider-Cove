namespace SegmentStudio.Tests;

using Cove.Core.Entities;
using Microsoft.EntityFrameworkCore;

public sealed class CorrespondingTagServiceTests
{
    [Fact]
    public async Task GlobalMappingsCanBeCreatedWithoutVideoDrafts()
    {
        await using var db = CreateContext();
        var source = new Tag { Id = 10, Name = "Model label" };
        var canonical = new Tag { Id = 20, Name = "Library destination" };
        db.AddRange(source, canonical);
        await db.SaveChangesAsync();

        var result = await CorrespondingTagService.SaveGlobalMappingsAsync(
            db, [new(source.Id, canonical.Id)], default);

        Assert.True(result.Success);
        var row = Assert.Single(result.Rows);
        Assert.Equal(source.Id, row.SourceTagId);
        Assert.Equal(canonical.Id, row.CorrespondingTagId);
        Assert.Equal(canonical.Name, row.CorrespondingTagName);
    }

    [Fact]
    public async Task SummaryCountsDistinctUnconvertedSourceTagsAndReadyStates()
    {
        await using var db = CreateContext();
        var source = new Tag { Id = 10, Name = "Model label" };
        var canonical = new Tag { Id = 20, Name = "Library destination" };
        db.AddRange(source, canonical, new Video { Id = 7 });
        var mapping = new SegmentStudioCorrespondingTagMapping
        {
            SourceTagId = source.Id,
            CorrespondingTagId = canonical.Id,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow,
        };
        db.Add(mapping);
        var unreviewed = AddCandidate(db, 7, source, "unreviewed", 1, 4);
        var approved = AddCandidate(db, 7, source, "approved", 5, 8);
        AddCandidate(db, 7, source, "rejected", 9, 12);
        await db.SaveChangesAsync();

        var summary = await CorrespondingTagService.GetSummaryAsync(db, 7, default);

        Assert.Equal(1, summary.SourceTagCount);
        Assert.Equal(1, summary.MappedSourceTagCount);
        Assert.Equal(1, summary.UnreviewedReadyCount);
        Assert.Equal(1, summary.ApprovedReadyCount);
        var row = Assert.Single(summary.Rows);
        Assert.Equal(1, row.UnreviewedCount);
        Assert.Equal(1, row.ApprovedCount);
        Assert.Equal(1, row.RejectedCount);
        Assert.NotEqual(unreviewed.Id, approved.Id);
    }

    [Fact]
    public async Task SavingMappingsDoesNotConvertSegments()
    {
        await using var db = CreateContext();
        var source = new Tag { Id = 10, Name = "Model label" };
        var canonical = new Tag { Id = 20, Name = "Library destination" };
        db.AddRange(source, canonical, new Video { Id = 7 });
        var item = AddCandidate(db, 7, source, "unreviewed", 1, 4);
        await db.SaveChangesAsync();

        var result = await CorrespondingTagService.SaveMappingsAsync(
            db,
            7,
            [new(source.Id, canonical.Id)],
            default);

        Assert.True(result.Success);
        Assert.Equal(source.Id, (await db.Set<SegmentStudioItem>()
            .SingleAsync(candidate => candidate.Id == item.Id)).TagId);
    }

    [Fact]
    public async Task ConversionPreservesReviewStateAndRawModelIdentity()
    {
        await using var db = CreateContext();
        var source = new Tag { Id = 10, Name = "Model label" };
        var canonical = new Tag { Id = 20, Name = "Library destination" };
        db.AddRange(source, canonical, new Video { Id = 7 });
        var mapping = new SegmentStudioCorrespondingTagMapping
        {
            SourceTagId = source.Id,
            CorrespondingTagId = canonical.Id,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow,
        };
        db.Add(mapping);
        var unreviewed = AddCandidate(db, 7, source, "unreviewed", 1, 4);
        var approved = AddCandidate(db, 7, source, "approved", 5, 8);
        await db.SaveChangesAsync();

        var operationId = Guid.NewGuid();
        var result = await CorrespondingTagService.ConvertAsync(
            db,
            7,
            new(operationId,
                [new(source.Id, canonical.Id, mapping.UpdatedAt)],
                ["approved"]),
            actorUserId: 99,
            canManagePerformerSlots: false,
            default);

        Assert.True(result.Success);
        Assert.Equal(1, result.ConvertedCount);
        Assert.Equal(1, Assert.Single(result.Conversions!).PreviousRevision);
        Assert.Equal(source.Id, (await db.Set<SegmentStudioItem>()
            .SingleAsync(item => item.Id == unreviewed.Id)).TagId);
        var savedApproved = await db.Set<SegmentStudioItem>()
            .SingleAsync(item => item.Id == approved.Id);
        Assert.Equal(canonical.Id, savedApproved.TagId);
        Assert.Equal("approved", savedApproved.ReviewState);
        Assert.Equal(2, savedApproved.Revision);
        var candidate = await db.Set<SegmentStudioAnalysisCandidate>()
            .SingleAsync(row => row.ItemId == approved.Id);
        Assert.Equal(source.Id, candidate.SourceTagId);
        Assert.Equal("Model label", candidate.TagName);
        var history = Assert.IsType<SegmentStudioHistoryView>(result.History);
        Assert.Equal(1, history.Revision);
        var action = Assert.Single(history.Actions);
        Assert.Equal("segments.corresponding-tags", action.Kind);
        Assert.Equal("segments", action.BeforeState.GetProperty("type").GetString());
        Assert.Single(await db.Set<SegmentStudioHistoryAction>().ToListAsync());

        var replay = await CorrespondingTagService.ConvertAsync(
            db,
            7,
            new(operationId,
                [new(source.Id, canonical.Id, mapping.UpdatedAt)],
                ["approved"]),
            actorUserId: 99,
            canManagePerformerSlots: false,
            default);
        Assert.True(replay.Success);
        Assert.True(replay.Replayed);
        Assert.Single(await db.Set<SegmentStudioHistoryAction>().ToListAsync());
    }

    [Fact]
    public async Task ConversionHistoryCapturesSlotsDroppedByRetagging()
    {
        await using var db = CreateContext();
        var source = new Tag { Id = 10, Name = "Model label" };
        var destination = new Tag { Id = 20, Name = "Library destination" };
        db.AddRange(source, destination, new Video { Id = 7 }, new Performer
        {
            Id = 30,
            Name = "Assigned performer",
        });
        var mapping = new SegmentStudioCorrespondingTagMapping
        {
            SourceTagId = source.Id,
            CorrespondingTagId = destination.Id,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow,
        };
        db.Add(mapping);
        var sourceSet = new SegmentStudioSlotDefinitionSet
        {
            Id = Guid.NewGuid(),
            TagId = source.Id,
            CreatedAt = DateTime.UtcNow,
        };
        var destinationSet = new SegmentStudioSlotDefinitionSet
        {
            Id = Guid.NewGuid(),
            TagId = destination.Id,
            CreatedAt = DateTime.UtcNow,
        };
        var sourceDefinition = new SegmentStudioSlotDefinition
        {
            Id = Guid.NewGuid(),
            SlotDefinitionSetId = sourceSet.Id,
            Label = "source role",
            CreatedAt = DateTime.UtcNow,
        };
        var destinationDefinition = new SegmentStudioSlotDefinition
        {
            Id = Guid.NewGuid(),
            SlotDefinitionSetId = destinationSet.Id,
            Label = "different role",
            CreatedAt = DateTime.UtcNow,
        };
        db.AddRange(sourceSet, destinationSet, sourceDefinition, destinationDefinition);
        var item = AddCandidate(db, 7, source, "approved", 5, 8);
        await db.SaveChangesAsync();
        db.Add(new SegmentStudioSegmentSlot
        {
            ItemId = item.Id,
            SlotDefinitionId = sourceDefinition.Id,
            PerformerId = 30,
            CreatedAt = DateTime.UtcNow,
        });
        await db.SaveChangesAsync();

        var result = await CorrespondingTagService.ConvertAsync(
            db,
            7,
            new(Guid.NewGuid(),
                [new(source.Id, destination.Id, mapping.UpdatedAt)],
                ["approved"]),
            actorUserId: 99,
            canManagePerformerSlots: true,
            default);

        Assert.True(result.Success);
        Assert.Empty(await db.Set<SegmentStudioSegmentSlot>().ToListAsync());
        var action = Assert.Single(Assert.IsType<SegmentStudioHistoryView>(result.History).Actions);
        Assert.Equal("composite", action.BeforeState.GetProperty("type").GetString());
        var beforeSlots = action.BeforeState.GetProperty("states")[1]
            .GetProperty("targets")[0]
            .GetProperty("assignments");
        Assert.Equal(sourceDefinition.Id,
            beforeSlots[0].GetProperty("slotDefinitionId").GetGuid());
        Assert.Equal(30, beforeSlots[0].GetProperty("performerId").GetInt32());
        Assert.Empty(action.AfterState.GetProperty("states")[1]
            .GetProperty("targets")[0]
            .GetProperty("assignments").EnumerateArray());
    }

    [Fact]
    public async Task MappingSaveRejectsAStaleGlobalMappingRevision()
    {
        await using var db = CreateContext();
        var source = new Tag { Id = 10, Name = "Model label" };
        var first = new Tag { Id = 20, Name = "First destination" };
        var second = new Tag { Id = 30, Name = "Second destination" };
        db.AddRange(source, first, second, new Video { Id = 7 });
        AddCandidate(db, 7, source, "unreviewed", 1, 4);
        await db.SaveChangesAsync();
        var initial = await CorrespondingTagService.SaveMappingsAsync(
            db, 7, [new(source.Id, first.Id)], default);
        var expected = Assert.Single(initial.Value!.Rows).MappingUpdatedAt;

        var stale = await CorrespondingTagService.SaveMappingsAsync(
            db, 7, [new(source.Id, second.Id)], default);
        Assert.False(stale.Success);
        Assert.True(stale.Conflict);

        var updated = await CorrespondingTagService.SaveMappingsAsync(
            db, 7, [new(source.Id, second.Id, expected)], default);
        Assert.True(updated.Success);
        Assert.Equal(second.Id, Assert.Single(updated.Value!.Rows).CorrespondingTagId);
    }

    [Fact]
    public async Task MappingSavesAreIdempotentAcrossAmbiguousRetries()
    {
        await using var db = CreateContext();
        var source = new Tag { Id = 10, Name = "Model label" };
        var first = new Tag { Id = 20, Name = "First destination" };
        var second = new Tag { Id = 30, Name = "Second destination" };
        db.AddRange(source, first, second, new Video { Id = 7 });
        AddCandidate(db, 7, source, "unreviewed", 1, 4);
        await db.SaveChangesAsync();

        var created = await CorrespondingTagService.SaveMappingsAsync(
            db, 7, [new(source.Id, first.Id)], default);
        var createdRetry = await CorrespondingTagService.SaveMappingsAsync(
            db, 7, [new(source.Id, first.Id)], default);
        Assert.True(createdRetry.Success);

        var createdAt = Assert.Single(created.Value!.Rows).MappingUpdatedAt;
        var updated = await CorrespondingTagService.SaveMappingsAsync(
            db, 7, [new(source.Id, second.Id, createdAt)], default);
        var updatedRetry = await CorrespondingTagService.SaveMappingsAsync(
            db, 7, [new(source.Id, second.Id, createdAt)], default);
        Assert.True(updatedRetry.Success);

        var updatedAt = Assert.Single(updated.Value!.Rows).MappingUpdatedAt;
        var deleted = await CorrespondingTagService.SaveMappingsAsync(
            db, 7, [new(source.Id, null, updatedAt)], default);
        var deletedRetry = await CorrespondingTagService.SaveMappingsAsync(
            db, 7, [new(source.Id, null, updatedAt)], default);
        Assert.True(deleted.Success);
        Assert.True(deletedRetry.Success);
        Assert.Null(Assert.Single(deletedRetry.Value!.Rows).CorrespondingTagId);
    }

    [Fact]
    public async Task ConversionRejectsMappingChangedAfterDialogLoaded()
    {
        await using var db = CreateContext();
        var source = new Tag { Id = 10, Name = "Model label" };
        var displayed = new Tag { Id = 20, Name = "Displayed destination" };
        var replacement = new Tag { Id = 30, Name = "Replacement destination" };
        db.AddRange(source, displayed, replacement, new Video { Id = 7 });
        var item = AddCandidate(db, 7, source, "approved", 1, 4);
        await db.SaveChangesAsync();
        var initial = await CorrespondingTagService.SaveMappingsAsync(
            db, 7, [new(source.Id, displayed.Id)], default);
        var displayedRevision = Assert.Single(initial.Value!.Rows).MappingUpdatedAt!.Value;
        var changed = await CorrespondingTagService.SaveMappingsAsync(
            db, 7, [new(source.Id, replacement.Id, displayedRevision)], default);
        Assert.True(changed.Success);

        var result = await CorrespondingTagService.ConvertAsync(
            db,
            7,
            new(Guid.NewGuid(),
                [new(source.Id, displayed.Id, displayedRevision)],
                ["approved"]),
            actorUserId: 99,
            canManagePerformerSlots: false,
            default);

        Assert.False(result.Success);
        Assert.True(result.MappingConflict);
        Assert.Equal(replacement.Id,
            Assert.Single(result.Value!.Rows).CorrespondingTagId);
        Assert.Equal(source.Id, (await db.Set<SegmentStudioItem>()
            .SingleAsync(candidate => candidate.Id == item.Id)).TagId);
        Assert.Empty(await db.Set<SegmentStudioHistoryAction>().ToListAsync());
    }

    [Fact]
    public async Task MissingSlotPermissionIsReportedSeparatelyFromLineageProtection()
    {
        await using var db = CreateContext();
        var source = new Tag { Id = 10, Name = "Model label" };
        var destination = new Tag { Id = 20, Name = "Library destination" };
        var performer = new Performer { Id = 30, Name = "Assigned performer" };
        db.AddRange(source, destination, performer, new Video { Id = 7 });
        var mapping = new SegmentStudioCorrespondingTagMapping
        {
            SourceTagId = source.Id,
            CorrespondingTagId = destination.Id,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow,
        };
        var definitionSet = new SegmentStudioSlotDefinitionSet
        {
            Id = Guid.NewGuid(),
            TagId = source.Id,
            CreatedAt = DateTime.UtcNow,
        };
        var definition = new SegmentStudioSlotDefinition
        {
            Id = Guid.NewGuid(),
            SlotDefinitionSetId = definitionSet.Id,
            Label = "source role",
            CreatedAt = DateTime.UtcNow,
        };
        db.AddRange(mapping, definitionSet, definition);
        var item = AddCandidate(db, 7, source, "approved", 1, 4);
        await db.SaveChangesAsync();
        db.Add(new SegmentStudioSegmentSlot
        {
            ItemId = item.Id,
            SlotDefinitionId = definition.Id,
            PerformerId = performer.Id,
            CreatedAt = DateTime.UtcNow,
        });
        await db.SaveChangesAsync();

        var result = await CorrespondingTagService.ConvertAsync(
            db,
            7,
            new(Guid.NewGuid(),
                [new(source.Id, destination.Id, mapping.UpdatedAt)],
                ["approved"]),
            actorUserId: 99,
            canManagePerformerSlots: false,
            default);

        Assert.True(result.Success);
        Assert.Equal(0, result.ConvertedCount);
        Assert.Equal(1, result.ProtectedCount);
        Assert.Equal(0, result.LineageProtectedCount);
        Assert.Equal(1, result.SlotPermissionProtectedCount);
        Assert.Equal(source.Id, (await db.Set<SegmentStudioItem>()
            .SingleAsync(candidate => candidate.Id == item.Id)).TagId);
    }

    [Fact]
    public async Task NullReviewStatesReturnValidationError()
    {
        await using var db = CreateContext();
        var result = await CorrespondingTagService.ConvertAsync(
            db,
            7,
            new(Guid.NewGuid(), null, null),
            actorUserId: 99,
            canManagePerformerSlots: false,
            default);

        Assert.False(result.Success);
        Assert.Contains("unreviewed", result.Error, StringComparison.OrdinalIgnoreCase);
    }

    [Fact]
    public async Task StaleHistoryPreventsConversionBeforeAnySegmentMutation()
    {
        await using var db = CreateContext();
        var source = new Tag { Id = 10, Name = "Model label" };
        var destination = new Tag { Id = 20, Name = "Library destination" };
        db.AddRange(source, destination, new Video { Id = 7 });
        var mapping = new SegmentStudioCorrespondingTagMapping
        {
            SourceTagId = source.Id,
            CorrespondingTagId = destination.Id,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow,
        };
        db.Add(mapping);
        var item = AddCandidate(db, 7, source, "approved", 5, 8);
        db.Add(new SegmentStudioHistorySession
        {
            UserId = 99,
            VideoId = 7,
            Mode = SegmentStudioModes.Full,
            Revision = 1,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow,
        });
        await db.SaveChangesAsync();

        var result = await CorrespondingTagService.ConvertAsync(
            db,
            7,
            new(Guid.NewGuid(),
                [new(source.Id, destination.Id, mapping.UpdatedAt)],
                ["approved"],
                ExpectedHistoryRevision: 0),
            actorUserId: 99,
            canManagePerformerSlots: false,
            default);

        Assert.False(result.Success);
        Assert.True(result.HistoryConflict);
        Assert.Equal(source.Id, (await db.Set<SegmentStudioItem>()
            .SingleAsync(candidate => candidate.Id == item.Id)).TagId);
        Assert.Empty(await db.Set<SegmentStudioSegmentOperation>().ToListAsync());
    }

    private static SegmentStudioItem AddCandidate(
        TestDbContext db,
        int videoId,
        Tag source,
        string reviewState,
        double start,
        double end)
    {
        var now = DateTime.UtcNow;
        var run = new SegmentStudioAnalysisRun
        {
            Id = Guid.NewGuid(),
            VideoId = videoId,
            VideoFileId = 1,
            CreatedAt = now,
            UpdatedAt = now,
        };
        var item = new SegmentStudioItem
        {
            VideoId = videoId,
            StartSec = start,
            EndSec = end,
            TagId = source.Id,
            Kind = "tag",
            ReviewState = reviewState,
            SourceKey = "ext:ai.tagging",
            Revision = 1,
            CreatedAt = now,
            UpdatedAt = now,
        };
        db.AddRange(run, item);
        db.Add(new SegmentStudioAnalysisCandidate
        {
            Run = run,
            Item = item,
            VideoId = videoId,
            CandidateKey = Guid.NewGuid().ToString(),
            Kind = "tag",
            SourceTagId = source.Id,
            TagName = source.Name,
            Title = source.Name,
            StartSec = start,
            EndSec = end,
            ModelKey = "model",
            ReviewState = "unreviewed",
            CreatedAt = now,
        });
        return item;
    }

    private static TestDbContext CreateContext() => new(
        new DbContextOptionsBuilder<TestDbContext>()
            .UseInMemoryDatabase(Guid.NewGuid().ToString()).Options);

    private sealed class TestDbContext(DbContextOptions<TestDbContext> options)
        : DbContext(options)
    {
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
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
            modelBuilder.Entity<SegmentStudioItem>(builder =>
            {
                builder.HasKey(item => item.Id);
                builder.Ignore(item => item.Slots);
            });
            modelBuilder.Entity<SegmentStudioAnalysisRun>().HasKey(run => run.Id);
            modelBuilder.Entity<SegmentStudioAnalysisCandidate>()
                .HasKey(candidate => candidate.Id);
            modelBuilder.Entity<SegmentStudioCorrespondingTagMapping>()
                .HasKey(mapping => mapping.SourceTagId);
            modelBuilder.Entity<SegmentStudioSegmentOperation>()
                .HasKey(operation => operation.OperationId);
            modelBuilder.Entity<SegmentStudioHistorySession>()
                .HasKey(session => session.Id);
            modelBuilder.Entity<SegmentStudioHistoryAction>(builder =>
            {
                builder.HasKey(action => action.Id);
                builder.HasOne(action => action.Session)
                    .WithMany(session => session.Actions)
                    .HasForeignKey(action => action.SessionId);
            });
            modelBuilder.Entity<SegmentStudioLineageNode>()
                .HasKey(node => node.Id);
            modelBuilder.Entity<SegmentStudioSlotDefinitionSet>()
                .HasKey(set => set.Id);
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
