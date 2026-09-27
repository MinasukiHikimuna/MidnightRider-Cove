using Cove.Core.Auth;
using Cove.Plugins;
using Cove.Sdk;

namespace MidnightRider.Cove.DataQuality;

public sealed class DataQualityExtension : CoveExtensionBase
{
    // Review keys are fixed and registered by the page itself (reviewKeys.ts), so they work under
    // every Cove keyboard preset; the manifest declares no keyboard actions.
    public override UIManifest GetUIManifest() => ManifestBuilder()
        .AddPage(new UIPageDefinition(
            "data-quality",
            "Data Quality",
            "puzzle",
            ShowInNav: true,
            NavOrder: 15,
            RequiredPermission: Permissions.VideosRead,
            ComponentName: "DataQualityPage"))
        .Build();
}
