using Cove.Core.Interfaces;
using Cove.Plugins;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;

namespace SegmentStudio;

public sealed class SegmentStudioBlobCleanupWorker(IExtensionServiceScopeFactory scopeFactory)
{
    public async Task RunAsync(CancellationToken ct)
    {
        await ProcessBatchAsync(ct);
        using var timer = new PeriodicTimer(TimeSpan.FromSeconds(30));
        while (await timer.WaitForNextTickAsync(ct))
            await ProcessBatchAsync(ct);
    }

    private async Task ProcessBatchAsync(CancellationToken ct)
    {
        try
        {
            await using var scope = scopeFactory.CreateAsyncScope();
            var db = scope.ServiceProvider.GetRequiredService<DbContext>();
            var blobs = scope.ServiceProvider.GetRequiredService<IBlobService>();
            await SegmentOwnershipTransitionService.ProcessPendingBlobCleanupAsync(db, blobs, 25, ct);
        }
        catch (OperationCanceledException) when (ct.IsCancellationRequested)
        { }
        catch
        {
            // The durable outbox retains the work for the next pass. Operational
            // visibility and manual retry controls arrive with lifecycle Slice 6.
        }
    }
}
