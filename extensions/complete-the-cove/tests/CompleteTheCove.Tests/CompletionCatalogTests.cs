using Cove.Core.Auth;
using Cove.Core.Entities;
using Cove.Core.Interfaces;
using Cove.Plugins;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Routing;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging.Abstractions;
using System.Net;
using System.Text;

namespace CompleteTheCove.Tests;

public sealed class CompletionCatalogTests
{
    [Fact]
    public void Manifest_exposes_native_catalog_detail_and_entity_tabs()
    {
        var extension = new CompleteTheCoveExtension();
        ((IManifestAware)extension).ApplyManifest(new ExtensionManifestFile
        {
            Id = "complete-the-cove",
            Name = "Complete the Cove",
            Version = "1.0.0"
        });
        var manifest = extension.GetUIManifest();
        Assert.Contains(manifest.Pages, x => x.Route == "missing-videos" && x.Label == "Complete the Cove" && x.ShowInNav);
        Assert.Contains(manifest.Pages, x => x.Route == "missing-video" && x.Label == "Missing Video" && !x.ShowInNav);
        Assert.Contains(manifest.Pages, x => x.Route == "missing-scenes" && !x.ShowInNav && x.ComponentName == "LegacyMissingVideosPage");
        Assert.Contains(manifest.Pages, x => x.Route == "missing-scene" && !x.ShowInNav && x.ComponentName == "LegacyMissingVideoDetailPage");
        Assert.All(manifest.Tabs, tab => Assert.Equal("Missing Videos", tab.Label));
        Assert.Equal(["performer", "studio", "tag"], manifest.Tabs.Select(x => x.PageType).ToArray());
        Assert.Collection(manifest.Tabs,
            tab => Assert.Equal(["extensions.configure", "performers.read"], Assert.IsType<string[]>(tab.RequiredPermissions)),
            tab => Assert.Equal(["extensions.configure", "studios.read"], Assert.IsType<string[]>(tab.RequiredPermissions)),
            tab => Assert.Equal(["extensions.configure", "tags.read"], Assert.IsType<string[]>(tab.RequiredPermissions)));
    }

    [Fact]
    public async Task Entity_target_endpoints_match_their_tab_permissions_and_route_entity_kind()
    {
        var builder = WebApplication.CreateBuilder();
        builder.Services.AddSingleton<CoveConfiguration>();
        builder.Services.AddSingleton<IBlobService, BlobStub>();
        builder.Services.AddSingleton<IJobService, JobServiceStub>();
        builder.Services.AddScoped<DbContext>(_ => CreateDb());
        builder.Services.AddScoped<CompletionCatalog>();
        await using var app = builder.Build();
        var endpoints = new ExtensionEndpointDataSource(app, "complete-the-cove", app.Services);

        new CompleteTheCoveExtension().MapEndpoints(endpoints);

        AssertTargetEndpointPolicy(endpoints, "performer", EntityKinds.Performer, Permissions.PerformersRead);
        AssertTargetEndpointPolicy(endpoints, "studio", EntityKinds.Studio, Permissions.StudiosRead);
        AssertTargetEndpointPolicy(endpoints, "tag", EntityKinds.Tag, Permissions.TagsRead);
    }

    [Fact]
    public async Task Legacy_scene_api_aliases_keep_the_video_endpoint_permission()
    {
        var builder = WebApplication.CreateBuilder();
        builder.Services.AddSingleton<CoveConfiguration>();
        builder.Services.AddSingleton<IBlobService, BlobStub>();
        builder.Services.AddSingleton<IJobService, JobServiceStub>();
        builder.Services.AddScoped<DbContext>(_ => CreateDb());
        builder.Services.AddScoped<CompletionCatalog>();
        await using var app = builder.Build();
        var endpoints = new ExtensionEndpointDataSource(app, "complete-the-cove", app.Services);

        new CompleteTheCoveExtension().MapEndpoints(endpoints);

        var aliases = endpoints.Endpoints
            .OfType<RouteEndpoint>()
            .Where(endpoint => endpoint.RoutePattern.RawText?.StartsWith(
                "/api/plugins/complete-the-cove/scenes",
                StringComparison.Ordinal) == true)
            .ToArray();
        Assert.Equal(5, aliases.Length);
        Assert.All(aliases, endpoint =>
        {
            var permission = Assert.Single(endpoint.Metadata.OfType<CovePermissionRequirementMetadata>());
            Assert.Equal([Permissions.ExtensionsConfigure], permission.Permissions);
        });
    }

    [Fact]
    public async Task Refresh_job_requires_entity_type_and_id_together()
    {
        await using var services = CreateRefreshServices(new CoveConfiguration());
        var extension = await InitializeExtensionAsync(services);

        var missingId = await Assert.ThrowsAsync<InvalidOperationException>(() => extension.RunJobAsync(
            "refresh-catalog",
            new Dictionary<string, string> { ["entityType"] = "performer" },
            new ProgressStub(),
            default));
        var missingType = await Assert.ThrowsAsync<InvalidOperationException>(() => extension.RunJobAsync(
            "refresh-catalog",
            new Dictionary<string, string> { ["entityId"] = "42" },
            new ProgressStub(),
            default));

        Assert.Equal("entityType and entityId must be supplied together.", missingId.Message);
        Assert.Equal(missingId.Message, missingType.Message);
    }

    [Fact]
    public async Task Refresh_job_partitions_progress_across_configured_providers()
    {
        var configuration = new CoveConfiguration();
        configuration.Scraping.MetadataServers =
        [
            new() { Name = "First", Endpoint = "https://first.example/graphql", ApiKey = "one" },
            new() { Name = "Second", Endpoint = "https://second.example/graphql", ApiKey = "two" },
        ];
        await using var services = CreateRefreshServices(configuration);
        var extension = await InitializeExtensionAsync(services);
        var progress = new ProgressRecorder();

        await extension.RunJobAsync("refresh-catalog", null, progress, default);

        Assert.Equal([0.5, 1], progress.Reports.Select(report => report.Percent).ToArray());
    }

    private static void AssertTargetEndpointPolicy(
        ExtensionEndpointDataSource endpoints,
        string routeType,
        string entityKind,
        string readPermission)
    {
        var routePrefix = $"/api/plugins/complete-the-cove/targets/{routeType}/{{entityId:int}}";
        var targetEndpoints = endpoints.Endpoints
            .OfType<RouteEndpoint>()
            .Where(endpoint => endpoint.RoutePattern.RawText is { } route
                && (route == routePrefix || route == routePrefix + "/count"))
            .ToArray();

        Assert.Equal(4, targetEndpoints.Length);
        Assert.All(targetEndpoints, endpoint =>
        {
            var permission = Assert.Single(endpoint.Metadata.OfType<CovePermissionRequirementMetadata>());
            Assert.Equal([Permissions.ExtensionsConfigure, readPermission], permission.Permissions);
            var entity = Assert.Single(endpoint.Metadata.OfType<CoveRouteEntityAccessRequirementMetadata>());
            Assert.Equal(entityKind, entity.EntityKind);
            Assert.Equal("entityId", entity.RouteValueName);
            Assert.Equal(readPermission, entity.Permission);
        });
    }

    [Fact]
    public void Catalog_tables_use_complete_the_cove_identity()
    {
        using var db = CreateDb();
        var tableNames = new[]
        {
            typeof(CompletionTarget), typeof(CompletionVideo), typeof(CompletionVideoTarget),
            typeof(CompletionVideoPerformer), typeof(CompletionVideoTag), typeof(CompletionVideoUrl)
        }.Select(type => db.Model.FindEntityType(type)?.GetTableName() ?? "").ToArray();

        Assert.Equal([
            "complete_the_cove_targets", "complete_the_cove_videos", "complete_the_cove_video_targets",
            "complete_the_cove_video_performers", "complete_the_cove_video_tags", "complete_the_cove_video_urls"
        ], tableNames);
        Assert.DoesNotContain(tableNames, name => name?.Contains("stash", StringComparison.OrdinalIgnoreCase) == true);
        var target = db.Model.FindEntityType(typeof(CompletionTarget))!;
        Assert.Contains(target.GetIndexes(), index => index.IsUnique && index.Properties.Select(property => property.Name).SequenceEqual(["EntityType", "EntityId", "RemoteEndpoint"]));
    }

    [Fact]
    public void Video_terminology_migration_preserves_history_and_renames_owned_sequences()
    {
        var migrations = new CompleteTheCoveExtension().GetMigrations();

        Assert.Equal([
            "001_single_cove_catalog",
            "002_local_performer_links",
            "003_normalize_local_performer_links",
            "004_multi_source_targets",
            "005_remove_legacy_single_source_constraint",
            "006_local_tag_studio_links",
            "007_backfill_local_tag_studio_links",
            "008_ignored_scenes",
            "009_provider_completion_progress",
            "010_video_terminology",
        ], migrations.Select(migration => migration.Name).ToArray());

        var migration = Assert.Single(migrations, migration => migration.Name == "010_video_terminology").UpSql;
        Assert.Contains("complete_the_cove_scenes RENAME TO complete_the_cove_videos", migration);
        Assert.Contains("pg_get_serial_sequence", migration);
        Assert.Contains("complete_the_cove_videos_Id_seq", migration);
        Assert.Contains("complete_the_cove_video_performers_Id_seq", migration);
        Assert.Contains("complete_the_cove_video_tags_Id_seq", migration);
        Assert.Contains("complete_the_cove_video_urls_Id_seq", migration);
    }

    [Fact]
    public void Discovery_registry_creates_distinct_stashbox_and_tpdb_clients()
    {
        var configuration = new Cove.Core.Interfaces.CoveConfiguration();
        configuration.Scraping.MetadataServers =
        [
            new() { Name = "StashDB", Endpoint = "https://stashdb.org/graphql", ApiKey = "one" },
            new() { Name = "ThePornDB", Endpoint = "https://theporndb.net/graphql", ApiKey = "two" },
            new() { Name = "Private box", Endpoint = "https://example.test/graphql", ApiKey = "three" },
            new() { Name = "Unsupported", Endpoint = "https://example.test/api", ApiKey = "four" },
        ];

        var discoveries = CompletionDiscoveryProviders.CreateConfigured(configuration);

        Assert.Collection(discoveries,
            item => Assert.IsType<StashBoxDiscoveryClient>(item),
            item => Assert.IsType<TpdbDiscoveryClient>(item),
            item => Assert.IsType<StashBoxDiscoveryClient>(item));
        Assert.True(CompletionCatalog.SameProvider("https://api.theporndb.net/", "https://theporndb.net/graphql"));
        foreach (var discovery in discoveries.OfType<IDisposable>()) discovery.Dispose();
    }

    [Fact]
    public void Discovery_registry_selects_multiple_stashbox_instances_by_endpoint()
    {
        var configuration = new Cove.Core.Interfaces.CoveConfiguration();
        configuration.Scraping.MetadataServers =
        [
            new() { Name = "StashDB", Endpoint = "https://stashdb.org/graphql", ApiKey = "one" },
            new() { Name = "FansDB", Endpoint = "https://fansdb.xyz/graphql", ApiKey = "two" },
            new() { Name = "PMVStash", Endpoint = "https://pmvstash.org/graphql", ApiKey = "three" },
        ];
        var selected = new HashSet<string>(
            ["https://stashdb.org/graphql/", "https://fansdb.xyz/graphql"],
            StringComparer.OrdinalIgnoreCase);

        var discoveries = CompletionDiscoveryProviders.CreateConfigured(configuration, selected);

        Assert.Equal(["https://stashdb.org/graphql", "https://fansdb.xyz/graphql"], discoveries.Select(x => x.Endpoint).ToArray());
        Assert.All(discoveries, item => Assert.IsType<StashBoxDiscoveryClient>(item));
        foreach (var discovery in discoveries.OfType<IDisposable>()) discovery.Dispose();
    }

    [Fact]
    public void Discovery_registry_selects_one_enabled_provider_for_a_scoped_refresh()
    {
        var configuration = new Cove.Core.Interfaces.CoveConfiguration();
        configuration.Scraping.MetadataServers =
        [
            new() { Name = "StashDB", Endpoint = "https://stashdb.org/graphql", ApiKey = "one" },
            new() { Name = "FansDB", Endpoint = "https://fansdb.xyz/graphql", ApiKey = "two" },
        ];
        var enabled = new HashSet<string>(
            ["https://stashdb.org/graphql", "https://fansdb.xyz/graphql"],
            StringComparer.OrdinalIgnoreCase);

        var discoveries = CompletionDiscoveryProviders.CreateConfigured(
            configuration,
            enabled,
            "HTTPS://FANSDB.XYZ/graphql/");

        var discovery = Assert.Single(discoveries);
        Assert.Equal("https://fansdb.xyz/graphql", discovery.Endpoint);
        Assert.IsAssignableFrom<IDisposable>(discovery).Dispose();
    }

    [Fact]
    public void Discovery_registry_rejects_a_scoped_refresh_for_a_provider_not_enabled_in_the_extension()
    {
        var configuration = new Cove.Core.Interfaces.CoveConfiguration();
        configuration.Scraping.MetadataServers =
        [
            new() { Name = "StashDB", Endpoint = "https://stashdb.org/graphql", ApiKey = "one" },
            new() { Name = "FansDB", Endpoint = "https://fansdb.xyz/graphql", ApiKey = "two" },
        ];
        var enabled = new HashSet<string>(["https://stashdb.org/graphql"], StringComparer.OrdinalIgnoreCase);

        var discoveries = CompletionDiscoveryProviders.CreateConfigured(
            configuration,
            enabled,
            "https://fansdb.xyz/graphql");

        Assert.Empty(discoveries);
    }

    [Fact]
    public void Settings_normalize_selected_endpoints_and_keep_blank_as_all()
    {
        var configuration = new Cove.Core.Interfaces.CoveConfiguration();
        configuration.PluginConfigurations["complete-the-cove"] = new()
        {
            ["selected_metadata_endpoints"] = " https://stashdb.org/graphql/, HTTPS://FANSDB.XYZ/graphql ",
        };

        var selected = CompleteSettings.From(configuration).SelectedMetadataEndpoints!;

        Assert.Equal(2, selected.Count);
        Assert.Contains("https://stashdb.org/graphql", selected);
        Assert.Contains("https://fansdb.xyz/graphql", selected);
        configuration.PluginConfigurations["complete-the-cove"]["selected_metadata_endpoints"] = "";
        Assert.Empty(CompleteSettings.From(configuration).SelectedMetadataEndpoints!);
    }

    [Fact]
    public async Task Stashbox_client_owns_graphql_querying_and_authentication()
    {
        HttpRequestMessage? sent = null;
        string? body = null;
        using var client = new StashBoxDiscoveryClient(
            new() { Name = "StashDB", Endpoint = "https://stashdb.org/graphql", ApiKey = "secret" },
            new DelegateHandler(request =>
            {
                sent = request;
                body = request.Content!.ReadAsStringAsync().GetAwaiter().GetResult();
                return JsonResponse("""{"data":{"queryScenes":{"count":0,"scenes":[]}}}""");
            }));

        var videos = await client.DiscoverAsync(Target(1, "performer-1"), default);

        Assert.Empty(videos);
        Assert.Equal(HttpMethod.Post, sent!.Method);
        Assert.Equal("https://stashdb.org/graphql", sent.RequestUri!.ToString());
        Assert.Equal("secret", Assert.Single(sent.Headers.GetValues("ApiKey")));
        Assert.Contains("queryScenes", body);
        Assert.DoesNotContain("direction", body, StringComparison.OrdinalIgnoreCase);
    }

    [Fact]
    public async Task Tpdb_client_owns_rest_querying_and_normalizes_catalog_output()
    {
        HttpRequestMessage? sent = null;
        using var client = new TpdbDiscoveryClient(
            new() { Name = "ThePornDB", Endpoint = "https://theporndb.net/graphql", ApiKey = "secret" },
            new DelegateHandler(request =>
            {
                sent = request;
                return JsonResponse("""
                {"data":[{"id":"scene-1","title":"Missing","external_id":"CODE","description":"Details","date":"2026-01-02",
                  "url":"https://example.test/scene","background":{"full":"https://theporndb.net/cover.jpg"},
                  "site":{"uuid":"studio-1","name":"Studio","network":{"uuid":"parent-1","name":"Parent"}},
                  "performers":[{"id":"performer-1","name":"Performer","disambiguation":"One","aliases":["Alias"]}],
                  "tags":[{"uuid":"tag-1","name":"Tag"}]}],
                 "meta":{"current_page":1,"last_page":1}}
                """);
            }));

        var video = Assert.Single(await client.DiscoverAsync(Target(1, "performer-1"), default));

        Assert.Equal(HttpMethod.Get, sent!.Method);
        Assert.Equal("https://api.theporndb.net/performers/performer-1/scenes?page=1&per_page=25", sent.RequestUri!.ToString());
        Assert.Equal("Bearer", sent.Headers.Authorization?.Scheme);
        Assert.Equal("secret", sent.Headers.Authorization?.Parameter);
        Assert.Equal("scene-1", Assert.Single(video.RemoteIds).RemoteId);
        Assert.Equal("https://theporndb.net/graphql", Assert.Single(video.RemoteIds).Endpoint);
        Assert.Equal("https://theporndb.net/cover.jpg", video.CoverUrl);
        Assert.Equal("Parent", video.Studio?.Parent?.Name);
        Assert.Equal("Performer", Assert.Single(video.Performers).Name);
        Assert.Equal("Alias", Assert.Single(Assert.Single(video.Performers).Aliases));
        Assert.Equal("Tag", Assert.Single(video.Tags).Name);
    }

    [Fact]
    public async Task Tpdb_client_owns_studio_query()
    {
        Uri? sent = null;
        using var client = new TpdbDiscoveryClient(
            new() { Name = "TPDB", Endpoint = "https://theporndb.net/graphql", ApiKey = "secret" },
            new DelegateHandler(request =>
            {
                sent = request.RequestUri;
                return JsonResponse("""{"data":[],"meta":{"current_page":1,"last_page":1}}""");
            }));
        var target = new CompletionTarget
        {
            EntityType = CompletionTargetType.Studio,
            EntityId = 1,
            DisplayName = "Studio",
            RemoteEndpoint = "https://theporndb.net/graphql",
            RemoteId = "studio-1"
        };

        Assert.Empty(await client.DiscoverAsync(target, default));
        Assert.Equal("https://api.theporndb.net/sites/studio-1/scenes?page=1&per_page=25", sent!.AbsoluteUri);
    }

    [Fact]
    public async Task Tpdb_client_resolves_stashbox_tag_before_querying_videos()
    {
        var sent = new List<Uri>();
        using var client = new TpdbDiscoveryClient(
            new() { Name = "TPDB", Endpoint = "https://theporndb.net/graphql", ApiKey = "secret" },
            new DelegateHandler(request =>
            {
                sent.Add(request.RequestUri!);
                return request.RequestUri!.AbsolutePath == "/tags"
                    ? JsonResponse("""{"data":[{"id":70,"uuid":"tag-1","name":"Tag Name"}]}""")
                    : JsonResponse("""{"data":[],"meta":{"current_page":1,"last_page":1}}""");
            }));
        var target = new CompletionTarget
        {
            EntityType = CompletionTargetType.Tag,
            EntityId = 1,
            DisplayName = "Tag Name",
            RemoteEndpoint = "https://theporndb.net/graphql",
            RemoteId = "tag-1"
        };

        Assert.Empty(await client.DiscoverAsync(target, default));
        Assert.Collection(sent,
            request => Assert.Equal("https://api.theporndb.net/tags?q=Tag%20Name&per_page=100", request.AbsoluteUri),
            request => Assert.Equal("https://api.theporndb.net/scenes?tags%5B70%5D=Tag%20Name&page=1&per_page=25", request.AbsoluteUri));
    }

    [Fact]
    public async Task Tpdb_client_uses_numeric_rest_tag_id_without_lookup()
    {
        Uri? sent = null;
        using var client = new TpdbDiscoveryClient(
            new() { Name = "TPDB", Endpoint = "https://theporndb.net/graphql", ApiKey = "secret" },
            new DelegateHandler(request =>
            {
                sent = request.RequestUri;
                return JsonResponse("""{"data":[],"meta":{"current_page":1,"last_page":1}}""");
            }));
        var target = new CompletionTarget
        {
            EntityType = CompletionTargetType.Tag,
            EntityId = 1,
            DisplayName = "Tag Name",
            RemoteEndpoint = "https://theporndb.net/graphql",
            RemoteId = "70"
        };

        Assert.Empty(await client.DiscoverAsync(target, default));
        Assert.Equal("https://api.theporndb.net/scenes?tags%5B70%5D=Tag%20Name&page=1&per_page=25", sent!.AbsoluteUri);
    }

    [Fact]
    public void Stashdb_mapping_keeps_supported_relationships_and_primary_cover()
    {
        using var document = System.Text.Json.JsonDocument.Parse("""
        {"id":"scene-1","title":"Missing","details":"Details","release_date":"2026-01-02","code":"CODE",
         "urls":[{"url":"https://example.test/scene"}],
         "studio":{"id":"studio-1","name":"Studio","parent":{"id":"parent-1","name":"Parent"}},
         "performers":[{"performer":{"id":"performer-1","name":"Performer","disambiguation":"One","gender":"FEMALE","aliases":[]}}],
         "tags":[{"id":"tag-1","name":"Tag"}],"images":[{"url":"https://stashdb.org/cover.jpg"}]}
        """);
        var video = StashBoxDiscoveryClient.MapVideo(document.RootElement, "https://stashdb.org/graphql");
        Assert.Equal("https://stashdb.org/cover.jpg", video.CoverUrl);
        Assert.Equal("Parent", video.Studio?.Parent?.Name);
        Assert.Equal("Performer", Assert.Single(video.Performers).Name);
        Assert.Equal("Tag", Assert.Single(video.Tags).Name);
        Assert.Equal("https://example.test/scene", Assert.Single(video.Urls));
    }

    [Fact]
    public async Task Refresh_maps_relationships_and_is_idempotent()
    {
        await using var db = CreateDb();
        var target = Target(1, "one"); db.Add(target); await db.SaveChangesAsync();
        var catalog = Catalog(db);
        var video = Video("video-1");
        var discovery = new FakeDiscovery(video);

        await catalog.RefreshAsync(discovery, new CompleteSettings(new HashSet<string>()), null, null, new ProgressStub(), default);
        Assert.Null((await db.Set<CompletionTarget>().SingleAsync()).LastRefreshError);
        await catalog.RefreshAsync(discovery, new CompleteSettings(new HashSet<string>()), null, null, new ProgressStub(), default);

        Assert.Single(await db.Set<CompletionVideo>().ToListAsync());
        Assert.Single(await db.Set<CompletionVideoTarget>().ToListAsync());
        Assert.Null(Assert.Single(await db.Set<CompletionVideoPerformer>().ToListAsync()).CovePerformerId);
        Assert.Single(await db.Set<CompletionVideoTag>().ToListAsync());
        Assert.Single(await db.Set<CompletionVideoUrl>().ToListAsync());
    }

    [Fact]
    public async Task Refresh_reports_discovery_and_reconciliation_progress_before_target_completion()
    {
        await using var db = CreateDb();
        db.Add(Target(1, "one"));
        await db.SaveChangesAsync();
        var progress = new ProgressRecorder();
        var discovery = new BlockingDiscovery();

        var refresh = Catalog(db).RefreshAsync(discovery, new CompleteSettings(new HashSet<string>()), null, null, progress, default);
        await discovery.Started.Task.WaitAsync(TimeSpan.FromSeconds(5));

        var discovering = Assert.Single(progress.Reports);
        Assert.InRange(discovering.Percent, 0.01, 0.99);
        Assert.Equal("Discovering videos for performer Target 1 (1/1)...", discovering.Message);

        discovery.Complete([Video("video-1")]);
        await refresh;

        Assert.Contains(progress.Reports, report => report.Percent > discovering.Percent
            && report.Percent < 1
            && report.Message == "Reconciling performer Target 1 (1/1; 1 video found)...");
        Assert.Equal(1, progress.Reports[^1].Percent);
    }

    [Fact]
    public async Task Refresh_progress_is_monotonic_for_many_targets()
    {
        await using var db = CreateDb();
        db.AddRange(Enumerable.Range(1, 21).Select(id => Target(id, $"target-{id}")));
        await db.SaveChangesAsync();
        var progress = new ProgressRecorder();

        await Catalog(db).RefreshAsync(new FakeDiscovery(), new CompleteSettings(new HashSet<string>()), null, null, progress, default);

        Assert.All(progress.Reports.Zip(progress.Reports.Skip(1)), pair =>
            Assert.True(pair.First.Percent <= pair.Second.Percent,
                $"Progress regressed from {pair.First.Percent} to {pair.Second.Percent}."));
        Assert.Equal(1, progress.Reports[^1].Percent);
    }

    [Fact]
    public void Ranged_progress_keeps_multiple_providers_monotonic()
    {
        var progress = new ProgressRecorder();
        var first = new RangedJobProgress(progress, 0, 0.5);
        var second = new RangedJobProgress(progress, 0.5, 1);

        first.Report(0.05, "First discovery");
        first.Report(1, "First complete");
        second.Report(0.05, "Second discovery");
        second.Report(1, "Second complete");

        Assert.Equal([0.025, 0.5, 0.525, 1], progress.Reports.Select(report => report.Percent).ToArray());
    }

    [Fact]
    public async Task Refresh_links_remote_performers_to_existing_cove_performers()
    {
        await using var db = CreateDb();
        db.Add(Target(1, "one"));
        db.Add(new Cove.Core.Entities.PerformerRemoteId
        {
            PerformerId = 42,
            Endpoint = "https://stashdb.org/graphql/",
            RemoteId = "performer"
        });
        await db.SaveChangesAsync();

        await Catalog(db).RefreshAsync(new FakeDiscovery(Video("linked")), new CompleteSettings(new HashSet<string>()), null, null, new ProgressStub(), default);

        Assert.Equal(42, Assert.Single(await db.Set<CompletionVideoPerformer>().ToListAsync()).CovePerformerId);
    }

    [Fact]
    public async Task Shared_video_survives_untracking_until_last_target_is_removed()
    {
        await using var db = CreateDb();
        db.AddRange(Target(1, "one"), Target(2, "two")); await db.SaveChangesAsync();
        var catalog = Catalog(db);
        await catalog.RefreshAsync(new FakeDiscovery(Video("shared")), new CompleteSettings(new HashSet<string>()), null, null, new ProgressStub(), default);
        Assert.Equal(2, await db.Set<CompletionVideoTarget>().CountAsync());

        await catalog.UntrackAsync(CompletionTargetType.Performer, 1, default);
        Assert.Single(await db.Set<CompletionVideo>().ToListAsync());
        await catalog.UntrackAsync(CompletionTargetType.Performer, 2, default);
        Assert.Empty(await db.Set<CompletionVideo>().ToListAsync());
    }

    [Fact]
    public async Task Target_overview_groups_types_orders_names_and_counts_shared_videos()
    {
        await using var db = CreateDb();
        var laterPerformer = Target(1, "one"); laterPerformer.DisplayName = "Zulu";
        var earlierPerformer = Target(2, "two"); earlierPerformer.DisplayName = "alpha";
        var studio = Target(3, "three"); studio.EntityType = CompletionTargetType.Studio; studio.DisplayName = "Studio";
        var tag = Target(4, "four"); tag.EntityType = CompletionTargetType.Tag; tag.DisplayName = "Tag";
        db.AddRange(laterPerformer, earlierPerformer, studio, tag);
        await db.SaveChangesAsync();
        var shared = new CompletionVideo
        {
            RemoteEndpoint = "https://stashdb.org/graphql", RemoteId = "shared", Title = "Shared"
        };
        db.Add(shared);
        db.AddRange(
            new CompletionVideoTarget { Video = shared, Target = laterPerformer },
            new CompletionVideoTarget { Video = shared, Target = studio });
        await db.SaveChangesAsync();

        var result = await Catalog(db).GetTargetOverviewAsync(default);

        Assert.Equal(4, result.Totals.All);
        Assert.Equal(2, result.Totals.Performer);
        Assert.Equal(1, result.Totals.Studio);
        Assert.Equal(1, result.Totals.Tag);
        Assert.Equal(["alpha", "Zulu", "Studio", "Tag"], result.Items.Select(x => x.DisplayName).ToArray());
        Assert.Equal(["performer", "performer", "studio", "tag"], result.Items.Select(x => x.Type).ToArray());
        Assert.Equal([0, 1, 1, 0], result.Items.Select(x => x.MissingVideoCount).ToArray());
    }

    [Fact]
    public async Task Refresh_persists_provider_specific_completion_from_eligible_videos()
    {
        await using var db = CreateDb();
        db.Add(Target(1, "one"));
        db.Add(new VideoRemoteId
        {
            VideoId = 42,
            Endpoint = "https://stashdb.org/graphql",
            RemoteId = "owned"
        });
        await db.SaveChangesAsync();
        var excluded = Video("excluded") with
        {
            Tags =
            [
                new SourceTag(0, "Excluded", null, null, false, [],
                    [new RemoteKey("https://stashdb.org/graphql", "excluded-tag")], false)
            ]
        };

        await Catalog(db).RefreshAsync(
            new FakeDiscovery(Video("owned"), Video("missing"), excluded, Video("missing")),
            new CompleteSettings(new HashSet<string>(["Excluded"], StringComparer.OrdinalIgnoreCase)),
            null, null, new ProgressStub(), default);

        var target = await db.Set<CompletionTarget>().SingleAsync();
        Assert.Equal(2, target.EligibleVideoCount);
        Assert.Equal(1, target.OwnedVideoCount);
        Assert.NotNull(target.LastSuccessfulRefreshAt);
        var progress = Assert.Single(Assert.Single((await Catalog(db).GetTargetOverviewAsync(default)).Items).Providers);
        Assert.Equal("https://stashdb.org/graphql", progress.Endpoint);
        Assert.Equal(2, progress.EligibleVideoCount);
        Assert.Equal(1, progress.OwnedVideoCount);
    }

    [Fact]
    public async Task Target_overview_omits_unrefreshed_provider_progress()
    {
        await using var db = CreateDb();
        var refreshed = Target(1, "one");
        refreshed.EligibleVideoCount = 20;
        refreshed.OwnedVideoCount = 19;
        refreshed.LastSuccessfulRefreshAt = new DateTime(2026, 7, 20, 12, 0, 0, DateTimeKind.Utc);
        var unrefreshed = Target(1, "two");
        unrefreshed.RemoteEndpoint = "https://theporndb.net/graphql";
        db.AddRange(refreshed, unrefreshed);
        await db.SaveChangesAsync();

        var item = Assert.Single((await Catalog(db).GetTargetOverviewAsync(default)).Items);

        var progress = Assert.Single(item.Providers);
        Assert.Equal("https://stashdb.org/graphql", progress.Endpoint);
        Assert.Equal(19, progress.OwnedVideoCount);
        Assert.Equal(20, progress.EligibleVideoCount);
    }

    [Fact]
    public async Task Failed_refresh_keeps_last_successful_provider_progress()
    {
        await using var db = CreateDb();
        db.Add(Target(1, "one"));
        await db.SaveChangesAsync();
        var catalog = Catalog(db);
        await catalog.RefreshAsync(
            new FakeDiscovery(Video("missing")),
            new CompleteSettings(new HashSet<string>()),
            null, null, new ProgressStub(), default);
        var first = await db.Set<CompletionTarget>().SingleAsync();
        var successfulAt = first.LastSuccessfulRefreshAt;

        await catalog.RefreshAsync(
            new ThrowingDiscovery(),
            new CompleteSettings(new HashSet<string>()),
            null, null, new ProgressStub(), default);

        var target = await db.Set<CompletionTarget>().SingleAsync();
        Assert.Equal(successfulAt, target.LastSuccessfulRefreshAt);
        Assert.Equal(1, target.EligibleVideoCount);
        Assert.Equal(0, target.OwnedVideoCount);
        Assert.NotNull(target.LastRefreshError);
        var progress = Assert.Single(Assert.Single((await catalog.GetTargetOverviewAsync(default)).Items).Providers);
        Assert.Equal(target.LastRefreshError, progress.LastRefreshError);
    }

    [Fact]
    public async Task Failed_reconciliation_keeps_last_successful_provider_progress()
    {
        await using var db = CreateDb();
        db.Add(Target(1, "one"));
        await db.SaveChangesAsync();
        var catalog = Catalog(db);
        await catalog.RefreshAsync(
            new FakeDiscovery(Video("first")),
            new CompleteSettings(new HashSet<string>()),
            null, null, new ProgressStub(), default);
        var successfulAt = (await db.Set<CompletionTarget>().SingleAsync()).LastSuccessfulRefreshAt;
        var invalid = Video("invalid") with { Performers = null! };

        await catalog.RefreshAsync(
            new FakeDiscovery(Video("second"), invalid),
            new CompleteSettings(new HashSet<string>()),
            null, null, new ProgressStub(), default);

        var target = await db.Set<CompletionTarget>().SingleAsync();
        Assert.Equal(successfulAt, target.LastSuccessfulRefreshAt);
        Assert.Equal(1, target.EligibleVideoCount);
        Assert.Equal(0, target.OwnedVideoCount);
        Assert.NotNull(target.LastRefreshError);
    }

    [Fact]
    public async Task Video_filters_support_any_all_exclusions_and_cross_criterion_and()
    {
        await using var db = CreateDb();
        db.AddRange(
            FilterVideo("both", ["p1", "p2"], ["t1", "t2"]),
            FilterVideo("first", ["p1"], ["t1"]),
            FilterVideo("second", ["p2"], ["t2"]));
        await db.SaveChangesAsync();

        var allPerformers = await ApplyVideoFilters(db,
            ("performerMode", "all"),
            ("performer", Facet("p1")),
            ("performer", Facet("p2")));
        var includedAndExcludedTags = await ApplyVideoFilters(db,
            ("tagMode", "any"),
            ("tag", Facet("t1")),
            ("tag", Facet("t2")),
            ("excludeTag", Facet("t2")));
        var combinedCriteria = await ApplyVideoFilters(db,
            ("performer", Facet("p1")),
            ("tag", Facet("t2")));

        Assert.Equal(["both"], allPerformers);
        Assert.Equal(["first"], includedAndExcludedTags);
        Assert.Equal(["both"], combinedCriteria);
    }

    [Fact]
    public async Task Video_filters_support_null_modes_and_sub_studios()
    {
        await using var db = CreateDb();
        db.AddRange(
            FilterVideo("parent-match", [], [], "child", "parent"),
            FilterVideo("direct-match", [], [], "parent"),
            FilterVideo("other", [], [], "other"),
            FilterVideo("no-studio", [], []));
        await db.SaveChangesAsync();

        var withParent = await ApplyVideoFilters(db,
            ("studio", Facet("parent")),
            ("includeSubstudios", "true"));
        var withoutParent = await ApplyVideoFilters(db,
            ("studio", Facet("parent")));
        var noStudio = await ApplyVideoFilters(db, ("studioMode", "null"));
        var hasStudio = await ApplyVideoFilters(db, ("studioMode", "not-null"));

        Assert.Equal(["direct-match", "parent-match"], withParent);
        Assert.Equal(["direct-match"], withoutParent);
        Assert.Equal(["no-studio"], noStudio);
        Assert.Equal(["direct-match", "other", "parent-match"], hasStudio);
    }

    [Fact]
    public async Task Studio_facets_include_matching_studios_and_their_parents()
    {
        await using var db = CreateDb();
        db.AddRange(
            StudioVideo("child-one", "child", "Child", "parent", "Parent old"),
            StudioVideo("child-two", "child", "Child", "parent", "Parent"),
            StudioVideo("parent-direct", "parent", "Parent canonical"),
            StudioVideo("self-parent", "parent", "Parent canonical", "parent", "Parent stale"),
            StudioVideo("other", "other", "Other"));
        await db.SaveChangesAsync();

        var facets = (await CompleteTheCoveExtension.BuildStudioFacetsAsync(db.Set<CompletionVideo>()))
            .Select(facet => $"{facet.Name}:{facet.Count}")
            .ToArray();

        Assert.Equal(["Child:2", "Other:1", "Parent canonical:4"], facets);
    }

    [Fact]
    public async Task Ignored_status_filter_supports_all_ignored_not_ignored_and_legacy_urls()
    {
        await using var db = CreateDb();
        db.AddRange(
            new CompletionVideo { RemoteEndpoint = "https://example.test", RemoteId = "visible", IsIgnored = false },
            new CompletionVideo { RemoteEndpoint = "https://example.test", RemoteId = "ignored", IsIgnored = true });
        await db.SaveChangesAsync();

        async Task<string[]> Filter(string query)
        {
            var context = new DefaultHttpContext();
            context.Request.QueryString = new QueryString(query);
            return await CompleteTheCoveExtension.ApplyIgnoredStatus(context.Request, db.Set<CompletionVideo>())
                .OrderBy(video => video.RemoteId)
                .Select(video => video.RemoteId)
                .ToArrayAsync();
        }

        Assert.Equal(["visible"], await Filter(""));
        Assert.Equal(["ignored", "visible"], await Filter("?ignored=all"));
        Assert.Equal(["ignored"], await Filter("?ignored=ignored"));
        Assert.Equal(["visible"], await Filter("?ignored=not-ignored"));
        Assert.Equal(["ignored", "visible"], await Filter("?showIgnored=true"));
    }

    [Fact]
    public async Task Excluded_video_is_removed_on_successful_reconciliation()
    {
        await using var db = CreateDb(); db.Add(Target(1, "one")); await db.SaveChangesAsync();
        var catalog = Catalog(db); var discovery = new FakeDiscovery(Video("excluded"));
        await catalog.RefreshAsync(discovery, new CompleteSettings(new HashSet<string>()), null, null, new ProgressStub(), default);
        await catalog.RefreshAsync(discovery, new CompleteSettings(new HashSet<string>(["Tag"], StringComparer.OrdinalIgnoreCase)), null, null, new ProgressStub(), default);
        Assert.Empty(await db.Set<CompletionVideo>().ToListAsync());
    }

    [Fact]
    public async Task Ignored_video_remains_ignored_across_refresh_and_can_be_unignored()
    {
        await using var db = CreateDb(); db.Add(Target(1, "one")); await db.SaveChangesAsync();
        var catalog = Catalog(db); var discovery = new FakeDiscovery(Video("ignored"));
        await catalog.RefreshAsync(discovery, new CompleteSettings(new HashSet<string>()), null, null, new ProgressStub(), default);
        var videoId = await db.Set<CompletionVideo>().Select(x => x.Id).SingleAsync();

        Assert.True(await catalog.SetIgnoredAsync(videoId, true, default));
        await catalog.RefreshAsync(discovery, new CompleteSettings(new HashSet<string>()), null, null, new ProgressStub(), default);
        Assert.True((await db.Set<CompletionVideo>().SingleAsync()).IsIgnored);
        await catalog.RefreshAsync(new FakeDiscovery(), new CompleteSettings(new HashSet<string>()), null, null, new ProgressStub(), default);
        Assert.True((await db.Set<CompletionVideo>().SingleAsync()).IsIgnored);

        Assert.True(await catalog.SetIgnoredAsync(videoId, false, default));
        Assert.False((await db.Set<CompletionVideo>().SingleAsync()).IsIgnored);
        Assert.False(await catalog.SetIgnoredAsync(videoId + 1, true, default));
    }

    [Fact]
    public async Task Ignored_video_is_removed_when_it_becomes_owned()
    {
        await using var db = CreateDb(); db.Add(Target(1, "one")); await db.SaveChangesAsync();
        var catalog = Catalog(db); var discovery = new FakeDiscovery(Video("owned-after-ignore"));
        await catalog.RefreshAsync(discovery, new CompleteSettings(new HashSet<string>()), null, null, new ProgressStub(), default);
        var videoId = await db.Set<CompletionVideo>().Select(x => x.Id).SingleAsync();
        await catalog.SetIgnoredAsync(videoId, true, default);
        db.Add(new Cove.Core.Entities.VideoRemoteId { VideoId = 42, Endpoint = "https://stashdb.org/graphql", RemoteId = "owned-after-ignore" });
        await db.SaveChangesAsync();

        await catalog.RefreshAsync(new FakeDiscovery(), new CompleteSettings(new HashSet<string>()), null, null, new ProgressStub(), default);

        Assert.Empty(await db.Set<CompletionVideo>().ToListAsync());
    }

    [Fact]
    public async Task Ignored_video_is_removed_when_it_becomes_excluded()
    {
        await using var db = CreateDb(); db.Add(Target(1, "one")); await db.SaveChangesAsync();
        var catalog = Catalog(db); var discovery = new FakeDiscovery(Video("excluded-after-ignore"));
        await catalog.RefreshAsync(discovery, new CompleteSettings(new HashSet<string>()), null, null, new ProgressStub(), default);
        var videoId = await db.Set<CompletionVideo>().Select(x => x.Id).SingleAsync();
        await catalog.SetIgnoredAsync(videoId, true, default);

        await catalog.RefreshAsync(new FakeDiscovery(), new CompleteSettings(new HashSet<string>(["Tag"], StringComparer.OrdinalIgnoreCase)), null, null, new ProgressStub(), default);

        Assert.Empty(await db.Set<CompletionVideo>().ToListAsync());
    }

    [Fact]
    public async Task Cover_download_rejects_untrusted_redirect_and_non_images()
    {
        using var redirect = new CoverDownloadClient("stashdb.org", new DelegateHandler(_ =>
        {
            var response = new HttpResponseMessage(System.Net.HttpStatusCode.Redirect);
            response.Headers.Location = new Uri("https://other.example/cover.jpg"); return response;
        }));
        await Assert.ThrowsAsync<InvalidOperationException>(() => redirect.DownloadAsync("https://stashdb.org/cover", default));
        using var text = new CoverDownloadClient("stashdb.org", new DelegateHandler(_ => new HttpResponseMessage(System.Net.HttpStatusCode.OK) { Content = new StringContent("text") }));
        await Assert.ThrowsAsync<InvalidOperationException>(() => text.DownloadAsync("https://stashdb.org/cover", default));
        using var svg = new CoverDownloadClient("stashdb.org", new DelegateHandler(_ =>
        {
            var response = new HttpResponseMessage(System.Net.HttpStatusCode.OK) { Content = new StringContent("<svg/>") };
            response.Content.Headers.ContentType = new("image/svg+xml");
            return response;
        }));
        await Assert.ThrowsAsync<InvalidOperationException>(() => svg.DownloadAsync("https://stashdb.org/cover", default));
    }

    private static CompletionCatalog Catalog(DbContext db) => new(db, new BlobStub(), NullLogger<CompletionCatalog>.Instance);
    private static TestDb CreateDb() => new(new DbContextOptionsBuilder<TestDb>().UseInMemoryDatabase(Guid.NewGuid().ToString()).Options);
    private static ServiceProvider CreateRefreshServices(CoveConfiguration configuration) => new ServiceCollection()
        .AddSingleton(configuration)
        .AddSingleton<IBlobService, BlobStub>()
        .AddLogging()
        .AddScoped<DbContext>(_ => CreateDb())
        .AddScoped<CompletionCatalog>()
        .BuildServiceProvider();
    private static async Task<CompleteTheCoveExtension> InitializeExtensionAsync(IServiceProvider services)
    {
        var extension = new CompleteTheCoveExtension();
        await extension.InitializeAsync(services);
        return extension;
    }
    private static CompletionTarget Target(int id, string remoteId) => new() { EntityType = CompletionTargetType.Performer, EntityId = id, DisplayName = $"Target {id}", RemoteEndpoint = "https://stashdb.org/graphql", RemoteId = remoteId };
    private static SourceVideo Video(string id) => new(0, "Video", "CODE", "Details", null, "2026-01-02", false, false, null,
        ["https://example.test/video"], [new RemoteKey("https://stashdb.org/graphql", id)],
        new SourceStudio(0, "Studio", false, null, false, [], [], [new RemoteKey("https://stashdb.org/graphql", "studio")]),
        [new SourceTag(0, "Tag", null, null, false, [], [new RemoteKey("https://stashdb.org/graphql", "tag")], false)],
        [new SourcePerformer(0, "Performer", null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, false, null, [], [], [new RemoteKey("https://stashdb.org/graphql", "performer")])]);
    private static CompletionVideo FilterVideo(
        string id,
        IReadOnlyList<string> performerIds,
        IReadOnlyList<string> tagIds,
        string? studioId = null,
        string? parentStudioId = null) => new()
        {
            RemoteEndpoint = "https://stashdb.org/graphql",
            RemoteId = id,
            Title = id,
            StudioRemoteId = studioId,
            ParentStudioRemoteId = parentStudioId,
            Performers = performerIds.Select(remoteId => new CompletionVideoPerformer
            {
                RemoteId = remoteId,
                Name = remoteId
            }).ToList(),
            Tags = tagIds.Select(remoteId => new CompletionVideoTag
            {
                RemoteId = remoteId,
                Name = remoteId
            }).ToList()
        };
    private static CompletionVideo StudioVideo(
        string id,
        string studioId,
        string studioName,
        string? parentStudioId = null,
        string? parentStudioName = null) => new()
        {
            RemoteEndpoint = "https://stashdb.org/graphql",
            RemoteId = id,
            Title = id,
            StudioRemoteId = studioId,
            StudioName = studioName,
            ParentStudioRemoteId = parentStudioId,
            ParentStudioName = parentStudioName
        };
    private static string Facet(string remoteId) => $"https://stashdb.org/graphql|{remoteId}";
    private static async Task<string[]> ApplyVideoFilters(
        TestDb db,
        params (string Key, string Value)[] values)
    {
        var context = new DefaultHttpContext();
        context.Request.QueryString = QueryString.Create(
            values.Select(value => new KeyValuePair<string, string?>(value.Key, value.Value)));
        return await VideoCatalogFilter.Apply(context.Request, db.Set<CompletionVideo>())
            .OrderBy(video => video.RemoteId)
            .Select(video => video.RemoteId)
            .ToArrayAsync();
    }

    private sealed class TestDb(DbContextOptions options) : DbContext(options)
    {
        protected override void OnModelCreating(ModelBuilder builder)
        {
            new CompleteTheCoveExtension().ConfigureModel(builder);
            builder.Entity<Cove.Core.Entities.VideoRemoteId>(entity =>
            {
                entity.HasKey(x => x.Id);
                entity.Ignore(x => x.Video);
            });
            builder.Entity<Cove.Core.Entities.PerformerRemoteId>(entity =>
            {
                entity.HasKey(x => x.Id);
                entity.Ignore(x => x.Performer);
            });
            builder.Entity<Cove.Core.Entities.StudioRemoteId>(entity =>
            {
                entity.HasKey(x => x.Id);
                entity.Ignore(x => x.Studio);
            });
            builder.Entity<Cove.Core.Entities.TagRemoteId>(entity =>
            {
                entity.HasKey(x => x.Id);
                entity.Ignore(x => x.Tag);
            });
        }
    }
    private sealed class FakeDiscovery(params SourceVideo[] videos) : ICompletionDiscovery
    {
        public string Endpoint => "https://stashdb.org/graphql";
        public Task<IReadOnlyList<SourceVideo>> DiscoverAsync(CompletionTarget target, CancellationToken ct) => Task.FromResult<IReadOnlyList<SourceVideo>>(videos);
    }
    private sealed class ThrowingDiscovery : ICompletionDiscovery
    {
        public string Endpoint => "https://stashdb.org/graphql";
        public Task<IReadOnlyList<SourceVideo>> DiscoverAsync(CompletionTarget target, CancellationToken ct) =>
            throw new InvalidOperationException("Provider unavailable.");
    }
    private sealed class BlockingDiscovery : ICompletionDiscovery
    {
        private readonly TaskCompletionSource<IReadOnlyList<SourceVideo>> _completion = new(TaskCreationOptions.RunContinuationsAsynchronously);
        public string Endpoint => "https://stashdb.org/graphql";
        public TaskCompletionSource Started { get; } = new(TaskCreationOptions.RunContinuationsAsynchronously);
        public Task<IReadOnlyList<SourceVideo>> DiscoverAsync(CompletionTarget target, CancellationToken ct)
        {
            Started.TrySetResult();
            return _completion.Task.WaitAsync(ct);
        }
        public void Complete(IReadOnlyList<SourceVideo> videos) => _completion.TrySetResult(videos);
    }
    private sealed class BlobStub : IBlobService
    {
        public Task<string> StoreBlobAsync(Stream data, string contentType, CancellationToken ct = default) => Task.FromResult(Guid.NewGuid().ToString());
        public Task<(Stream Stream, string ContentType)?> GetBlobAsync(string blobId, CancellationToken ct = default) => Task.FromResult<(Stream, string)?>(null);
        public Task DeleteBlobAsync(string blobId, CancellationToken ct = default) => Task.CompletedTask;
    }
    private sealed class JobServiceStub : IJobService
    {
        public string Enqueue(string type, string description, Func<Cove.Core.Interfaces.IJobProgress, CancellationToken, Task> work, bool exclusive = true) => "job";
        public bool Cancel(string jobId) => false;
        public bool ReorderQueued(string jobId, string? beforeJobId) => false;
        public JobInfo? GetJob(string jobId) => null;
        public IReadOnlyList<JobInfo> GetAllJobs() => [];
        public IReadOnlyList<JobInfo> GetJobHistory() => [];
    }
    private sealed class ProgressStub : Cove.Plugins.IJobProgress { public void Report(double percent, string? message = null) { } }
    private sealed class ProgressRecorder : Cove.Plugins.IJobProgress
    {
        public List<(double Percent, string Message)> Reports { get; } = [];
        public void Report(double percent, string? message = null) => Reports.Add((percent, message ?? ""));
    }
    private sealed class DelegateHandler(Func<HttpRequestMessage, HttpResponseMessage> callback) : HttpMessageHandler
    { protected override Task<HttpResponseMessage> SendAsync(HttpRequestMessage request, CancellationToken cancellationToken) => Task.FromResult(callback(request)); }
    private static HttpResponseMessage JsonResponse(string json) => new(HttpStatusCode.OK)
    {
        Content = new StringContent(json, Encoding.UTF8, "application/json")
    };
}
