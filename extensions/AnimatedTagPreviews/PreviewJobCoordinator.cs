using System.Collections.Concurrent;
using Cove.Core.Auth;
using Cove.Core.Interfaces;
using Microsoft.Extensions.DependencyInjection;

namespace AnimatedTagPreviews;

public interface IPreviewJobCoordinator
{
    string Enqueue(int videoId, int tagId, string tagName, GeneratePreviewRequest request, CovePrincipal actor);
    PreviewJobResponse? Get(int videoId, int tagId, string jobId);
    bool Cancel(int videoId, int tagId, string jobId);
    Task CancelAllAsync();
}

public sealed class PreviewJobCoordinator(
    IJobService jobs,
    IServiceScopeFactory scopes,
    IAuditService audit) : IPreviewJobCoordinator
{
    private const string JobType = "animated-tag-preview.generate";
    private const int MaximumRetainedJobs = 512;
    private static readonly TimeSpan Retention = TimeSpan.FromHours(1);
    private readonly ConcurrentDictionary<string, OwnedPreviewJob> _ownedJobs = new(StringComparer.Ordinal);
    private readonly ConcurrentDictionary<string, string> _completedVersions = new(StringComparer.Ordinal);
    private readonly object _lifecycleLock = new();
    private bool _stopping;

    public string Enqueue(int videoId, int tagId, string tagName, GeneratePreviewRequest request, CovePrincipal actor)
    {
        PruneFinishedJobs();
        var actorSnapshot = Snapshot(actor);
        var commitGuard = new PreviewCommitGuard();
        var execution = new PreviewJobExecution();
        string? assignedJobId = null;
        string jobId;
        lock (_lifecycleLock)
        {
            if (_stopping)
                throw new PreviewCoordinatorStoppingException();
            jobId = jobs.Enqueue(
                JobType,
                $"Generate animated tag preview for {tagName}",
                async (progress, ct) =>
                {
                    if (!execution.TryStart())
                        return;
                    try
                    {
                        await using var scope = scopes.CreateAsyncScope();
                        var generator = scope.ServiceProvider.GetRequiredService<IPreviewGenerationService>();
                        var result = await generator.GenerateAsync(videoId, tagId, request, commitGuard, progress, ct);
                        if (assignedJobId is not null)
                            _completedVersions[assignedJobId] = result.Record.Version;
                        await audit.LogAsync(
                            result.ReplacedExisting ? "animated_preview.replace" : "animated_preview.generate",
                            AuditOutcomes.Success,
                            actorSnapshot,
                            "tag",
                            tagId.ToString(System.Globalization.CultureInfo.InvariantCulture),
                            new { videoId, jobId = assignedJobId, result.Record.Version },
                            CancellationToken.None);
                    }
                    catch (OperationCanceledException)
                    {
                        await audit.LogAsync("animated_preview.generate", "cancelled", actorSnapshot, "tag",
                            tagId.ToString(System.Globalization.CultureInfo.InvariantCulture), new { videoId, jobId = assignedJobId }, CancellationToken.None);
                        throw;
                    }
                    catch (PreviewGenerationException ex)
                    {
                        await audit.LogAsync("animated_preview.generate", AuditOutcomes.Fail, actorSnapshot, "tag",
                            tagId.ToString(System.Globalization.CultureInfo.InvariantCulture), new { videoId, jobId = assignedJobId, reason = ex.Message }, CancellationToken.None);
                        throw;
                    }
                    catch
                    {
                        await audit.LogAsync("animated_preview.generate", AuditOutcomes.Fail, actorSnapshot, "tag",
                            tagId.ToString(System.Globalization.CultureInfo.InvariantCulture), new { videoId, jobId = assignedJobId }, CancellationToken.None);
                        throw new PreviewGenerationException("Preview generation failed.");
                    }
                    finally
                    {
                        execution.Complete();
                    }
                },
                exclusive: true);
            assignedJobId = jobId;
            _ownedJobs[jobId] = new OwnedPreviewJob(jobId, videoId, tagId, commitGuard, execution, DateTimeOffset.UtcNow);
        }
        return jobId;
    }

    public PreviewJobResponse? Get(int videoId, int tagId, string jobId)
    {
        if (!_ownedJobs.TryGetValue(jobId, out var owned) || owned.VideoId != videoId || owned.TagId != tagId)
            return null;
        var job = jobs.GetJob(jobId);
        return job is null ? null : new PreviewJobResponse(
            job.Id,
            videoId,
            tagId,
            job.Status.ToString().ToLowerInvariant(),
            job.Progress,
            job.SubTask,
            job.StartedAt,
            job.CompletedAt,
            job.Status == JobStatus.Failed ? SafeError(job.Error) : null,
            _completedVersions.GetValueOrDefault(jobId));
    }

    public bool Cancel(int videoId, int tagId, string jobId)
    {
        if (!_ownedJobs.TryGetValue(jobId, out var owned)
            || owned.VideoId != videoId
            || owned.TagId != tagId)
            return false;
        var cancelled = owned.CommitGuard.TryCancel(() => jobs.Cancel(jobId));
        if (cancelled)
            owned.Execution.CompleteIfPending();
        return cancelled;
    }

    public async Task CancelAllAsync()
    {
        OwnedPreviewJob[] ownedJobs;
        lock (_lifecycleLock)
        {
            _stopping = true;
            ownedJobs = _ownedJobs.Values.ToArray();
        }
        foreach (var owned in ownedJobs)
        {
            var job = jobs.GetJob(owned.JobId);
            if (job is { Status: JobStatus.Pending or JobStatus.Running })
            {
                if (!Cancel(owned.VideoId, owned.TagId, owned.JobId) && job.Status == JobStatus.Pending)
                    owned.Execution.CompleteIfPending();
            }
            else
            {
                owned.Execution.CompleteIfPending();
            }
        }
        await Task.WhenAll(ownedJobs.Select(owned => owned.Execution.Completion));
        _ownedJobs.Clear();
        _completedVersions.Clear();
    }

    private void PruneFinishedJobs()
    {
        var cutoff = DateTime.UtcNow - Retention;
        var finished = new List<(string JobId, DateTime CompletedAt)>();
        foreach (var pair in _ownedJobs)
        {
            var job = jobs.GetJob(pair.Key);
            if (job is null)
            {
                _ownedJobs.TryRemove(pair.Key, out _);
                _completedVersions.TryRemove(pair.Key, out _);
                continue;
            }
            if (job.CompletedAt is not { } completedAt)
                continue;
            if (completedAt < cutoff)
            {
                _ownedJobs.TryRemove(pair.Key, out _);
                _completedVersions.TryRemove(pair.Key, out _);
            }
            else
            {
                finished.Add((pair.Key, completedAt));
            }
        }

        foreach (var stale in finished.OrderByDescending(item => item.CompletedAt).Skip(MaximumRetainedJobs))
        {
            _ownedJobs.TryRemove(stale.JobId, out _);
            _completedVersions.TryRemove(stale.JobId, out _);
        }
    }

    private static CovePrincipal Snapshot(CovePrincipal actor) => new()
    {
        UserId = actor.UserId,
        Username = actor.Username,
        Kind = actor.Kind,
        Roles = actor.Roles.ToHashSet(StringComparer.Ordinal),
        Permissions = actor.Permissions.ToHashSet(StringComparer.Ordinal),
        ReadRestrictedEntityKinds = actor.ReadRestrictedEntityKinds.ToHashSet(StringComparer.OrdinalIgnoreCase),
        ReadGrantedEntityKinds = actor.ReadGrantedEntityKinds.ToHashSet(StringComparer.OrdinalIgnoreCase),
        TokenId = actor.TokenId,
        Ip = actor.Ip,
        UserAgent = actor.UserAgent,
    };

    private static string SafeError(string? error)
    {
        var value = string.IsNullOrWhiteSpace(error) ? "Preview generation failed." : error;
        return value.Length <= 240 ? value : value[..240];
    }
}

public sealed class PreviewCoordinatorStoppingException : Exception
{
    public PreviewCoordinatorStoppingException() : base("Animated preview generation is stopping because the extension is being disabled.") { }
}
