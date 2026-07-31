using Npgsql;

namespace SegmentStudio.Tests;

public sealed class SegmentStudioBaselineMigrationTests
{
    [Fact]
    public async Task InitialSchemaAppliesToFreshPostgreSqlSchema()
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

            var migration = Assert.Single(
                new SegmentStudioExtension().GetMigrations());
            await new NpgsqlCommand(migration.UpSql, connection)
                .ExecuteNonQueryAsync();

            Assert.Equal(32, await CountAsync(
                connection,
                "SELECT count(*) FROM pg_tables WHERE schemaname = current_schema() AND tablename LIKE 'segment_studio_%'"));
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
        CREATE TABLE tags ("Id" INTEGER PRIMARY KEY);
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
}
