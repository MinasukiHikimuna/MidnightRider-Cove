using Cove.Core.Entities;
using Microsoft.Data.Sqlite;
using Microsoft.EntityFrameworkCore;
using SegmentStudio;

namespace SegmentStudio.Tests;

public sealed class DerivedSegmentMaterializationServiceTests
{
    [Fact]
    public void ExecutionWrapsTheUserTransactionInTheConfiguredRetryStrategy()
    {
        var source = File.ReadAllText(Path.Combine(
            AppContext.BaseDirectory,
            "..", "..", "..", "..", "..",
            "src", "SegmentStudio", "DerivedSegmentMaterializationService.cs"));

        Assert.Contains("var strategy = db.Database.CreateExecutionStrategy();", source);
        Assert.Contains("return await strategy.ExecuteAsync(async () =>", source);
        Assert.True(source.IndexOf("strategy.ExecuteAsync", StringComparison.Ordinal)
            < source.IndexOf("BeginTransactionAsync", StringComparison.Ordinal));
        Assert.Contains("db.ChangeTracker.Clear();", source);
    }

    [Fact]
    public async Task PreviewAndExecuteMaterializeTransitiveRulesWithMappedSlotsIdempotently()
    {
        await using var fixture = await MaterializationFixture.CreateAsync();

        var preview = await DerivedSegmentMaterializationService.PreviewAsync(
            fixture.Context, 1, 3, CancellationToken.None);

        Assert.Equal(2, preview.CreateCount);
        Assert.Equal(0, preview.LinkCount);
        Assert.Equal(2, preview.Outputs.Count);
        Assert.Equal([1, 2], preview.Outputs.Select(output => output.Depth).ToArray());
        Assert.All(preview.Outputs, output =>
        {
            Assert.Equal(fixture.RootItemId, output.RootItemId);
            Assert.Equal("Specific", output.RootTagName);
            Assert.Equal(4, output.RootStartSec);
        });

        var operationId = Guid.NewGuid();
        var executed = await DerivedSegmentMaterializationService.ExecuteAsync(
            fixture.Context,
            1,
            new DerivedSegmentMaterializationRequest(operationId, preview.Fingerprint, 3),
            7,
            CancellationToken.None);
        var replayed = await DerivedSegmentMaterializationService.ExecuteAsync(
            fixture.Context,
            1,
            new DerivedSegmentMaterializationRequest(operationId, preview.Fingerprint, 3),
            7,
            CancellationToken.None);

        Assert.Equal(2, executed.CreatedCount);
        Assert.True(replayed.Replayed);
        Assert.Equal(3, await fixture.Context.Set<SegmentStudioItem>().CountAsync());
        Assert.Equal(2, await fixture.Context.Set<SegmentStudioDerivationEdge>().CountAsync());
        Assert.All(await fixture.Context.Set<SegmentStudioItem>()
            .Where(item => item.Id != fixture.RootItemId).ToListAsync(),
            item => Assert.Equal("unreviewed", item.ReviewState));
        var derivedSlots = await fixture.Context.Set<SegmentStudioSegmentSlot>()
            .Where(slot => slot.ItemId != fixture.RootItemId)
            .OrderBy(slot => slot.ItemId)
            .ToListAsync();
        Assert.Equal(2, derivedSlots.Count);
        Assert.All(derivedSlots, slot => Assert.Equal(7, slot.PerformerId));

        var after = await DerivedSegmentMaterializationService.PreviewAsync(
            fixture.Context, 1, 3, CancellationToken.None);
        Assert.Equal(0, after.CreateCount);
        Assert.Equal(0, after.LinkCount);
        Assert.Equal(2, after.AlreadyMaterializedCount);
    }

    [Theory]
    [InlineData("unreviewed")]
    [InlineData("rejected")]
    public async Task PreviewExcludesRootsThatAreNotApproved(string reviewState)
    {
        await using var fixture = await MaterializationFixture.CreateAsync();
        var root = await fixture.Context.Set<SegmentStudioItem>()
            .SingleAsync(item => item.Id == fixture.RootItemId);
        root.ReviewState = reviewState;
        await fixture.Context.SaveChangesAsync();

        var preview = await DerivedSegmentMaterializationService.PreviewAsync(
            fixture.Context, 1, 3, CancellationToken.None);

        Assert.Equal(0, preview.SourceCount);
        Assert.Equal(0, preview.CreateCount);
        Assert.Empty(preview.Outputs);
    }

    [Fact]
    public async Task PreviewTreatsPublishedNativeSegmentsAsApprovedRoots()
    {
        await using var fixture = await MaterializationFixture.CreateAsync();
        var root = await fixture.Context.Set<SegmentStudioItem>()
            .SingleAsync(item => item.Id == fixture.RootItemId);
        root.NativeSegmentId = 99;
        root.ReviewState = null;
        root.VideoId = null;
        root.StartSec = null;
        root.EndSec = null;
        root.TagId = null;
        root.Kind = null;
        root.SourceKey = null;
        var node = await fixture.Context.Set<SegmentStudioLineageNode>()
            .SingleAsync(candidate => candidate.ItemId == root.Id);
        node.LastKnownVideoId = 2;
        node.LastKnownTagId = 30;
        node.LastKnownStartSec = 40;
        node.LastKnownEndSec = 80;
        fixture.Context.Add(new Segment
        {
            Id = 99,
            HostType = SegmentHostType.Video,
            HostId = 1,
            TagId = 10,
            Kind = "tag",
            StartSec = 4,
            EndSec = null,
            SourceKey = "native",
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow,
        });
        await fixture.Context.SaveChangesAsync();

        var staleVideoPreview = await DerivedSegmentMaterializationService.PreviewAsync(
            fixture.Context, 2, 1, CancellationToken.None);
        Assert.Equal(0, staleVideoPreview.SourceCount);
        Assert.Empty(staleVideoPreview.Outputs);

        var preview = await DerivedSegmentMaterializationService.PreviewAsync(
            fixture.Context, 1, 1, CancellationToken.None);

        Assert.Equal(1, preview.SourceCount);
        Assert.Equal(1, preview.CreateCount);
        Assert.Equal("Specific", Assert.Single(preview.Outputs).RootTagName);

        await DerivedSegmentMaterializationService.ExecuteAsync(
            fixture.Context,
            1,
            new DerivedSegmentMaterializationRequest(Guid.NewGuid(), preview.Fingerprint, 1),
            7,
            CancellationToken.None);
        var derived = await fixture.Context.Set<SegmentStudioItem>()
            .SingleAsync(item => item.Id != fixture.RootItemId);
        Assert.Null(derived.EndSec);
        Assert.Equal("native", derived.SourceKey);
    }

    [Fact]
    public async Task MatchingNativeSegmentIsNeverReusedAsADerivedTarget()
    {
        await using var fixture = await MaterializationFixture.CreateAsync();
        fixture.Context.RemoveRange(await fixture.Context.Set<SegmentStudioDerivationRule>()
            .Where(rule => rule.SourceTagId == 20)
            .ToListAsync());
        var now = DateTime.UtcNow;
        var native = new Segment
        {
            Id = 99, HostType = SegmentHostType.Video, HostId = 1,
            TagId = 20, Kind = "tag", StartSec = 4, EndSec = 8,
            SourceKey = "native", CreatedAt = now, UpdatedAt = now,
        };
        var anchor = new SegmentStudioItem
        {
            NativeSegmentId = native.Id, CreatedAt = now, UpdatedAt = now,
        };
        fixture.Context.AddRange(native, anchor);
        await fixture.Context.SaveChangesAsync();
        var rootSlot = await fixture.Context.Set<SegmentStudioSegmentSlot>()
            .SingleAsync(slot => slot.ItemId == fixture.RootItemId);
        var derivedSet = await fixture.Context.Set<SegmentStudioSlotDefinitionSet>()
            .SingleAsync(set => set.TagId == 20);
        var derivedSlot = await fixture.Context.Set<SegmentStudioSlotDefinition>()
            .SingleAsync(slot => slot.SlotDefinitionSetId == derivedSet.Id);
        fixture.Context.AddRange(
            new SegmentStudioLineageNode
            {
                Id = Guid.NewGuid(), ItemId = anchor.Id, State = "live",
                LastKnownVideoId = 1, LastKnownTagId = 20,
                LastKnownStartSec = 4, LastKnownEndSec = 8,
                CreatedAt = now, UpdatedAt = now,
            },
            new SegmentStudioSegmentSlot
            {
                ItemId = anchor.Id, SlotDefinitionId = derivedSlot.Id,
                PerformerId = rootSlot.PerformerId, CreatedAt = now,
            });
        await fixture.Context.SaveChangesAsync();

        var preview = await DerivedSegmentMaterializationService.PreviewAsync(
            fixture.Context, 1, 1, CancellationToken.None);
        Assert.Equal(1, preview.CreateCount);
        Assert.Equal(0, preview.LinkCount);

        await DerivedSegmentMaterializationService.ExecuteAsync(
            fixture.Context,
            1,
            new DerivedSegmentMaterializationRequest(Guid.NewGuid(), preview.Fingerprint, 1),
            7,
            CancellationToken.None);

        Assert.True(await fixture.Context.Set<Segment>().AnyAsync(segment => segment.Id == native.Id));
        var edge = Assert.Single(await fixture.Context.Set<SegmentStudioDerivationEdge>().ToListAsync());
        var derivedNode = await fixture.Context.Set<SegmentStudioLineageNode>()
            .SingleAsync(node => node.Id == edge.DerivedNodeId);
        var derivedItem = await fixture.Context.Set<SegmentStudioItem>()
            .SingleAsync(item => item.Id == derivedNode.ItemId);
        Assert.Null(derivedItem.NativeSegmentId);
        Assert.NotEqual(anchor.Id, derivedItem.Id);
    }

    [Fact]
    public async Task StalePreviewIsRejectedBeforeWriting()
    {
        await using var fixture = await MaterializationFixture.CreateAsync();
        var preview = await DerivedSegmentMaterializationService.PreviewAsync(
            fixture.Context, 1, 3, CancellationToken.None);
        var sourceSlot = await fixture.Context.Set<SegmentStudioSegmentSlot>()
            .SingleAsync(slot => slot.ItemId == fixture.RootItemId);
        sourceSlot.PerformerId = 8;
        await fixture.Context.SaveChangesAsync();

        var conflict = await Assert.ThrowsAsync<LineageConflictException>(() =>
            DerivedSegmentMaterializationService.ExecuteAsync(
                fixture.Context,
                1,
                new DerivedSegmentMaterializationRequest(Guid.NewGuid(), preview.Fingerprint, 3),
                7,
                CancellationToken.None));

        Assert.Equal("LINEAGE_COMPONENT_CHANGED", conflict.Code);
        Assert.Equal(1, await fixture.Context.Set<SegmentStudioItem>().CountAsync());
    }

    [Fact]
    public async Task MismatchedOrDuplicateExistingRuleEdgesAreSkippedAsConflicts()
    {
        await using var fixture = await MaterializationFixture.CreateAsync();
        var preview = await DerivedSegmentMaterializationService.PreviewAsync(
            fixture.Context, 1, 1, CancellationToken.None);
        await DerivedSegmentMaterializationService.ExecuteAsync(
            fixture.Context,
            1,
            new DerivedSegmentMaterializationRequest(Guid.NewGuid(), preview.Fingerprint, 1),
            7,
            CancellationToken.None);

        var derivedSlot = await fixture.Context.Set<SegmentStudioSegmentSlot>()
            .SingleAsync(slot => slot.ItemId != fixture.RootItemId);
        derivedSlot.PerformerId = 8;
        await fixture.Context.SaveChangesAsync();
        var mismatch = await DerivedSegmentMaterializationService.PreviewAsync(
            fixture.Context, 1, 1, CancellationToken.None);
        Assert.Equal(1, mismatch.ConflictCount);
        Assert.Empty(mismatch.Outputs);

        derivedSlot.PerformerId = 7;
        var now = DateTime.UtcNow;
        var duplicateItem = new SegmentStudioItem
        {
            VideoId = 1, TagId = 20, StartSec = 4, EndSec = 8, Kind = "tag",
            SourceKey = "user", ReviewState = "unreviewed", Revision = 1,
            CreatedAt = now, UpdatedAt = now,
        };
        fixture.Context.Add(duplicateItem);
        await fixture.Context.SaveChangesAsync();
        var duplicateNode = new SegmentStudioLineageNode
        {
            Id = Guid.NewGuid(), ItemId = duplicateItem.Id, State = "live",
            LastKnownVideoId = 1, LastKnownTagId = 20, LastKnownStartSec = 4, LastKnownEndSec = 8,
            CreatedAt = now, UpdatedAt = now,
        };
        var rootNode = await fixture.Context.Set<SegmentStudioLineageNode>()
            .SingleAsync(node => node.ItemId == fixture.RootItemId);
        var rule = await fixture.Context.Set<SegmentStudioDerivationRule>()
            .SingleAsync(candidate => candidate.SourceTagId == 10);
        fixture.Context.AddRange(
            duplicateNode,
            new SegmentStudioSegmentSlot
            {
                ItemId = duplicateItem.Id,
                SlotDefinitionId = derivedSlot.SlotDefinitionId,
                PerformerId = 7,
                CreatedAt = now,
            },
            new SegmentStudioDerivationEdge
            {
                SourceNodeId = rootNode.Id,
                DerivedNodeId = duplicateNode.Id,
                RuleId = rule.Id,
                RuleVersionAtCreation = rule.Version,
                SourceTagIdAtCreation = 10,
                DerivedTagIdAtCreation = 20,
                MetadataJson = "{}",
                CreatedAt = now,
                UpdatedAt = now,
            });
        await fixture.Context.SaveChangesAsync();

        var duplicate = await DerivedSegmentMaterializationService.PreviewAsync(
            fixture.Context, 1, 1, CancellationToken.None);
        Assert.Equal(1, duplicate.ConflictCount);
        Assert.Empty(duplicate.Outputs);
    }

    private sealed class MaterializationFixture(
        SqliteConnection connection,
        MaterializationDbContext context,
        long rootItemId) : IAsyncDisposable
    {
        private readonly SqliteConnection _connection = connection;
        public MaterializationDbContext Context { get; } = context;
        public long RootItemId { get; } = rootItemId;

        public static async Task<MaterializationFixture> CreateAsync()
        {
            var connection = new SqliteConnection("Data Source=:memory:");
            await connection.OpenAsync();
            var context = new MaterializationDbContext(
                new DbContextOptionsBuilder<MaterializationDbContext>().UseSqlite(connection).Options);
            await context.Database.EnsureCreatedAsync();
            var now = DateTime.UtcNow;
            context.AddRange(
                new Tag { Id = 10, Name = "Specific" },
                new Tag { Id = 20, Name = "General" },
                new Tag { Id = 30, Name = "Broad" });
            var sets = new[]
            {
                new SegmentStudioSlotDefinitionSet { Id = Guid.NewGuid(), TagId = 10, CreatedAt = now },
                new SegmentStudioSlotDefinitionSet { Id = Guid.NewGuid(), TagId = 20, CreatedAt = now },
                new SegmentStudioSlotDefinitionSet { Id = Guid.NewGuid(), TagId = 30, CreatedAt = now },
            };
            var slots = sets.Select((set, index) => new SegmentStudioSlotDefinition
            {
                Id = Guid.NewGuid(), SlotDefinitionSetId = set.Id, Label = "Giver",
                SortOrder = 0, CreatedAt = now,
            }).ToArray();
            context.AddRange(sets);
            context.AddRange(slots);
            var root = new SegmentStudioItem
            {
                VideoId = 1, TagId = 10, StartSec = 4, EndSec = 8, Kind = "tag",
                SourceKey = "user", ReviewState = "approved", Revision = 1,
                CreatedAt = now, UpdatedAt = now,
            };
            context.Add(root);
            await context.SaveChangesAsync();
            context.AddRange(
                new SegmentStudioLineageNode
                {
                    Id = Guid.NewGuid(), ItemId = root.Id, State = "live", LastKnownVideoId = 1,
                    LastKnownTagId = 10, LastKnownStartSec = 4, LastKnownEndSec = 8,
                    CreatedAt = now, UpdatedAt = now,
                },
                new SegmentStudioSegmentSlot
                {
                    ItemId = root.Id, SlotDefinitionId = slots[0].Id, PerformerId = 7, CreatedAt = now,
                },
                Rule("specific-general", 10, 20, slots[0].Id, slots[1].Id, now),
                Rule("general-broad", 20, 30, slots[1].Id, slots[2].Id, now));
            await context.SaveChangesAsync();
            return new(connection, context, root.Id);
        }

        private static SegmentStudioDerivationRule Rule(
            string key, int sourceTagId, int derivedTagId, Guid sourceSlotId, Guid derivedSlotId, DateTime now) =>
            new()
            {
                Id = Guid.NewGuid(), Key = key, Version = "1", SourceTagId = sourceTagId,
                DerivedTagId = derivedTagId,
                MetadataJson = $$"""{"slotMappings":[{"sourceSlotDefinitionId":"{{sourceSlotId}}","derivedSlotDefinitionId":"{{derivedSlotId}}"}]}""",
                CreatedAt = now, UpdatedAt = now,
            };

        public async ValueTask DisposeAsync()
        {
            await Context.DisposeAsync();
            await _connection.DisposeAsync();
        }
    }

    private sealed class MaterializationDbContext(
        DbContextOptions<MaterializationDbContext> options) : DbContext(options)
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
            modelBuilder.Entity<SegmentStudioItem>(builder =>
            {
                builder.HasKey(item => item.Id);
                builder.HasMany(item => item.Slots).WithOne(slot => slot.Item)
                    .HasForeignKey(slot => slot.ItemId).OnDelete(DeleteBehavior.Cascade);
            });
            modelBuilder.Entity<Segment>(builder =>
            {
                builder.HasKey(segment => segment.Id);
                builder.Ignore(segment => segment.Payload);
                builder.Ignore(segment => segment.Tag);
            });
            modelBuilder.Entity<SegmentStudioLineageNode>(builder =>
            {
                builder.HasKey(node => node.Id);
                builder.HasIndex(node => node.ItemId).IsUnique();
            });
            modelBuilder.Entity<SegmentStudioSlotDefinitionSet>().HasKey(set => set.Id);
            modelBuilder.Entity<SegmentStudioSlotDefinition>(builder =>
            {
                builder.HasKey(definition => definition.Id);
                builder.HasOne(definition => definition.SlotDefinitionSet)
                    .WithMany(set => set.Definitions)
                    .HasForeignKey(definition => definition.SlotDefinitionSetId);
            });
            modelBuilder.Entity<SegmentStudioSlotDefinitionGenderHint>(builder =>
            {
                builder.HasKey(hint => new { hint.SlotDefinitionId, hint.GenderHint });
                builder.HasOne(hint => hint.SlotDefinition).WithMany(definition => definition.GenderHints)
                    .HasForeignKey(hint => hint.SlotDefinitionId);
            });
            modelBuilder.Entity<SegmentStudioSegmentSlot>(builder =>
            {
                builder.HasKey(slot => new { slot.ItemId, slot.SlotDefinitionId });
                builder.HasOne(slot => slot.SlotDefinition).WithMany()
                    .HasForeignKey(slot => slot.SlotDefinitionId);
            });
            modelBuilder.Entity<SegmentStudioDerivationRule>().HasKey(rule => rule.Id);
            modelBuilder.Entity<SegmentStudioDerivationEdge>(builder =>
            {
                builder.HasKey(edge => edge.Id);
                builder.HasIndex(edge => new { edge.SourceNodeId, edge.DerivedNodeId, edge.RuleId }).IsUnique();
            });
            modelBuilder.Entity<SegmentStudioSegmentOperation>().HasKey(operation => operation.OperationId);
            modelBuilder.Entity<SegmentStudioSegmentProvenance>().HasKey(provenance => provenance.Id);
            modelBuilder.Entity<SegmentStudioSource>().HasKey(source => source.Id);
            modelBuilder.Entity<SegmentStudioProvenanceActivity>().HasKey(activity => activity.Id);
        }
    }
}
