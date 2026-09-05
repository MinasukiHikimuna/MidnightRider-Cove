namespace SegmentStudio.Tests;

using Cove.Plugins;
using Cove.Core.Auth;
using Cove.Core.Entities;
using Cove.Core.Interfaces;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Routing;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;

public sealed class ExtensionTests
{
    [Fact]
    public void ContributesSegmentStudioPage()
    {
        var extension = CreateExtension();

        var manifest = extension.GetUIManifest();

        var page = Assert.Single(manifest.Pages);
        Assert.Equal("segment-studio", page.Route);
        Assert.Equal("Segment Studio", page.Label);
        Assert.Equal("SegmentStudioPage", page.ComponentName);
        Assert.Equal("music", page.Icon);
        Assert.True(page.ShowInNav);
        var action = Assert.Single(manifest.Actions);
        Assert.Equal("open-segment-studio", action.Id);
        Assert.Equal("Open in Segment Studio", action.Label);
        Assert.Equal("toolbar", action.ActionType);
        Assert.Equal(["video"], action.EntityTypes);
        Assert.Equal("openSegmentStudio", action.HandlerName);
        Assert.Equal(78, manifest.KeyboardActions.Count);
        var createShortcut = Assert.Single(manifest.KeyboardActions, item => item.Id == "marker.create");
        Assert.Equal(["a"], createShortcut.DefaultBindings);
        Assert.Equal("Editing", createShortcut.Group);
        Assert.Equal("segment-studio", Assert.Single(createShortcut.Scopes).Page);
        var moveToBinShortcut = Assert.Single(manifest.KeyboardActions, item => item.Id == "marker.moveToBin");
        Assert.Equal("segment-studio", Assert.Single(moveToBinShortcut.Scopes).Page);
        var rejectShortcut = Assert.Single(manifest.KeyboardActions, item => item.Id == "marker.reject");
        Assert.Equal("segment-studio", Assert.Single(rejectShortcut.Scopes).Page);
        var nextShortcut = Assert.Single(manifest.KeyboardActions, item => item.Id == "video.playNextSegment");
        Assert.Equal(["Shift+l"], nextShortcut.DefaultBindings);
    }

    [Fact]
    public async Task EveryEndpointDeclaresItsExactCoveAuthorizationPolicy()
    {
        var builder = WebApplication.CreateBuilder();
        builder.Services.AddScoped<DbContext>(_ => null!);
        builder.Services.AddScoped<ICurrentPrincipalAccessor>(_ => null!);
        builder.Services.AddScoped<Cove.Core.Auth.IAuthorizationService>(_ => null!);
        builder.Services.AddScoped<Cove.Core.Events.IEventBus>(_ => null!);
        builder.Services.AddScoped<Cove.Core.Interfaces.IFieldProvenanceService>(_ => null!);
        builder.Services.AddScoped<ISegmentSourceRegistry>(_ => null!);
        builder.Services.AddScoped<ILineageNodeService>(_ => null!);
        builder.Services.AddScoped<ISegmentProvenanceService>(_ => null!);
        builder.Services.AddScoped<ISegmentDuplicationProvenanceService>(_ => null!);
        builder.Services.AddScoped<IDerivationGraphService>(_ => null!);
        builder.Services.AddScoped<ILineageMutationService>(_ => null!);
        builder.Services.AddScoped<ILineageReconciliationService>(_ => null!);
        builder.Services.AddScoped<ISegmentLineageDeletionService>(_ => null!);
        builder.Services.AddScoped<ILineageIntegrityService>(_ => null!);
        builder.Services.AddScoped<INativeAiProvenanceIngestionService>(_ => null!);
        builder.Services.AddScoped<INativeSegmentImportService>(_ => null!);
        builder.Services.AddSingleton<ISegmentStudioAnalysisSettingsStore>(_ => null!);
        builder.Services.AddScoped<ISegmentStudioAnalysisClient>(_ => null!);
        builder.Services.AddScoped<ISegmentStudioVideoAnalysisService>(_ => null!);
        builder.Services.AddScoped<ISegmentStudioAnalysisProvenanceService>(_ => null!);
        builder.Services.AddSingleton<IJobService>(_ => null!);
        await using var app = builder.Build();
        CreateExtension().MapEndpoints(app);

        var endpoints = ((IEndpointRouteBuilder)app).DataSources
            .SelectMany(source => source.Endpoints)
            .OfType<RouteEndpoint>()
            .Where(endpoint => endpoint.RoutePattern.RawText?.StartsWith(
                    "/api/plugins/segment-studio/", StringComparison.Ordinal) == true)
            .ToArray();

        Assert.Equal(95, endpoints.Length);
        var capabilityRequirements = endpoints.ToDictionary(
            EndpointKey,
            endpoint => endpoint.Metadata
                .OfType<SegmentStudioCapabilityRequirement>()
                .Select(requirement => requirement.Capability)
                .ToArray());
        Assert.Equal(
            [SegmentStudioCapabilities.NavigationSegmentInventory],
            capabilityRequirements[
                "POST /api/plugins/segment-studio/browse/segments"]);
        Assert.Equal(
            [SegmentStudioCapabilities.SegmentReview],
            capabilityRequirements[
                "POST /api/plugins/segment-studio/review/segments"]);
        Assert.Equal(
            [SegmentStudioCapabilities.PerformerSlotsManage],
            capabilityRequirements[
                "GET /api/plugins/segment-studio/slot-definitions"]);
        Assert.Equal(
            [SegmentStudioCapabilities.SettingsDerivation],
            capabilityRequirements[
                "GET /api/plugins/segment-studio/derivation-rules"]);
        Assert.Equal(
            [SegmentStudioCapabilities.ShotBoundariesManage],
            capabilityRequirements[
                "GET /api/plugins/segment-studio/videos/{videoId:int}/shot-boundaries"]);
        Assert.Equal(
            [SegmentStudioCapabilities.RecyclingBinView],
            capabilityRequirements[
                "GET /api/plugins/segment-studio/bin"]);
        Assert.Equal(
            [SegmentStudioCapabilities.SegmentGroupsManage],
            capabilityRequirements[
                "GET /api/plugins/segment-studio/segment-groups"]);
        Assert.Equal(
            [SegmentStudioCapabilities.NavigationVideos],
            capabilityRequirements[
                "GET /api/plugins/segment-studio/videos"]);
        Assert.Equal(
            [SegmentStudioCapabilities.NativeSegmentsRead],
            capabilityRequirements[
                "GET /api/plugins/segment-studio/videos/{videoId:int}/editor"]);
        Assert.Empty(capabilityRequirements[
            "PUT /api/plugins/segment-studio/preferences"]);
        Assert.Equal(
            [SegmentStudioCapabilities.NativeSegmentsMerge],
            capabilityRequirements[
                "POST /api/plugins/segment-studio/videos/{videoId:int}/segments/merge-selection"]);
        Assert.Equal(
            [SegmentStudioCapabilities.NativeSegmentsCreate],
            capabilityRequirements[
                "POST /api/plugins/segment-studio/videos/{videoId:int}/segments"]);
        Assert.Equal(
            [SegmentStudioCapabilities.NativeSegmentsRemove],
            capabilityRequirements[
                "POST /api/plugins/segment-studio/videos/{videoId:int}/segments/move-to-bin"]);
        Assert.Equal(
            [SegmentStudioCapabilities.FeedbackManage],
            capabilityRequirements[
                "GET /api/plugins/segment-studio/videos/{videoId:int}/incorrect-examples"]);
        Assert.Equal(
            [SegmentStudioCapabilities.FeedbackManage],
            capabilityRequirements[
                "POST /api/plugins/segment-studio/training-exports/{exportId:guid}/complete"]);
        var missingPolicies = endpoints
            .Where(endpoint =>
                !endpoint.Metadata.OfType<CovePermissionRequirementMetadata>().Any()
                && !endpoint.Metadata.OfType<CoveRouteEntityAccessRequirementMetadata>().Any()
                && !endpoint.Metadata.OfType<CoveAllowWithoutPermissionMetadata>().Any()
                && !endpoint.Metadata.OfType<CoveAllowAnonymousMetadata>().Any())
            .Select(EndpointKey)
            .Order()
            .ToArray();
        Assert.Empty(missingPolicies);

        var expected = new Dictionary<string, EndpointPolicy>
        {
            ["GET /api/plugins/segment-studio/analysis/status"] =
                new([Permissions.SegmentsRead]),
            ["GET /api/plugins/segment-studio/analysis/catalog"] =
                new([Permissions.SegmentsRead]),
            ["GET /api/plugins/segment-studio/analysis/settings"] =
                new([SegmentStudioExtension.AnalysisSettingsManagePermission]),
            ["PUT /api/plugins/segment-studio/analysis/settings"] =
                new([SegmentStudioExtension.AnalysisSettingsManagePermission]),
            ["GET /api/plugins/segment-studio/videos/{videoId:int}/analysis-runs"] =
                new([Permissions.SegmentsRead], EntityKinds.Video, "videoId", Permissions.VideosRead),
            ["POST /api/plugins/segment-studio/videos/{videoId:int}/analysis-runs"] =
                new([Permissions.SegmentsWrite, Permissions.JobsRun], EntityKinds.Video, "videoId", Permissions.VideosWrite),
            ["POST /api/plugins/segment-studio/videos/{videoId:int}/native-segments/import"] =
                new([Permissions.SegmentsWrite], EntityKinds.Video, "videoId", Permissions.VideosWrite),
            ["GET /api/plugins/segment-studio/compatibility"] =
                new([Permissions.SegmentsRead]),
            ["GET /api/plugins/segment-studio/maintenance/rollout"] =
                new([SegmentStudioExtension.LineageMaintenancePermission]),
            ["PUT /api/plugins/segment-studio/maintenance/rollout"] =
                new([
                    SegmentStudioExtension.LineageMaintenancePermission,
                    SegmentStudioExtension.LineageManagePermission,
                ]),
            ["GET /api/plugins/segment-studio/maintenance/telemetry"] =
                new([SegmentStudioExtension.LineageMaintenancePermission]),
            ["GET /api/plugins/segment-studio/preferences"] =
                new([Permissions.SegmentsRead]),
            ["GET /api/plugins/segment-studio/preferences/transition"] =
                new([Permissions.SegmentsRead]),
            ["PUT /api/plugins/segment-studio/preferences"] =
                new([Permissions.SegmentsRead]),
            ["GET /api/plugins/segment-studio/sources"] =
                new([Permissions.SegmentsRead, SegmentStudioExtension.ProvenanceReadPermission]),
            ["POST /api/plugins/segment-studio/sources"] =
                new([Permissions.SegmentsWrite, SegmentStudioExtension.ProvenanceManagePermission]),
            ["GET /api/plugins/segment-studio/items/{itemId:long}/provenance"] =
                new([Permissions.SegmentsRead, SegmentStudioExtension.ProvenanceReadPermission]),
            ["GET /api/plugins/segment-studio/videos/{videoId:int}/segments/{segmentId:int}/provenance"] =
                new([Permissions.SegmentsRead, SegmentStudioExtension.ProvenanceReadPermission]),
            ["POST /api/plugins/segment-studio/items/{itemId:long}/provenance"] =
                new([Permissions.SegmentsWrite, SegmentStudioExtension.ProvenanceManagePermission]),
            ["GET /api/plugins/segment-studio/items/{itemId:long}/lineage"] =
                new([Permissions.SegmentsRead, SegmentStudioExtension.ProvenanceReadPermission]),
            ["POST /api/plugins/segment-studio/items/{itemId:long}/derive"] =
                new([Permissions.SegmentsWrite, SegmentStudioExtension.LineageManagePermission]),
            ["GET /api/plugins/segment-studio/derivation-rules"] =
                new([Permissions.SegmentsRead, Permissions.TagsRead, SegmentStudioExtension.ProvenanceReadPermission]),
            ["PUT /api/plugins/segment-studio/derivation-rules"] =
                new([
                    Permissions.SegmentsWrite,
                    Permissions.TagsRead,
                    SegmentStudioExtension.LineageManagePermission,
                ]),
            ["POST /api/plugins/segment-studio/derivation-rules/{ruleId:guid}/deletion/preview"] =
                new([
                    Permissions.SegmentsRead,
                    Permissions.TagsRead,
                    SegmentStudioExtension.LineageManagePermission,
                ]),
            ["DELETE /api/plugins/segment-studio/derivation-rules/{ruleId:guid}"] =
                new([
                    Permissions.SegmentsDelete,
                    Permissions.TagsRead,
                    SegmentStudioExtension.LineageManagePermission,
                ]),
            ["POST /api/plugins/segment-studio/derivation-rules/{ruleId:guid}/materialization/preview"] =
                new([
                    Permissions.SegmentsRead,
                    Permissions.TagsRead,
                    SegmentStudioExtension.LineageManagePermission,
                ]),
            ["POST /api/plugins/segment-studio/derivation-rules/{ruleId:guid}/materialize"] =
                new([
                    Permissions.SegmentsWrite,
                    Permissions.TagsRead,
                    SegmentStudioExtension.LineageManagePermission,
                ]),
            ["POST /api/plugins/segment-studio/videos/{videoId:int}/derived-segments/preview"] =
                new([Permissions.SegmentsRead, Permissions.TagsRead, SegmentStudioExtension.ProvenanceReadPermission], EntityKinds.Video, "videoId", Permissions.VideosRead),
            ["POST /api/plugins/segment-studio/videos/{videoId:int}/derived-segments/materialize"] =
                new([Permissions.SegmentsWrite, Permissions.TagsRead, SegmentStudioExtension.LineageManagePermission], EntityKinds.Video, "videoId", Permissions.SegmentsWrite),
            ["POST /api/plugins/segment-studio/items/{itemId:long}/tag-change/preview"] =
                new([Permissions.SegmentsWrite, SegmentStudioExtension.LineageManagePermission]),
            ["POST /api/plugins/segment-studio/items/{itemId:long}/tag-change/execute"] =
                new([Permissions.SegmentsWrite, SegmentStudioExtension.LineageManagePermission]),
            ["POST /api/plugins/segment-studio/items/{itemId:long}/delete/preview"] =
                new([Permissions.SegmentsDelete, SegmentStudioExtension.LineageManagePermission]),
            ["POST /api/plugins/segment-studio/items/{itemId:long}/delete/execute"] =
                new([Permissions.SegmentsDelete, SegmentStudioExtension.LineageManagePermission]),
            ["POST /api/plugins/segment-studio/maintenance/provenance/cove-ai/ingest"] =
                new([
                    SegmentStudioExtension.ProvenanceManagePermission,
                    SegmentStudioExtension.LineageMaintenancePermission,
                    Permissions.AiRunsRead,
                ]),
            ["POST /api/plugins/segment-studio/maintenance/lineage/scans"] =
                new([SegmentStudioExtension.LineageMaintenancePermission]),
            ["GET /api/plugins/segment-studio/maintenance/lineage/scans/{scanId:guid}"] =
                new([SegmentStudioExtension.LineageMaintenancePermission]),
            ["GET /api/plugins/segment-studio/maintenance/lineage/issues"] =
                new([SegmentStudioExtension.LineageMaintenancePermission]),
            ["POST /api/plugins/segment-studio/maintenance/lineage/issues/{issueId:guid}/repair/preview"] =
                new([SegmentStudioExtension.LineageMaintenancePermission, SegmentStudioExtension.LineageManagePermission]),
            ["POST /api/plugins/segment-studio/maintenance/lineage/issues/{issueId:guid}/repair/execute"] =
                new([SegmentStudioExtension.LineageMaintenancePermission, SegmentStudioExtension.LineageManagePermission]),
            ["GET /api/plugins/segment-studio/segment-groups"] =
                new([Permissions.TagsRead, Permissions.TagGroupsRead]),
            ["POST /api/plugins/segment-studio/segment-groups"] =
                new([Permissions.TagGroupsWrite]),
            ["PUT /api/plugins/segment-studio/segment-groups/{groupId:long}"] =
                new([Permissions.TagsWrite, Permissions.TagGroupsWrite]),
            ["PUT /api/plugins/segment-studio/segment-groups/tags/{tagId:int}"] =
                new([Permissions.TagsWrite]),
            ["PUT /api/plugins/segment-studio/segment-groups/order"] =
                new([Permissions.TagGroupsWrite]),
            ["DELETE /api/plugins/segment-studio/segment-groups/{groupId:long}"] =
                new([Permissions.TagGroupsDelete]),
            ["GET /api/plugins/segment-studio/videos"] =
                new([Permissions.SegmentsRead]),
            ["GET /api/plugins/segment-studio/videos/{videoId:int}/editor"] =
                new([Permissions.SegmentsRead], EntityKinds.Video, "videoId", Permissions.VideosRead),
            ["GET /api/plugins/segment-studio/videos/{videoId:int}/history"] =
                new([Permissions.SegmentsRead], EntityKinds.Video, "videoId", Permissions.VideosRead),
            ["POST /api/plugins/segment-studio/videos/{videoId:int}/history/actions"] =
                new([Permissions.SegmentsWrite, Permissions.VideosRead], EntityKinds.Video, "videoId", Permissions.SegmentsWrite),
            ["POST /api/plugins/segment-studio/videos/{videoId:int}/history/native-state"] =
                new([Permissions.SegmentsWrite, Permissions.SegmentsDelete], EntityKinds.Video, "videoId", Permissions.SegmentsWrite),
            ["POST /api/plugins/segment-studio/videos/{videoId:int}/history/cursor"] =
                new([Permissions.SegmentsWrite, Permissions.VideosRead], EntityKinds.Video, "videoId", Permissions.SegmentsWrite),
            ["GET /api/plugins/segment-studio/videos/{videoId:int}/incorrect-examples"] =
                new([Permissions.SegmentsRead], EntityKinds.Video, "videoId", Permissions.VideosRead),
            ["POST /api/plugins/segment-studio/videos/{videoId:int}/incorrect-examples/toggle"] =
                new([Permissions.SegmentsWrite, Permissions.SegmentsDelete], EntityKinds.Video, "videoId", Permissions.SegmentsWrite),
            ["POST /api/plugins/segment-studio/videos/{videoId:int}/incorrect-examples/collect"] =
                new([Permissions.SegmentsWrite, Permissions.SegmentsDelete], EntityKinds.Video, "videoId", Permissions.SegmentsWrite),
            ["POST /api/plugins/segment-studio/videos/{videoId:int}/incorrect-examples/{exampleId:long}/remove"] =
                new([Permissions.SegmentsWrite, Permissions.SegmentsDelete], EntityKinds.Video, "videoId", Permissions.SegmentsWrite),
            ["POST /api/plugins/segment-studio/videos/{videoId:int}/incorrect-examples/export"] =
                new([Permissions.SegmentsWrite], EntityKinds.Video, "videoId"),
            ["GET /api/plugins/segment-studio/training-exports/{exportId:guid}/download"] =
                new([Permissions.SegmentsRead]),
            ["POST /api/plugins/segment-studio/training-exports/{exportId:guid}/complete"] =
                new([Permissions.SegmentsWrite]),
            ["GET /api/plugins/segment-studio/videos/{videoId:int}/shot-boundaries"] =
                new([Permissions.SegmentsRead], EntityKinds.Video, "videoId", Permissions.VideosRead),
            ["POST /api/plugins/segment-studio/videos/{videoId:int}/shot-boundaries/split"] =
                new([Permissions.SegmentsWrite], EntityKinds.Video, "videoId"),
            ["POST /api/plugins/segment-studio/videos/{videoId:int}/shot-boundaries/merge"] =
                new([Permissions.SegmentsWrite], EntityKinds.Video, "videoId"),
            ["POST /api/plugins/segment-studio/videos/{videoId:int}/shot-boundaries/restore"] =
                new([Permissions.SegmentsWrite], EntityKinds.Video, "videoId"),
            ["PUT /api/plugins/segment-studio/videos/{videoId:int}/segments/{segmentId:int}"] =
                new([Permissions.SegmentsWrite], EntityKinds.Video, "videoId"),
            ["POST /api/plugins/segment-studio/videos/{videoId:int}/segments"] =
                new([Permissions.SegmentsWrite], EntityKinds.Video, "videoId"),
            ["PUT /api/plugins/segment-studio/videos/{videoId:int}/segments/tag"] =
                new([Permissions.SegmentsWrite], EntityKinds.Video, "videoId"),
            ["PUT /api/plugins/segment-studio/videos/{videoId:int}/segments/review-state"] =
                new([Permissions.SegmentsWrite], EntityKinds.Video, "videoId"),
            ["POST /api/plugins/segment-studio/videos/{videoId:int}/segments/{segmentId:int}/duplicate"] =
                new([Permissions.SegmentsWrite], EntityKinds.Video, "videoId"),
            ["POST /api/plugins/segment-studio/videos/{videoId:int}/segments/{segmentId:int}/split"] =
                new([Permissions.SegmentsWrite], EntityKinds.Video, "videoId"),
            ["POST /api/plugins/segment-studio/videos/{videoId:int}/segments/{segmentId:int}/merge"] =
                new([Permissions.SegmentsWrite, Permissions.SegmentsDelete], EntityKinds.Video, "videoId", Permissions.SegmentsWrite),
            ["POST /api/plugins/segment-studio/videos/{videoId:int}/segments/merge-selection"] =
                new([Permissions.SegmentsWrite, Permissions.SegmentsDelete], EntityKinds.Video, "videoId", Permissions.SegmentsWrite),
            ["POST /api/plugins/segment-studio/videos/{videoId:int}/complete-review"] =
                new([Permissions.SegmentsWrite], EntityKinds.Video, "videoId"),
            ["POST /api/plugins/segment-studio/videos/{videoId:int}/rejected/deletion/preview"] =
                new([Permissions.SegmentsDelete], EntityKinds.Video, "videoId"),
            ["POST /api/plugins/segment-studio/videos/{videoId:int}/rejected/deletion/execute"] =
                new([Permissions.SegmentsDelete], EntityKinds.Video, "videoId"),
            ["GET /api/plugins/segment-studio/browse/activities"] =
                new([Permissions.SegmentsRead, Permissions.TagsRead]),
            ["GET /api/plugins/segment-studio/browse/activities/{tagId:int}/facets"] =
                new([Permissions.SegmentsRead, Permissions.TagsRead, Permissions.PerformersRead]),
            ["POST /api/plugins/segment-studio/browse/segments"] =
                new([Permissions.SegmentsRead, Permissions.TagsRead]),
            ["POST /api/plugins/segment-studio/review/segments"] =
                new([Permissions.SegmentsRead, Permissions.TagsRead]),
            ["POST /api/plugins/segment-studio/videos/{videoId:int}/drafts"] =
                new([Permissions.SegmentsWrite], EntityKinds.Video, "videoId"),
            ["PUT /api/plugins/segment-studio/videos/{videoId:int}/drafts/{itemId:long}"] =
                new([Permissions.SegmentsWrite], EntityKinds.Video, "videoId"),
            ["POST /api/plugins/segment-studio/videos/{videoId:int}/drafts/{itemId:long}/split"] =
                new([Permissions.SegmentsWrite], EntityKinds.Video, "videoId"),
            ["POST /api/plugins/segment-studio/videos/{videoId:int}/drafts/{itemId:long}/duplicate"] =
                new([Permissions.SegmentsWrite], EntityKinds.Video, "videoId"),
            ["POST /api/plugins/segment-studio/videos/{videoId:int}/drafts/{itemId:long}/merge"] =
                new([Permissions.SegmentsWrite, Permissions.SegmentsDelete], EntityKinds.Video, "videoId", Permissions.SegmentsWrite),
            ["POST /api/plugins/segment-studio/videos/{videoId:int}/drafts/merge-selection"] =
                new([Permissions.SegmentsWrite, Permissions.SegmentsDelete], EntityKinds.Video, "videoId", Permissions.SegmentsWrite),
            ["GET /api/plugins/segment-studio/slot-definitions"] =
                new([Permissions.SegmentsRead, Permissions.TagsRead, Permissions.PerformersRead, Permissions.VideosRead]),
            ["GET /api/plugins/segment-studio/slot-definitions/{tagId:int}"] =
                new([Permissions.SegmentsRead, Permissions.TagsRead, Permissions.PerformersRead, Permissions.VideosRead]),
            ["PUT /api/plugins/segment-studio/slot-definitions/{tagId:int}"] =
                new([Permissions.SegmentsWrite, Permissions.TagsRead, Permissions.PerformersRead]),
            ["PUT /api/plugins/segment-studio/videos/{videoId:int}/segments/{segmentId:int}/slots"] =
                new([Permissions.SegmentsWrite, Permissions.TagsRead, Permissions.PerformersRead], EntityKinds.Video, "videoId", Permissions.SegmentsWrite),
            ["PUT /api/plugins/segment-studio/videos/{videoId:int}/drafts/{itemId:long}/slots"] =
                new([Permissions.SegmentsWrite, Permissions.TagsRead, Permissions.PerformersRead], EntityKinds.Video, "videoId", Permissions.SegmentsWrite),
            ["POST /api/plugins/segment-studio/videos/{videoId:int}/segments/auto-assign-performer-slots"] =
                new([Permissions.SegmentsWrite, Permissions.TagsRead, Permissions.PerformersRead], EntityKinds.Video, "videoId", Permissions.SegmentsWrite),
            ["GET /api/plugins/segment-studio/bin"] =
                new([Permissions.SegmentsRead, Permissions.TagsRead]),
            ["POST /api/plugins/segment-studio/bin/empty"] =
                new([Permissions.SegmentsDelete]),
            ["POST /api/plugins/segment-studio/videos/{videoId:int}/segments/{segmentId:int}/move-to-bin"] =
                new([Permissions.SegmentsDelete], EntityKinds.Video, "videoId"),
            ["POST /api/plugins/segment-studio/videos/{videoId:int}/segments/move-to-bin"] =
                new([Permissions.SegmentsDelete], EntityKinds.Video, "videoId"),
            ["POST /api/plugins/segment-studio/bin/{itemId:long}/restore"] =
                new([Permissions.SegmentsWrite]),
            ["DELETE /api/plugins/segment-studio/bin/{itemId:long}"] =
                new([Permissions.SegmentsDelete]),
        };
        Assert.Equal(expected.Keys.Order(), endpoints.Select(EndpointKey).Order());
        foreach (var endpoint in endpoints)
        {
            var policy = expected[EndpointKey(endpoint)];
            var permission = Assert.Single(endpoint.Metadata.OfType<CovePermissionRequirementMetadata>());
            Assert.Equal(policy.Permissions, permission.Permissions);
            Assert.Equal(PermissionMode.All, permission.Mode);
            var entities = endpoint.Metadata.OfType<CoveRouteEntityAccessRequirementMetadata>().ToArray();
            if (policy.EntityKind is null)
            {
                Assert.Empty(entities);
            }
            else
            {
                var entity = Assert.Single(entities);
                Assert.Equal(policy.EntityKind, entity.EntityKind);
                Assert.Equal(policy.RouteValueName, entity.RouteValueName);
                Assert.Equal(policy.EntityPermission, entity.Permission);
                var entityPermission = entity.Permission
                    ?? (permission.Permissions.Count == 1 ? permission.Permissions[0] : null);
                Assert.NotNull(entityPermission);
                if (CovePrincipal.TryGetReadGrantEntityKind(entityPermission, out var permissionEntityKind))
                {
                    Assert.Equal(entity.EntityKind, permissionEntityKind);
                }
            }
            Assert.Empty(endpoint.Metadata.OfType<CoveAllowWithoutPermissionMetadata>());
            Assert.Empty(endpoint.Metadata.OfType<CoveAllowAnonymousMetadata>());
        }
    }

    [Fact]
    public void ContributesProvenancePermissions()
    {
        var definitions = CreateExtension().ContributePermissions().ToArray();

        Assert.Equal(
            [
                SegmentStudioExtension.ProvenanceReadPermission,
                SegmentStudioExtension.ProvenanceManagePermission,
                SegmentStudioExtension.LineageManagePermission,
                SegmentStudioExtension.LineageMaintenancePermission,
                SegmentStudioExtension.AnalysisSettingsManagePermission,
            ],
            definitions.Select(definition => definition.Key));
        Assert.All(definitions, definition => Assert.True(definition.GrantToAdminsByDefault));
    }

    private static string EndpointKey(RouteEndpoint endpoint)
    {
        var method = Assert.Single(endpoint.Metadata.GetMetadata<HttpMethodMetadata>()!.HttpMethods);
        return $"{method} {endpoint.RoutePattern.RawText}";
    }

    private sealed record EndpointPolicy(
        IReadOnlyList<string> Permissions,
        string? EntityKind = null,
        string? RouteValueName = null,
        string? EntityPermission = null);

    [Fact]
    public void DefinesCleanSchemaMigrations()
    {
        var migrations = CreateExtension().GetMigrations().ToArray();
        Assert.Equal(3, migrations.Length);
        var migration = migrations[0];

        Assert.Equal("001_initial_schema", migration.Name);
        Assert.Equal(32, migration.UpSql.Split("CREATE TABLE ").Length - 1);
        Assert.Contains("CREATE TABLE segment_studio_items", migration.UpSql);
        Assert.Contains("CREATE TABLE segment_studio_segment_groups", migration.UpSql);
        Assert.Contains("CREATE TABLE segment_studio_lineage_nodes", migration.UpSql);
        Assert.Contains("CREATE TABLE segment_studio_native_recycle_bin", migration.UpSql);
        Assert.Contains("CREATE TABLE segment_studio_training_export_frames", migration.UpSql);
        Assert.Contains("CREATE VIEW segment_studio_review_segments", migration.UpSql);
        Assert.Contains("IX_segment_studio_review_segments_video_state_tag", migration.UpSql);
        Assert.Contains("IX_segment_studio_ai_segments_ingestion", migration.UpSql);
        Assert.Contains("CREATE OR REPLACE FUNCTION segment_studio_delete_rule_derivations", migration.UpSql);
        Assert.Contains("CREATE TRIGGER segment_studio_derivation_rules_delete_derivations", migration.UpSql);
        Assert.Contains("CREATE TRIGGER segment_studio_history_action_expire_receipt", migration.UpSql);
        Assert.Contains("INSERT INTO segment_studio_sources", migration.UpSql);
        Assert.Contains("INSERT INTO segment_studio_installation_state", migration.UpSql);
        Assert.Contains("VALUES (1, FALSE, FALSE, CURRENT_TIMESTAMP)", migration.UpSql);

        Assert.DoesNotContain("segment_studio_workspaces", migration.UpSql);
        Assert.DoesNotContain("segment_studio_workspace_markers", migration.UpSql);
        Assert.DoesNotContain("segment_studio_marker_provenance", migration.UpSql);
        Assert.DoesNotContain("segment_studio_candidates", migration.UpSql);
        Assert.DoesNotContain("segment_studio_item_compatibility", migration.UpSql);
        Assert.DoesNotContain("segment_studio_marker_replacement_runs", migration.UpSql);
        Assert.DoesNotContain("segment_studio_marker_replacement_receipts", migration.UpSql);
        Assert.DoesNotContain("segment_studio_slot_import_runs", migration.UpSql);

        Assert.Equal("002_corresponding_tags", migrations[1].Name);
        Assert.Contains("ADD COLUMN source_tag_id", migrations[1].UpSql);
        Assert.DoesNotContain("segment_studio_corresponding_tag_mappings", migrations[1].UpSql);
        Assert.Equal("003_remove_corresponding_tags", migrations[2].Name);
        Assert.Contains("DROP TABLE IF EXISTS segment_studio_corresponding_tag_mappings", migrations[2].UpSql);
    }

    [Fact]
    public void EditorPreloadsItemMetadataInOneProjection()
    {
        var source = File.ReadAllText(Path.Combine(
            AppContext.BaseDirectory,
            "..", "..", "..", "..", "..",
            "src", "SegmentStudio", "SegmentStudioExtension.cs"));

        Assert.Contains("SegmentEditorMetadataService.LoadAsync", source);
        Assert.Contains("provenanceAccess.Allowed", source);
        Assert.Contains("IReadOnlyDictionary<long, SegmentEditorItemMetadata> ItemMetadata", source);
    }

    [Fact]
    public void QueuedAnalysisRechecksModeWhileHoldingSharedModeLock()
    {
        var source = File.ReadAllText(Path.Combine(
            AppContext.BaseDirectory,
            "..",
            "..",
            "..",
            "..",
            "..",
            "src",
            "SegmentStudio",
            "SegmentStudioExtension.cs"));
        var enqueue = source.IndexOf(
            "\"segment-studio-analysis\"",
            StringComparison.Ordinal);
        var sharedLock = source.IndexOf(
            "SegmentStudioModeLock.AcquireSharedAsync",
            enqueue,
            StringComparison.Ordinal);
        var profileCheck = source.IndexOf(
            "currentProfile.EffectiveMode != outputMode",
            sharedLock,
            StringComparison.Ordinal);
        var execute = source.IndexOf(
            "scopedAnalysis.ExecuteRunAsync",
            profileCheck,
            StringComparison.Ordinal);

        Assert.True(enqueue >= 0);
        Assert.True(sharedLock > enqueue);
        Assert.True(profileCheck > sharedLock);
        Assert.True(execute > profileCheck);
    }

    [Fact]
    public void CapabilityFilterHoldsSharedModeLockAcrossEndpointExecution()
    {
        var source = File.ReadAllText(Path.Combine(
            AppContext.BaseDirectory,
            "..",
            "..",
            "..",
            "..",
            "..",
            "src",
            "SegmentStudio",
            "SegmentStudioFeatureProfile.cs"));
        var filter = source.IndexOf(
            "builder.AddEndpointFilter",
            StringComparison.Ordinal);
        var sharedLock = source.IndexOf(
            "SegmentStudioModeLock.AcquireSharedAsync",
            filter,
            StringComparison.Ordinal);
        var profileCheck = source.IndexOf(
            "SegmentStudioFeatureProfileService.GetAsync",
            sharedLock,
            StringComparison.Ordinal);
        var endpointExecution = source.IndexOf(
            "return await next(context)",
            profileCheck,
            StringComparison.Ordinal);

        Assert.True(filter >= 0);
        Assert.True(sharedLock > filter);
        Assert.True(profileCheck > sharedLock);
        Assert.True(endpointExecution > profileCheck);
    }

    [Fact]
    public void BasicMutationEndpointsRejectHistoryReceiptReplayBeforeMutation()
    {
        var source = File.ReadAllText(Path.Combine(
            AppContext.BaseDirectory,
            "..",
            "..",
            "..",
            "..",
            "..",
            "src",
            "SegmentStudio",
            "SegmentStudioExtension.cs"));

        Assert.Equal(
            7,
            source.Split(
                "if (history?.Exists == true)",
                StringSplitOptions.None).Length - 1);
        Assert.Equal(
            2,
            source.Split(
                "if (basicHistory?.Exists == true)",
                StringSplitOptions.None).Length - 1);
        Assert.Contains(
            "history_receipt_replayed",
            source);
        Assert.Contains(
            "await SegmentStudioReviewLock.AcquireAsync(db, videoId, ct);",
            source);
    }

    [Fact]
    public void ContributesParameterizedEditorThroughTheGenericPageRoute()
    {
        var extension = CreateExtension();

        var page = Assert.Single(extension.GetUIManifest().Pages);

        Assert.Equal("segment-studio", page.Route);
        Assert.Equal("segment-studio/:id", page.DetailRoute);
        Assert.Equal("SegmentStudioPage", page.ComponentName);
    }

    private static SegmentStudioExtension CreateExtension()
    {
        var extension = new SegmentStudioExtension();
        ((IManifestAware)extension).ApplyManifest(new ExtensionManifestFile
        {
            Id = "segment-studio",
            Name = "Segment Studio",
            Version = "0.2.0",
        });
        return extension;
    }
}
