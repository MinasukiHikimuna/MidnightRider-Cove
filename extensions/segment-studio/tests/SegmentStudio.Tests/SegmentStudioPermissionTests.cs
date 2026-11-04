namespace SegmentStudio.Tests;

using System.Text.Json;
using Cove.Core.Auth;

public sealed class SegmentStudioPermissionTests
{
    [Fact]
    public void CoveAcceptsEveryContributedPermission()
    {
        var extensionId = ReadManifestId();
        var definitions = new SegmentStudioExtension().ContributePermissions().ToList();
        var registry = new PermissionRegistry();

        var rejected = registry.RegisterExtensionPermissions(extensionId, definitions);

        Assert.Empty(rejected);
        Assert.NotEmpty(definitions);
        Assert.All(definitions, definition => Assert.True(registry.IsKnown(definition.Key), definition.Key));
        Assert.All(
            definitions.SelectMany(definition => definition.Implies ?? []),
            implied => Assert.True(registry.IsKnown(implied), implied));
    }

    private static string ReadManifestId()
    {
        var directory = new DirectoryInfo(AppContext.BaseDirectory);
        while (directory is not null && !File.Exists(Path.Combine(directory.FullName, "SegmentStudio.slnx")))
            directory = directory.Parent;
        Assert.NotNull(directory);

        var manifestPath = Path.Combine(directory.FullName, "src", "SegmentStudio", "extension.json");
        using var manifest = JsonDocument.Parse(File.ReadAllText(manifestPath));
        return manifest.RootElement.GetProperty("id").GetString()!;
    }
}
