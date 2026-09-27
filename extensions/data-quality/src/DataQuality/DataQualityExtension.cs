using Cove.Core.Auth;
using Cove.Plugins;
using Cove.Sdk;

namespace MidnightRider.Cove.DataQuality;

public sealed class DataQualityExtension : CoveExtensionBase
{
    /// <summary>
    /// Action keys in the order a review's actions take them: the letter rows of a Finnish/Swedish
    /// keyboard without n and m, which step through the grid preview. None needs AltGr.
    /// The page UI (model.ts ACTION_KEYS) uses the same order.
    /// </summary>
    public static readonly IReadOnlyList<string> ActionKeys =
    [
        "q", "w", "e", "r", "t", "y", "u", "i", "o", "p", "å",
        "a", "s", "d", "f", "g", "h", "j", "k", "l", "ö", "ä",
        "z", "x", "c", "v", "b",
    ];

    private const string Group = "Data Quality";
    private const string PageRoute = "data-quality";

    public override UIManifest GetUIManifest()
    {
        var builder = ManifestBuilder()
            .AddPage(new UIPageDefinition(
                PageRoute,
                "Data Quality",
                "puzzle",
                ShowInNav: true,
                NavOrder: 15,
                RequiredPermission: Permissions.VideosRead,
                ComponentName: "DataQualityPage"));

        // The page attaches handlers while it is mounted: "local" for the review itself, "overlay"
        // for the grid preview dialog. A local binding outranks Cove's list, player and global
        // shortcuts, so f, g and k apply actions on this page while their slot holds one; the page
        // registers empty slots disabled, which leaves those keys to Cove.
        UIKeyboardActionScope[] pageAndPreview =
        [
            new("local", PageRoute),
            new("overlay", PageRoute),
        ];
        for (var index = 0; index < ActionKeys.Count; index++)
        {
            var key = ActionKeys[index];
            var number = index + 1;
            builder.AddKeyboardAction(
                $"action-{number:00}",
                $"Review action {number}",
                [key, $"Shift+{key}"],
                pageAndPreview,
                description: $"Applies the review's action {number} and moves on; in the single-item review, Shift applies it and stays on the item.",
                group: Group,
                order: number,
                requiredPermission: Permissions.VideosRead);
        }

        builder.AddKeyboardAction(
            "find-action",
            "Find action",
            ["-"],
            pageAndPreview,
            description: "Finds any review action by name, including those without a key.",
            group: Group,
            order: ActionKeys.Count + 1,
            requiredPermission: Permissions.VideosRead);
        builder.AddKeyboardAction(
            "select-all",
            "Select all on page",
            ["Ctrl+a"],
            [new("local", PageRoute)],
            description: "Selects every card on the review page, or clears the selection when all are selected.",
            group: Group,
            order: ActionKeys.Count + 2,
            requiredPermission: Permissions.VideosRead);

        return builder.Build();
    }
}
