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

    private static string? ScalarText(JsonElement? value)
    {
        if (value is null)
            return null;
        return value.Value.ValueKind == JsonValueKind.String
            ? value.Value.GetString()
            : value.Value.GetRawText();
    }
}
