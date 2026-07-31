namespace SegmentStudio.Tests;

using Microsoft.Data.Sqlite;
using Microsoft.EntityFrameworkCore;

public sealed class DerivedTagGuardTests
{
    [Fact]
    public async Task BatchStatusIncludesOnlyLiveItemsWithIncomingEdges()
    {
        await using var connection = new SqliteConnection("Data Source=:memory:");
        await connection.OpenAsync();
        var options = new DbContextOptionsBuilder<GuardDbContext>()
            .UseSqlite(connection)
            .Options;
        await using var db = new GuardDbContext(options);
        await db.Database.EnsureCreatedAsync();

        var root = Node(1);
        var derived = Node(2);
        var sourceOnly = Node(3);
        var missingDerived = Node(4, "missing");
        db.AddRange(root, derived, sourceOnly, missingDerived);
        db.AddRange(
            Edge(root, derived),
            Edge(sourceOnly, missingDerived));
        await db.SaveChangesAsync();

        var result = await DerivedTagGuard.LoadDerivedItemIdsAsync(
            db, [1, 2, 3, 4, 99], CancellationToken.None);

        Assert.Equal([2L], result);
        Assert.Empty(await DerivedTagGuard.LoadDerivedItemIdsAsync(
            db, [], CancellationToken.None));
    }

    private static SegmentStudioLineageNode Node(long itemId, string state = "live") =>
        new()
        {
            Id = Guid.NewGuid(),
            ItemId = itemId,
            State = state,
            LastKnownVideoId = 1,
        };

    private static SegmentStudioDerivationEdge Edge(
        SegmentStudioLineageNode source,
        SegmentStudioLineageNode derived) =>
        new()
        {
            SourceNodeId = source.Id,
            DerivedNodeId = derived.Id,
            RuleId = Guid.NewGuid(),
            RuleVersionAtCreation = "1",
            SourceTagIdAtCreation = 1,
            DerivedTagIdAtCreation = 2,
        };

    private sealed class GuardDbContext(DbContextOptions<GuardDbContext> options)
        : DbContext(options)
    {
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<SegmentStudioLineageNode>().HasKey(node => node.Id);
            modelBuilder.Entity<SegmentStudioDerivationEdge>().HasKey(edge => edge.Id);
        }
    }
}
