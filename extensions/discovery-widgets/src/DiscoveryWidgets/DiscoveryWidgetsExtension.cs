using System.Text.Json;
using Cove.Core.Auth;
using Cove.Core.Entities;
using Cove.Core.Interfaces;
using Cove.Plugins;
using Cove.Sdk;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Routing;
using Microsoft.EntityFrameworkCore;

namespace MidnightRider.Cove.DiscoveryWidgets;

public sealed class DiscoveryWidgetsExtension : FullExtensionBase
{
    private const string ApiBase = "/api/plugins/com.midnightrider.discovery-widgets";
    private const int MaximumGraphAppearances = 250_000;
    private static readonly string[] ConnectionGraphPermissions =
        [Permissions.PerformersRead, Permissions.VideosRead];

    public override UIManifest GetUIManifest()
        => ManifestBuilder()
            .AddDashboardWidget(Widget(
                "on-this-day", "On This Day", "OnThisDayWidget", "OnThisDayEditor",
                "Rediscover videos released on today's date in past years.", "calendar-days",
                new { count = 6, historyYears = 20 }, Permissions.VideosRead, order: 10))
            .AddDashboardWidget(Widget(
                "tag-of-the-day", "Tag of the Day", "TagOfTheDayWidget", "TagOfTheDayEditor",
                "Spotlight a daily tag, its description, and a sample tagged moment.", "tags",
                new { minimumVideos = 3, preferSegments = true }, [Permissions.TagsRead, Permissions.VideosRead], 20))
            .AddDashboardWidget(Widget(
                "forgotten-favorites", "Forgotten Favorites", "ForgottenFavoritesWidget", "ForgottenFavoritesEditor",
                "Bring back highly rated videos that have not been played recently.", "heart-clock",
                new { count = 6, minimumRating = 80, inactiveDays = 180 }, Permissions.VideosRead, order: 30))
            .AddDashboardWidget(Widget(
                "quick-watch", "Quick Watch", "QuickWatchWidget", "QuickWatchEditor",
                "Find something that fits the time you have available.", "timer",
                new { count = 6, maximumMinutes = 30, unwatchedOnly = true }, Permissions.VideosRead, order: 40))
            .AddDashboardWidget(Widget(
                "performer-spotlight", "Performer Spotlight", "PerformerSpotlightWidget", "PerformerSpotlightEditor",
                "Feature a daily performer with library facts and sample videos.", "spotlight",
                new { minimumVideos = 3, sampleCount = 4 }, [Permissions.PerformersRead, Permissions.VideosRead], 50))
            .AddDashboardWidget(Widget(
                "continue-a-collection", "Continue a Collection", "ContinueCollectionWidget", "ContinueCollectionEditor",
                "Resume a group that contains both completed and unfinished videos.", "list-video",
                new { minimumVideos = 3, candidateCount = 8 }, [Permissions.GroupsRead, Permissions.VideosRead], 60))
            .AddDashboardWidget(Widget(
                "curation-queue", "Curation Queue", "CurationQueueWidget", "CurationQueueEditor",
                "Preview a focused queue of videos that need metadata attention.", "list-checks",
                new { count = 6, issue = "unorganized" }, Permissions.VideosRead, order: 70))
            .AddDashboardWidget(Widget(
                "group-feed", "Group Feed", "GroupFeedWidget", "GroupFeedEditor",
                "Browse one static or dynamic group's ordered mixed items as a full-page feed.", "layout-list",
                new { groupId = (int?)null }, Permissions.GroupsRead, order: 80,
                presentation: DashboardWidgetPresentation.Canvas, allowMultiple: false))
            .AddDashboardWidget(Widget(
                "six-degrees", "Six Degrees of Johnny Sins", "SixDegreesWidget", "SixDegreesEditor",
                "Find the shortest visible chain between two performers through videos they share.", "network",
                new { mode = "random", startPerformerId = (int?)null, endPerformerId = (int?)null, maxDegrees = 6 },
                [Permissions.PerformersRead, Permissions.VideosRead], 90,
                presentation: DashboardWidgetPresentation.Canvas, allowMultiple: false))
            .Build();

    public override void MapEndpoints(IEndpointRouteBuilder endpoints)
    {
        endpoints.MapGet($"{ApiBase}/performer-connections", GetPerformerConnectionsAsync)
            .AllowWithoutCovePermission();
    }

    private static async Task<IResult> GetPerformerConnectionsAsync(
        int? startPerformerId,
        int? endPerformerId,
        int? maxDegrees,
        int? seed,
        CoveConfiguration configuration,
        ICurrentPrincipalAccessor principalAccessor,
        IAuditService audit,
        DbContext db,
        CancellationToken ct)
    {
        if (configuration.Auth.Enabled)
        {
            var principal = principalAccessor.Current;
            if (principal is null || principal.Kind == PrincipalKind.Anonymous)
                return Results.Unauthorized();

            var missingPermissions = ConnectionGraphPermissions
                .Where(permission => !principal.Has(permission) && !principal.HasReadGrant(permission))
                .ToArray();
            var shareLinkDenied = principal.Kind == PrincipalKind.ShareLink;
            if (shareLinkDenied || missingPermissions.Length > 0)
            {
                await audit.LogAsync(
                    AuditActions.PermissionDeny,
                    AuditOutcomes.Deny,
                    principal,
                    "endpoint",
                    "performer-connections",
                    new
                    {
                        reason = shareLinkDenied ? "share_link_route" : "missing_permissions",
                        missing = missingPermissions,
                    },
                    ct);
                return Results.Json(
                    new
                    {
                        code = "FORBIDDEN",
                        message = shareLinkDenied
                            ? "This endpoint is outside the share link viewing bundle."
                            : "The performer connection graph requires performer and video read access.",
                        missing = missingPermissions,
                    },
                    statusCode: StatusCodes.Status403Forbidden);
            }
        }

        var degreeLimit = maxDegrees ?? 6;
        if (degreeLimit is < 1 or > 6)
            return Results.BadRequest(new { detail = "Maximum degrees must be between 1 and 6." });
        if (startPerformerId.HasValue != endPerformerId.HasValue)
            return Results.BadRequest(new { detail = "Choose both performers or neither performer." });
        if (startPerformerId is <= 0 || endPerformerId is <= 0)
            return Results.BadRequest(new { detail = "Performer identifiers must be positive." });

        var rows = await (
            from appearance in db.Set<VideoPerformer>().AsNoTracking()
            join video in db.Set<Video>().AsNoTracking() on appearance.VideoId equals video.Id
            join performer in db.Set<Performer>().AsNoTracking() on appearance.PerformerId equals performer.Id
            orderby appearance.VideoId, appearance.PerformerId
            select new
            {
                PerformerId = performer.Id,
                PerformerName = performer.Name,
                PerformerHasImage = performer.ImageOverrideBlobId != null || performer.ImageBlobId != null,
                PerformerUpdatedAt = performer.UpdatedAt,
                VideoId = video.Id,
                VideoTitle = video.Title,
                VideoDate = video.Date,
                VideoUpdatedAt = video.UpdatedAt,
            })
            .Take(MaximumGraphAppearances + 1)
            .ToListAsync(ct);

        if (rows.Count > MaximumGraphAppearances)
        {
            return Results.Problem(
                title: "The performer graph is too large for this demo.",
                detail: "Narrower graph traversal will be needed before this library can use the widget.",
                statusCode: StatusCodes.Status422UnprocessableEntity);
        }

        var graph = new PerformerConnectionGraph(rows.Select(row => new PerformerConnectionAppearance(
            new(
                row.PerformerId,
                row.PerformerName,
                row.PerformerHasImage ? VersionedImageUrl("performers", row.PerformerId, row.PerformerUpdatedAt, 640) : null,
                VideoCount: 0),
            new(
                row.VideoId,
                string.IsNullOrWhiteSpace(row.VideoTitle) ? "Untitled video" : row.VideoTitle,
                row.VideoDate?.ToString("yyyy-MM-dd"),
                VersionedImageUrl("videos", row.VideoId, row.VideoUpdatedAt, 960)))));

        PerformerConnectionPath? chain;
        string? emptyReason;
        if (startPerformerId.HasValue && endPerformerId.HasValue)
        {
            var startAvailable = graph.ContainsPerformer(startPerformerId.Value);
            var endAvailable = graph.ContainsPerformer(endPerformerId.Value);
            chain = startAvailable && endAvailable
                ? graph.FindShortestPath(startPerformerId.Value, endPerformerId.Value, degreeLimit)
                : null;
            emptyReason = !startAvailable || !endAvailable ? "performerUnavailable" : chain is null ? "noPath" : null;
        }
        else
        {
            chain = graph.FindRandomPath(seed ?? 0, degreeLimit);
            emptyReason = chain is null ? "notEnoughConnections" : null;
        }

        return Results.Ok(new PerformerConnectionSearchResponse(
            chain,
            emptyReason,
            degreeLimit,
            graph.PerformerCount,
            graph.VideoCount));
    }

    private static string VersionedImageUrl(string entityType, int id, DateTime updatedAt, int max)
        => $"/api/{entityType}/{id}/image?max={max}&v={updatedAt.ToUniversalTime().Ticks}";

    private static UIDashboardWidgetContribution Widget(
        string id,
        string label,
        string component,
        string editor,
        string description,
        string icon,
        object configuration,
        string permission,
        int order,
        DashboardWidgetPresentation presentation = DashboardWidgetPresentation.Flow,
        bool allowMultiple = true)
        => Widget(id, label, component, editor, description, icon, configuration, [permission], order, presentation, allowMultiple);

    private static UIDashboardWidgetContribution Widget(
        string id,
        string label,
        string component,
        string editor,
        string description,
        string icon,
        object configuration,
        string[] permissions,
        int order,
        DashboardWidgetPresentation presentation = DashboardWidgetPresentation.Flow,
        bool allowMultiple = true)
        => new(
            id,
            label,
            ExtensionId: string.Empty,
            ComponentName: component,
            EditorComponentName: editor,
            Description: description,
            Icon: icon,
            DefaultConfiguration: JsonSerializer.SerializeToElement(configuration),
            AllowMultiple: allowMultiple,
            Order: order)
        {
            RequiredPermissions = permissions,
            RequiredPermissionMode = PermissionMode.All,
            SupportedPresentations = [presentation],
            DefaultPresentation = presentation,
        };
}
