using Microsoft.EntityFrameworkCore;
using Npgsql;

namespace SegmentStudio.Tests;

public sealed partial class SegmentStudioBaselineMigrationTests
{
    [Fact]
    public async Task AiTaggingProvenanceWriterRecordsOriginsInBulkOnPostgreSql()
    {
        var connectionString =
            Environment.GetEnvironmentVariable("COVE__Postgres__ConnectionString")
            ?? Environment.GetEnvironmentVariable("DATABASE_URL");
        if (string.IsNullOrWhiteSpace(connectionString))
            return;

        var schema = $"segment_studio_provenance_writer_test_{Guid.NewGuid():N}";
        var builder = new NpgsqlConnectionStringBuilder(connectionString)
        {
            SearchPath = schema,
        };
        await using var admin = new NpgsqlConnection(connectionString);
        await admin.OpenAsync();
        await using (var createSchema = new NpgsqlCommand($"CREATE SCHEMA \"{schema}\"", admin))
            await createSchema.ExecuteNonQueryAsync();

        try
        {
            await using (var connection = new NpgsqlConnection(builder.ConnectionString))
            {
                await connection.OpenAsync();
                await new NpgsqlCommand(CoreSchema, connection).ExecuteNonQueryAsync();
                foreach (var migration in new SegmentStudioExtension().GetMigrations())
                    await new NpgsqlCommand(migration.UpSql, connection).ExecuteNonQueryAsync();
                await new NpgsqlCommand(ProvenanceWriterFixture, connection).ExecuteNonQueryAsync();
            }

            await using var db = new DbContext(new DbContextOptionsBuilder()
                .UseNpgsql(builder.ConnectionString).Options);
            var sourceId = await db.Database.SqlQuery<long>(
                $"SELECT id AS \"Value\" FROM segment_studio_sources WHERE key = 'ext:ai.tagging'")
                .SingleAsync();
            var activityId = Guid.NewGuid();
            await db.Database.ExecuteSqlInterpolatedAsync($"""
                INSERT INTO segment_studio_provenance_activities (id, key, kind, source_id, metadata)
                VALUES ({activityId}, 'ai-run:ext:ai.tagging:test', 'ai-analysis', {sourceId}, CAST({"{}"} AS jsonb))
                """);
            var recordedAt = new DateTime(2026, 10, 8, 12, 0, 0, DateTimeKind.Utc);
            AiTaggingOrigin[] origins =
            [
                new(1, "actions", "actions_30", "3.0", 0.75f, recordedAt, """{"candidateKey":"k1"}"""),
                new(1, "bodyparts", "body_20", "2.0", 0.5f, recordedAt, """{"candidateKey":"k1b"}"""),
                new(2, "actions", null, null, null, null, """{"candidateKey":"k2"}"""),
                new(3, "actions", "actions_30", "3.0", 0.9f, recordedAt, """{"candidateKey":"k3"}"""),
                // A draft whose node already has a derived node is left to the services,
                // which also record the assertion it passes on.
                new(4, "actions", "actions_30", "3.0", 0.9f, recordedAt, """{"candidateKey":"k4"}"""),
            ];

            IReadOnlySet<long> written;
            await using (var transaction = await db.Database.BeginTransactionAsync())
            {
                written = await AiTaggingProvenanceWriter.RecordAsync(
                    db, sourceId, activityId, origins, CancellationToken.None);
                // A retried dispatch records nothing twice.
                await AiTaggingProvenanceWriter.RecordAsync(
                    db, sourceId, activityId, origins, CancellationToken.None);
                await transaction.CommitAsync();
            }

            Assert.Equal([1L, 2L, 3L], written.Order());
            var connectionForAsserts = (NpgsqlConnection)db.Database.GetDbConnection();
            await connectionForAsserts.OpenAsync();
            Assert.Equal(4, await CountAsync(connectionForAsserts,
                "SELECT count(*) FROM segment_studio_segment_provenance"));
            Assert.Equal(1, await CountAsync(connectionForAsserts,
                $"SELECT count(*) FROM segment_studio_segment_provenance p JOIN segment_studio_lineage_nodes n ON n.id = p.lineage_node_id WHERE n.item_id = 1 AND p.model_key = 'actions' AND p.model_identifier = 'actions_30' AND p.model_version = '3.0' AND p.confidence = 0.75 AND p.relation = 'origin' AND p.activity_id = '{activityId}' AND p.source_id = {sourceId} AND p.metadata ->> 'candidateKey' = 'k1' AND p.recorded_at = '2026-10-08T12:00:00Z'"));
            Assert.Equal(1, await CountAsync(connectionForAsserts,
                "SELECT count(*) FROM segment_studio_segment_provenance p JOIN segment_studio_lineage_nodes n ON n.id = p.lineage_node_id WHERE n.item_id = 1 AND p.model_key = 'bodyparts'"));
            Assert.Equal(1, await CountAsync(connectionForAsserts,
                "SELECT count(*) FROM segment_studio_segment_provenance p JOIN segment_studio_lineage_nodes n ON n.id = p.lineage_node_id WHERE n.item_id = 2 AND p.model_identifier IS NULL AND p.confidence IS NULL"));
            // The existing node of draft 3 is reused and brought up to date.
            Assert.Equal(1, await CountAsync(connectionForAsserts,
                "SELECT count(*) FROM segment_studio_lineage_nodes WHERE item_id = 3 AND id = '33333333-3333-3333-3333-333333333333' AND state = 'live' AND last_known_start_sec = 3 AND last_known_end_sec = 4"));
            Assert.Equal(1, await CountAsync(connectionForAsserts,
                "SELECT count(*) FROM segment_studio_segment_provenance p JOIN segment_studio_lineage_nodes n ON n.id = p.lineage_node_id WHERE n.item_id = 3"));
            Assert.Equal(0, await CountAsync(connectionForAsserts,
                "SELECT count(*) FROM segment_studio_segment_provenance p JOIN segment_studio_lineage_nodes n ON n.id = p.lineage_node_id WHERE n.item_id IN (4, 5)"));
            Assert.Equal(5, await CountAsync(connectionForAsserts,
                "SELECT count(*) FROM segment_studio_lineage_nodes"));
        }
        finally
        {
            await using var dropSchema = new NpgsqlCommand($"DROP SCHEMA \"{schema}\" CASCADE", admin);
            await dropSchema.ExecuteNonQueryAsync();
        }
    }

    private const string ProvenanceWriterFixture = """
        INSERT INTO videos ("Id") VALUES (7);
        INSERT INTO tags ("Id", "Name") VALUES (10, 'Kissing'), (11, 'Derived');
        INSERT INTO segment_studio_items (
            id, review_state, video_id, start_sec, end_sec, tag_id, kind, source_key, revision)
        VALUES
            (1, 'unreviewed', 7, 1, 2, 10, 'tag', 'ext:ai.tagging', 1),
            (2, 'unreviewed', 7, 2, 3, 10, 'tag', 'ext:ai.tagging', 1),
            (3, 'unreviewed', 7, 3, 4, 10, 'tag', 'ext:ai.tagging', 1),
            (4, 'unreviewed', 7, 4, 5, 10, 'tag', 'ext:ai.tagging', 1),
            (5, 'unreviewed', 7, 4, 5, 11, 'tag', 'user', 1);
        INSERT INTO segment_studio_lineage_nodes (
            id, item_id, state, last_known_video_id, last_known_tag_id,
            last_known_start_sec, last_known_end_sec, missing_since)
        VALUES
            ('33333333-3333-3333-3333-333333333333', 3, 'live', 7, 10, 0, 1, NULL),
            ('44444444-4444-4444-4444-444444444444', 4, 'live', 7, 10, 4, 5, NULL),
            ('55555555-5555-5555-5555-555555555555', 5, 'live', 7, 11, 4, 5, NULL);
        INSERT INTO segment_studio_derivation_rules (id, key, version, source_tag_id, derived_tag_id)
        VALUES ('66666666-6666-6666-6666-666666666666', 'rule', '1', 10, 11);
        INSERT INTO segment_studio_derivation_edges (
            source_node_id, derived_node_id, rule_id,
            source_tag_id_at_creation, derived_tag_id_at_creation, rule_version_at_creation)
        VALUES (
            '44444444-4444-4444-4444-444444444444', '55555555-5555-5555-5555-555555555555',
            '66666666-6666-6666-6666-666666666666', 10, 11, '1');
        """;
}
