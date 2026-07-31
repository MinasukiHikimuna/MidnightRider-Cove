using Microsoft.EntityFrameworkCore;

namespace SegmentStudio;

public sealed record SegmentSourceRegistration(
    string Key,
    string DisplayName,
    string? Category,
    string? Provider,
    string? DefaultModelIdentifier,
    string? Description,
    string MetadataJson);

public interface ISegmentSourceRegistry
{
    Task<SegmentStudioSource> RegisterAsync(
        DbContext db,
        SegmentSourceRegistration registration,
        CancellationToken ct);
}

public sealed class SegmentSourceRegistry : ISegmentSourceRegistry
{
    public async Task<SegmentStudioSource> RegisterAsync(
        DbContext db,
        SegmentSourceRegistration registration,
        CancellationToken ct)
    {
        if (string.IsNullOrWhiteSpace(registration.Key))
            throw new ArgumentException("Source key cannot be empty.", nameof(registration));
        var key = registration.Key.Trim().ToLowerInvariant();
        if (string.IsNullOrWhiteSpace(registration.DisplayName))
            throw new ArgumentException("Source display name cannot be empty.", nameof(registration));
        if (string.IsNullOrWhiteSpace(registration.MetadataJson))
            throw new ArgumentException("Source metadata is required.", nameof(registration));
        try
        {
            using var _ = System.Text.Json.JsonDocument.Parse(registration.MetadataJson);
        }
        catch (System.Text.Json.JsonException exception)
        {
            throw new ArgumentException("Source metadata must be valid JSON.", nameof(registration), exception);
        }

        var now = DateTime.UtcNow;
        if (db.Database.ProviderName?.Contains("Npgsql", StringComparison.Ordinal) == true)
        {
            await db.Database.ExecuteSqlInterpolatedAsync($"""
                INSERT INTO segment_studio_sources
                    (key, display_name, category, provider, default_model_identifier,
                     description, metadata, created_at, updated_at)
                VALUES
                    ({key}, {registration.DisplayName.Trim()}, {registration.Category},
                     {registration.Provider}, {registration.DefaultModelIdentifier},
                     {registration.Description}, CAST({registration.MetadataJson} AS jsonb),
                     {now}, {now})
                ON CONFLICT (key) DO UPDATE
                SET display_name = EXCLUDED.display_name,
                    category = EXCLUDED.category,
                    provider = EXCLUDED.provider,
                    default_model_identifier = EXCLUDED.default_model_identifier,
                    description = EXCLUDED.description,
                    metadata = EXCLUDED.metadata,
                    updated_at = EXCLUDED.updated_at
                """, ct);
            return await db.Set<SegmentStudioSource>()
                .AsNoTracking()
                .SingleAsync(candidate => candidate.Key == key, ct);
        }

        var source = await db.Set<SegmentStudioSource>()
            .SingleOrDefaultAsync(candidate => candidate.Key == key, ct);
        if (source is null)
        {
            source = new SegmentStudioSource
            {
                Key = key,
                CreatedAt = now,
            };
            db.Add(source);
        }

        source.DisplayName = registration.DisplayName.Trim();
        source.Category = registration.Category;
        source.Provider = registration.Provider;
        source.DefaultModelIdentifier = registration.DefaultModelIdentifier;
        source.Description = registration.Description;
        source.MetadataJson = registration.MetadataJson;
        source.UpdatedAt = now;
        await db.SaveChangesAsync(ct);
        return source;
    }
}
