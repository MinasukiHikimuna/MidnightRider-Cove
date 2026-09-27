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
    public void Manifest_declares_27_action_keys_in_keyboard_order_with_shift_to_stay()
    {
        var actions = Manifest().KeyboardActions;
        var slots = actions.Where(action => action.Id.StartsWith("action-", StringComparison.Ordinal)).ToList();

        Assert.Equal(27, slots.Count);
        Assert.Equal("qwertyuiopåasdfghjklöäzxcvb", string.Concat(slots.Select(action => action.DefaultBindings[0])));
        for (var index = 0; index < slots.Count; index++)
        {
            var action = slots[index];
            var key = action.DefaultBindings[0];
            Assert.Equal($"action-{index + 1:00}", action.Id);
            Assert.Equal($"Review action {index + 1}", action.Label);
            Assert.Equal(new[] { key, $"Shift+{key}" }, action.DefaultBindings);
            Assert.Equal(index + 1, action.Order);
        }

        Assert.Equal("q", slots[0].DefaultBindings[0]);
        Assert.Equal("å", slots[10].DefaultBindings[0]);
        Assert.Equal("a", slots[11].DefaultBindings[0]);
        Assert.Equal("f", slots[14].DefaultBindings[0]);
        Assert.Equal("g", slots[15].DefaultBindings[0]);
        Assert.Equal("k", slots[18].DefaultBindings[0]);
        Assert.Equal("b", slots[26].DefaultBindings[0]);
        // n and m step through the grid preview; they never apply an action.
        Assert.DoesNotContain(actions, action => action.DefaultBindings.Any(binding =>
            binding is "n" or "m" or "Shift+n" or "Shift+m"));
    }

    [Fact]
    public void Manifest_declares_find_action_and_select_all()
    {
        var actions = Manifest().KeyboardActions;

        var find = Assert.Single(actions, action => action.Id == "find-action");
        Assert.Equal("Find action", find.Label);
        Assert.Equal(new[] { "-" }, find.DefaultBindings);
        Assert.Equal(new[] { "local", "overlay" }, find.Scopes.Select(scope => scope.Surface));

        var selectAll = Assert.Single(actions, action => action.Id == "select-all");
        Assert.Equal("Select all on page", selectAll.Label);
        Assert.Equal(new[] { "Ctrl+a" }, selectAll.DefaultBindings);
        Assert.Equal(new[] { "local" }, selectAll.Scopes.Select(scope => scope.Surface));

        Assert.Equal(29, actions.Count);
    }

    [Fact]
    public void Keyboard_actions_are_page_handled_and_scoped_to_the_review_page()
    {
        foreach (var action in Manifest().KeyboardActions)
        {
            Assert.Equal(ExtensionId, action.ExtensionId);
            Assert.Equal("Data Quality", action.Group);
            Assert.False(string.IsNullOrWhiteSpace(action.Description));
            // Mounted handlers from the page, not host-invoked handlers or endpoints.
            Assert.Null(action.HandlerName);
            Assert.Null(action.ApiEndpoint);
            // Text entry keeps its letters, and holding a key down never repeats an action.
            Assert.False(action.AllowInEditable);
            Assert.False(action.Repeatable);
            Assert.Equal("videos.read", action.RequiredPermission);
            Assert.NotEmpty(action.Scopes);
            Assert.All(action.Scopes, scope =>
            {
                Assert.Contains(scope.Surface, new[] { "local", "overlay" });
                Assert.Equal("data-quality", scope.Page);
                Assert.Null(scope.EntityType);
                Assert.Null(scope.Tab);
            });
        }

        Assert.All(
            Manifest().KeyboardActions.Where(action => action.Id != "select-all"),
            action => Assert.Equal(new[] { "local", "overlay" }, action.Scopes.Select(scope => scope.Surface)));
    }
}
