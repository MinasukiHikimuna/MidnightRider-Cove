using Microsoft.EntityFrameworkCore;
using Npgsql;

namespace SegmentStudio.Tests;

public sealed class SegmentStudioModeLockTests
{
    [Fact]
    public async Task ExclusiveModeSwitchWaitsForInFlightSharedWork()
    {
        var connectionString =
            Environment.GetEnvironmentVariable(
                "COVE__Postgres__ConnectionString")
            ?? Environment.GetEnvironmentVariable("DATABASE_URL");
        if (string.IsNullOrWhiteSpace(connectionString))
            return;

        var builder = new NpgsqlConnectionStringBuilder(connectionString)
        {
            ApplicationName = "segment-studio-mode-lock-test",
        };
        var options = new DbContextOptionsBuilder<ModeLockDbContext>()
            .UseNpgsql(builder.ConnectionString)
            .Options;
        await using var sharedContext = new ModeLockDbContext(options);
        await using var exclusiveContext = new ModeLockDbContext(options);
        var userId = Random.Shared.Next(1, int.MaxValue);

        var shared = await SegmentStudioModeLock.AcquireSharedAsync(
            sharedContext,
            userId,
            CancellationToken.None);
        await using var transaction =
            await exclusiveContext.Database.BeginTransactionAsync();
        var exclusive = SegmentStudioModeLock
            .AcquireExclusiveTransactionAsync(
                exclusiveContext,
                userId,
                CancellationToken.None);

        Assert.NotSame(
            exclusive,
            await Task.WhenAny(exclusive, Task.Delay(200)));

        await shared.DisposeAsync();
        await exclusive.WaitAsync(TimeSpan.FromSeconds(5));
        await transaction.RollbackAsync();
    }

    private sealed class ModeLockDbContext(
        DbContextOptions<ModeLockDbContext> options) : DbContext(options);
}
