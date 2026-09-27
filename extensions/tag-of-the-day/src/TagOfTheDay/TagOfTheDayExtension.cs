using System.Text.Json;
using Cove.Core.Auth;
using Cove.Plugins;
using Cove.Sdk;

namespace MidnightRider.Cove.TagOfTheDay;

public sealed class TagOfTheDayExtension : FullExtensionBase
{
    public override UIManifest GetUIManifest()
        => ManifestBuilder()
            .AddDashboardWidget(new UIDashboardWidgetContribution(
                "tag-of-the-day",
                "Tag of the Day",
                ExtensionId: string.Empty,
                ComponentName: "TagOfTheDayWidget",
                EditorComponentName: "TagOfTheDayEditor",
                Description: "Feature one of your tags each day with its media, description, and tagged moments.",
                Icon: "tags",
                DefaultConfiguration: JsonSerializer.SerializeToElement(new { minimumVideos = 3, momentCount = 4, momentSource = "prefer" }),
                AllowMultiple: true,
                Order: 20)
            {
                RequiredPermissions = [Permissions.TagsRead, Permissions.VideosRead],
                RequiredPermissionMode = PermissionMode.All,
                SupportedPresentations = [DashboardWidgetPresentation.Flow],
                DefaultPresentation = DashboardWidgetPresentation.Flow,
            })
            .Build();
}
