using Cove.Core.Interfaces;
using Cove.Core.Entities;

namespace AnimatedTagPreviews;

public interface IPreviewMaintenanceService
{
    Task<DeletePreviewResponse> DeleteAsync(int tagId, CancellationToken ct);
    Task<OrphanCleanupResponse> CleanupOrphansAsync(bool dryRun, string? expectedVersion, CancellationToken ct);
}

public sealed class PreviewMaintenanceService(
    IPreviewStateStore state,
    IBlobService blobs,
    ITagRepository tags,
    PreviewMutationGate mutations) : IPreviewMaintenanceService
{
    public async Task<DeletePreviewResponse> DeleteAsync(int tagId, CancellationToken ct)
    {
        await using var mutation = await mutations.AcquireAsync(ct);
        var record = await state.RemovePreviewAsync(tagId, ct);
        if (record is null)
            return new DeletePreviewResponse(tagId, Deleted: false, BlobDeleted: false);

        try { await tags.TouchAsync(tagId, CancellationToken.None); }
        catch { }

        var blobDeleted = false;
        try
        {
            await blobs.DeleteBlobAsync(record.BlobId, CancellationToken.None);
            blobDeleted = true;
        }
        catch
        {
            return new DeletePreviewResponse(tagId, Deleted: true, BlobDeleted: false);
        }

        try
        {
            await state.UntrackOwnedBlobAsync(record.BlobId, CancellationToken.None);
        }
        catch
        {
            // The media is deleted; a stale ownership marker can be removed by orphan cleanup.
        }
        return new DeletePreviewResponse(tagId, Deleted: true, BlobDeleted: blobDeleted);
    }

    public async Task<OrphanCleanupResponse> CleanupOrphansAsync(bool dryRun, string? expectedVersion, CancellationToken ct)
    {
        await using var mutation = await mutations.AcquireAsync(ct);
        var previews = await state.GetPreviewsAsync(ct);
        var owned = await state.GetOwnedBlobsAsync(ct);
        var stalePreviews = new List<PreviewRecord>();
        var livePreviews = new List<PreviewRecord>();
        foreach (var preview in previews)
        {
            if (await tags.GetByIdAsync(preview.TagId, ct) is null)
                stalePreviews.Add(preview);
            else
                livePreviews.Add(preview);
        }

        var referenced = livePreviews.Select(record => record.BlobId).ToHashSet(StringComparer.Ordinal);
        var orphans = owned
            .Concat(stalePreviews.Select(record => new OwnedBlobRecord(record.BlobId, record.TagId, record.Recipe.CreatedAt)))
            .Where(record => !referenced.Contains(record.BlobId))
            .DistinctBy(record => record.BlobId, StringComparer.Ordinal)
            .OrderBy(record => record.BlobId, StringComparer.Ordinal)
            .ToArray();
        var snapshotVersion = CalculateSnapshotVersion(orphans.Select(record => record.BlobId));
        if (!dryRun && !string.Equals(expectedVersion, snapshotVersion, StringComparison.Ordinal))
            throw new OrphanSetChangedException(snapshotVersion);

        var deleted = 0;
        var failed = new List<string>();
        if (!dryRun)
        {
            foreach (var stale in stalePreviews)
                await state.RemovePreviewAsync(stale.TagId, ct);
            foreach (var orphan in orphans)
            {
                try
                {
                    await blobs.DeleteBlobAsync(orphan.BlobId, ct);
                    await state.UntrackOwnedBlobAsync(orphan.BlobId, ct);
                    deleted++;
                }
                catch
                {
                    failed.Add(orphan.BlobId);
                }
            }
        }

        var blobIds = orphans.Select(record => record.BlobId).ToArray();
        return new OrphanCleanupResponse(dryRun, blobIds.Length, blobIds, owned.Count, referenced.Count, deleted, failed, snapshotVersion);
    }

    private static string CalculateSnapshotVersion(IEnumerable<string> blobIds)
    {
        var canonical = string.Join('|', blobIds);
        return Convert.ToHexString(System.Security.Cryptography.SHA256.HashData(System.Text.Encoding.UTF8.GetBytes(canonical)))[..16].ToLowerInvariant();
    }
}

public sealed class OrphanSetChangedException(string currentVersion) : Exception("The orphaned preview set changed after the dry run.")
{
    public string CurrentVersion { get; } = currentVersion;
}
