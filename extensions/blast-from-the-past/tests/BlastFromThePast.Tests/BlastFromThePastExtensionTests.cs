using System.Text.Json;
using Cove.Core.Auth;
using Cove.Plugins;
using MidnightRider.Cove.BlastFromThePast;

namespace BlastFromThePast.Tests;

public sealed class BlastFromThePastExtensionTests
{
    [Fact]
    public void ManifestDeclaresBlastFromThePastAsARepeatableFlowWidget()
    {
        var extension = new BlastFromThePastExtension();
        ((IManifestAware)extension).ApplyManifest(new ExtensionManifestFile
        {
            Id = "com.midnightrider.blast-from-the-past",
            Name = "Blast From The Past",
            Version = "0.1.0",
        });

        var widget = Assert.Single(extension.GetUIManifest().DashboardWidgets);
        Assert.Equal("blast-from-the-past", widget.Id);
        Assert.Equal("Blast From The Past", widget.Label);
        Assert.Equal("BlastFromThePastWidget", widget.ComponentName);
        Assert.Equal("BlastFromThePastEditor", widget.EditorComponentName);
        Assert.True(widget.AllowMultiple);
        Assert.Equal([DashboardWidgetPresentation.Flow], widget.SupportedPresentations);
        Assert.Equal(DashboardWidgetPresentation.Flow, widget.DefaultPresentation);
        Assert.Equal(PermissionMode.All, widget.RequiredPermissionMode);
        Assert.Equal([Permissions.VideosRead], Assert.IsType<string[]>(widget.RequiredPermissions));

        var configuration = Assert.IsType<JsonElement>(widget.DefaultConfiguration);
        Assert.Equal(6, configuration.GetProperty("count").GetInt32());
        Assert.Equal(15, configuration.GetProperty("leadSeconds").GetInt32());
        Assert.Equal(30, configuration.GetProperty("clipSeconds").GetInt32());
        Assert.True(configuration.GetProperty("autoplay").GetBoolean());
    }
}
