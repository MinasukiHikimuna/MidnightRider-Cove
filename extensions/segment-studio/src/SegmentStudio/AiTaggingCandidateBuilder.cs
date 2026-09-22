using System.Security.Cryptography;
using System.Text;
using AI.Extensions.Abstractions;

namespace SegmentStudio;

/// <summary>
/// One reviewable tag span, aggregated from the per-frame predictions a native
/// AI run produced.
/// </summary>
public sealed record AiTaggingCandidate(
    string CandidateKey,
    string Kind,
    string TagName,
    string Title,
    double StartSeconds,
    double EndSeconds,
    double? Confidence,
    string ModelKey,
    int ObservationCount);

/// <summary>
/// Turns the per-frame tag predictions of an AI run into the contiguous spans
/// Segment Studio reviews.
///
/// The AI server scores individual frames; a reviewer works with spans. Runs of
/// consecutive frames carrying the same (model, tag) therefore collapse into one
/// candidate, and a span is extended by one frame interval past its last
/// observation so that a tag seen on a single frame still covers the interval it
/// stands for rather than becoming zero-length.
///
/// This is a behaviour-preserving port of the aggregation the external analysis
/// service used to perform, including the candidate key digest, so keys stay
/// comparable across the move to native analysis.
/// </summary>
public static class AiTaggingCandidateBuilder
{
    /// <summary>Fallback span when neither the run nor the request reported one.</summary>
    public const double FallbackFrameIntervalSeconds = 0.5;

    public static IReadOnlyList<AiTaggingCandidate> Build(
        IReadOnlyList<AiTemporalSlice> frames,
        string sourceFingerprint,
        double durationSeconds,
        double frameIntervalSeconds,
        double confidenceFloor)
    {
        ArgumentNullException.ThrowIfNull(frames);
        ArgumentNullException.ThrowIfNull(sourceFingerprint);

        var span = frameIntervalSeconds > 0 ? frameIntervalSeconds : FallbackFrameIntervalSeconds;

        // Frames are not guaranteed to arrive in time order, and the walk below
        // depends on it: a run is closed the first time a frame omits its tag.
        var ordered = frames
            .Where(frame => frame is not null)
            .OrderBy(frame => frame.TimeSeconds ?? 0)
            .ThenBy(frame => frame.Index ?? 0)
            .ToArray();

        var active = new Dictionary<AiTaggingKey, ActiveRun>();
        var candidates = new List<AiTaggingCandidate>();

        foreach (var frame in ordered)
        {
            var time = frame.TimeSeconds ?? 0;
            var current = CollectFrameTags(frame, confidenceFloor);

            // Close every run this frame did not renew before extending the rest,
            // so a tag that stops and later resumes yields two candidates.
            foreach (var key in active.Keys.Where(key => !current.ContainsKey(key)).ToArray())
            {
                candidates.Add(Finish(key, active[key], sourceFingerprint, durationSeconds, span));
                active.Remove(key);
            }

            foreach (var (key, confidence) in current)
            {
                if (!active.TryGetValue(key, out var run))
                {
                    active[key] = new ActiveRun(time, time, confidence, 1);
                    continue;
                }
                active[key] = run with
                {
                    Last = time,
                    ObservationCount = run.ObservationCount + 1,
                    Confidence = Combine(run.Confidence, confidence),
                };
            }
        }

        foreach (var (key, run) in active)
            candidates.Add(Finish(key, run, sourceFingerprint, durationSeconds, span));

        return candidates
            .Where(candidate => candidate.EndSeconds > candidate.StartSeconds)
            .OrderBy(candidate => candidate.StartSeconds)
            .ThenBy(candidate => candidate.EndSeconds)
            .ThenBy(candidate => candidate.TagName, StringComparer.Ordinal)
            .ThenBy(candidate => candidate.ModelKey, StringComparer.Ordinal)
            .ToArray();
    }

    /// <summary>
    /// The strongest prediction per (model, tag) on one frame. A model may report
    /// the same tag more than once for a frame, for example once per detected
    /// region, and the reviewer only needs the best of them.
    /// </summary>
    private static Dictionary<AiTaggingKey, double?> CollectFrameTags(
        AiTemporalSlice frame, double confidenceFloor)
    {
        var current = new Dictionary<AiTaggingKey, double?>();
        foreach (var prediction in frame.Analysis?.Tags ?? [])
        {
            if (prediction is null || string.IsNullOrWhiteSpace(prediction.Tag))
                continue;
            // An absent confidence is not a weak one: a model that does not report
            // confidence must not be filtered out by the floor.
            if (prediction.Confidence is double confidence && confidence < confidenceFloor)
                continue;
            var key = new AiTaggingKey(prediction.ModelKey ?? "", NormalizeTag(prediction.Tag));
            current[key] = current.TryGetValue(key, out var previous)
                ? Combine(previous, prediction.Confidence)
                : prediction.Confidence;
        }
        return current;
    }

    /// <summary>
    /// Keeps the strongest confidence seen for a run. An unscored observation
    /// never displaces a scored one, and never invents a score of its own.
    /// </summary>
    private static double? Combine(double? previous, double? candidate)
        => (previous, candidate) switch
        {
            (null, var value) => value,
            (var value, null) => value,
            var (left, right) => Math.Max(left!.Value, right!.Value),
        };

    private static AiTaggingCandidate Finish(
        AiTaggingKey key, ActiveRun run, string sourceFingerprint, double duration, double span)
    {
        var start = Math.Clamp(run.Start, 0, duration);
        // The last frame stands for the interval that follows it, so the span runs
        // to one interval past the final observation rather than ending on it.
        var end = Math.Clamp(run.Last + span, 0, duration);
        var startMs = (long)Math.Round(start * 1000, MidpointRounding.ToEven);
        var endMs = (long)Math.Round(end * 1000, MidpointRounding.ToEven);
        return new AiTaggingCandidate(
            CandidateKey: CandidateKeyFor(sourceFingerprint, key, startMs, endMs),
            Kind: "tag",
            TagName: key.Tag,
            Title: key.Tag,
            StartSeconds: startMs / 1000d,
            EndSeconds: endMs / 1000d,
            Confidence: run.Confidence,
            ModelKey: key.ModelKey,
            ObservationCount: run.ObservationCount);
    }

    /// <summary>
    /// Content-addressed so the same span from the same source re-derives the same
    /// key, which is what lets a re-run reconcile with what a reviewer already saw.
    /// The leading "1" is the digest's own version.
    /// </summary>
    private static string CandidateKeyFor(
        string sourceFingerprint, AiTaggingKey key, long startMs, long endMs)
    {
        var payload = string.Join(
            '\u001f', "1", sourceFingerprint, key.ModelKey, key.Tag, startMs, endMs);
        return $"sha256:{Convert.ToHexStringLower(SHA256.HashData(Encoding.UTF8.GetBytes(payload)))}";
    }

    private static string NormalizeTag(string value) => value.Trim().Normalize(NormalizationForm.FormC);

    private readonly record struct AiTaggingKey(string ModelKey, string Tag);

    private readonly record struct ActiveRun(double Start, double Last, double? Confidence, int ObservationCount);
}
