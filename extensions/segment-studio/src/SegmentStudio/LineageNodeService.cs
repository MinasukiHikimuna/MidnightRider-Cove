using Microsoft.EntityFrameworkCore;
using Cove.Core.Entities;

namespace SegmentStudio;

public interface ILineageNodeService
{
    Task<SegmentStudioLineageNode> EnsureAsync(DbContext db, long itemId, CancellationToken ct);
}

public sealed class LineageNodeService : ILineageNodeService
{
    public async Task<SegmentStudioLineageNode> EnsureAsync(
        DbContext db,
        long itemId,
        CancellationToken ct)
    {
        var item = await db.Set<SegmentStudioItem>()
            .AsNoTracking()
            .SingleOrDefaultAsync(candidate => candidate.Id == itemId, ct)
            ?? throw new KeyNotFoundException("Segment Studio item was not found.");
        var videoId = item.VideoId;
        var tagId = item.TagId;
        var startSec = item.StartSec;
        var endSec = item.EndSec;
        if (item.NativeSegmentId is int nativeSegmentId)
        {
            var segment = await db.Set<Segment>().AsNoTracking()
                .SingleOrDefaultAsync(candidate => candidate.Id == nativeSegmentId, ct)
                ?? throw new InvalidOperationException("The native segment backing this item was not found.");
            if (segment.HostType != SegmentHostType.Video)
                throw new InvalidOperationException("Only video segments can be anchored in Segment Studio lineage.");
            videoId = segment.HostId;
            tagId = segment.TagId;
            startSec = segment.StartSec;
            endSec = segment.EndSec;
        }
        if (videoId is null)
            throw new InvalidOperationException("The item's video could not be resolved.");

        var now = DateTime.UtcNow;
        if (db.Database.ProviderName?.Contains("Npgsql", StringComparison.Ordinal) == true)
        {
            var nodeId = Guid.NewGuid();
            await db.Database.ExecuteSqlInterpolatedAsync($"""
                INSERT INTO segment_studio_lineage_nodes
                    (id, item_id, state, last_known_video_id, last_known_tag_id,
                     last_known_start_sec, last_known_end_sec, missing_since, created_at, updated_at)
                VALUES
                    ({nodeId}, {item.Id}, 'live', {videoId.Value}, {tagId},
                     {startSec}, {endSec}, NULL, {now}, {now})
                ON CONFLICT (item_id) WHERE item_id IS NOT NULL DO UPDATE
                SET state = 'live',
                    last_known_video_id = EXCLUDED.last_known_video_id,
                    last_known_tag_id = EXCLUDED.last_known_tag_id,
                    last_known_start_sec = EXCLUDED.last_known_start_sec,
                    last_known_end_sec = EXCLUDED.last_known_end_sec,
                    missing_since = NULL,
                    updated_at = EXCLUDED.updated_at
                """, ct);
            return await db.Set<SegmentStudioLineageNode>()
                .AsNoTracking()
                .SingleAsync(node => node.ItemId == itemId, ct);
        }

        var existing = await db.Set<SegmentStudioLineageNode>()
            .SingleOrDefaultAsync(node => node.ItemId == itemId, ct);
        if (existing is not null)
        {
            existing.State = "live";
            existing.LastKnownVideoId = videoId.Value;
            existing.LastKnownTagId = tagId;
            existing.LastKnownStartSec = startSec;
            existing.LastKnownEndSec = endSec;
            existing.MissingSince = null;
            existing.UpdatedAt = now;
            await db.SaveChangesAsync(ct);
            return existing;
        }

        var node = new SegmentStudioLineageNode
        {
            Id = Guid.NewGuid(),
            ItemId = item.Id,
            State = "live",
            LastKnownVideoId = videoId.Value,
            LastKnownTagId = tagId,
            LastKnownStartSec = startSec,
            LastKnownEndSec = endSec,
            CreatedAt = now,
            UpdatedAt = now,
        };
        db.Add(node);
        await db.SaveChangesAsync(ct);
        return node;
    }
}
