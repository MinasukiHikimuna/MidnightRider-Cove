using Microsoft.Data.Sqlite;
using Microsoft.EntityFrameworkCore;
using SegmentStudio;

namespace SegmentStudio.Tests;

public sealed class SegmentEditorMetadataServiceTests
{
    [Fact]
    public async Task LoadsCurrentLineageAndProvenanceInOneVideoProjection()
    {
        await using var connection = new SqliteConnection("Data Source=:memory:");
        await connection.OpenAsync();
        var options = new DbContextOptionsBuilder<MetadataDbContext>()
            .UseSqlite(connection)
            .Options;
        await using var db = new MetadataDbContext(options);
        await db.Database.EnsureCreatedAsync();
        var now = DateTime.UtcNow;
        var source = new SegmentStudioSource
        {
            Key = "model",
            DisplayName = "Model",
            Category = "ai",
            Provider = "Cove",
            CreatedAt = now,
            UpdatedAt = now,
        };
        var parentItem = Item(41, 7, 10, now);
        var childItem = Item(42, 7, 20, now);
        var parentNode = Node(parentItem.Id, 7, 10, now);
        var childNode = Node(childItem.Id, 7, 20, now);
        var rule = new SegmentStudioDerivationRule
        {
            Id = Guid.NewGuid(),
            Key = "derived",
            Version = "current-version",
            SourceTagId = 10,
            DerivedTagId = 20,
            CreatedAt = now,
            UpdatedAt = now,
        };
        db.AddRange(source, parentItem, childItem, parentNode, childNode, rule);
        await db.SaveChangesAsync();
        db.Add(new SegmentStudioDerivationEdge
        {
            SourceNodeId = parentNode.Id,
            DerivedNodeId = childNode.Id,
            RuleId = rule.Id,
            RuleVersionAtCreation = "creation-version",
            SourceTagIdAtCreation = 10,
            DerivedTagIdAtCreation = 20,
            MetadataJson = "{}",
            CreatedAt = now,
            UpdatedAt = now,
        });
        db.Add(new SegmentStudioSegmentProvenance
        {
            LineageNodeId = parentNode.Id,
            SourceId = source.Id,
            Relation = "origin",
            MetadataJson = "{}",
            CreatedAt = now,
            UpdatedAt = now,
        });
        await db.SaveChangesAsync();

        var result = await SegmentEditorMetadataService.LoadAsync(
            db, 7, [parentItem.Id, childItem.Id], true, true, CancellationToken.None);

        Assert.Equal("model", Assert.Single(result[parentItem.Id].Provenance).SourceKey);
        var childLineage = Assert.IsType<SegmentLineageDto>(result[childItem.Id].Lineage);
        Assert.Equal(2, childLineage.ComponentSize);
        Assert.Equal("unchecked", childLineage.IntegrityState);
        Assert.Equal("current-version", Assert.Single(childLineage.Parents).RuleVersion);

        var hidden = await SegmentEditorMetadataService.LoadAsync(
            db, 7, [parentItem.Id], false, false, CancellationToken.None);
        Assert.Empty(hidden[parentItem.Id].Provenance);
        Assert.Null(hidden[parentItem.Id].Lineage);
    }

    private static SegmentStudioItem Item(long id, int videoId, int tagId, DateTime now) => new()
    {
        Id = id,
        VideoId = videoId,
        TagId = tagId,
        StartSec = id,
        EndSec = id + 1,
        ReviewState = "unreviewed",
        Kind = "tag",
        SourceKey = "user",
        Revision = 1,
        CreatedAt = now,
        UpdatedAt = now,
    };

    private static SegmentStudioLineageNode Node(long itemId, int videoId, int tagId, DateTime now) => new()
    {
        Id = Guid.NewGuid(),
        ItemId = itemId,
        State = "live",
        LastKnownVideoId = videoId,
        LastKnownTagId = tagId,
        LastKnownStartSec = itemId,
        CreatedAt = now,
        UpdatedAt = now,
    };

    private sealed class MetadataDbContext(DbContextOptions<MetadataDbContext> options) : DbContext(options)
    {
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<SegmentStudioItem>().HasKey(item => item.Id);
            modelBuilder.Entity<SegmentStudioItem>().Ignore(item => item.Slots);
            modelBuilder.Entity<SegmentStudioSource>().HasKey(source => source.Id);
            modelBuilder.Entity<SegmentStudioProvenanceActivity>().HasKey(activity => activity.Id);
            modelBuilder.Entity<SegmentStudioLineageNode>().HasKey(node => node.Id);
            modelBuilder.Entity<SegmentStudioSegmentProvenance>().HasKey(assertion => assertion.Id);
            modelBuilder.Entity<SegmentStudioDerivationRule>().HasKey(rule => rule.Id);
            modelBuilder.Entity<SegmentStudioDerivationEdge>().HasKey(edge => edge.Id);
        }
    }
}
