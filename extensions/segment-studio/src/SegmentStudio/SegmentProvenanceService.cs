using Microsoft.EntityFrameworkCore;

namespace SegmentStudio;

public sealed record SegmentProvenanceAppend(
    Guid LineageNodeId,
    long SourceId,
    string Relation,
    Guid? ActivityId,
    string? ModelKey,
    string? ModelIdentifier,
    string? ModelVersion,
    float? Confidence,
    DateTime? RecordedAt,
    string MetadataJson);

public sealed record SegmentProvenanceDto(
    long Id,
    string SourceKey,
    string SourceDisplayName,
    string? SourceCategory,
    string? SourceProvider,
    string Relation,
    string? ActivityKind,
    string? ActivityExternalRunId,
    string? ModelKey,
    string? ModelIdentifier,
    string? ModelVersion,
    float? Confidence,
    DateTime? RecordedAt,
    string MetadataJson);

public interface ISegmentProvenanceService
{
    Task<SegmentStudioSegmentProvenance> AppendAsync(
        DbContext db,
        SegmentProvenanceAppend request,
        CancellationToken ct);

    Task<IReadOnlyList<SegmentProvenanceDto>> GetForItemAsync(
        DbContext db,
        long itemId,
        CancellationToken ct);
}

public sealed class SegmentProvenanceService : ISegmentProvenanceService
{
    public async Task<SegmentStudioSegmentProvenance> AppendAsync(
        DbContext db,
        SegmentProvenanceAppend request,
        CancellationToken ct)
    {
        if (request.Relation is not ("origin" or "inherited"))
            throw new ArgumentException("Provenance relation is invalid.", nameof(request));
        if (request.Confidence is < 0 or > 1)
            throw new ArgumentOutOfRangeException(nameof(request), "Confidence must be between zero and one.");
        if (string.IsNullOrWhiteSpace(request.MetadataJson))
            throw new ArgumentException("Provenance metadata is required.", nameof(request));
        try
        {
            using var _ = System.Text.Json.JsonDocument.Parse(request.MetadataJson);
        }
        catch (System.Text.Json.JsonException exception)
        {
            throw new ArgumentException("Provenance metadata must be valid JSON.", nameof(request), exception);
        }

        if (db.Database.CurrentTransaction is not null)
            return await AppendCoreAsync(db, request, ct);

        var strategy = db.Database.CreateExecutionStrategy();
        var firstAttempt = true;
        return await strategy.ExecuteAsync(async () =>
        {
            if (!firstAttempt) db.ChangeTracker.Clear();
            firstAttempt = false;
            return await AppendCoreAsync(db, request, ct);
        });
    }

    private async Task<SegmentStudioSegmentProvenance> AppendCoreAsync(
        DbContext db,
        SegmentProvenanceAppend request,
        CancellationToken ct)
    {
        await using var ownTransaction = db.Database.IsRelational()
            && db.Database.CurrentTransaction is null
                ? await db.Database.BeginTransactionAsync(ct)
                : null;
        async Task<SegmentStudioSegmentProvenance> FinishAsync(
            SegmentStudioSegmentProvenance assertion)
        {
            if (ownTransaction is not null)
                await ownTransaction.CommitAsync(ct);
            return assertion;
        }
        if (request.ActivityId is Guid activityId)
        {
            var activitySourceId = await db.Set<SegmentStudioProvenanceActivity>()
                .AsNoTracking()
                .Where(activity => activity.Id == activityId)
                .Select(activity => (long?)activity.SourceId)
                .SingleOrDefaultAsync(ct);
            if (activitySourceId is null)
                throw new ArgumentException("Provenance activity was not found.", nameof(request));
            if (activitySourceId != request.SourceId)
                throw new ArgumentException("Provenance activity belongs to a different source.", nameof(request));
        }

        var videoId = await db.Set<SegmentStudioLineageNode>().AsNoTracking()
            .Where(node => node.Id == request.LineageNodeId)
            .Select(node => (int?)node.LastKnownVideoId)
            .SingleOrDefaultAsync(ct);
        if (videoId is null)
            throw new ArgumentException("Lineage node was not found.", nameof(request));
        await SegmentStudioReviewLock.AcquireAsync(db, videoId.Value, ct);
        if (!await db.Set<SegmentStudioLineageNode>().AsNoTracking()
                .AnyAsync(node => node.Id == request.LineageNodeId, ct))
            throw new ArgumentException("Lineage node was removed while provenance was being recorded.", nameof(request));

        var existing = await db.Set<SegmentStudioSegmentProvenance>()
            .SingleOrDefaultAsync(assertion =>
                assertion.LineageNodeId == request.LineageNodeId
                && assertion.SourceId == request.SourceId
                && assertion.Relation == request.Relation
                && assertion.ActivityId == request.ActivityId
                && assertion.ModelKey == request.ModelKey
                && assertion.ModelIdentifier == request.ModelIdentifier
                && assertion.ModelVersion == request.ModelVersion
                && assertion.SupersededAt == null,
                ct);
        if (existing is not null)
            return await FinishAsync(existing);

        var now = DateTime.UtcNow;
        if (db.Database.ProviderName?.Contains("Npgsql", StringComparison.Ordinal) == true)
        {
            await db.Database.ExecuteSqlInterpolatedAsync($"""
                INSERT INTO segment_studio_segment_provenance
                    (lineage_node_id, source_id, relation, activity_id, model_key,
                     model_identifier, model_version, confidence, recorded_at, metadata,
                     superseded_at, created_at, updated_at)
                VALUES
                    ({request.LineageNodeId}, {request.SourceId}, {request.Relation},
                     {request.ActivityId}, {request.ModelKey}, {request.ModelIdentifier},
                     {request.ModelVersion}, {request.Confidence}, {request.RecordedAt},
                     CAST({request.MetadataJson} AS jsonb), NULL, {now}, {now})
                ON CONFLICT
                    (lineage_node_id, source_id, relation, activity_id, model_key,
                     model_identifier, model_version)
                    WHERE superseded_at IS NULL
                DO NOTHING
                """, ct);
            var inserted = await db.Set<SegmentStudioSegmentProvenance>()
                .AsNoTracking()
                .SingleAsync(assertion =>
                    assertion.LineageNodeId == request.LineageNodeId
                    && assertion.SourceId == request.SourceId
                    && assertion.Relation == request.Relation
                    && assertion.ActivityId == request.ActivityId
                    && assertion.ModelKey == request.ModelKey
                    && assertion.ModelIdentifier == request.ModelIdentifier
                    && assertion.ModelVersion == request.ModelVersion
                    && assertion.SupersededAt == null,
                    ct);
            await PropagateToChildrenAsync(db, inserted, ct);
            return await FinishAsync(inserted);
        }

        var assertion = new SegmentStudioSegmentProvenance
        {
            LineageNodeId = request.LineageNodeId,
            SourceId = request.SourceId,
            Relation = request.Relation,
            ActivityId = request.ActivityId,
            ModelKey = request.ModelKey,
            ModelIdentifier = request.ModelIdentifier,
            ModelVersion = request.ModelVersion,
            Confidence = request.Confidence,
            RecordedAt = request.RecordedAt,
            MetadataJson = request.MetadataJson,
            CreatedAt = now,
            UpdatedAt = now,
        };
        db.Add(assertion);
        await db.SaveChangesAsync(ct);
        await PropagateToChildrenAsync(db, assertion, ct);
        return await FinishAsync(assertion);
    }

    private async Task PropagateToChildrenAsync(
        DbContext db,
        SegmentStudioSegmentProvenance assertion,
        CancellationToken ct)
    {
        var childIds = await db.Set<SegmentStudioDerivationEdge>().AsNoTracking()
            .Where(edge => edge.SourceNodeId == assertion.LineageNodeId)
            .Select(edge => edge.DerivedNodeId)
            .Distinct()
            .ToListAsync(ct);
        foreach (var childId in childIds)
        {
            await AppendAsync(
                db,
                new SegmentProvenanceAppend(
                    childId,
                    assertion.SourceId,
                    "inherited",
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

    public async Task<IReadOnlyList<SegmentProvenanceDto>> GetForItemAsync(
        DbContext db,
        long itemId,
        CancellationToken ct)
    {
        return await (
            from assertion in db.Set<SegmentStudioSegmentProvenance>().AsNoTracking()
            join node in db.Set<SegmentStudioLineageNode>().AsNoTracking()
                on assertion.LineageNodeId equals node.Id
            join source in db.Set<SegmentStudioSource>().AsNoTracking()
                on assertion.SourceId equals source.Id
            join activityCandidate in db.Set<SegmentStudioProvenanceActivity>().AsNoTracking()
                on assertion.ActivityId equals activityCandidate.Id into activities
            from activity in activities.DefaultIfEmpty()
            where node.ItemId == itemId && assertion.SupersededAt == null
            orderby assertion.CreatedAt, assertion.Id
            select new SegmentProvenanceDto(
                assertion.Id,
                source.Key,
                source.DisplayName,
                source.Category,
                source.Provider,
                assertion.Relation,
                activity == null ? null : activity.Kind,
                activity == null ? null : activity.ExternalRunId,
                assertion.ModelKey,
                assertion.ModelIdentifier,
                assertion.ModelVersion,
                assertion.Confidence,
                assertion.RecordedAt,
                assertion.MetadataJson))
            .ToListAsync(ct);
    }
}
