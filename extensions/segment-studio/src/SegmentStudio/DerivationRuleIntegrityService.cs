using Microsoft.EntityFrameworkCore;

namespace SegmentStudio;

internal static class DerivationRuleIntegrityService
{
    private const string MutationLockKey = "segment-studio:derivation-rules";

    public static Task AcquireMutationLockAsync(DbContext db, CancellationToken ct) =>
        db.Database.ProviderName?.Contains("Npgsql", StringComparison.Ordinal) == true
            ? db.Database.ExecuteSqlRawAsync(
                $"SELECT pg_advisory_xact_lock(hashtextextended('{MutationLockKey}', 0))",
                ct)
            : Task.CompletedTask;

    public static async Task AcquireRuleWriteLockAsync(
        DbContext db,
        Guid ruleId,
        CancellationToken ct)
    {
        if (db.Database.ProviderName?.Contains("Npgsql", StringComparison.Ordinal) != true)
            return;
        var found = await db.Set<SegmentStudioDerivationRule>()
            .FromSqlInterpolated($"""
                SELECT *
                FROM segment_studio_derivation_rules
                WHERE id = {ruleId}
                FOR UPDATE
                """)
            .AsNoTracking()
            .AnyAsync(ct);
        if (!found)
            throw new KeyNotFoundException("Derivation rule was not found.");
    }

    public static async Task ValidateRelationshipAsync(
        DbContext db,
        Guid? excludedRuleId,
        int sourceTagId,
        int derivedTagId,
        CancellationToken ct)
    {
        var edges = await db.Set<SegmentStudioDerivationRule>().AsNoTracking()
            .Where(rule => rule.Id != excludedRuleId)
            .Select(rule => new { rule.SourceTagId, rule.DerivedTagId })
            .ToListAsync(ct);
        if (edges.Any(edge =>
                edge.SourceTagId == sourceTagId
                && edge.DerivedTagId == derivedTagId))
            throw new LineageConflictException(
                "LINEAGE_RULE_DUPLICATE",
                "A rule already maps this source tag to this derived tag.");

        var adjacency = edges
            .GroupBy(edge => edge.SourceTagId)
            .ToDictionary(
                group => group.Key,
                group => group.Select(edge => edge.DerivedTagId).Distinct().ToArray());
        var pending = new Queue<int>();
        var visited = new HashSet<int>();
        pending.Enqueue(derivedTagId);
        while (pending.TryDequeue(out var tagId))
        {
            if (!visited.Add(tagId)) continue;
            if (tagId == sourceTagId)
                throw new LineageConflictException(
                    "LINEAGE_CYCLE",
                    "This rule would create a derivation cycle.");
            foreach (var next in adjacency.GetValueOrDefault(tagId) ?? [])
                pending.Enqueue(next);
        }
    }
}
