using Cove.Core.Auth;
using Cove.Core.Interfaces;
using Microsoft.Extensions.DependencyInjection;

namespace AnimatedTagPreviews.Backend.Tests;

public sealed class PreviewJobCoordinatorTests
{
    [Fact]
    public void Enqueue_uses_the_human_readable_tag_name_in_the_job_description()
    {
        var jobs = new RecordingJobService();
        var coordinator = new PreviewJobCoordinator(jobs, null!, null!);

        coordinator.Enqueue(7, 3364, "Kissing", new GeneratePreviewRequest(11, 1, 5, 0.5, 0.5, 1, null), CovePrincipal.System());

        Assert.Equal("Generate animated tag preview for Kissing", jobs.Description);
    }

    [Fact]
    public async Task Completed_job_exposes_candidate_id_and_audits_candidate_creation_not_publication()
    {
        var candidate = new PreviewCandidateRecord(
            "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
            7,
            9,
            "candidate-blob",
            new PreviewRecipe(7, 11, 1, 5, 0.5, 0.5, 1, 720, "libvpx-vp9", 2140, 24, DateTimeOffset.UnixEpoch),
            DateTimeOffset.UtcNow);
        var services = new ServiceCollection();
        services.AddSingleton<IPreviewGenerationService>(new CompletedGenerator(candidate));
        using var provider = services.BuildServiceProvider();
        var jobs = new RecordingJobService();
        var audit = new RecordingAudit();
        var coordinator = new PreviewJobCoordinator(jobs, provider.GetRequiredService<IServiceScopeFactory>(), audit);

        var jobId = coordinator.Enqueue(7, 9, "Tag", new GeneratePreviewRequest(11, 1, 5, 0.5, 0.5, 1), CovePrincipal.System());
        await jobs.RunAsync();
        var completed = coordinator.Get(7, 9, jobId);

        Assert.NotNull(completed);
        Assert.Equal(candidate.CandidateId, completed.CandidateId);
        Assert.Contains("animated_preview.candidate.generate", audit.Actions);
        Assert.DoesNotContain("animated_preview.generate", audit.Actions);
        Assert.DoesNotContain("animated_preview.replace", audit.Actions);
    }

    private sealed class RecordingJobService : IJobService
    {
        public string? Description { get; private set; }
        private Func<IJobProgress, CancellationToken, Task>? _work;
        private JobInfo? _job;

        public string Enqueue(string type, string description, Func<IJobProgress, CancellationToken, Task> work, bool exclusive = true)
        {
            Description = description;
            _work = work;
            _job = new JobInfo("job-1", type, description, JobStatus.Pending, 0, null, DateTime.UtcNow, null, null);
            return "job-1";
        }

        public async Task RunAsync()
        {
            _job = _job! with { Status = JobStatus.Running };
            await _work!(new JobProgress(), CancellationToken.None);
            _job = _job with { Status = JobStatus.Completed, Progress = 1, CompletedAt = DateTime.UtcNow };
        }

        public bool Cancel(string jobId) => false;
        public bool ReorderQueued(string jobId, string? beforeJobId) => false;
        public JobInfo? GetJob(string jobId) => jobId == _job?.Id ? _job : null;
        public IReadOnlyList<JobInfo> GetAllJobs() => [];
        public IReadOnlyList<JobInfo> GetJobHistory() => [];
    }

    private sealed class CompletedGenerator(PreviewCandidateRecord candidate) : IPreviewGenerationService
    {
        public Task<PreviewGenerationResult> GenerateAsync(
            int videoId,
            int tagId,
            GeneratePreviewRequest request,
            PreviewCommitGuard commitGuard,
            IJobProgress progress,
            CancellationToken ct)
            => Task.FromResult(new PreviewGenerationResult(candidate));
    }

    private sealed class RecordingAudit : IAuditService
    {
        public List<string> Actions { get; } = [];
        public Task LogAsync(
            string action,
            string outcome,
            CovePrincipal? actor = null,
            string? targetKind = null,
            string? targetId = null,
            object? detail = null,
            CancellationToken ct = default)
        {
            Actions.Add(action);
            return Task.CompletedTask;
        }
    }

    private sealed class JobProgress : IJobProgress
    {
        public void Report(double progress, string? subTask = null) { }
    }
}
