using Npgsql;

namespace SegmentStudio.Tests;

public sealed class SegmentStudioBaselineMigrationTests
{
    [Fact]
    public async Task SchemaMigrationsAndNativeTagGroupScriptApplyToFreshPostgreSqlSchema()
    {
        var connectionString =
            Environment.GetEnvironmentVariable("COVE__Postgres__ConnectionString")
            ?? Environment.GetEnvironmentVariable("DATABASE_URL");
        if (string.IsNullOrWhiteSpace(connectionString))
            return;

        var schema = $"segment_studio_baseline_test_{Guid.NewGuid():N}";
        var builder = new NpgsqlConnectionStringBuilder(connectionString)
        {
            SearchPath = schema,
        };
        await using var admin = new NpgsqlConnection(connectionString);
        await admin.OpenAsync();
        await using (var createSchema =
                     new NpgsqlCommand($"CREATE SCHEMA \"{schema}\"", admin))
        {
            await createSchema.ExecuteNonQueryAsync();
        }

        try
        {
            await using var connection = new NpgsqlConnection(builder.ConnectionString);
            await connection.OpenAsync();
            await new NpgsqlCommand(CoreSchema, connection).ExecuteNonQueryAsync();

            var migrations = new SegmentStudioExtension().GetMigrations().ToArray();
            await new NpgsqlCommand(migrations[0].UpSql, connection)
                .ExecuteNonQueryAsync();
            await new NpgsqlCommand(UpgradeFixture, connection)
                .ExecuteNonQueryAsync();
            foreach (var migration in migrations.Skip(1))
                await new NpgsqlCommand(migration.UpSql, connection)
                    .ExecuteNonQueryAsync();
            var tagGroupMigration = await File.ReadAllTextAsync(Path.Combine(
                AppContext.BaseDirectory, "scripts", "migrate-segment-groups-to-cove-tag-groups.sql"));
            await new NpgsqlCommand(tagGroupMigration, connection).ExecuteNonQueryAsync();
            await new NpgsqlCommand(tagGroupMigration, connection).ExecuteNonQueryAsync();

            Assert.Equal(32, await CountAsync(
                connection,
                "SELECT count(*) FROM pg_tables WHERE schemaname = current_schema() AND tablename LIKE 'segment_studio_%'"));
            Assert.Equal(1, await CountAsync(
                connection,
                "SELECT count(*) FROM information_schema.columns WHERE table_schema = current_schema() AND table_name = 'segment_studio_analysis_candidates' AND column_name = 'source_tag_id'"));
            Assert.Equal(0, await CountAsync(
                connection,
                "SELECT count(*) FROM pg_tables WHERE schemaname = current_schema() AND tablename = 'segment_studio_corresponding_tag_mappings'"));
            Assert.Equal(10, await CountAsync(
                connection,
                "SELECT source_tag_id FROM segment_studio_analysis_candidates WHERE candidate_key = 'retagged-before-upgrade'"));
            Assert.Equal(1, await CountAsync(
                connection,
                "SELECT count(*) FROM pg_views WHERE schemaname = current_schema() AND viewname = 'segment_studio_review_segments'"));
            Assert.Equal(9, await CountAsync(
                connection,
                "SELECT count(*) FROM pg_proc p JOIN pg_namespace n ON n.oid = p.pronamespace WHERE n.nspname = current_schema() AND p.proname LIKE 'segment_studio_%'"));
            Assert.Equal(9, await CountAsync(
                connection,
                "SELECT count(*) FROM pg_trigger t JOIN pg_class c ON c.oid = t.tgrelid JOIN pg_namespace n ON n.oid = c.relnamespace WHERE n.nspname = current_schema() AND NOT t.tgisinternal AND t.tgname LIKE 'segment_studio_%'"));
            Assert.Equal(5, await CountAsync(
                connection,
                "SELECT count(*) FROM segment_studio_sources"));
            Assert.Equal(3, await CountAsync(
                connection,
                "SELECT count(*) FROM pg_indexes WHERE schemaname = current_schema() AND tablename = 'segments' AND indexname LIKE 'IX_segment_studio_%'"));
            Assert.Equal(0, await CountAsync(
                connection,
                "SELECT count(*) FROM pg_class c JOIN pg_namespace n ON n.oid = c.relnamespace WHERE n.nspname = current_schema() AND c.relname IN ('segment_studio_workspaces', 'segment_studio_workspace_markers', 'segment_studio_item_compatibility', 'segment_studio_marker_replacement_runs', 'segment_studio_marker_replacement_receipts', 'segment_studio_slot_import_runs')"));
            Assert.Equal(1, await CountAsync(
                connection,
                "SELECT count(*) FROM tag_groups WHERE \"Name\" = 'Migrated group'"));
            Assert.Equal(1, await CountAsync(
                connection,
                "SELECT count(*) FROM tags t JOIN tag_groups g ON g.\"Id\" = t.\"TagGroupId\" WHERE t.\"Id\" = 10 AND g.\"Name\" = 'Migrated group'"));
            Assert.Equal(1, await CountAsync(
                connection,
                "SELECT count(*) FROM tags t JOIN tag_groups g ON g.\"Id\" = t.\"TagGroupId\" WHERE t.\"Id\" = 20 AND g.\"Name\" = 'Existing native group'"));
        }
        finally
        {
            await using var dropSchema =
                new NpgsqlCommand($"DROP SCHEMA \"{schema}\" CASCADE", admin);
            await dropSchema.ExecuteNonQueryAsync();
        }
    }

    private static async Task<long> CountAsync(
        NpgsqlConnection connection,
        string sql)
    {
        await using var command = new NpgsqlCommand(sql, connection);
        return Convert.ToInt64(await command.ExecuteScalarAsync());
    }

    private const string CoreSchema = """
        CREATE TABLE videos ("Id" INTEGER PRIMARY KEY);
        CREATE TABLE tag_groups (
            "Id" INTEGER GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
            "Name" TEXT NOT NULL UNIQUE,
            "Description" TEXT NULL,
            "Color" TEXT NULL,
            "SortOrder" INTEGER NOT NULL,
            "CreatedAt" TIMESTAMPTZ NOT NULL,
            "UpdatedAt" TIMESTAMPTZ NOT NULL
        );
        CREATE TABLE tags (
            "Id" INTEGER PRIMARY KEY,
            "Name" TEXT NOT NULL,
            "SortName" TEXT NULL,
            "TagGroupId" INTEGER NULL REFERENCES tag_groups("Id") ON DELETE SET NULL,
            "UpdatedAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
        );
        CREATE TABLE performers ("Id" INTEGER PRIMARY KEY);
        CREATE TABLE users ("Id" INTEGER PRIMARY KEY);
        CREATE TABLE files ("Id" INTEGER PRIMARY KEY);
        CREATE TABLE segments (
            "Id" INTEGER PRIMARY KEY,
            "HostId" INTEGER NOT NULL,
            "HostType" INTEGER NOT NULL,
            "TagId" INTEGER NULL,
            "Kind" TEXT NOT NULL,
            "Payload" JSONB NULL,
            "StartSec" DOUBLE PRECISION NOT NULL,
            "SourceKey" TEXT NULL
        );
        """;

    private const string UpgradeFixture = """
        CREATE TABLE segment_studio_corresponding_tag_mappings (
            source_tag_id integer PRIMARY KEY REFERENCES tags("Id") ON DELETE CASCADE,
            corresponding_tag_id integer NOT NULL REFERENCES tags("Id") ON DELETE CASCADE,
            created_at timestamp with time zone NOT NULL,
            updated_at timestamp with time zone NOT NULL,
            CONSTRAINT "CK_segment_studio_corresponding_tag_mappings_distinct_tags"
                CHECK (source_tag_id <> corresponding_tag_id)
        );
        INSERT INTO videos ("Id") VALUES (7);
        INSERT INTO files ("Id") VALUES (1);
        INSERT INTO tags ("Id", "Name") VALUES
            (10, 'Raw model label'),
            (20, 'Retagged destination');
        INSERT INTO tag_groups ("Name", "SortOrder", "CreatedAt", "UpdatedAt")
        VALUES ('Existing native group', 10, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);
        UPDATE tags SET "TagGroupId" = (SELECT "Id" FROM tag_groups WHERE "Name" = 'Existing native group')
        WHERE "Id" = 20;
        INSERT INTO segment_studio_segment_groups (id, name, sort_order, created_at, updated_at) VALUES
            (100, 'Migrated group', 0, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
            (101, 'Existing native group', 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);
        INSERT INTO segment_studio_segment_group_tags (segment_group_id, tag_id, sort_order) VALUES
            (100, 10, 0),
            (100, 20, 1);
        INSERT INTO segment_studio_analysis_runs (
            id, video_id, video_file_id, status, analyses, created_at, updated_at)
        VALUES (
            '11111111-1111-1111-1111-111111111111',
            7,
            1,
            'completed',
            '["aiTagging"]'::jsonb,
            CURRENT_TIMESTAMP,
            CURRENT_TIMESTAMP);
        INSERT INTO segment_studio_items (
            id, review_state, video_id, start_sec, end_sec, tag_id, kind,
            source_key, revision)
        VALUES (
            100,
            'approved',
            7,
            1,
            2,
            20,
            'tag',
            'ext:ai.tagging',
            2);
        INSERT INTO segment_studio_analysis_candidates (
            run_id, video_id, candidate_key, kind, tag_name, title, start_sec,
            end_sec, model_key, observation_count, created_at, item_id)
        VALUES (
            '11111111-1111-1111-1111-111111111111',
            7,
            'retagged-before-upgrade',
            'tag',
            'Raw model label',
            'Raw model label',
            1,
            2,
            'model',
            1,
            CURRENT_TIMESTAMP,
            100);
        """;
}
