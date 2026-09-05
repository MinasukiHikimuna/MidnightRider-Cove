using System.Text.Json;
using Cove.Plugins;
using Cove.Sdk;

namespace MidnightRider.Cove.LibraryPulse;

public sealed class LibraryPulseExtension : CoveExtensionBase
{
    public override UIManifest GetUIManifest()
        => ManifestBuilder()
            .AddDashboardWidget(
                id: "library-pulse",
                label: "Library Pulse",
                componentName: "LibraryPulseWidget",
                editorComponentName: "LibraryPulseEditor",
                description: "Show configurable library totals in a responsive dashboard widget.",
                icon: "activity",
                defaultConfiguration: JsonSerializer.SerializeToElement(new
                {
                    metrics = new[] { "videos", "galleries", "groups", "performers" },
                }),
                allowMultiple: true)
            .Build();
}
