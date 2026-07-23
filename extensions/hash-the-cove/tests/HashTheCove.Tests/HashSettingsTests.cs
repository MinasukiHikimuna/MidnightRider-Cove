using System.Text.Json;
using Cove.Core.Interfaces;

namespace HashTheCove.Tests;

public sealed class HashSettingsTests
{
    [Fact]
    public void DefaultsAlgorithmsToDisabledAndMediaTypesToEnabled()
    {
        var settings = HashSettings.From(new CoveConfiguration());

        Assert.False(settings.XxHash);
        Assert.False(settings.Sha256);
        Assert.False(settings.Sha1);
        Assert.True(settings.HashVideos);
        Assert.True(settings.HashGalleries);
    }

    [Fact]
    public void PreservesExplicitValues()
    {
        var configuration = new CoveConfiguration
        {
            PluginConfigurations = new()
            {
                ["hash-the-cove"] = new()
                {
                    ["xxhash"] = true,
                    ["sha256"] = JsonDocument.Parse("true").RootElement.Clone(),
                    ["sha1"] = "true",
                    ["hash_videos"] = "false",
                },
            },
        };

        var settings = HashSettings.From(configuration);

        Assert.True(settings.XxHash);
        Assert.True(settings.Sha256);
        Assert.True(settings.Sha1);
        Assert.False(settings.HashVideos);
        Assert.True(settings.HashGalleries);
    }
}
