using System.Diagnostics;
using System.Text.Json;
using System.Text.Json.Nodes;
using Microsoft.Data.Sqlite;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Logging.Abstractions;

namespace StashFilterImporter;

internal sealed record MarkerTagUsage(
    bool IsPrimary,
    bool IsSecondary,
    bool HasPrimaryInHierarchy = false,
    bool HasSecondaryInHierarchy = false);

internal sealed class StashFilterAnalyzer(
    IPerformerReferenceResolver? performerResolver = null,
    ITagReferenceResolver? tagResolver = null,
    IStudioReferenceResolver? studioResolver = null,
    ILogger<StashFilterAnalyzer>? logger = null)
{
    private readonly ILogger<StashFilterAnalyzer> logger = logger ?? NullLogger<StashFilterAnalyzer>.Instance;
    private static readonly IReadOnlyDictionary<string, (string Target, bool Adapted)> Criteria =
        new Dictionary<string, (string, bool)>(StringComparer.Ordinal)
        {
            ["title"] = ("titleCriterion", true),
            ["rating100"] = ("ratingCriterion", false),
            ["o_counter"] = ("likeCounterCriterion", false),
            ["play_count"] = ("playCountCriterion", false),
            ["file_count"] = ("fileCountCriterion", false),
            ["performer_age"] = ("performerAgeCriterion", false),
            ["performer_favorite"] = ("performerFavoriteCriterion", false),
            ["video_codec"] = ("videoCodecCriterion", true),
        };

    private static readonly HashSet<string> SharedSorts =
    [
        "updated_at", "created_at", "title", "date", "rating", "play_count", "duration",
        "file_count", "bitrate", "filesize", "framerate", "path", "video_codec", "random"
    ];
    private static readonly HashSet<string> ImageSorts =
    [
        "updated_at", "created_at", "title", "date", "rating", "path", "random"
    ];
    private static readonly HashSet<string> GallerySorts =
    [
        "updated_at", "created_at", "date", "title", "rating", "performer_count", "random"
    ];
    private static readonly HashSet<string> PerformerSorts =
    [
        "name", "created_at"
    ];
    private static readonly HashSet<string> TagSorts =
    [
        "name", "created_at", "updated_at"
    ];
    private static readonly HashSet<string> StudioSorts =
    [
        "name", "created_at", "updated_at"
    ];
    private static readonly IReadOnlyDictionary<string, string> PerformerGenders =
        new Dictionary<string, string>(StringComparer.OrdinalIgnoreCase)
        {
            ["MALE"] = "Male",
            ["FEMALE"] = "Female",
            ["TRANSGENDER_MALE"] = "TransgenderMale",
            ["TRANSGENDER_FEMALE"] = "TransgenderFemale",
            ["INTERSEX"] = "Intersex",
            ["NON_BINARY"] = "NonBinary",
            ["Transgender Male"] = "TransgenderMale",
            ["Transgender Female"] = "TransgenderFemale",
            ["Non-Binary"] = "NonBinary",
            ["TransgenderMale"] = "TransgenderMale",
            ["TransgenderFemale"] = "TransgenderFemale",
            ["NonBinary"] = "NonBinary",
        };
    private static readonly HashSet<string> NumericModifiers = new(StringComparer.OrdinalIgnoreCase)
    {
        "EQUALS", "NOT_EQUALS", "GREATER_THAN", "LESS_THAN", "IS_NULL", "NOT_NULL", "BETWEEN", "NOT_BETWEEN"
    };
    private static readonly HashSet<string> StringModifiers = new(StringComparer.OrdinalIgnoreCase)
    {
        "EQUALS", "NOT_EQUALS", "INCLUDES", "EXCLUDES", "IS_NULL", "NOT_NULL", "MATCHES_REGEX", "NOT_MATCHES_REGEX"
    };
    private static readonly IReadOnlyDictionary<string, int> ResolutionBuckets =
        new Dictionary<string, int>(StringComparer.OrdinalIgnoreCase)
        {
            ["144p"] = 144,
            ["VERY_LOW"] = 144,
            ["240p"] = 240,
            ["LOW"] = 240,
            ["360p"] = 360,
            ["R360P"] = 360,
            ["480p"] = 480,
            ["STANDARD"] = 480,
            ["540p"] = 540,
            ["WEB_HD"] = 540,
            ["720p"] = 720,
            ["STANDARD_HD"] = 720,
            ["1080p"] = 1080,
            ["FULL_HD"] = 1080,
            ["1440p"] = 1440,
            ["QUAD_HD"] = 1440,
            ["4K"] = 2160,
            ["FOUR_K"] = 2160,
            ["5K"] = 2880,
            ["FIVE_K"] = 2880,
            ["6K"] = 3384,
            ["SIX_K"] = 3384,
            ["7K"] = 4032,
            ["SEVEN_K"] = 4032,
            ["8K"] = 4320,
            ["EIGHT_K"] = 4320,
            ["HUGE"] = 9999,
        };
    private static readonly IReadOnlyDictionary<int, string> DisplayModes =
        new Dictionary<int, string>
        {
            [0] = "grid",
            [1] = "list",
            [2] = "wall",
            [3] = "tagger",
        };
    private static readonly IReadOnlyDictionary<int, double> ZoomLevels =
        new Dictionary<int, double>
        {
            [0] = 0,
            [1] = 2.75,
            [2] = 5.25,
            [3] = 8,
        };
    private static readonly IReadOnlySet<string> AllStashDisplayModes =
        new HashSet<string>(["grid", "list", "wall", "tagger"], StringComparer.Ordinal);
    private static readonly IReadOnlySet<string> DisplayModesWithoutWall =
        new HashSet<string>(["grid", "list", "tagger"], StringComparer.Ordinal);
    private static readonly IReadOnlySet<string> GridAndListDisplayModes =
        new HashSet<string>(["grid", "list"], StringComparer.Ordinal);

    internal async Task<AnalysisResponse> AnalyzeAsync(string path, CancellationToken ct)
    {
        if (string.IsNullOrWhiteSpace(path))
        {
            StashFilterImporterLog.MissingPath(logger);
            throw new AnalysisException("A Stash database path is required.");
        }
        var total = Stopwatch.StartNew();
        StashFilterImporterLog.Started(logger);

        try
        {
            StashFilterImporterLog.PhaseStarted(logger, "FileMetadata");
            var metadata = Stopwatch.StartNew();
            if (!File.Exists(path))
            {
                StashFilterImporterLog.PhaseCompleted(logger, "FileMetadata", metadata.ElapsedMilliseconds, 0);
                StashFilterImporterLog.MissingFile(logger);
                throw new AnalysisException("The supplied Stash database file does not exist.");
            }
            StashFilterImporterLog.PhaseCompleted(logger, "FileMetadata", metadata.ElapsedMilliseconds, 1);
            if (logger.IsEnabled(LogLevel.Debug))
            {
                try
                {
                    StashFilterImporterLog.DatabaseMetadata(logger, new FileInfo(path).Length);
                }
                catch (UnauthorizedAccessException) { }
                catch (IOException) { }
            }
        }
        catch (AnalysisException)
        {
            throw;
        }
        catch (UnauthorizedAccessException)
        {
            StashFilterImporterLog.Unauthorized(logger);
            throw new AnalysisException("The Cove process cannot read the supplied database file.");
        }
        catch (IOException)
        {
            StashFilterImporterLog.Io(logger);
            throw new AnalysisException("The supplied database file could not be read.");
        }
        catch (Exception exception)
        {
            StashFilterImporterLog.Unexpected(logger, exception.GetType().Name);
            throw;
        }

        var builder = new SqliteConnectionStringBuilder
        {
            DataSource = path,
            Mode = SqliteOpenMode.ReadOnly,
            Cache = SqliteCacheMode.Private,
            Pooling = false
        };

        try
        {
            await using var connection = new SqliteConnection(builder.ToString());
            await TimedAsync("ConnectionOpen", async () => await connection.OpenAsync(ct), 1);
            await ValidateSavedFiltersSchemaAsync(connection, ct);
            var sourceFilters = await TimedAsync(
                "SavedFilterRead", () => ReadSourceFiltersAsync(connection, ct), value => value.Count);
            var dependencies = Timed(
                "DependencyCollection", () => CollectDependencies(sourceFilters, ct),
                value => value.PerformerIds.Count + value.StudioIds.Count + value.TagIds.Count
                    + value.MarkerTagIds.Count);
            StashFilterImporterLog.Dependencies(
                logger, dependencies.PerformerIds.Count, dependencies.StudioIds.Count,
                dependencies.TagIds.Count, dependencies.TagNames.Count, dependencies.MarkerTagIds.Count,
                dependencies.RecursiveMarkerRootIds.Count);
            var performerReferences = await TimedAsync(
                "StashPerformerRead",
                () => ReadPerformerReferencesAsync(connection, dependencies.PerformerIds, ct),
                value => value.Count);
            var performerResolutions = performerResolver is null
                ? new Dictionary<int, PerformerResolution>()
                : await TimedAsync(
                    "CovePerformerResolution",
                    () => performerResolver.ResolveAsync(performerReferences, ct), value => value.Count);
            var stashTagNames = await TimedAsync(
                "StashTagRead", () => ReadStashTagNamesAsync(connection, dependencies.TagIds, ct),
                value => value.Count);
            var tagResolutions = tagResolver is null
                ? new Dictionary<string, TagResolution>(StringComparer.OrdinalIgnoreCase)
                : await TimedAsync(
                    "CoveTagResolution", () => tagResolver.ResolveAsync(dependencies.TagNames, ct),
                    value => value.Count);
            var markerTagUsages = await TimedAsync("StashMarkerRead", () => ReadMarkerTagUsagesAsync(
                connection, dependencies.MarkerTagIds, dependencies.RecursiveMarkerRootIds, ct), value => value.Count);
            var studioReferences = await TimedAsync(
                "StashStudioRead",
                () => ReadStudioReferencesAsync(connection, dependencies.StudioIds, ct),
                value => value.Count);
            var studioResolutions = studioResolver is null
                ? new Dictionary<int, StudioResolution>()
                : await TimedAsync(
                    "CoveStudioResolution",
                    () => studioResolver.ResolveAsync(studioReferences, ct), value => value.Count);
            var filters = Timed("Translation", () => ReadAsync(
                sourceFilters, performerResolutions, tagResolutions, stashTagNames, studioResolutions, markerTagUsages), value => value.Count);
            var response = Timed("Summarization", () => Summarize(filters), _ => filters.Count);
            StashFilterImporterLog.Completed(
                logger, total.ElapsedMilliseconds, response.Filters.Count, response.Summary.Direct,
                response.Summary.Adapted, response.Summary.Unsupported, response.Summary.Importable);
            return response;
        }
        catch (AnalysisException)
        {
            StashFilterImporterLog.Rejected(logger);
            throw;
        }
        catch (OperationCanceledException) when (ct.IsCancellationRequested)
        {
            StashFilterImporterLog.Canceled(logger, total.ElapsedMilliseconds);
            throw;
        }
        catch (SqliteException)
        {
            StashFilterImporterLog.Unreadable(logger);
            throw new AnalysisException("The supplied file is not a readable SQLite database.");
        }
        catch (UnauthorizedAccessException)
        {
            StashFilterImporterLog.Unauthorized(logger);
            throw new AnalysisException("The Cove process cannot read the supplied database file.");
        }
        catch (IOException)
        {
            StashFilterImporterLog.Io(logger);
            throw new AnalysisException("The supplied database file could not be read.");
        }
        catch (Exception exception)
        {
            StashFilterImporterLog.Unexpected(logger, exception.GetType().Name);
            throw;
        }
    }

    private async Task<T> TimedAsync<T>(string phase, Func<Task<T>> action, Func<T, int> count)
    {
        StashFilterImporterLog.PhaseStarted(logger, phase);
        var timer = Stopwatch.StartNew();
        var result = await action();
        StashFilterImporterLog.PhaseCompleted(logger, phase, timer.ElapsedMilliseconds, count(result));
        return result;
    }
    private async Task TimedAsync(string phase, Func<Task> action, int count)
    {
        StashFilterImporterLog.PhaseStarted(logger, phase);
        var timer = Stopwatch.StartNew();
        await action();
        StashFilterImporterLog.PhaseCompleted(logger, phase, timer.ElapsedMilliseconds, count);
    }
    private T Timed<T>(string phase, Func<T> action, Func<T, int> count)
    {
        StashFilterImporterLog.PhaseStarted(logger, phase);
        var timer = Stopwatch.StartNew();
        var result = action();
        StashFilterImporterLog.PhaseCompleted(logger, phase, timer.ElapsedMilliseconds, count(result));
        return result;
    }

    private async Task ValidateSavedFiltersSchemaAsync(SqliteConnection connection, CancellationToken ct)
    {
        var schema = Stopwatch.StartNew();
        StashFilterImporterLog.PhaseStarted(logger, "SavedFilterSchema");
        var columns = new HashSet<string>(StringComparer.OrdinalIgnoreCase);
        await using var command = connection.CreateCommand();
        command.CommandText = "PRAGMA table_info(saved_filters)";
        await using var reader = await command.ExecuteReaderAsync(ct);
        while (await reader.ReadAsync(ct)) columns.Add(reader.GetString(1));
        var required = new[] { "id", "name", "mode", "find_filter", "object_filter", "ui_options" };
        if (required.Any(column => !columns.Contains(column)))
            throw new AnalysisException("The saved_filters table is missing one or more required columns.");
        StashFilterImporterLog.PhaseCompleted(logger, "SavedFilterSchema", schema.ElapsedMilliseconds, columns.Count);
    }

    private static async Task<IReadOnlyDictionary<int, IReadOnlyList<PerformerReference>>> ReadPerformerReferencesAsync(
        SqliteConnection connection, IReadOnlySet<int> sourceIds, CancellationToken ct)
    {
        if (sourceIds.Count == 0) return new Dictionary<int, IReadOnlyList<PerformerReference>>();
        var tables = new HashSet<string>(StringComparer.OrdinalIgnoreCase);
        await using (var tableCommand = connection.CreateCommand())
        {
            tableCommand.CommandText = "SELECT name FROM sqlite_master WHERE type = 'table'";
            await using var tableReader = await tableCommand.ExecuteReaderAsync(ct);
            while (await tableReader.ReadAsync(ct)) tables.Add(tableReader.GetString(0));
        }
        if (!tables.Contains("performer_stash_ids"))
            return new Dictionary<int, IReadOnlyList<PerformerReference>>();

        var output = new Dictionary<int, List<PerformerReference>>();
        await using var command = connection.CreateCommand();
        command.CommandText = $"SELECT performer_id, endpoint, stash_id FROM performer_stash_ids WHERE performer_id IN ({AddIdSetParameter(command, "performerIds", sourceIds)})";
        await using var reader = await command.ExecuteReaderAsync(ct);
        while (await reader.ReadAsync(ct))
        {
            ct.ThrowIfCancellationRequested();
            var id = reader.GetInt32(0);
            if (!output.TryGetValue(id, out var references)) output[id] = references = [];
            references.Add(new(reader.GetString(1), reader.GetString(2)));
        }
        return output.ToDictionary(pair => pair.Key, pair => (IReadOnlyList<PerformerReference>)pair.Value);
    }

    private static async Task<IReadOnlyDictionary<int, IReadOnlyList<StudioReference>>> ReadStudioReferencesAsync(
        SqliteConnection connection, IReadOnlySet<int> sourceIds, CancellationToken ct)
    {
        if (sourceIds.Count == 0) return new Dictionary<int, IReadOnlyList<StudioReference>>();
        var tables = new HashSet<string>(StringComparer.OrdinalIgnoreCase);
        await using (var tableCommand = connection.CreateCommand())
        {
            tableCommand.CommandText = "SELECT name FROM sqlite_master WHERE type = 'table'";
            await using var tableReader = await tableCommand.ExecuteReaderAsync(ct);
            while (await tableReader.ReadAsync(ct)) tables.Add(tableReader.GetString(0));
        }
        if (!tables.Contains("studio_stash_ids"))
            return new Dictionary<int, IReadOnlyList<StudioReference>>();

        var output = new Dictionary<int, List<StudioReference>>();
        await using var command = connection.CreateCommand();
        command.CommandText = $"SELECT studio_id, endpoint, stash_id FROM studio_stash_ids WHERE studio_id IN ({AddIdSetParameter(command, "studioIds", sourceIds)})";
        await using var reader = await command.ExecuteReaderAsync(ct);
        while (await reader.ReadAsync(ct))
        {
            ct.ThrowIfCancellationRequested();
            var id = reader.GetInt32(0);
            if (!output.TryGetValue(id, out var references)) output[id] = references = [];
            references.Add(new(reader.GetString(1), reader.GetString(2)));
        }
        return output.ToDictionary(pair => pair.Key, pair => (IReadOnlyList<StudioReference>)pair.Value);
    }

    private static async Task<IReadOnlyDictionary<int, string>> ReadStashTagNamesAsync(
        SqliteConnection connection, IReadOnlySet<int> sourceIds, CancellationToken ct)
    {
        if (sourceIds.Count == 0) return new Dictionary<int, string>();
        await using var command = connection.CreateCommand();
        command.CommandText = "SELECT name FROM sqlite_master WHERE type = 'table' AND name = 'tags'";
        if (await command.ExecuteScalarAsync(ct) is null)
            return new Dictionary<int, string>();

        command.CommandText = $"SELECT id, name FROM tags WHERE name IS NOT NULL AND trim(name) <> '' AND id IN ({AddIdSetParameter(command, "tagIds", sourceIds)})";
        var names = new Dictionary<int, string>();
        await using var reader = await command.ExecuteReaderAsync(ct);
        while (await reader.ReadAsync(ct))
        {
            ct.ThrowIfCancellationRequested();
            names[reader.GetInt32(0)] = reader.GetString(1);
        }
        return names;
    }

    private static async Task<IReadOnlyDictionary<int, MarkerTagUsage>> ReadMarkerTagUsagesAsync(
        SqliteConnection connection, IReadOnlySet<int> requestedTagIds, IReadOnlySet<int> recursiveRootIds,
        CancellationToken ct)
    {
        if (requestedTagIds.Count == 0) return new Dictionary<int, MarkerTagUsage>();
        var tables = new HashSet<string>(StringComparer.OrdinalIgnoreCase);
        await using (var tableCommand = connection.CreateCommand())
        {
            tableCommand.CommandText = "SELECT name FROM sqlite_master WHERE type = 'table'";
            await using var tableReader = await tableCommand.ExecuteReaderAsync(ct);
            while (await tableReader.ReadAsync(ct)) tables.Add(tableReader.GetString(0));
        }
        if (!tables.Contains("scene_markers"))
            return new Dictionary<int, MarkerTagUsage>();

        var usage = new Dictionary<int, MarkerTagUsage>();
        await using (var command = connection.CreateCommand())
        {
            var requestedIds = AddIdSetParameter(command, "markerTagIds", requestedTagIds);
            var markerTags = MarkerTagsSql(tables.Contains("scene_markers_tags"), requestedIds);
            command.CommandText = $$"""
                WITH marker_tags AS ({{markerTags}})
                SELECT tag_id, MAX(is_primary), MAX(is_secondary)
                FROM marker_tags
                GROUP BY tag_id
                """;
            await using var reader = await command.ExecuteReaderAsync(ct);
            while (await reader.ReadAsync(ct))
            {
                ct.ThrowIfCancellationRequested();
                var isPrimary = reader.GetInt32(1) != 0;
                var isSecondary = reader.GetInt32(2) != 0;
                usage[reader.GetInt32(0)] = new(isPrimary, isSecondary, isPrimary, isSecondary);
            }
        }

        if (recursiveRootIds.Count == 0 || !tables.Contains("tags_relations"))
            return usage;

        await using (var command = connection.CreateCommand())
        {
            var recursiveRoots = AddIdSetParameter(command, "recursiveRoots", recursiveRootIds);
            var markerTags = MarkerTagsSql(tables.Contains("scene_markers_tags"), "SELECT tag_id FROM tag_closure");
            command.CommandText = $$"""
                WITH RECURSIVE tag_closure(root_id, tag_id) AS (
                    SELECT value, value FROM ({{recursiveRoots}})
                    UNION
                    SELECT tag_closure.root_id, relation.child_id
                    FROM tag_closure
                    JOIN tags_relations AS relation ON relation.parent_id = tag_closure.tag_id
                ), marker_tags AS ({{markerTags}})
                SELECT tag_closure.root_id, MAX(marker_tags.is_primary), MAX(marker_tags.is_secondary)
                FROM tag_closure
                LEFT JOIN marker_tags ON marker_tags.tag_id = tag_closure.tag_id
                GROUP BY tag_closure.root_id
                """;
            await using var reader = await command.ExecuteReaderAsync(ct);
            while (await reader.ReadAsync(ct))
            {
                ct.ThrowIfCancellationRequested();
                var rootId = reader.GetInt32(0);
                var hasPrimary = !reader.IsDBNull(1) && reader.GetInt32(1) != 0;
                var hasSecondary = !reader.IsDBNull(2) && reader.GetInt32(2) != 0;
                var direct = usage.GetValueOrDefault(rootId) ?? new(false, false);
                usage[rootId] = direct with { HasPrimaryInHierarchy = hasPrimary, HasSecondaryInHierarchy = hasSecondary };
            }
        }
        return usage;
    }

    private static string MarkerTagsSql(bool hasRelations, string tagIds) => hasRelations
        ? $$"""
          SELECT primary_tag_id AS tag_id, 1 AS is_primary, 0 AS is_secondary
          FROM scene_markers
          WHERE primary_tag_id IN ({{tagIds}})
          UNION ALL
          SELECT relation.tag_id,
                 CASE WHEN relation.tag_id = marker.primary_tag_id THEN 1 ELSE 0 END,
                 CASE WHEN relation.tag_id <> marker.primary_tag_id THEN 1 ELSE 0 END
          FROM scene_markers_tags AS relation
          JOIN scene_markers AS marker ON marker.id = relation.scene_marker_id
          WHERE relation.tag_id IN ({{tagIds}})
          """
        : $$"""
          SELECT primary_tag_id AS tag_id, 1 AS is_primary, 0 AS is_secondary
          FROM scene_markers
          WHERE primary_tag_id IN ({{tagIds}})
          """;

    private List<FilterAnalysis> ReadAsync(
        IReadOnlyList<SourceFilter> sourceFilters,
        IReadOnlyDictionary<int, PerformerResolution> performerResolutions,
        IReadOnlyDictionary<string, TagResolution> tagResolutions,
        IReadOnlyDictionary<int, string> stashTagNames,
        IReadOnlyDictionary<int, StudioResolution> studioResolutions,
        IReadOnlyDictionary<int, MarkerTagUsage> markerTagUsages)
    {
        var output = new List<FilterAnalysis>(sourceFilters.Count);
        foreach (var filter in sourceFilters)
        {
            var traceEnabled = logger.IsEnabled(LogLevel.Trace);
            var timer = traceEnabled ? Stopwatch.StartNew() : null;
            var analysis = Translate(
                filter.Id, filter.Name, filter.Mode, filter.FindJson, filter.ObjectJson, filter.UiJson,
                performerResolutions, tagResolutions, studioResolutions, markerTagUsages, stashTagNames);
            if (traceEnabled)
                StashFilterImporterLog.FilterTranslated(logger, output.Count + 1, LoggedMode(analysis.SourceMode),
                    analysis.Status, analysis.Rules.Count, analysis.Importable, timer!.ElapsedMilliseconds);
            output.Add(analysis);
        }
        return output;
    }

    private static string LoggedMode(string mode) => mode.ToUpperInvariant() switch
    {
        "SCENES" or "IMAGES" or "GALLERIES" or "SCENE_MARKERS" or "PERFORMERS" or "TAGS" or "STUDIOS" => mode.ToUpperInvariant(),
        _ => "Unknown"
    };

    private sealed record SourceFilter(string Id, string Name, string Mode, string? FindJson, string? ObjectJson, string? UiJson);
    private sealed record FilterDependencies(
        IReadOnlySet<int> PerformerIds,
        IReadOnlySet<int> StudioIds,
        IReadOnlySet<int> TagIds,
        IReadOnlyCollection<string> TagNames,
        IReadOnlySet<int> MarkerTagIds,
        IReadOnlySet<int> RecursiveMarkerRootIds);

    private static async Task<IReadOnlyList<SourceFilter>> ReadSourceFiltersAsync(SqliteConnection connection, CancellationToken ct)
    {
        var output = new List<SourceFilter>();
        await using var command = connection.CreateCommand();
        command.CommandText = "SELECT id, name, mode, find_filter, object_filter, ui_options FROM saved_filters ORDER BY id";
        await using var reader = await command.ExecuteReaderAsync(ct);
        while (await reader.ReadAsync(ct))
        {
            ct.ThrowIfCancellationRequested();
            output.Add(new(Convert.ToString(reader.GetValue(0)) ?? "", reader.IsDBNull(1) ? "" : reader.GetString(1),
                reader.IsDBNull(2) ? "" : reader.GetString(2), reader.IsDBNull(3) ? null : reader.GetString(3),
                reader.IsDBNull(4) ? null : reader.GetString(4), reader.IsDBNull(5) ? null : reader.GetString(5)));
        }
        return output;
    }

    private static FilterDependencies CollectDependencies(IReadOnlyList<SourceFilter> filters, CancellationToken ct)
    {
        var performerIds = new HashSet<int>();
        var studioIds = new HashSet<int>();
        var tagIds = new HashSet<int>();
        var tagNames = new HashSet<string>(StringComparer.OrdinalIgnoreCase);
        var markerTagIds = new HashSet<int>();
        var recursiveMarkerRootIds = new HashSet<int>();
        foreach (var filter in filters)
        {
            if (filter.ObjectJson is null) continue;
            try
            {
                ct.ThrowIfCancellationRequested();
                if (JsonNode.Parse(filter.ObjectJson) is not JsonObject source) continue;
                CollectRelationIds(source["performers"], performerIds);
                CollectRelationIds(source["studios"], studioIds);
                CollectRelationIds(source["tags"], tagIds);
                CollectRelationIds(source["parents"], tagIds);
                CollectRelationNames(source["tags"], tagNames);
                CollectRelationNames(source["parents"], tagNames);
                if (string.Equals(filter.Mode, "SCENE_MARKERS", StringComparison.OrdinalIgnoreCase))
                {
                    CollectRelationIds(source["tags"], markerTagIds);
                    if (source["tags"] is JsonObject markerTags
                        && markerTags["value"] is JsonObject markerValue
                        && TryReadTagDepth(markerValue["depth"], out var markerDepth))
                    {
                        if (markerDepth == -1)
                            CollectRelationIds(markerTags, recursiveMarkerRootIds);
                    }
                }
            }
            catch (JsonException) { }
        }
        return new(performerIds, studioIds, tagIds, tagNames, markerTagIds, recursiveMarkerRootIds);
    }

    private static void CollectRelationIds(JsonNode? node, ISet<int> ids)
    {
        if (node is not JsonObject criterion) return;
        var value = criterion["value"];
        var items = value is JsonObject objectValue ? objectValue["items"] as JsonArray : value as JsonArray;
        var excluded = value is JsonObject objectValue2 ? objectValue2["excluded"] as JsonArray : null;
        foreach (var item in (items ?? []).Concat(excluded ?? []))
            if (item is JsonObject itemObject && TryReadSourceId(itemObject["id"], out var id)) ids.Add(id);
    }

    private static void CollectRelationNames(JsonNode? node, ISet<string> names)
    {
        if (node is not JsonObject criterion) return;
        var value = criterion["value"];
        var items = value is JsonObject objectValue ? objectValue["items"] as JsonArray : null;
        var excluded = value is JsonObject objectValue2 ? objectValue2["excluded"] as JsonArray : null;
        foreach (var item in (items ?? []).Concat(excluded ?? []))
            if (item is JsonObject itemObject
                && itemObject["label"] is JsonValue labelValue
                && labelValue.TryGetValue<string>(out var name)
                && !string.IsNullOrWhiteSpace(name))
            {
                names.Add(name);
            }
    }

    private static string AddIdSetParameter(SqliteCommand command, string name, IReadOnlySet<int> ids)
    {
        var parameter = $"${name}";
        command.Parameters.AddWithValue(parameter, JsonSerializer.Serialize(ids));
        return $"SELECT value FROM json_each({parameter})";
    }

    internal static FilterAnalysis Translate(
        string id, string name, string mode, string? findJson, string? objectJson, string? uiJson,
        IReadOnlyDictionary<int, PerformerResolution>? performerResolutions = null,
        IReadOnlyDictionary<string, TagResolution>? tagResolutions = null,
        IReadOnlyDictionary<int, StudioResolution>? studioResolutions = null,
        IReadOnlyDictionary<int, MarkerTagUsage>? markerTagUsages = null,
        IReadOnlyDictionary<int, string>? stashTagNames = null)
    {
        var rules = new List<RuleAnalysis>();
        if (string.IsNullOrWhiteSpace(name))
            rules.Add(new("name", null, "unsupported", "A saved filter must have a non-blank name."));
        var find = ParseObject("find_filter", findJson);
        var filter = ParseObject("object_filter", objectJson);
        var ui = ParseObject("ui_options", uiJson);
        if (find.Error is not null) rules.Add(find.Error);
        if (filter.Error is not null) rules.Add(filter.Error);
        if (ui.Error is not null) rules.Add(ui.Error);

        var targetMode = mode.ToUpperInvariant() switch
        {
            "SCENES" => "Videos",
            "PERFORMERS" => "Performers",
            "IMAGES" => "Images",
            "GALLERIES" => "Galleries",
            "TAGS" => "Tags",
            "STUDIOS" => "Studios",
            "SCENE_MARKERS" => "Segments",
            _ => null
        };
        if (targetMode is null)
        {
            rules.Add(new("mode", null, "unsupported", "This Stash filter mode is not supported."));
            return Finish(id, mode, name, null, rules, null);
        }

        var targetFind = find.Object is null ? null : TranslateFind(find.Object, targetMode, rules);
        var targetFilter = filter.Object is null ? null : TranslateObject(
            filter.Object,
            targetMode,
            rules,
            performerResolutions ?? new Dictionary<int, PerformerResolution>(),
            tagResolutions ?? new Dictionary<string, TagResolution>(StringComparer.OrdinalIgnoreCase),
            stashTagNames ?? new Dictionary<int, string>(),
            studioResolutions ?? new Dictionary<int, StudioResolution>(),
            markerTagUsages ?? new Dictionary<int, MarkerTagUsage>());
        var targetUi = ui.Object is null ? null : TranslateUiOptions(ui.Object, targetMode, rules);
        if (targetMode == "Segments")
            rules.Add(new("mode", "Segments", "adapted",
                "Stash markers are shown through Cove's recommended derived Segments view, where the active profile may hide, merge, or collapse records."));
        var payload = targetFind is not null && targetFilter is not null && targetUi is not null
            ? new SavedFilterPayload(targetMode, name, Json(targetFind), Json(targetFilter), Json(targetUi))
            : null;
        return Finish(id, mode, name, targetMode, rules, payload);
    }

    private static JsonObject TranslateUiOptions(JsonObject source, string targetMode, List<RuleAnalysis> rules)
    {
        var target = new JsonObject();
        foreach (var property in source)
        {
            switch (property.Key)
            {
                case "display_mode":
                    if (TryGetInt(property.Value, out var displayIndex)
                        && DisplayModes.TryGetValue(displayIndex, out var displayMode))
                    {
                        if (SupportedDisplayModes(targetMode).Contains(displayMode))
                        {
                            target["displayMode"] = displayMode;
                            rules.Add(new("ui_options.display_mode", "uiOptions.displayMode", "adapted",
                                $"Stash display mode {displayIndex} is stored as Cove's '{displayMode}' display mode."));
                        }
                        else
                        {
                            rules.Add(new("ui_options.display_mode", null, "adapted",
                                $"Stash's '{displayMode}' display mode is not available for Cove {targetMode} and was omitted."));
                        }
                    }
                    else
                    {
                        rules.Add(new("ui_options.display_mode", null, "adapted",
                            "The Stash display mode is invalid or unknown and was omitted."));
                    }
                    break;
                case "zoom_index":
                    if (TryGetInt(property.Value, out var zoomIndex)
                        && ZoomLevels.TryGetValue(zoomIndex, out var zoomLevel))
                    {
                        target["zoomLevel"] = zoomLevel;
                        rules.Add(new("ui_options.zoom_index", "uiOptions.zoomLevel", "adapted",
                            $"Stash zoom position {zoomIndex} is normalized to Cove card-size level {zoomLevel}."));
                    }
                    else
                    {
                        rules.Add(new("ui_options.zoom_index", null, "adapted",
                            "The Stash zoom position is invalid or unknown and was omitted."));
                    }
                    break;
                default:
                    rules.Add(new($"ui_options.{property.Key}", null, "adapted",
                        "This Stash interface option has no Cove saved-filter equivalent and was omitted."));
                    break;
            }
        }
        return target;
    }

    private static IReadOnlySet<string> SupportedDisplayModes(string targetMode) => targetMode switch
    {
        "Tags" or "Studios" => DisplayModesWithoutWall,
        "Segments" => GridAndListDisplayModes,
        _ => AllStashDisplayModes,
    };

    private static bool TryGetInt(JsonNode? node, out int value)
    {
        value = default;
        return node is JsonValue jsonValue && jsonValue.TryGetValue(out value);
    }

    private static FilterAnalysis Finish(string id, string mode, string name, string? targetMode, List<RuleAnalysis> rules, SavedFilterPayload? payload)
    {
        var status = rules.Any(x => x.Status == "unsupported") ? "unsupported"
            : rules.Any(x => x.Status == "adapted") ? "adapted" : "direct";
        var importable = status != "unsupported" && payload is not null;
        return new(id, mode, name, targetMode, status, rules, importable, importable ? payload : null);
    }

    private static JsonObject TranslateFind(JsonObject source, string targetMode, List<RuleAnalysis> rules)
    {
        var target = new JsonObject();
        foreach (var property in source)
        {
            switch (property.Key)
            {
                case "q":
                    if (property.Value is null)
                        break;
                    if (property.Value is not JsonValue queryValue
                        || !queryValue.TryGetValue<string>(out var query))
                    {
                        rules.Add(new("find_filter.q", null, "unsupported", "The search text is not a string."));
                        break;
                    }
                    if (string.IsNullOrWhiteSpace(query))
                        break;
                    target["q"] = query;
                    rules.Add(new("find_filter.q", "q", "adapted", "Search text is preserved, but Stash and Cove search semantics can differ."));
                    break;
                case "page":
                    break;
                case "per_page":
                    target["perPage"] = property.Value?.DeepClone();
                    rules.Add(new("find_filter.per_page", "perPage", "direct", "Page size is preserved."));
                    break;
                case "direction":
                    var direction = NodeString(property.Value)?.ToLowerInvariant();
                    if (direction is "asc" or "desc")
                    {
                        target["direction"] = direction;
                        rules.Add(new("find_filter.direction", "direction", "direct", "Sort direction is normalized to Cove's lowercase value."));
                    }
                    else rules.Add(new("find_filter.direction", null, "unsupported", "The sort direction is not recognized."));
                    break;
                case "sort":
                    TranslateSort(property.Value, targetMode, target, rules);
                    break;
                default:
                    rules.Add(new($"find_filter.{property.Key}", null, "unsupported", "This find-filter field is not supported by this importer."));
                    break;
            }
        }
        return target;
    }

    private static void TranslateSort(JsonNode? node, string targetMode, JsonObject target, List<RuleAnalysis> rules)
    {
        var sort = NodeString(node) ?? "";
        if (targetMode == "Segments" && sort is "created_at" or "updated_at" or "duration" or "seconds")
        {
            var targetSort = sort switch
            {
                "created_at" => "segment_created_at",
                "updated_at" => "segment_updated_at",
                "duration" => "span_duration",
                _ => "span_start"
            };
            target["sort"] = targetSort;
            rules.Add(new("find_filter.sort", "sort", "adapted",
                "The Stash marker-row sort is mapped to the corresponding derived-segment aggregate sort."));
        }
        else if (targetMode is "Performers" or "Studios" && sort == "scenes_count")
        {
            target["sort"] = "video_count";
            rules.Add(new("find_filter.sort", "sort", "adapted", "Stash scenes_count sort is mapped to Cove video_count."));
        }
        else if (targetMode == "Performers" && sort == "last_o_at")
        {
            target["sort"] = "last_like_at";
            rules.Add(new("find_filter.sort", "sort", "adapted", "Stash last_o_at sort is mapped to Cove last_like_at."));
        }
        else if (sort == "o_counter")
        {
            target["sort"] = "like_counter";
            rules.Add(new("find_filter.sort", "sort", "adapted", "Stash o_counter sort is mapped to Cove like_counter."));
        }
        else if (targetMode == "Tags" && sort == "name")
        {
            target["sort"] = "name";
            rules.Add(new("find_filter.sort", "sort", "adapted",
                "Stash falls back to sort_name for tag ordering, while Cove sorts by name."));
        }
        else if (targetMode == "Studios" && sort == "name")
        {
            target["sort"] = "name";
            rules.Add(new("find_filter.sort", "sort", "adapted",
                "Stash and Cove use different natural and database collation rules for studio names."));
        }
        else if (System.Text.RegularExpressions.Regex.IsMatch(sort, "^random_.+$", System.Text.RegularExpressions.RegexOptions.CultureInvariant))
        {
            target["sort"] = "random";
            rules.Add(new("find_filter.sort", "sort", "adapted",
                "The Stash random sort is mapped to Cove random, but Cove reshuffles saved random filters when loaded."));
        }
        else if ((targetMode == "Videos" && SharedSorts.Contains(sort))
            || (targetMode == "Images" && ImageSorts.Contains(sort))
            || (targetMode == "Galleries" && GallerySorts.Contains(sort))
            || (targetMode == "Performers" && PerformerSorts.Contains(sort))
            || (targetMode == "Tags" && TagSorts.Contains(sort))
            || (targetMode == "Studios" && StudioSorts.Contains(sort)))
        {
            target["sort"] = sort;
            rules.Add(new("find_filter.sort", "sort", "direct", $"The shared {targetMode.ToLowerInvariant()} sort is preserved."));
        }
        else rules.Add(new("find_filter.sort", null, "unsupported", $"This sort is not available for Cove {targetMode}."));
    }

    private static JsonObject TranslateObject(
        JsonObject source,
        string targetMode,
        List<RuleAnalysis> rules,
        IReadOnlyDictionary<int, PerformerResolution> performerResolutions,
        IReadOnlyDictionary<string, TagResolution> tagResolutions,
        IReadOnlyDictionary<int, string> stashTagNames,
        IReadOnlyDictionary<int, StudioResolution> studioResolutions,
        IReadOnlyDictionary<int, MarkerTagUsage> markerTagUsages)
    {
        var target = new JsonObject();
        if (targetMode == "Segments")
        {
            target["rawSourceCriterion"] = new JsonObject
            {
                ["value"] = "user",
                ["modifier"] = "EQUALS"
            };
            target["rawKindCriterion"] = new JsonObject
            {
                ["value"] = "tag",
                ["modifier"] = "EQUALS"
            };
            rules.Add(new("mode.scope", "rawSourceCriterion, rawKindCriterion", "adapted",
                "The Cove filter is scoped to user tag segments so unrelated derived segment providers are excluded."));
        }
        foreach (var property in source)
        {
            if (targetMode == "Segments" && property.Key is not ("tags" or "duration" or "created_at" or "updated_at"))
            {
                rules.Add(new($"object_filter.{property.Key}", null, "unsupported",
                    "This Stash marker rule has no equivalent in Cove's derived Segments view and was not dropped."));
                continue;
            }
            if (targetMode == "Tags"
                && property.Key is not ("favorite" or "description" or "parents" or "child_count" or "scene_count" or "is_missing" or "stash_id_endpoint"))
            {
                rules.Add(new($"object_filter.{property.Key}", null, "unsupported",
                    "This tag-filter rule is not supported and was not dropped."));
                continue;
            }
            if (targetMode == "Studios" && property.Key != "stash_id_endpoint")
            {
                rules.Add(new($"object_filter.{property.Key}", null, "unsupported",
                    "This studio-filter rule is not supported and was not dropped."));
                continue;
            }
            if (targetMode == "Performers"
                && property.Key is not ("filter_favorites" or "gender" or "tags" or "stash_id_endpoint" or "o_counter"))
            {
                rules.Add(new($"object_filter.{property.Key}", null, "unsupported",
                    "This performer-filter rule is not supported and was not dropped."));
                continue;
            }
            if (targetMode == "Images" && property.Key is not ("tags" or "o_counter"))
            {
                rules.Add(new($"object_filter.{property.Key}", null, "unsupported",
                    "This image-filter rule is not supported and was not dropped."));
                continue;
            }
            if (targetMode == "Galleries" && property.Key is not ("date" or "studios" or "tags" or "scenes" or "url"))
            {
                rules.Add(new($"object_filter.{property.Key}", null, "unsupported",
                    "This gallery-filter rule is not supported and was not dropped."));
                continue;
            }
            if (targetMode == "Galleries" && property.Key == "date")
            {
                TranslateGalleryDate(property.Value, target, rules);
                continue;
            }
            if (targetMode == "Galleries" && property.Key == "scenes")
            {
                TranslateGalleryScenes(property.Value, target, rules);
                continue;
            }
            if (targetMode == "Galleries" && property.Key == "url")
            {
                TranslateGalleryUrl(property.Value, target, rules);
                continue;
            }
            if (targetMode == "Segments" && property.Key == "tags")
            {
                TranslateSceneMarkerTags(property.Value, target, rules, tagResolutions, markerTagUsages);
                continue;
            }
            if (targetMode == "Segments" && property.Key == "duration")
            {
                TranslateSceneMarkerDuration(property.Value, target, rules);
                continue;
            }
            if (targetMode == "Segments" && property.Key is "created_at" or "updated_at")
            {
                TranslateSceneMarkerTimestamp(property.Key, property.Value, target, rules);
                continue;
            }
            if (targetMode == "Performers" && property.Key == "filter_favorites")
            {
                TranslatePerformerFavorite(property.Value, target, rules);
                continue;
            }
            if (targetMode == "Videos" && property.Key == "has_markers")
            {
                TranslateSceneMarkerPresence(property.Value, target, rules);
                continue;
            }
            if (targetMode == "Performers" && property.Key == "gender")
            {
                TranslatePerformerGender(property.Value, target, rules);
                continue;
            }
            if (targetMode == "Tags" && property.Key == "favorite")
            {
                TranslateBooleanCriterion(property.Key, "favoriteCriterion", property.Value, target, rules);
                continue;
            }
            if (targetMode == "Tags" && property.Key == "parents")
            {
                TranslateTagRelation(property.Value, target, rules, tagResolutions,
                    stashTagNames, "object_filter.parents", "parentsCriterion", false, false);
                continue;
            }
            if (targetMode == "Tags" && property.Key == "is_missing")
            {
                TranslateTagMissingImage(property.Value, target, rules);
                continue;
            }
            if (targetMode == "Tags" && property.Key is "description" or "child_count" or "scene_count")
            {
                var targetKey = property.Key switch
                {
                    "description" => "descriptionCriterion",
                    "child_count" => "childCountCriterion",
                    _ => "videoCountCriterion"
                };
                TranslateScalarCriterion(property.Key, targetKey, property.Value, target, rules,
                    property.Key is "description" or "scene_count", false);
                continue;
            }
            if (property.Key == "performers")
            {
                TranslatePerformers(property.Value, target, rules, performerResolutions);
                continue;
            }
            if (property.Key == "stash_id_endpoint")
            {
                TranslateStashIdEndpoint(property.Value, target, rules);
                continue;
            }
            if (property.Key == "tags")
            {
                TranslateTags(property.Value, target, rules, tagResolutions, stashTagNames);
                continue;
            }
            if (property.Key == "studios")
            {
                TranslateStudios(property.Value, target, rules, studioResolutions);
                continue;
            }
            if (property.Key == "resolution")
            {
                TranslateResolution(property.Value, target, rules);
                continue;
            }
            if (property.Key == "phash_distance")
            {
                TranslatePhashDistance(property.Value, target, rules);
                continue;
            }
            if (!Criteria.TryGetValue(property.Key, out var mapping))
            {
                rules.Add(new($"object_filter.{property.Key}", null, "unsupported", "This object-filter rule is not supported and was not dropped."));
                continue;
            }
            if (property.Value is not JsonObject criterion)
            {
                rules.Add(new($"object_filter.{property.Key}", null, "unsupported", "The criterion does not have the expected object shape."));
                continue;
            }
            var normalized = NormalizeCriterion(property.Key, criterion, rules);
            if (normalized is null) continue;
            target[mapping.Target] = normalized;
            var status = mapping.Adapted ? "adapted" : "direct";
            var explanation = mapping.Adapted
                ? "The value and modifier are preserved, but string matching semantics can differ."
                : "The scalar value, modifier, and range endpoint are preserved.";
            rules.Add(new($"object_filter.{property.Key}", mapping.Target, status, explanation));
        }
        return target;
    }

    private static void TranslatePerformerFavorite(JsonNode? node, JsonObject target, List<RuleAnalysis> rules)
    {
        const string source = "object_filter.filter_favorites";
        if (node is not JsonObject criterion
            || criterion.Any(property => property.Key is not ("value" or "modifier"))
            || !criterion.ContainsKey("value"))
        {
            rules.Add(new(source, null, "unsupported", "The performer favorite criterion does not have the expected Stash shape."));
            return;
        }

        var modifier = NodeString(criterion["modifier"])?.ToUpperInvariant();
        if (modifier is not ("EQUALS" or "NOT_EQUALS"))
        {
            rules.Add(new(source, null, "unsupported", "The performer favorite criterion modifier is not supported."));
            return;
        }

        var value = NormalizeBoolean(criterion["value"]);
        if (value is null)
        {
            rules.Add(new(source, null, "unsupported", "The performer favorite criterion value is not a recognized boolean."));
            return;
        }

        var normalized = value.GetValue<bool>();
        target["favoriteCriterion"] = new JsonObject
        {
            ["value"] = modifier == "NOT_EQUALS" ? !normalized : normalized
        };
        rules.Add(new(source, "favoriteCriterion", "adapted",
            "The Stash favorite value is normalized to Cove's boolean favorite criterion."));
    }

    private static void TranslateSceneMarkerPresence(
        JsonNode? node,
        JsonObject target,
        List<RuleAnalysis> rules)
    {
        const string source = "object_filter.has_markers";
        if (node is not JsonObject criterion
            || criterion.Any(property => property.Key is not ("value" or "modifier"))
            || !criterion.ContainsKey("value"))
        {
            rules.Add(new(source, null, "unsupported",
                "The marker-presence criterion does not have the expected Stash shape."));
            return;
        }

        var modifier = NodeString(criterion["modifier"])?.ToUpperInvariant();
        var value = NormalizeStrictBoolean(criterion["value"]);
        if (modifier is not ("EQUALS" or "NOT_EQUALS") || value is null)
        {
            rules.Add(new(source, null, "unsupported",
                "The marker-presence criterion value or modifier is not supported."));
            return;
        }

        var normalized = value.GetValue<bool>();
        target["hasSegmentsCriterion"] = new JsonObject
        {
            ["value"] = modifier == "NOT_EQUALS" ? !normalized : normalized
        };
        rules.Add(new(source, "hasSegmentsCriterion", "adapted",
            "Stash marker presence is mapped to Cove segment presence; Cove counts every raw video segment, including non-marker segments."));
    }

    private static void TranslateBooleanCriterion(
        string key,
        string targetKey,
        JsonNode? node,
        JsonObject target,
        List<RuleAnalysis> rules)
    {
        var source = $"object_filter.{key}";
        if (node is not JsonObject criterion
            || criterion.Any(property => property.Key is not ("value" or "modifier"))
            || !criterion.ContainsKey("value"))
        {
            rules.Add(new(source, null, "unsupported", "The boolean criterion does not have the expected Stash shape."));
            return;
        }

        var modifier = NodeString(criterion["modifier"])?.ToUpperInvariant();
        var value = NormalizeBoolean(criterion["value"]);
        if (modifier != "EQUALS" || value is null)
        {
            rules.Add(new(source, null, "unsupported", "The boolean criterion value or modifier is not supported."));
            return;
        }

        target[targetKey] = new JsonObject { ["value"] = value.GetValue<bool>() };
        rules.Add(new(source, targetKey, "adapted",
            "The Stash boolean value is normalized to Cove's boolean criterion."));
    }

    private static void TranslateTagMissingImage(JsonNode? node, JsonObject target, List<RuleAnalysis> rules)
    {
        const string source = "object_filter.is_missing";
        rules.Add(new(source, null, "unsupported",
            "Cove does not currently execute a missing-cover criterion for tags, so this rule was not dropped."));
    }

    private static void TranslateScalarCriterion(
        string key,
        string targetKey,
        JsonNode? node,
        JsonObject target,
        List<RuleAnalysis> rules,
        bool adapted,
        bool allowNullNumericModifiers = true,
        bool allowFloatingPoint = false)
    {
        if (node is not JsonObject criterion)
        {
            rules.Add(new($"object_filter.{key}", null, "unsupported", "The criterion does not have the expected object shape."));
            return;
        }

        var modifier = NodeString(criterion["modifier"])?.ToUpperInvariant();
        if (!allowNullNumericModifiers
            && key is not ("description" or "name" or "details" or "url")
            && modifier is "IS_NULL" or "NOT_NULL")
        {
            rules.Add(new($"object_filter.{key}", null, "unsupported",
                "Cove does not execute null modifiers for this numeric criterion, so the rule was not dropped."));
            return;
        }

        var normalized = NormalizeCriterion(key, criterion, rules, allowFloatingPoint);
        if (normalized is null) return;
        target[targetKey] = normalized;
        rules.Add(new($"object_filter.{key}", targetKey, adapted ? "adapted" : "direct",
            key == "scene_count"
                ? "The Stash scene count is mapped to Cove's video count."
                : adapted
                    ? "The value and modifier are preserved, but Stash and Cove string matching semantics can differ."
                : "The scalar value, modifier, and range endpoint are preserved."));
    }

    private static void TranslateSceneMarkerDuration(JsonNode? node, JsonObject target, List<RuleAnalysis> rules)
    {
        const string source = "object_filter.duration";
        if (node is JsonObject criterion
            && criterion.ContainsKey("value")
            && criterion.Any(property => property.Key is not ("value" or "modifier")))
        {
            rules.Add(new(source, null, "unsupported",
                "The marker duration criterion contains fields that are not compatible with an end-time check."));
            return;
        }
        if (node is JsonObject { } nullCriterion
            && nullCriterion.ContainsKey("value")
            && NodeString(nullCriterion["modifier"])?.ToUpperInvariant() == "IS_NULL")
        {
            target["rawDurationCriterion"] = new JsonObject
            {
                ["value"] = 1,
                ["modifier"] = "LESS_THAN"
            };
            rules.Add(new(source, "rawDurationCriterion", "adapted",
                "A Stash marker without an end time is approximated by a Cove segment shorter than one second."));
            return;
        }

        TranslateScalarCriterion("duration", "rawDurationCriterion", node, target, rules,
            adapted: true, allowNullNumericModifiers: false, allowFloatingPoint: true);
    }

    private static void TranslatePerformerGender(JsonNode? node, JsonObject target, List<RuleAnalysis> rules)
    {
        const string source = "object_filter.gender";
        if (node is not JsonObject criterion
            || criterion.Any(property => property.Key is not ("value" or "modifier"))
            || !criterion.ContainsKey("value"))
        {
            rules.Add(new(source, null, "unsupported", "The performer gender criterion does not have the expected Stash shape."));
            return;
        }

        var valueNode = criterion["value"];
        if (valueNode is JsonObject wrapper)
        {
            if (wrapper.Any(property => property.Key != "value"))
            {
                rules.Add(new(source, null, "unsupported", "The performer gender criterion contains unsupported fields."));
                return;
            }
            valueNode = wrapper["value"];
        }

        var modifier = NodeString(criterion["modifier"])?.ToUpperInvariant();
        if (modifier is "INCLUDES" or "EXCLUDES")
        {
            if (valueNode is not JsonArray values || values.Count == 0)
            {
                rules.Add(new(source, null, "unsupported",
                    "The performer gender list must contain at least one recognized Stash gender."));
                return;
            }

            var normalizedValues = new List<string>();
            foreach (var item in values)
            {
                var itemValue = NodeString(item);
                if (itemValue is null || !PerformerGenders.TryGetValue(itemValue, out var normalizedValue))
                {
                    rules.Add(new(source, null, "unsupported",
                        "The performer gender list contains a value that is not recognized by Cove."));
                    return;
                }
                if (!normalizedValues.Contains(normalizedValue, StringComparer.Ordinal))
                    normalizedValues.Add(normalizedValue);
            }

            var escapedValues = normalizedValues.Select(System.Text.RegularExpressions.Regex.Escape);
            target["genderCriterion"] = new JsonObject
            {
                ["value"] = $"^(?:{string.Join("|", escapedValues)})$",
                ["modifier"] = modifier == "EXCLUDES" ? "NOT_MATCHES_REGEX" : "MATCHES_REGEX"
            };
            rules.Add(new(source, "genderCriterion", "adapted",
                "Stash gender selections are normalized to Cove enum names and preserved as an anchored regex criterion."));
            return;
        }

        if (modifier is not ("EQUALS" or "NOT_EQUALS"))
        {
            rules.Add(new(source, null, "unsupported", "The performer gender criterion modifier is not supported."));
            return;
        }

        var value = NodeString(valueNode);
        if (value is null || !PerformerGenders.TryGetValue(value, out var normalized))
        {
            rules.Add(new(source, null, "unsupported", "The performer gender value is not recognized by Cove."));
            return;
        }

        target["genderCriterion"] = new JsonObject
        {
            ["value"] = normalized,
            ["modifier"] = modifier
        };
        rules.Add(new(source, "genderCriterion", "adapted",
            "The Stash gender value is normalized to Cove's performer gender enum name."));
    }

    private static void TranslateGalleryDate(JsonNode? node, JsonObject target, List<RuleAnalysis> rules)
    {
        const string source = "object_filter.date";
        var modifier = node is JsonObject dateCriterion
            ? NodeString(dateCriterion["modifier"])?.ToUpperInvariant()
            : null;
        if (node is not JsonObject criterion
            || criterion.Any(property => property.Key is not ("value" or "modifier"))
            || modifier is not ("IS_NULL" or "NOT_NULL"))
        {
            rules.Add(new(source, null, "unsupported",
                "Only gallery date presence or absence filters are currently supported."));
            return;
        }

        target["dateCriterion"] = new JsonObject { ["value"] = "", ["modifier"] = modifier };
        rules.Add(new(source, "dateCriterion", "direct", "Gallery date presence or absence is preserved."));
    }

    private static void TranslateGalleryScenes(JsonNode? node, JsonObject target, List<RuleAnalysis> rules)
    {
        const string source = "object_filter.scenes";
        var modifier = node is JsonObject scenesCriterion
            ? NodeString(scenesCriterion["modifier"])?.ToUpperInvariant()
            : null;
        if (node is not JsonObject criterion
            || criterion.Any(property => property.Key is not ("value" or "modifier"))
            || criterion["value"] is not JsonArray
            || modifier is not ("IS_NULL" or "NOT_NULL"))
        {
            rules.Add(new(source, null, "unsupported",
                "Only gallery scene presence or absence filters are currently supported."));
            return;
        }

        target["videosCriterion"] = new JsonObject
        {
            ["value"] = new JsonArray(),
            ["modifier"] = modifier
        };
        rules.Add(new(source, "videosCriterion", "direct",
            "Gallery scene presence or absence is preserved through Cove's video relation filter."));
    }

    private static void TranslateGalleryUrl(JsonNode? node, JsonObject target, List<RuleAnalysis> rules)
    {
        const string source = "object_filter.url";
        var value = node is JsonObject urlCriterion ? NodeString(urlCriterion["value"]) : null;
        var modifier = node is JsonObject urlModifierCriterion
            ? NodeString(urlModifierCriterion["modifier"])?.ToUpperInvariant()
            : null;
        if (node is not JsonObject criterion
            || criterion.Any(property => property.Key is not ("value" or "modifier"))
            || value is null
            || modifier is not ("INCLUDES" or "EXCLUDES" or "IS_NULL" or "NOT_NULL"))
        {
            rules.Add(new(source, null, "unsupported", "The gallery URL criterion is not supported in this shape."));
            return;
        }

        target["urlCriterion"] = new JsonObject { ["value"] = value, ["modifier"] = modifier };
        rules.Add(new(source, "urlCriterion", "adapted",
            "The gallery URL comparison is preserved, but Stash and Cove string-matching semantics can differ."));
    }

    private static void TranslatePhashDistance(
        JsonNode? node,
        JsonObject target,
        List<RuleAnalysis> rules)
    {
        const string source = "object_filter.phash_distance";
        if (node is not JsonObject criterion
            || criterion.Any(property => property.Key is not ("value" or "modifier" or "distance")))
        {
            rules.Add(new(source, null, "unsupported",
                "The pHash criterion does not have the expected Stash shape."));
            return;
        }

        var modifier = NodeString(criterion["modifier"])?.ToUpperInvariant();
        if (modifier is not ("IS_NULL" or "NOT_NULL"))
        {
            rules.Add(new(source, null, "unsupported",
                "Only Stash pHash presence or absence filters map exactly to Cove's hash filter; distance comparisons remain unsupported."));
            return;
        }

        target["fingerprintCriterion"] = new JsonObject
        {
            ["type"] = "phash",
            ["value"] = "",
            ["modifier"] = modifier
        };
        rules.Add(new(source, "fingerprintCriterion", "direct",
            "pHash presence or absence is preserved through Cove's algorithm-specific hash filter."));
    }

    private static void TranslateResolution(
        JsonNode? node,
        JsonObject target,
        List<RuleAnalysis> rules)
    {
        const string source = "object_filter.resolution";
        if (node is not JsonObject criterion
            || criterion.Any(property => property.Key is not ("value" or "modifier")))
        {
            rules.Add(new(source, null, "unsupported",
                "The resolution criterion does not have the expected Stash shape."));
            return;
        }

        var sourceBucket = NodeString(criterion["value"]);
        var modifier = NodeString(criterion["modifier"])?.ToUpperInvariant();
        if (modifier is not ("EQUALS" or "NOT_EQUALS" or "GREATER_THAN" or "LESS_THAN"))
        {
            rules.Add(new(source, null, "unsupported",
                "The resolution criterion modifier is not supported."));
            return;
        }
        if (string.Equals(sourceBucket, "VR_HD", StringComparison.OrdinalIgnoreCase))
        {
            rules.Add(new(source, null, "unsupported",
                "Stash's deprecated VR_HD resolution bucket has no distinct Cove equivalent."));
            return;
        }
        if (sourceBucket is null || !ResolutionBuckets.TryGetValue(sourceBucket, out var targetBucket))
        {
            rules.Add(new(source, null, "unsupported",
                "The Stash resolution bucket is not recognized."));
            return;
        }

        target["resolutionCriterion"] = new JsonObject
        {
            ["value"] = targetBucket,
            ["modifier"] = modifier
        };
        rules.Add(new(source, "resolutionCriterion", "adapted",
            "The Stash resolution label is mapped to Cove's corresponding bucket; exact bucket boundaries differ."));
    }

    private static void TranslateTags(
        JsonNode? node,
        JsonObject target,
        List<RuleAnalysis> rules,
        IReadOnlyDictionary<string, TagResolution> resolutions,
        IReadOnlyDictionary<int, string> stashTagNames)
    {
        TranslateTagRelation(node, target, rules, resolutions, stashTagNames,
            "object_filter.tags", "tagsCriterion", true, true);
    }

    private static void TranslateSceneMarkerTags(
        JsonNode? node,
        JsonObject target,
        List<RuleAnalysis> rules,
        IReadOnlyDictionary<string, TagResolution> resolutions,
        IReadOnlyDictionary<int, MarkerTagUsage> usages)
    {
        const string source = "object_filter.tags";
        if (node is not JsonObject criterion
            || criterion.Any(property => property.Key is not ("value" or "modifier"))
            || NodeString(criterion["modifier"])?.ToUpperInvariant() is not ("INCLUDES" or "INCLUDES_ALL")
            || criterion["value"] is not JsonObject value
            || value.Any(property => property.Key is not ("items" or "excluded" or "depth"))
            || !TryReadTagDepth(value["depth"], out var depth))
        {
            rules.Add(new(source, null, "unsupported",
                "The marker tag criterion does not have a supported Stash shape."));
            return;
        }

        if (value["excluded"] is not null and not JsonArray)
        {
            rules.Add(new(source, null, "unsupported",
                "The marker tag exclusion list does not have the expected Stash shape."));
            return;
        }
        if (value["excluded"] is JsonArray { Count: > 0 })
        {
            rules.Add(new(source, null, "unsupported",
                "Cove's segment tag filter does not support marker-tag exclusions."));
            return;
        }
        if (value["items"] is not JsonArray { Count: 1 } items
            || items[0] is not JsonObject item
            || item.Any(property => property.Key is not ("id" or "label"))
            || !TryReadSourceId(item["id"], out var sourceId)
            || NodeString(item["label"]) is not { } label
            || string.IsNullOrWhiteSpace(label))
        {
            rules.Add(new(source, null, "unsupported",
                "Cove segments have one primary tag, so this marker filter must include exactly one tag."));
            return;
        }
        var hasPrimary = false;
        var hasSecondary = false;
        if (usages.TryGetValue(sourceId, out var usage))
        {
            hasPrimary = depth == -1 ? usage.HasPrimaryInHierarchy : usage.IsPrimary;
            hasSecondary = depth == -1 ? usage.HasSecondaryInHierarchy : usage.IsSecondary;
        }
        if (!hasPrimary || hasSecondary)
        {
            rules.Add(new(source, null, "unsupported",
                depth == -1
                    ? "This Stash tag hierarchy is secondary on at least one marker or has no primary marker usage, while Cove segments expose only one primary tag."
                    : "This Stash tag is secondary on at least one marker, while Cove segments expose only one primary tag."));
            return;
        }
        if (!resolutions.TryGetValue(label, out var resolution) || resolution.TargetId is null)
        {
            rules.Add(new(source, null, "unsupported",
                resolution?.Status == "ambiguous"
                    ? "The Stash tag name matches multiple Cove tags."
                    : "The Stash tag name has no exact case-insensitive match in Cove."));
            return;
        }

        var translated = new JsonObject
        {
            ["value"] = new JsonArray(resolution.TargetId.Value),
            ["modifier"] = "INCLUDES"
        };
        if (depth == -1)
            translated["depth"] = -1;
        target["rawTagsCriterion"] = translated;
        rules.Add(new(source, "rawTagsCriterion", "adapted",
            depth == -1
                ? "The primary-only marker tag hierarchy is matched to Cove by exact case-insensitive parent name; Cove expands its current descendants and evaluates them on profile-derived segments."
                : "The primary marker tag is matched to Cove by exact case-insensitive name; Cove then evaluates it on profile-derived segments."));
    }

    private static void TranslateSceneMarkerTimestamp(
        string key,
        JsonNode? node,
        JsonObject target,
        List<RuleAnalysis> rules)
    {
        var source = $"object_filter.{key}";
        if (node is not JsonObject criterion
            || criterion.Any(property => property.Key is not ("value" or "value2" or "modifier")))
        {
            rules.Add(new(source, null, "unsupported", "The marker timestamp criterion does not have the expected shape."));
            return;
        }

        var modifier = NodeString(criterion["modifier"])?.ToUpperInvariant();
        if (modifier is not ("EQUALS" or "NOT_EQUALS" or "GREATER_THAN" or "LESS_THAN" or "BETWEEN" or "NOT_BETWEEN"))
        {
            rules.Add(new(source, null, "unsupported", "Cove does not support this marker timestamp modifier."));
            return;
        }

        var valueNode = criterion["value"];
        JsonNode? nestedValue2 = null;
        if (valueNode is JsonObject wrapper)
        {
            if (wrapper.Any(property => property.Key is not ("value" or "value2")))
            {
                rules.Add(new(source, null, "unsupported", "The marker timestamp wrapper contains unsupported fields."));
                return;
            }
            valueNode = wrapper["value"];
            nestedValue2 = wrapper["value2"];
        }

        var value = NodeString(valueNode);
        var value2 = NodeString(criterion["value2"] ?? nestedValue2);
        if (string.IsNullOrWhiteSpace(value)
            || !DateTimeOffset.TryParse(value, System.Globalization.CultureInfo.InvariantCulture,
                System.Globalization.DateTimeStyles.RoundtripKind, out _)
            || (modifier is "BETWEEN" or "NOT_BETWEEN"
                && (string.IsNullOrWhiteSpace(value2)
                    || !DateTimeOffset.TryParse(value2, System.Globalization.CultureInfo.InvariantCulture,
                        System.Globalization.DateTimeStyles.RoundtripKind, out _))))
        {
            rules.Add(new(source, null, "unsupported", "The marker timestamp value is not valid."));
            return;
        }

        var targetKey = key == "created_at" ? "rawCreatedAtCriterion" : "rawUpdatedAtCriterion";
        target[targetKey] = new JsonObject
        {
            ["value"] = value,
            ["modifier"] = modifier,
            ["value2"] = value2
        };
        rules.Add(new(source, targetKey, "adapted",
            "The marker timestamp is preserved, but Cove evaluates it across records contributing to a derived segment."));
    }

    private static void TranslateTagRelation(
        JsonNode? node,
        JsonObject target,
        List<RuleAnalysis> rules,
        IReadOnlyDictionary<string, TagResolution> resolutions,
        IReadOnlyDictionary<int, string> stashTagNames,
        string source,
        string targetKey,
        bool presenceIsAdapted,
        bool allowRecursiveDepth)
    {
        if (node is not JsonObject criterion
            || criterion.Any(property => property.Key is not ("value" or "modifier")))
        {
            rules.Add(new(source, null, "unsupported", "The tag criterion does not have the expected Stash shape."));
            return;
        }

        var modifier = NodeString(criterion["modifier"])?.ToUpperInvariant();
        if (modifier is not ("INCLUDES" or "INCLUDES_ALL" or "EXCLUDES" or "IS_NULL" or "NOT_NULL"))
        {
            rules.Add(new(source, null, "unsupported", "The tag criterion modifier is not supported."));
            return;
        }

        if (modifier is "IS_NULL" or "NOT_NULL")
        {
            target[targetKey] = new JsonObject
            {
                ["value"] = new JsonArray(),
                ["modifier"] = modifier
            };
            rules.Add(new(source, targetKey, presenceIsAdapted ? "adapted" : "direct",
                presenceIsAdapted
                    ? "Tag-presence filtering is preserved, but Cove evaluates direct and derived effective tags; stale selected values are ignored."
                    : "Tag relation presence or absence is preserved; stale selected values are ignored."));
            return;
        }

        if (criterion["value"] is not JsonObject value
            || value.Any(property => property.Key is not ("items" or "excluded" or "depth"))
            || !TryReadTagDepth(value["depth"], out var depth))
        {
            rules.Add(new(source, null, "unsupported", "The tag criterion does not have the expected Stash shape."));
            return;
        }

        if (!allowRecursiveDepth && depth == -1)
        {
            var tagNames = DescribeTagNames(stashTagNames, value["items"], value["excluded"]);
            rules.Add(new(source, null, "unsupported",
                tagNames.Count > 0
                    ? $"Cove tag parent filters only evaluate direct parents, so recursive Stash parent depth was not imported for: {string.Join(", ", tagNames)}."
                    : "Cove tag parent filters only evaluate direct parents, so recursive Stash parent depth was not imported."));
            return;
        }

        if (!TryMapTagItems(value["items"], resolutions, out var included, out var failure)
            || !TryMapTagItems(value["excluded"], resolutions, out var excluded, out failure))
        {
            var explanation = failure == "ambiguous"
                ? "At least one Stash tag name matches multiple Cove tags."
                : "At least one Stash tag name has no exact case-insensitive match in Cove.";
            var unresolvedNames = DescribeTagNames(stashTagNames, value["items"], value["excluded"])
                .Where(name => resolutions.TryGetValue(name, out var resolution)
                    ? resolution.TargetId is null && resolution.Status == failure
                    : failure == "missing")
                .ToList();
            if (unresolvedNames.Count > 0)
                explanation += $" Stash tags: {string.Join(", ", unresolvedNames)}.";
            rules.Add(new(source, null, "unsupported", explanation));
            return;
        }

        var translated = new JsonObject
        {
            ["value"] = new JsonArray(included.Select(id => JsonValue.Create(id)).ToArray()),
            ["modifier"] = modifier
        };
        if (excluded.Count > 0)
            translated["excludes"] = new JsonArray(excluded.Select(id => JsonValue.Create(id)).ToArray());
        if (depth == -1)
            translated["depth"] = -1;
        target[targetKey] = translated;
        rules.Add(new(source, targetKey, "direct",
            "Tag references were matched to Cove tags by exact case-insensitive names; hierarchy depth and exclusions are preserved."));
    }

    private static bool TryReadTagDepth(JsonNode? node, out int depth)
    {
        if (node is null)
        {
            depth = 0;
            return true;
        }
        if (node is JsonValue value
            && value.TryGetValue<int>(out depth)
            && depth is 0 or -1)
            return true;
        depth = 0;
        return false;
    }

    private static IReadOnlyList<string> DescribeTagNames(
        IReadOnlyDictionary<int, string> stashTagNames,
        params JsonNode?[] nodes) =>
        nodes
            .OfType<JsonArray>()
            .SelectMany(items => items)
            .OfType<JsonObject>()
            .Select(item => NodeString(item["label"])
                ?? (NodeInt(item["id"]) is { } id && stashTagNames.TryGetValue(id, out var name) ? name : null))
            .Where(name => !string.IsNullOrWhiteSpace(name))
            .Select(name => name!)
            .Distinct(StringComparer.OrdinalIgnoreCase)
            .ToList();

    private static int? NodeInt(JsonNode? node)
    {
        if (node is not JsonValue value) return null;
        if (value.TryGetValue<int>(out var number)) return number;
        return value.TryGetValue<string>(out var text) && int.TryParse(text, out number) ? number : null;
    }

    private static bool TryMapTagItems(
        JsonNode? node,
        IReadOnlyDictionary<string, TagResolution> resolutions,
        out List<int> mapped,
        out string? failure)
    {
        mapped = [];
        failure = null;
        if (node is null) return true;
        if (node is not JsonArray items) { failure = "missing"; return false; }
        foreach (var item in items)
        {
            if (item is not JsonObject itemObject
                || itemObject.Any(property => property.Key is not ("id" or "label"))
                || NodeString(itemObject["label"]) is not { } name
                || string.IsNullOrWhiteSpace(name))
            {
                failure = "missing";
                return false;
            }
            if (!resolutions.TryGetValue(name, out var resolution) || resolution.TargetId is null)
            {
                failure = resolution?.Status ?? "missing";
                return false;
            }
            mapped.Add(resolution.TargetId.Value);
        }
        mapped = mapped.Distinct().ToList();
        return true;
    }

    private static void TranslateStashIdEndpoint(
        JsonNode? node,
        JsonObject target,
        List<RuleAnalysis> rules)
    {
        const string source = "object_filter.stash_id_endpoint";
        if (node is not JsonObject criterion
            || criterion.Any(property => property.Key is not ("value" or "modifier")))
        {
            rules.Add(new(source, null, "unsupported", "The metadata-service criterion does not have the expected Stash shape."));
            return;
        }

        var modifier = NodeString(criterion["modifier"])?.ToUpperInvariant();
        if (modifier is not ("EQUALS" or "NOT_EQUALS" or "IS_NULL" or "NOT_NULL"))
        {
            rules.Add(new(source, null, "unsupported", "The metadata-service criterion modifier is not supported."));
            return;
        }

        string endpoint;
        string stashId;
        if (criterion["value"] is JsonObject value
            && !value.Any(property => property.Key is not ("endpoint" or "stashID" or "stash_id"))
            && !(value.ContainsKey("stashID") && value.ContainsKey("stash_id"))
            && TryReadOptionalString(value["endpoint"], out endpoint)
            && TryReadOptionalString(value["stashID"] ?? value["stash_id"], out stashId))
        {
            // Current Stash saves camel-case stashID; GraphQL-shaped fixtures may use stash_id.
        }
        else if (criterion["value"] is JsonValue legacyValue
                 && legacyValue.TryGetValue<string>(out var legacyStashId))
        {
            endpoint = "";
            stashId = legacyStashId;
        }
        else
        {
            rules.Add(new(source, null, "unsupported", "The metadata-service criterion does not have the expected Stash shape."));
            return;
        }

        if (endpoint.Length > 0 && endpoint != endpoint.Trim())
        {
            rules.Add(new(source, null, "unsupported",
                "The metadata-service endpoint contains leading or trailing whitespace that Cove would normalize."));
            return;
        }

        if (modifier is "IS_NULL" or "NOT_NULL")
        {
            // Cove's unscoped value criterion counts remote-ID rows even when their endpoint is blank,
            // matching Stash's global presence semantics.
            var targetKey = string.IsNullOrEmpty(endpoint)
                ? "remoteIdValueCriterion"
                : "remoteIdCriterion";
            target[targetKey] = new JsonObject
            {
                ["value"] = endpoint,
                ["modifier"] = modifier
            };
            var status = string.IsNullOrEmpty(endpoint) ? "direct" : "adapted";
            var presenceExplanation = string.IsNullOrEmpty(endpoint)
                ? "Global metadata-service presence filtering is preserved."
                : "Metadata-service presence filtering is preserved, but Cove compares endpoint names case-insensitively.";
            rules.Add(new(source, targetKey, status, presenceExplanation));
            return;
        }

        if (string.IsNullOrWhiteSpace(stashId) || stashId != stashId.Trim())
        {
            rules.Add(new(source, null, "unsupported",
                "The Stash ID must be nonblank and contain no leading or trailing whitespace."));
            return;
        }

        if (!string.IsNullOrEmpty(endpoint))
        {
            target["remoteIdCriterion"] = new JsonObject
            {
                ["value"] = endpoint,
                ["modifier"] = "EQUALS"
            };
        }
        target["remoteIdValueCriterion"] = new JsonObject
        {
            ["value"] = stashId,
            ["modifier"] = modifier
        };
        var targetName = string.IsNullOrEmpty(endpoint)
            ? "remoteIdValueCriterion"
            : "remoteIdCriterion + remoteIdValueCriterion";
        var explanation = modifier == "NOT_EQUALS" && string.IsNullOrEmpty(endpoint)
            ? "The Stash ID is preserved, but Cove also matches entities with no remote IDs; Stash excludes them. Stash SQL LIKE wildcard semantics also differ."
            : modifier == "NOT_EQUALS"
                ? "The endpoint and Stash ID are preserved, but Cove also matches entities without that endpoint; Stash excludes them. Stash SQL LIKE wildcard semantics also differ."
            : "The endpoint and Stash ID are preserved, but Stash SQL LIKE wildcard semantics differ from Cove's literal comparison.";
        rules.Add(new(source, targetName, "adapted", explanation));
    }

    private static bool TryReadOptionalString(JsonNode? node, out string value)
    {
        if (node is null)
        {
            value = "";
            return true;
        }
        if (node is JsonValue jsonValue && jsonValue.TryGetValue<string>(out value!))
            return true;
        value = "";
        return false;
    }

    private static void TranslateStudios(
        JsonNode? node,
        JsonObject target,
        List<RuleAnalysis> rules,
        IReadOnlyDictionary<int, StudioResolution> resolutions)
    {
        const string source = "object_filter.studios";
        if (node is not JsonObject criterion
            || criterion.Any(property => property.Key is not ("value" or "modifier")))
        {
            rules.Add(new(source, null, "unsupported",
                "The studio criterion does not have the expected Stash shape."));
            return;
        }

        var modifier = NodeString(criterion["modifier"])?.ToUpperInvariant();
        if (modifier is not ("INCLUDES" or "INCLUDES_ALL" or "EXCLUDES" or "IS_NULL" or "NOT_NULL"))
        {
            rules.Add(new(source, null, "unsupported", "The studio criterion modifier is not supported."));
            return;
        }

        if (modifier is "IS_NULL" or "NOT_NULL")
        {
            target["studiosCriterion"] = new JsonObject
            {
                ["value"] = new JsonArray(),
                ["modifier"] = modifier
            };
            rules.Add(new(source, "studiosCriterion", "direct",
                "The studio-presence modifier is preserved; stale selected values are ignored."));
            return;
        }

        JsonNode? includedNode;
        JsonNode? excludedNode;
        var depth = 0;
        if (criterion["value"] is JsonObject value
            && !value.Any(property => property.Key is not ("items" or "excluded" or "depth"))
            && TryReadTagDepth(value["depth"], out depth))
        {
            includedNode = value["items"];
            excludedNode = value["excluded"];
        }
        else if (criterion["value"] is JsonArray legacyValue)
        {
            includedNode = legacyValue;
            excludedNode = null;
        }
        else
        {
            rules.Add(new(source, null, "unsupported",
                "The studio criterion does not have the expected Stash shape."));
            return;
        }

        if (!TryMapStudioItems(includedNode, resolutions, out var included, out var failure)
            || !TryMapStudioItems(excludedNode, resolutions, out var excluded, out failure))
        {
            var explanation = failure == "ambiguous"
                ? "At least one Stash studio reference matches multiple Cove studios."
                : "At least one Stash studio has no exact shared remote-ID match in Cove.";
            rules.Add(new(source, null, "unsupported", explanation));
            return;
        }

        var translated = new JsonObject
        {
            ["value"] = new JsonArray(included.Select(id => JsonValue.Create(id)).ToArray()),
            ["modifier"] = modifier
        };
        if (excluded.Count > 0)
            translated["excludes"] = new JsonArray(excluded.Select(id => JsonValue.Create(id)).ToArray());
        if (depth == -1)
            translated["depth"] = -1;
        target["studiosCriterion"] = translated;
        rules.Add(new(source, "studiosCriterion", "adapted",
            "Studio references were mapped by exact endpoint-scoped remote IDs; hierarchy depth and exclusions are preserved."));
    }

    private static bool TryMapStudioItems(
        JsonNode? node,
        IReadOnlyDictionary<int, StudioResolution> resolutions,
        out List<int> mapped,
        out string? failure)
    {
        mapped = [];
        failure = null;
        if (node is null) return true;
        if (node is not JsonArray items) { failure = "missing"; return false; }
        foreach (var item in items)
        {
            if (item is not JsonObject itemObject
                || itemObject.Any(property => property.Key is not ("id" or "label"))
                || !TryReadSourceId(itemObject["id"], out var sourceId))
            {
                failure = "missing";
                return false;
            }
            if (!resolutions.TryGetValue(sourceId, out var resolution) || resolution.TargetId is null)
            {
                failure = resolution?.Status ?? "missing";
                return false;
            }
            mapped.Add(resolution.TargetId.Value);
        }
        mapped = mapped.Distinct().ToList();
        return true;
    }

    private static void TranslatePerformers(
        JsonNode? node,
        JsonObject target,
        List<RuleAnalysis> rules,
        IReadOnlyDictionary<int, PerformerResolution> resolutions)
    {
        const string source = "object_filter.performers";
        if (node is not JsonObject criterion
            || criterion.Any(property => property.Key is not ("value" or "modifier")))
        {
            rules.Add(new(source, null, "unsupported", "The performer criterion does not have the expected Stash shape."));
            return;
        }

        var modifier = NodeString(criterion["modifier"])?.ToUpperInvariant();
        if (modifier is not ("INCLUDES" or "INCLUDES_ALL" or "EXCLUDES" or "EXCLUDES_ALL" or "IS_NULL" or "NOT_NULL"))
        {
            rules.Add(new(source, null, "unsupported", "The performer criterion modifier is not supported."));
            return;
        }

        if (modifier is "IS_NULL" or "NOT_NULL")
        {
            target["performersCriterion"] = new JsonObject
            {
                ["value"] = new JsonArray(),
                ["modifier"] = modifier
            };
            rules.Add(new(source, "performersCriterion", "direct",
                "The performer-presence modifier is preserved; stale selected values are ignored."));
            return;
        }

        JsonNode? includedNode;
        JsonNode? excludedNode;
        if (criterion["value"] is JsonObject value
            && !value.Any(property => property.Key is not ("items" or "excluded")))
        {
            includedNode = value["items"];
            excludedNode = value["excluded"];
        }
        else if (criterion["value"] is JsonArray legacyValue)
        {
            includedNode = legacyValue;
            excludedNode = null;
        }
        else
        {
            rules.Add(new(source, null, "unsupported", "The performer criterion does not have the expected Stash shape."));
            return;
        }

        if (!TryMapPerformerItems(includedNode, resolutions, out var included, out var failure)
            || !TryMapPerformerItems(excludedNode, resolutions, out var excluded, out failure))
        {
            var explanation = failure == "ambiguous"
                ? "At least one Stash performer reference matches multiple Cove performers."
                : "At least one Stash performer has no exact shared remote-ID match in Cove.";
            rules.Add(new(source, null, "unsupported", explanation));
            return;
        }

        var translated = new JsonObject
        {
            ["value"] = new JsonArray(included.Select(id => JsonValue.Create(id)).ToArray()),
            ["modifier"] = modifier
        };
        if (excluded.Count > 0)
            translated["excludes"] = new JsonArray(excluded.Select(id => JsonValue.Create(id)).ToArray());
        target["performersCriterion"] = translated;
        rules.Add(new(source, "performersCriterion", "adapted",
            "Performer references were mapped by exact endpoint-scoped remote IDs shared by Stash and Cove."));
    }

    private static bool TryMapPerformerItems(
        JsonNode? node,
        IReadOnlyDictionary<int, PerformerResolution> resolutions,
        out List<int> mapped,
        out string? failure)
    {
        mapped = [];
        failure = null;
        if (node is null) return true;
        if (node is not JsonArray items) { failure = "missing"; return false; }
        foreach (var item in items)
        {
            if (item is not JsonObject itemObject
                || itemObject.Any(property => property.Key is not ("id" or "label"))
                || !TryReadSourceId(itemObject["id"], out var sourceId))
            {
                failure = "missing";
                return false;
            }
            if (!resolutions.TryGetValue(sourceId, out var resolution) || resolution.TargetId is null)
            {
                failure = resolution?.Status ?? "missing";
                return false;
            }
            mapped.Add(resolution.TargetId.Value);
        }
        mapped = mapped.Distinct().ToList();
        return true;
    }

    private static bool TryReadSourceId(JsonNode? node, out int value)
    {
        value = 0;
        if (node is not JsonValue jsonValue) return false;
        if (jsonValue.TryGetValue<int>(out value)) return value > 0;
        return jsonValue.TryGetValue<string>(out var text) && int.TryParse(text, out value) && value > 0;
    }

    private static JsonObject? NormalizeCriterion(
        string key,
        JsonObject criterion,
        List<RuleAnalysis> rules,
        bool allowFloatingPoint = false)
    {
        var allowed = new HashSet<string>(StringComparer.Ordinal) { "value", "value2", "modifier" };
        if (criterion.Any(x => !allowed.Contains(x.Key)))
        {
            rules.Add(new($"object_filter.{key}", null, "unsupported", "Composite or relation criterion fields are not supported."));
            return null;
        }
        if (!criterion.ContainsKey("value") || !criterion.ContainsKey("modifier"))
        {
            rules.Add(new($"object_filter.{key}", null, "unsupported", "The criterion is missing a value or modifier."));
            return null;
        }
        var modifier = NodeString(criterion["modifier"]);
        var isBoolean = key == "performer_favorite";
        var isString = key is "title" or "video_codec" or "description" or "name" or "details" or "url";
        var supportedModifier = isBoolean
            ? modifier is not null && (modifier.Equals("EQUALS", StringComparison.OrdinalIgnoreCase)
                || modifier.Equals("NOT_EQUALS", StringComparison.OrdinalIgnoreCase))
            : isString ? modifier is not null && StringModifiers.Contains(modifier)
            : modifier is not null && NumericModifiers.Contains(modifier);
        if (string.IsNullOrWhiteSpace(modifier) || !supportedModifier)
        {
            rules.Add(new($"object_filter.{key}", null, "unsupported", "The criterion modifier is not recognized."));
            return null;
        }
        modifier = modifier.ToUpperInvariant();
        var sourceValue = criterion["value"];
        JsonNode? nestedValue2 = null;
        if (sourceValue is JsonObject wrapper)
        {
            if (wrapper.Any(x => x.Key is not ("value" or "value2")))
            {
                rules.Add(new($"object_filter.{key}", null, "unsupported", "The Stash scalar wrapper contains unsupported fields."));
                return null;
            }
            sourceValue = wrapper["value"];
            nestedValue2 = wrapper["value2"];
        }
        var normalizedValue = key == "performer_favorite"
            ? NormalizeBoolean(sourceValue)
            : sourceValue?.DeepClone();
        if (!isBoolean && !isString
            && (allowFloatingPoint ? !IsFiniteNumber(normalizedValue) : !IsInteger(normalizedValue)))
            normalizedValue = null;
        if (isString && normalizedValue is JsonValue stringValue
            && !stringValue.TryGetValue<string>(out _))
            normalizedValue = null;
        var target = new JsonObject { ["value"] = normalizedValue };
        if (target["value"] is null)
        {
            rules.Add(new($"object_filter.{key}", null, "unsupported", "The criterion value is not valid."));
            return null;
        }
        if (key == "performer_favorite")
        {
            if (modifier.Equals("NOT_EQUALS", StringComparison.OrdinalIgnoreCase))
                target["value"] = !target["value"]!.GetValue<bool>();
            return target;
        }
        target["modifier"] = modifier;
        var value2 = criterion.TryGetPropertyValue("value2", out var topValue2) ? topValue2 : nestedValue2;
        var requiresRange = modifier.Equals("BETWEEN", StringComparison.OrdinalIgnoreCase)
            || modifier.Equals("NOT_BETWEEN", StringComparison.OrdinalIgnoreCase);
        if (requiresRange && value2 is null)
        {
            rules.Add(new($"object_filter.{key}", null, "unsupported", "A range modifier requires a second endpoint."));
            return null;
        }
        if (!isString && value2 is not null
            && (allowFloatingPoint ? !IsFiniteNumber(value2) : !IsInteger(value2)))
        {
            rules.Add(new($"object_filter.{key}", null, "unsupported",
                allowFloatingPoint
                    ? "The numeric range endpoint is not finite."
                    : "The numeric range endpoint is not an integer."));
            return null;
        }
        if (value2 is not null)
            target["value2"] = value2.DeepClone();
        return target;
    }

    private static bool IsInteger(JsonNode? node)
        => node is JsonValue value && value.TryGetValue<int>(out _);

    private static bool IsFiniteNumber(JsonNode? node)
    {
        if (node is not JsonValue value) return false;
        if (value.TryGetValue<int>(out _)) return true;
        if (value.TryGetValue<long>(out _)) return true;
        if (value.TryGetValue<double>(out var doubleValue)) return double.IsFinite(doubleValue);
        return value.TryGetValue<decimal>(out _);
    }

    private static JsonNode? NormalizeBoolean(JsonNode? node)
    {
        if (node is JsonValue value)
        {
            if (value.TryGetValue<bool>(out var boolean)) return JsonValue.Create(boolean);
            if (value.TryGetValue<string>(out var text))
            {
                if (bool.TryParse(text, out boolean)) return JsonValue.Create(boolean);
                if (text == "1") return JsonValue.Create(true);
                if (text == "0") return JsonValue.Create(false);
            }
            if (value.TryGetValue<int>(out var number) && number is 0 or 1) return JsonValue.Create(number == 1);
        }
        if (node is JsonObject wrapper && wrapper.TryGetPropertyValue("value", out var wrapped))
            return NormalizeBoolean(wrapped);
        return null;
    }

    private static JsonNode? NormalizeStrictBoolean(JsonNode? node)
    {
        if (node is not JsonObject wrapper)
            return NormalizeBoolean(node);
        if (wrapper.Count != 1 || !wrapper.TryGetPropertyValue("value", out var wrapped))
            return null;
        return NormalizeStrictBoolean(wrapped);
    }

    private static BlobResult ParseObject(string source, string? json)
    {
        if (string.IsNullOrWhiteSpace(json)) return new(new JsonObject(), null);
        try
        {
            var node = JsonNode.Parse(json);
            return node is JsonObject obj
                ? new(obj, null)
                : new(null, new(source, null, "unsupported", "The JSON value must be an object."));
        }
        catch (JsonException)
        {
            return new(null, new(source, null, "unsupported", "The JSON value is malformed."));
        }
    }

    private static string? NodeString(JsonNode? node) =>
        node is JsonValue value && value.TryGetValue<string>(out var text) ? text : null;
    private static string Json(JsonObject value) => value.ToJsonString(new JsonSerializerOptions { WriteIndented = false });

    private static AnalysisResponse Summarize(IReadOnlyList<FilterAnalysis> filters) => new(
        new(
            filters.Count(x => x.Status == "direct"),
            filters.Count(x => x.Status == "adapted"),
            filters.Count(x => x.Status == "unsupported"),
            filters.Count(x => x.Importable)),
        filters);
}

internal sealed class AnalysisException(string message) : Exception(message);
