using System.Text.Json;
using System.Text.Json.Nodes;
using Cove.Core.Entities;
using Microsoft.EntityFrameworkCore;

namespace SegmentStudio;

public sealed record DerivationRuleSlotMappingRequest(
    Guid SourceSlotDefinitionId,
    Guid DerivedSlotDefinitionId);

public sealed record DerivationRuleSaveRequest(
    Guid? RuleId,
    int SourceTagId,
    int DerivedTagId,
    IReadOnlyList<DerivationRuleSlotMappingRequest>? SlotMappings,
    string? CleanupFingerprint = null);

public sealed record DerivationRuleSlotMappingView(
    Guid SourceSlotDefinitionId,
    string? SourceSlotLabel,
    Guid DerivedSlotDefinitionId,
    string? DerivedSlotLabel,
    bool SourceSlotMissing,
    bool DerivedSlotMissing);

public sealed record DerivationRuleView(
    Guid Id,
    string Key,
    string Version,
    int SourceTagId,
    string SourceTagName,
    int DerivedTagId,
    string DerivedTagName,
    int EdgeCount,
    IReadOnlyList<DerivationRuleSlotMappingView> SlotMappings,
    DateTime CreatedAt,
    DateTime UpdatedAt);

public static class DerivationRuleManagementService
{
    public static async Task<IReadOnlyList<DerivationRuleView>> LoadAsync(
        DbContext db,
        CancellationToken ct)
    {
        var rules = await db.Set<SegmentStudioDerivationRule>().AsNoTracking()
            .OrderBy(rule => rule.SourceTagId)
            .ThenBy(rule => rule.DerivedTagId)
            .ThenBy(rule => rule.CreatedAt)
            .ToListAsync(ct);
        if (rules.Count == 0) return [];

        var tagIds = rules.SelectMany(rule => new[] { rule.SourceTagId, rule.DerivedTagId })
            .Distinct()
            .ToArray();
        var tagNames = await db.Set<Tag>().AsNoTracking()
            .Where(tag => tagIds.Contains(tag.Id))
            .ToDictionaryAsync(tag => tag.Id, tag => tag.Name, ct);
        var edgeCounts = await db.Set<SegmentStudioDerivationEdge>().AsNoTracking()
            .Where(edge => rules.Select(rule => rule.Id).Contains(edge.RuleId))
            .GroupBy(edge => edge.RuleId)
            .Select(group => new { RuleId = group.Key, Count = group.Count() })
            .ToDictionaryAsync(item => item.RuleId, item => item.Count, ct);

        var parsedMappings = rules.ToDictionary(rule => rule.Id, rule => ParseMappings(rule.MetadataJson));
        var definitionIds = parsedMappings.Values.SelectMany(mapping => mapping)
            .SelectMany(mapping => new[] { mapping.SourceSlotDefinitionId, mapping.DerivedSlotDefinitionId })
            .Distinct()
            .ToArray();
        var definitions = await LoadDefinitionTagsAsync(db, definitionIds, ct);

        return rules.Select(rule => new DerivationRuleView(
            rule.Id,
            rule.Key,
            rule.Version,
            rule.SourceTagId,
            tagNames.GetValueOrDefault(rule.SourceTagId) ?? $"Tag {rule.SourceTagId}",
            rule.DerivedTagId,
            tagNames.GetValueOrDefault(rule.DerivedTagId) ?? $"Tag {rule.DerivedTagId}",
            edgeCounts.GetValueOrDefault(rule.Id),
            parsedMappings[rule.Id].Select(mapping => new DerivationRuleSlotMappingView(
                mapping.SourceSlotDefinitionId,
                definitions.GetValueOrDefault(mapping.SourceSlotDefinitionId)?.Label,
                mapping.DerivedSlotDefinitionId,
                definitions.GetValueOrDefault(mapping.DerivedSlotDefinitionId)?.Label,
                !BelongsTo(definitions, mapping.SourceSlotDefinitionId, rule.SourceTagId),
                !BelongsTo(definitions, mapping.DerivedSlotDefinitionId, rule.DerivedTagId))).ToArray(),
            rule.CreatedAt,
            rule.UpdatedAt)).ToArray();
    }

    public static async Task<SegmentStudioDerivationRule> SaveAsync(
        DbContext db,
        DerivationRuleSaveRequest request,
        CancellationToken ct)
    {
        if (request.SourceTagId <= 0 || request.DerivedTagId <= 0)
            throw new ArgumentException("Source and derived tags are required.", nameof(request));
        if (request.SourceTagId == request.DerivedTagId)
            throw new ArgumentException("Source and derived tags must differ.", nameof(request));
        var mappings = request.SlotMappings ?? [];
        if (mappings.Distinct().Count() != mappings.Count)
            throw new ArgumentException("Slot mappings must be unique.", nameof(request));
        if (mappings.Select(mapping => mapping.DerivedSlotDefinitionId).Distinct().Count() != mappings.Count)
            throw new ArgumentException(
                "A derived performer slot can receive only one source slot.",
                nameof(request));
        var newRuleId = Guid.NewGuid();
        var newRuleKey = request.RuleId is null ? $"segment-studio:user:{Guid.NewGuid():N}" : null;
        var newVersion = $"user:{Guid.NewGuid():N}";
        var mappingIds = mappings.Select(_ => Guid.NewGuid()).ToArray();

        if (db.Database.CurrentTransaction is not null)
            return await SaveCoreAsync(
                db, request, mappings, newRuleId, newRuleKey, newVersion, mappingIds, ct);

        var strategy = db.Database.CreateExecutionStrategy();
        return await strategy.ExecuteAsync(async () =>
        {
            db.ChangeTracker.Clear();
            return await SaveCoreAsync(
                db, request, mappings, newRuleId, newRuleKey, newVersion, mappingIds, ct);
        });
    }

    private static async Task<SegmentStudioDerivationRule> SaveCoreAsync(
        DbContext db,
        DerivationRuleSaveRequest request,
        IReadOnlyList<DerivationRuleSlotMappingRequest> mappings,
        Guid newRuleId,
        string? newRuleKey,
        string newVersion,
        IReadOnlyList<Guid> mappingIds,
        CancellationToken ct)
    {
        await using var transaction = db.Database.IsRelational() && db.Database.CurrentTransaction is null
            ? await db.Database.BeginTransactionAsync(ct)
            : null;
        await SegmentStudioRolloutService.EnsureWritesEnabledAsync(db, ct);
        await DerivationRuleIntegrityService.AcquireMutationLockAsync(db, ct);

        var committed = request.RuleId is null
            ? await db.Set<SegmentStudioDerivationRule>()
                .SingleOrDefaultAsync(rule => rule.Id == newRuleId, ct)
            : await db.Set<SegmentStudioDerivationRule>()
                .SingleOrDefaultAsync(rule =>
                    rule.Id == request.RuleId.Value && rule.Version == newVersion, ct);
        if (committed is not null)
        {
            if (transaction is not null) await transaction.CommitAsync(ct);
            return committed;
        }

        var tags = await db.Set<Tag>().AsNoTracking()
            .Where(tag => tag.Id == request.SourceTagId || tag.Id == request.DerivedTagId)
            .Select(tag => tag.Id)
            .ToListAsync(ct);
        if (!tags.Contains(request.SourceTagId) || !tags.Contains(request.DerivedTagId))
            throw new ArgumentException("Source and derived tags must exist.", nameof(request));

        SegmentStudioDerivationRule? previous = null;
        if (request.RuleId is Guid ruleId)
        {
            previous = await db.Set<SegmentStudioDerivationRule>()
                .SingleOrDefaultAsync(rule => rule.Id == ruleId, ct)
                ?? throw new KeyNotFoundException("Derivation rule was not found.");
        }

        await ValidateMappingsAsync(db, request.SourceTagId, request.DerivedTagId, mappings, ct);
        await DerivationRuleIntegrityService.ValidateRelationshipAsync(
            db, previous?.Id, request.SourceTagId, request.DerivedTagId, ct);

        var now = DateTime.UtcNow;
        if (previous is not null)
        {
            if (string.IsNullOrWhiteSpace(request.CleanupFingerprint))
                throw new LineageConflictException(
                    "LINEAGE_PREVIEW_REQUIRED",
                    "Preview the materialized derivations that will be removed before editing this rule.");
            await DerivationRuleLifecycleService.ApplyCleanupAsync(
                db, previous.Id, request.CleanupFingerprint, deleteRule: false, ct);
            previous.Version = newVersion;
            previous.SourceTagId = request.SourceTagId;
            previous.DerivedTagId = request.DerivedTagId;
            previous.MetadataJson = SerializeMetadata(mappings, mappingIds);
            previous.UpdatedAt = now;
            await db.SaveChangesAsync(ct);
            if (transaction is not null) await transaction.CommitAsync(ct);
            return previous;
        }
        var created = new SegmentStudioDerivationRule
        {
            Id = newRuleId,
            Key = newRuleKey!,
            Version = newVersion,
            SourceTagId = request.SourceTagId,
            DerivedTagId = request.DerivedTagId,
            MetadataJson = SerializeMetadata(mappings, mappingIds),
            CreatedAt = now,
            UpdatedAt = now,
        };
        db.Add(created);
        await db.SaveChangesAsync(ct);
        if (transaction is not null) await transaction.CommitAsync(ct);
        return created;
    }

    private static async Task ValidateMappingsAsync(
        DbContext db,
        int sourceTagId,
        int derivedTagId,
        IReadOnlyList<DerivationRuleSlotMappingRequest> mappings,
        CancellationToken ct)
    {
        if (mappings.Count == 0) return;
        var ids = mappings.SelectMany(mapping =>
                new[] { mapping.SourceSlotDefinitionId, mapping.DerivedSlotDefinitionId })
            .Distinct()
            .ToArray();
        var definitions = await (
                from definition in db.Set<SegmentStudioSlotDefinition>().AsNoTracking()
                join set in db.Set<SegmentStudioSlotDefinitionSet>().AsNoTracking()
                    on definition.SlotDefinitionSetId equals set.Id
                where ids.Contains(definition.Id)
                select new { definition.Id, set.TagId })
            .ToDictionaryAsync(definition => definition.Id, definition => definition.TagId, ct);
        if (mappings.Any(mapping =>
                !definitions.TryGetValue(mapping.SourceSlotDefinitionId, out var mappedSourceTagId)
                || mappedSourceTagId != sourceTagId
                || !definitions.TryGetValue(mapping.DerivedSlotDefinitionId, out var mappedDerivedTagId)
                || mappedDerivedTagId != derivedTagId))
            throw new ArgumentException(
                "Every slot mapping must connect a source-tag slot to a derived-tag slot.",
                nameof(mappings));
    }

    internal static IReadOnlyList<DerivationRuleSlotMappingRequest> ParseMappings(string metadataJson)
    {
        try
        {
            using var document = JsonDocument.Parse(metadataJson);
            if (document.RootElement.ValueKind != JsonValueKind.Object
                || !document.RootElement.TryGetProperty("slotMappings", out var mappings)
                || mappings.ValueKind != JsonValueKind.Array)
                return [];
            var parsed = new List<DerivationRuleSlotMappingRequest>();
            foreach (var mapping in mappings.EnumerateArray())
            {
                if (mapping.ValueKind != JsonValueKind.Object
                    || !mapping.TryGetProperty("sourceSlotDefinitionId", out var source)
                    || !mapping.TryGetProperty("derivedSlotDefinitionId", out var derived)
                    || source.ValueKind != JsonValueKind.String
                    || derived.ValueKind != JsonValueKind.String
                    || !source.TryGetGuid(out var sourceId)
                    || !derived.TryGetGuid(out var derivedId))
                    continue;
                parsed.Add(new(sourceId, derivedId));
            }
            return parsed;
        }
        catch (JsonException)
        {
            return [];
        }
    }

    // Mappings live in rule metadata rather than a table, so nothing cascades when a slot is deleted.
    // A mapping only connects slots of its rule's own two tags, so only rules using the tag are read.
    internal static async Task<IReadOnlyDictionary<Guid, IReadOnlyList<string>>> LoadRulesMappingSlotsAsync(
        DbContext db,
        int tagId,
        IReadOnlyCollection<Guid> slotDefinitionIds,
        CancellationToken ct)
    {
        if (slotDefinitionIds.Count == 0) return new Dictionary<Guid, IReadOnlyList<string>>();
        var rules = await db.Set<SegmentStudioDerivationRule>().AsNoTracking()
            .Where(rule => rule.SourceTagId == tagId || rule.DerivedTagId == tagId)
            .Select(rule => new { rule.SourceTagId, rule.DerivedTagId, rule.MetadataJson })
            .ToListAsync(ct);
        var uses = rules
            .SelectMany(rule => ParseMappings(rule.MetadataJson)
                .SelectMany(mapping => new[] { mapping.SourceSlotDefinitionId, mapping.DerivedSlotDefinitionId })
                .Where(slotDefinitionIds.Contains)
                .Distinct()
                .Select(slotDefinitionId => (slotDefinitionId, rule.SourceTagId, rule.DerivedTagId)))
            .ToArray();
        if (uses.Length == 0) return new Dictionary<Guid, IReadOnlyList<string>>();
        var tagIds = uses.SelectMany(use => new[] { use.SourceTagId, use.DerivedTagId }).Distinct().ToArray();
        var tagNames = await db.Set<Tag>().AsNoTracking()
            .Where(tag => tagIds.Contains(tag.Id))
            .ToDictionaryAsync(tag => tag.Id, tag => tag.Name, ct);
        return uses
            .GroupBy(use => use.slotDefinitionId)
            .ToDictionary(
                group => group.Key,
                group => (IReadOnlyList<string>)group
                    .Select(use => $"{tagNames.GetValueOrDefault(use.SourceTagId) ?? $"Tag {use.SourceTagId}"}"
                        + $" → {tagNames.GetValueOrDefault(use.DerivedTagId) ?? $"Tag {use.DerivedTagId}"}")
                    .OrderBy(name => name, StringComparer.CurrentCultureIgnoreCase)
                    .ThenBy(name => name, StringComparer.Ordinal)
                    .ToArray());
    }

    // Keeps the rule's version: its existing edges stay valid, and only future materializations change.
    internal static async Task RemoveSlotMappingsAsync(
        DbContext db,
        int tagId,
        IReadOnlyCollection<Guid> slotDefinitionIds,
        CancellationToken ct)
    {
        if (slotDefinitionIds.Count == 0) return;
        var now = DateTime.UtcNow;
        var rules = await db.Set<SegmentStudioDerivationRule>()
            .Where(rule => rule.SourceTagId == tagId || rule.DerivedTagId == tagId)
            .ToListAsync(ct);
        foreach (var rule in rules)
            RemoveMappings(rule, (id, _) => slotDefinitionIds.Contains(id), now);
    }

    // Repairs rules whose mappings outlived their slots, from before slot deletion removed them.
    // Like slot deletion, it keeps each rule's version.
    public static async Task<int> RemoveMissingSlotMappingsAsync(DbContext db, CancellationToken ct)
    {
        if (db.Database.CurrentTransaction is not null)
            return await RemoveMissingSlotMappingsCoreAsync(db, ct);
        var strategy = db.Database.CreateExecutionStrategy();
        return await strategy.ExecuteAsync(async () =>
        {
            db.ChangeTracker.Clear();
            return await RemoveMissingSlotMappingsCoreAsync(db, ct);
        });
    }

    private static async Task<int> RemoveMissingSlotMappingsCoreAsync(DbContext db, CancellationToken ct)
    {
        await using var transaction = db.Database.IsRelational() && db.Database.CurrentTransaction is null
            ? await db.Database.BeginTransactionAsync(ct)
            : null;
        await SegmentStudioRolloutService.EnsureWritesEnabledAsync(db, ct);
        // Slot saves take this lock before deleting slots, so none can disappear mid-repair.
        await DerivationRuleIntegrityService.AcquireMutationLockAsync(db, ct);

        var rules = await db.Set<SegmentStudioDerivationRule>().ToListAsync(ct);
        var definitionIds = rules.SelectMany(rule => ParseMappings(rule.MetadataJson))
            .SelectMany(mapping => new[] { mapping.SourceSlotDefinitionId, mapping.DerivedSlotDefinitionId })
            .Distinct()
            .ToArray();
        var definitions = await LoadDefinitionTagsAsync(db, definitionIds, ct);
        var now = DateTime.UtcNow;
        var repaired = 0;
        foreach (var rule in rules)
            if (RemoveMappings(
                    rule,
                    (id, isSource) => !BelongsTo(definitions, id, isSource ? rule.SourceTagId : rule.DerivedTagId),
                    now))
                repaired++;
        await db.SaveChangesAsync(ct);
        if (transaction is not null) await transaction.CommitAsync(ct);
        return repaired;
    }

    // Rewrites only the slotMappings array, keeping every other metadata field and each mapping's id.
    private static bool RemoveMappings(
        SegmentStudioDerivationRule rule,
        Func<Guid, bool, bool> removesSlot,
        DateTime now)
    {
        if (ParseMappings(rule.MetadataJson).Count == 0) return false;
        var metadata = JsonNode.Parse(rule.MetadataJson)!.AsObject();
        var mappings = metadata["slotMappings"]!.AsArray();
        // Judge exactly the entries ParseMappings reads; entries it skips are kept untouched.
        var retained = mappings
            .Where(mapping => !(mapping is JsonObject candidate
                && SlotId(candidate, "sourceSlotDefinitionId") is Guid sourceId
                && SlotId(candidate, "derivedSlotDefinitionId") is Guid derivedId
                && (removesSlot(sourceId, true) || removesSlot(derivedId, false))))
            .Select(mapping => mapping?.DeepClone())
            .ToArray();
        if (retained.Length == mappings.Count) return false;
        for (var sortOrder = 0; sortOrder < retained.Length; sortOrder++)
            if (retained[sortOrder] is JsonObject mapping && mapping.ContainsKey("sortOrder"))
                mapping["sortOrder"] = sortOrder;
        metadata["slotMappings"] = new JsonArray(retained);
        rule.MetadataJson = metadata.ToJsonString();
        rule.UpdatedAt = now;
        return true;

        static Guid? SlotId(JsonObject mapping, string property) =>
            mapping[property] is JsonValue value
            && value.TryGetValue<string>(out var text)
            && Guid.TryParse(text, out var id)
                ? id
                : null;
    }

    private sealed record DefinitionTag(int TagId, string? Label);

    private static async Task<IReadOnlyDictionary<Guid, DefinitionTag>> LoadDefinitionTagsAsync(
        DbContext db,
        IReadOnlyCollection<Guid> definitionIds,
        CancellationToken ct) =>
        definitionIds.Count == 0
            ? new Dictionary<Guid, DefinitionTag>()
            : await (
                    from definition in db.Set<SegmentStudioSlotDefinition>().AsNoTracking()
                    join set in db.Set<SegmentStudioSlotDefinitionSet>().AsNoTracking()
                        on definition.SlotDefinitionSetId equals set.Id
                    where definitionIds.Contains(definition.Id)
                    select new { definition.Id, set.TagId, definition.Label })
                .ToDictionaryAsync(
                    definition => definition.Id,
                    definition => new DefinitionTag(definition.TagId, definition.Label),
                    ct);

    // A slot that is gone, or belongs to another tag, can no longer be copied by the rule.
    private static bool BelongsTo(IReadOnlyDictionary<Guid, DefinitionTag> definitions, Guid id, int tagId) =>
        definitions.TryGetValue(id, out var definition) && definition.TagId == tagId;

    private static string SerializeMetadata(
        IReadOnlyList<DerivationRuleSlotMappingRequest> mappings,
        IReadOnlyList<Guid> mappingIds) =>
        JsonSerializer.Serialize(new
        {
            relationshipType = "implies",
            slotMappings = mappings.Select((mapping, sortOrder) => new
            {
                id = mappingIds[sortOrder],
                sortOrder,
                sourceSlotDefinitionId = mapping.SourceSlotDefinitionId,
                derivedSlotDefinitionId = mapping.DerivedSlotDefinitionId,
            }),
        });

}
