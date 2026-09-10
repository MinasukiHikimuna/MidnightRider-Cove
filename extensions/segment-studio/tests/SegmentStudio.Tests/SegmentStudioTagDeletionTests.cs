using Npgsql;

namespace SegmentStudio.Tests;

public sealed partial class SegmentStudioBaselineMigrationTests
{
    [Theory]
    [InlineData(false, 20, false)]
    [InlineData(true, 20, false)]
    [InlineData(true, 20, true)]
    [InlineData(false, 40, false)]
    [InlineData(true, 40, false)]
    [InlineData(true, 40, true)]
    public async Task TagDeletionCascadesDependenciesAndPreservesOptionalReferences(bool upgrade, int tagId, bool legacyOwner)
    {
        var connectionString = Environment.GetEnvironmentVariable("COVE__Postgres__ConnectionString")
            ?? Environment.GetEnvironmentVariable("DATABASE_URL");
        Assert.False(string.IsNullOrWhiteSpace(connectionString), "PostgreSQL is required for cascade verification.");
        var schema = $"segment_studio_tag_delete_test_{Guid.NewGuid():N}";
        await using var admin = new NpgsqlConnection(connectionString);
        await admin.OpenAsync();
        await new NpgsqlCommand($"CREATE SCHEMA \"{schema}\"", admin).ExecuteNonQueryAsync();
        try
        {
            await using var connection = new NpgsqlConnection(new NpgsqlConnectionStringBuilder(connectionString)
            {
                SearchPath = schema,
            }.ConnectionString);
            await connection.OpenAsync();
            await new NpgsqlCommand(CoreSchema, connection).ExecuteNonQueryAsync();
            var migrations = new SegmentStudioExtension().GetMigrations().ToArray();
            if (upgrade)
            {
                foreach (var migration in migrations.Where(m => m.Name is "001_initial_schema" or "002_corresponding_tags" or "003_remove_corresponding_tags"))
                    await ApplyRecordedMigrationAsync(connection, migration,
                        legacyOwner ? "segment-studio" : "com.midnightrider.segment-studio");
                await new NpgsqlCommand(TagDeletionFixture, connection).ExecuteNonQueryAsync();
            }
            foreach (var migration in migrations)
                await ApplyRecordedMigrationAsync(connection, migration, "com.midnightrider.segment-studio");
            Assert.Equal(5, await CountAsync(connection, "SELECT count(*) FROM extension_migrations WHERE extension_id = 'com.midnightrider.segment-studio'"));
            if (legacyOwner)
                Assert.Equal(3, await CountAsync(connection, "SELECT count(*) FROM extension_migrations WHERE extension_id = 'segment-studio'"));
            if (!upgrade)
                await new NpgsqlCommand(TagDeletionFixture, connection).ExecuteNonQueryAsync();

            // Database enforcement must not depend on the extension being loaded or an EF model.
            await using (var transaction = await connection.BeginTransactionAsync())
            {
                await new NpgsqlCommand("DELETE FROM tags WHERE \"Id\" = 10", connection, transaction).ExecuteNonQueryAsync();
                Assert.Equal(1, await CountAsync(connection, "SELECT count(*) FROM segment_studio_analysis_candidates WHERE source_tag_id IS NULL AND item_id = 100"));
                await transaction.RollbackAsync();
            }
            await using (var transaction = await connection.BeginTransactionAsync())
            {
                await new NpgsqlCommand($"DELETE FROM tags WHERE \"Id\" = {tagId}", connection, transaction).ExecuteNonQueryAsync();
                await AssertTagDeletionAsync(connection, tagId);
                await transaction.RollbackAsync();
            }
            Assert.Equal(5, await CountAsync(connection, "SELECT count(*) FROM segment_studio_items"));
            Assert.Equal(4, await CountAsync(connection, "SELECT count(*) FROM segment_studio_derivation_edges"));
            Assert.Equal(1, await CountAsync(connection, "SELECT count(*) FROM segment_studio_history_sessions"));
            Assert.Equal(0, await CountAsync(connection, "SELECT count(*) FROM segment_studio_blob_cleanup_outbox"));
            await new NpgsqlCommand($"DELETE FROM tags WHERE \"Id\" = {tagId}", connection).ExecuteNonQueryAsync();
            await AssertTagDeletionAsync(connection, tagId);
        }
        finally
        {
            await new NpgsqlCommand($"DROP SCHEMA \"{schema}\" CASCADE", admin).ExecuteNonQueryAsync();
        }
    }

    private static async Task ApplyRecordedMigrationAsync(NpgsqlConnection connection, Cove.Plugins.ExtensionMigration migration, string owner)
    {
        await using var receipt = new NpgsqlCommand("SELECT count(*) FROM extension_migrations WHERE extension_id = @owner AND migration_name = @name", connection);
        receipt.Parameters.AddWithValue("owner", owner);
        receipt.Parameters.AddWithValue("name", migration.Name);
        if (Convert.ToInt64(await receipt.ExecuteScalarAsync()) > 0) return;
        await using var transaction = await connection.BeginTransactionAsync();
        await new NpgsqlCommand(migration.UpSql, connection, transaction).ExecuteNonQueryAsync();
        await using var record = new NpgsqlCommand("INSERT INTO extension_migrations (extension_id, migration_name) VALUES (@owner, @name)", connection, transaction);
        record.Parameters.AddWithValue("owner", owner);
        record.Parameters.AddWithValue("name", migration.Name);
        await record.ExecuteNonQueryAsync();
        await transaction.CommitAsync();
    }

    private static async Task AssertTagDeletionAsync(NpgsqlConnection connection, int tagId)
    {
        Assert.Equal(0, await CountAsync(connection, $"SELECT count(*) FROM tags WHERE \"Id\" = {tagId}"));
        Assert.Equal(0, await CountAsync(connection, "SELECT count(*) FROM segment_studio_items WHERE id IN (300, 500)"));
        Assert.Equal(tagId == 20 ? 1 : 0, await CountAsync(connection, "SELECT count(*) FROM segment_studio_items WHERE id = 400"));
        Assert.Equal(1, await CountAsync(connection, "SELECT count(*) FROM segment_studio_items WHERE id = 200"));
        Assert.Equal(tagId == 20 ? 1 : 0, await CountAsync(connection, "SELECT count(*) FROM segment_studio_derivation_edges"));
        Assert.Equal(1, await CountAsync(connection, "SELECT count(*) FROM segment_studio_analysis_candidates WHERE source_tag_id = 10"));
        Assert.Equal(0, await CountAsync(connection, "SELECT count(*) FROM segment_studio_history_sessions"));
        Assert.Equal(1, await CountAsync(connection, "SELECT count(*) FROM segment_studio_segment_provenance WHERE lineage_node_id = md5('200')::uuid AND relation = 'origin' AND superseded_at IS NULL"));
        if (tagId == 20)
        {
            Assert.Equal(1, await CountAsync(connection, "SELECT count(*) FROM segment_studio_analysis_candidates WHERE item_id IS NULL"));
            Assert.Equal(1, await CountAsync(connection, "SELECT count(*) FROM segment_studio_segment_provenance WHERE lineage_node_id = md5('400')::uuid AND relation = 'inherited' AND source_id = (SELECT id FROM segment_studio_sources WHERE key = 'ext:ai.tagging') AND superseded_at IS NOT NULL"));
            Assert.Equal(1, await CountAsync(connection, "SELECT count(*) FROM segment_studio_segment_provenance WHERE lineage_node_id = md5('400')::uuid AND relation = 'inherited' AND source_id = (SELECT id FROM segment_studio_sources WHERE key = 'tpdb') AND superseded_at IS NULL"));
            Assert.Equal(1, await CountAsync(connection, "SELECT count(*) FROM segment_studio_lineage_nodes WHERE last_known_tag_id = 20 AND state = 'missing' AND item_id IS NULL AND missing_since IS NOT NULL"));
            Assert.Equal(0, await CountAsync(connection, "SELECT count(*) FROM segment_studio_native_recycle_bin"));
            Assert.Equal(0, await CountAsync(connection, "SELECT count(*) FROM segment_studio_incorrect_examples"));
            Assert.Equal(0, await CountAsync(connection, "SELECT count(*) FROM segment_studio_slot_definition_sets"));
            Assert.Equal(0, await CountAsync(connection, "SELECT count(*) FROM segment_studio_slot_definitions"));
            Assert.Equal(0, await CountAsync(connection, "SELECT count(*) FROM segment_studio_segment_slots"));
            Assert.Equal(2, await CountAsync(connection, "SELECT count(*) FROM segment_studio_blob_cleanup_outbox WHERE blob_id IN ('owned-test-blob', 'bin-test-blob') AND status = 'pending'"));
        }
    }

    private const string TagDeletionFixture = """
        INSERT INTO videos ("Id") VALUES (7);
        INSERT INTO files ("Id") VALUES (1);
        INSERT INTO performers ("Id") VALUES (1);
        INSERT INTO users ("Id") VALUES (1);
        INSERT INTO segment_studio_history_sessions (user_id, video_id) VALUES (1, 7);
        INSERT INTO tags ("Id", "Name") VALUES (10, 'Analysis source'), (20, 'Root'), (30, 'Other root'), (40, 'Derived'), (50, 'Descendant');
        INSERT INTO segment_studio_items (id, review_state, video_id, start_sec, end_sec, tag_id, kind, source_key)
        VALUES (100, 'unreviewed', 7, 1, 2, 20, 'tag', 'manual'),
               (200, 'unreviewed', 7, 1, 2, 30, 'tag', 'manual'),
               (300, 'unreviewed', 7, 1, 2, 40, 'tag', 'manual'),
               (400, 'unreviewed', 7, 1, 2, 40, 'tag', 'manual'),
               (500, 'unreviewed', 7, 1, 2, 50, 'tag', 'manual');
        UPDATE segment_studio_items SET extension_image_blob_id = 'owned-test-blob' WHERE id = 100;
        INSERT INTO segment_studio_lineage_nodes (id, item_id, state, last_known_video_id, last_known_tag_id)
        SELECT md5(id::text)::uuid, id, 'live', 7, tag_id FROM segment_studio_items;
        INSERT INTO segment_studio_derivation_rules (id, key, version, source_tag_id, derived_tag_id)
        VALUES (md5('rule1')::uuid, 'rule1', '1', 20, 40), (md5('rule2')::uuid, 'rule2', '1', 30, 40), (md5('rule3')::uuid, 'rule3', '1', 40, 50);
        INSERT INTO segment_studio_derivation_edges (source_node_id, derived_node_id, rule_id, source_tag_id_at_creation, derived_tag_id_at_creation, rule_version_at_creation)
        VALUES (md5('100')::uuid, md5('300')::uuid, md5('rule1')::uuid, 20, 40, '1'),
               (md5('100')::uuid, md5('400')::uuid, md5('rule1')::uuid, 20, 40, '1'),
               (md5('200')::uuid, md5('400')::uuid, md5('rule2')::uuid, 30, 40, '1'),
               (md5('300')::uuid, md5('500')::uuid, md5('rule3')::uuid, 40, 50, '1');
        INSERT INTO segment_studio_segment_provenance (lineage_node_id, source_id, relation)
        VALUES (md5('100')::uuid, (SELECT id FROM segment_studio_sources WHERE key = 'ext:ai.tagging'), 'origin'),
               (md5('200')::uuid, (SELECT id FROM segment_studio_sources WHERE key = 'tpdb'), 'origin'),
               (md5('400')::uuid, (SELECT id FROM segment_studio_sources WHERE key = 'ext:ai.tagging'), 'inherited'),
               (md5('400')::uuid, (SELECT id FROM segment_studio_sources WHERE key = 'tpdb'), 'inherited');
        INSERT INTO segment_studio_native_recycle_bin (id, video_id, tag_id, start_sec, end_sec, kind, source_key, image_blob_id, native_created_at)
        VALUES (1, 7, 20, 1, 2, 'tag', 'manual', 'bin-test-blob', CURRENT_TIMESTAMP);
        INSERT INTO segment_studio_incorrect_examples (item_id, native_bin_entry_id, video_id, snapshot, created_at)
        VALUES (100, NULL, 7, '{}', CURRENT_TIMESTAMP), (NULL, 1, 7, '{}', CURRENT_TIMESTAMP);
        INSERT INTO segment_studio_slot_definition_sets (id, tag_id) VALUES (md5('set')::uuid, 20);
        INSERT INTO segment_studio_slot_definitions (id, slot_definition_set_id, sort_order) VALUES (md5('slot')::uuid, md5('set')::uuid, 0);
        INSERT INTO segment_studio_segment_slots (slot_definition_id, performer_id, item_id) VALUES (md5('slot')::uuid, 1, 100);
        INSERT INTO segment_studio_analysis_runs (id, video_id, video_file_id, status, analyses, created_at, updated_at)
        VALUES (md5('run')::uuid, 7, 1, 'completed', '[]', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);
        INSERT INTO segment_studio_analysis_candidates (run_id, video_id, candidate_key, kind, tag_name, title, start_sec, end_sec, model_key, observation_count, created_at, item_id, source_tag_id)
        VALUES (md5('run')::uuid, 7, 'candidate', 'tag', 'Analysis source', 'Analysis source', 1, 2, 'model', 1, CURRENT_TIMESTAMP, 100, 10);
        """;
}
