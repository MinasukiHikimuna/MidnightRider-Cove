namespace MidnightRider.Cove.DiscoveryWidgets;

public sealed record PerformerConnectionPerson(int Id, string Name, string? ImageUrl, int VideoCount);

public sealed record PerformerConnectionVideo(int Id, string Title, string? Date, string? ImageUrl);

public sealed record PerformerConnectionAppearance(PerformerConnectionPerson Performer, PerformerConnectionVideo Video);

public sealed record PerformerConnectionStep(
    PerformerConnectionPerson From,
    PerformerConnectionVideo Video,
    PerformerConnectionPerson To);

public sealed record PerformerConnectionPath(
    PerformerConnectionPerson Start,
    PerformerConnectionPerson End,
    IReadOnlyList<PerformerConnectionStep> Steps,
    bool IsRandom)
{
    public int Degrees => Steps.Count;
}

public sealed record PerformerConnectionSearchResponse(
    PerformerConnectionPath? Chain,
    string? EmptyReason,
    int MaxDegrees,
    int PerformerCount,
    int VideoCount);

public sealed class PerformerConnectionGraph
{
    private readonly Dictionary<int, PerformerConnectionPerson> _performers = [];
    private readonly Dictionary<int, PerformerConnectionVideo> _videos = [];
    private readonly Dictionary<int, int[]> _videoIdsByPerformer;
    private readonly Dictionary<int, int[]> _performerIdsByVideo;

    public PerformerConnectionGraph(IEnumerable<PerformerConnectionAppearance> appearances)
    {
        var videoIdsByPerformer = new Dictionary<int, HashSet<int>>();
        var performerIdsByVideo = new Dictionary<int, HashSet<int>>();

        foreach (var appearance in appearances)
        {
            if (appearance.Performer.Id <= 0 || appearance.Video.Id <= 0)
                continue;

            _performers.TryAdd(appearance.Performer.Id, appearance.Performer);
            _videos.TryAdd(appearance.Video.Id, appearance.Video);
            GetOrAdd(videoIdsByPerformer, appearance.Performer.Id).Add(appearance.Video.Id);
            GetOrAdd(performerIdsByVideo, appearance.Video.Id).Add(appearance.Performer.Id);
        }

        _videoIdsByPerformer = videoIdsByPerformer.ToDictionary(
            pair => pair.Key,
            pair => pair.Value.Order().ToArray());
        _performerIdsByVideo = performerIdsByVideo.ToDictionary(
            pair => pair.Key,
            pair => pair.Value.Order().ToArray());

        foreach (var performerId in _performers.Keys.ToArray())
        {
            var visibleVideoCount = _videoIdsByPerformer.GetValueOrDefault(performerId)?.Length ?? 0;
            _performers[performerId] = _performers[performerId] with { VideoCount = visibleVideoCount };
        }
    }

    public int PerformerCount => _performers.Count;
    public int VideoCount => _performerIdsByVideo.Count(pair => pair.Value.Length > 1);
    public bool ContainsPerformer(int performerId) => _performers.ContainsKey(performerId);

    public PerformerConnectionPath? FindShortestPath(int startPerformerId, int endPerformerId, int maxDegrees)
    {
        if (maxDegrees < 1 || !_performers.ContainsKey(startPerformerId) || !_performers.ContainsKey(endPerformerId))
            return null;

        if (startPerformerId == endPerformerId)
        {
            var performer = _performers[startPerformerId];
            return new(performer, performer, [], IsRandom: false);
        }

        var traversal = Traverse(startPerformerId, maxDegrees, endPerformerId);
        return traversal.Predecessors.ContainsKey(endPerformerId)
            ? BuildPath(startPerformerId, endPerformerId, traversal.Predecessors, isRandom: false)
            : null;
    }

    public PerformerConnectionPath? FindRandomPath(int seed, int maxDegrees)
    {
        if (maxDegrees < 1)
            return null;

        var connectedPerformers = _performers.Keys
            .Where(HasNeighbor)
            .Order()
            .ToArray();
        if (connectedPerformers.Length == 0)
            return null;

        var startPerformerId = connectedPerformers[SeededIndex(seed, connectedPerformers.Length, 0x9e3779b9u)];
        var traversal = Traverse(startPerformerId, maxDegrees, targetPerformerId: null);
        if (traversal.Depths.Count <= 1)
            return null;

        var deepestDegree = traversal.Depths.Values.Max();
        var targets = traversal.Depths
            .Where(pair => pair.Value == deepestDegree)
            .Select(pair => pair.Key)
            .Order()
            .ToArray();
        var endPerformerId = targets[SeededIndex(seed, targets.Length, 0x85ebca6bu)];
        return BuildPath(startPerformerId, endPerformerId, traversal.Predecessors, isRandom: true);
    }

    private Traversal Traverse(int startPerformerId, int maxDegrees, int? targetPerformerId)
    {
        var queue = new Queue<int>();
        var depths = new Dictionary<int, int> { [startPerformerId] = 0 };
        var predecessors = new Dictionary<int, Predecessor>();
        var expandedVideoIds = new HashSet<int>();
        queue.Enqueue(startPerformerId);

        while (queue.TryDequeue(out var performerId))
        {
            var depth = depths[performerId];
            if (depth >= maxDegrees || !_videoIdsByPerformer.TryGetValue(performerId, out var videoIds))
                continue;

            foreach (var videoId in videoIds)
            {
                if (!expandedVideoIds.Add(videoId)
                    || !_performerIdsByVideo.TryGetValue(videoId, out var neighboringPerformerIds))
                    continue;

                foreach (var neighborId in neighboringPerformerIds)
                {
                    if (neighborId == performerId || depths.ContainsKey(neighborId))
                        continue;

                    depths[neighborId] = depth + 1;
                    predecessors[neighborId] = new(performerId, videoId);
                    if (neighborId == targetPerformerId)
                        return new(depths, predecessors);
                    queue.Enqueue(neighborId);
                }
            }
        }

        return new(depths, predecessors);
    }

    private PerformerConnectionPath BuildPath(
        int startPerformerId,
        int endPerformerId,
        IReadOnlyDictionary<int, Predecessor> predecessors,
        bool isRandom)
    {
        var steps = new List<PerformerConnectionStep>();
        var currentId = endPerformerId;
        while (currentId != startPerformerId)
        {
            var predecessor = predecessors[currentId];
            steps.Add(new(
                _performers[predecessor.PerformerId],
                _videos[predecessor.VideoId],
                _performers[currentId]));
            currentId = predecessor.PerformerId;
        }

        steps.Reverse();
        return new(_performers[startPerformerId], _performers[endPerformerId], steps, isRandom);
    }

    private bool HasNeighbor(int performerId)
    {
        if (!_videoIdsByPerformer.TryGetValue(performerId, out var videoIds))
            return false;

        return videoIds.Any(videoId =>
            _performerIdsByVideo.TryGetValue(videoId, out var performerIds)
            && performerIds.Any(candidateId => candidateId != performerId));
    }

    private static HashSet<int> GetOrAdd(Dictionary<int, HashSet<int>> values, int key)
    {
        if (values.TryGetValue(key, out var existing))
            return existing;

        var created = new HashSet<int>();
        values[key] = created;
        return created;
    }

    private static int SeededIndex(int seed, int count, uint salt)
    {
        var state = unchecked((uint)seed) ^ salt;
        state = unchecked(state * 1664525u + 1013904223u);
        state ^= state >> 16;
        return (int)(state % (uint)count);
    }

    private sealed record Predecessor(int PerformerId, int VideoId);
    private sealed record Traversal(
        IReadOnlyDictionary<int, int> Depths,
        IReadOnlyDictionary<int, Predecessor> Predecessors);
}
