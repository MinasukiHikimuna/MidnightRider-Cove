using System.Text.Json;
using Cove.Core.Auth;
using Cove.Plugins;
using Cove.Sdk;

namespace MidnightRider.Cove.BlastFromThePast;

public sealed class BlastFromThePastExtension : FullExtensionBase
{
    public override UIManifest GetUIManifest()
        => ManifestBuilder()
            .AddDashboardWidget(new UIDashboardWidgetContribution(
                "blast-from-the-past",
                "Blast From The Past",
                ExtensionId: string.Empty,
                ComponentName: "BlastFromThePastWidget",
                EditorComponentName: "BlastFromThePastEditor",
                Description: "Replay the moments in your viewing sessions that ended in a like.",
                Icon: "heart",
                DefaultConfiguration: JsonSerializer.SerializeToElement(new { count = 6, leadSeconds = 15, clipSeconds = 30, autoplay = true }),
                AllowMultiple: true,
                Order: 11)
            {
                RequiredPermissions = [Permissions.VideosRead],
                RequiredPermissionMode = PermissionMode.All,
                SupportedPresentations = [DashboardWidgetPresentation.Flow],
                DefaultPresentation = DashboardWidgetPresentation.Flow,
            })
            .Build();
}
