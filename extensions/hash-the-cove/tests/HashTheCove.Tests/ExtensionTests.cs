namespace HashTheCove.Tests;

using Cove.Plugins;

public sealed class ExtensionTests
{
    [Fact]
    public void ExposesVisibleCalculateHashesTask()
    {
        var extension = new HashTheCoveExtension();

        var job = Assert.Single(extension.Jobs);
        Assert.Equal("calculate-hashes", job.Id);
        Assert.Equal("Hash The Cove", job.Name);
        Assert.True(job.ShowInTaskList);
    }

    [Fact]
    public void ContributesNativeSettingsPage()
    {
        var extension = new HashTheCoveExtension();
        ((IManifestAware)extension).ApplyManifest(new ExtensionManifestFile
        {
            Id = "hash-the-cove",
            Name = "Hash The Cove",
            Version = "1.0.0",
        });

        var manifest = extension.GetUIManifest();

        var tab = Assert.Single(manifest.SettingsTabs);
        Assert.Equal("extensions/hash-the-cove", tab.Key);
        var panel = Assert.Single(manifest.SettingsPanels);
        Assert.Equal("extensions/hash-the-cove", panel.TargetTab);
        Assert.Equal("HashTheCoveSettings", panel.ComponentName);
    }
}
