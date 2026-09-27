using System.Text.Json;
using Microsoft.EntityFrameworkCore;

namespace SegmentStudio;

/// <summary>One draft's AI origin, as recorded under a run's activity.</summary>
public sealed record AiTaggingOrigin(
    long ItemId,
    string? ModelKey,
    string? ModelIdentifier,
    string? ModelVersion,
    float? Confidence,
    DateTime? RecordedAt,
    string MetadataJson);

/// <summary>
/// Records the AI origins of a run's drafts on PostgreSQL in a fixed number of
/// statements, however many drafts the run produced.
/// </summary>
/// <remarks>
/// Recording each origin through <see cref="ISegmentProvenanceService"/> takes about
/// a dozen statements per draft, which for a long video's thousands of drafts keeps
/// the projection's transaction open for many seconds. This writer creates the
/// drafts' lineage nodes and origin assertions with one statement each, writing the
/// same rows the services would. It takes only drafts the services would treat
/// identically: owned drafts (a draft anchoring a native segment takes its lineage
/// from the segment) whose node has no derived nodes yet (an assertion on such a
/// node is also inherited by every node derived from it). The caller records the
/// remaining drafts through the services, holds the video's review lock, and runs
/// this in its transaction.
/// </remarks>
public static class AiTaggingProvenanceWriter
{
    private static readonly JsonSerializerOptions JsonOptions = new(JsonSerializerDefaults.Web);

    public static bool Supports(DbContext db) =>
        db.Database.ProviderName?.Contains("Npgsql", StringComparison.Ordinal) == true;

    /// <summary>
    /// Records the origins of every draft this writer can take and returns those
    /// drafts' ids; the origins of any other draft are left to the caller.
    /// </summary>
    public static async Task<IReadOnlySet<long>> RecordAsync(
        DbContext db,
        long sourceId,
        Guid activityId,
        IReadOnlyList<AiTaggingOrigin> origins,
        CancellationToken ct)
    {
        if (!Supports(db))
            throw new InvalidOperationException("The bulk provenance writer requires PostgreSQL.");
        var itemIds = origins.Select(origin => origin.ItemId).Distinct().ToArray();
        if (itemIds.Length == 0)
            return new HashSet<long>();

        var eligible = (await db.Database.SqlQuery<long>($"""
                SELECT item.id AS "Value"
                FROM segment_studio_items item
                WHERE item.id = ANY({itemIds})
                  AND item.native_segment_id IS NULL
                  AND item.video_id IS NOT NULL
                  AND NOT EXISTS (
                      SELECT 1
                      FROM segment_studio_lineage_nodes node
                      JOIN segment_studio_derivation_edges edge
                        ON edge.source_node_id = node.id
                      WHERE node.item_id = item.id)
                """).ToListAsync(ct)).ToHashSet();
        if (eligible.Count == 0)
            return eligible;
        var eligibleIds = eligible.ToArray();

        var now = DateTime.UtcNow;
        await db.Database.ExecuteSqlInterpolatedAsync($"""
            INSERT INTO segment_studio_lineage_nodes
                (id, item_id, state, last_known_video_id, last_known_tag_id,
                 last_known_start_sec, last_known_end_sec, missing_since, created_at, updated_at)
            SELECT gen_random_uuid(), item.id, 'live', item.video_id, item.tag_id,
                   item.start_sec, item.end_sec, NULL, {now}, {now}
            FROM segment_studio_items item
            WHERE item.id = ANY({eligibleIds})
            ON CONFLICT (item_id) WHERE item_id IS NOT NULL DO UPDATE
            SET state = 'live',
                last_known_video_id = EXCLUDED.last_known_video_id,
                last_known_tag_id = EXCLUDED.last_known_tag_id,
                last_known_start_sec = EXCLUDED.last_known_start_sec,
                last_known_end_sec = EXCLUDED.last_known_end_sec,
                missing_since = NULL,
                updated_at = EXCLUDED.updated_at
            """, ct);

        var rows = JsonSerializer.Serialize(
            origins.Where(origin => eligible.Contains(origin.ItemId)).Select(origin => new
            {
                item_id = origin.ItemId,
                model_key = origin.ModelKey,
                model_identifier = origin.ModelIdentifier,
                model_version = origin.ModelVersion,
                confidence = origin.Confidence,
                recorded_at = origin.RecordedAt,
                metadata = JsonDocument.Parse(origin.MetadataJson).RootElement,
            }),
            JsonOptions);
        await db.Database.ExecuteSqlInterpolatedAsync($"""
            INSERT INTO segment_studio_segment_provenance
                (lineage_node_id, source_id, relation, activity_id, model_key,
                 model_identifier, model_version, confidence, recorded_at, metadata,
                 superseded_at, created_at, updated_at)
            SELECT node.id, {sourceId}, 'origin', {activityId}, origin.model_key,
                   origin.model_identifier, origin.model_version, origin.confidence,
                   origin.recorded_at, origin.metadata, NULL, {now}, {now}
            FROM jsonb_to_recordset(CAST({rows} AS jsonb)) AS origin(
                item_id bigint,
                model_key text,
                model_identifier text,
                model_version text,
                confidence real,
                recorded_at timestamptz,
                metadata jsonb)
            JOIN segment_studio_lineage_nodes node ON node.item_id = origin.item_id
            ON CONFLICT
                (lineage_node_id, source_id, relation, activity_id, model_key,
                 model_identifier, model_version)
                WHERE superseded_at IS NULL
            DO NOTHING
            """, ct);
        return eligible;
    }
}
