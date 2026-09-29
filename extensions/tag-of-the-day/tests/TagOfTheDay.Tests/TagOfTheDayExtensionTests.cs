using System.Text.Json;
using Cove.Core.Auth;
using Cove.Plugins;
using MidnightRider.Cove.TagOfTheDay;

namespace TagOfTheDay.Tests;

public sealed class TagOfTheDayExtensionTests
{
    [Fact]
    public void ManifestDeclaresTagOfTheDayAsARepeatableFlowWidget()
    {
        var extension = new TagOfTheDayExtension();
        ((IManifestAware)extension).ApplyManifest(new ExtensionManifestFile
        {
            Id = "com.midnightrider.tag-of-the-day",
            Name = "Tag of the Day",
            Version = "0.1.1",
        });

        var widget = Assert.Single(extension.GetUIManifest().DashboardWidgets);
        Assert.Equal("tag-of-the-day", widget.Id);
        Assert.Equal("Tag of the Day", widget.Label);
        Assert.Equal("TagOfTheDayWidget", widget.ComponentName);
        Assert.Equal("TagOfTheDayEditor", widget.EditorComponentName);
        Assert.True(widget.AllowMultiple);
        Assert.Equal([DashboardWidgetPresentation.Flow], widget.SupportedPresentations);
        Assert.Equal(DashboardWidgetPresentation.Flow, widget.DefaultPresentation);
        Assert.Equal(PermissionMode.All, widget.RequiredPermissionMode);
        Assert.Equal([Permissions.TagsRead, Permissions.VideosRead], Assert.IsType<string[]>(widget.RequiredPermissions));

        var configuration = Assert.IsType<JsonElement>(widget.DefaultConfiguration);
        Assert.Equal(3, configuration.GetProperty("minimumVideos").GetInt32());
        Assert.Equal(4, configuration.GetProperty("momentCount").GetInt32());
        Assert.Equal("prefer", configuration.GetProperty("momentSource").GetString());
    }
}
