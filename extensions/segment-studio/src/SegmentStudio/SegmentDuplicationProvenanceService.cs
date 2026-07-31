using Microsoft.EntityFrameworkCore;

namespace SegmentStudio;

public interface ISegmentDuplicationProvenanceService
{
    Task CopyAsync(
        DbContext db,
        long sourceItemId,
        long duplicateItemId,
        CancellationToken ct);
}

public sealed class SegmentDuplicationProvenanceService(
    ILineageNodeService lineageNodes,
    ISegmentProvenanceService provenance) : ISegmentDuplicationProvenanceService
{
    public async Task CopyAsync(
        DbContext db,
        long sourceItemId,
        long duplicateItemId,
        CancellationToken ct)
    {
        if (sourceItemId == duplicateItemId)
            throw new ArgumentException("A duplicate must have a distinct item identity.", nameof(duplicateItemId));

        var sourceNode = await lineageNodes.EnsureAsync(db, sourceItemId, ct);
        var duplicateNode = await lineageNodes.EnsureAsync(db, duplicateItemId, ct);
        var assertions = await db.Set<SegmentStudioSegmentProvenance>()
            .AsNoTracking()
            .Where(assertion =>
                assertion.LineageNodeId == sourceNode.Id
                && assertion.SupersededAt == null)
            .OrderBy(assertion => assertion.Id)
            .ToListAsync(ct);

        foreach (var assertion in assertions)
        {
            await provenance.AppendAsync(
                db,
                new SegmentProvenanceAppend(
                    duplicateNode.Id,
                    assertion.SourceId,
                    "origin",
                    assertion.ActivityId,
                    assertion.ModelKey,
                    assertion.ModelIdentifier,
                    assertion.ModelVersion,
                    assertion.Confidence,
                    assertion.RecordedAt,
                    assertion.MetadataJson),
                ct);
        }
    }
}
