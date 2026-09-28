using System.Text.Json;
using Cove.Core.Interfaces;
using Microsoft.Data.Sqlite;
using Microsoft.EntityFrameworkCore;
using SegmentStudio;
using Xunit;

namespace SegmentStudio.Tests;

public sealed class SegmentStudioAnalysisRunsTests
{
    private static readonly DateTime Now = new(2026, 9, 27, 12, 0, 0, DateTimeKind.Utc);

    [Fact]
    public async Task ListsAVideosRunsNewestFirstWithoutTheirCandidates()
    {
        await using var fixture = await Fixture.CreateAsync();
        var older = fixture.AddRun(7, "completed", Now.AddMinutes(-10), analyses: """["aiTagging","omnishotcut"]""");
        var newer = fixture.AddRun(7, "completed", Now.AddMinutes(-5));
        fixture.AddRun(8, "completed", Now.AddMinutes(-1));
        fixture.Context.Add(new SegmentStudioAnalysisCandidate
        {
            RunId = newer,
            VideoId = 7,
            CandidateKey = "k1",
            Kind = "tag",
            TagName = "Kissing",
            Title = "Kissing",
            ModelKey = "model",
            CreatedAt = Now,
        });
        await fixture.Context.SaveChangesAsync();

        var runs = await fixture.ListAsync(7);

        Assert.Equal([newer, older], runs.Select(run => run.Id));
        Assert.Equal(["aiTagging", "omnishotcut"], runs[1].Analyses);
        Assert.All(runs, run => Assert.Equal("completed", run.Status));

        // The editor only needs each run's id and state; nothing reads candidates
        // from this endpoint, so the response does not carry them.
        using var json = JsonDocument.Parse(JsonSerializer.Serialize(runs, JsonSerializerOptions.Web));
        var first = json.RootElement[0];
        Assert.False(first.TryGetProperty("candidates", out _));
        Assert.Equal(newer.ToString(), first.GetProperty("id").GetString());
        Assert.Equal("completed", first.GetProperty("status").GetString());
        Assert.Equal("aiTagging", first.GetProperty("analyses")[0].GetString());
    }

    [Fact]
    public async Task ReturnsOnlyTheMostRecentRuns()
    {
        await using var fixture = await Fixture.CreateAsync();
        for (var index = 0; index < SegmentStudioAnalysisRuns.Limit + 5; index++)
            fixture.AddRun(7, "completed", Now.AddMinutes(-index));
        await fixture.Context.SaveChangesAsync();

        var runs = await fixture.ListAsync(7);

        Assert.Equal(SegmentStudioAnalysisRuns.Limit, runs.Count);
        Assert.Equal(Now, runs[0].CreatedAt);
        Assert.Equal(Now.AddMinutes(-(SegmentStudioAnalysisRuns.Limit - 1)), runs[^1].CreatedAt);
    }

    [Fact]
    public async Task ClosesRunsWhoseJobHasEnded()
    {
        await using var fixture = await Fixture.CreateAsync();
        var stillRunning = fixture.AddRun(7, "running", Now.AddMinutes(-9), jobId: "running-job");
        var interrupted = fixture.AddRun(7, "running", Now.AddMinutes(-8), jobId: "finished-job");
        var cancelled = fixture.AddRun(7, "queued", Now.AddMinutes(-7), jobId: "cancelled-job");
        var forgotten = fixture.AddRun(7, "running", Now.AddMinutes(-6), jobId: "unknown-job");
        var justQueued = fixture.AddRun(7, "queued", Now.AddSeconds(-30));
        var neverPickedUp = fixture.AddRun(7, "queued", Now.AddMinutes(-5));
        await fixture.Context.SaveChangesAsync();
        var jobs = new Dictionary<string, JobStatus>
        {
            ["running-job"] = JobStatus.Running,
            ["finished-job"] = JobStatus.Completed,
            ["cancelled-job"] = JobStatus.Cancelled,
        };

        var runs = (await fixture.ListAsync(7, jobId => jobs.TryGetValue(jobId, out var status) ? status : null))
            .ToDictionary(run => run.Id);

        Assert.Equal("running", runs[stillRunning].Status);
        Assert.Equal("queued", runs[justQueued].Status);
        Assert.Equal(("failed", "job_interrupted"), (runs[interrupted].Status, runs[interrupted].ErrorCode));
        Assert.Equal(("cancelled", "cancelled"), (runs[cancelled].Status, runs[cancelled].ErrorCode));
        Assert.Equal(("failed", "job_interrupted"), (runs[forgotten].Status, runs[forgotten].ErrorCode));
        Assert.Equal(("failed", "job_interrupted"), (runs[neverPickedUp].Status, runs[neverPickedUp].ErrorCode));
        Assert.Equal(Now, runs[interrupted].CompletedAt);
        Assert.Null(runs[stillRunning].CompletedAt);

        // The closed state is saved, not only reported.
        fixture.Context.ChangeTracker.Clear();
        Assert.Equal("cancelled", (await fixture.Context.Set<SegmentStudioAnalysisRun>().SingleAsync(run => run.Id == cancelled)).Status);
    }

    private sealed class Fixture(SqliteConnection connection, RunsDbContext context) : IAsyncDisposable
    {
        public RunsDbContext Context { get; } = context;

        public static async Task<Fixture> CreateAsync()
        {
            var connection = new SqliteConnection("Data Source=:memory:");
            await connection.OpenAsync();
            var context = new RunsDbContext(new DbContextOptionsBuilder<RunsDbContext>()
                .UseSqlite(connection).Options);
            await context.Database.EnsureCreatedAsync();
            return new Fixture(connection, context);
        }

        public Guid AddRun(int videoId, string status, DateTime createdAt, string? jobId = null, string analyses = """["aiTagging"]""")
        {
            var id = Guid.NewGuid();
            Context.Add(new SegmentStudioAnalysisRun
            {
                Id = id,
                VideoId = videoId,
                VideoFileId = videoId * 10,
                Status = status,
                AnalysesJson = analyses,
                JobId = jobId,
                CreatedAt = createdAt,
                UpdatedAt = createdAt,
                CompletedAt = status == "completed" ? createdAt : null,
            });
            return id;
        }

        public Task<IReadOnlyList<SegmentStudioAnalysisRunResponse>> ListAsync(
            int videoId, Func<string, JobStatus?>? jobStatus = null)
            => SegmentStudioAnalysisRuns.ListAsync(
                Context, videoId, jobStatus ?? (_ => null), Now, CancellationToken.None);

        public async ValueTask DisposeAsync()
        {
            await Context.DisposeAsync();
            await connection.DisposeAsync();
        }
    }

    private sealed class RunsDbContext(DbContextOptions<RunsDbContext> options) : DbContext(options)
    {
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<SegmentStudioAnalysisRun>().HasKey(run => run.Id);
            modelBuilder.Entity<SegmentStudioAnalysisCandidate>().HasKey(candidate => candidate.Id);
            modelBuilder.Entity<SegmentStudioAnalysisCandidate>().Ignore(candidate => candidate.Run);
            modelBuilder.Entity<SegmentStudioAnalysisCandidate>().Ignore(candidate => candidate.Item);
        }
    }
}
