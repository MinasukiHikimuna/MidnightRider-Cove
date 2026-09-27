namespace MidnightRider.Cove.SixDegrees;

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
    IReadOnlyList<PerformerConnectionStep> Steps)
{
    public int Degrees => Steps.Count;
}

public sealed record PerformerConnectionSearchResponse(
    PerformerConnectionPath? Chain,
    string? EmptyReason,
    int MaxDegrees,
    int PerformerCount,
    int VideoCount)
{
    /// <summary>The preset that chose the pair, or null for a pair the viewer chose.</summary>
    public string? Preset { get; init; }
    public bool DuosOnly { get; init; }
    /// <summary>Across the years: the year of the start performer's first video.</summary>
    public int? StartFirstYear { get; init; }
    /// <summary>Across the years: the year of the end performer's latest video.</summary>
    public int? EndLastYear { get; init; }
    /// <summary>Your Johnny Sins: the hub's average distance to every performer it reaches.</summary>
    public double? HubAverageDegrees { get; init; }
}

public sealed record YearSpanPath(PerformerConnectionPath Path, int StartFirstYear, int EndLastYear);

public sealed record ConnectionHub(int PerformerId, double AverageDegrees);

public sealed class PerformerConnectionGraph
{
    private readonly Dictionary<int, PerformerConnectionPerson> _performers = [];
    private readonly Dictionary<int, PerformerConnectionVideo> _videos = [];
    private const int HubCandidateCount = 25;
    private readonly Dictionary<int, int[]> _videoIdsByPerformer;
    private readonly Dictionary<int, int> _componentByPerformer = [];
    private readonly int[] _largestComponent;
    private readonly Dictionary<int, int[]> _performerIdsByVideo;
    private readonly Dictionary<int, string> _firstVideoDates = [];
    private readonly Dictionary<int, string> _lastVideoDates = [];

    /// <param name="appearances">Every visible performer appearance.</param>
    /// <param name="duosOnly">Link performers only through videos with exactly two performers, so a
    /// large cast cannot shortcut a chain. Performers keep their full visible video counts and dates.</param>
    public PerformerConnectionGraph(IEnumerable<PerformerConnectionAppearance> appearances, bool duosOnly = false)
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
            RecordDate(appearance.Performer.Id, appearance.Video.Date);
        }

        var visibleVideoCounts = videoIdsByPerformer.ToDictionary(pair => pair.Key, pair => pair.Value.Count);
        if (duosOnly)
        {
            foreach (var (videoId, performerIds) in performerIdsByVideo.Where(pair => pair.Value.Count != 2).ToArray())
            {
                performerIdsByVideo.Remove(videoId);
                foreach (var performerId in performerIds)
                    videoIdsByPerformer[performerId].Remove(videoId);
            }
        }

        _videoIdsByPerformer = videoIdsByPerformer.ToDictionary(
            pair => pair.Key,
            pair => pair.Value.Order().ToArray());
        _performerIdsByVideo = performerIdsByVideo.ToDictionary(
            pair => pair.Key,
            pair => pair.Value.Order().ToArray());

        foreach (var performerId in _performers.Keys.ToArray())
        {
            _performers[performerId] = _performers[performerId] with { VideoCount = visibleVideoCounts.GetValueOrDefault(performerId) };
        }

        _largestComponent = LabelComponents();
        Signature = ComputeSignature();
    }

    /// <summary>
    /// Identifies the linked graph: equal for two graphs with the same performers joined by the same videos,
    /// so a value derived only from the graph, such as its hub, can be reused for it.
    /// </summary>
    public long Signature { get; }

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
            return new(performer, performer, []);
        }

        var traversal = Traverse(startPerformerId, maxDegrees, endPerformerId);
        return traversal.Predecessors.ContainsKey(endPerformerId)
            ? BuildPath(startPerformerId, endPerformerId, traversal.Predecessors)
            : null;
    }

    public PerformerConnectionPath? FindRandomPath(int seed, int maxDegrees)
    {
        if (maxDegrees < 1)
            return null;

        var connectedPerformers = ConnectedPerformers();
        if (connectedPerformers.Length == 0)
            return null;

        var startPerformerId = connectedPerformers[SeededIndex(seed, connectedPerformers.Length, 0x9e3779b9u)];
        var traversal = Traverse(startPerformerId, maxDegrees, targetPerformerId: null);

        // Any performer the start can reach is an equally likely partner, so the pair's distance
        // follows the library's own shape instead of always stretching to the degree limit.
        var targets = traversal.Depths.Keys
            .Where(performerId => performerId != startPerformerId)
            .Order()
            .ToArray();
        var endPerformerId = targets[SeededIndex(seed, targets.Length, 0x85ebca6bu)];
        return BuildPath(startPerformerId, endPerformerId, traversal.Predecessors);
    }

    /// <summary>
    /// Approximates the longest chain by searching twice: from a random start to one of the performers
    /// furthest from it, then from there to one of the performers furthest from that. Each seed starts
    /// somewhere else, so repeated shuffles visit different far-apart pairs.
    /// </summary>
    public PerformerConnectionPath? FindLongestPath(int seed, int maxDegrees)
    {
        if (maxDegrees < 1)
            return null;

        // The largest group of linked performers holds the long chains; small isolated groups would give one-link results.
        if (_largestComponent.Length < 2)
            return null;

        var firstId = _largestComponent[SeededIndex(seed, _largestComponent.Length, 0x9e3779b9u)];
        var startId = PickDeepest(Traverse(firstId, maxDegrees, targetPerformerId: null), seed, 0xc2b2ae35u);
        var traversal = Traverse(startId, maxDegrees, targetPerformerId: null);
        var endId = PickDeepest(traversal, seed, 0x27d4eb2fu);
        return endId == startId ? null : BuildPath(startId, endId, traversal.Predecessors);
    }

    /// <summary>
    /// Connects a performer from the oldest tenth of the linked, dated performers, by first video, to one from the
    /// newest tenth, by latest video. One search outward from the whole newest tenth finds which of the oldest can
    /// reach it within the limit, so a chain is found whenever one exists.
    /// </summary>
    public YearSpanPath? FindPathAcrossYears(int seed, int maxDegrees, CancellationToken cancellationToken = default)
    {
        if (maxDegrees < 1)
            return null;

        var dated = ConnectedPerformers().Where(_firstVideoDates.ContainsKey).ToArray();
        if (dated.Length < 2)
            return null;

        var tenth = Math.Max(1, (dated.Length + 9) / 10);
        var oldest = dated
            .OrderBy(id => _firstVideoDates[id], StringComparer.Ordinal)
            .ThenBy(id => id)
            .Take(tenth)
            .ToArray();
        var newest = dated
            .OrderByDescending(id => _lastVideoDates[id], StringComparer.Ordinal)
            .ThenBy(id => id)
            .Take(tenth)
            .ToHashSet();

        var reachesNewest = Traverse(newest, maxDegrees, targetPerformerId: null).Depths;
        // A start that is itself among the newest needs another newest performer, so try those last.
        var starts = SeededShuffle(oldest.Where(reachesNewest.ContainsKey).ToArray(), seed)
            .OrderBy(newest.Contains);
        foreach (var startId in starts)
        {
            cancellationToken.ThrowIfCancellationRequested();
            var traversal = Traverse(startId, maxDegrees, targetPerformerId: null);
            var ends = traversal.Depths.Keys
                .Where(id => id != startId && newest.Contains(id))
                .Order()
                .ToArray();
            if (ends.Length == 0)
                continue;

            var endId = ends[SeededIndex(seed, ends.Length, 0x85ebca6bu)];
            return new(
                BuildPath(startId, endId, traversal.Predecessors),
                Year(_firstVideoDates[startId]),
                Year(_lastVideoDates[endId]));
        }

        return null;
    }

    /// <summary>
    /// The library's own Johnny Sins: of the performers in the largest linked group with the most co-appearances,
    /// the one with the shortest average distance to everyone else in that group.
    /// </summary>
    public ConnectionHub? FindHub(CancellationToken cancellationToken = default)
    {
        if (_largestComponent.Length < 2)
            return null;

        var candidates = _largestComponent
            .OrderByDescending(CoAppearanceCount)
            .ThenBy(id => id)
            .Take(HubCandidateCount)
            .ToArray();

        var bestId = 0;
        var bestAverage = double.MaxValue;
        foreach (var candidateId in candidates)
        {
            cancellationToken.ThrowIfCancellationRequested();
            var depths = Traverse(candidateId, int.MaxValue, targetPerformerId: null).Depths;
            var average = depths.Values.Sum() / (double)(depths.Count - 1);
            if (average < bestAverage)
            {
                bestId = candidateId;
                bestAverage = average;
            }
        }

        return new(bestId, Math.Round(bestAverage, 1, MidpointRounding.AwayFromZero));
    }

    /// <summary>A seeded random performer's shortest path to the hub, like the original game.</summary>
    public PerformerConnectionPath? FindPathToHub(int seed, int maxDegrees, int hubPerformerId)
    {
        if (maxDegrees < 1 || !_performers.ContainsKey(hubPerformerId))
            return null;

        var starts = Traverse(hubPerformerId, maxDegrees, targetPerformerId: null).Depths.Keys
            .Where(id => id != hubPerformerId)
            .Order()
            .ToArray();
        if (starts.Length == 0)
            return null;

        var startId = starts[SeededIndex(seed, starts.Length, 0x9e3779b9u)];
        return FindShortestPath(startId, hubPerformerId, maxDegrees);
    }

    private int[] ConnectedPerformers()
        => _performers.Keys.Where(HasNeighbor).Order().ToArray();

    // Labels each linked performer with its group and returns the largest group's members, smallest ids first on ties.
    private int[] LabelComponents()
    {
        var component = 0;
        foreach (var performerId in ConnectedPerformers())
        {
            if (_componentByPerformer.ContainsKey(performerId))
                continue;
            foreach (var member in Traverse(performerId, int.MaxValue, targetPerformerId: null).Depths.Keys)
                _componentByPerformer[member] = component;
            component++;
        }

        return _componentByPerformer
            .GroupBy(pair => pair.Value)
            .Select(group => group.Select(pair => pair.Key).Order().ToArray())
            .OrderByDescending(members => members.Length)
            .ThenBy(members => members[0])
            .FirstOrDefault() ?? [];
    }

    private long ComputeSignature()
    {
        unchecked
        {
            var signature = (long)_performerIdsByVideo.Count * 1_000_003;
            foreach (var (videoId, performerIds) in _performerIdsByVideo)
            {
                foreach (var performerId in performerIds)
                {
                    var edge = ((ulong)(uint)videoId << 32) | (uint)performerId;
                    edge ^= edge >> 33;
                    edge *= 0xff51afd7ed558ccdUL;
                    edge ^= edge >> 33;
                    signature += (long)edge;
                }
            }
            return signature;
        }
    }

    private int PickDeepest(Traversal traversal, int seed, uint salt)
    {
        var deepest = traversal.Depths.Values.Max();
        var candidates = traversal.Depths
            .Where(pair => pair.Value == deepest)
            .Select(pair => pair.Key)
            .Order()
            .ToArray();
        return candidates[SeededIndex(seed, candidates.Length, salt)];
    }

    private int CoAppearanceCount(int performerId)
        => _videoIdsByPerformer.TryGetValue(performerId, out var videoIds)
            ? videoIds.Sum(videoId => _performerIdsByVideo.TryGetValue(videoId, out var cast) ? cast.Length - 1 : 0)
            : 0;

    private void RecordDate(int performerId, string? date)
    {
        if (date is not { Length: >= 4 } || !char.IsAsciiDigit(date[0]))
            return;
        if (!_firstVideoDates.TryGetValue(performerId, out var first) || string.CompareOrdinal(date, first) < 0)
            _firstVideoDates[performerId] = date;
        if (!_lastVideoDates.TryGetValue(performerId, out var last) || string.CompareOrdinal(date, last) > 0)
            _lastVideoDates[performerId] = date;
    }

    private static int Year(string date) => int.Parse(date.AsSpan(0, 4));

    private static IEnumerable<int> SeededShuffle(int[] items, int seed)
    {
        var shuffled = items.ToArray();
        var state = unchecked((uint)seed) ^ 0x165667b1u;
        for (var index = shuffled.Length - 1; index > 0; index--)
        {
            state = unchecked(state * 1664525u + 1013904223u);
            var swap = (int)((state >> 8) % (uint)(index + 1));
            (shuffled[index], shuffled[swap]) = (shuffled[swap], shuffled[index]);
        }
        return shuffled;
    }

    private Traversal Traverse(int startPerformerId, int maxDegrees, int? targetPerformerId)
        => Traverse([startPerformerId], maxDegrees, targetPerformerId);

    private Traversal Traverse(IEnumerable<int> startPerformerIds, int maxDegrees, int? targetPerformerId)
    {
        var queue = new Queue<int>();
        var depths = new Dictionary<int, int>();
        var predecessors = new Dictionary<int, Predecessor>();
        var expandedVideoIds = new HashSet<int>();
        foreach (var startPerformerId in startPerformerIds)
        {
            if (depths.TryAdd(startPerformerId, 0))
                queue.Enqueue(startPerformerId);
        }

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
        IReadOnlyDictionary<int, Predecessor> predecessors)
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
        return new(_performers[startPerformerId], _performers[endPerformerId], steps);
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
