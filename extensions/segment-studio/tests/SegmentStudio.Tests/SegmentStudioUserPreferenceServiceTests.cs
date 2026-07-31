using Microsoft.Data.Sqlite;
using Microsoft.EntityFrameworkCore;
using SegmentStudio;

namespace SegmentStudio.Tests;

public sealed class SegmentStudioUserPreferenceServiceTests
{
    [Fact]
    public async Task ModeDefaultsToBasicAndPersistsIndependentlyPerUser()
    {
        await using var fixture = await PreferenceFixture.CreateAsync();

        Assert.Equal("editor", await SegmentStudioUserPreferenceService.GetModeAsync(
            fixture.Context, userId: 11, CancellationToken.None));

        Assert.Equal("review", await SegmentStudioUserPreferenceService.SetModeAsync(
            fixture.Context, userId: 11, mode: "full", CancellationToken.None));

        Assert.Equal("review", await SegmentStudioUserPreferenceService.GetModeAsync(
            fixture.Context, userId: 11, CancellationToken.None));
        Assert.Equal("editor", await SegmentStudioUserPreferenceService.GetModeAsync(
            fixture.Context, userId: 12, CancellationToken.None));
    }

    [Fact]
    public async Task InvalidModeIsRejectedWithoutChangingTheStoredPreference()
    {
        await using var fixture = await PreferenceFixture.CreateAsync();
        await SegmentStudioUserPreferenceService.SetModeAsync(
            fixture.Context, userId: 11, mode: "full", CancellationToken.None);

        await Assert.ThrowsAsync<ArgumentException>(() =>
            SegmentStudioUserPreferenceService.SetModeAsync(
                fixture.Context, userId: 11, mode: "unexpected", CancellationToken.None));

        Assert.Equal("review", await SegmentStudioUserPreferenceService.GetModeAsync(
            fixture.Context, userId: 11, CancellationToken.None));
    }

    private sealed class PreferenceFixture : IAsyncDisposable
    {
        private readonly SqliteConnection _connection;

        private PreferenceFixture(SqliteConnection connection, PreferenceDbContext context)
        {
            _connection = connection;
            Context = context;
        }

        public PreferenceDbContext Context { get; }

        public static async Task<PreferenceFixture> CreateAsync()
        {
            var connection = new SqliteConnection("Data Source=:memory:");
            await connection.OpenAsync();
            var options = new DbContextOptionsBuilder<PreferenceDbContext>()
                .UseSqlite(connection)
                .Options;
            var context = new PreferenceDbContext(options);
            await context.Database.EnsureCreatedAsync();
            return new PreferenceFixture(connection, context);
        }

        public async ValueTask DisposeAsync()
        {
            await Context.DisposeAsync();
            await _connection.DisposeAsync();
        }
    }

    private sealed class PreferenceDbContext(DbContextOptions<PreferenceDbContext> options)
        : DbContext(options)
    {
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<SegmentStudioUserPreference>(builder =>
            {
                builder.ToTable("segment_studio_user_preferences");
                builder.HasKey(preference => preference.UserId);
                builder.Property(preference => preference.UserId).HasColumnName("user_id");
                builder.Property(preference => preference.Mode).HasColumnName("mode");
                builder.Property(preference => preference.UpdatedAt).HasColumnName("updated_at");
            });
        }
    }
}
