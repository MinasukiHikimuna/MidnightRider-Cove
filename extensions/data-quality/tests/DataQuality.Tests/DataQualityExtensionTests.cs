using Cove.Plugins;
using MidnightRider.Cove.DataQuality;

namespace DataQuality.Tests;

public sealed class DataQualityExtensionTests
{
    private const string ExtensionId = "com.midnightrider.data-quality";

    private static UIManifest Manifest()
    {
        var extension = new DataQualityExtension();
        ((IManifestAware)extension).ApplyManifest(new ExtensionManifestFile
        {
            Id = ExtensionId,
            Name = "Data Quality",
            Version = "0.1.0",
        });
        return extension.GetUIManifest();
    }

    [Fact]
    public void Manifest_contributes_the_extension_review_workspace_to_navigation()
    {
        var page = Assert.Single(Manifest().Pages);

        Assert.Equal("data-quality", page.Route);
        Assert.Equal("Data Quality", page.Label);
        Assert.Equal("puzzle", page.Icon);
        Assert.True(page.ShowInNav);
        Assert.Equal(15, page.NavOrder);
        Assert.Equal("videos.read", page.RequiredPermission);
        Assert.Equal("DataQualityPage", page.ComponentName);
        Assert.Equal(ExtensionId, page.ExtensionId);
    }

    [Fact]
    public void Manifest_declares_no_keyboard_actions_because_the_page_registers_fixed_keys()
    {
        // Declared actions would appear in Cove's keyboard settings, where rebinding them would
        // change nothing: the page registers its review keys with fixed bindings.
        Assert.Empty(Manifest().KeyboardActions);
    }
}
