using System.Text;
using System.Text.Json.Nodes;
using AI.Extensions.Abstractions;

namespace SegmentStudio;

/// <summary>A run's per-frame tag predictions, encoded for <see cref="SegmentStudioAiRawResult"/>.</summary>
public sealed record AiRawResult(
    int FrameCount,
    int PredictionCount,
    string ModelsJson,
    string PayloadJson);

/// <summary>
/// Encodes every tag prediction a run's frames carried, before the review floor
/// and before consecutive frames are merged into spans, so they can later be
/// compared with what a reviewer published.
///
/// Schema version 1 payload:
/// <code>
/// {"tags": {"&lt;model category&gt;": {"&lt;tag&gt;": [[timeSeconds, confidence], ...]}}}
/// </code>
/// Pairs are in time order. Confidence is null when the model reported none. A
/// frame that reports the same (category, tag) more than once, for example once
/// per detected region, keeps its strongest prediction, as candidate building
/// does. Only predictions are stored: a sampled frame missing from a tag's list
/// means the server returned nothing for that tag there, which is below the
/// run's threshold.
/// </summary>
public static class AiRawResultBuilder
{
    public const int SchemaVersion = 1;

    public static AiRawResult Build(IReadOnlyList<AiTemporalSlice> frames, IReadOnlyList<AiModelDescriptor> models)
    {
        ArgumentNullException.ThrowIfNull(frames);
        ArgumentNullException.ThrowIfNull(models);

        var byCategory = new SortedDictionary<string, SortedDictionary<string, SortedDictionary<double, double?>>>(
            StringComparer.Ordinal);
        var frameCount = 0;
        foreach (var frame in frames)
        {
            // A frame without a time cannot be placed against a segment.
            if (frame is null || (frame.TimeSeconds ?? frame.StartSeconds) is not double time)
                continue;
            frameCount++;
            foreach (var prediction in frame.Analysis?.Tags ?? [])
            {
                if (prediction is null || string.IsNullOrWhiteSpace(prediction.Tag))
                    continue;
                var category = prediction.ModelKey ?? "";
                var tag = prediction.Tag.Trim().Normalize(NormalizationForm.FormC);
                if (!byCategory.TryGetValue(category, out var tags))
                    byCategory[category] = tags = new(StringComparer.Ordinal);
                if (!tags.TryGetValue(tag, out var points))
                    tags[tag] = points = [];
                points[time] = points.TryGetValue(time, out var previous)
                    ? Strongest(previous, prediction.Confidence)
                    : prediction.Confidence;
            }
        }

        var categories = new JsonObject();
        var predictionCount = 0;
        foreach (var (category, tags) in byCategory)
        {
            var tagObject = new JsonObject();
            foreach (var (tag, points) in tags)
            {
                var array = new JsonArray();
                foreach (var (time, confidence) in points)
                    array.Add(new JsonArray(JsonValue.Create(time), confidence is double value ? JsonValue.Create(value) : null));
                predictionCount += points.Count;
                tagObject[tag] = array;
            }
            categories[category] = tagObject;
        }

        var modelArray = new JsonArray();
        foreach (var model in models.Where(model => model is not null))
        {
            modelArray.Add(new JsonObject
            {
                ["configName"] = model.ConfigName,
                ["name"] = model.Name,
                ["version"] = model.Version,
                ["type"] = model.Type,
                ["categories"] = new JsonArray([.. (model.Categories ?? []).Select(category => JsonValue.Create(category))]),
            });
        }

        return new AiRawResult(
            frameCount,
            predictionCount,
            modelArray.ToJsonString(),
            new JsonObject { ["tags"] = categories }.ToJsonString());
    }

    private static double? Strongest(double? previous, double? candidate)
        => (previous, candidate) switch
        {
            (null, var value) => value,
            (var value, null) => value,
            var (left, right) => Math.Max(left!.Value, right!.Value),
        };
}
