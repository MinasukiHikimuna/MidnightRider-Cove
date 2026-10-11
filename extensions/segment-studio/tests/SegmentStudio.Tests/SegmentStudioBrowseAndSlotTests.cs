namespace SegmentStudio.Tests;

using System.Text.Json;
using Cove.Core.Entities;
using Cove.Core.Interfaces;
using Microsoft.Data.Sqlite;
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
            db, new(null, [], 1, 2), includePerformers: true, CancellationToken.None);

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
            db, new(null, ["rejected"], 1, 20), includePerformers: true, CancellationToken.None);

        Assert.Null(rejectedError);
        var draft = Assert.Single(rejected!.Items);
        Assert.Equal("extension", draft.Residence);
        Assert.False(draft.Published);
        Assert.Null(draft.SegmentId);
        Assert.NotNull(draft.ItemId);
        Assert.Equal(3, draft.Revision);
    }

    [Fact]
    public async Task BrowseActivitiesAndSlotRolesIncludeOwnedDrafts()
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
        var role = Assert.Single(await SegmentStudioBrowseService.RolesAsync(db, CancellationToken.None));
        Assert.Equal(("slot 0", "Slot 0", 1), (role.Key, role.Label, role.TagCount));
        Assert.Equal(definition.Id, Assert.Single(role.SlotDefinitionIds));

        var (filtered, error) = await SegmentStudioBrowseService.SearchAsync(
            db, new(null, [], 1, 20, SlottedPerformer: new("Slot 0", Includes(1))), includePerformers: true, CancellationToken.None);
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
            new(null, [], 1, 2), includePerformers: true, CancellationToken.None);
        Assert.Null(error);
        Assert.Equal(3, all!.Total);
        Assert.Equal(2, all.Items.Count);

        var (selected, _) = await SegmentStudioBrowseService.SearchAsync(db,
            new(null, ["approved", "rejected"], 1, 20), true, CancellationToken.None);
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
            new(null, [], 1, 20, ActivityTagIds: [10, 20]), true, CancellationToken.None);

        Assert.Null(error);
        Assert.Equal(3, result!.Total);

        db.Add(new TagParent { ParentId = 10, ChildId = 20 });
        await db.SaveChangesAsync();
        var (hierarchy, hierarchyError) = await SegmentStudioBrowseService.SearchAsync(db,
            new(null, [], 1, 20, ActivityTagIds: [10], IncludeActivitySubtags: true), true, CancellationToken.None);
        Assert.Null(hierarchyError);
        Assert.Equal(3, hierarchy!.Total);

        var (ascending, ascendingError) = await SegmentStudioBrowseService.SearchAsync(db,
            new(null, [], 1, 20, Direction: "asc"), true, CancellationToken.None);
        Assert.Null(ascendingError);
        Assert.Equal(103, ascending!.Items[0].SegmentId);
    }

    [Fact]
    public async Task BrowseRoleFiltersFollowRelatedPerformerModesAcrossTags()
    {
        await using var db = await CreateSqliteContextAsync();
        await SeedRolesAsync(db);

        Assert.Equal([("giver", "Giver", 2), ("receiver", "Receiver", 1)],
            (await SegmentStudioBrowseService.RolesAsync(db, CancellationToken.None)).Select(role => (role.Key, role.Label, role.TagCount)));

        Assert.Equal(new int?[] { 101, 103 }, await SearchRoles(db, new BrowseRoleFilter("GIVER", Includes(1))));
        Assert.Equal(new int?[] { 101 }, await SearchRoles(db, new BrowseRoleFilter("giver", Includes(1)), new BrowseRoleFilter("receiver", Includes(2))));
        Assert.Equal(new int?[] { 101, 102, 103 }, await SearchRoles(db, new BrowseRoleFilter(SegmentStudioBrowseService.AnySlotRole, Includes(1))));
        Assert.Equal(new int?[] { 101 }, await SearchRoles(db, new BrowseRoleFilter("receiver", Includes(1, RelatedFilterMode.None))));
        var legacyExclude = Includes(1); legacyExclude.Exclude = true;
        Assert.Equal(new int?[] { 101, 103, 104 }, await SearchRoles(db, new BrowseRoleFilter("receiver", legacyExclude)));
        Assert.Equal(new int?[] { 101, 103 }, await SearchRoles(db, new BrowseRoleFilter("giver", Includes(1, RelatedFilterMode.Every))));
        Assert.Empty(await SearchRoles(db, new BrowseRoleFilter("giver", Includes(2, RelatedFilterMode.Every))));
        Assert.Equal(new int?[] { 101, 102, 103 }, await SearchRoles(db, new BrowseRoleFilter("*", new RelatedFilterCriterion<PerformerFilter>())));
        Assert.Empty(await SearchRoles(db, new BrowseRoleFilter("unknown", Includes(1))));
        Assert.Empty(await SearchRoles(db, new BrowseRoleFilter("  ", Includes(1))));
    }

    [Fact]
    public async Task BrowseRoleFiltersFindUnassignedSlotsIncludingSegmentsWithoutSlotRecords()
    {
        await using var db = await CreateSqliteContextAsync();
        await SeedRolesAsync(db);

        Assert.Equal(new int?[] { 102, 104 }, await SearchRoles(db, new BrowseRoleFilter("giver", Unassigned: true)));
        Assert.Equal(new int?[] { 101, 103 }, await SearchRoles(db, new BrowseRoleFilter("giver", Unassigned: false)));
        Assert.Equal(new int?[] { 104 }, await SearchRoles(db, new BrowseRoleFilter("receiver", Unassigned: true)));
        var anyCondition = Includes(1); anyCondition.ConditionOperator = RelatedFilterConditionOperator.Or;
        Assert.Equal(new int?[] { 101, 102, 103, 104 }, await SearchRoles(db, new BrowseRoleFilter("giver", anyCondition, Unassigned: true)));
        Assert.Equal(new int?[] { 101, 103 }, await SearchRoles(db, new BrowseRoleFilter("giver", Includes(1), Unassigned: false)));
    }

    [Fact]
    public async Task BrowseSpecificPerformersAreAConditionOnOneAssignedPerformer()
    {
        await using var db = await CreateSqliteContextAsync();
        await SeedRolesAsync(db);
        RelatedFilterCriterion<PerformerFilter> All(RelatedFilterMode mode, params int[] ids) => new()
        {
            Mode = mode,
            PerformerIdsCriterion = new() { Value = [.. ids], Modifier = CriterionModifier.IncludesAll },
        };

        Assert.Empty(await SearchRoles(db, new BrowseRoleFilter("*", All(RelatedFilterMode.AtLeastOne, 1, 2))));
        Assert.Equal(new int?[] { 101, 102, 103 }, await SearchRoles(db, new BrowseRoleFilter("*", All(RelatedFilterMode.AtLeastOne, 1))));
        Assert.Empty(await SearchRoles(db, new BrowseRoleFilter("giver", All(RelatedFilterMode.None, 1))));
        Assert.Equal(new int?[] { 102, 103 }, await SearchRoles(db, new BrowseRoleFilter("*", All(RelatedFilterMode.Every, 1))));
        var withAge = All(RelatedFilterMode.AtLeastOne, 1); withAge.AgeAtHostDateCriterion = new() { Value = 30, Modifier = CriterionModifier.Equals };
        Assert.Empty(await SearchRoles(db, new BrowseRoleFilter("*", withAge)));
        var withExcluded = All(RelatedFilterMode.AtLeastOne, 1); withExcluded.PerformerIdsCriterion!.Excludes = [2];
        Assert.Equal(new int?[] { 101, 102, 103 }, await SearchRoles(db, new BrowseRoleFilter("*", withExcluded)));
        // A Slot with "none" and no other condition asks for segments with nobody assigned to that role.
        Assert.Equal(new int?[] { 103, 104 }, await SearchRoles(db, new BrowseRoleFilter("receiver", new() { Mode = RelatedFilterMode.None })));
    }

    [Fact]
    public async Task BrowseRoleFiltersMatchAgeOnTheVideoDate()
    {
        await using var db = await CreateSqliteContextAsync();
        await SeedRolesAsync(db);
        RelatedFilterCriterion<PerformerFilter> Age(CriterionModifier modifier, int value = 19) => new()
        {
            AgeAtHostDateCriterion = new() { Value = value, Modifier = modifier },
        };

        Assert.Equal(new int?[] { 101 }, await SearchRoles(db, new BrowseRoleFilter("giver", Age(CriterionModifier.Equals))));
        Assert.Empty(await SearchRoles(db, new BrowseRoleFilter("giver", Age(CriterionModifier.NotEquals))));
        Assert.Equal(new int?[] { 101 }, await SearchRoles(db, new BrowseRoleFilter("receiver", Age(CriterionModifier.GreaterThan, 25))));
        Assert.Equal(new int?[] { 103 }, await SearchRoles(db, new BrowseRoleFilter("giver", Age(CriterionModifier.IsNull))));
    }

    [Fact]
    public async Task BrowseRoleFiltersResolveNestedPerformerConditionsLikeRelatedPerformers()
    {
        await using var db = await CreateSqliteContextAsync();
        await SeedRolesAsync(db);
        var searches = new List<(PerformerFilter? Filter, FindFilter Find)>();
        Task<IReadOnlyCollection<int>> Find(PerformerFilter? filter, FindFilter find, CancellationToken _)
        {
            searches.Add((filter, find));
            IReadOnlyCollection<int> ids = filter?.Name == "B" ? [2] : filter?.FavoriteCriterion is not null ? [3] : find.Q == "a" ? [1] : [];
            return Task.FromResult(ids);
        }
        var nested = new RelatedFilterCriterion<PerformerFilter>
        {
            ObjectFilter = new() { Name = "B", FavoriteCriterion = new() { Value = true } },
            FindFilter = new() { Q = "a" },
            ConditionOperator = RelatedFilterConditionOperator.Or,
        };

        Assert.Equal(new int?[] { 101, 102, 103 }, await SearchRoles(db, Find, new BrowseRoleFilter("*", nested)));
        Assert.Equal(3, searches.Count);
        Assert.All(searches, search => Assert.Equal(int.MaxValue, search.Find.PerPage));
        Assert.Contains(searches, search => search.Filter is null && search.Find.Q == "a");
        Assert.Contains(searches, search => search.Filter is { Name: "B", FavoriteCriterion: null });
        Assert.Contains(searches, search => search.Filter is { Name: null, FavoriteCriterion: not null });

        searches.Clear();
        nested.ConditionOperator = RelatedFilterConditionOperator.And;
        Assert.Equal(new int?[] { 101 }, await SearchRoles(db, Find, new BrowseRoleFilter("*", nested)));
        var single = Assert.Single(searches);
        Assert.Equal(("B", "a"), (single.Filter!.Name, single.Find.Q));

        searches.Clear();
        var empty = Includes(2); empty.ObjectFilter = new(); empty.ConditionOperator = RelatedFilterConditionOperator.Or;
        Assert.Equal(new int?[] { 101 }, await SearchRoles(db, Find, new BrowseRoleFilter("*", empty)));
        Assert.Empty(searches);

        var (unresolved, unresolvedError) = await SegmentStudioBrowseService.SearchAsync(db,
            new(null, [], 1, 20, SlottedPerformer: new("giver", nested)), true, CancellationToken.None);
        Assert.Null(unresolved);
        Assert.NotNull(unresolvedError);
    }

    [Fact]
    public async Task BrowseRoleFiltersRejectRestrictedOrConditionlessRequests()
    {
        await using var db = await CreateSqliteContextAsync();
        await SeedRolesAsync(db);
        async Task<string?> Error(BrowseRoleFilter[] roles, bool includePerformers = true)
            => (await SegmentStudioBrowseService.SearchAsync(db, Request(roles), includePerformers, CancellationToken.None)).Error;

        Assert.Contains("unrestricted performer read access", await Error([new("giver", Includes(1))], includePerformers: false));
        Assert.Contains("needs a condition", await Error([new("giver")]));
        Assert.Contains("At most", await Error(Enumerable.Range(0, 17).Select(_ => new BrowseRoleFilter("giver", Includes(1))).ToArray()));
        var notWithTwo = new FilterExpression<BrowseCriteria> { Operator = FilterExpressionOperator.Not, Children = [Leaf(new("giver", Includes(1))), Leaf(new("giver", Includes(2)))] };
        Assert.Contains("exactly one", (await SegmentStudioBrowseService.SearchAsync(db, new(null, FilterExpression: notWithTwo), true, CancellationToken.None)).Error);
    }

    [Fact]
    public async Task BrowseFilterExpressionsCombineTagsStatesAndSlottedPerformers()
    {
        await using var db = await CreateSqliteContextAsync();
        await SeedRolesAsync(db);
        async Task<int?[]> Search(FilterExpression<BrowseCriteria> expression, BrowseRoleFilter? topLevel = null)
        {
            var (result, error) = await SegmentStudioBrowseService.SearchAsync(db,
                new(null, SlottedPerformer: topLevel, FilterExpression: expression), true, CancellationToken.None);
            Assert.Null(error);
            return result!.Items.Select(item => item.SegmentId).Order().ToArray();
        }
        FilterExpression<BrowseCriteria> Group(FilterExpressionOperator op, params FilterExpressionNode<BrowseCriteria>[] children) => new() { Operator = op, Children = [.. children] };

        Assert.Equal(new int?[] { 101, 102, 103 }, await Search(Group(FilterExpressionOperator.Or,
            Leaf(new("giver", Includes(1))), Leaf(new("receiver", Includes(1))))));
        Assert.Equal(new int?[] { 104 }, await Search(Group(FilterExpressionOperator.Not,
            new FilterExpressionNode<BrowseCriteria> { Filter = new(SlottedPerformer: new("*", new RelatedFilterCriterion<PerformerFilter>())) })));
        Assert.Equal(new int?[] { 102, 103, 104 }, await Search(Group(FilterExpressionOperator.JustOne,
            Leaf(new("giver", Includes(1))), new FilterExpressionNode<BrowseCriteria> { Filter = new(ActivityTagIds: [10]) })));
        Assert.Equal(new int?[] { 103 }, await Search(Group(FilterExpressionOperator.And,
            new FilterExpressionNode<BrowseCriteria> { Filter = new(ActivityTagIds: [20]) },
            new FilterExpressionNode<BrowseCriteria> { Group = Group(FilterExpressionOperator.Or, Leaf(new("giver", Includes(1))), Leaf(new("receiver", Includes(2)))) })));
        Assert.Equal(new int?[] { 101 }, await Search(Group(FilterExpressionOperator.And, Leaf(new("receiver", Includes(2)))), new("giver", Includes(1))));
    }

    [Fact]
    public async Task BrowseDistinctSlottedPerformersNeedADifferentSlotEach()
    {
        await using var db = await CreateSqliteContextAsync();
        await SeedRolesAsync(db);
        var set = new SegmentStudioSlotDefinitionSet { Id = Guid.NewGuid(), TagId = 30, CreatedAt = DateTime.UtcNow };
        var first = Definition(set.Id, 0); first.Label = "Giver";
        var second = Definition(set.Id, 1); second.Label = "Giver";
        var both = NativeItem(105); var one = NativeItem(106);
        db.AddRange(new Tag { Id = 30, Name = "Double" }, set, first, second,
            Segment(105, 1, 30, null, DateTime.UtcNow), Segment(106, 2, 30, null, DateTime.UtcNow),
            new SegmentStudioSegmentSlot { Item = both, SlotDefinitionId = first.Id, PerformerId = 1 },
            new SegmentStudioSegmentSlot { Item = both, SlotDefinitionId = second.Id, PerformerId = 3 },
            new SegmentStudioSegmentSlot { Item = one, SlotDefinitionId = first.Id, PerformerId = 1 });
        await db.SaveChangesAsync();
        async Task<int?[]> Search(RelatedScopeMatchMode mode, params BrowseRoleFilter[] roles)
        {
            var expression = new FilterExpression<BrowseCriteria>
            {
                RelatedScope = new() { FilterKey = "slottedPerformerCriterion", MatchMode = mode },
                Children = [.. roles.Select(Leaf)],
            };
            var (result, error) = await SegmentStudioBrowseService.SearchAsync(db, new(null, ActivityTagIds: [30], FilterExpression: expression), true, CancellationToken.None);
            Assert.Null(error);
            return result!.Items.Select(item => item.SegmentId).Order().ToArray();
        }

        Assert.Equal(new int?[] { 105, 106 }, await Search(RelatedScopeMatchMode.Reuse, new("giver", Includes(1)), new("giver", Includes(1))));
        Assert.Empty(await Search(RelatedScopeMatchMode.Distinct, new("giver", Includes(1)), new("giver", Includes(1))));
        Assert.Equal(new int?[] { 105 }, await Search(RelatedScopeMatchMode.Distinct, new("giver", Includes(1)), new("giver", Includes(3))));
        Assert.Equal(new int?[] { 105 }, await Search(RelatedScopeMatchMode.Distinct, new("giver", Includes(1)), new("*", new RelatedFilterCriterion<PerformerFilter> { PerformerIdsCriterion = new() { Value = [1, 3] } })));
        Assert.Equal(new int?[] { 106 }, await Search(RelatedScopeMatchMode.Distinct, new("giver", Includes(1)), new("giver", Unassigned: true)));
        Assert.Equal(new int?[] { 105 }, await Search(RelatedScopeMatchMode.Distinct,
            new("giver", new RelatedFilterCriterion<PerformerFilter>()), new("giver", new RelatedFilterCriterion<PerformerFilter>())));
        var ageNineteen = new RelatedFilterCriterion<PerformerFilter> { AgeAtHostDateCriterion = new() { Value = 19, Modifier = CriterionModifier.Equals } };
        Assert.Empty(await Search(RelatedScopeMatchMode.Distinct, new("giver", Includes(1)), new("giver", ageNineteen)));

        async Task<int?[]> Wrapped(FilterExpressionOperator op, params FilterExpressionNode<BrowseCriteria>[] extra)
        {
            var distinct = new FilterExpression<BrowseCriteria>
            {
                RelatedScope = new() { FilterKey = "slottedPerformerCriterion", MatchMode = RelatedScopeMatchMode.Distinct },
                Children = [Leaf(new("giver", Includes(1))), Leaf(new("giver", Includes(3)))],
            };
            var expression = new FilterExpression<BrowseCriteria> { Operator = op, Children = [new() { Group = distinct }, .. extra] };
            var (result, error) = await SegmentStudioBrowseService.SearchAsync(db, new(null, ActivityTagIds: [30], FilterExpression: expression), true, CancellationToken.None);
            Assert.Null(error);
            return result!.Items.Select(item => item.SegmentId).Order().ToArray();
        }
        Assert.Equal(new int?[] { 106 }, await Wrapped(FilterExpressionOperator.Not));
        Assert.Equal(new int?[] { 106 }, await Wrapped(FilterExpressionOperator.JustOne, Leaf(new("giver", Includes(1)))));
    }

    [Fact]
    public async Task BrowseSlottedPerformersMatchOccurrenceTagsOnTheSegmentsVideo()
    {
        await using var db = await CreateSqliteContextAsync();
        await SeedRolesAsync(db);
        db.AddRange(new Tag { Id = 40, Name = "Natural" }, new Tag { Id = 41, Name = "Large" }, new Tag { Id = 42, Name = "Larger" },
            new TagParent { ParentId = 41, ChildId = 42 },
            Occurrence(video: 1, performer: 2, tag: 40), Occurrence(video: 1, performer: 2, tag: 42),
Occurrence(video: 2, performer: 1, tag: 41));
        await db.SaveChangesAsync();
        RelatedFilterCriterion<PerformerFilter> Tags(CriterionModifier modifier, int? depth, params int[] tagIds) => new()
        {
            PerformerOccurrenceTagsCriterion = new() { Value = [.. tagIds], Modifier = modifier, Depth = depth },
        };

        Assert.Empty(await SearchRoles(db, new BrowseRoleFilter("receiver", Tags(CriterionModifier.IncludesAll, null, 40, 41))));
        Assert.Equal(new int?[] { 101 }, await SearchRoles(db, new BrowseRoleFilter("receiver", Tags(CriterionModifier.IncludesAll, -1, 40, 41))));
        Assert.Equal(new int?[] { 101 }, await SearchRoles(db, new BrowseRoleFilter("receiver", Tags(CriterionModifier.Includes, null, 40))));
        Assert.Equal(new int?[] { 103 }, await SearchRoles(db, new BrowseRoleFilter("giver", Tags(CriterionModifier.Includes, null, 41))));
        Assert.Equal(new int?[] { 102 }, await SearchRoles(db, new BrowseRoleFilter("receiver", Tags(CriterionModifier.IsNull, null))));
        Assert.Equal(new int?[] { 101, 103 }, await SearchRoles(db, new BrowseRoleFilter("giver", Tags(CriterionModifier.Excludes, null, 40))));
    }

    private static TagApplication Occurrence(int video, int performer, int tag) => new()
    {
        HostType = AffinityHostType.Video, HostId = video, ContextType = "performer", ContextId = performer, TagId = tag,
    };

    private static FilterExpressionNode<BrowseCriteria> Leaf(BrowseRoleFilter role) => new() { Filter = new(SlottedPerformer: role) };

    // One condition goes to the top level, like the Segments page sends it; several become an AND expression.
    private static BrowseRequest Request(BrowseRoleFilter[] roles) => roles.Length == 1
        ? new(null, SlottedPerformer: roles[0])
        : new(null, FilterExpression: new() { Children = [.. roles.Select(Leaf)] });

    private static async Task<int?[]> SearchRoles(DbContext db, params BrowseRoleFilter[] roles)
        => await SearchRoles(db, null, roles);

    private static async Task<int?[]> SearchRoles(DbContext db,
        Func<PerformerFilter?, FindFilter, CancellationToken, Task<IReadOnlyCollection<int>>>? findPerformerIds, params BrowseRoleFilter[] roles)
    {
        var (result, error) = await SegmentStudioBrowseService.SearchAsync(db, Request(roles), true, CancellationToken.None, findPerformerIds);
        Assert.Null(error);
        return result!.Items.Select(item => item.SegmentId).Order().ToArray();
    }

    // Tag 10 has Giver and Receiver slots and tag 20 a " giver " slot. Segment 101 (video dated 2020-06-01) has Giver A
    // (born 2000-06-02) and Receiver B (born 1990-01-01), 102 only Receiver A, 103 (undated video) Giver A on tag 20,
    // and 104 on tag 10 has no Segment Studio record at all.
    private static async Task SeedRolesAsync(TestDb db)
    {
        SeedBrowse(db);
        db.Set<Video>().Local.Single(video => video.Id == 1).Date = new DateOnly(2020, 6, 1);
        var set = new SegmentStudioSlotDefinitionSet { Id = Guid.NewGuid(), TagId = 10, CreatedAt = DateTime.UtcNow };
        var giver = Definition(set.Id, 0); giver.Label = "Giver";
        var receiver = Definition(set.Id, 1); receiver.Label = "Receiver";
        var otherSet = new SegmentStudioSlotDefinitionSet { Id = Guid.NewGuid(), TagId = 20, CreatedAt = DateTime.UtcNow };
        var otherGiver = Definition(otherSet.Id, 0); otherGiver.Label = " giver ";
        var item101 = NativeItem(101); var item102 = NativeItem(102); var item103 = NativeItem(103);
        db.AddRange(set, giver, receiver, otherSet, otherGiver,
            Segment(104, 2, 10, null, DateTime.UtcNow),
            new Performer { Id = 1, Name = "A", Birthdate = new DateOnly(2000, 6, 2) },
            new Performer { Id = 2, Name = "B", Birthdate = new DateOnly(1990, 1, 1) },
            new Performer { Id = 3, Name = "C" },
            new SegmentStudioSegmentSlot { Item = item101, SlotDefinitionId = giver.Id, PerformerId = 1 },
            new SegmentStudioSegmentSlot { Item = item101, SlotDefinitionId = receiver.Id, PerformerId = 2 },
            new SegmentStudioSegmentSlot { Item = item102, SlotDefinitionId = receiver.Id, PerformerId = 1 },
            new SegmentStudioSegmentSlot { Item = item103, SlotDefinitionId = otherGiver.Id, PerformerId = 1 });
        await db.SaveChangesAsync();
    }

    private static RelatedFilterCriterion<PerformerFilter> Includes(int performerId, RelatedFilterMode mode = RelatedFilterMode.AtLeastOne) => new()
    {
        Mode = mode,
        PerformerIdsCriterion = new() { Value = [performerId], Modifier = CriterionModifier.Includes },
    };

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
        var (result, error) = await SegmentStudioBrowseService.SearchAsync(db, new(null, [], 1, 20), true, CancellationToken.None);
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

    // Role filters build their own expression trees, so they run against SQLite to exercise SQL translation and null semantics.
    private static async Task<TestDb> CreateSqliteContextAsync()
    {
        var connection = new SqliteConnection("Data Source=:memory:");
        await connection.OpenAsync();
        var db = new TestDb(new DbContextOptionsBuilder<TestDb>().UseSqlite(connection).Options, null, null, connection);
        await db.Database.EnsureCreatedAsync();
        return db;
    }

    private sealed class TestDb(DbContextOptions<TestDb> options, int? allowedVideoId, int? allowedTagId, SqliteConnection? connection = null) : DbContext(options)
    {
        public override async ValueTask DisposeAsync()
        {
            await base.DisposeAsync();
            if (connection is not null) await connection.DisposeAsync();
        }

        protected override void OnModelCreating(ModelBuilder builder)
        {
            builder.Ignore<Group>();
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
                .Ignore(item => item.VideoPerformers).Ignore(item => item.AudioPerformers).Ignore(item => item.TextPerformers)
                .Ignore(item => item.ImagePerformers).Ignore(item => item.GalleryPerformers).Ignore(item => item.RemoteIds);
            builder.Entity<SegmentStudioSlotDefinitionSet>().HasKey(item => item.Id);
            builder.Entity<SegmentStudioSlotDefinition>().HasKey(item => item.Id);
            builder.Entity<SegmentStudioSlotDefinitionGenderHint>().HasKey(item => new { item.SlotDefinitionId, item.GenderHint });
            builder.Entity<SegmentStudioItem>().HasKey(item => item.Id);
            builder.Entity<SegmentStudioSegmentSlot>().HasKey(item => new { item.ItemId, item.SlotDefinitionId });
            builder.Entity<SegmentStudioSegmentSlot>().HasOne(item => item.Item).WithMany(item => item.Slots).HasForeignKey(item => item.ItemId);
            builder.Entity<SegmentStudioReviewSegment>().HasKey(item => item.SegmentId);
            builder.Entity<VideoPerformer>().HasKey(item => new { item.VideoId, item.PerformerId });
            builder.Entity<TagApplication>().HasKey(item => item.Id);
            builder.Entity<TagApplication>().Ignore(item => item.Tag);
        }
    }
}
