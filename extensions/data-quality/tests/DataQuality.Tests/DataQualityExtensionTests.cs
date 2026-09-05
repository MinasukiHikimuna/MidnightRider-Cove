using Cove.Plugins;
using MidnightRider.Cove.DataQuality;

namespace DataQuality.Tests;

public sealed class DataQualityExtensionTests
{
    [Fact]
    public void Manifest_contributes_the_host_review_workspace_to_navigation()
    {
        var extension = new DataQualityExtension();
        ((IManifestAware)extension).ApplyManifest(new ExtensionManifestFile
        {
            Id = "com.midnightrider.data-quality",
            Name = "Data Quality",
            Version = "0.1.0",
        });

        var page = Assert.Single(extension.GetUIManifest().Pages);

        Assert.Equal("data-quality", page.Route);
        Assert.Equal("Data Quality", page.Label);
        Assert.Equal("clipboard-check", page.Icon);
        Assert.True(page.ShowInNav);
        Assert.Equal(15, page.NavOrder);
        Assert.Equal("videos.read", page.RequiredPermission);
        Assert.Null(page.ComponentName);
        Assert.Equal("com.midnightrider.data-quality", page.ExtensionId);
    }
}
