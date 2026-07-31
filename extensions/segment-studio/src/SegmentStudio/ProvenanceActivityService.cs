using Microsoft.EntityFrameworkCore;

namespace SegmentStudio;

public sealed record ProvenanceActivityCapture(
    Guid Id,
    string Key,
    string Kind,
    long SourceId,
    string? ExternalRunId,
    string? Status,
    DateTime? StartedAt,
    DateTime? CompletedAt,
    string? RequestJson,
    string? ModelsJson,
    string? SummaryJson,
    string MetadataJson);

public interface IProvenanceActivityService
{
    Task<SegmentStudioProvenanceActivity> CaptureAsync(
        DbContext db,
        ProvenanceActivityCapture request,
        CancellationToken ct);
}

public sealed class ProvenanceActivityService : IProvenanceActivityService
{
    public async Task<SegmentStudioProvenanceActivity> CaptureAsync(
        DbContext db,
        ProvenanceActivityCapture request,
        CancellationToken ct)
    {
        if (request.Kind is not ("ai-analysis" or "migration" or "import" or "manual"))
            throw new ArgumentException("Provenance activity kind is invalid.", nameof(request));
        if (string.IsNullOrWhiteSpace(request.Key))
            throw new ArgumentException("Provenance activity key cannot be empty.", nameof(request));
        var key = request.Key.Trim();
        ValidateJson(request.RequestJson, "request");
        ValidateJson(request.ModelsJson, "models");
        ValidateJson(request.SummaryJson, "summary");
        ValidateJson(request.MetadataJson, "metadata");

        var existing = await db.Set<SegmentStudioProvenanceActivity>()
            .SingleOrDefaultAsync(activity => activity.Key == key, ct);
        if (existing is not null)
            return existing;

        var now = DateTime.UtcNow;
        if (db.Database.ProviderName?.Contains("Npgsql", StringComparison.Ordinal) == true)
        {
            await db.Database.ExecuteSqlInterpolatedAsync($"""
                INSERT INTO segment_studio_provenance_activities
                    (id, key, kind, source_id, external_run_id, status, started_at,
                     completed_at, request, models, summary, metadata, created_at, updated_at)
                VALUES
                    ({request.Id}, {key}, {request.Kind}, {request.SourceId},
                     {request.ExternalRunId}, {request.Status}, {request.StartedAt},
                     {request.CompletedAt}, CAST({request.RequestJson} AS jsonb),
                     CAST({request.ModelsJson} AS jsonb), CAST({request.SummaryJson} AS jsonb),
                     CAST({request.MetadataJson} AS jsonb), {now}, {now})
                ON CONFLICT (key) DO NOTHING
                """, ct);
            return await db.Set<SegmentStudioProvenanceActivity>()
                .AsNoTracking()
                .SingleAsync(activity => activity.Key == key, ct);
        }

        var activity = new SegmentStudioProvenanceActivity
        {
            Id = request.Id,
            Key = key,
            Kind = request.Kind,
            SourceId = request.SourceId,
            ExternalRunId = request.ExternalRunId,
            Status = request.Status,
            StartedAt = request.StartedAt,
            CompletedAt = request.CompletedAt,
            RequestJson = request.RequestJson,
            ModelsJson = request.ModelsJson,
            SummaryJson = request.SummaryJson,
            MetadataJson = request.MetadataJson,
            CreatedAt = now,
            UpdatedAt = now,
        };
        db.Add(activity);
        await db.SaveChangesAsync(ct);
        return activity;
    }

    private static void ValidateJson(string? value, string field)
    {
        if (value is null)
        {
            if (field == "metadata")
                throw new ArgumentException("Activity metadata is required.", field);
            return;
        }
        try
        {
            using var _ = System.Text.Json.JsonDocument.Parse(value);
        }
        catch (System.Text.Json.JsonException exception)
        {
            throw new ArgumentException($"Activity {field} must be valid JSON.", field, exception);
        }
    }
}
