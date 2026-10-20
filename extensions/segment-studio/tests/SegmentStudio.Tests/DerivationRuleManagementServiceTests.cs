using Cove.Core.Entities;
using Microsoft.Data.Sqlite;
using Microsoft.EntityFrameworkCore;
using SegmentStudio;

namespace SegmentStudio.Tests;

public sealed class DerivationRuleManagementServiceTests
{
    [Fact]
    public void MutationsWrapUserTransactionsInTheConfiguredRetryStrategy()
    {
        var source = File.ReadAllText(Path.Combine(
            AppContext.BaseDirectory,
            "..", "..", "..", "..", "..",
            "src", "SegmentStudio", "DerivationRuleManagementService.cs"));

        Assert.Contains("db.Database.CreateExecutionStrategy()", source);
        Assert.Contains("strategy.ExecuteAsync(async () =>", source);
        Assert.True(source.IndexOf("strategy.ExecuteAsync", StringComparison.Ordinal)
            < source.IndexOf("BeginTransactionAsync", StringComparison.Ordinal));
        Assert.Contains("db.ChangeTracker.Clear();", source);
        Assert.True(source.IndexOf("var newRuleId = Guid.NewGuid();", StringComparison.Ordinal)
            < source.IndexOf("strategy.ExecuteAsync", StringComparison.Ordinal));
        Assert.Contains("rule.Id == newRuleId", source);
        Assert.Contains("Id = newRuleId", source);
    }

    [Fact]
    public async Task UpdatingRuleReusesTheRuleAndRemovesThePreviousDefinition()
    {
        await using var fixture = await RuleFixture.CreateAsync();
        var created = await DerivationRuleManagementService.SaveAsync(
            fixture.Context,
            new DerivationRuleSaveRequest(null, 10, 20,
                [new(fixture.SourceSlotId, fixture.DerivedSlotId)]),
            CancellationToken.None);

        var cleanup = await DerivationRuleLifecycleService.PreviewDeleteAsync(
            fixture.Context, created.Id, CancellationToken.None);
        var updated = await DerivationRuleManagementService.SaveAsync(
            fixture.Context,
            new DerivationRuleSaveRequest(created.Id, 10, 30, [], cleanup.Fingerprint),
            CancellationToken.None);

        Assert.Equal(created.Id, updated.Id);
        Assert.Equal(created.Key, updated.Key);
        Assert.NotEqual(created.Version, updated.Version);
        Assert.Equal(1, await fixture.Context.Set<SegmentStudioDerivationRule>().CountAsync());
        var views = await DerivationRuleManagementService.LoadAsync(fixture.Context, CancellationToken.None);
        Assert.Equal("Broad", Assert.Single(views).DerivedTagName);
        Assert.Empty(Assert.Single(views).SlotMappings);
    }

    [Fact]
    public async Task UpdatingRuleCanRetainItsRelationshipUnderTheUniqueIndex()
    {
        await using var fixture = await RuleFixture.CreateAsync();
        var created = await DerivationRuleManagementService.SaveAsync(
            fixture.Context,
            new DerivationRuleSaveRequest(null, 10, 20, []),
            CancellationToken.None);

        var cleanup = await DerivationRuleLifecycleService.PreviewDeleteAsync(
            fixture.Context, created.Id, CancellationToken.None);
        var updated = await DerivationRuleManagementService.SaveAsync(
            fixture.Context,
            new DerivationRuleSaveRequest(created.Id, 10, 20, [], cleanup.Fingerprint),
            CancellationToken.None);

        Assert.Equal(created.Id, updated.Id);
        Assert.Single(await fixture.Context.Set<SegmentStudioDerivationRule>().ToListAsync());
    }

    [Fact]
    public async Task SaveParticipatesInAnExistingTransaction()
    {
        await using var fixture = await RuleFixture.CreateAsync();
        await using var transaction = await fixture.Context.Database.BeginTransactionAsync();

        var created = await DerivationRuleManagementService.SaveAsync(
            fixture.Context,
            new DerivationRuleSaveRequest(null, 10, 20, []),
            CancellationToken.None);

        Assert.NotNull(await fixture.Context.Set<SegmentStudioDerivationRule>()
            .SingleAsync(rule => rule.Id == created.Id));
        await transaction.RollbackAsync();
        Assert.Empty(await fixture.Context.Set<SegmentStudioDerivationRule>().ToListAsync());
    }

    [Fact]
    public async Task RejectsCyclesAndSlotMappingsOutsideRuleTags()
    {
        await using var fixture = await RuleFixture.CreateAsync();
        var created = await DerivationRuleManagementService.SaveAsync(
            fixture.Context,
            new DerivationRuleSaveRequest(null, 10, 20,
                [new(fixture.SourceSlotId, fixture.DerivedSlotId)]),
            CancellationToken.None);

        var cycle = await Assert.ThrowsAsync<LineageConflictException>(() =>
            DerivationRuleManagementService.SaveAsync(
                fixture.Context,
                new DerivationRuleSaveRequest(null, 20, 10, []),
                CancellationToken.None));
        Assert.Equal("LINEAGE_CYCLE", cycle.Code);

        var duplicate = await Assert.ThrowsAsync<LineageConflictException>(() =>
            DerivationRuleManagementService.SaveAsync(
                fixture.Context,
                new DerivationRuleSaveRequest(null, 10, 20, []),
                CancellationToken.None));
        Assert.Equal("LINEAGE_RULE_DUPLICATE", duplicate.Code);

        await Assert.ThrowsAsync<ArgumentException>(() =>
            DerivationRuleManagementService.SaveAsync(
                fixture.Context,
                new DerivationRuleSaveRequest(null, 10, 30,
                    [new(fixture.DerivedSlotId, fixture.SourceSlotId)]),
                CancellationToken.None));

        fixture.Context.Remove(created);
        await fixture.Context.SaveChangesAsync();
        await Assert.ThrowsAsync<KeyNotFoundException>(() =>
            DerivationRuleManagementService.SaveAsync(
                fixture.Context,
                new DerivationRuleSaveRequest(created.Id, 10, 30, []),
                CancellationToken.None));
    }

    [Fact]
    public async Task MalformedMappingsDoNotBreakLoading()
    {
        await using var fixture = await RuleFixture.CreateAsync();
        var created = await DerivationRuleManagementService.SaveAsync(
            fixture.Context,
            new DerivationRuleSaveRequest(null, 10, 20, []),
            CancellationToken.None);
        created.MetadataJson = """{"slotMappings":[{},{"sourceSlotDefinitionId":"not-a-guid"}]}""";
        await fixture.Context.SaveChangesAsync();

        var loaded = await DerivationRuleManagementService.LoadAsync(
            fixture.Context,
            CancellationToken.None);
        Assert.Empty(Assert.Single(loaded).SlotMappings);

        Assert.Single(await fixture.Context.Set<SegmentStudioDerivationRule>().ToListAsync());
    }

    [Fact]
    public async Task FlagsAndRemovesMappingsWhoseSlotsAreGoneWithoutChangingTheVersion()
    {
        await using var fixture = await RuleFixture.CreateAsync();
        var createdId = (await DerivationRuleManagementService.SaveAsync(
            fixture.Context,
            new DerivationRuleSaveRequest(null, 10, 20,
                [new(fixture.SourceSlotId, fixture.DerivedSlotId)]),
            CancellationToken.None)).Id;
        var broadSet = new SegmentStudioSlotDefinitionSet { Id = Guid.NewGuid(), TagId = 30, CreatedAt = DateTime.UtcNow };
        var broadSlot = new SegmentStudioSlotDefinition
        {
            Id = Guid.NewGuid(), SlotDefinitionSetId = broadSet.Id, Label = "Giver", CreatedAt = DateTime.UtcNow,
        };
        fixture.Context.AddRange(broadSet, broadSlot);
        await fixture.Context.SaveChangesAsync();
        var healthyId = (await DerivationRuleManagementService.SaveAsync(
            fixture.Context,
            new DerivationRuleSaveRequest(null, 30, 20, [new(broadSlot.Id, fixture.DerivedSlotId)]),
            CancellationToken.None)).Id;
        var created = await fixture.Context.Set<SegmentStudioDerivationRule>().SingleAsync(rule => rule.Id == createdId);
        var healthy = await fixture.Context.Set<SegmentStudioDerivationRule>().SingleAsync(rule => rule.Id == healthyId);
        var healthyMetadata = healthy.MetadataJson;
        var deletedSlotId = Guid.NewGuid();
        // m3's derived slot belongs to the source tag, and m4 is malformed, so loading skips it and repair keeps it.
        created.MetadataJson = $$"""
            {"relationshipType":"implies","slotMappings":[
              {"id":"m2","sortOrder":0,"sourceSlotDefinitionId":"{{deletedSlotId}}","derivedSlotDefinitionId":"{{fixture.DerivedSlotId}}"},
              {"id":"m3","sortOrder":1,"sourceSlotDefinitionId":"{{fixture.SourceSlotId}}","derivedSlotDefinitionId":"{{fixture.SourceSlotId}}"},
              {"id":"m4","sortOrder":2,"sourceSlotDefinitionId":null,"derivedSlotDefinitionId":"{{deletedSlotId}}"},
              {"id":"m1","sortOrder":3,"sourceSlotDefinitionId":"{{fixture.SourceSlotId}}","derivedSlotDefinitionId":"{{fixture.DerivedSlotId}}"}]}
            """;
        var updatedAt = created.UpdatedAt = DateTime.UtcNow.AddDays(-1);
        healthy.UpdatedAt = updatedAt;
        await fixture.Context.SaveChangesAsync();
        var version = created.Version;

        var loaded = (await DerivationRuleManagementService.LoadAsync(fixture.Context, CancellationToken.None))
            .Single(rule => rule.Id == created.Id);
        Assert.Equal(
            [(true, false), (false, true), (false, false)],
            loaded.SlotMappings.Select(mapping => (mapping.SourceSlotMissing, mapping.DerivedSlotMissing)));
        Assert.Equal("Giver", loaded.SlotMappings[0].DerivedSlotLabel);
        Assert.Null(loaded.SlotMappings[0].SourceSlotLabel);

        Assert.Equal(1, await DerivationRuleManagementService.RemoveMissingSlotMappingsAsync(
            fixture.Context, CancellationToken.None));
        fixture.Context.ChangeTracker.Clear();
        var repaired = await fixture.Context.Set<SegmentStudioDerivationRule>().SingleAsync(rule => rule.Id == created.Id);
        Assert.Equal(version, repaired.Version);
        Assert.True(repaired.UpdatedAt > updatedAt);
        Assert.Contains("\"relationshipType\":\"implies\"", repaired.MetadataJson);
        var retained = System.Text.Json.Nodes.JsonNode.Parse(repaired.MetadataJson)!["slotMappings"]!.AsArray();
        Assert.Equal(
            ["m4:0", "m1:1"],
            retained.Select(mapping => $"{mapping!["id"]}:{mapping["sortOrder"]}"));
        var untouched = await fixture.Context.Set<SegmentStudioDerivationRule>().SingleAsync(rule => rule.Id == healthy.Id);
        Assert.Equal(updatedAt, untouched.UpdatedAt);
        Assert.Equal(healthyMetadata, untouched.MetadataJson);
        Assert.All(
            (await DerivationRuleManagementService.LoadAsync(fixture.Context, CancellationToken.None))
                .SelectMany(rule => rule.SlotMappings),
            mapping => Assert.False(mapping.SourceSlotMissing || mapping.DerivedSlotMissing));
        Assert.Equal(0, await DerivationRuleManagementService.RemoveMissingSlotMappingsAsync(
            fixture.Context, CancellationToken.None));
    }

    private sealed class RuleFixture(
        SqliteConnection connection,
        RuleDbContext context,
        Guid sourceSlotId,
        Guid derivedSlotId) : IAsyncDisposable
    {
        private readonly SqliteConnection _connection = connection;
        public RuleDbContext Context { get; } = context;
        public Guid SourceSlotId { get; } = sourceSlotId;
        public Guid DerivedSlotId { get; } = derivedSlotId;

        public static async Task<RuleFixture> CreateAsync()
        {
            var connection = new SqliteConnection("Data Source=:memory:");
            await connection.OpenAsync();
            var context = new RuleDbContext(
                new DbContextOptionsBuilder<RuleDbContext>().UseSqlite(connection).Options);
            await context.Database.EnsureCreatedAsync();
            context.AddRange(
                new Tag { Id = 10, Name = "Specific" },
                new Tag { Id = 20, Name = "General" },
                new Tag { Id = 30, Name = "Broad" });
            var sourceSet = new SegmentStudioSlotDefinitionSet
            {
                Id = Guid.NewGuid(), TagId = 10, CreatedAt = DateTime.UtcNow,
            };
            var derivedSet = new SegmentStudioSlotDefinitionSet
            {
                Id = Guid.NewGuid(), TagId = 20, CreatedAt = DateTime.UtcNow,
            };
            var sourceSlot = new SegmentStudioSlotDefinition
            {
                Id = Guid.NewGuid(), SlotDefinitionSetId = sourceSet.Id, Label = "Giver",
                CreatedAt = DateTime.UtcNow,
            };
            var derivedSlot = new SegmentStudioSlotDefinition
            {
                Id = Guid.NewGuid(), SlotDefinitionSetId = derivedSet.Id, Label = "Giver",
                CreatedAt = DateTime.UtcNow,
            };
            context.AddRange(sourceSet, derivedSet, sourceSlot, derivedSlot);
            await context.SaveChangesAsync();
            return new(connection, context, sourceSlot.Id, derivedSlot.Id);
        }

        public async ValueTask DisposeAsync()
        {
            await Context.DisposeAsync();
            await _connection.DisposeAsync();
        }
    }

    private sealed class RuleDbContext(DbContextOptions<RuleDbContext> options) : DbContext(options)
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
            modelBuilder.Entity<SegmentStudioSlotDefinitionSet>(builder =>
            {
                builder.HasKey(set => set.Id);
                builder.HasOne<Tag>().WithMany().HasForeignKey(set => set.TagId);
            });
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
                builder.HasOne(hint => hint.SlotDefinition)
                    .WithMany(definition => definition.GenderHints)
                    .HasForeignKey(hint => hint.SlotDefinitionId);
            });
            modelBuilder.Entity<SegmentStudioDerivationRule>(builder =>
            {
                builder.HasKey(rule => rule.Id);
                builder.HasIndex(rule => new { rule.SourceTagId, rule.DerivedTagId })
                    .IsUnique();
            });
            modelBuilder.Entity<SegmentStudioDerivationEdge>().HasKey(edge => edge.Id);
        }
    }
}
