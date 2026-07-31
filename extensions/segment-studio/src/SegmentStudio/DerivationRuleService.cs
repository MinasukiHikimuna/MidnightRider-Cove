using Microsoft.EntityFrameworkCore;

namespace SegmentStudio;

public sealed record DerivationRuleRegistration(
    Guid Id,
    string Key,
    string Version,
    int SourceTagId,
    int DerivedTagId,
    string MetadataJson);

public interface IDerivationRuleService
{
    Task<SegmentStudioDerivationRule> RegisterAsync(
        DbContext db,
        DerivationRuleRegistration request,
        CancellationToken ct);

    Task<SegmentStudioDerivationRule> ResolveAsync(
        DbContext db,
        Guid ruleId,
        int sourceTagId,
        CancellationToken ct);
}

public sealed class DerivationRuleService : IDerivationRuleService
{
    public async Task<SegmentStudioDerivationRule> RegisterAsync(
        DbContext db,
        DerivationRuleRegistration request,
        CancellationToken ct)
    {
        if (string.IsNullOrWhiteSpace(request.Key) || string.IsNullOrWhiteSpace(request.Version))
            throw new ArgumentException("Rule key and version are required.", nameof(request));
        if (request.SourceTagId == request.DerivedTagId)
            throw new ArgumentException("Rule source and derived tags must differ.", nameof(request));
        if (string.IsNullOrWhiteSpace(request.MetadataJson))
            throw new ArgumentException("Rule metadata is required.", nameof(request));
        try
        {
            using var _ = System.Text.Json.JsonDocument.Parse(request.MetadataJson);
        }
        catch (System.Text.Json.JsonException exception)
        {
            throw new ArgumentException("Rule metadata must be valid JSON.", nameof(request), exception);
        }

        var isPostgres = db.Database.ProviderName?.Contains("Npgsql", StringComparison.Ordinal) == true;
        await using var transaction = isPostgres && db.Database.CurrentTransaction is null
            ? await db.Database.BeginTransactionAsync(ct)
            : null;
        await DerivationRuleIntegrityService.AcquireMutationLockAsync(db, ct);
        var existing = await db.Set<SegmentStudioDerivationRule>()
            .SingleOrDefaultAsync(rule =>
                rule.Key == request.Key
                && rule.Version == request.Version
                && rule.SourceTagId == request.SourceTagId
                && rule.DerivedTagId == request.DerivedTagId,
                ct);
        if (existing is not null)
        {
            if (existing.Id != request.Id
                || existing.MetadataJson != request.MetadataJson)
                throw new LineageConflictException(
                    "LINEAGE_RULE_MISMATCH",
                    "The immutable rule version is already registered with a different definition.");
            if (transaction is not null)
                await transaction.CommitAsync(ct);
            return existing;
        }
        await DerivationRuleIntegrityService.ValidateRelationshipAsync(
            db, null, request.SourceTagId, request.DerivedTagId, ct);
        var now = DateTime.UtcNow;
        var rule = new SegmentStudioDerivationRule
        {
            Id = request.Id,
            Key = request.Key,
            Version = request.Version,
            SourceTagId = request.SourceTagId,
            DerivedTagId = request.DerivedTagId,
            MetadataJson = request.MetadataJson,
            CreatedAt = now,
            UpdatedAt = now,
        };
        db.Add(rule);
        await db.SaveChangesAsync(ct);
        if (transaction is not null)
            await transaction.CommitAsync(ct);
        return rule;
    }

    public async Task<SegmentStudioDerivationRule> ResolveAsync(
        DbContext db,
        Guid ruleId,
        int sourceTagId,
        CancellationToken ct)
    {
        return await db.Set<SegmentStudioDerivationRule>().AsNoTracking()
            .SingleOrDefaultAsync(rule =>
                rule.Id == ruleId
                && rule.SourceTagId == sourceTagId,
                ct)
            ?? throw new LineageConflictException(
                "LINEAGE_RULE_MISMATCH",
                "No rule matches the source tag.");
    }
}
