using System.Text.Json;
using Cove.Core.Auth;
using Cove.Plugins;
using MidnightRider.Cove.OnThisDay;

namespace OnThisDay.Tests;

public sealed class OnThisDayExtensionTests
{
    [Fact]
    public void ManifestDeclaresOnThisDayAsARepeatableFlowWidget()
    {
        var extension = new OnThisDayExtension();
        ((IManifestAware)extension).ApplyManifest(new ExtensionManifestFile
        {
            Id = "com.midnightrider.on-this-day",
            Name = "On This Day",
            Version = "0.1.0",
        });

        var widget = Assert.Single(extension.GetUIManifest().DashboardWidgets);
        Assert.Equal("on-this-day", widget.Id);
        Assert.Equal("On This Day", widget.Label);
        Assert.Equal("OnThisDayWidget", widget.ComponentName);
        Assert.Equal("OnThisDayEditor", widget.EditorComponentName);
        Assert.True(widget.AllowMultiple);
        Assert.Equal([DashboardWidgetPresentation.Flow], widget.SupportedPresentations);
        Assert.Equal(DashboardWidgetPresentation.Flow, widget.DefaultPresentation);
        Assert.Equal(PermissionMode.All, widget.RequiredPermissionMode);
        Assert.Equal([Permissions.VideosRead], Assert.IsType<string[]>(widget.RequiredPermissions));

        var configuration = Assert.IsType<JsonElement>(widget.DefaultConfiguration);
        Assert.Equal(6, configuration.GetProperty("count").GetInt32());
        Assert.Equal(20, configuration.GetProperty("historyYears").GetInt32());
    }
}
