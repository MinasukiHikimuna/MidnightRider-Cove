using System.Text.Json;
using Cove.Core.Auth;
using Cove.Plugins;
using Cove.Sdk;

namespace MidnightRider.Cove.DiscoveryWidgets;

public sealed class DiscoveryWidgetsExtension : CoveExtensionBase
{
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
            .Build();

    private static UIDashboardWidgetContribution Widget(
        string id,
        string label,
        string component,
        string editor,
        string description,
        string icon,
        object configuration,
        string permission,
        int order)
        => Widget(id, label, component, editor, description, icon, configuration, [permission], order);

    private static UIDashboardWidgetContribution Widget(
        string id,
        string label,
        string component,
        string editor,
        string description,
        string icon,
        object configuration,
        string[] permissions,
        int order)
        => new(
            id,
            label,
            ExtensionId: string.Empty,
            ComponentName: component,
            EditorComponentName: editor,
            Description: description,
            Icon: icon,
            DefaultConfiguration: JsonSerializer.SerializeToElement(configuration),
            AllowMultiple: true,
            Order: order)
        {
            RequiredPermissions = permissions,
            RequiredPermissionMode = PermissionMode.All,
        };
}
