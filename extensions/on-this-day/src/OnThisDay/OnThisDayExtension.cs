using System.Text.Json;
using Cove.Core.Auth;
using Cove.Plugins;
using Cove.Sdk;

namespace MidnightRider.Cove.OnThisDay;

public sealed class OnThisDayExtension : FullExtensionBase
{
    public override UIManifest GetUIManifest()
        => ManifestBuilder()
            .AddDashboardWidget(new UIDashboardWidgetContribution(
                "on-this-day",
                "On This Day",
                ExtensionId: string.Empty,
                ComponentName: "OnThisDayWidget",
                EditorComponentName: "OnThisDayEditor",
                Description: "Rediscover videos released on today's date in past years.",
                Icon: "calendar-days",
                DefaultConfiguration: JsonSerializer.SerializeToElement(new { count = 6, historyYears = 20 }),
                AllowMultiple: true,
                Order: 10)
            {
                RequiredPermissions = [Permissions.VideosRead],
                RequiredPermissionMode = PermissionMode.All,
                SupportedPresentations = [DashboardWidgetPresentation.Flow],
                DefaultPresentation = DashboardWidgetPresentation.Flow,
            })
            .Build();
}
