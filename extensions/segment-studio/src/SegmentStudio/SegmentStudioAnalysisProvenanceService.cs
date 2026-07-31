using System.Text.Json;
using Microsoft.EntityFrameworkCore;

namespace SegmentStudio;

public interface ISegmentStudioAnalysisProvenanceService
{
    Task<int> ProjectAsync(
        DbContext db,
        SegmentStudioAnalysisRun run,
        SegmentStudioAnalyzeVideoRequest request,
        SegmentStudioAnalyzeVideoResponse response,
        IReadOnlyList<SegmentStudioAnalysisCandidate> candidates,
        CancellationToken ct);

    Task<int> BackfillAsync(DbContext db, Guid runId, CancellationToken ct);
}

public sealed class SegmentStudioAnalysisProvenanceService(
    ISegmentSourceRegistry sourceRegistry,
    IProvenanceActivityService activityService,
    ILineageNodeService lineageNodeService,
    ISegmentProvenanceService provenanceService)
    : ISegmentStudioAnalysisProvenanceService
{
    private static readonly JsonSerializerOptions JsonOptions = new(JsonSerializerDefaults.Web);

    public async Task<int> ProjectAsync(
        DbContext db,
        SegmentStudioAnalysisRun run,
        SegmentStudioAnalyzeVideoRequest request,
        SegmentStudioAnalyzeVideoResponse response,
        IReadOnlyList<SegmentStudioAnalysisCandidate> candidates,
        CancellationToken ct)
    {
        var linked = candidates.Where(candidate => candidate.ItemId is not null).ToArray();
        if (linked.Length == 0 || response.Ai is null)
            return 0;
        var linkedItemIds = linked.Select(candidate => candidate.ItemId!.Value).ToArray();
        var linkedItems = await db.Set<SegmentStudioItem>()
            .Where(item => linkedItemIds.Contains(item.Id))
            .ToListAsync(ct);
        foreach (var item in linkedItems.Where(item =>
                     item.SourceKey == "ext:segment-studio.analysis"
                     || item.SourceKey == "ext:ai.tagging"))
            item.SourceKey = "ext:ai.tagging";
        await db.SaveChangesAsync(ct);
        await SupersedeLegacySourceAsync(db, linkedItemIds, ct);

        var source = await sourceRegistry.RegisterAsync(
            db,
            new SegmentSourceRegistration(
                "ext:ai.tagging",
                "Cove AI Tagging",
                "ai",
                "Cove",
                null,
                "Native Cove AI segment source.",
                "{}"),
            ct);
        var completedAt = run.CompletedAt ?? run.UpdatedAt;
        var activity = await activityService.CaptureAsync(
            db,
            new ProvenanceActivityCapture(
                Guid.NewGuid(),
                $"ai-run:{source.Key}:{response.RunId}",
                "ai-analysis",
                source.Id,
                response.RunId.ToString(),
                response.Status,
                completedAt.AddSeconds(-response.Metrics.TotalSeconds),
                completedAt,
                JsonSerializer.Serialize(request, JsonOptions),
                JsonSerializer.Serialize(response.Ai.Models, JsonOptions),
                JsonSerializer.Serialize(new
                {
                    candidateCount = response.Ai.Segments.Count,
                    boundaryCount = response.OmniShotCut?.Boundaries.Count,
                    response.Metrics,
                    response.Warnings,
                }, JsonOptions),
                JsonSerializer.Serialize(new
                {
                    requestId = response.RequestId,
                    sourceFingerprint = response.Source.Fingerprint,
                    response.Proxies.CacheKey,
                    response.Proxies.SettingsVersion,
                }, JsonOptions)),
            ct);

        var modelsByCategory = response.Ai.Models
            .SelectMany(model => (model.Categories ?? [])
                .Select(category => new { Category = category, Model = model }))
            .GroupBy(candidate => candidate.Category, StringComparer.OrdinalIgnoreCase)
            .ToDictionary(
                group => group.Key,
                group => group.Select(candidate => candidate.Model).ToArray(),
                StringComparer.OrdinalIgnoreCase);
        foreach (var candidate in linked)
        {
            var node = await lineageNodeService.EnsureAsync(db, candidate.ItemId!.Value, ct);
            var models = modelsByCategory.GetValueOrDefault(candidate.ModelKey) ?? [];
            var model = models.Length == 1 ? models[0] : null;
            await provenanceService.AppendAsync(
                db,
                new SegmentProvenanceAppend(
                    node.Id,
                    source.Id,
                    "origin",
                    activity.Id,
                    candidate.ModelKey,
                    model?.Identifier?.ToString(),
                    ScalarText(model?.Version),
                    candidate.Confidence is double confidence ? (float)confidence : null,
                    candidate.CreatedAt,
                    JsonSerializer.Serialize(new
                    {
                        candidate.CandidateKey,
                        candidate.Kind,
                        candidate.TagName,
                        candidate.Title,
                        candidate.ObservationCount,
                        modelCandidates = models.Length > 1 ? models : null,
                    }, JsonOptions)),
                ct);
        }
        return linked.Length;
    }

    public async Task<int> BackfillAsync(DbContext db, Guid runId, CancellationToken ct)
    {
        var run = await db.Set<SegmentStudioAnalysisRun>()
            .SingleOrDefaultAsync(candidate => candidate.Id == runId, ct)
            ?? throw new KeyNotFoundException("Analysis run not found.");
        if (run.Status != "completed" || string.IsNullOrWhiteSpace(run.ResultJson))
            throw new InvalidOperationException("Only completed analysis runs can be backfilled.");
        var response = JsonSerializer.Deserialize<SegmentStudioAnalyzeVideoResponse>(
            run.ResultJson, JsonOptions)
            ?? throw new InvalidOperationException("The retained analysis response is invalid.");
        var analyses = JsonSerializer.Deserialize<IReadOnlyList<SegmentStudioAnalysisKind>>(
            run.AnalysesJson, JsonOptions) ?? [];
        var sourcePath = await db.Set<Cove.Core.Entities.VideoFile>().AsNoTracking()
            .Where(file => file.Id == run.VideoFileId)
            .Select(file => file.Path)
            .SingleAsync(ct);
        var request = new SegmentStudioAnalyzeVideoRequest(
            run.Id,
            sourcePath,
            analyses,
            Ai: analyses.Contains(SegmentStudioAnalysisKind.AiTagging)
                ? new SegmentStudioAnalysisAiOptions()
                : null,
            OmniShotCut: analyses.Contains(SegmentStudioAnalysisKind.OmniShotCut)
                ? new SegmentStudioAnalysisOmniShotCutOptions()
                : null);
        var candidates = await db.Set<SegmentStudioAnalysisCandidate>()
            .Where(candidate => candidate.RunId == runId)
            .OrderBy(candidate => candidate.Id)
            .ToListAsync(ct);
        if (candidates.Any(candidate => candidate.ItemId is null))
        {
            var items = await (
                    from item in db.Set<SegmentStudioItem>()
                    join tag in db.Set<Cove.Core.Entities.Tag>() on item.TagId equals tag.Id
                    where (item.SourceKey == "ext:segment-studio.analysis"
                            || item.SourceKey == "ext:ai.tagging")
                        && item.SourceRunId == runId.ToString()
                    select new { Item = item, TagName = tag.Name })
                .ToListAsync(ct);
            var available = items.ToList();
            foreach (var candidate in candidates.Where(candidate => candidate.ItemId is null))
            {
                var match = available.FirstOrDefault(entry =>
                    string.Equals(entry.TagName, candidate.TagName, StringComparison.OrdinalIgnoreCase)
                    && entry.Item.StartSec == candidate.StartSec
                    && entry.Item.EndSec == candidate.EndSec
                    && entry.Item.Title == candidate.Title
                    && entry.Item.Confidence == (candidate.Confidence is double confidence
                        ? (float)confidence
                        : null));
                if (match is null)
                    continue;
                candidate.ItemId = match.Item.Id;
                match.Item.SourceKey = "ext:ai.tagging";
                available.Remove(match);
            }
            foreach (var entry in items)
                entry.Item.SourceKey = "ext:ai.tagging";
            await db.SaveChangesAsync(ct);
        }
        return await ProjectAsync(db, run, request, response, candidates, ct);
    }

    private static string? ScalarText(JsonElement? value)
    {
        if (value is null)
            return null;
        return value.Value.ValueKind == JsonValueKind.String
            ? value.Value.GetString()
            : value.Value.GetRawText();
    }

    private static async Task SupersedeLegacySourceAsync(
        DbContext db, IReadOnlyCollection<long> itemIds, CancellationToken ct)
    {
        var legacySourceId = await db.Set<SegmentStudioSource>().AsNoTracking()
            .Where(source => source.Key == "ext:segment-studio.analysis")
            .Select(source => (long?)source.Id)
            .SingleOrDefaultAsync(ct);
        if (legacySourceId is null)
            return;
        var nodeIds = await db.Set<SegmentStudioLineageNode>().AsNoTracking()
            .Where(node => node.ItemId != null && itemIds.Contains(node.ItemId.Value))
            .Select(node => node.Id)
            .ToArrayAsync(ct);
        if (nodeIds.Length == 0)
            return;
        var affectedNodeIds = nodeIds.ToHashSet();
        var edges = await db.Set<SegmentStudioDerivationEdge>().AsNoTracking()
            .Select(edge => new { edge.SourceNodeId, edge.DerivedNodeId })
            .ToListAsync(ct);
        var children = edges.ToLookup(edge => edge.SourceNodeId, edge => edge.DerivedNodeId);
        var pending = new Queue<Guid>(nodeIds);
        while (pending.TryDequeue(out var nodeId))
        {
            foreach (var childId in children[nodeId])
            {
                if (affectedNodeIds.Add(childId))
                    pending.Enqueue(childId);
            }
        }
        var rootAssertions = await db.Set<SegmentStudioSegmentProvenance>()
            .Where(assertion =>
                nodeIds.Contains(assertion.LineageNodeId)
                && assertion.SourceId == legacySourceId
                && assertion.Relation == "origin"
                && assertion.SupersededAt == null)
            .ToListAsync(ct);
        var descendantIds = affectedNodeIds.Except(nodeIds).ToArray();
        var inherited = descendantIds.Length == 0
            ? []
            : await db.Set<SegmentStudioSegmentProvenance>()
                .Where(assertion =>
                    descendantIds.Contains(assertion.LineageNodeId)
                    && assertion.SourceId == legacySourceId
                    && assertion.Relation == "inherited"
                    && assertion.SupersededAt == null)
                .ToListAsync(ct);
        var assertions = rootAssertions.Concat(inherited.Where(candidate =>
            rootAssertions.Any(origin =>
                origin.ActivityId == candidate.ActivityId
                && origin.ModelKey == candidate.ModelKey
                && origin.ModelIdentifier == candidate.ModelIdentifier
                && origin.ModelVersion == candidate.ModelVersion
                && origin.Confidence == candidate.Confidence
                && origin.RecordedAt == candidate.RecordedAt
                && origin.MetadataJson == candidate.MetadataJson))).ToList();
        if (assertions.Count == 0)
            return;
        var now = DateTime.UtcNow;
        foreach (var assertion in assertions)
        {
            assertion.SupersededAt = now;
            assertion.UpdatedAt = now;
        }
        await db.SaveChangesAsync(ct);
    }
}
