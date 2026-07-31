using Microsoft.Data.Sqlite;
using Microsoft.EntityFrameworkCore;
using SegmentStudio;

namespace SegmentStudio.Tests;

public sealed class SegmentSourceRegistryTests
{
    [Fact]
    public async Task RegisterNormalizesKeyAndUpdatesMutableMetadataIdempotently()
    {
        await using var connection = new SqliteConnection("Data Source=:memory:");
        await connection.OpenAsync();
        var options = new DbContextOptionsBuilder<RegistryDbContext>().UseSqlite(connection).Options;
        await using var db = new RegistryDbContext(options);
        await db.Database.EnsureCreatedAsync();
        var registry = new SegmentSourceRegistry();

        var created = await registry.RegisterAsync(
            db,
            new SegmentSourceRegistration("  Vendor:Model  ", "First", "ai", "Vendor", null, null, "{}"),
            CancellationToken.None);
        var updated = await registry.RegisterAsync(
            db,
            new SegmentSourceRegistration("vendor:model", "Updated", "external", "Vendor", "model-v2", "Description", """{"verified":true}"""),
            CancellationToken.None);

        Assert.Equal(created.Id, updated.Id);
        Assert.Equal("vendor:model", updated.Key);
        Assert.Equal("Updated", updated.DisplayName);
        Assert.Equal("external", updated.Category);
        Assert.Equal("""{"verified":true}""", updated.MetadataJson);
        Assert.Single(await db.Set<SegmentStudioSource>().ToListAsync());
    }

    [Theory]
    [InlineData("")]
    [InlineData("   ")]
    public async Task RegisterRejectsEmptyNormalizedKey(string key)
    {
        await using var connection = new SqliteConnection("Data Source=:memory:");
        await connection.OpenAsync();
        var options = new DbContextOptionsBuilder<RegistryDbContext>().UseSqlite(connection).Options;
        await using var db = new RegistryDbContext(options);
        await db.Database.EnsureCreatedAsync();

        await Assert.ThrowsAsync<ArgumentException>(() => new SegmentSourceRegistry().RegisterAsync(
            db,
            new SegmentSourceRegistration(key, "Name", null, null, null, null, "{}"),
            CancellationToken.None));
    }

    private sealed class RegistryDbContext(DbContextOptions<RegistryDbContext> options) : DbContext(options)
    {
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<SegmentStudioSource>(builder =>
            {
                builder.ToTable("segment_studio_sources");
                builder.HasKey(source => source.Id);
                builder.Property(source => source.Id).HasColumnName("id");
                builder.Property(source => source.Key).HasColumnName("key");
                builder.Property(source => source.DisplayName).HasColumnName("display_name");
                builder.Property(source => source.Category).HasColumnName("category");
                builder.Property(source => source.Provider).HasColumnName("provider");
                builder.Property(source => source.DefaultModelIdentifier).HasColumnName("default_model_identifier");
                builder.Property(source => source.Description).HasColumnName("description");
                builder.Property(source => source.MetadataJson).HasColumnName("metadata");
                builder.Property(source => source.CreatedAt).HasColumnName("created_at");
                builder.Property(source => source.UpdatedAt).HasColumnName("updated_at");
                builder.HasIndex(source => source.Key).IsUnique();
            });
        }
    }
}
