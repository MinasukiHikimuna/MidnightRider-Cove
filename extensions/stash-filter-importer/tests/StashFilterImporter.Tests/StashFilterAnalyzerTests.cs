using System.Text.Json;
using System.Text.Json.Nodes;
using Cove.Core.Entities;
using Cove.Core.Interfaces;
using Microsoft.Data.Sqlite;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;

namespace StashFilterImporter.Tests;

public sealed class StashFilterAnalyzerTests
{
    [Fact]
    public async Task Analysis_logs_aggregate_phase_timings_without_database_contents()
    {
        var path = Path.Combine(Path.GetTempPath(), $"private-path-sentinel-{Guid.NewGuid():N}.sqlite");
        var fixture = await CreateFixture(
            ("private-id-sentinel", "private-name-sentinel", "SCENES", "{}", "{}", "{}"),
            ("private-id-two", "private-name-two", "SCENES", "{}", "{\"private-json-sentinel\":true}", "{}"),
            ("private-id-three", "private-name-three", "private-mode-sentinel", "{}", "{}", "{}"));
        File.Move(fixture, path, true);
        try
        {
            var logger = new RecordingLogger();
            await new StashFilterAnalyzer(
                new RecordingResolver(), new RecordingTagResolver(), new RecordingStudioResolver(), logger)
                .AnalyzeAsync(path, default);

            var started = Assert.Single(logger.Entries, entry => entry.EventId.Id == 102);
            Assert.Equal(LogLevel.Information, started.Level);
            Assert.Equal("Started", started.EventId.Name);
            Assert.False(started.Values.ContainsKey("DatabaseBytes"));
            Assert.Contains(logger.Entries, entry => entry.EventId.Id == 114
                && entry.Level == LogLevel.Debug && entry.Values.ContainsKey("DatabaseBytes"));
            var completed = Assert.Single(logger.Entries, entry => entry.EventId.Id == 103);
            Assert.Equal(LogLevel.Information, completed.Level);
            Assert.Equal("Completed", completed.EventId.Name);
            Assert.Equal(3, completed.Values["FilterCount"]);
            Assert.Equal(1, completed.Values["DirectCount"]);
            Assert.Equal(2, completed.Values["UnsupportedCount"]);
            Assert.Equal(1, completed.Values["ImportableCount"]);
            Assert.Equal(0, completed.Values["AdaptedCount"]);
            var phases = logger.Entries.Where(entry => entry.EventId.Id == 110).ToArray();
            Assert.All(phases, entry =>
            {
                Assert.Equal(LogLevel.Debug, entry.Level);
                Assert.Equal("PhaseCompleted", entry.EventId.Name);
                Assert.True(entry.Values.ContainsKey("ElapsedMs"));
                Assert.True(entry.Values.ContainsKey("ItemCount"));
            });
            var expectedPhases = new[]
            {
                "FileMetadata", "ConnectionOpen", "SavedFilterSchema", "SavedFilterRead",
                "DependencyCollection", "StashPerformerRead", "CovePerformerResolution",
                "StashTagRead", "CoveTagResolution", "StashMarkerRead", "StashStudioRead",
                "CoveStudioResolution", "Translation", "Summarization"
            };
            Assert.All(expectedPhases, phase => Assert.Contains(phases, entry => Equals(entry.Values["Phase"], phase)));
            Assert.DoesNotContain(phases, entry => Equals(entry.Values["Phase"], "QuickCheck"));
            var dependencies = Assert.Single(logger.Entries, entry => entry.EventId.Id == 111);
            Assert.Equal(LogLevel.Debug, dependencies.Level);
            Assert.Equal("Dependencies", dependencies.EventId.Name);
            Assert.All(
                new[]
                {
                    "PerformerIds", "StudioIds", "TagIds", "TagNames", "MarkerTagIds",
                    "RecursiveMarkerRoots"
                },
                key => Assert.True(dependencies.Values.ContainsKey(key)));
            var translated = logger.Entries.Where(entry => entry.EventId.Id == 113).ToArray();
            Assert.Equal(3, translated.Length);
            Assert.All(translated, entry =>
            {
                Assert.Equal(LogLevel.Trace, entry.Level);
                Assert.Equal("FilterTranslated", entry.EventId.Name);
                Assert.All(
                    new[] { "Ordinal", "Mode", "Status", "RuleCount", "Importable", "ElapsedMs" },
                    key => Assert.True(entry.Values.ContainsKey(key)));
            });
            Assert.Contains(logger.Entries, entry => entry.EventId.Id == 112
                && entry.EventId.Name == "PhaseStarted" && entry.Level == LogLevel.Trace);
            AssertLogsDoNotContain(
                logger, path, "private-id-sentinel", "private-name-sentinel", "private-id-two",
                "private-name-two", "private-json-sentinel", "private-mode-sentinel");
            Assert.Equal("SCENES", translated[0].Values["Mode"]);
            Assert.Contains(translated, entry => Equals(entry.Values["Mode"], "Unknown"));
        }
        finally { File.Delete(path); }
    }

    [Fact]
    public async Task Debug_logging_omits_trace_analysis_events()
    {
        var path = await CreateFixture(("1", "Safe", "SCENES", "{}", "{}", "{}"));
        try
        {
            var logger = new RecordingLogger(LogLevel.Debug);
            await new StashFilterAnalyzer(logger: logger).AnalyzeAsync(path, default);
            Assert.DoesNotContain(logger.Entries, entry => entry.EventId.Id is 112 or 113);
            Assert.Contains(logger.Entries, entry => entry.EventId.Id == 110);
            Assert.Contains(logger.Entries, entry => entry.EventId.Id == 103);
        }
        finally { File.Delete(path); }
    }

    [Fact]
    public async Task Information_logging_omits_database_metadata()
    {
        var path = await CreateFixture(("1", "Safe", "SCENES", "{}", "{}", "{}"));
        try
        {
            var logger = new RecordingLogger(LogLevel.Information);
            await new StashFilterAnalyzer(logger: logger).AnalyzeAsync(path, default);
            Assert.DoesNotContain(logger.Entries, entry => entry.EventId.Id == 114);
        }
        finally { File.Delete(path); }
    }

    [Fact]
    public async Task Analysis_logs_expected_rejections_without_error_details()
    {
        var logger = new RecordingLogger();
        var missingPath = Path.Combine(Path.GetTempPath(), $"missing-log-sentinel-{Guid.NewGuid():N}.sqlite");
        await Assert.ThrowsAsync<AnalysisException>(() => new StashFilterAnalyzer(logger: logger).AnalyzeAsync("", default));
        await Assert.ThrowsAsync<AnalysisException>(
            () => new StashFilterAnalyzer(logger: logger).AnalyzeAsync(missingPath, default));
        Assert.Contains(logger.Entries, entry => entry.EventId.Id == 100
            && entry.EventId.Name == "MissingPath" && entry.Level == LogLevel.Warning);
        Assert.Contains(logger.Entries, entry => entry.EventId.Id == 101
            && entry.EventId.Name == "MissingFile" && entry.Level == LogLevel.Warning);
        Assert.DoesNotContain(logger.Entries, entry => entry.EventId.Id == 108);
        Assert.DoesNotContain(logger.Entries, entry => entry.Level == LogLevel.Error);
        AssertLogsDoNotContain(logger, missingPath);
    }

    [Fact]
    public async Task Invalid_saved_filter_schema_logs_rejection_without_path_details()
    {
        var path = Path.Combine(Path.GetTempPath(), $"invalid-schema-path-sentinel-{Guid.NewGuid():N}.sqlite");
        var fixture = await CreateDatabase("CREATE TABLE saved_filters (id TEXT)");
        File.Move(fixture, path, true);
        var logger = new RecordingLogger();
        try
        {
            var exception = await Assert.ThrowsAsync<AnalysisException>(() => new StashFilterAnalyzer(logger: logger).AnalyzeAsync(path, default));
            Assert.Equal("The saved_filters table is missing one or more required columns.", exception.Message);
            var rejection = Assert.Single(logger.Entries, entry => entry.EventId.Id == 108);
            Assert.Equal("Rejected", rejection.EventId.Name);
            Assert.Equal(LogLevel.Warning, rejection.Level);
            Assert.DoesNotContain(logger.Entries, entry => entry.Level == LogLevel.Error);
            AssertLogsDoNotContain(logger, path);
        }
        finally { File.Delete(path); }
    }

    [Fact]
    public async Task Analysis_logs_unexpected_resolver_failure_without_exception_details()
    {
        var path = await CreateFixture(("private-filter-id", "private-filter-name", "SCENES", "{}",
            "{\"tags\":{\"value\":{\"items\":[{\"label\":\"private-tag\"}],\"excluded\":[]}}}", "{}"));
        var logger = new RecordingLogger();
        var exception = new InvalidOperationException("private-exception-message");
        try
        {
            var thrown = await Assert.ThrowsAsync<InvalidOperationException>(
                () => new StashFilterAnalyzer(
                    tagResolver: new ThrowingTagResolver(exception), logger: logger)
                    .AnalyzeAsync(path, default));
            Assert.Same(exception, thrown);
            var error = Assert.Single(logger.Entries, entry => entry.EventId.Id == 107);
            Assert.Equal(LogLevel.Error, error.Level);
            Assert.Equal("Unexpected", error.EventId.Name);
            Assert.Null(error.Exception);
            Assert.Equal("InvalidOperationException", error.Values["ExceptionType"]);
            AssertLogsDoNotContain(
                logger, path, "private-filter-id", "private-filter-name", "private-tag",
                "private-exception-message");
        }
        finally { File.Delete(path); }
    }

    [Fact]
    public async Task Analysis_logs_cancellation_without_error()
    {
        var path = await CreateFixture(("1", "Safe", "SCENES", "{}",
            "{\"tags\":{\"value\":{\"items\":[{\"label\":\"Tag\"}],\"excluded\":[]}}}", "{}"));
        using var cancellation = new CancellationTokenSource();
        var logger = new RecordingLogger();
        try
        {
            await Assert.ThrowsAnyAsync<OperationCanceledException>(
                () => new StashFilterAnalyzer(
                    tagResolver: new CancelingTagResolver(cancellation), logger: logger)
                    .AnalyzeAsync(path, cancellation.Token));
            Assert.Contains(logger.Entries, entry => entry.EventId.Id == 109
                && entry.EventId.Name == "Canceled" && entry.Level == LogLevel.Debug);
            Assert.DoesNotContain(logger.Entries, entry => entry.Level == LogLevel.Error);
        }
        finally { File.Delete(path); }
    }

    [Theory]
    [InlineData("")]
    [InlineData("   ")]
    public void Blank_filter_names_are_not_importable(string name)
    {
        var result = StashFilterAnalyzer.Translate("1", name, "SCENES", "{}", "{}", "{}");

        Assert.False(result.Importable);
        Assert.Null(result.Payload);
        Assert.Contains(result.Rules, rule => rule.Source == "name" && rule.Status == "unsupported"
            && rule.Explanation.Contains("non-blank"));
    }

    [Fact]
    public async Task Database_null_filter_name_is_not_importable()
    {
        var path = await CreateDatabase("CREATE TABLE saved_filters (id TEXT, name TEXT, mode TEXT, find_filter TEXT, object_filter TEXT, ui_options TEXT)");
        await using (var connection = new SqliteConnection($"Data Source={path}"))
        {
            await connection.OpenAsync();
            await using var command = connection.CreateCommand();
            command.CommandText = "INSERT INTO saved_filters VALUES ('1', NULL, 'SCENES', '{}', '{}', '{}')";
            await command.ExecuteNonQueryAsync();
        }
        try
        {
            var response = await new StashFilterAnalyzer().AnalyzeAsync(path, default);
            var result = Assert.Single(response.Filters);

            Assert.Equal("", result.Name);
            Assert.False(result.Importable);
            Assert.Null(result.Payload);
            Assert.Contains(result.Rules, rule => rule.Source == "name" && rule.Status == "unsupported");
        }
        finally { File.Delete(path); }
    }

    [Fact]
    public void Manifest_exposes_permission_gated_top_level_page()
    {
        var extension = new StashFilterImporterExtension();
        ((Cove.Plugins.IManifestAware)extension).ApplyManifest(new Cove.Plugins.ExtensionManifestFile
        {
            Id = "com.midnightrider.stash-filter-importer",
            Name = "Stash Filter Importer",
            Version = "1.0.0"
        });
        var page = Assert.Single(extension.GetUIManifest().Pages);
        Assert.Equal("stash-filter-importer", page.Route);
        Assert.True(page.ShowInNav);
        Assert.NotNull(page.RequiredPermissions);
        Assert.Equal(
            ["import.stash", "savedfilters.write", "performers.read", "tags.read", "studios.read"],
            page.RequiredPermissions);
        Assert.Equal(Cove.Core.Auth.PermissionMode.All, page.RequiredPermissionMode);
    }

    [Fact]
    public void Analyze_endpoint_requires_import_write_and_performer_read_permissions()
    {
        var builder = Microsoft.AspNetCore.Builder.WebApplication.CreateBuilder();
        builder.Services.AddScoped<StashFilterAnalyzer>();
        using var app = builder.Build();
        new StashFilterImporterExtension().MapEndpoints(app);
        var endpoint = Assert.Single(
            ((Microsoft.AspNetCore.Routing.IEndpointRouteBuilder)app).DataSources
                .SelectMany(source => source.Endpoints),
            endpoint => endpoint.DisplayName?.Contains(
                "/api/plugins/com.midnightrider.stash-filter-importer/analyze",
                StringComparison.Ordinal) == true);
        var permission = Assert.Single(endpoint.Metadata.OfType<Cove.Plugins.CovePermissionRequirementMetadata>());
        Assert.Equal(Cove.Core.Auth.PermissionMode.All, permission.Mode);
        Assert.Equal(
            ["import.stash", "savedfilters.write", "performers.read", "tags.read", "studios.read"],
            permission.Permissions);
    }

    [Fact]
    public async Task Missing_file_is_reported_without_disclosing_the_path()
    {
        var exception = await Assert.ThrowsAsync<AnalysisException>(
            () => new StashFilterAnalyzer().AnalyzeAsync(Path.Combine(Path.GetTempPath(), Guid.NewGuid() + ".sqlite"), default));
        Assert.Equal("The supplied Stash database file does not exist.", exception.Message);
    }

    [Fact]
    public async Task Invalid_sqlite_is_reported()
    {
        var path = TempPath();
        await File.WriteAllTextAsync(path, "not sqlite");
        try
        {
            var exception = await Assert.ThrowsAsync<AnalysisException>(() => new StashFilterAnalyzer().AnalyzeAsync(path, default));
            Assert.Equal("The supplied file is not a readable SQLite database.", exception.Message);
        }
        finally { File.Delete(path); }
    }

    [Theory]
    [InlineData("CREATE TABLE other (id INTEGER)", "The saved_filters table is missing one or more required columns.")]
    [InlineData("CREATE TABLE saved_filters (id INTEGER, name TEXT)", "The saved_filters table is missing one or more required columns.")]
    public async Task Missing_table_or_columns_are_reported(string schema, string expected)
    {
        var path = await CreateDatabase(schema);
        try
        {
            var exception = await Assert.ThrowsAsync<AnalysisException>(() => new StashFilterAnalyzer().AnalyzeAsync(path, default));
            Assert.Equal(expected, exception.Message);
        }
        finally { File.Delete(path); }
    }

    [Fact]
    public async Task Malformed_blobs_are_independent_and_do_not_abort_inventory()
    {
        var path = await CreateFixture(
            ("1", "Broken", "SCENES", "{", "{}", "["),
            ("2", "Valid", "SCENES", """{"sort":"title","direction":"DESC","page":9,"per_page":40}""", """{"rating100":{"value":80,"modifier":"GREATER_THAN"}}""", "{}"));
        try
        {
            var response = await new StashFilterAnalyzer().AnalyzeAsync(path, default);
            Assert.Equal(2, response.Filters.Count);
            Assert.Equal(2, response.Filters[0].Rules.Count(x => x.Status == "unsupported"));
            Assert.True(response.Filters[1].Importable);
        }
        finally { File.Delete(path); }
    }

    [Theory]
    [InlineData("42")]
    [InlineData("[]")]
    public async Task Malformed_marker_tag_nodes_do_not_abort_inventory(string malformedTags)
    {
        var path = await CreateFixture(
            ("1", "Broken marker", "SCENE_MARKERS", "{}", $$"""{"tags":{{malformedTags}}}""", "{}"),
            ("2", "Valid", "SCENES", "{}", "{}", "{}"));
        try
        {
            var response = await new StashFilterAnalyzer().AnalyzeAsync(path, default);

            Assert.Equal(2, response.Filters.Count);
            Assert.False(response.Filters[0].Importable);
            Assert.Contains(response.Filters[0].Rules, rule => rule.Source == "object_filter.tags"
                && rule.Status == "unsupported");
            Assert.True(response.Filters[1].Importable);
        }
        finally { File.Delete(path); }
    }

    [Fact]
    public void Every_supported_criterion_preserves_values_modifiers_ranges_and_boolean()
    {
        var result = StashFilterAnalyzer.Translate("opaque", "Compatible", "SCENES",
            """{"q":"term","page":7,"per_page":25,"direction":"ASC","sort":"title"}""",
            """
            {
              "title":{"value":"example","modifier":"INCLUDES"},
              "rating100":{"value":{"value":40,"value2":90},"modifier":"BETWEEN"},
              "o_counter":{"value":2,"modifier":"GREATER_THAN"},
              "play_count":{"value":3,"modifier":"EQUALS"},
              "file_count":{"value":1,"modifier":"NOT_EQUALS"},
              "performer_age":{"value":21,"value2":35,"modifier":"BETWEEN"},
              "performer_favorite":{"value":{"value":"true"},"modifier":"EQUALS"},
              "video_codec":{"value":"h264","modifier":"EQUALS"}
            }
            """, "{}");

        Assert.True(result.Importable);
        Assert.Equal("adapted", result.Status);
        Assert.Equal("opaque", result.SourceId);
        var find = JsonNode.Parse(result.Payload!.FindFilter)!.AsObject();
        Assert.Null(find["page"]);
        Assert.Equal(25, find["perPage"]!.GetValue<int>());
        Assert.Equal("asc", find["direction"]!.GetValue<string>());
        var filter = JsonNode.Parse(result.Payload.ObjectFilter)!.AsObject();
        Assert.Equal(90, filter["ratingCriterion"]!["value2"]!.GetValue<int>());
        Assert.Equal(35, filter["performerAgeCriterion"]!["value2"]!.GetValue<int>());
        Assert.True(filter["performerFavoriteCriterion"]!["value"]!.GetValue<bool>());
        Assert.Null(filter["performerFavoriteCriterion"]!["modifier"]);
        Assert.Equal(8, filter.Count);
    }

    [Theory]
    [InlineData("""{"sort":"o_counter"}""", "like_counter", "adapted")]
    [InlineData("""{"sort":"random_123"}""", "random", "adapted")]
    [InlineData("""{"sort":"rating"}""", "rating", "direct")]
    public void Supported_sort_contract_is_translated(string findJson, string expected, string status)
    {
        var result = StashFilterAnalyzer.Translate("1", "Sort", "SCENES", findJson, "{}", "{}");
        Assert.Equal(expected, JsonNode.Parse(result.Payload!.FindFilter)!["sort"]!.GetValue<string>());
        Assert.Contains(result.Rules, rule => rule.Source == "find_filter.sort" && rule.Status == status);
    }

    [Fact]
    public void Empty_search_and_saved_page_are_omitted_without_analysis_rules()
    {
        var result = StashFilterAnalyzer.Translate(
            "1", "Defaults", "SCENES", """{"q":"","page":7,"sort":"title"}""", "{}", "{}");

        var find = JsonNode.Parse(result.Payload!.FindFilter)!.AsObject();
        Assert.Null(find["q"]);
        Assert.Null(find["page"]);
        Assert.DoesNotContain(result.Rules, rule => rule.Source is "find_filter.q" or "find_filter.page");
        Assert.Equal("direct", result.Status);
    }

    [Theory]
    [InlineData(0, 0)]
    [InlineData(1, 2.75)]
    [InlineData(2, 5.25)]
    [InlineData(3, 8)]
    public void Stash_zoom_positions_are_normalized_to_Cove_card_size_levels(int sourceZoom, double targetZoom)
    {
        var result = StashFilterAnalyzer.Translate(
            "1", "Zoom", "SCENES", "{}", "{}", $$"""{"zoom_index":{{sourceZoom}}}""");

        Assert.True(result.Importable);
        Assert.Equal("adapted", result.Status);
        Assert.Equal(targetZoom, JsonNode.Parse(result.Payload!.UIOptions)!["zoomLevel"]!.GetValue<double>());
        Assert.Contains(result.Rules, rule =>
            rule.Source == "ui_options.zoom_index"
            && rule.Target == "uiOptions.zoomLevel"
            && rule.Status == "adapted");
    }

    [Theory]
    [InlineData(0, "grid")]
    [InlineData(1, "list")]
    [InlineData(2, "wall")]
    [InlineData(3, "tagger")]
    public void Stash_display_modes_are_translated_to_Cove_names(int sourceMode, string targetMode)
    {
        var result = StashFilterAnalyzer.Translate(
            "1", "Layout", "SCENES", "{}", "{}", $$"""{"display_mode":{{sourceMode}}}""");

        Assert.True(result.Importable);
        Assert.Equal(targetMode, JsonNode.Parse(result.Payload!.UIOptions)!["displayMode"]!.GetValue<string>());
        Assert.Contains(result.Rules, rule =>
            rule.Source == "ui_options.display_mode"
            && rule.Target == "uiOptions.displayMode"
            && rule.Status == "adapted");
    }

    [Fact]
    public void Segment_filters_keep_zoom_but_omit_incompatible_display_modes()
    {
        var result = StashFilterAnalyzer.Translate(
            "1", "Marker layout", "SCENE_MARKERS", "{}", "{}",
            """{"display_mode":2,"zoom_index":2}""");

        Assert.True(result.Importable);
        var ui = JsonNode.Parse(result.Payload!.UIOptions)!.AsObject();
        Assert.Null(ui["displayMode"]);
        Assert.Equal(5.25, ui["zoomLevel"]!.GetValue<double>());
        Assert.Contains(result.Rules, rule =>
            rule.Source == "ui_options.display_mode"
            && rule.Target is null
            && rule.Status == "adapted");
    }

    [Theory]
    [InlineData("TAGS")]
    [InlineData("STUDIOS")]
    public void Target_lists_without_wall_mode_omit_that_Stash_layout_nonfatally(string sourceMode)
    {
        var result = StashFilterAnalyzer.Translate(
            "1", "Layout", sourceMode, "{}", "{}", """{"display_mode":2}""");

        Assert.True(result.Importable);
        Assert.Null(JsonNode.Parse(result.Payload!.UIOptions)!["displayMode"]);
        Assert.Contains(result.Rules, rule =>
            rule.Source == "ui_options.display_mode"
            && rule.Target is null
            && rule.Status == "adapted");
    }

    [Theory]
    [InlineData("""{"zoom_index":4}""")]
    [InlineData("""{"zoom_index":"large"}""")]
    [InlineData("""{"display_mode":9}""")]
    [InlineData("""{"future_layout":true}""")]
    public void Invalid_or_unknown_Stash_UI_options_are_omitted_without_blocking_import(string uiOptions)
    {
        var result = StashFilterAnalyzer.Translate("1", "Layout", "SCENES", "{}", "{}", uiOptions);

        Assert.True(result.Importable);
        Assert.Equal("adapted", result.Status);
        Assert.Empty(JsonNode.Parse(result.Payload!.UIOptions)!.AsObject());
        Assert.Contains(result.Rules, rule => rule.Source.StartsWith("ui_options.") && rule.Status == "adapted");
    }

    [Fact]
    public void Tag_filters_map_parent_relations_scalar_criteria_and_sorts_to_cove()
    {
        var result = StashFilterAnalyzer.Translate(
            "1", "Tag matrix", "TAGS",
            """{"sort":"name","direction":"ASC","page":1,"per_page":40}""",
            """
            {
              "favorite":{"modifier":"EQUALS","value":"true"},
              "description":{"modifier":"IS_NULL","value":""},
              "parents":{"modifier":"INCLUDES_ALL","value":{"depth":0,"excluded":[{"id":"2","label":"Excluded"}],"items":[{"id":"1","label":"Parent"}]}},
              "child_count":{"modifier":"EQUALS","value":{"value":0}},
              "scene_count":{"modifier":"GREATER_THAN","value":{"value":3}},
              "stash_id_endpoint":{"modifier":"NOT_NULL","value":{"endpoint":"https://metadata.invalid/graphql","stashID":""}}
            }
            """, "{}", null,
            new Dictionary<string, TagResolution>(StringComparer.OrdinalIgnoreCase)
            {
                ["Parent"] = new(101, "matched"),
                ["Excluded"] = new(202, "matched")
            });

        Assert.True(result.Importable);
        Assert.Equal("Tags", result.TargetMode);
        Assert.Equal("Tags", result.Payload!.Mode);
        var find = JsonNode.Parse(result.Payload.FindFilter)!;
        Assert.Equal("name", find["sort"]!.GetValue<string>());
        Assert.Equal("asc", find["direction"]!.GetValue<string>());
        var filter = JsonNode.Parse(result.Payload.ObjectFilter)!;
        Assert.True(filter["favoriteCriterion"]!["value"]!.GetValue<bool>());
        Assert.Equal("IS_NULL", filter["descriptionCriterion"]!["modifier"]!.GetValue<string>());
        Assert.Equal(101, filter["parentsCriterion"]!["value"]![0]!.GetValue<int>());
        Assert.Equal(202, filter["parentsCriterion"]!["excludes"]![0]!.GetValue<int>());
        Assert.Null(filter["parentsCriterion"]!["depth"]);
        Assert.Equal(0, filter["childCountCriterion"]!["value"]!.GetValue<int>());
        Assert.Equal(3, filter["videoCountCriterion"]!["value"]!.GetValue<int>());
        Assert.Equal("https://metadata.invalid/graphql", filter["remoteIdCriterion"]!["value"]!.GetValue<string>());
    }

    [Theory]
    [InlineData("""{"parents":{"modifier":"INCLUDES_ALL","value":{"depth":-1,"excluded":[],"items":[{"id":1,"label":"Parent"}]}}}""", "object_filter.parents")]
    [InlineData("""{"is_missing":{"modifier":"EQUALS","value":"image"}}""", "object_filter.is_missing")]
    public void Tag_rules_without_executable_cove_semantics_remain_unsupported(string objectFilter, string source)
    {
        var result = StashFilterAnalyzer.Translate(
            "1", "Unsupported tag rule", "TAGS", "{}", objectFilter, "{}", null,
            new Dictionary<string, TagResolution>(StringComparer.OrdinalIgnoreCase)
            {
                ["Parent"] = new(101, "matched")
            });

        Assert.False(result.Importable);
        Assert.Contains(result.Rules, rule => rule.Source == source && rule.Status == "unsupported");
    }

    [Fact]
    public void Recursive_tag_parent_rule_names_the_stash_tag_that_cannot_be_imported()
    {
        var result = StashFilterAnalyzer.Translate(
            "1", "Unsupported recursive parent", "TAGS", "{}",
            """{"parents":{"modifier":"INCLUDES_ALL","value":{"depth":-1,"excluded":[],"items":[{"id":1,"label":"Parent tag"}]}}}""", "{}");

        var rule = Assert.Single(result.Rules, rule => rule.Source == "object_filter.parents");
        Assert.Equal("unsupported", rule.Status);
        Assert.Contains("Parent tag", rule.Explanation);
    }

    [Fact]
    public void Recursive_tag_parent_rule_looks_up_a_tag_name_when_the_filter_only_has_an_id()
    {
        var result = StashFilterAnalyzer.Translate(
            "1", "Unsupported recursive parent", "TAGS", "{}",
            """{"parents":{"modifier":"INCLUDES_ALL","value":{"depth":-1,"excluded":[],"items":[{"id":1}]}}}""", "{}",
            stashTagNames: new Dictionary<int, string> { [1] = "Parent tag from Stash" });

        var rule = Assert.Single(result.Rules, rule => rule.Source == "object_filter.parents");
        Assert.Contains("Parent tag from Stash", rule.Explanation);
    }

    [Fact]
    public async Task Analyzer_reads_stash_tag_names_for_recursive_parent_rule_explanations()
    {
        var path = await CreateFixture(("1", "Unsupported recursive parent", "TAGS", "{}",
            """{"parents":{"modifier":"INCLUDES_ALL","value":{"depth":-1,"excluded":[],"items":[{"id":1}]}}}""", "{}"));
        try
        {
            await using var connection = new SqliteConnection($"Data Source={path}");
            await connection.OpenAsync();
            await using var command = connection.CreateCommand();
            command.CommandText = "CREATE TABLE tags (id INTEGER, name TEXT); INSERT INTO tags VALUES (1, 'Parent tag from Stash');";
            await command.ExecuteNonQueryAsync();

            var response = await new StashFilterAnalyzer().AnalyzeAsync(path, default);

            var rule = Assert.Single(Assert.Single(response.Filters).Rules,
                rule => rule.Source == "object_filter.parents");
            Assert.Contains("Parent tag from Stash", rule.Explanation);
        }
        finally { File.Delete(path); }
    }

    [Theory]
    [InlineData("Missing parent", "missing", "has no exact case-insensitive match in Cove")]
    [InlineData("Ambiguous parent", "ambiguous", "matches multiple Cove tags")]
    public void Unresolved_tag_parent_rule_names_the_stash_tags_that_cannot_be_mapped(
        string tagName, string resolutionStatus, string expectedExplanation)
    {
        var result = StashFilterAnalyzer.Translate(
            "1", "Unsupported parent reference", "TAGS", "{}",
            """{"parents":{"modifier":"INCLUDES_ALL","value":{"depth":0,"excluded":[],"items":[{"id":1,"label":"TAG_NAME"}]}}}"""
                .Replace("TAG_NAME", tagName), "{}", null,
            new Dictionary<string, TagResolution>(StringComparer.OrdinalIgnoreCase)
            {
                [tagName] = new(null, resolutionStatus)
            });

        var rule = Assert.Single(result.Rules, rule => rule.Source == "object_filter.parents");
        Assert.Equal("unsupported", rule.Status);
        Assert.Contains(expectedExplanation, rule.Explanation);
        Assert.Contains(tagName, rule.Explanation);
    }

    [Theory]
    [InlineData("""{"scene_count":{"modifier":"IS_NULL","value":{"value":0}}}""", "object_filter.scene_count")]
    [InlineData("""{"child_count":{"modifier":"NOT_NULL","value":{"value":0}}}""", "object_filter.child_count")]
    [InlineData("""{"favorite":{"modifier":"NOT_EQUALS","value":"true"}}""", "object_filter.favorite")]
    public void Tag_criteria_reject_modifiers_that_cove_or_stash_do_not_execute_equivalently(
        string objectFilter, string source)
    {
        var result = StashFilterAnalyzer.Translate(
            "1", "Unsupported tag modifier", "TAGS", "{}", objectFilter, "{}");

        Assert.False(result.Importable);
        Assert.Contains(result.Rules, rule => rule.Source == source && rule.Status == "unsupported");
    }

    [Theory]
    [InlineData("name")]
    [InlineData("created_at")]
    [InlineData("updated_at")]
    [InlineData("random_123")]
    public void Tag_sorts_map_to_cove(string sourceSort)
    {
        var result = StashFilterAnalyzer.Translate(
            "1", "Tag sort", "TAGS", $$"""{"sort":"{{sourceSort}}"}""", "{}", "{}");

        Assert.True(result.Importable);
        Assert.Equal(sourceSort.StartsWith("random_", StringComparison.Ordinal) ? "random" : sourceSort,
            JsonNode.Parse(result.Payload!.FindFilter)!["sort"]!.GetValue<string>());
        Assert.Contains(result.Rules, rule => rule.Source == "find_filter.sort"
            && rule.Status == (sourceSort == "name" || sourceSort.StartsWith("random_", StringComparison.Ordinal)
                ? "adapted"
                : "direct"));
    }

    [Fact]
    public async Task Analyzer_resolves_tag_names_used_by_tag_parent_filters()
    {
        var path = await CreateFixture(("1", "Tag parents", "TAGS", "{}",
            """{"parents":{"modifier":"INCLUDES_ALL","value":{"depth":0,"excluded":[{"id":2,"label":"Excluded"}],"items":[{"id":1,"label":"Parent"}]}}}""",
            "{}"));
        try
        {
            var resolver = new RecordingTagResolver();
            var response = await new StashFilterAnalyzer(tagResolver: resolver).AnalyzeAsync(path, default);

            Assert.True(Assert.Single(response.Filters).Importable);
            Assert.Equal(["Excluded", "Parent"], resolver.Names.OrderBy(name => name).ToArray());
        }
        finally { File.Delete(path); }
    }

    [Fact]
    public void Studio_text_paging_sort_and_remote_id_filters_map_to_cove()
    {
        var result = StashFilterAnalyzer.Translate(
            "1", "Studio matrix", "STUDIOS",
            """{"q":"matrix studio","page":4,"per_page":60,"sort":"created_at","direction":"DESC"}""",
            """{"stash_id_endpoint":{"modifier":"IS_NULL","value":{"endpoint":"https://metadata.invalid/graphql","stashID":""}}}""",
            "{}");

        Assert.True(result.Importable);
        Assert.Equal("Studios", result.TargetMode);
        Assert.Equal("Studios", result.Payload!.Mode);
        var find = JsonNode.Parse(result.Payload.FindFilter)!;
        Assert.Equal("matrix studio", find["q"]!.GetValue<string>());
        Assert.Null(find["page"]);
        Assert.Equal(60, find["perPage"]!.GetValue<int>());
        Assert.Equal("created_at", find["sort"]!.GetValue<string>());
        Assert.Equal("desc", find["direction"]!.GetValue<string>());
        var filter = JsonNode.Parse(result.Payload.ObjectFilter)!;
        Assert.Equal("https://metadata.invalid/graphql", filter["remoteIdCriterion"]!["value"]!.GetValue<string>());
        Assert.Equal("IS_NULL", filter["remoteIdCriterion"]!["modifier"]!.GetValue<string>());
    }

    [Theory]
    [InlineData("name", "name", "adapted")]
    [InlineData("created_at", "created_at", "direct")]
    [InlineData("updated_at", "updated_at", "direct")]
    [InlineData("scenes_count", "video_count", "adapted")]
    [InlineData("random_123", "random", "adapted")]
    public void Studio_sorts_map_to_cove(string sourceSort, string targetSort, string status)
    {
        var result = StashFilterAnalyzer.Translate(
            "1", "Studio sort", "STUDIOS", $$"""{"sort":"{{sourceSort}}"}""", "{}", "{}");

        Assert.True(result.Importable);
        Assert.Equal(targetSort, JsonNode.Parse(result.Payload!.FindFilter)!["sort"]!.GetValue<string>());
        Assert.Contains(result.Rules, rule => rule.Source == "find_filter.sort" && rule.Status == status);
    }

    [Fact]
    public void Unsupported_studio_object_rules_block_the_complete_filter()
    {
        var result = StashFilterAnalyzer.Translate(
            "1", "Unsupported studio", "STUDIOS", "{}",
            """{"mystery":{"modifier":"EQUALS","value":1}}""", "{}");

        Assert.False(result.Importable);
        Assert.Contains(result.Rules, rule => rule.Source == "object_filter.mystery" && rule.Status == "unsupported");
    }

    [Fact]
    public void Scene_marker_primary_tag_duration_and_sort_map_to_cove_derived_segments()
    {
        var result = StashFilterAnalyzer.Translate(
            "1", "Marker matrix", "SCENE_MARKERS",
            """{"page":3,"per_page":40,"sort":"created_at","direction":"DESC"}""",
            """
            {
              "duration":{"modifier":"BETWEEN","value":{"value":3.5,"value2":5.25}},
              "tags":{"modifier":"INCLUDES_ALL","value":{"depth":0,"excluded":[],"items":[{"id":"1","label":"Marker Tag"}]}}
            }
            """, "{}", null,
            new Dictionary<string, TagResolution>(StringComparer.OrdinalIgnoreCase)
            {
                ["Marker Tag"] = new(404, "matched")
            }, null,
            new Dictionary<int, MarkerTagUsage>
            {
                [1] = new(IsPrimary: true, IsSecondary: false)
            });

        Assert.True(result.Importable);
        Assert.Equal("Segments", result.TargetMode);
        Assert.Equal("Segments", result.Payload!.Mode);
        var find = JsonNode.Parse(result.Payload.FindFilter)!;
        Assert.Null(find["page"]);
        Assert.Equal(40, find["perPage"]!.GetValue<int>());
        Assert.Equal("segment_created_at", find["sort"]!.GetValue<string>());
        Assert.Equal("desc", find["direction"]!.GetValue<string>());
        var filter = JsonNode.Parse(result.Payload.ObjectFilter)!;
        Assert.Equal(404, filter["rawTagsCriterion"]!["value"]![0]!.GetValue<int>());
        Assert.Equal("INCLUDES", filter["rawTagsCriterion"]!["modifier"]!.GetValue<string>());
        Assert.Equal(3.5, filter["rawDurationCriterion"]!["value"]!.GetValue<double>());
        Assert.Equal(5.25, filter["rawDurationCriterion"]!["value2"]!.GetValue<double>());
        Assert.Equal("BETWEEN", filter["rawDurationCriterion"]!["modifier"]!.GetValue<string>());
        Assert.Equal("user", filter["rawSourceCriterion"]!["value"]!.GetValue<string>());
        Assert.Equal("tag", filter["rawKindCriterion"]!["value"]!.GetValue<string>());
        Assert.Equal("adapted", result.Status);
    }

    [Fact]
    public void Scene_marker_without_end_time_maps_to_short_cove_segments()
    {
        var result = StashFilterAnalyzer.Translate(
            "1", "Marker without end", "SCENE_MARKERS", "{}",
            """{"duration":{"modifier":"IS_NULL","value":{}}}""", "{}");

        Assert.True(result.Importable);
        var criterion = JsonNode.Parse(result.Payload!.ObjectFilter)!["rawDurationCriterion"]!;
        Assert.Equal(1, criterion["value"]!.GetValue<int>());
        Assert.Equal("LESS_THAN", criterion["modifier"]!.GetValue<string>());
        Assert.Contains(result.Rules, rule => rule.Source == "object_filter.duration"
            && rule.Target == "rawDurationCriterion" && rule.Status == "adapted");
    }

    [Theory]
    [InlineData("created_at", "segment_created_at", "adapted")]
    [InlineData("updated_at", "segment_updated_at", "adapted")]
    [InlineData("duration", "span_duration", "adapted")]
    [InlineData("seconds", "span_start", "adapted")]
    [InlineData("random_123", "random", "adapted")]
    public void Scene_marker_sorts_map_to_cove_derived_segments(string sourceSort, string targetSort, string status)
    {
        var result = StashFilterAnalyzer.Translate(
            "1", "Marker sort", "SCENE_MARKERS", $$"""{"sort":"{{sourceSort}}"}""", "{}", "{}");

        Assert.True(result.Importable);
        Assert.Equal(targetSort, JsonNode.Parse(result.Payload!.FindFilter)!["sort"]!.GetValue<string>());
        Assert.Contains(result.Rules, rule => rule.Source == "find_filter.sort" && rule.Status == status);
    }

    [Fact]
    public void Scene_marker_timestamps_map_to_raw_segment_criteria()
    {
        var result = StashFilterAnalyzer.Translate(
            "1", "Marker timestamps", "SCENE_MARKERS", "{}",
            """
            {
              "created_at":{"modifier":"GREATER_THAN","value":{"value":"2026-01-02T03:04:05Z"}},
              "updated_at":{"modifier":"BETWEEN","value":{"value":"2026-02-03T04:05:06Z","value2":"2026-03-04T05:06:07Z"}}
            }
            """, "{}");

        Assert.True(result.Importable);
        var filter = JsonNode.Parse(result.Payload!.ObjectFilter)!;
        Assert.Equal("2026-01-02T03:04:05Z", filter["rawCreatedAtCriterion"]!["value"]!.GetValue<string>());
        Assert.Equal("GREATER_THAN", filter["rawCreatedAtCriterion"]!["modifier"]!.GetValue<string>());
        Assert.Equal("2026-02-03T04:05:06Z", filter["rawUpdatedAtCriterion"]!["value"]!.GetValue<string>());
        Assert.Equal("2026-03-04T05:06:07Z", filter["rawUpdatedAtCriterion"]!["value2"]!.GetValue<string>());
        Assert.Equal("BETWEEN", filter["rawUpdatedAtCriterion"]!["modifier"]!.GetValue<string>());
        Assert.Contains(result.Rules, rule => rule.Source == "object_filter.created_at" && rule.Status == "adapted");
        Assert.Contains(result.Rules, rule => rule.Source == "object_filter.updated_at" && rule.Status == "adapted");
    }

    [Fact]
    public void Scene_marker_invalid_timestamp_remains_unsupported()
    {
        var result = StashFilterAnalyzer.Translate(
            "1", "Invalid marker timestamp", "SCENE_MARKERS", "{}",
            """{"created_at":{"modifier":"BETWEEN","value":{"value":"not-a-date"}}}""", "{}");

        Assert.False(result.Importable);
        Assert.Contains(result.Rules,
            rule => rule.Source == "object_filter.created_at" && rule.Status == "unsupported");
    }

    [Theory]
    [InlineData("""{"tags":{"modifier":"INCLUDES_ALL","value":{"depth":-1,"excluded":[],"items":[{"id":1,"label":"One"}]}}}""", "object_filter.tags")]
    [InlineData("""{"tags":{"modifier":"INCLUDES_ALL","value":{"depth":0,"excluded":[{"id":2,"label":"Two"}],"items":[]}}}""", "object_filter.tags")]
    [InlineData("""{"tags":{"modifier":"INCLUDES_ALL","value":{"depth":0,"excluded":{},"items":[{"id":1,"label":"One"}]}}}""", "object_filter.tags")]
    [InlineData("""{"tags":{"modifier":"INCLUDES_ALL","value":{"depth":0,"excluded":[],"items":[{"id":1,"label":"One"},{"id":2,"label":"Two"}]}}}""", "object_filter.tags")]
    [InlineData("""{"duration":{"modifier":"IS_NULL","value":{},"value2":0}}""", "object_filter.duration")]
    [InlineData("""{"duration":{"modifier":"NOT_NULL","value":{}}}""", "object_filter.duration")]
    [InlineData("""{"scene_tags":{"modifier":"INCLUDES_ALL","value":{"depth":0,"excluded":[],"items":[{"id":1,"label":"One"}]}}}""", "object_filter.scene_tags")]
    public void Scene_marker_rules_without_raw_segment_equivalents_remain_unsupported(
        string objectFilter, string source)
    {
        var resolutions = new Dictionary<string, TagResolution>(StringComparer.OrdinalIgnoreCase)
        {
            ["One"] = new(101, "matched"),
            ["Two"] = new(202, "matched")
        };
        var result = StashFilterAnalyzer.Translate(
            "1", "Unsupported marker", "SCENE_MARKERS", "{}", objectFilter, "{}", null, resolutions, null,
            new Dictionary<int, MarkerTagUsage>
            {
                [1] = new(IsPrimary: true, IsSecondary: false),
                [2] = new(IsPrimary: true, IsSecondary: false)
            });

        Assert.False(result.Importable);
        Assert.Contains(result.Rules, rule => rule.Source == source && rule.Status == "unsupported");
    }

    [Theory]
    [InlineData(true, true)]
    [InlineData(false, true)]
    [InlineData(false, false)]
    public void Scene_marker_secondary_mixed_or_unknown_tags_remain_unsupported(bool isPrimary, bool isSecondary)
    {
        var result = StashFilterAnalyzer.Translate(
            "1", "Marker tag role", "SCENE_MARKERS", "{}",
            """{"tags":{"modifier":"INCLUDES_ALL","value":{"depth":0,"excluded":[],"items":[{"id":1,"label":"One"}]}}}""",
            "{}", null,
            new Dictionary<string, TagResolution>(StringComparer.OrdinalIgnoreCase)
            {
                ["One"] = new(101, "matched")
            }, null,
            new Dictionary<int, MarkerTagUsage>
            {
                [1] = new(isPrimary, isSecondary)
            });

        Assert.False(result.Importable);
        Assert.Contains(result.Rules, rule => rule.Source == "object_filter.tags" && rule.Status == "unsupported");
    }

    [Fact]
    public void Scene_marker_recursive_primary_tag_maps_to_cove_segment_subtags()
    {
        var result = StashFilterAnalyzer.Translate(
            "1", "Recursive marker tag", "SCENE_MARKERS", "{}",
            """{"tags":{"modifier":"INCLUDES_ALL","value":{"depth":-1,"excluded":[],"items":[{"id":1,"label":"Parent"}]}}}""",
            "{}", null,
            new Dictionary<string, TagResolution>(StringComparer.OrdinalIgnoreCase)
            {
                ["Parent"] = new(101, "matched")
            }, null,
            new Dictionary<int, MarkerTagUsage>
            {
                [1] = new(IsPrimary: true, IsSecondary: false, HasPrimaryInHierarchy: true)
            });

        Assert.True(result.Importable);
        Assert.Equal("adapted", result.Status);
        var criterion = JsonNode.Parse(result.Payload!.ObjectFilter)!["rawTagsCriterion"]!;
        Assert.Equal(101, criterion["value"]![0]!.GetValue<int>());
        Assert.Equal(-1, criterion["depth"]!.GetValue<int>());
    }

    [Fact]
    public async Task Analysis_uses_tag_hierarchy_to_classify_recursive_marker_tags()
    {
        var path = await CreateDatabase("""
            CREATE TABLE saved_filters (id TEXT, name TEXT, mode TEXT, find_filter TEXT, object_filter TEXT, ui_options TEXT);
            CREATE TABLE scene_markers (id INTEGER PRIMARY KEY, primary_tag_id INTEGER);
            CREATE TABLE scene_markers_tags (scene_marker_id INTEGER NOT NULL, tag_id INTEGER NOT NULL);
            CREATE TABLE tags_relations (parent_id INTEGER NOT NULL, child_id INTEGER NOT NULL);
            INSERT INTO scene_markers VALUES (1, 12), (2, 22), (3, 30);
            INSERT INTO scene_markers_tags VALUES (1, 12), (2, 22), (2, 21), (3, 30), (3, 31);
            INSERT INTO tags_relations VALUES
                (11, 12), (10, 11),
                (20, 21), (20, 22),
                (30, 31), (31, 30),
                (40, 10), (40, 20);
            INSERT INTO saved_filters VALUES
                ('1', 'Primary descendants', 'SCENE_MARKERS', '{}', '{"tags":{"modifier":"INCLUDES_ALL","value":{"depth":-1,"excluded":[],"items":[{"id":10,"label":"Primary Parent"}]}}}', '{}'),
                ('2', 'Secondary descendants', 'SCENE_MARKERS', '{}', '{"tags":{"modifier":"INCLUDES_ALL","value":{"depth":-1,"excluded":[],"items":[{"id":20,"label":"Secondary Parent"}]}}}', '{}'),
                ('3', 'Mixed descendants', 'SCENE_MARKERS', '{}', '{"tags":{"modifier":"INCLUDES_ALL","value":{"depth":-1,"excluded":[],"items":[{"id":40,"label":"Mixed Parent"}]}}}', '{}'),
                ('4', 'Cyclic descendants', 'SCENE_MARKERS', '{}', '{"tags":{"modifier":"INCLUDES_ALL","value":{"depth":-1,"excluded":[],"items":[{"id":30,"label":"Cyclic Parent"}]}}}', '{}'),
                ('5', 'Exact primary', 'SCENE_MARKERS', '{}', '{"tags":{"modifier":"INCLUDES_ALL","value":{"depth":0,"excluded":[],"items":[{"id":30,"label":"Exact Parent"}]}}}', '{}');
            """);
        try
        {
            var result = await new StashFilterAnalyzer(tagResolver: new RecordingTagResolver())
                .AnalyzeAsync(path, default);

            var primary = result.Filters.Single(filter => filter.Name == "Primary descendants");
            Assert.True(primary.Importable);
            Assert.Equal(-1,
                JsonNode.Parse(primary.Payload!.ObjectFilter)!["rawTagsCriterion"]!["depth"]!.GetValue<int>());
            Assert.False(result.Filters.Single(filter => filter.Name == "Secondary descendants").Importable);
            Assert.False(result.Filters.Single(filter => filter.Name == "Mixed descendants").Importable);
            Assert.False(result.Filters.Single(filter => filter.Name == "Cyclic descendants").Importable);
            Assert.True(result.Filters.Single(filter => filter.Name == "Exact primary").Importable);
        }
        finally
        {
            File.Delete(path);
        }
    }

    [Fact]
    public async Task Analysis_uses_marker_tables_to_distinguish_primary_from_secondary_tags()
    {
        var path = await CreateDatabase("""
            CREATE TABLE saved_filters (id TEXT, name TEXT, mode TEXT, find_filter TEXT, object_filter TEXT, ui_options TEXT);
            CREATE TABLE scene_markers (id INTEGER PRIMARY KEY, primary_tag_id INTEGER);
            CREATE TABLE scene_markers_tags (scene_marker_id INTEGER NOT NULL, tag_id INTEGER NOT NULL);
            INSERT INTO scene_markers VALUES (1, 1), (2, 3);
            INSERT INTO scene_markers_tags VALUES (1, 1), (1, 2), (1, 3), (2, 3);
            INSERT INTO saved_filters VALUES
                ('1', 'Primary', 'SCENE_MARKERS', '{}', '{"tags":{"modifier":"INCLUDES_ALL","value":{"depth":0,"excluded":[],"items":[{"id":1,"label":"Primary"}]}}}', '{}'),
                ('2', 'Secondary', 'SCENE_MARKERS', '{}', '{"tags":{"modifier":"INCLUDES_ALL","value":{"depth":0,"excluded":[],"items":[{"id":2,"label":"Secondary"}]}}}', '{}'),
                ('3', 'Mixed', 'SCENE_MARKERS', '{}', '{"tags":{"modifier":"INCLUDES_ALL","value":{"depth":0,"excluded":[],"items":[{"id":3,"label":"Mixed"}]}}}', '{}');
            """);
        try
        {
            var result = await new StashFilterAnalyzer(tagResolver: new RecordingTagResolver())
                .AnalyzeAsync(path, default);

            Assert.True(result.Filters.Single(filter => filter.Name == "Primary").Importable);
            Assert.False(result.Filters.Single(filter => filter.Name == "Secondary").Importable);
            Assert.False(result.Filters.Single(filter => filter.Name == "Mixed").Importable);
        }
        finally
        {
            File.Delete(path);
        }
    }

    [Fact]
    public async Task Recursive_marker_tag_includes_its_direct_usage_without_tag_relations()
    {
        var path = await CreateDatabase("""
            CREATE TABLE saved_filters (id TEXT, name TEXT, mode TEXT, find_filter TEXT, object_filter TEXT, ui_options TEXT);
            CREATE TABLE scene_markers (id INTEGER PRIMARY KEY, primary_tag_id INTEGER);
            INSERT INTO scene_markers VALUES (1, 10);
            INSERT INTO saved_filters VALUES
                ('1', 'Recursive primary', 'SCENE_MARKERS', '{}', '{"tags":{"modifier":"INCLUDES_ALL","value":{"depth":-1,"excluded":[],"items":[{"id":10,"label":"Primary"}]}}}', '{}');
            """);
        try
        {
            var response = await new StashFilterAnalyzer(tagResolver: new RecordingTagResolver()).AnalyzeAsync(path, default);

            Assert.True(Assert.Single(response.Filters).Importable);
        }
        finally { File.Delete(path); }
    }

    [Fact]
    public void Scene_marker_scene_id_sort_remains_unsupported()
    {
        var result = StashFilterAnalyzer.Translate(
            "1", "Marker scene sort", "SCENE_MARKERS", """{"sort":"scene_id"}""", "{}", "{}");

        Assert.False(result.Importable);
        Assert.Contains(result.Rules, rule => rule.Source == "find_filter.sort" && rule.Status == "unsupported");
    }

    [Fact]
    public void Non_string_search_is_unsupported_instead_of_silently_dropped()
    {
        var result = StashFilterAnalyzer.Translate(
            "1", "Malformed search", "SCENES", """{"q":123}""", "{}", "{}");

        Assert.False(result.Importable);
        Assert.Contains(result.Rules, rule =>
            rule.Source == "find_filter.q" && rule.Status == "unsupported");
    }

    [Theory]
    [InlineData("AUDIO", "{}", "{}", "mode")]
    [InlineData("SCENES", """{"sort":"mystery"}""", "{}", "find_filter.sort")]
    [InlineData("SCENES", "{}", """{"tags":{"value":[1],"modifier":"INCLUDES"}}""", "object_filter.tags")]
    [InlineData("SCENES", "{}", """{"rating100":{"value":1,"modifier":"MYSTERY"}}""", "object_filter.rating100")]
    [InlineData("SCENES", "{}", """{"resolution":{"value":"HD","modifier":"EQUALS"}}""", "object_filter.resolution")]
    [InlineData("SCENES", "{}", """{"hashes":{"value":"x","modifier":"EQUALS"}}""", "object_filter.hashes")]
    [InlineData("SCENES", "{}", """{"markers":{"value":true,"modifier":"EQUALS"}}""", "object_filter.markers")]
    [InlineData("SCENES", "{}", """{"rating100":{"value":1,"modifier":"EQUALS","items":[]}}""", "object_filter.rating100")]
    public void Unsupported_rules_are_visible_and_prevent_the_complete_import(string mode, string find, string filter, string source)
    {
        var result = StashFilterAnalyzer.Translate("1", "Unsupported", mode, find, filter, "{}");
        Assert.False(result.Importable);
        Assert.Null(result.Payload);
        Assert.Equal("unsupported", result.Status);
        Assert.Contains(result.Rules, rule => rule.Source == source && rule.Status == "unsupported");
    }

    [Fact]
    public void Performer_favorite_gender_and_scene_count_sort_map_to_cove()
    {
        var result = StashFilterAnalyzer.Translate(
            "1", "Performer favorite and gender", "PERFORMERS",
            """{"sort":"scenes_count","direction":"DESC","page":1,"per_page":250}""",
            """{"filter_favorites":{"modifier":"EQUALS","value":"false"},"gender":{"modifier":"EQUALS","value":"Female"}}""",
            "{}");

        Assert.True(result.Importable);
        Assert.Equal("Performers", result.TargetMode);
        Assert.Equal("Performers", result.Payload!.Mode);
        var find = JsonNode.Parse(result.Payload.FindFilter)!;
        Assert.Equal("video_count", find["sort"]!.GetValue<string>());
        Assert.Equal("desc", find["direction"]!.GetValue<string>());
        Assert.Equal(250, find["perPage"]!.GetValue<int>());
        Assert.Null(find["page"]);
        var filter = JsonNode.Parse(result.Payload.ObjectFilter)!;
        Assert.False(filter["favoriteCriterion"]!["value"]!.GetValue<bool>());
        Assert.Equal("Female", filter["genderCriterion"]!["value"]!.GetValue<string>());
        Assert.Equal("EQUALS", filter["genderCriterion"]!["modifier"]!.GetValue<string>());
    }

    [Theory]
    [InlineData("MALE", "Male")]
    [InlineData("FEMALE", "Female")]
    [InlineData("TRANSGENDER_MALE", "TransgenderMale")]
    [InlineData("TRANSGENDER_FEMALE", "TransgenderFemale")]
    [InlineData("INTERSEX", "Intersex")]
    [InlineData("NON_BINARY", "NonBinary")]
    [InlineData("TransgenderMale", "TransgenderMale")]
    public void Performer_gender_values_are_normalized_to_cove_enum_names(string sourceGender, string targetGender)
    {
        var result = StashFilterAnalyzer.Translate(
            "1", "Performer gender", "PERFORMERS", "{}",
            "{\"gender\":{\"modifier\":\"EQUALS\",\"value\":\"" + sourceGender + "\"}}", "{}");

        Assert.True(result.Importable);
        var criterion = JsonNode.Parse(result.Payload!.ObjectFilter)!["genderCriterion"]!;
        Assert.Equal(targetGender, criterion["value"]!.GetValue<string>());
        Assert.Equal("EQUALS", criterion["modifier"]!.GetValue<string>());
    }

    [Theory]
    [InlineData("INCLUDES", "[\"Male\"]", "MATCHES_REGEX", "^(?:Male)$")]
    [InlineData("INCLUDES", "[\"Male\",\"Transgender Male\"]", "MATCHES_REGEX", "^(?:Male|TransgenderMale)$")]
    [InlineData("EXCLUDES", "[\"Female\"]", "NOT_MATCHES_REGEX", "^(?:Female)$")]
    [InlineData("EXCLUDES", "[\"Transgender Female\",\"Non-Binary\"]", "NOT_MATCHES_REGEX", "^(?:TransgenderFemale|NonBinary)$")]
    public void Performer_gender_lists_map_to_anchored_cove_regexes(
        string sourceModifier, string valuesJson, string targetModifier, string targetValue)
    {
        var result = StashFilterAnalyzer.Translate(
            "1", "Performer genders", "PERFORMERS", "{}",
            "{\"gender\":{\"modifier\":\"" + sourceModifier + "\",\"value\":" + valuesJson + "}}", "{}");

        Assert.True(result.Importable);
        var criterion = JsonNode.Parse(result.Payload!.ObjectFilter)!["genderCriterion"]!;
        Assert.Equal(targetValue, criterion["value"]!.GetValue<string>());
        Assert.Equal(targetModifier, criterion["modifier"]!.GetValue<string>());
    }

    [Theory]
    [InlineData("INCLUDES", "[]")]
    [InlineData("EXCLUDES", "[\"Unknown\"]")]
    [InlineData("INCLUDES", "[\"Male\",\"Unknown\"]")]
    [InlineData("INCLUDES", "[\"Male\",1]")]
    public void Empty_or_unknown_performer_gender_lists_block_the_complete_filter(
        string modifier, string valuesJson)
    {
        var result = StashFilterAnalyzer.Translate(
            "1", "Invalid performer genders", "PERFORMERS", "{}",
            "{\"gender\":{\"modifier\":\"" + modifier + "\",\"value\":" + valuesJson + "}}", "{}");

        Assert.False(result.Importable);
        Assert.Contains(result.Rules, rule =>
            rule.Source == "object_filter.gender" && rule.Status == "unsupported");
    }

    [Theory]
    [InlineData("true", "EQUALS", true)]
    [InlineData("false", "EQUALS", false)]
    [InlineData("1", "EQUALS", true)]
    [InlineData("0", "EQUALS", false)]
    [InlineData("\"true\"", "EQUALS", true)]
    [InlineData("{\"value\":\"false\"}", "NOT_EQUALS", true)]
    public void Performer_favorite_accepts_stash_boolean_shapes(string valueJson, string modifier, bool expected)
    {
        var result = StashFilterAnalyzer.Translate(
            "1", "Performer favorite", "PERFORMERS", "{}",
            "{\"filter_favorites\":{\"modifier\":\"" + modifier
                + "\",\"value\":" + valueJson + "}}", "{}");

        Assert.True(result.Importable);
        Assert.Equal(expected, JsonNode.Parse(result.Payload!.ObjectFilter)!["favoriteCriterion"]!["value"]!.GetValue<bool>());
    }

    [Theory]
    [InlineData("Unknown", "EQUALS", "object_filter.gender")]
    [InlineData("Female", "INCLUDES", "object_filter.gender")]
    [InlineData("perhaps", "EQUALS", "object_filter.filter_favorites")]
    public void Malformed_performer_enum_and_boolean_criteria_block_the_complete_filter(
        string value, string modifier, string source)
    {
        var key = source.EndsWith("gender", StringComparison.Ordinal) ? "gender" : "filter_favorites";
        var result = StashFilterAnalyzer.Translate(
            "1", "Invalid performer criterion", "PERFORMERS", "{}",
            "{\"" + key + "\":{\"modifier\":\"" + modifier + "\",\"value\":\"" + value + "\"}}", "{}");

        Assert.False(result.Importable);
        Assert.Contains(result.Rules, rule => rule.Source == source && rule.Status == "unsupported");
    }

    [Fact]
    public void Performer_tag_relations_reuse_exact_name_resolution()
    {
        var tags = new Dictionary<string, TagResolution>(StringComparer.OrdinalIgnoreCase)
        {
            ["mapped tag"] = new(42, "matched")
        };
        var result = StashFilterAnalyzer.Translate(
            "1", "Performer tags", "PERFORMERS", """{"sort":"name","direction":"ASC","per_page":250}""",
            """{"tags":{"value":{"items":[{"id":"7","label":"Mapped Tag"}],"excluded":[],"depth":0},"modifier":"INCLUDES"}}""",
            "{}", tagResolutions: tags);

        Assert.True(result.Importable);
        Assert.Equal(42, JsonNode.Parse(result.Payload!.ObjectFilter)!["tagsCriterion"]!["value"]![0]!.GetValue<int>());
    }

    [Fact]
    public void Performer_endpoint_aware_remote_id_criterion_is_preserved()
    {
        var result = StashFilterAnalyzer.Translate(
            "1", "Performer remote ID", "PERFORMERS", """{"sort":"name","direction":"ASC","per_page":250}""",
            """{"stash_id_endpoint":{"value":{"endpoint":"https://metadata.invalid/graphql","stashID":"opaque"},"modifier":"EQUALS"}}""",
            "{}");

        Assert.True(result.Importable);
        var filter = JsonNode.Parse(result.Payload!.ObjectFilter)!;
        Assert.Equal("https://metadata.invalid/graphql", filter["remoteIdCriterion"]!["value"]!.GetValue<string>());
        Assert.Equal("opaque", filter["remoteIdValueCriterion"]!["value"]!.GetValue<string>());
    }

    [Fact]
    public void Performer_o_counter_criterion_maps_to_cove_like_counter()
    {
        var result = StashFilterAnalyzer.Translate(
            "1", "Performer likes", "PERFORMERS", "{}",
            """{"o_counter":{"value":{"value":2},"modifier":"GREATER_THAN"}}""", "{}");

        Assert.True(result.Importable);
        var criterion = JsonNode.Parse(result.Payload!.ObjectFilter)!["likeCounterCriterion"]!;
        Assert.Equal(2, criterion["value"]!.GetValue<int>());
        Assert.Equal("GREATER_THAN", criterion["modifier"]!.GetValue<string>());
    }

    [Fact]
    public void Performer_text_paging_and_created_at_sort_are_preserved()
    {
        var result = StashFilterAnalyzer.Translate(
            "1", "Performer text", "PERFORMERS",
            """{"q":"matrix performer","page":1,"per_page":60,"sort":"created_at","direction":"DESC"}""",
            "{}", "{}");

        Assert.True(result.Importable);
        var find = JsonNode.Parse(result.Payload!.FindFilter)!;
        Assert.Equal("matrix performer", find["q"]!.GetValue<string>());
        Assert.Equal(60, find["perPage"]!.GetValue<int>());
        Assert.Equal("created_at", find["sort"]!.GetValue<string>());
        Assert.Equal("desc", find["direction"]!.GetValue<string>());
    }

    [Theory]
    [InlineData("name", "name")]
    [InlineData("created_at", "created_at")]
    [InlineData("random_opaque", "random")]
    [InlineData("scenes_count", "video_count")]
    [InlineData("o_counter", "like_counter")]
    [InlineData("last_o_at", "last_like_at")]
    public void Observed_performer_sorts_map_to_cove_sorts(string sourceSort, string targetSort)
    {
        var result = StashFilterAnalyzer.Translate(
            "1", "Performer sort", "PERFORMERS", $$"""{"sort":"{{sourceSort}}"}""", "{}", "{}");

        Assert.True(result.Importable);
        Assert.Equal(targetSort, JsonNode.Parse(result.Payload!.FindFilter)!["sort"]!.GetValue<string>());
    }

    [Theory]
    [InlineData("birthdate")]
    [InlineData("details")]
    [InlineData("unknown")]
    public void Uncontracted_performer_rules_are_not_silently_dropped(string key)
    {
        var result = StashFilterAnalyzer.Translate(
            "1", "Unsupported performer rule", "PERFORMERS", "{}",
            "{\"" + key + "\":{\"value\":\"x\",\"modifier\":\"EQUALS\"}}", "{}");

        Assert.False(result.Importable);
        Assert.Contains(result.Rules, rule =>
            rule.Source == $"object_filter.{key}" && rule.Status == "unsupported");
    }

    [Fact]
    public void Image_tags_and_like_counter_map_to_cove_images()
    {
        var tags = new Dictionary<string, TagResolution>(StringComparer.OrdinalIgnoreCase)
        {
            ["mapped tag"] = new(42, "mapped tag")
        };
        var result = StashFilterAnalyzer.Translate(
            "1", "Image filter", "IMAGES",
            """{"q":"","page":4,"per_page":30,"sort":"updated_at","direction":"DESC"}""",
            """{"tags":{"value":{"items":[{"id":"7","label":"mapped tag"}],"excluded":[],"depth":0},"modifier":"INCLUDES_ALL"},"o_counter":{"value":1,"modifier":"GREATER_THAN"}}""",
            "{}",
            tagResolutions: tags);

        Assert.True(result.Importable);
        Assert.Equal("Images", result.TargetMode);
        Assert.Equal("Images", result.Payload!.Mode);
        var find = JsonNode.Parse(result.Payload.FindFilter)!;
        Assert.Equal(30, find["perPage"]!.GetValue<int>());
        Assert.Equal("updated_at", find["sort"]!.GetValue<string>());
        Assert.Equal("desc", find["direction"]!.GetValue<string>());
        Assert.Null(find["page"]);
        Assert.Null(find["q"]);
        var filter = JsonNode.Parse(result.Payload.ObjectFilter)!;
        Assert.Equal(42, filter["tagsCriterion"]!["value"]![0]!.GetValue<int>());
        Assert.Equal("INCLUDES_ALL", filter["tagsCriterion"]!["modifier"]!.GetValue<string>());
        Assert.Equal(1, filter["likeCounterCriterion"]!["value"]!.GetValue<int>());
        Assert.Equal("GREATER_THAN", filter["likeCounterCriterion"]!["modifier"]!.GetValue<string>());
    }

    [Theory]
    [InlineData("random_123", "random")]
    [InlineData("updated_at", "updated_at")]
    public void Image_sorts_map_to_cove_image_sorts(string sourceSort, string targetSort)
    {
        var result = StashFilterAnalyzer.Translate(
            "1", "Image sort", "IMAGES", $"{{\"sort\":\"{sourceSort}\"}}", "{}", "{}");

        Assert.True(result.Importable);
        Assert.Equal(targetSort, JsonNode.Parse(result.Payload!.FindFilter)!["sort"]!.GetValue<string>());
    }

    [Theory]
    [InlineData("play_count")]
    [InlineData("video_codec")]
    [InlineData("stash_id_endpoint")]
    public void Video_only_rules_remain_visible_and_unsupported_on_images(string key)
    {
        var result = StashFilterAnalyzer.Translate(
            "1", "Unsupported image rule", "IMAGES", "{}",
            "{\"" + key + "\":{\"value\":1,\"modifier\":\"EQUALS\"}}", "{}");

        Assert.False(result.Importable);
        Assert.Contains(result.Rules, rule => rule.Source == $"object_filter.{key}"
            && rule.Status == "unsupported");
    }

    [Fact]
    public void Gallery_scalar_presence_and_relation_rules_map_to_cove_galleries()
    {
        var tags = new Dictionary<string, TagResolution>(StringComparer.OrdinalIgnoreCase)
        {
            ["mapped tag"] = new(42, "mapped tag")
        };
        var result = StashFilterAnalyzer.Translate(
            "1", "Gallery filter", "GALLERIES",
            """{"per_page":20,"sort":"performer_count","direction":"ASC"}""",
            """
            {
              "date":{"value":{"value":""},"modifier":"IS_NULL"},
              "studios":{"value":{"items":[],"excluded":[],"depth":0},"modifier":"IS_NULL"},
              "tags":{"value":{"items":[{"id":"7","label":"mapped tag"}],"excluded":[],"depth":0},"modifier":"INCLUDES_ALL"},
              "scenes":{"value":[],"modifier":"IS_NULL"},
              "url":{"value":"metadata.example","modifier":"EXCLUDES"}
            }
            """,
            "{}",
            tagResolutions: tags);

        Assert.True(result.Importable);
        Assert.Equal("Galleries", result.TargetMode);
        Assert.Equal("Galleries", result.Payload!.Mode);
        var find = JsonNode.Parse(result.Payload.FindFilter)!;
        Assert.Equal("performer_count", find["sort"]!.GetValue<string>());
        Assert.Equal("asc", find["direction"]!.GetValue<string>());
        var filter = JsonNode.Parse(result.Payload.ObjectFilter)!;
        Assert.Equal("IS_NULL", filter["dateCriterion"]!["modifier"]!.GetValue<string>());
        Assert.Equal("IS_NULL", filter["studiosCriterion"]!["modifier"]!.GetValue<string>());
        Assert.Equal(42, filter["tagsCriterion"]!["value"]![0]!.GetValue<int>());
        Assert.Equal("IS_NULL", filter["videosCriterion"]!["modifier"]!.GetValue<string>());
        Assert.Equal("EXCLUDES", filter["urlCriterion"]!["modifier"]!.GetValue<string>());
        Assert.Equal("adapted", result.Status);
    }

    [Theory]
    [InlineData("created_at", "created_at")]
    [InlineData("performer_count", "performer_count")]
    [InlineData("random_123", "random")]
    public void Gallery_sorts_map_to_cove_gallery_sorts(string sourceSort, string targetSort)
    {
        var result = StashFilterAnalyzer.Translate(
            "1", "Gallery sort", "GALLERIES", $"{{\"sort\":\"{sourceSort}\"}}", "{}", "{}");

        Assert.True(result.Importable);
        Assert.Equal(targetSort, JsonNode.Parse(result.Payload!.FindFilter)!["sort"]!.GetValue<string>());
    }

    [Theory]
    [InlineData("date", "EQUALS")]
    [InlineData("scenes", "INCLUDES")]
    public void Unsupported_gallery_comparisons_are_not_silently_dropped(string key, string modifier)
    {
        var value = key == "scenes" ? "[]" : "{\"value\":\"2025-01-01\"}";
        var result = StashFilterAnalyzer.Translate(
            "1", "Unsupported gallery rule", "GALLERIES", "{}",
            "{\"" + key + "\":{\"value\":" + value + ",\"modifier\":\"" + modifier + "\"}}", "{}");

        Assert.False(result.Importable);
        Assert.Contains(result.Rules, rule => rule.Source == $"object_filter.{key}"
            && rule.Status == "unsupported");
    }

    public static TheoryData<string, int> ResolutionMappings => new()
    {
        { "144p", 144 },
        { "VERY_LOW", 144 },
        { "240p", 240 },
        { "LOW", 240 },
        { "360p", 360 },
        { "R360P", 360 },
        { "480p", 480 },
        { "STANDARD", 480 },
        { "540p", 540 },
        { "WEB_HD", 540 },
        { "720p", 720 },
        { "STANDARD_HD", 720 },
        { "1080p", 1080 },
        { "FULL_HD", 1080 },
        { "1440p", 1440 },
        { "QUAD_HD", 1440 },
        { "4K", 2160 },
        { "FOUR_K", 2160 },
        { "5K", 2880 },
        { "FIVE_K", 2880 },
        { "6K", 3384 },
        { "SIX_K", 3384 },
        { "7K", 4032 },
        { "SEVEN_K", 4032 },
        { "8K", 4320 },
        { "EIGHT_K", 4320 },
        { "HUGE", 9999 },
    };

    [Theory]
    [MemberData(nameof(ResolutionMappings))]
    public void Resolution_labels_map_to_cove_buckets(string sourceBucket, int targetBucket)
    {
        var result = StashFilterAnalyzer.Translate("1", "Resolution", "SCENES", "{}",
            "{\"resolution\":{\"value\":\"" + sourceBucket + "\",\"modifier\":\"EQUALS\"}}", "{}");

        Assert.True(result.Importable);
        Assert.Equal("adapted", result.Status);
        var criterion = JsonNode.Parse(result.Payload!.ObjectFilter)!["resolutionCriterion"]!;
        Assert.Equal(targetBucket, criterion["value"]!.GetValue<int>());
        Assert.Equal("EQUALS", criterion["modifier"]!.GetValue<string>());
        Assert.Contains(result.Rules, rule => rule.Source == "object_filter.resolution"
            && rule.Target == "resolutionCriterion"
            && rule.Status == "adapted"
            && rule.Explanation.Contains("boundaries differ"));
    }

    [Theory]
    [InlineData("equals", "EQUALS")]
    [InlineData("NOT_EQUALS", "NOT_EQUALS")]
    [InlineData("greater_than", "GREATER_THAN")]
    [InlineData("LESS_THAN", "LESS_THAN")]
    public void Resolution_modifiers_are_preserved_and_normalized(string sourceModifier, string expected)
    {
        var result = StashFilterAnalyzer.Translate("1", "Resolution", "SCENES", "{}",
            "{\"resolution\":{\"value\":\"FULL_HD\",\"modifier\":\"" + sourceModifier + "\"}}", "{}");

        Assert.True(result.Importable);
        var criterion = JsonNode.Parse(result.Payload!.ObjectFilter)!["resolutionCriterion"]!;
        Assert.Equal(expected, criterion["modifier"]!.GetValue<string>());
    }

    [Theory]
    [InlineData("""{"resolution":{"value":"VR_HD","modifier":"EQUALS"}}""", "no distinct Cove equivalent")]
    [InlineData("""{"resolution":{"value":"FULL_HD","modifier":"BETWEEN"}}""", "modifier")]
    [InlineData("""{"resolution":{"value":1080,"modifier":"EQUALS"}}""", "not recognized")]
    [InlineData("""{"resolution":{"value":"FULL_HD","modifier":"EQUALS","extra":true}}""", "expected Stash shape")]
    public void Unsupported_resolution_variants_block_the_filter(string objectFilter, string explanation)
    {
        var result = StashFilterAnalyzer.Translate(
            "1", "Resolution", "SCENES", "{}", objectFilter, "{}");

        Assert.False(result.Importable);
        Assert.Contains(result.Rules, rule => rule.Source == "object_filter.resolution"
            && rule.Status == "unsupported"
            && rule.Explanation.Contains(explanation));
    }

    [Theory]
    [InlineData("NOT_NULL")]
    [InlineData("is_null")]
    public void Phash_presence_filters_map_to_the_algorithm_specific_hash_filter(string sourceModifier)
    {
        var result = StashFilterAnalyzer.Translate(
            "1", "pHash presence", "SCENES", "{}",
            "{\"phash_distance\":{\"value\":\"\",\"modifier\":\"" + sourceModifier + "\",\"distance\":0}}",
            "{}");

        Assert.True(result.Importable);
        Assert.Equal("direct", result.Status);
        var criterion = JsonNode.Parse(result.Payload!.ObjectFilter)!["fingerprintCriterion"]!;
        Assert.Equal("phash", criterion["type"]!.GetValue<string>());
        Assert.Equal("", criterion["value"]!.GetValue<string>());
        Assert.Equal(sourceModifier.ToUpperInvariant(), criterion["modifier"]!.GetValue<string>());
        Assert.Contains(result.Rules, rule => rule.Source == "object_filter.phash_distance"
            && rule.Target == "fingerprintCriterion"
            && rule.Status == "direct");
    }

    [Theory]
    [InlineData("EQUALS")]
    [InlineData("NOT_EQUALS")]
    public void Phash_distance_comparisons_remain_unsupported(string modifier)
    {
        var result = StashFilterAnalyzer.Translate(
            "1", "pHash distance", "SCENES", "{}",
            "{\"phash_distance\":{\"value\":\"1\",\"modifier\":\"" + modifier + "\",\"distance\":2}}",
            "{}");

        Assert.False(result.Importable);
        Assert.Contains(result.Rules, rule => rule.Source == "object_filter.phash_distance"
            && rule.Status == "unsupported"
            && rule.Explanation.Contains("distance comparisons"));
    }

    [Fact]
    public void Mixed_direct_and_unsupported_filter_is_unsupported_without_partial_payload()
    {
        var result = StashFilterAnalyzer.Translate("1", "Mixed", "SCENES", "{}",
            """{"play_count":{"value":1,"modifier":"EQUALS"},"studios":{"value":[1],"modifier":"INCLUDES"}}""", "{}");
        Assert.Contains(result.Rules, x => x.Status == "direct");
        Assert.Contains(result.Rules, x => x.Status == "unsupported");
        Assert.False(result.Importable);
        Assert.Null(result.Payload);
    }

    [Theory]
    [InlineData("IS_NULL", "")]
    [InlineData("IS_NULL", "https://metadata.invalid/graphql")]
    [InlineData("NOT_NULL", "")]
    [InlineData("NOT_NULL", "https://metadata.invalid/graphql")]
    public void Metadata_service_presence_filters_are_preserved(string modifier, string endpoint)
    {
        var objectFilter = JsonSerializer.Serialize(new
        {
            stash_id_endpoint = new
            {
                value = new { endpoint, stashID = "stale-value-is-ignored" },
                modifier
            }
        });
        var result = StashFilterAnalyzer.Translate("1", "Remote presence", "SCENES", "{}", objectFilter, "{}");

        Assert.True(result.Importable);
        Assert.Equal(string.IsNullOrEmpty(endpoint) ? "direct" : "adapted", result.Status);
        var filter = JsonNode.Parse(result.Payload!.ObjectFilter)!.AsObject();
        var targetKey = string.IsNullOrEmpty(endpoint) ? "remoteIdValueCriterion" : "remoteIdCriterion";
        Assert.Equal(endpoint, filter[targetKey]!["value"]!.GetValue<string>());
        Assert.Equal(modifier, filter[targetKey]!["modifier"]!.GetValue<string>());
        Assert.Null(filter[string.IsNullOrEmpty(endpoint) ? "remoteIdCriterion" : "remoteIdValueCriterion"]);
        var rule = Assert.Single(result.Rules, rule => rule.Source == "object_filter.stash_id_endpoint");
        Assert.Contains(string.IsNullOrEmpty(endpoint) ? "Global" : "case-insensitively", rule.Explanation);
    }

    [Theory]
    [InlineData("EQUALS")]
    [InlineData("NOT_EQUALS")]
    public void Metadata_service_and_stash_id_are_preserved_as_a_pair(string modifier)
    {
        var result = StashFilterAnalyzer.Translate("1", "Remote pair", "SCENES", "{}",
            "{\"stash_id_endpoint\":{\"value\":{\"endpoint\":\"https://metadata.invalid/graphql\",\"stashID\":\"opaque\"},\"modifier\":\""
                + modifier + "\"}}", "{}");

        Assert.True(result.Importable);
        Assert.Equal("adapted", result.Status);
        var filter = JsonNode.Parse(result.Payload!.ObjectFilter)!.AsObject();
        Assert.Equal("https://metadata.invalid/graphql", filter["remoteIdCriterion"]!["value"]!.GetValue<string>());
        Assert.Equal("EQUALS", filter["remoteIdCriterion"]!["modifier"]!.GetValue<string>());
        Assert.Equal("opaque", filter["remoteIdValueCriterion"]!["value"]!.GetValue<string>());
        Assert.Equal(modifier, filter["remoteIdValueCriterion"]!["modifier"]!.GetValue<string>());
        var rule = Assert.Single(result.Rules, rule => rule.Source == "object_filter.stash_id_endpoint");
        Assert.Equal("adapted", rule.Status);
        Assert.Contains(modifier == "NOT_EQUALS" ? "without that endpoint" : "wildcard semantics", rule.Explanation);
    }

    [Theory]
    [InlineData("""{"value":"opaque","modifier":"EQUALS"}""")]
    [InlineData("""{"value":{"stash_id":"opaque"},"modifier":"EQUALS"}""")]
    public void Legacy_and_graphql_shaped_stash_ids_are_supported(string criterion)
    {
        var result = StashFilterAnalyzer.Translate("1", "Legacy remote", "SCENES", "{}",
            "{\"stash_id_endpoint\":" + criterion + "}", "{}");

        Assert.True(result.Importable);
        var filter = JsonNode.Parse(result.Payload!.ObjectFilter)!.AsObject();
        Assert.Null(filter["remoteIdCriterion"]);
        Assert.Equal("opaque", filter["remoteIdValueCriterion"]!["value"]!.GetValue<string>());
    }

    [Theory]
    [InlineData("""{"value":"opaque","modifier":"NOT_EQUALS"}""")]
    [InlineData("""{"value":{"stash_id":"opaque"},"modifier":"NOT_EQUALS"}""")]
    public void Endpoint_less_not_equals_warns_that_entities_without_remote_ids_are_included(string criterion)
    {
        var result = StashFilterAnalyzer.Translate("1", "Legacy negative remote", "SCENES", "{}",
            "{\"stash_id_endpoint\":" + criterion + "}", "{}");

        Assert.True(result.Importable);
        Assert.Equal("adapted", result.Status);
        var rule = Assert.Single(result.Rules, rule => rule.Source == "object_filter.stash_id_endpoint");
        Assert.Contains("entities with no remote IDs", rule.Explanation);
        Assert.DoesNotContain("without that endpoint", rule.Explanation);
    }

    [Theory]
    [InlineData("""{"value":{"endpoint":1,"stashID":"opaque"},"modifier":"EQUALS"}""")]
    [InlineData("""{"value":{"endpoint":"","stashID":""},"modifier":"EQUALS"}""")]
    [InlineData("""{"value":{"endpoint":"","stashID":"opaque","extra":true},"modifier":"EQUALS"}""")]
    [InlineData("""{"value":{"endpoint":"","stashID":"one","stash_id":"two"},"modifier":"EQUALS"}""")]
    [InlineData("""{"value":{"endpoint":"","stashID":"opaque"},"modifier":"INCLUDES"}""")]
    [InlineData("""{"value":{"endpoint":"","stashID":"   "},"modifier":"EQUALS"}""")]
    [InlineData("""{"value":{"endpoint":"","stashID":" padded"},"modifier":"EQUALS"}""")]
    [InlineData("""{"value":{"endpoint":"   ","stashID":"opaque"},"modifier":"EQUALS"}""")]
    [InlineData("""{"value":{"endpoint":" https://metadata.invalid/graphql","stashID":""},"modifier":"NOT_NULL"}""")]
    public void Malformed_metadata_service_filters_are_unsupported(string criterion)
    {
        var result = StashFilterAnalyzer.Translate("1", "Invalid remote", "SCENES", "{}",
            "{\"stash_id_endpoint\":" + criterion + "}", "{}");

        Assert.False(result.Importable);
        Assert.Contains(result.Rules, rule =>
            rule.Source == "object_filter.stash_id_endpoint" && rule.Status == "unsupported");
    }

    [Theory]
    [InlineData("EQUALS")]
    [InlineData("NOT_EQUALS")]
    [InlineData("GREATER_THAN")]
    [InlineData("LESS_THAN")]
    [InlineData("IS_NULL")]
    [InlineData("NOT_NULL")]
    [InlineData("BETWEEN")]
    [InlineData("NOT_BETWEEN")]
    public void Numeric_modifiers_are_preserved_when_valid(string modifier)
    {
        var value = modifier is "BETWEEN" or "NOT_BETWEEN"
            ? $$"""{"value":{"value":1,"value2":2},"modifier":"{{modifier}}"}"""
            : $$"""{"value":{"value":1},"modifier":"{{modifier}}"}""";
        var result = StashFilterAnalyzer.Translate("1", "Numeric", "SCENES", "{}",
            $$"""{"play_count":{{value}}}""", "{}");
        Assert.True(result.Importable);
        Assert.Equal(modifier, JsonNode.Parse(result.Payload!.ObjectFilter)!["playCountCriterion"]!["modifier"]!.GetValue<string>());
    }

    [Theory]
    [InlineData("EQUALS")]
    [InlineData("NOT_EQUALS")]
    [InlineData("INCLUDES")]
    [InlineData("EXCLUDES")]
    [InlineData("IS_NULL")]
    [InlineData("NOT_NULL")]
    [InlineData("MATCHES_REGEX")]
    [InlineData("NOT_MATCHES_REGEX")]
    public void String_modifiers_are_preserved_when_valid(string modifier)
    {
        var result = StashFilterAnalyzer.Translate("1", "String", "SCENES", "{}",
            "{\"title\":{\"value\":\"example\",\"modifier\":\"" + modifier + "\"}}", "{}");
        Assert.True(result.Importable);
        Assert.Equal(modifier, JsonNode.Parse(result.Payload!.ObjectFilter)!["titleCriterion"]!["modifier"]!.GetValue<string>());
    }

    [Fact]
    public void Accepted_modifier_casing_is_canonicalized_for_cove()
    {
        var result = StashFilterAnalyzer.Translate("1", "Canonical", "SCENES", "{}",
            """{"play_count":{"value":{"value":1},"modifier":"greater_than"}}""", "{}");
        Assert.Equal("GREATER_THAN", JsonNode.Parse(result.Payload!.ObjectFilter)!["playCountCriterion"]!["modifier"]!.GetValue<string>());
    }

    [Theory]
    [InlineData("""{"play_count":{"value":{"value":1},"modifier":"INCLUDES"}}""")]
    [InlineData("""{"play_count":{"value":{"value":"one"},"modifier":"EQUALS"}}""")]
    [InlineData("""{"play_count":{"value":{"value":1},"modifier":"BETWEEN"}}""")]
    [InlineData("""{"play_count":{"value":{"value":1,"value2":"two"},"modifier":"BETWEEN"}}""")]
    [InlineData("""{"title":{"value":1,"modifier":"EQUALS"}}""")]
    [InlineData("""{"performer_favorite":{"value":"true","modifier":"GREATER_THAN"}}""")]
    public void Known_but_wrong_type_shapes_are_unsupported(string objectFilter)
    {
        var result = StashFilterAnalyzer.Translate("1", "Invalid", "SCENES", "{}", objectFilter, "{}");
        Assert.False(result.Importable);
        Assert.Equal("unsupported", result.Status);
    }

    [Theory]
    [InlineData("\"true\"", "EQUALS", true)]
    [InlineData("\"false\"", "EQUALS", false)]
    [InlineData("1", "EQUALS", true)]
    [InlineData("0", "EQUALS", false)]
    [InlineData("\"false\"", "NOT_EQUALS", true)]
    public void Boolean_strings_numbers_and_not_equals_are_normalized(string value, string modifier, bool expected)
    {
        var result = StashFilterAnalyzer.Translate("1", "Boolean", "SCENES", "{}",
            "{\"performer_favorite\":{\"value\":" + value + ",\"modifier\":\"" + modifier + "\"}}", "{}");
        Assert.True(result.Importable);
        Assert.Equal(expected, JsonNode.Parse(result.Payload!.ObjectFilter)!["performerFavoriteCriterion"]!["value"]!.GetValue<bool>());
    }

    [Theory]
    [InlineData("false", "EQUALS", false)]
    [InlineData("true", "EQUALS", true)]
    [InlineData("false", "NOT_EQUALS", true)]
    [InlineData("true", "NOT_EQUALS", false)]
    public void Scene_marker_presence_maps_to_cove_segment_presence(
        string value, string modifier, bool expected)
    {
        var result = StashFilterAnalyzer.Translate("1", "Marker presence", "SCENES", "{}",
            "{\"has_markers\":{\"value\":\"" + value + "\",\"modifier\":\"" + modifier + "\"}}", "{}");

        Assert.True(result.Importable);
        Assert.Equal("adapted", result.Status);
        Assert.Equal(expected,
            JsonNode.Parse(result.Payload!.ObjectFilter)!["hasSegmentsCriterion"]!["value"]!.GetValue<bool>());
        Assert.Contains(result.Rules,
            rule => rule.Source == "object_filter.has_markers"
                && rule.Target == "hasSegmentsCriterion"
                && rule.Status == "adapted");
    }

    [Theory]
    [InlineData("maybe", "EQUALS")]
    [InlineData("true", "GREATER_THAN")]
    public void Invalid_scene_marker_presence_remains_unsupported(string value, string modifier)
    {
        var result = StashFilterAnalyzer.Translate("1", "Invalid marker presence", "SCENES", "{}",
            "{\"has_markers\":{\"value\":\"" + value + "\",\"modifier\":\"" + modifier + "\"}}", "{}");

        Assert.False(result.Importable);
        Assert.Contains(result.Rules,
                rule => rule.Source == "object_filter.has_markers" && rule.Status == "unsupported");
    }

    [Fact]
    public void Malformed_scene_marker_presence_wrapper_remains_unsupported()
    {
        var result = StashFilterAnalyzer.Translate("1", "Malformed marker presence", "SCENES", "{}",
            """{"has_markers":{"value":{"value":true,"unexpected":"x"},"modifier":"EQUALS"}}""", "{}");

        Assert.False(result.Importable);
        Assert.Contains(result.Rules,
            rule => rule.Source == "object_filter.has_markers" && rule.Status == "unsupported");
    }

    [Theory]
    [InlineData("random_")]
    [InlineData("random")]
    public void Random_sort_requires_either_exact_unseeded_or_a_nonempty_seed(string sort)
    {
        var result = StashFilterAnalyzer.Translate("1", "Random", "SCENES", $$"""{"sort":"{{sort}}"}""", "{}", "{}");
        Assert.Equal(sort == "random", result.Importable);
    }

    [Fact]
    public void Tag_names_map_to_cove_ids_with_exclusions_and_hierarchy()
    {
        var resolutions = new Dictionary<string, TagResolution>(StringComparer.OrdinalIgnoreCase)
        {
            ["First tag"] = new(101, "matched"),
            ["Second tag"] = new(202, "matched")
        };
        var result = StashFilterAnalyzer.Translate("1", "Tags", "SCENES", "{}",
            """
            {"tags":{"value":{"items":[{"id":"10","label":"first TAG"}],"excluded":[{"id":20,"label":"Second tag"}],"depth":-1},"modifier":"INCLUDES_ALL"}}
            """, "{}", null, resolutions);

        Assert.True(result.Importable);
        Assert.Equal("direct", result.Status);
        Assert.Contains(result.Rules, rule =>
            rule.Source == "object_filter.tags" && rule.Status == "direct");
        var criterion = JsonNode.Parse(result.Payload!.ObjectFilter)!["tagsCriterion"]!;
        Assert.Equal(101, Assert.Single(criterion["value"]!.AsArray())!.GetValue<int>());
        Assert.Equal(202, Assert.Single(criterion["excludes"]!.AsArray())!.GetValue<int>());
        Assert.Equal("INCLUDES_ALL", criterion["modifier"]!.GetValue<string>());
        Assert.Equal(-1, criterion["depth"]!.GetValue<int>());
        Assert.DoesNotContain("label", result.Payload.ObjectFilter);
    }

    [Theory]
    [InlineData("IS_NULL")]
    [InlineData("NOT_NULL")]
    public void Tag_presence_modifiers_ignore_stale_names(string modifier)
    {
        var result = StashFilterAnalyzer.Translate("1", "Tag presence", "SCENES", "{}",
            "{\"tags\":{\"value\":{\"items\":[{\"id\":10,\"label\":\"missing\"}],\"excluded\":[],\"depth\":-1},\"modifier\":\""
                + modifier + "\"}}", "{}");

        Assert.True(result.Importable);
        Assert.Equal("adapted", result.Status);
        var criterion = JsonNode.Parse(result.Payload!.ObjectFilter)!["tagsCriterion"]!;
        Assert.Empty(criterion["value"]!.AsArray());
        Assert.Equal(modifier, criterion["modifier"]!.GetValue<string>());
        Assert.Null(criterion["depth"]);
    }

    [Theory]
    [InlineData("missing")]
    [InlineData("ambiguous")]
    public void Missing_or_ambiguous_tag_names_block_the_complete_filter(string status)
    {
        var resolutions = new Dictionary<string, TagResolution>(StringComparer.OrdinalIgnoreCase)
        {
            ["Source tag"] = new(null, status)
        };
        var result = StashFilterAnalyzer.Translate("1", "Tags", "SCENES", "{}",
            """{"tags":{"value":{"items":[{"id":10,"label":"Source tag"}],"excluded":[],"depth":0},"modifier":"INCLUDES"}}""",
            "{}", null, resolutions);

        Assert.False(result.Importable);
        Assert.Contains(result.Rules, rule => rule.Source == "object_filter.tags"
            && rule.Status == "unsupported"
            && rule.Explanation.Contains(status == "ambiguous" ? "multiple" : "no exact"));
    }

    [Theory]
    [InlineData("""{"value":{"items":[],"excluded":[],"depth":1},"modifier":"INCLUDES"}""")]
    [InlineData("""{"value":{"items":[],"excluded":[],"depth":0},"modifier":"EQUALS"}""")]
    [InlineData("""{"value":{"items":[],"excluded":[],"depth":0},"modifier":"EXCLUDES_ALL"}""")]
    [InlineData("""{"value":{"items":[{"id":1}],"excluded":[],"depth":0},"modifier":"INCLUDES"}""")]
    [InlineData("""{"value":{"items":[{"id":1,"label":" "}],"excluded":[],"depth":0},"modifier":"INCLUDES"}""")]
    public void Unsupported_tag_shapes_are_not_silently_dropped(string criterion)
    {
        var result = StashFilterAnalyzer.Translate("1", "Invalid tags", "SCENES", "{}",
            "{\"tags\":" + criterion + "}", "{}");

        Assert.False(result.Importable);
        Assert.Contains(result.Rules, rule => rule.Source == "object_filter.tags" && rule.Status == "unsupported");
    }

    [Fact]
    public async Task Malformed_scalar_tag_item_is_reported_without_aborting_inventory()
    {
        var path = await CreateFixture(
            ("1", "Malformed tags", "SCENES", "{}",
                """{"tags":{"value":{"items":["not-an-object"],"excluded":[],"depth":0},"modifier":"INCLUDES"}}""", "{}"),
            ("2", "Valid", "SCENES", """{"sort":"title"}""", "{}", "{}"));
        try
        {
            var response = await new StashFilterAnalyzer().AnalyzeAsync(path, default);
            Assert.Equal(2, response.Filters.Count);
            Assert.False(response.Filters[0].Importable);
            Assert.Contains(response.Filters[0].Rules, rule =>
                rule.Source == "object_filter.tags" && rule.Status == "unsupported");
            Assert.True(response.Filters[1].Importable);
        }
        finally { File.Delete(path); }
    }

    [Fact]
    public async Task Analyzer_collects_included_and_excluded_tag_names_for_resolution()
    {
        var path = await CreateFixture(("1", "Tags", "SCENES", "{}",
            """
            {"tags":{"value":{"items":[{"id":10,"label":"Included"}],"excluded":[{"id":20,"label":"Excluded"}],"depth":0},"modifier":"INCLUDES_ALL"}}
            """, "{}"));
        try
        {
            var resolver = new RecordingTagResolver();
            var response = await new StashFilterAnalyzer(tagResolver: resolver).AnalyzeAsync(path, default);
            Assert.True(Assert.Single(response.Filters).Importable);
            Assert.Equal(["Excluded", "Included"], resolver.Names.Order().ToArray());
        }
        finally { File.Delete(path); }
    }

    [Fact]
    public async Task Tag_resolution_is_case_insensitive_and_rejects_missing_or_duplicate_names()
    {
        var resolver = new CoveTagReferenceResolver(new StubTagRepository(
            new Tag { Id = 10, Name = "Unique" },
            new Tag { Id = 20, Name = "Duplicate" },
            new Tag { Id = 30, Name = "duplicate" }));

        var result = await resolver.ResolveAsync(["unique", "DUPLICATE", "Missing"], default);

        Assert.Equal(10, result["unique"].TargetId);
        Assert.Equal("ambiguous", result["DUPLICATE"].Status);
        Assert.Equal("missing", result["Missing"].Status);
    }

    [Fact]
    public void Performer_references_map_to_cove_ids_without_preserving_labels()
    {
        var resolutions = new Dictionary<int, PerformerResolution>
        {
            [10] = new(110, "matched"),
            [20] = new(220, "matched")
        };
        var result = StashFilterAnalyzer.Translate("1", "Performers", "SCENES", "{}",
            """
            {"performers":{"value":{"items":[{"id":"10","label":"source label"}],"excluded":[{"id":20,"label":"other label"}]},"modifier":"INCLUDES_ALL"}}
            """, "{}", resolutions);

        Assert.True(result.Importable);
        Assert.Equal("adapted", result.Status);
        var criterion = JsonNode.Parse(result.Payload!.ObjectFilter)!["performersCriterion"]!;
        Assert.Equal(110, criterion["value"]![0]!.GetValue<int>());
        Assert.Equal(220, criterion["excludes"]![0]!.GetValue<int>());
        Assert.Equal("INCLUDES_ALL", criterion["modifier"]!.GetValue<string>());
        Assert.DoesNotContain("label", result.Payload.ObjectFilter);
    }

    [Theory]
    [InlineData("missing")]
    [InlineData("ambiguous")]
    public void Missing_or_ambiguous_performer_matches_block_the_complete_filter(string status)
    {
        var result = StashFilterAnalyzer.Translate("1", "Performers", "SCENES", "{}",
            """{"performers":{"value":{"items":[{"id":10,"label":"ignored"}],"excluded":[]},"modifier":"INCLUDES"}}""",
            "{}", new Dictionary<int, PerformerResolution> { [10] = new(null, status) });
        Assert.False(result.Importable);
        Assert.Contains(result.Rules, rule => rule.Source == "object_filter.performers"
            && rule.Status == "unsupported"
            && rule.Explanation.Contains(status == "ambiguous" ? "multiple" : "no exact"));
    }

    [Theory]
    [InlineData("IS_NULL")]
    [InlineData("NOT_NULL")]
    public void Performer_presence_modifiers_ignore_stale_unmatched_values(string modifier)
    {
        var result = StashFilterAnalyzer.Translate("1", "presence", "SCENES", "{}",
            "{\"performers\":{\"value\":{\"items\":[{\"id\":999,\"label\":\"stale\"}],\"excluded\":[]},\"modifier\":\""
                + modifier + "\"}}",
            "{}");

        Assert.True(result.Importable);
        var criterion = JsonNode.Parse(result.Payload!.ObjectFilter)!["performersCriterion"]!;
        Assert.Empty(criterion["value"]!.AsArray());
        Assert.Equal(modifier, criterion["modifier"]!.GetValue<string>());
    }

    [Fact]
    public void Legacy_performer_value_array_is_mapped()
    {
        var resolutions = new Dictionary<int, PerformerResolution>
        {
            [10] = new(42, "matched")
        };
        var result = StashFilterAnalyzer.Translate("1", "legacy", "SCENES", "{}",
            """{"performers":{"value":[{"id":10,"label":"ignored"}],"modifier":"INCLUDES"}}""", "{}",
            resolutions);

        Assert.True(result.Importable);
        var criterion = JsonNode.Parse(result.Payload!.ObjectFilter)!["performersCriterion"]!;
        Assert.Equal(42, Assert.Single(criterion["value"]!.AsArray())!.GetValue<int>());
    }

    [Fact]
    public async Task Analyzer_reads_endpoint_scoped_performer_references_for_resolution()
    {
        var path = await CreateFixture(("1", "Performer", "SCENES", "{}",
            """{"performers":{"value":{"items":[{"id":10,"label":"ignored"}],"excluded":[]},"modifier":"INCLUDES"}}""", "{}"));
        await using (var connection = new SqliteConnection($"Data Source={path}"))
        {
            await connection.OpenAsync();
            await using var command = connection.CreateCommand();
            command.CommandText = """
                CREATE TABLE performer_stash_ids (performer_id INTEGER, endpoint TEXT, stash_id TEXT);
                INSERT INTO performer_stash_ids VALUES (10, 'https://metadata.invalid/graphql', 'opaque');
                INSERT INTO performer_stash_ids VALUES (20, 'https://metadata.invalid/graphql', 'unreferenced');
                """;
            await command.ExecuteNonQueryAsync();
        }
        try
        {
            var resolver = new RecordingResolver();
            var response = await new StashFilterAnalyzer(resolver).AnalyzeAsync(path, default);
            Assert.True(Assert.Single(response.Filters).Importable);
            Assert.DoesNotContain(20, resolver.References.Keys);
            var reference = Assert.Single(resolver.References[10]);
            Assert.Equal("https://metadata.invalid/graphql", reference.Endpoint);
            Assert.Equal("opaque", reference.RemoteId);
        }
        finally { File.Delete(path); }
    }

    [Fact]
    public async Task Analyzer_reads_more_references_than_the_usual_sqlite_parameter_limit()
    {
        const int count = 1_100;
        var items = Enumerable.Range(1, count).Select(id => new { id, label = $"Performer {id}" }).ToArray();
        var objectFilter = JsonSerializer.Serialize(new
        {
            performers = new { value = new { items, excluded = Array.Empty<object>() }, modifier = "INCLUDES" }
        });
        var path = await CreateFixture(("1", "Many performers", "SCENES", "{}", objectFilter, "{}"));
        await using (var connection = new SqliteConnection($"Data Source={path}"))
        {
            await connection.OpenAsync();
            await using var command = connection.CreateCommand();
            command.CommandText = "CREATE TABLE performer_stash_ids (performer_id INTEGER, endpoint TEXT, stash_id TEXT)";
            await command.ExecuteNonQueryAsync();
            command.CommandText = "INSERT INTO performer_stash_ids VALUES ($id, 'https://metadata.invalid/graphql', $stashId)";
            var id = command.CreateParameter();
            id.ParameterName = "$id";
            command.Parameters.Add(id);
            var stashId = command.CreateParameter();
            stashId.ParameterName = "$stashId";
            command.Parameters.Add(stashId);
            for (var value = 1; value <= count; value++)
            {
                id.Value = value;
                stashId.Value = value.ToString();
                await command.ExecuteNonQueryAsync();
            }
        }
        try
        {
            var resolver = new RecordingResolver();
            var response = await new StashFilterAnalyzer(resolver).AnalyzeAsync(path, default);

            Assert.True(Assert.Single(response.Filters).Importable);
            Assert.Equal(count, resolver.References.Count);
        }
        finally { File.Delete(path); }
    }

    [Fact]
    public async Task Performer_resolution_keeps_endpoint_paths_and_remote_ids_case_sensitive()
    {
        var repository = new StubPerformerRepository(
            new Performer
            {
                Id = 42,
                RemoteIds = [new PerformerRemoteId { Endpoint = "https://metadata.invalid/Case", RemoteId = "AbC" }]
            });
        var resolver = new CovePerformerReferenceResolver(repository);

        var result = await resolver.ResolveAsync(new Dictionary<int, IReadOnlyList<PerformerReference>>
        {
            [1] = [new("https://metadata.invalid/Case", "AbC")],
            [2] = [new("https://metadata.invalid/case", "AbC")],
            [3] = [new("https://metadata.invalid/Case", "abc")]
        }, default);

        Assert.Equal(42, result[1].TargetId);
        Assert.Equal("missing", result[2].Status);
        Assert.Equal("missing", result[3].Status);
        Assert.Equal(2, repository.Queries.Count);
    }

    [Fact]
    public async Task Performer_resolution_rejects_duplicate_exact_remote_ids_as_ambiguous()
    {
        var sharedRemoteId = new PerformerRemoteId
        {
            Endpoint = "https://metadata.invalid/graphql",
            RemoteId = "duplicate"
        };
        var repository = new StubPerformerRepository(
            new Performer { Id = 42, RemoteIds = [sharedRemoteId] },
            new Performer
            {
                Id = 43,
                RemoteIds =
                [
                    new PerformerRemoteId
                    {
                        Endpoint = sharedRemoteId.Endpoint,
                        RemoteId = sharedRemoteId.RemoteId
                    }
                ]
            });
        var resolver = new CovePerformerReferenceResolver(repository);

        var result = await resolver.ResolveAsync(new Dictionary<int, IReadOnlyList<PerformerReference>>
        {
            [1] = [new(sharedRemoteId.Endpoint, sharedRemoteId.RemoteId)]
        }, default);

        Assert.Null(result[1].TargetId);
        Assert.Equal("ambiguous", result[1].Status);
    }

    [Fact]
    public void Studio_references_map_to_cove_ids_and_preserve_hierarchy_and_exclusions()
    {
        var resolutions = new Dictionary<int, StudioResolution>
        {
            [10] = new(110, "matched"),
            [20] = new(220, "matched")
        };
        var result = StashFilterAnalyzer.Translate("1", "Studios", "SCENES", "{}",
            """
            {"studios":{"value":{"items":[{"id":"10","label":"ignored"}],"excluded":[{"id":20,"label":"ignored"}],"depth":-1},"modifier":"INCLUDES_ALL"}}
            """, "{}", null, null, resolutions);

        Assert.True(result.Importable);
        Assert.Equal("adapted", result.Status);
        var criterion = JsonNode.Parse(result.Payload!.ObjectFilter)!["studiosCriterion"]!;
        Assert.Equal(110, criterion["value"]![0]!.GetValue<int>());
        Assert.Equal(220, criterion["excludes"]![0]!.GetValue<int>());
        Assert.Equal(-1, criterion["depth"]!.GetValue<int>());
        Assert.Equal("INCLUDES_ALL", criterion["modifier"]!.GetValue<string>());
        Assert.DoesNotContain("label", result.Payload.ObjectFilter);
    }

    [Theory]
    [InlineData("missing")]
    [InlineData("ambiguous")]
    public void Missing_or_ambiguous_studio_matches_block_the_complete_filter(string status)
    {
        var result = StashFilterAnalyzer.Translate("1", "Studios", "SCENES", "{}",
            """{"studios":{"value":{"items":[{"id":10,"label":"ignored"}],"excluded":[]},"modifier":"INCLUDES"}}""",
            "{}", null, null, new Dictionary<int, StudioResolution> { [10] = new(null, status) });

        Assert.False(result.Importable);
        Assert.Contains(result.Rules, rule => rule.Source == "object_filter.studios"
            && rule.Status == "unsupported"
            && rule.Explanation.Contains(status == "ambiguous" ? "multiple" : "no exact"));
    }

    [Fact]
    public async Task Analyzer_reads_endpoint_scoped_studio_references_for_resolution()
    {
        var path = await CreateFixture(("1", "Studio", "SCENES", "{}",
            """{"studios":{"value":{"items":[{"id":10,"label":"ignored"}],"excluded":[]},"modifier":"INCLUDES"}}""",
            "{}"));
        await using (var connection = new SqliteConnection($"Data Source={path}"))
        {
            await connection.OpenAsync();
            await using var command = connection.CreateCommand();
            command.CommandText = """
                CREATE TABLE studio_stash_ids (studio_id INTEGER, endpoint TEXT, stash_id TEXT);
                INSERT INTO studio_stash_ids VALUES (10, 'https://metadata.invalid/graphql', 'opaque');
                INSERT INTO studio_stash_ids VALUES (20, 'https://metadata.invalid/graphql', 'unreferenced');
                """;
            await command.ExecuteNonQueryAsync();
        }
        try
        {
            var resolver = new RecordingStudioResolver();
            var response = await new StashFilterAnalyzer(studioResolver: resolver).AnalyzeAsync(path, default);
            Assert.True(Assert.Single(response.Filters).Importable);
            Assert.DoesNotContain(20, resolver.References.Keys);
            var reference = Assert.Single(resolver.References[10]);
            Assert.Equal("https://metadata.invalid/graphql", reference.Endpoint);
            Assert.Equal("opaque", reference.RemoteId);
        }
        finally { File.Delete(path); }
    }

    [Fact]
    public async Task Studio_resolution_keeps_endpoint_paths_and_remote_ids_case_sensitive()
    {
        var repository = new StubStudioRepository(
            new Studio
            {
                Id = 42,
                RemoteIds = [new StudioRemoteId { Endpoint = "https://metadata.invalid/Case", RemoteId = "AbC" }]
            });
        var resolver = new CoveStudioReferenceResolver(repository);

        var result = await resolver.ResolveAsync(new Dictionary<int, IReadOnlyList<StudioReference>>
        {
            [1] = [new("https://metadata.invalid/Case", "AbC")],
            [2] = [new("https://metadata.invalid/case", "AbC")],
            [3] = [new("https://metadata.invalid/Case", "abc")]
        }, default);

        Assert.Equal(42, result[1].TargetId);
        Assert.Equal("missing", result[2].Status);
        Assert.Equal("missing", result[3].Status);
        Assert.Equal(0, repository.GetAllCalls);
        Assert.Equal(0, repository.GetWithRelationsCalls);
        Assert.Equal(2, repository.FindCalls);
    }

    [Fact]
    public async Task Studio_resolution_rejects_duplicate_exact_remote_ids_as_ambiguous()
    {
        var endpoint = "https://metadata.invalid/graphql";
        var remoteId = "duplicate";
        var repository = new StubStudioRepository(
            new Studio
            {
                Id = 42,
                RemoteIds = [new StudioRemoteId { Endpoint = endpoint, RemoteId = remoteId }]
            },
            new Studio
            {
                Id = 43,
                RemoteIds = [new StudioRemoteId { Endpoint = endpoint, RemoteId = remoteId }]
            });

        var result = await new CoveStudioReferenceResolver(repository).ResolveAsync(
            new Dictionary<int, IReadOnlyList<StudioReference>>
            {
                [1] = [new(endpoint, remoteId)]
            }, default);

        Assert.Null(result[1].TargetId);
        Assert.Equal("ambiguous", result[1].Status);
    }

    [Fact]
    public async Task Studio_resolution_skips_repository_when_no_references_exist()
    {
        var repository = new StubStudioRepository();
        var result = await new CoveStudioReferenceResolver(repository).ResolveAsync(
            new Dictionary<int, IReadOnlyList<StudioReference>>(), default);

        Assert.Empty(result);
        Assert.Equal(0, repository.GetAllCalls);
        Assert.Equal(0, repository.GetWithRelationsCalls);
    }

    private static string TempPath() => Path.Combine(Path.GetTempPath(), $"stash-filter-importer-{Guid.NewGuid():N}.sqlite");

    private static async Task<string> CreateDatabase(string schema)
    {
        var path = TempPath();
        await using var connection = new SqliteConnection($"Data Source={path}");
        await connection.OpenAsync();
        await using var command = connection.CreateCommand();
        command.CommandText = schema;
        await command.ExecuteNonQueryAsync();
        return path;
    }

    private static async Task<string> CreateFixture(params (string Id, string Name, string Mode, string Find, string Filter, string Ui)[] rows)
    {
        var path = await CreateDatabase("CREATE TABLE saved_filters (id TEXT, name TEXT, mode TEXT, find_filter TEXT, object_filter TEXT, ui_options TEXT)");
        await using var connection = new SqliteConnection($"Data Source={path}");
        await connection.OpenAsync();
        foreach (var row in rows)
        {
            await using var command = connection.CreateCommand();
            command.CommandText = "INSERT INTO saved_filters VALUES ($id,$name,$mode,$find,$filter,$ui)";
            command.Parameters.AddWithValue("$id", row.Id);
            command.Parameters.AddWithValue("$name", row.Name);
            command.Parameters.AddWithValue("$mode", row.Mode);
            command.Parameters.AddWithValue("$find", row.Find);
            command.Parameters.AddWithValue("$filter", row.Filter);
            command.Parameters.AddWithValue("$ui", row.Ui);
            await command.ExecuteNonQueryAsync();
        }
        return path;
    }

    private static void AssertLogsDoNotContain(RecordingLogger logger, params string[] sensitiveValues)
    {
        Assert.All(logger.Entries, entry =>
        {
            var text = string.Join(
                " ",
                entry.Message,
                string.Join(" ", entry.Values.Values.Select(value => Convert.ToString(value))),
                Convert.ToString(entry.Exception));
            Assert.All(sensitiveValues, value => Assert.DoesNotContain(value, text));
        });
    }

    private sealed class RecordingResolver : IPerformerReferenceResolver
    {
        internal IReadOnlyDictionary<int, IReadOnlyList<PerformerReference>> References { get; private set; } =
            new Dictionary<int, IReadOnlyList<PerformerReference>>();

        public Task<IReadOnlyDictionary<int, PerformerResolution>> ResolveAsync(
            IReadOnlyDictionary<int, IReadOnlyList<PerformerReference>> references,
            CancellationToken ct)
        {
            References = references;
            IReadOnlyDictionary<int, PerformerResolution> resolutions =
                references.ToDictionary(pair => pair.Key, _ => new PerformerResolution(999, "matched"));
            return Task.FromResult(resolutions);
        }
    }

    private sealed class RecordingLogger : ILogger<StashFilterAnalyzer>
    {
        private readonly LogLevel minimum;
        internal RecordingLogger(LogLevel minimum = LogLevel.Trace) => this.minimum = minimum;
        internal List<(LogLevel Level, EventId EventId, string Message, Exception? Exception, IReadOnlyDictionary<string, object?> Values)> Entries { get; } = [];
        public IDisposable? BeginScope<TState>(TState state) where TState : notnull => null;
        public bool IsEnabled(LogLevel logLevel) => logLevel >= minimum;
        public void Log<TState>(LogLevel logLevel, EventId eventId, TState state, Exception? exception, Func<TState, Exception?, string> formatter)
        {
            if (!IsEnabled(logLevel)) return;
            var values = state as IReadOnlyList<KeyValuePair<string, object?>>;
            Entries.Add((logLevel, eventId, formatter(state, exception), exception, values?.ToDictionary(pair => pair.Key, pair => pair.Value)
                ?? new Dictionary<string, object?>()));
        }
    }

    private sealed class RecordingTagResolver : ITagReferenceResolver
    {
        internal IReadOnlyCollection<string> Names { get; private set; } = [];

        public Task<IReadOnlyDictionary<string, TagResolution>> ResolveAsync(
            IReadOnlyCollection<string> names,
            CancellationToken ct)
        {
            Names = names;
            IReadOnlyDictionary<string, TagResolution> resolutions = names.ToDictionary(
                name => name,
                _ => new TagResolution(999, "matched"),
                StringComparer.OrdinalIgnoreCase);
            return Task.FromResult(resolutions);
        }
    }

    private sealed class ThrowingTagResolver(Exception exception) : ITagReferenceResolver
    {
        public Task<IReadOnlyDictionary<string, TagResolution>> ResolveAsync(IReadOnlyCollection<string> names, CancellationToken ct) => Task.FromException<IReadOnlyDictionary<string, TagResolution>>(exception);
    }

    private sealed class CancelingTagResolver(CancellationTokenSource cancellation) : ITagReferenceResolver
    {
        public Task<IReadOnlyDictionary<string, TagResolution>> ResolveAsync(IReadOnlyCollection<string> names, CancellationToken ct)
        {
            cancellation.Cancel();
            return Task.FromCanceled<IReadOnlyDictionary<string, TagResolution>>(ct);
        }
    }

    private sealed class RecordingStudioResolver : IStudioReferenceResolver
    {
        internal IReadOnlyDictionary<int, IReadOnlyList<StudioReference>> References { get; private set; } =
            new Dictionary<int, IReadOnlyList<StudioReference>>();

        public Task<IReadOnlyDictionary<int, StudioResolution>> ResolveAsync(
            IReadOnlyDictionary<int, IReadOnlyList<StudioReference>> references,
            CancellationToken ct)
        {
            References = references;
            IReadOnlyDictionary<int, StudioResolution> resolutions =
                references.ToDictionary(pair => pair.Key, _ => new StudioResolution(999, "matched"));
            return Task.FromResult(resolutions);
        }
    }

    private sealed class StubPerformerRepository(params Performer[] performers) : IPerformerRepository
    {
        internal List<(string Endpoint, IReadOnlyList<string> RemoteIds)> Queries { get; } = [];

        public Task<IReadOnlyList<Performer>> FindByNamesOrRemoteIdsAsync(
            IReadOnlyList<string> names, string? remoteEndpoint, IReadOnlyList<string> remoteIds,
            CancellationToken ct = default)
        {
            Queries.Add((remoteEndpoint!, remoteIds));
            IReadOnlyList<Performer> matches = performers.Where(performer => performer.RemoteIds.Any(remote =>
                remote.Endpoint == remoteEndpoint && remoteIds.Contains(remote.RemoteId))).ToArray();
            return Task.FromResult(matches);
        }

        public Task<Performer?> GetByIdAsync(int id, CancellationToken ct = default) =>
            Task.FromResult(performers.SingleOrDefault(item => item.Id == id));
        public Task<IReadOnlyList<Performer>> GetAllAsync(CancellationToken ct = default) =>
            Task.FromResult<IReadOnlyList<Performer>>(performers);
        public Task<Performer> AddAsync(Performer entity, CancellationToken ct = default) => throw new NotSupportedException();
        public Task UpdateAsync(Performer entity, CancellationToken ct = default) => throw new NotSupportedException();
        public Task DeleteAsync(int id, CancellationToken ct = default) => throw new NotSupportedException();
        public Task<int> CountAsync(CancellationToken ct = default) => Task.FromResult(performers.Length);
        public Task<(IReadOnlyList<Performer> Items, int TotalCount)> FindAsync(
            PerformerFilter? filter, FindFilter? findFilter, CancellationToken ct = default) =>
            throw new NotSupportedException();
        public Task<Performer?> GetByIdWithRelationsAsync(int id, CancellationToken ct = default) =>
            GetByIdAsync(id, ct);
        public Task<Performer?> FindByRemoteIdAsync(
            string remoteEndpoint, string remoteId, CancellationToken ct = default) =>
            Task.FromResult(performers.SingleOrDefault(performer => performer.RemoteIds.Any(remote =>
                remote.Endpoint == remoteEndpoint && remote.RemoteId == remoteId)));
    }

    private sealed class StubTagRepository(params Tag[] tags) : ITagRepository
    {
        public Task<IReadOnlyList<Tag>> FindByNamesAsync(
            IReadOnlyList<string> names,
            CancellationToken ct = default)
        {
            IReadOnlyList<Tag> matches = tags
                .Where(tag => names.Contains(tag.Name, StringComparer.OrdinalIgnoreCase))
                .ToArray();
            return Task.FromResult(matches);
        }

        public Task<Tag?> GetByIdAsync(int id, CancellationToken ct = default) =>
            Task.FromResult(tags.SingleOrDefault(item => item.Id == id));
        public Task<IReadOnlyList<Tag>> GetAllAsync(CancellationToken ct = default) =>
            Task.FromResult<IReadOnlyList<Tag>>(tags);
        public Task<Tag> AddAsync(Tag entity, CancellationToken ct = default) => throw new NotSupportedException();
        public Task UpdateAsync(Tag entity, CancellationToken ct = default) => throw new NotSupportedException();
        public Task DeleteAsync(int id, CancellationToken ct = default) => throw new NotSupportedException();
        public Task<int> CountAsync(CancellationToken ct = default) => Task.FromResult(tags.Length);
        public Task<(IReadOnlyList<Tag> Items, int TotalCount)> FindAsync(
            TagFilter? filter, FindFilter? findFilter, CancellationToken ct = default) =>
            throw new NotSupportedException();
        public Task<Tag?> GetByIdWithRelationsAsync(int id, CancellationToken ct = default) =>
            GetByIdAsync(id, ct);
        public Task<Tag?> GetByNameAsync(string name, CancellationToken ct = default) =>
            Task.FromResult(tags.SingleOrDefault(tag =>
                string.Equals(tag.Name, name, StringComparison.OrdinalIgnoreCase)));
        public Task<Dictionary<string, Tag>> FindOrCreateByNamesAsync(
            IReadOnlyList<string> names,
            CancellationToken ct = default) =>
            throw new NotSupportedException();
    }

    private sealed class StubStudioRepository(params Studio[] studios) : IStudioRepository
    {
        internal int GetAllCalls { get; private set; }
        internal int GetWithRelationsCalls { get; private set; }
        internal int FindCalls { get; private set; }

        public Task<Studio?> GetByIdAsync(int id, CancellationToken ct = default) =>
            Task.FromResult(studios.SingleOrDefault(item => item.Id == id));
        public Task<IReadOnlyList<Studio>> GetAllAsync(CancellationToken ct = default)
        {
            GetAllCalls++;
            return Task.FromResult<IReadOnlyList<Studio>>(studios);
        }
        public Task<Studio> AddAsync(Studio entity, CancellationToken ct = default) =>
            throw new NotSupportedException();
        public Task UpdateAsync(Studio entity, CancellationToken ct = default) =>
            throw new NotSupportedException();
        public Task DeleteAsync(int id, CancellationToken ct = default) =>
            throw new NotSupportedException();
        public Task<int> CountAsync(CancellationToken ct = default) => Task.FromResult(studios.Length);
        public Task<(IReadOnlyList<Studio> Items, int TotalCount)> FindAsync(
            StudioFilter? filter, FindFilter? findFilter, CancellationToken ct = default)
        {
            FindCalls++;
            var matches = studios.Where(studio => studio.RemoteIds.Any(remote =>
                string.Equals(remote.Endpoint, filter?.RemoteIdCriterion?.Value, StringComparison.OrdinalIgnoreCase)))
                .ToArray();
            return Task.FromResult<(IReadOnlyList<Studio> Items, int TotalCount)>((matches, matches.Length));
        }
        public Task<Studio?> GetByIdWithRelationsAsync(int id, CancellationToken ct = default)
        {
            GetWithRelationsCalls++;
            return GetByIdAsync(id, ct);
        }
    }
}
