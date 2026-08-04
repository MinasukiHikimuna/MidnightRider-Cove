using System.Text.Json;
using System.Text.Json.Nodes;
using Cove.Core.Entities;
using Microsoft.EntityFrameworkCore;

namespace SegmentStudio;

public sealed record NativeAiIngestionRequest(
    int? SegmentId = null,
    int? VideoId = null,
    int? AfterSegmentId = null,
    int BatchSize = 200,
    bool OnlyMissingProvenance = false,
    IReadOnlyList<int>? SegmentIds = null);

public sealed record NativeAiEnrichmentIssue(
    int SegmentId,
    string Kind,
    string Detail);

public sealed record NativeAiIngestionResult(
    int ProcessedCount,
    int IngestedCount,
    int CreatedItemCount,
    int? NextCursor,
    bool HasMore,
    IReadOnlyList<NativeAiEnrichmentIssue> UnresolvedIssues);

public interface INativeAiProvenanceIngestionService
{
    Task<NativeAiIngestionResult> IngestAsync(
        DbContext db,
        NativeAiIngestionRequest request,
        CancellationToken ct);
}

public sealed class NativeAiProvenanceIngestionService(
    ISegmentSourceRegistry sourceRegistry,
    IProvenanceActivityService activityService,
    ILineageNodeService lineageNodeService,
    ISegmentProvenanceService provenanceService)
    : INativeAiProvenanceIngestionService
{
    public const int MaximumBatchSize = 1000;

    public async Task<NativeAiIngestionResult> IngestAsync(
        DbContext db,
        NativeAiIngestionRequest request,
        CancellationToken ct)
    {
        if (request.BatchSize is < 1 or > MaximumBatchSize)
            throw new ArgumentOutOfRangeException(
                nameof(request), $"Batch size must be between 1 and {MaximumBatchSize}.");
        if (request.SegmentIds is { } segmentIds)
        {
            if (segmentIds.Count is < 1 or > MaximumBatchSize)
                throw new ArgumentOutOfRangeException(
                    nameof(request), $"Select between 1 and {MaximumBatchSize} segment IDs.");
            if (request.SegmentId is not null || request.AfterSegmentId is not null)
                throw new ArgumentException(
                    "Explicit segment IDs cannot be combined with a segment ID or cursor.",
                    nameof(request));
            if (segmentIds.Distinct().Count() != segmentIds.Count)
                throw new ArgumentException("A segment ID can only appear once.", nameof(request));
            if (request.BatchSize < segmentIds.Count)
                throw new ArgumentException(
                    "Batch size must include every explicit segment ID.", nameof(request));
        }

        if (db.Database.CurrentTransaction is not null)
            return await IngestCoreAsync(db, request, new IngestionAttempt(), ct);

        var attempt = new IngestionAttempt();
        var strategy = db.Database.CreateExecutionStrategy();
        var firstAttempt = true;
        return await strategy.ExecuteAsync(async () =>
        {
            if (!firstAttempt) db.ChangeTracker.Clear();
            firstAttempt = false;
            return await IngestCoreAsync(db, request, attempt, ct);
        });
    }

    private async Task<NativeAiIngestionResult> IngestCoreAsync(
        DbContext db,
        NativeAiIngestionRequest request,
        IngestionAttempt attempt,
        CancellationToken ct)
    {
        await using var transaction = db.Database.IsRelational()
            && db.Database.CurrentTransaction is null
                ? await db.Database.BeginTransactionAsync(ct)
                : null;
        await SegmentStudioRolloutService.EnsureWritesEnabledAsync(db, ct);

        var query = db.Set<Segment>()
            .AsNoTracking()
            .Where(segment =>
                segment.HostType == SegmentHostType.Video
                && segment.Kind == "tag"
                && segment.TagId != null
                && segment.SourceKey.StartsWith("ext:ai."));
        if (request.SegmentId is int segmentId)
            query = query.Where(segment => segment.Id == segmentId);
        if (request.SegmentIds is { } segmentIds)
            query = query.Where(segment => segmentIds.Contains(segment.Id));
        if (request.VideoId is int videoId)
            query = query.Where(segment => segment.HostId == videoId);
        if (request.AfterSegmentId is int afterSegmentId)
            query = query.Where(segment => segment.Id > afterSegmentId);
        if (request.OnlyMissingProvenance)
        {
            query = query.Where(segment => !db.Set<SegmentStudioItem>().Any(item =>
                item.NativeSegmentId == segment.Id
                && db.Set<SegmentStudioLineageNode>().Any(node =>
                    node.ItemId == item.Id
                    && db.Set<SegmentStudioSegmentProvenance>().Any(assertion =>
                        assertion.LineageNodeId == node.Id
                        && assertion.Relation == "origin"
                        && assertion.SupersededAt == null
                        && db.Set<SegmentStudioSource>().Any(source =>
                            source.Id == assertion.SourceId
                            && source.Key == segment.SourceKey)))));
        }

        if (attempt.CandidateIds is null)
        {
            var selectedIds = await query
                .OrderBy(segment => segment.Id)
                .Take(request.BatchSize + 1)
                .Select(segment => segment.Id)
                .ToListAsync(ct);
            attempt.HasMore = selectedIds.Count > request.BatchSize;
            if (attempt.HasMore)
                selectedIds.RemoveAt(selectedIds.Count - 1);
            attempt.CandidateIds = selectedIds;
        }

        var candidateVideoIds = await db.Set<Segment>()
            .AsNoTracking()
            .Where(segment => attempt.CandidateIds.Contains(segment.Id))
            .Select(segment => segment.HostId)
            .Distinct()
            .Order()
            .ToListAsync(ct);
        foreach (var lockVideoId in candidateVideoIds)
            await SegmentStudioReviewLock.AcquireAsync(db, lockVideoId, ct);

        // Reload after acquiring the locks so provenance reflects the current native
        // segment rather than the snapshot that was used to select the batch.
        var candidates = await db.Set<Segment>()
            .AsNoTracking()
            .Where(segment => attempt.CandidateIds.Contains(segment.Id))
            .OrderBy(segment => segment.Id)
            .ToListAsync(ct);
        attempt.CreatedItemCount = 0;
        var itemsBySegmentId = await db.Set<SegmentStudioItem>()
            .AsNoTracking()
            .Where(item => item.NativeSegmentId != null
                && attempt.CandidateIds.Contains(item.NativeSegmentId.Value))
            .ToDictionaryAsync(item => item.NativeSegmentId!.Value, ct);
        var missingSegments = candidates
            .Where(segment => !itemsBySegmentId.ContainsKey(segment.Id))
            .ToArray();
        if (missingSegments.Length > 0)
        {
            var now = DateTime.UtcNow;
            if (db.Database.ProviderName?.Contains(
                    "Npgsql", StringComparison.Ordinal) == true)
            {
                var missingSegmentIds = missingSegments
                    .Select(segment => segment.Id)
                    .ToArray();
                attempt.CreatedItemCount =
                    await db.Database.ExecuteSqlInterpolatedAsync($"""
                    INSERT INTO segment_studio_items
                        (native_segment_id, representation_schema_version,
                         revision, created_at, updated_at)
                    SELECT segment."Id", 1, 0, {now}, {now}
                    FROM segments AS segment
                    WHERE segment."Id" = ANY ({missingSegmentIds})
                    ON CONFLICT (native_segment_id) DO NOTHING
                    """, ct);
            }
            else
            {
                db.AddRange(missingSegments.Select(segment =>
                    new SegmentStudioItem
                    {
                        NativeSegmentId = segment.Id,
                        RepresentationSchemaVersion = 1,
                        Revision = 0,
                        CreatedAt = now,
                        UpdatedAt = now,
                    }));
                await db.SaveChangesAsync(ct);
                attempt.CreatedItemCount = missingSegments.Length;
            }
            itemsBySegmentId = await db.Set<SegmentStudioItem>()
                .AsNoTracking()
                .Where(item => item.NativeSegmentId != null
                    && attempt.CandidateIds.Contains(item.NativeSegmentId.Value))
                .ToDictionaryAsync(item => item.NativeSegmentId!.Value, ct);
        }

        var issues = new List<NativeAiEnrichmentIssue>();
        var sourcesByKey = new Dictionary<string, SegmentStudioSource>(StringComparer.Ordinal);
        var runsByKey = new Dictionary<(string RunKey, int VideoId), AiRun?>();
        var activitiesByKey = new Dictionary<
            (long SourceId, string RunKey, int VideoId),
            SegmentStudioProvenanceActivity>();
        foreach (var segment in candidates)
        {
            var sourceKey = segment.SourceKey.Trim().ToLowerInvariant();
            if (!sourcesByKey.TryGetValue(sourceKey, out var source))
            {
                source = await sourceRegistry.RegisterAsync(
                    db,
                    new SegmentSourceRegistration(
                        sourceKey,
                        sourceKey == "ext:ai.tagging" ? "Cove AI Tagging" : sourceKey,
                        "ai",
                        "Cove",
                        null,
                        "Native Cove AI segment source.",
                        "{}"),
                    ct);
                sourcesByKey.Add(sourceKey, source);
            }
            var item = itemsBySegmentId[segment.Id];
            var node = await lineageNodeService.EnsureAsync(db, item.Id, ct);

            var modelKey = ReadStringProperty(segment.Payload, "modelKey");
            if (modelKey is null)
            {
                issues.Add(new NativeAiEnrichmentIssue(
                    segment.Id,
                    "missing-model-key",
                    "The native segment payload does not identify a logical model."));
            }

            SegmentStudioProvenanceActivity? activity = null;
            AiRun? run = null;
            if (string.IsNullOrWhiteSpace(segment.SourceRunId))
            {
                issues.Add(new NativeAiEnrichmentIssue(
                    segment.Id,
                    "missing-run-key",
                    "The native segment does not identify an AI run."));
            }
            else
            {
                var runCacheKey = (segment.SourceRunId, segment.HostId);
                if (!runsByKey.TryGetValue(runCacheKey, out run))
                {
                    run = await db.Set<AiRun>()
                        .AsNoTracking()
                        .SingleOrDefaultAsync(candidate =>
                            candidate.RunKey == segment.SourceRunId
                            && candidate.TargetType == AiRunTargetType.Video
                            && candidate.TargetId == segment.HostId,
                            ct);
                    runsByKey.Add(runCacheKey, run);
                }
                if (run is null)
                {
                    issues.Add(new NativeAiEnrichmentIssue(
                        segment.Id,
                        "missing-run",
                        "The referenced AI run is unavailable."));
                }
                var activityCacheKey = (
                    source.Id, segment.SourceRunId, segment.HostId);
                if (!activitiesByKey.TryGetValue(activityCacheKey, out activity))
                {
                    activity = await CaptureActivityAsync(
                        db, source, segment.SourceRunId, run, ct);
                    activitiesByKey.Add(activityCacheKey, activity);
                }
            }

            var resolution = run?.Models is not null
                ? ResolveModel(run.Models, modelKey)
                : ResolveModelJson(activity?.ModelsJson, modelKey);
            if (resolution.Kind == "missing-model")
            {
                issues.Add(new NativeAiEnrichmentIssue(
                    segment.Id,
                    "missing-model",
                    "The logical model key did not resolve in the AI run snapshot."));
            }
            else if (resolution.Kind == "ambiguous-model")
            {
                issues.Add(new NativeAiEnrichmentIssue(
                    segment.Id,
                    "ambiguous-model",
                    "More than one AI run model matches the logical model key."));
            }

            var metadata = BuildEvidenceMetadata(segment.Payload, resolution.Candidates);
            await SupersedeChangedEnrichmentAsync(
                db,
                node.Id,
                source.Id,
                activity?.Id,
                modelKey,
                resolution.Identifier,
                resolution.Version,
                segment.Confidence,
                segment.CreatedAt,
                metadata,
                ct);
            await provenanceService.AppendAsync(
                db,
                new SegmentProvenanceAppend(
                    node.Id,
                    source.Id,
                    "origin",
                    activity?.Id,
                    modelKey,
                    resolution.Identifier,
                    resolution.Version,
                    segment.Confidence,
                    segment.CreatedAt,
                    metadata),
                ct);
        }

        var result = new NativeAiIngestionResult(
            candidates.Count,
            candidates.Count,
            attempt.CreatedItemCount,
            candidates.Count == 0 ? request.AfterSegmentId : candidates[^1].Id,
            attempt.HasMore,
            issues);
        if (transaction is not null) await transaction.CommitAsync(ct);
        return result;
    }

    private sealed class IngestionAttempt
    {
        public List<int>? CandidateIds { get; set; }
        public int CreatedItemCount { get; set; }
        public bool HasMore { get; set; }
    }

    private async Task<SegmentStudioProvenanceActivity> CaptureActivityAsync(
        DbContext db,
        SegmentStudioSource source,
        string runKey,
        AiRun? run,
        CancellationToken ct)
    {
        var activity = await activityService.CaptureAsync(
            db,
            new ProvenanceActivityCapture(
                Guid.NewGuid(),
                $"ai-run:{source.Key}:{runKey}",
                "ai-analysis",
                source.Id,
                runKey,
                run?.Status.ToString().ToLowerInvariant(),
                run?.StartedAt,
                run?.CompletedAt,
                CanonicalJson(run?.Request),
                CanonicalJson(run?.Models),
                CanonicalJson(run?.Summary),
                run is null ? """{"enrichment":"missing-run"}""" : "{}"),
            ct);
        if (run is null || (
                activity.RequestJson == CanonicalJson(run.Request)
                && activity.ModelsJson == CanonicalJson(run.Models)
                && activity.SummaryJson == CanonicalJson(run.Summary)
                && activity.Status == run.Status.ToString().ToLowerInvariant()))
        {
            return activity;
        }

        activity.Status = run.Status.ToString().ToLowerInvariant();
        activity.StartedAt = run.StartedAt;
        activity.CompletedAt = run.CompletedAt;
        activity.RequestJson = CanonicalJson(run.Request);
        activity.ModelsJson = CanonicalJson(run.Models);
        activity.SummaryJson = CanonicalJson(run.Summary);
        activity.MetadataJson = "{}";
        activity.UpdatedAt = DateTime.UtcNow;
        db.Update(activity);
        await db.SaveChangesAsync(ct);
        return activity;
    }

    private static async Task SupersedeChangedEnrichmentAsync(
        DbContext db,
        Guid nodeId,
        long sourceId,
        Guid? activityId,
        string? modelKey,
        string? modelIdentifier,
        string? modelVersion,
        float? confidence,
        DateTime recordedAt,
        string metadataJson,
        CancellationToken ct)
    {
        var assertions = await db.Set<SegmentStudioSegmentProvenance>()
            .Where(assertion =>
                assertion.LineageNodeId == nodeId
                && assertion.SourceId == sourceId
                && assertion.Relation == "origin"
                && assertion.ActivityId == activityId
                && assertion.SupersededAt == null)
            .ToListAsync(ct);
        var changed = assertions.Where(assertion =>
            assertion.ModelKey != modelKey
            || assertion.ModelIdentifier != modelIdentifier
            || assertion.ModelVersion != modelVersion
            || assertion.Confidence != confidence
            || assertion.RecordedAt != recordedAt
            || assertion.MetadataJson != metadataJson).ToList();
        if (changed.Count == 0)
            return;
        var now = DateTime.UtcNow;
        foreach (var assertion in changed)
        {
            assertion.SupersededAt = now;
            assertion.UpdatedAt = now;
        }
        await SupersedeInheritedCopiesAsync(db, nodeId, changed, now, ct);
        await db.SaveChangesAsync(ct);
    }

    private static async Task SupersedeInheritedCopiesAsync(
        DbContext db,
        Guid sourceNodeId,
        IReadOnlyList<SegmentStudioSegmentProvenance> changed,
        DateTime supersededAt,
        CancellationToken ct)
    {
        var visited = await CollectDescendantsAsync(db, [sourceNodeId], ct);
        visited.Remove(sourceNodeId);
        if (visited.Count == 0)
            return;

        var inherited = await db.Set<SegmentStudioSegmentProvenance>()
            .Where(assertion =>
                visited.Contains(assertion.LineageNodeId)
                && assertion.Relation == "inherited"
                && assertion.SupersededAt == null)
            .ToListAsync(ct);
        foreach (var origin in changed)
        {
            var otherOrigins = await db.Set<SegmentStudioSegmentProvenance>()
                .AsNoTracking()
                .Where(candidate =>
                    candidate.LineageNodeId != sourceNodeId
                    && candidate.Relation == "origin"
                    && candidate.SupersededAt == null
                    && candidate.SourceId == origin.SourceId
                    && candidate.ActivityId == origin.ActivityId
                    && candidate.ModelKey == origin.ModelKey
                    && candidate.ModelIdentifier == origin.ModelIdentifier
                    && candidate.ModelVersion == origin.ModelVersion
                    && candidate.Confidence == origin.Confidence
                    && candidate.RecordedAt == origin.RecordedAt
                    && candidate.MetadataJson == origin.MetadataJson)
                .Select(candidate => candidate.LineageNodeId)
                .ToListAsync(ct);
            var supported = await CollectDescendantsAsync(db, otherOrigins, ct);
            foreach (var assertion in inherited.Where(candidate =>
                         !supported.Contains(candidate.LineageNodeId)
                         && SameEvidence(candidate, origin)))
            {
                assertion.SupersededAt = supersededAt;
                assertion.UpdatedAt = supersededAt;
            }
        }
    }

    private static async Task<HashSet<Guid>> CollectDescendantsAsync(
        DbContext db,
        IReadOnlyCollection<Guid> roots,
        CancellationToken ct)
    {
        if (roots.Count == 0)
            return [];
        var edges = await LineageScaleQueries.LoadComponentEdgesAsync(
            db, roots, tracking: false, ct);
        var outgoing = edges.ToLookup(edge => edge.SourceNodeId, edge => edge.DerivedNodeId);
        var visited = new HashSet<Guid>(roots);
        var pending = new Stack<Guid>(roots);
        while (pending.TryPop(out var current))
        {
            foreach (var next in outgoing[current])
            {
                if (visited.Add(next))
                    pending.Push(next);
            }
        }
        return visited;
    }

    private static bool SameEvidence(
        SegmentStudioSegmentProvenance candidate,
        SegmentStudioSegmentProvenance origin) =>
        candidate.SourceId == origin.SourceId
        && candidate.ActivityId == origin.ActivityId
        && candidate.ModelKey == origin.ModelKey
        && candidate.ModelIdentifier == origin.ModelIdentifier
        && candidate.ModelVersion == origin.ModelVersion
        && candidate.Confidence == origin.Confidence
        && candidate.RecordedAt == origin.RecordedAt
        && candidate.MetadataJson == origin.MetadataJson;

    private static string BuildEvidenceMetadata(
        JsonDocument? payload,
        IReadOnlyList<JsonElement> candidates)
    {
        JsonObject result;
        if (payload?.RootElement.ValueKind == JsonValueKind.Object)
        {
            result = JsonNode.Parse(payload.RootElement.GetRawText())!.AsObject();
            var modelProperty = result
                .FirstOrDefault(property =>
                    string.Equals(property.Key, "modelKey", StringComparison.OrdinalIgnoreCase))
                .Key;
            if (modelProperty is not null)
                result.Remove(modelProperty);
        }
        else
        {
            result = new JsonObject();
        }
        if (candidates.Count > 1)
        {
            result["modelCandidates"] = JsonNode.Parse(
                JsonSerializer.Serialize(candidates));
        }
        return result.ToJsonString();
    }

    private static ModelResolution ResolveModel(JsonDocument? models, string? modelKey)
    {
        if (modelKey is null)
            return new ModelResolution(null, null, null, []);
        if (models is null)
            return new ModelResolution("missing-model", null, null, []);
        var candidates = EnumerateModelObjects(models.RootElement)
            .Where(candidate => MatchesModel(candidate, modelKey))
            .Select(candidate => candidate.Clone())
            .ToList();
        if (candidates.Count == 0)
            return new ModelResolution("missing-model", null, null, []);
        if (candidates.Count > 1)
            return new ModelResolution("ambiguous-model", null, null, candidates);
        var model = candidates[0];
        return new ModelResolution(
            null,
            ReadScalarProperty(model, "identifier")
                ?? ReadScalarProperty(model, "name")
                ?? ReadScalarProperty(model, "config_name"),
            ReadScalarProperty(model, "version"),
            candidates);
    }

    private static ModelResolution ResolveModelJson(string? modelsJson, string? modelKey)
    {
        if (modelsJson is null)
            return ResolveModel(null, modelKey);
        using var models = JsonDocument.Parse(modelsJson);
        return ResolveModel(models, modelKey);
    }

    private static IEnumerable<JsonElement> EnumerateModelObjects(JsonElement element)
    {
        if (element.ValueKind == JsonValueKind.Array)
        {
            foreach (var child in element.EnumerateArray())
            {
                foreach (var candidate in EnumerateModelObjects(child))
                    yield return candidate;
            }
        }
        else if (element.ValueKind == JsonValueKind.Object)
        {
            yield return element;
        }
    }

    private static bool MatchesModel(JsonElement candidate, string modelKey)
    {
        foreach (var name in new[] { "modelKey", "key", "config_name", "configName", "name" })
        {
            if (string.Equals(
                    ReadScalarProperty(candidate, name),
                    modelKey,
                    StringComparison.OrdinalIgnoreCase))
            {
                return true;
            }
        }
        var categories = FindProperty(candidate, "categories");
        return categories?.ValueKind == JsonValueKind.Array
            && categories.Value.EnumerateArray().Any(category =>
                category.ValueKind == JsonValueKind.String
                && string.Equals(
                    category.GetString(), modelKey, StringComparison.OrdinalIgnoreCase));
    }

    private static string? ReadStringProperty(JsonDocument? document, string name) =>
        document is null ? null : ReadScalarProperty(document.RootElement, name);

    private static string? ReadScalarProperty(JsonElement element, string name)
    {
        var property = FindProperty(element, name);
        if (property is null)
            return null;
        return property.Value.ValueKind switch
        {
            JsonValueKind.String => property.Value.GetString(),
            JsonValueKind.Number or JsonValueKind.True or JsonValueKind.False =>
                property.Value.GetRawText(),
            _ => null,
        };
    }

    private static JsonElement? FindProperty(JsonElement element, string name)
    {
        if (element.ValueKind != JsonValueKind.Object)
            return null;
        foreach (var property in element.EnumerateObject())
        {
            if (string.Equals(property.Name, name, StringComparison.OrdinalIgnoreCase))
                return property.Value;
        }
        return null;
    }

    private static string? CanonicalJson(JsonDocument? document) =>
        document is null ? null : JsonSerializer.Serialize(document.RootElement);

    private sealed record ModelResolution(
        string? Kind,
        string? Identifier,
        string? Version,
        IReadOnlyList<JsonElement> Candidates);
}
