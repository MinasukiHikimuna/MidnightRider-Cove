using Cove.Core.Auth;
using Cove.Core.Interfaces;

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

    private sealed class RecordingJobService : IJobService
    {
        public string? Description { get; private set; }

        public string Enqueue(string type, string description, Func<IJobProgress, CancellationToken, Task> work, bool exclusive = true)
        {
            Description = description;
            return "job-1";
        }

        public bool Cancel(string jobId) => false;
        public bool ReorderQueued(string jobId, string? beforeJobId) => false;
        public JobInfo? GetJob(string jobId) => null;
        public IReadOnlyList<JobInfo> GetAllJobs() => [];
        public IReadOnlyList<JobInfo> GetJobHistory() => [];
    }
}
