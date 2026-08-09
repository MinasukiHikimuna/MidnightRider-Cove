namespace SegmentStudio.Tests;

using System.Text.Json;
using Cove.Core.Entities;
using Microsoft.EntityFrameworkCore;

public sealed class SegmentStudioBrowseAndSlotTests
{
    [Fact]
    public async Task BrowseUnionsPublishedNativeSegmentsAndOwnedDraftsBeforeFilteringAndPaging()
    {
        await using var db = CreateContext();
        var now = DateTime.UtcNow;
        db.AddRange(
            new Tag { Id = 10, Name = "Activity" },
            new Video { Id = 1, Title = "One", UpdatedAt = now },
            Segment(101, 1, 10, null, now),
            Segment(102, 1, 10, "rejected", now.AddSeconds(-1)),
            new SegmentStudioItem
            {
                VideoId = 1, TagId = 10, Kind = "tag", StartSec = 3, EndSec = 4,
                ReviewState = "unreviewed", Revision = 2, CreatedAt = now, UpdatedAt = now.AddSeconds(-2),
            },
            new SegmentStudioItem
            {
                VideoId = 1, TagId = 10, Kind = "tag", StartSec = 5, EndSec = 6,
                ReviewState = "rejected", Revision = 3, CreatedAt = now, UpdatedAt = now.AddSeconds(-3),
            });
        await db.SaveChangesAsync();

        var (all, error) = await SegmentStudioBrowseService.SearchAsync(
            db, new(null, null, [], [], 1, 2), includePerformers: true, CancellationToken.None);

        Assert.Null(error);
        Assert.Equal(4, all!.Total);
        Assert.Equal(2, all.Items.Count);
        Assert.All(all.Items.Where(item => item.Published), item =>
        {
            Assert.Equal("native", item.Residence);
            Assert.Equal("approved", item.ReviewState);
            Assert.NotNull(item.SegmentId);
            Assert.Null(item.ItemId);
        });

        var (rejected, rejectedError) = await SegmentStudioBrowseService.SearchAsync(
            db, new(null, null, ["rejected"], [], 1, 20), includePerformers: true, CancellationToken.None);

        Assert.Null(rejectedError);
        var draft = Assert.Single(rejected!.Items);
        Assert.Equal("extension", draft.Residence);
        Assert.False(draft.Published);
        Assert.Null(draft.SegmentId);
        Assert.NotNull(draft.ItemId);
        Assert.Equal(3, draft.Revision);
    }

    [Fact]
    public async Task BrowseActivitiesAndSlotFacetsIncludeOwnedDrafts()
    {
        await using var db = CreateContext();
        var now = DateTime.UtcNow;
        var set = new SegmentStudioSlotDefinitionSet { Id = Guid.NewGuid(), TagId = 10, CreatedAt = now };
        var definition = Definition(set.Id, 0);
        var draft = new SegmentStudioItem
        {
            VideoId = 1, TagId = 10, Kind = "tag", StartSec = 3, EndSec = 4,
            ReviewState = "unreviewed", Revision = 1, CreatedAt = now, UpdatedAt = now,
        };
        db.AddRange(
            new Tag { Id = 10, Name = "Activity" },
            new Video { Id = 1, Title = "One", UpdatedAt = now },
            Segment(101, 1, 10, null, now),
            set,
            definition,
            draft,
            new Performer { Id = 1, Name = "Draft performer" });
        await db.SaveChangesAsync();
        db.Add(new SegmentStudioSegmentSlot { ItemId = draft.Id, SlotDefinitionId = definition.Id, PerformerId = 1 });
        await db.SaveChangesAsync();

        var activity = Assert.Single(await SegmentStudioBrowseService.ActivitiesAsync(db, null, CancellationToken.None));
        Assert.Equal(2, activity.SegmentCount);
        var facets = await SegmentStudioBrowseService.FacetsAsync(db, 10, CancellationToken.None);
        Assert.NotNull(facets);
        Assert.Equal(2, facets.Activity.SegmentCount);
        var performer = Assert.Single(Assert.Single(facets.Slots).Performers);
        Assert.Equal(1, performer.Id);
        Assert.Equal(1, performer.AssignmentCount);

        var (filtered, error) = await SegmentStudioBrowseService.SearchAsync(
            db, new(null, 10, [], [new(definition.Id, 1)], 1, 20), includePerformers: true, CancellationToken.None);
        Assert.Null(error);
        var item = Assert.Single(filtered!.Items);
        Assert.Equal(draft.Id, item.ItemId);
    }

    [Fact]
    public async Task BrowseTreatsNativeSegmentsAsApprovedBeforeStateFilteringAndPaging()
    {
        await using var db = CreateContext();
        SeedBrowse(db);
        await db.SaveChangesAsync();

        var (all, error) = await SegmentStudioBrowseService.SearchAsync(db,
            new(null, null, [], [], 1, 2), includePerformers: true, CancellationToken.None);
        Assert.Null(error);
        Assert.Equal(3, all!.Total);
        Assert.Equal(2, all.Items.Count);

        var (selected, _) = await SegmentStudioBrowseService.SearchAsync(db,
            new(null, null, ["approved", "rejected"], [], 1, 20), true, CancellationToken.None);
        Assert.Equal(3, selected!.Total);
        Assert.All(selected.Items, item => Assert.Equal("approved", item.ReviewState));
    }

    [Fact]
    public async Task BrowseMatchesAnyNativeSelectedActivity()
    {
        await using var db = CreateContext();
        SeedBrowse(db);
        await db.SaveChangesAsync();

        var (result, error) = await SegmentStudioBrowseService.SearchAsync(db,
            new(null, null, [], [], 1, 20, ActivityTagIds: [10, 20]), true, CancellationToken.None);

        Assert.Null(error);
        Assert.Equal(3, result!.Total);

        db.Add(new TagParent { ParentId = 10, ChildId = 20 });
        await db.SaveChangesAsync();
        var (hierarchy, hierarchyError) = await SegmentStudioBrowseService.SearchAsync(db,
            new(null, null, [], [], 1, 20, ActivityTagIds: [10], IncludeActivitySubtags: true), true, CancellationToken.None);
        Assert.Null(hierarchyError);
        Assert.Equal(3, hierarchy!.Total);

        var (ascending, ascendingError) = await SegmentStudioBrowseService.SearchAsync(db,
            new(null, null, [], [], 1, 20, Direction: "asc"), true, CancellationToken.None);
        Assert.Null(ascendingError);
        Assert.Equal(103, ascending!.Items[0].SegmentId);
    }

    [Fact]
    public async Task BrowseRequiresAllSlotFiltersAndRejectsCrossActivitySlots()
    {
        await using var db = CreateContext();
        SeedBrowse(db);
        var set = new SegmentStudioSlotDefinitionSet { Id = Guid.NewGuid(), TagId = 10, CreatedAt = DateTime.UtcNow };
        var first = Definition(set.Id, 0); var second = Definition(set.Id, 1);
        var otherSet = new SegmentStudioSlotDefinitionSet { Id = Guid.NewGuid(), TagId = 20, CreatedAt = DateTime.UtcNow };
        var other = Definition(otherSet.Id, 0);
        var item101 = NativeItem(101); var item102 = NativeItem(102);
        db.AddRange(set, first, second, otherSet, other,
            new Performer { Id = 1, Name = "A" }, new Performer { Id = 2, Name = "B" },
            new SegmentStudioSegmentSlot { Item = item101, SlotDefinitionId = first.Id, PerformerId = 1 },
            new SegmentStudioSegmentSlot { Item = item101, SlotDefinitionId = second.Id, PerformerId = 2 },
            new SegmentStudioSegmentSlot { Item = item102, SlotDefinitionId = first.Id, PerformerId = 1 });
        await db.SaveChangesAsync();

        var (result, _) = await SegmentStudioBrowseService.SearchAsync(db,
            new(null, 10, [], [new(first.Id, 1), new(second.Id, 2)], 1, 20), true, CancellationToken.None);
        Assert.Equal([101], result!.Items.Select(item => item.SegmentId));
        var (invalid, error) = await SegmentStudioBrowseService.SearchAsync(db,
            new(null, 10, [], [new(other.Id, 1)], 1, 20), true, CancellationToken.None);
        Assert.Null(invalid);
        Assert.Contains("does not belong", error);
    }

    [Fact]
    public async Task BrowseMatchesPerformerAcrossUnnamedAndOverlappingSlotLabels()
    {
        await using var db = CreateContext();
        SeedBrowse(db);
        var set = new SegmentStudioSlotDefinitionSet { Id = Guid.NewGuid(), TagId = 10, CreatedAt = DateTime.UtcNow };
        var unnamed = Definition(set.Id, 0); unnamed.Label = null;
        var firstNamed = Definition(set.Id, 1); firstNamed.Label = "Participant";
        var secondNamed = Definition(set.Id, 2); secondNamed.Label = "Participant";
        var item101 = NativeItem(101); var item102 = NativeItem(102);
        db.AddRange(set, unnamed, firstNamed, secondNamed,
            new Performer { Id = 1, Name = "Matched" }, new Performer { Id = 2, Name = "Other" },
            new SegmentStudioSegmentSlot { Item = item101, SlotDefinitionId = unnamed.Id, PerformerId = 1 },
            new SegmentStudioSegmentSlot { Item = item102, SlotDefinitionId = secondNamed.Id, PerformerId = 1 },
            new SegmentStudioSegmentSlot { Item = item102, SlotDefinitionId = firstNamed.Id, PerformerId = 2 });
        await db.SaveChangesAsync();

        var (result, error) = await SegmentStudioBrowseService.SearchAsync(db,
            new(null, 10, [], [], 1, 20, PerformerId: 1), includePerformers: true, CancellationToken.None);

        Assert.Null(error);
        Assert.Equal([101, 102], result!.Items.Select(item => item.SegmentId).Order());

        var (multiResult, multiError) = await SegmentStudioBrowseService.SearchAsync(db,
            new(null, 10, [], [], 1, 20, PerformerIds: [2, 3]), includePerformers: true, CancellationToken.None);
        Assert.Null(multiError);
        Assert.Equal(102, Assert.Single(multiResult!.Items).SegmentId);

        var (restricted, restrictedError) = await SegmentStudioBrowseService.SearchAsync(db,
            new(null, 10, [], [], 1, 20, PerformerId: 1), includePerformers: false, CancellationToken.None);
        Assert.Null(restricted);
        Assert.Contains("unrestricted performer read access", restrictedError);

        var (invalid, invalidError) = await SegmentStudioBrowseService.SearchAsync(db,
            new(null, 10, [], [], 1, 20, PerformerId: 0), includePerformers: true, CancellationToken.None);
        Assert.Null(invalid);
        Assert.Contains("invalid", invalidError);
    }

    [Fact]
    public async Task AssignmentWritesEnforceRevisionActivityAndDuplicatePolicy()
    {
        await using var db = CreateContext();
        SeedBrowse(db);
        var set = new SegmentStudioSlotDefinitionSet { Id = Guid.NewGuid(), TagId = 10, CreatedAt = DateTime.UtcNow };
        var first = Definition(set.Id, 0); var second = Definition(set.Id, 1);
        db.AddRange(set, first, second, new Performer { Id = 1, Name = "A" });
        await db.SaveChangesAsync();
        var definitions = await PerformerSlotMutationService.LoadDefinitionsAsync(db, 10, CancellationToken.None);
        var slots = await PerformerSlotEditorService.LoadAsync(db, new Dictionary<int, int> { [101] = 10 }, CancellationToken.None);
        var initial = await PerformerSlotMutationService.UpdateAssignmentsAsync(db, 1, 101,
            new("stale", []), CancellationToken.None);
        Assert.Equal(SlotMutationStatus.Conflict, initial.Status);
        var duplicate = await PerformerSlotMutationService.UpdateAssignmentsAsync(db, 1, 101,
            new(initial.Value!.Revision, [new(first.Id, 1), new(second.Id, 1)]), CancellationToken.None);
        Assert.Equal(SlotMutationStatus.Invalid, duplicate.Status);
        Assert.NotNull(definitions);
        Assert.NotNull(slots);
    }

    [Fact]
    public async Task BrowseHonorsVideoAndTagEntityVisibilityInCountsAndResults()
    {
        await using var db = CreateContext(allowedVideoId: 1, allowedTagId: 10);
        SeedBrowse(db);
        await db.SaveChangesAsync();

        var activities = await SegmentStudioBrowseService.ActivitiesAsync(db, null, CancellationToken.None);
        var activity = Assert.Single(activities);
        Assert.Equal(10, activity.TagId);
        Assert.Equal(2, activity.SegmentCount);
        var (result, error) = await SegmentStudioBrowseService.SearchAsync(db, new(null, null, [], [], 1, 20), true, CancellationToken.None);
        Assert.Null(error);
        Assert.Equal([101, 102], result!.Items.Select(item => item.SegmentId).Order());
        var visibleTagSet = new SegmentStudioSlotDefinitionSet { Id = Guid.NewGuid(), TagId = 10, CreatedAt = DateTime.UtcNow };
        var crossScopeDefinition = Definition(visibleTagSet.Id, 0);
        var item104 = NativeItem(104);
        db.AddRange(visibleTagSet, crossScopeDefinition,
            new Segment { Id = 104, HostType = SegmentHostType.Video, HostId = 2, Kind = "tag", TagId = 10 },
            new Performer { Id = 91, Name = "Scoped" },
            new SegmentStudioSegmentSlot { Item = item104, SlotDefinitionId = crossScopeDefinition.Id, PerformerId = 91 });
        await db.SaveChangesAsync();
        Assert.Equal([2], await PerformerSlotMutationService.LoadAffectedVideoIdsAsync(db, 10, [], CancellationToken.None));
        var hiddenSet = new SegmentStudioSlotDefinitionSet { Id = Guid.NewGuid(), TagId = 20, CreatedAt = DateTime.UtcNow };
        db.Add(hiddenSet);
        await db.SaveChangesAsync();
        Assert.Null(await PerformerSlotMutationService.LoadDefinitionsAsync(db, 20, CancellationToken.None));
    }

    [Fact]
    public async Task DefinitionSummariesListOnlySlotBearingVisibleTagsInStableOrder()
    {
        await using var db = CreateContext();
        var alphaSet = new SegmentStudioSlotDefinitionSet
        {
            Id = Guid.Parse("10000000-0000-0000-0000-000000000001"),
            TagId = 10,
            CreatedAt = DateTime.UtcNow,
        };
        var betaSet = new SegmentStudioSlotDefinitionSet
        {
            Id = Guid.Parse("10000000-0000-0000-0000-000000000002"),
            TagId = 20,
            AllowSamePerformerInMultipleSlots = true,
            CreatedAt = DateTime.UtcNow,
        };
        var emptySet = new SegmentStudioSlotDefinitionSet
        {
            Id = Guid.Parse("10000000-0000-0000-0000-000000000003"),
            TagId = 30,
            CreatedAt = DateTime.UtcNow,
        };
        var alphaSecond = new SegmentStudioSlotDefinition
        {
            Id = Guid.Parse("20000000-0000-0000-0000-000000000002"),
            SlotDefinitionSetId = alphaSet.Id,
            Label = null,
            SortOrder = 1,
            CreatedAt = DateTime.UtcNow,
        };
        var alphaFirst = new SegmentStudioSlotDefinition
        {
            Id = Guid.Parse("20000000-0000-0000-0000-000000000001"),
            SlotDefinitionSetId = alphaSet.Id,
            Label = "Giver",
            SortOrder = 0,
            CreatedAt = DateTime.UtcNow,
        };
        var betaOnly = new SegmentStudioSlotDefinition
        {
            Id = Guid.Parse("20000000-0000-0000-0000-000000000003"),
            SlotDefinitionSetId = betaSet.Id,
            Label = "Receiver",
            SortOrder = 0,
            CreatedAt = DateTime.UtcNow,
        };
        db.AddRange(
            new Tag { Id = 10, Name = "Alpha" },
            new Tag { Id = 20, Name = "beta" },
            new Tag { Id = 30, Name = "Empty" },
            alphaSet,
            betaSet,
            emptySet,
            alphaSecond,
            alphaFirst,
            betaOnly,
            new SegmentStudioSlotDefinitionGenderHint
            {
                SlotDefinitionId = alphaFirst.Id,
                GenderHint = "TRANSGENDER_FEMALE",
            },
            new SegmentStudioSlotDefinitionGenderHint
            {
                SlotDefinitionId = alphaFirst.Id,
                GenderHint = "FEMALE",
            });
        await db.SaveChangesAsync();

        var result = await PerformerSlotMutationService.ListDefinitionSummariesAsync(
            db,
            CancellationToken.None);

        Assert.Equal([10, 20], result.Select(item => item.TagId));
        Assert.Collection(
            result,
            alpha =>
            {
                Assert.Equal("Alpha", alpha.TagName);
                Assert.False(alpha.AllowSamePerformerInMultipleSlots);
                Assert.Equal([alphaFirst.Id, alphaSecond.Id], alpha.Definitions.Select(item => item.Id));
                Assert.Equal(["FEMALE", "TRANSGENDER_FEMALE"], alpha.Definitions[0].GenderHints);
                Assert.Null(alpha.Definitions[1].Label);
            },
            beta =>
            {
                Assert.Equal("beta", beta.TagName);
                Assert.True(beta.AllowSamePerformerInMultipleSlots);
                Assert.Equal("Receiver", Assert.Single(beta.Definitions).Label);
            });
    }

    [Fact]
    public async Task DefinitionCrudPreservesIdsAndRequiresFreshConfirmedDeletionOfAssignedSlots()
    {
        await using var db = CreateContext();
        db.AddRange(new Tag { Id = 10, Name = "Activity" }, new Performer { Id = 1, Name = "A" }, new Performer { Id = 2, Name = "B" },
            new Video { Id = 1, Title = "Video" },
            new Segment { Id = 101, HostType = SegmentHostType.Video, HostId = 1, Kind = "tag", TagId = 10 });
        await db.SaveChangesAsync();
        var created = await PerformerSlotMutationService.UpdateDefinitionsAsync(db, 10,
            new("", false, [new(null, "First", 0, ["FEMALE"]), new(null, "Second", 1, [])]), CancellationToken.None);
        Assert.Equal(SlotMutationStatus.Updated, created.Status);
        var firstId = created.Value!.Definitions[0].Id;
        var secondId = created.Value.Definitions[1].Id;
        var reordered = await PerformerSlotMutationService.UpdateDefinitionsAsync(db, 10,
            new(created.Value.Revision, false, [new(secondId, "Renamed", 0, []), new(firstId, "First", 1, ["FEMALE"])]), CancellationToken.None);
        Assert.Equal([secondId, firstId], reordered.Value!.Definitions.Select(item => item.Id));
        db.Add(new SegmentStudioSegmentSlot { Item = NativeItem(101), SlotDefinitionId = firstId, PerformerId = 1 });
        await db.SaveChangesAsync();
        Assert.Equal([1], await PerformerSlotMutationService.LoadAffectedVideoIdsAsync(
            db, 10, [new(secondId, "Renamed", 0, [])], CancellationToken.None));
        var fresh = await PerformerSlotMutationService.LoadDefinitionsAsync(db, 10, CancellationToken.None);
        var trackedAssignment = await db.Set<SegmentStudioSegmentSlot>().SingleAsync(slot => slot.SlotDefinitionId == firstId);
        trackedAssignment.PerformerId = 2;
        await db.SaveChangesAsync();
        var identityChanged = await PerformerSlotMutationService.LoadDefinitionsAsync(db, 10, CancellationToken.None);
        Assert.NotEqual(fresh!.Revision, identityChanged!.Revision);
        var stale = await PerformerSlotMutationService.UpdateDefinitionsAsync(db, 10,
            new(fresh.Revision, false, [new(secondId, "Renamed", 0, [])], ConfirmDeleteAssigned: true), CancellationToken.None);
        Assert.Equal(SlotMutationStatus.Conflict, stale.Status);
        fresh = identityChanged;
        var refused = await PerformerSlotMutationService.UpdateDefinitionsAsync(db, 10,
            new(fresh!.Revision, false, [new(secondId, "Renamed", 0, [])]), CancellationToken.None);
        Assert.Equal(SlotMutationStatus.Invalid, refused.Status);
        var deleted = await PerformerSlotMutationService.UpdateDefinitionsAsync(db, 10,
            new(fresh.Revision, false, [new(secondId, "Renamed", 0, [])], ConfirmDeleteAssigned: true), CancellationToken.None);
        Assert.Equal(SlotMutationStatus.Updated, deleted.Status);
    }

    [Fact]
    public async Task AssignmentCanReplaceAndClearButRejectsWrongActivityDefinition()
    {
        await using var db = CreateContext();
        SeedBrowse(db);
        var set = new SegmentStudioSlotDefinitionSet { Id = Guid.NewGuid(), TagId = 10, CreatedAt = DateTime.UtcNow };
        var definition = Definition(set.Id, 0);
        var otherSet = new SegmentStudioSlotDefinitionSet { Id = Guid.NewGuid(), TagId = 20, CreatedAt = DateTime.UtcNow };
        var other = Definition(otherSet.Id, 0);
        db.AddRange(set, definition, otherSet, other, new Performer { Id = 1, Name = "A" }, new Performer { Id = 2, Name = "B" });
        await db.SaveChangesAsync();
        var conflict = await PerformerSlotMutationService.UpdateAssignmentsAsync(db, 1, 101, new("", []), CancellationToken.None);
        var saved = await PerformerSlotMutationService.UpdateAssignmentsAsync(db, 1, 101,
            new(conflict.Value!.Revision, [new(definition.Id, 1)]), CancellationToken.None);
        var replaced = await PerformerSlotMutationService.UpdateAssignmentsAsync(db, 1, 101,
            new(saved.Value!.Revision, [new(definition.Id, 2)]), CancellationToken.None);
        Assert.Equal(2, Assert.Single(replaced.Value!.Slots).PerformerId);
        var stableItem = Assert.Single(await db.Set<SegmentStudioItem>().ToListAsync());
        Assert.Equal(101, stableItem.NativeSegmentId);
        Assert.All(await db.Set<SegmentStudioSegmentSlot>().ToListAsync(), slot => Assert.Equal(stableItem.Id, slot.ItemId));
        var invalid = await PerformerSlotMutationService.UpdateAssignmentsAsync(db, 1, 101,
            new(replaced.Value.Revision, [new(other.Id, 1)]), CancellationToken.None);
        Assert.Equal(SlotMutationStatus.Invalid, invalid.Status);
        var cleared = await PerformerSlotMutationService.UpdateAssignmentsAsync(db, 1, 101,
            new(replaced.Value.Revision, [new(definition.Id, null)]), CancellationToken.None);
        Assert.Null(Assert.Single(cleared.Value!.Slots).PerformerId);
    }

    [Fact]
    public async Task AssignmentTreatsAHiddenActivityTagAsNotFoundBeforeSlotValidation()
    {
        await using var db = CreateContext(allowedTagId: 20);
        SeedBrowse(db);
        var set = new SegmentStudioSlotDefinitionSet { Id = Guid.NewGuid(), TagId = 10, CreatedAt = DateTime.UtcNow };
        var definition = Definition(set.Id, 0);
        db.AddRange(set, definition, new Performer { Id = 1, Name = "A" });
        await db.SaveChangesAsync();
        var result = await PerformerSlotMutationService.UpdateAssignmentsAsync(db, 1, 101,
            new("anything", [new(definition.Id, 1)]), CancellationToken.None);
        Assert.Equal(SlotMutationStatus.NotFound, result.Status);
    }

    [Fact]
    public async Task OwnedDraftAssignmentsPreserveApprovalAndUseStableItemIdentity()
    {
        await using var db = CreateContext();
        SeedBrowse(db);
        var set = new SegmentStudioSlotDefinitionSet { Id = Guid.NewGuid(), TagId = 10, CreatedAt = DateTime.UtcNow };
        var definition = Definition(set.Id, 0);
        var draft = new SegmentStudioItem
        {
            ReviewState = "approved", VideoId = 1, StartSec = 4, EndSec = 8,
            TagId = 10, Kind = "tag", SourceKey = "import", Revision = 2,
            CreatedAt = DateTime.UtcNow, UpdatedAt = DateTime.UtcNow.AddDays(-1),
        };
        var originalUpdatedAt = draft.UpdatedAt;
        db.AddRange(set, definition, draft,
            new Performer { Id = 1, Name = "A" },
            new Performer { Id = 2, Name = "B" });
        await db.SaveChangesAsync();
        var current = await PerformerSlotMutationService.UpdateOwnedAssignmentsAsync(
            db, 1, draft.Id, new("", []), CancellationToken.None);

        var saved = await PerformerSlotMutationService.UpdateOwnedAssignmentsAsync(
            db, 1, draft.Id,
            new(current.Value!.Revision, [new(definition.Id, 1)]), CancellationToken.None);

        Assert.Equal(SlotMutationStatus.Updated, saved.Status);
        Assert.Equal(-draft.Id, saved.Value!.SegmentId);
        Assert.Equal(1, Assert.Single(saved.Value.Slots).PerformerId);
        Assert.Equal(draft.Id, Assert.Single(await db.Set<SegmentStudioSegmentSlot>().ToListAsync()).ItemId);
        var changedDraft = await db.Set<SegmentStudioItem>().SingleAsync(item => item.Id == draft.Id);
        Assert.Equal(3, changedDraft.Revision);
        Assert.Equal("approved", changedDraft.ReviewState);
        Assert.True(changedDraft.UpdatedAt > originalUpdatedAt);

        var replaced = await PerformerSlotMutationService.UpdateOwnedAssignmentsAsync(
            db, 1, draft.Id,
            new(saved.Value.Revision, [new(definition.Id, 2)]), CancellationToken.None);

        Assert.Equal(SlotMutationStatus.Updated, replaced.Status);
        var replacedDraft = await db.Set<SegmentStudioItem>().SingleAsync(item => item.Id == draft.Id);
        Assert.Equal(4, replacedDraft.Revision);
        Assert.Equal("approved", replacedDraft.ReviewState);

        var cleared = await PerformerSlotMutationService.UpdateOwnedAssignmentsAsync(
            db, 1, draft.Id,
            new(replaced.Value!.Revision, [new(definition.Id, null)]), CancellationToken.None);

        Assert.Equal(SlotMutationStatus.Updated, cleared.Status);
        var clearedDraft = await db.Set<SegmentStudioItem>().SingleAsync(item => item.Id == draft.Id);
        Assert.Equal(5, clearedDraft.Revision);
        Assert.Equal("approved", clearedDraft.ReviewState);

        var noOp = await PerformerSlotMutationService.UpdateOwnedAssignmentsAsync(
            db, 1, draft.Id,
            new(cleared.Value!.Revision, [new(definition.Id, null)]), CancellationToken.None);

        Assert.Equal(SlotMutationStatus.Updated, noOp.Status);
        var unchangedDraft = await db.Set<SegmentStudioItem>().SingleAsync(item => item.Id == draft.Id);
        Assert.Equal(5, unchangedDraft.Revision);
        Assert.Equal(clearedDraft.UpdatedAt, unchangedDraft.UpdatedAt);
    }

    private static SegmentStudioSlotDefinition Definition(Guid setId, int order) => new()
        { Id = Guid.NewGuid(), SlotDefinitionSetId = setId, SortOrder = order, Label = $"Slot {order}", CreatedAt = DateTime.UtcNow };

    private static SegmentStudioItem NativeItem(int segmentId) => new()
        { NativeSegmentId = segmentId, CreatedAt = DateTime.UtcNow, UpdatedAt = DateTime.UtcNow };

    private static void SeedBrowse(TestDb db)
    {
        var now = DateTime.UtcNow;
        db.AddRange(new Tag { Id = 10, Name = "Activity" }, new Tag { Id = 20, Name = "Other" },
            new Video { Id = 1, Title = "One", UpdatedAt = now }, new Video { Id = 2, Title = "Two", UpdatedAt = now.AddMinutes(-1) },
            Segment(101, 1, 10, "approved", now), Segment(102, 1, 10, "rejected", now), Segment(103, 2, 20, null, now),
            new SegmentStudioReviewSegment { SegmentId = 101, VideoId = 1, TagId = 10, ReviewState = "approved" },
            new SegmentStudioReviewSegment { SegmentId = 102, VideoId = 1, TagId = 10, ReviewState = "rejected" },
            new SegmentStudioReviewSegment { SegmentId = 103, VideoId = 2, TagId = 20, ReviewState = "unreviewed" });
    }

    private static Segment Segment(int id, int video, int tag, string? state, DateTime now) => new()
    {
        Id = id, HostType = SegmentHostType.Video, HostId = video, Kind = "tag", TagId = tag, StartSec = id,
        UpdatedAt = now, Payload = state is null ? null : JsonDocument.Parse($"{{\"segmentStudio\":{{\"reviewState\":\"{state}\"}}}}")
    };

    private static TestDb CreateContext(int? allowedVideoId = null, int? allowedTagId = null) => new(new DbContextOptionsBuilder<TestDb>()
        .UseInMemoryDatabase(Guid.NewGuid().ToString()).Options, allowedVideoId, allowedTagId);

    private sealed class TestDb(DbContextOptions<TestDb> options, int? allowedVideoId, int? allowedTagId) : DbContext(options)
    {
        protected override void OnModelCreating(ModelBuilder builder)
        {
            builder.Entity<Tag>().HasKey(item => item.Id);
            builder.Entity<Tag>().HasQueryFilter(item => allowedTagId == null || item.Id == allowedTagId);
            builder.Entity<Tag>().Ignore(item => item.ParentRelations).Ignore(item => item.ChildRelations).Ignore(item => item.RemoteIds)
                .Ignore(item => item.VideoTags).Ignore(item => item.PerformerTags).Ignore(item => item.ImageTags).Ignore(item => item.GalleryTags)
                .Ignore(item => item.StudioTags).Ignore(item => item.GroupTags).Ignore(item => item.Aliases).Ignore(item => item.TagGroup);
            builder.Entity<TagParent>().HasKey(item => new { item.ParentId, item.ChildId });
            builder.Entity<TagParent>().Ignore(item => item.Parent).Ignore(item => item.Child);
            builder.Entity<Video>().HasKey(item => item.Id);
            builder.Entity<Video>().HasQueryFilter(item => allowedVideoId == null || item.Id == allowedVideoId);
            builder.Entity<Video>().Ignore(item => item.Urls).Ignore(item => item.VideoTags).Ignore(item => item.VideoPerformers)
                .Ignore(item => item.VideoGalleries).Ignore(item => item.GroupItems).Ignore(item => item.RemoteIds).Ignore(item => item.PlayHistory)
                .Ignore(item => item.ParentVideo).Ignore(item => item.ChildVideos).Ignore(item => item.Studio);
            builder.Entity<BaseFileEntity>().HasKey(item => item.Id);
            builder.Entity<BaseFileEntity>().Ignore(item => item.ParentFolder).Ignore(item => item.Fingerprints);
            builder.Entity<Segment>().HasKey(item => item.Id);
            builder.Entity<Segment>().Property(item => item.Payload).HasConversion(
                value => value == null ? null : value.RootElement.GetRawText(),
                value => value == null ? null : JsonDocument.Parse(value, default(JsonDocumentOptions)));
            builder.Entity<Performer>().HasKey(item => item.Id);
            builder.Entity<Performer>().Ignore(item => item.Urls).Ignore(item => item.Aliases).Ignore(item => item.PerformerTags)
                .Ignore(item => item.VideoPerformers).Ignore(item => item.ImagePerformers).Ignore(item => item.GalleryPerformers).Ignore(item => item.RemoteIds);
            builder.Entity<SegmentStudioSlotDefinitionSet>().HasKey(item => item.Id);
            builder.Entity<SegmentStudioSlotDefinition>().HasKey(item => item.Id);
            builder.Entity<SegmentStudioSlotDefinitionGenderHint>().HasKey(item => new { item.SlotDefinitionId, item.GenderHint });
            builder.Entity<SegmentStudioItem>().HasKey(item => item.Id);
            builder.Entity<SegmentStudioSegmentSlot>().HasKey(item => new { item.ItemId, item.SlotDefinitionId });
            builder.Entity<SegmentStudioSegmentSlot>().HasOne(item => item.Item).WithMany(item => item.Slots).HasForeignKey(item => item.ItemId);
            builder.Entity<SegmentStudioReviewSegment>().HasKey(item => item.SegmentId);
            builder.Entity<VideoPerformer>().HasKey(item => new { item.VideoId, item.PerformerId });
        }
    }
}
