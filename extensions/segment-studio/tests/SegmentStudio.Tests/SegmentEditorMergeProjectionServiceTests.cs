using Cove.Core.Entities;
using Microsoft.Data.Sqlite;
using Microsoft.EntityFrameworkCore;
using SegmentStudio;

namespace SegmentStudio.Tests;

public sealed class SegmentEditorMergeProjectionServiceTests
{
    [Fact]
    public async Task BuildsCanonicalDraftAndNativeMergeDeltas()
    {
        await using var connection = new SqliteConnection("Data Source=:memory:");
        await connection.OpenAsync();
        var options = new DbContextOptionsBuilder<MergeProjectionDbContext>()
            .UseSqlite(connection)
            .Options;
        await using var db = new MergeProjectionDbContext(options);
        await db.Database.EnsureCreatedAsync();
        var now = DateTime.UtcNow;
        db.Add(new Tag { Id = 9, Name = "Merged", SortName = "01 Merged" });
        db.AddRange(
            new SegmentStudioItem
            {
                Id = 20, VideoId = 7, TagId = 9, StartSec = 2, EndSec = 8,
                Kind = "tag", ReviewState = "approved", SourceKey = "user",
                Revision = 4, CreatedAt = now, UpdatedAt = now,
            },
            new SegmentStudioItem
            {
                Id = 30, NativeSegmentId = 40, VideoId = 7, TagId = 9,
                Kind = "tag", SourceKey = "user", Revision = 1,
                CreatedAt = now, UpdatedAt = now,
            });
        await db.SaveChangesAsync();
        var node = new SegmentStudioLineageNode
        {
            Id = Guid.NewGuid(), ItemId = 20, State = "live",
            LastKnownVideoId = 7, LastKnownTagId = 9,
            CreatedAt = now, UpdatedAt = now,
        };
        db.Add(node);
        await db.SaveChangesAsync();

        var draft = await SegmentEditorMergeProjectionService.LoadDraftAsync(
            db, new(20, null, 7, 9, 2, 8, "approved", false, 4, now),
            [21], false, true, false, CancellationToken.None);
        var native = await SegmentEditorMergeProjectionService.LoadNativeAsync(
            db, new(40, 7, 9, null, 3, 10, "approved", now, "user", null, null),
            [41], [31], true, false, true, false, CancellationToken.None);
        var basicNative = await SegmentEditorMergeProjectionService.LoadNativeAsync(
            db, new(40, 7, 9, null, 3, 10, "unreviewed", now, "user", null, null),
            [41], [], false, false, false, false, CancellationToken.None);

        Assert.Equal((-20, 20L, "Merged", "extension", 4L),
            (draft.Survivor.Id, draft.Survivor.ItemId, draft.Survivor.TagName,
                draft.Survivor.Residence, draft.Survivor.Revision));
        Assert.Equal([-21], draft.RemovedSegmentIds);
        Assert.Equal(node.Id, Assert.IsType<SegmentLineageDto>(draft.ItemMetadata![20].Lineage).NodeId);
        Assert.Empty(draft.ItemMetadata[20].Provenance);
        Assert.Equal((40, 30L, "native", 0L),
            (native.Survivor.Id, native.Survivor.ItemId,
                native.Survivor.Residence, native.Survivor.Revision));
        Assert.Equal([41], native.RemovedSegmentIds);
        Assert.Equal([31], native.RemovedItemIds);
        Assert.Equal("Merged", native.Survivor.TagName);
        Assert.Equal("01 Merged", draft.Survivor.TagSortName);
        Assert.Equal("01 Merged", native.Survivor.TagSortName);
        Assert.Equal("consistent", native.ItemMetadata![30].Lineage!.IntegrityState);
        Assert.Null(basicNative.Survivor.ItemId);
        Assert.Equal("unreviewed", basicNative.Survivor.ReviewState);
    }

    private sealed class MergeProjectionDbContext(DbContextOptions<MergeProjectionDbContext> options)
        : DbContext(options)
    {
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            var tag = modelBuilder.Entity<Tag>();
            tag.HasKey(candidate => candidate.Id);
            tag.Ignore(candidate => candidate.Aliases);
            tag.Ignore(candidate => candidate.ParentRelations);
            tag.Ignore(candidate => candidate.ChildRelations);
            tag.Ignore(candidate => candidate.RemoteIds);
            tag.Ignore(candidate => candidate.TagGroup);
            tag.Ignore(candidate => candidate.VideoTags);
            tag.Ignore(candidate => candidate.PerformerTags);
            tag.Ignore(candidate => candidate.ImageTags);
            tag.Ignore(candidate => candidate.GalleryTags);
            tag.Ignore(candidate => candidate.StudioTags);
            tag.Ignore(candidate => candidate.GroupTags);
            modelBuilder.Entity<SegmentStudioItem>().HasKey(item => item.Id);
            modelBuilder.Entity<SegmentStudioItem>().Ignore(item => item.Slots);
            modelBuilder.Entity<SegmentStudioLineageNode>().HasKey(node => node.Id);
        }
    }
}
