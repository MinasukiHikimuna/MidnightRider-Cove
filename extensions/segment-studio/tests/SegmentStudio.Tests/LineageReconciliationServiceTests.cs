using Microsoft.Data.Sqlite;
using Microsoft.EntityFrameworkCore;
using Cove.Core.Entities;
using SegmentStudio;

namespace SegmentStudio.Tests;

public sealed class LineageReconciliationServiceTests
{
    [Fact]
    public async Task PreviewPreservesValidDescendantsAndDoesNotCreateNewOnes()
    {
        await using var fixture = await Fixture.CreateAsync();
        var root = await fixture.AddItemNodeAsync(10);
        var otherRoot = await fixture.AddItemNodeAsync(12);
        var child = await fixture.AddItemNodeAsync(20);
        var grandchild = await fixture.AddItemNodeAsync(30);
        var changedRule = await fixture.AddRuleAsync("changed", 10, 20);
        var otherRule = await fixture.AddRuleAsync("other", 12, 20);
        var childRule = await fixture.AddRuleAsync("child", 20, 30);
        var removed = await fixture.AddEdgeAsync(root.Node, child.Node, changedRule);
        await fixture.AddEdgeAsync(otherRoot.Node, child.Node, otherRule);
        await fixture.AddEdgeAsync(child.Node, grandchild.Node, childRule);
        await fixture.AddTagAsync(11);
        var service = fixture.CreateService();

        var preview = await service.PreviewAsync(
            fixture.Context,
            root.Item.Id,
            new TagChangePreviewRequest(1, 11),
            CancellationToken.None);

        Assert.Equal([removed.Id], preview.RemovedEdgeIds);
        Assert.Empty(preview.DeletedItemIds);
        Assert.Equal(2, preview.PreservedDescendantCount);
        Assert.Equal(4, await fixture.Context.Set<SegmentStudioItem>().CountAsync());
    }

    [Fact]
    public async Task PreviewInvalidatesOneBranchOrAllDescendants()
    {
        await using var fixture = await Fixture.CreateAsync();
        var root = await fixture.AddItemNodeAsync(10);
        var kept = await fixture.AddItemNodeAsync(20);
        var removed = await fixture.AddItemNodeAsync(30);
        var keptRule = await fixture.AddRuleAsync("kept", 11, 20);
        var removedRule = await fixture.AddRuleAsync("removed", 10, 30);
        await fixture.AddEdgeAsync(root.Node, kept.Node, keptRule);
        await fixture.AddEdgeAsync(root.Node, removed.Node, removedRule);
        var service = fixture.CreateService();
        await fixture.AddTagAsync(12);

        var partial = await service.PreviewAsync(
            fixture.Context, root.Item.Id, new TagChangePreviewRequest(1, 11), CancellationToken.None);
        var all = await service.PreviewAsync(
            fixture.Context, root.Item.Id, new TagChangePreviewRequest(1, 12), CancellationToken.None);

        Assert.Equal([removed.Item.Id], partial.DeletedItemIds);
        Assert.Equal(1, partial.PreservedDescendantCount);
        Assert.Equal([kept.Item.Id, removed.Item.Id], all.DeletedItemIds);
        Assert.Equal(0, all.PreservedDescendantCount);
    }

    [Fact]
    public async Task SharedChildSurvivesThroughAnotherValidParent()
    {
        await using var fixture = await Fixture.CreateAsync();
        var changedRoot = await fixture.AddItemNodeAsync(10);
        var otherRoot = await fixture.AddItemNodeAsync(12);
        var child = await fixture.AddItemNodeAsync(20);
        var changedRule = await fixture.AddRuleAsync("changed", 10, 20);
        var otherRule = await fixture.AddRuleAsync("other", 12, 20);
        var removedEdge = await fixture.AddEdgeAsync(changedRoot.Node, child.Node, changedRule);
        await fixture.AddEdgeAsync(otherRoot.Node, child.Node, otherRule);
        var service = fixture.CreateService();
        await fixture.AddTagAsync(11);

        var preview = await service.PreviewAsync(
            fixture.Context, changedRoot.Item.Id, new TagChangePreviewRequest(1, 11), CancellationToken.None);

        Assert.Equal([removedEdge.Id], preview.RemovedEdgeIds);
        Assert.Empty(preview.DeletedItemIds);
        Assert.Equal(1, preview.PreservedDescendantCount);
    }

    [Fact]
    public async Task ExecuteRejectsStalePreviewAndIntermediateEdit()
    {
        await using var fixture = await Fixture.CreateAsync();
        var branch = await fixture.AddBranchAsync(10, 20, 30);
        var service = fixture.CreateService();
        await fixture.AddTagAsync(11);
        await fixture.AddTagAsync(22);
        var preview = await service.PreviewAsync(
            fixture.Context, branch.RootItem.Id, new TagChangePreviewRequest(1, 11), CancellationToken.None);
        branch.ChildItem.Revision++;
        await fixture.Context.SaveChangesAsync();

        var stale = await Assert.ThrowsAsync<LineageConflictException>(() => service.ExecuteAsync(
            fixture.Context,
            branch.RootItem.Id,
            new TagChangeExecuteRequest(Guid.NewGuid(), 1, preview.ComponentFingerprint, 11),
            7,
            CancellationToken.None));
        var intermediate = await Assert.ThrowsAsync<LineageConflictException>(() => service.PreviewAsync(
            fixture.Context,
            branch.ChildItem.Id,
            new TagChangePreviewRequest(branch.ChildItem.Revision, 22),
            CancellationToken.None));

        Assert.Equal("LINEAGE_COMPONENT_CHANGED", stale.Code);
        Assert.Equal("DERIVED_TAG_IMMUTABLE", intermediate.Code);
    }

    [Fact]
    public async Task ExecuteDeletesInvalidDescendantsAndQueuesBlobCleanup()
    {
        await using var fixture = await Fixture.CreateAsync();
        var branch = await fixture.AddBranchAsync(10, 20, 30);
        branch.RootItem.ReviewState = "approved";
        branch.ChildItem.ExtensionImageBlobId = "blob-child";
        await fixture.Context.SaveChangesAsync();
        var service = fixture.CreateService();
        await fixture.AddTagAsync(11);
        var preview = await service.PreviewAsync(
            fixture.Context, branch.RootItem.Id, new TagChangePreviewRequest(1, 11), CancellationToken.None);

        var operationId = Guid.NewGuid();
        var request = new TagChangeExecuteRequest(
            operationId, 1, preview.ComponentFingerprint, 11);
        var result = await service.ExecuteAsync(
            fixture.Context,
            branch.RootItem.Id,
            request,
            7,
            CancellationToken.None);
        var replay = await service.ExecuteAsync(
            fixture.Context, branch.RootItem.Id, request, 7, CancellationToken.None);

        Assert.Equal(2, result.DeletedDescendantCount);
        Assert.Equal(11, (await fixture.Context.Set<SegmentStudioItem>()
            .SingleAsync(item => item.Id == branch.RootItem.Id)).TagId);
        Assert.Equal("approved", (await fixture.Context.Set<SegmentStudioItem>()
            .SingleAsync(item => item.Id == branch.RootItem.Id)).ReviewState);
        Assert.False(await fixture.Context.Set<SegmentStudioItem>()
            .AnyAsync(item => item.Id == branch.ChildItem.Id));
        Assert.Contains(await fixture.Context.Set<SegmentStudioBlobCleanupOutbox>().ToListAsync(),
            entry => entry.BlobId == "blob-child" && entry.Status == "pending");
        Assert.True(replay.Replayed);
    }

    [Fact]
    public async Task ExecuteRetagReusesPerformerInMatchingSlot()
    {
        await using var fixture = await Fixture.CreateAsync();
        var root = await fixture.AddItemNodeAsync(10);
        await fixture.AddTagAsync(11);
        var sourceSetId = Guid.NewGuid();
        var targetSetId = Guid.NewGuid();
        var sourceSlotId = Guid.NewGuid();
        var targetSlotId = Guid.NewGuid();
        fixture.Context.AddRange(
            new SegmentStudioSlotDefinitionSet
                { Id = sourceSetId, TagId = 10, CreatedAt = DateTime.UtcNow },
            new SegmentStudioSlotDefinitionSet
                { Id = targetSetId, TagId = 11, CreatedAt = DateTime.UtcNow },
            new SegmentStudioSlotDefinition
                { Id = sourceSlotId, SlotDefinitionSetId = sourceSetId, Label = "Receiver", CreatedAt = DateTime.UtcNow },
            new SegmentStudioSlotDefinition
                { Id = targetSlotId, SlotDefinitionSetId = targetSetId, Label = "Receiver", CreatedAt = DateTime.UtcNow },
            new SegmentStudioSegmentSlot
                { ItemId = root.Item.Id, SlotDefinitionId = sourceSlotId, PerformerId = 9, CreatedAt = DateTime.UtcNow });
        await fixture.Context.SaveChangesAsync();
        var service = fixture.CreateService();
        var preview = await service.PreviewAsync(
            fixture.Context, root.Item.Id, new TagChangePreviewRequest(1, 11), CancellationToken.None);

        await service.ExecuteAsync(
            fixture.Context,
            root.Item.Id,
            new TagChangeExecuteRequest(Guid.NewGuid(), 1, preview.ComponentFingerprint, 11),
            7,
            CancellationToken.None);

        var slot = Assert.Single(await fixture.Context.Set<SegmentStudioSegmentSlot>().ToListAsync());
        Assert.Equal(targetSlotId, slot.SlotDefinitionId);
        Assert.Equal(9, slot.PerformerId);
    }

    [Fact]
    public async Task ExecuteRollsBackRootEdgesDescendantsAndCleanupOnFailure()
    {
        await using var fixture = await Fixture.CreateAsync();
        var branch = await fixture.AddBranchAsync(10, 20, 30);
        branch.ChildItem.ExtensionImageBlobId = "blob-child";
        await fixture.AddTagAsync(11);
        await fixture.Context.SaveChangesAsync();
        var actualGraph = new DerivationGraphService();
        var service = new LineageReconciliationService(new ThrowOnSecondRemovalGraph(actualGraph));
        var preview = await service.PreviewAsync(
            fixture.Context, branch.RootItem.Id, new TagChangePreviewRequest(1, 11), CancellationToken.None);

        await Assert.ThrowsAsync<InvalidOperationException>(() => service.ExecuteAsync(
            fixture.Context,
            branch.RootItem.Id,
            new TagChangeExecuteRequest(Guid.NewGuid(), 1, preview.ComponentFingerprint, 11),
            7,
            CancellationToken.None));

        await using var verification = fixture.CreateVerificationContext();
        Assert.Equal(10, (await verification.Set<SegmentStudioItem>()
            .SingleAsync(item => item.Id == branch.RootItem.Id)).TagId);
        Assert.Equal(3, await verification.Set<SegmentStudioItem>().CountAsync());
        Assert.Equal(2, await verification.Set<SegmentStudioDerivationEdge>().CountAsync());
        Assert.Empty(await verification.Set<SegmentStudioBlobCleanupOutbox>().ToListAsync());
    }

    [Fact]
    public async Task ExecuteDeletesNativeDescendantAndQueuesItsImageBlob()
    {
        await using var fixture = await Fixture.CreateAsync();
        var root = await fixture.AddItemNodeAsync(10);
        var native = await fixture.AddNativeItemNodeAsync(20, "native-image");
        var rule = await fixture.AddRuleAsync("native", 10, 20);
        await fixture.AddEdgeAsync(root.Node, native.Node, rule);
        await fixture.AddTagAsync(11);
        var service = fixture.CreateService();
        var preview = await service.PreviewAsync(
            fixture.Context, root.Item.Id, new TagChangePreviewRequest(1, 11), CancellationToken.None);

        await service.ExecuteAsync(
            fixture.Context,
            root.Item.Id,
            new TagChangeExecuteRequest(Guid.NewGuid(), 1, preview.ComponentFingerprint, 11),
            7,
            CancellationToken.None);

        Assert.False(await fixture.Context.Set<Cove.Core.Entities.Segment>()
            .AnyAsync(segment => segment.Id == native.SegmentId));
        Assert.False(await fixture.Context.Set<SegmentStudioItem>()
            .AnyAsync(item => item.Id == native.Item.Id));
        Assert.Contains(await fixture.Context.Set<SegmentStudioBlobCleanupOutbox>().ToListAsync(),
            entry => entry.BlobId == "native-image");
    }

    [Fact]
    public async Task RuleChangeAfterPreviewMakesExecutionStale()
    {
        await using var fixture = await Fixture.CreateAsync();
        var root = await fixture.AddItemNodeAsync(10);
        var child = await fixture.AddItemNodeAsync(20);
        var rule = await fixture.AddRuleAsync("rule", 10, 20);
        await fixture.AddEdgeAsync(root.Node, child.Node, rule);
        await fixture.AddTagAsync(11);
        var service = fixture.CreateService();
        var preview = await service.PreviewAsync(
            fixture.Context, root.Item.Id, new TagChangePreviewRequest(1, 11), CancellationToken.None);
        rule.Version = "2";
        rule.UpdatedAt = rule.UpdatedAt.AddSeconds(1);
        await fixture.Context.SaveChangesAsync();

        var conflict = await Assert.ThrowsAsync<LineageConflictException>(() => service.ExecuteAsync(
            fixture.Context,
            root.Item.Id,
            new TagChangeExecuteRequest(Guid.NewGuid(), 1, preview.ComponentFingerprint, 11),
            7,
            CancellationToken.None));

        Assert.Equal("LINEAGE_COMPONENT_CHANGED", conflict.Code);
    }

    [Fact]
    public async Task NativeTimestampChangeAfterPreviewMakesExecutionStale()
    {
        await using var fixture = await Fixture.CreateAsync();
        var root = await fixture.AddNativeItemNodeAsync(10, "root-image");
        var child = await fixture.AddItemNodeAsync(20);
        var rule = await fixture.AddRuleAsync("rule", 10, 20);
        await fixture.AddEdgeAsync(root.Node, child.Node, rule);
        await fixture.AddTagAsync(11);
        var service = fixture.CreateService();
        var preview = await service.PreviewAsync(
            fixture.Context, root.Item.Id, new TagChangePreviewRequest(1, 11), CancellationToken.None);
        var native = await fixture.Context.Set<Cove.Core.Entities.Segment>()
            .SingleAsync(segment => segment.Id == root.SegmentId);
        native.UpdatedAt = native.UpdatedAt.AddSeconds(1);
        await fixture.Context.SaveChangesAsync();

        var conflict = await Assert.ThrowsAsync<LineageConflictException>(() => service.ExecuteAsync(
            fixture.Context,
            root.Item.Id,
            new TagChangeExecuteRequest(Guid.NewGuid(), 1, preview.ComponentFingerprint, 11),
            7,
            CancellationToken.None));

        Assert.Equal("LINEAGE_COMPONENT_CHANGED", conflict.Code);
    }

    [Fact]
    public async Task ExecuteRebuildsMissingInheritedProvenanceOnRetainedPaths()
    {
        await using var fixture = await Fixture.CreateAsync();
        var changedRoot = await fixture.AddItemNodeAsync(10);
        var otherRoot = await fixture.AddItemNodeAsync(12);
        var child = await fixture.AddItemNodeAsync(20);
        var changedRule = await fixture.AddRuleAsync("changed", 10, 20);
        var otherRule = await fixture.AddRuleAsync("other", 12, 20);
        await fixture.AddEdgeAsync(changedRoot.Node, child.Node, changedRule);
        await fixture.AddEdgeAsync(otherRoot.Node, child.Node, otherRule);
        await fixture.AddTagAsync(11);
        var now = DateTime.UtcNow;
        var source = new SegmentStudioSource
        {
            Key = "origin", DisplayName = "Origin", MetadataJson = "{}",
            CreatedAt = now, UpdatedAt = now,
        };
        fixture.Context.Add(source);
        await fixture.Context.SaveChangesAsync();
        fixture.Context.Add(new SegmentStudioSegmentProvenance
        {
            LineageNodeId = otherRoot.Node.Id,
            SourceId = source.Id,
            Relation = "origin",
            MetadataJson = "{}",
            CreatedAt = now,
            UpdatedAt = now,
        });
        await fixture.Context.SaveChangesAsync();
        var service = fixture.CreateService();
        var preview = await service.PreviewAsync(
            fixture.Context, changedRoot.Item.Id, new TagChangePreviewRequest(1, 11), CancellationToken.None);

        await service.ExecuteAsync(
            fixture.Context,
            changedRoot.Item.Id,
            new TagChangeExecuteRequest(Guid.NewGuid(), 1, preview.ComponentFingerprint, 11),
            7,
            CancellationToken.None);

        Assert.Contains(await fixture.Context.Set<SegmentStudioSegmentProvenance>().ToListAsync(),
            assertion => assertion.LineageNodeId == child.Node.Id
                && assertion.Relation == "inherited"
                && assertion.SupersededAt == null);
    }

    private sealed class ThrowOnSecondRemovalGraph(IDerivationGraphService inner) : IDerivationGraphService
    {
        private int _removals;

        public Task<SegmentStudioDerivationEdge> CreateEdgeAsync(
            DbContext db, DerivationEdgeCreate request, CancellationToken ct) =>
            inner.CreateEdgeAsync(db, request, ct);

        public async Task RemoveEdgeAsync(DbContext db, long edgeId, CancellationToken ct)
        {
            if (++_removals == 2)
                throw new InvalidOperationException("Injected reconciliation failure.");
            await inner.RemoveEdgeAsync(db, edgeId, ct);
        }

        public Task RecomputeInheritedProvenanceAsync(DbContext db, CancellationToken ct) =>
            inner.RecomputeInheritedProvenanceAsync(db, ct);

        public Task<IReadOnlyList<DerivationEdgeDto>> GetComponentEdgesAsync(
            DbContext db, Guid nodeId, CancellationToken ct) =>
            inner.GetComponentEdgesAsync(db, nodeId, ct);

        public Task<SegmentLineageDto> GetLineageAsync(
            DbContext db, long itemId, CancellationToken ct) =>
            inner.GetLineageAsync(db, itemId, ct);
    }

    private sealed class Fixture : IAsyncDisposable
    {
        private readonly SqliteConnection _connection;

        private Fixture(SqliteConnection connection, ReconciliationDbContext context)
        {
            _connection = connection;
            Context = context;
        }

        public ReconciliationDbContext Context { get; }

        public ReconciliationDbContext CreateVerificationContext() =>
            new(new DbContextOptionsBuilder<ReconciliationDbContext>()
                .UseSqlite(_connection)
                .Options);

        public static async Task<Fixture> CreateAsync()
        {
            var connection = new SqliteConnection("Data Source=:memory:");
            await connection.OpenAsync();
            var options = new DbContextOptionsBuilder<ReconciliationDbContext>()
                .UseSqlite(connection)
                .Options;
            var context = new ReconciliationDbContext(options);
            await context.Database.EnsureCreatedAsync();
            return new Fixture(connection, context);
        }

        public LineageReconciliationService CreateService() =>
            new(new DerivationGraphService());

        public async Task<(SegmentStudioItem Item, SegmentStudioLineageNode Node)> AddItemNodeAsync(int tag)
        {
            await EnsureTagAsync(tag);
            var now = DateTime.UtcNow;
            var item = new SegmentStudioItem
            {
                VideoId = 1, TagId = tag, StartSec = tag, Kind = "tag", SourceKey = "user",
                ReviewState = "unreviewed", Revision = 1, CreatedAt = now, UpdatedAt = now,
            };
            Context.Add(item);
            await Context.SaveChangesAsync();
            var node = new SegmentStudioLineageNode
            {
                Id = Guid.NewGuid(), ItemId = item.Id, State = "live", LastKnownVideoId = 1,
                LastKnownTagId = tag, LastKnownStartSec = tag, CreatedAt = now, UpdatedAt = now,
            };
            Context.Add(node);
            await Context.SaveChangesAsync();
            return (item, node);
        }

        public async Task<(SegmentStudioItem Item, SegmentStudioLineageNode Node, int SegmentId)>
            AddNativeItemNodeAsync(int tag, string imageBlobId)
        {
            await EnsureTagAsync(tag);
            var now = DateTime.UtcNow;
            var segment = new Cove.Core.Entities.Segment
            {
                Id = Random.Shared.Next(1000, int.MaxValue),
                HostType = Cove.Core.Entities.SegmentHostType.Video,
                HostId = 1,
                Kind = "tag",
                TagId = tag,
                StartSec = tag,
                ImageBlobId = imageBlobId,
                UpdatedAt = now,
            };
            Context.Add(segment);
            await Context.SaveChangesAsync();
            var item = new SegmentStudioItem
            {
                NativeSegmentId = segment.Id,
                Revision = 1,
                CreatedAt = now,
                UpdatedAt = now,
            };
            Context.Add(item);
            await Context.SaveChangesAsync();
            var node = new SegmentStudioLineageNode
            {
                Id = Guid.NewGuid(), ItemId = item.Id, State = "live", LastKnownVideoId = 1,
                LastKnownTagId = tag, LastKnownStartSec = tag, CreatedAt = now, UpdatedAt = now,
            };
            Context.Add(node);
            await Context.SaveChangesAsync();
            return (item, node, segment.Id);
        }

        public async Task<SegmentStudioDerivationRule> AddRuleAsync(string key, int sourceTag, int derivedTag)
        {
            await EnsureTagAsync(sourceTag);
            await EnsureTagAsync(derivedTag);
            var now = DateTime.UtcNow;
            var rule = new SegmentStudioDerivationRule
            {
                Id = Guid.NewGuid(), Key = key, Version = "1", SourceTagId = sourceTag,
                DerivedTagId = derivedTag, MetadataJson = "{}",
                CreatedAt = now, UpdatedAt = now,
            };
            Context.Add(rule);
            await Context.SaveChangesAsync();
            return rule;
        }

        public Task AddTagAsync(int tagId) => EnsureTagAsync(tagId);

        private async Task EnsureTagAsync(int tagId)
        {
            if (await Context.Set<Cove.Core.Entities.Tag>().AnyAsync(tag => tag.Id == tagId))
                return;
            Context.Add(new Cove.Core.Entities.Tag { Id = tagId, Name = $"Tag {tagId}" });
            await Context.SaveChangesAsync();
        }

        public async Task<SegmentStudioDerivationEdge> AddEdgeAsync(
            SegmentStudioLineageNode source,
            SegmentStudioLineageNode derived,
            SegmentStudioDerivationRule rule)
        {
            var now = DateTime.UtcNow;
            var edge = new SegmentStudioDerivationEdge
            {
                SourceNodeId = source.Id, DerivedNodeId = derived.Id, RuleId = rule.Id,
                SourceTagIdAtCreation = rule.SourceTagId, DerivedTagIdAtCreation = rule.DerivedTagId,
                MetadataJson = "{}", CreatedAt = now, UpdatedAt = now,
            };
            Context.Add(edge);
            await Context.SaveChangesAsync();
            return edge;
        }

        public async Task<(SegmentStudioItem RootItem, SegmentStudioItem ChildItem)> AddBranchAsync(
            int rootTag,
            int childTag,
            int grandchildTag)
        {
            var root = await AddItemNodeAsync(rootTag);
            var child = await AddItemNodeAsync(childTag);
            var grandchild = await AddItemNodeAsync(grandchildTag);
            var first = await AddRuleAsync("first", rootTag, childTag);
            var second = await AddRuleAsync("second", childTag, grandchildTag);
            await AddEdgeAsync(root.Node, child.Node, first);
            await AddEdgeAsync(child.Node, grandchild.Node, second);
            return (root.Item, child.Item);
        }

        public async ValueTask DisposeAsync()
        {
            await Context.DisposeAsync();
            await _connection.DisposeAsync();
        }
    }

    private sealed class ReconciliationDbContext(
        DbContextOptions<ReconciliationDbContext> options) : DbContext(options)
    {
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Ignore<Group>();
            modelBuilder.Entity<SegmentStudioItem>(builder =>
            {
                builder.HasKey(item => item.Id);
                builder.Ignore(item => item.Slots);
                builder.HasOne<Cove.Core.Entities.Segment>()
                    .WithMany()
                    .HasForeignKey(item => item.NativeSegmentId)
                    .OnDelete(DeleteBehavior.Cascade);
            });
            modelBuilder.Entity<SegmentStudioLineageNode>().HasKey(node => node.Id);
            modelBuilder.Entity<SegmentStudioDerivationRule>().HasKey(rule => rule.Id);
            modelBuilder.Entity<SegmentStudioDerivationEdge>().HasKey(edge => edge.Id);
            modelBuilder.Entity<SegmentStudioSegmentOperation>().HasKey(operation => operation.OperationId);
            modelBuilder.Entity<SegmentStudioSegmentProvenance>().HasKey(assertion => assertion.Id);
            modelBuilder.Entity<SegmentStudioSource>().HasKey(source => source.Id);
            modelBuilder.Entity<SegmentStudioProvenanceActivity>().HasKey(activity => activity.Id);
            modelBuilder.Entity<SegmentStudioBlobCleanupOutbox>().HasKey(entry => entry.Id);
            modelBuilder.Entity<SegmentStudioSegmentSlot>(builder =>
            {
                builder.HasKey(slot => new { slot.ItemId, slot.SlotDefinitionId });
                builder.Ignore(slot => slot.Item);
                builder.Ignore(slot => slot.SlotDefinition);
            });
            modelBuilder.Entity<SegmentStudioSlotDefinitionSet>().HasKey(set => set.Id);
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
            modelBuilder.Entity<Cove.Core.Entities.Performer>(builder =>
            {
                builder.HasKey(performer => performer.Id);
                builder.Ignore(performer => performer.Urls);
                builder.Ignore(performer => performer.Aliases);
                builder.Ignore(performer => performer.PerformerTags);
                builder.Ignore(performer => performer.VideoPerformers);
                builder.Ignore(performer => performer.AudioPerformers);
                builder.Ignore(performer => performer.TextPerformers);
                builder.Ignore(performer => performer.ImagePerformers);
                builder.Ignore(performer => performer.GalleryPerformers);
                builder.Ignore(performer => performer.RemoteIds);
            });
            modelBuilder.Entity<Cove.Core.Entities.Segment>(builder =>
            {
                builder.HasKey(segment => segment.Id);
                builder.Ignore(segment => segment.Payload);
                builder.Ignore(segment => segment.Tag);
            });
            modelBuilder.Entity<Cove.Core.Entities.Tag>(builder =>
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
        }
    }
}
