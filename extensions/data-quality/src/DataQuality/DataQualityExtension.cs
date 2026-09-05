using Cove.Core.Auth;
using Cove.Plugins;
using Cove.Sdk;

namespace MidnightRider.Cove.DataQuality;

public sealed class DataQualityExtension : CoveExtensionBase
{
    public override UIManifest GetUIManifest() => ManifestBuilder()
        .AddPage(new UIPageDefinition(
            "data-quality",
            "Data Quality",
            "clipboard-check",
            ShowInNav: true,
            NavOrder: 15,
            RequiredPermission: Permissions.VideosRead))
        .Build();
}
