# Reviewing video data quality

Open **Data Quality** from Cove's navigation and choose a saved review. Use **Edit review** to configure reusable scene criteria and tag actions. New reviews start at the end of the sorted queue; existing reviews keep their chosen direction.

The filter toolbar shows the effective scene query. Its **Filters** dialog includes Cove's **Custom Fields** section for video custom fields, so a queue can require or exclude videos by a custom field such as the confirmed-absent tags that **Mark absent** records; the same section is available when editing a review's video filters. Applying the dialog normalizes custom field criteria to their field definitions, so a review saved with incomplete criteria shows the save and reset controls after its first apply. Occurrence reviews separately offer **All performers**, **Specific performers**, or **Matching performer criteria**, plus conditions on tags attached to that performer's appearance. A scene filter describes which videos match; performer scope describes which partners within them are reviewed. Conditions on occurrence tags apply to the same performer link, independently of video tags and performer profile tags.

Copy the URL to preserve the current search, criteria, performer scope, sort, page size, page, and direction. Reloading that URL restores its query even if the saved review later changes. Changing queue criteria reveals compact save and reset icon buttons, matching tag reviews. **Save changes to review filters** stores the effective queue criteria directly; **Reset to default review filters** restores the saved criteria. Use **Edit review** to change rule details, actions, direction, and other complete-rule settings.

Inspect the player and current tags, then choose an action. Actions apply and advance by default. Hold Shift while clicking or using its numbered shortcut to stay, or choose the action's **Apply & stay** button. Multiple matching scene partners are processed before switching videos, and selecting another partner preserves playback.

Use **Edit tags** to add or remove any tags without changing configured actions. **Save** stays on the item, **Save & next** advances, and **Cancel** discards the draft. Inputs remain available if saving fails. If some changes succeeded before an error, inspect the refreshed current tags and retry to finish the intended edit.

**Skip** changes only the cursor. It does not save tags, reviewed status, or an inconclusive answer. Skipped items and items that still match remain available in their sorted pages. The native toolbar shows the matching scene range and total, without completion percentages. Use pagination above the scene list to change pages.

## Audio reviews

Choose **Audios** or **Audio performer occurrence tags** as a review's entity type to review audios. Everything above applies, with the audio list's own filter criteria, sort options, and custom fields, and with tags written to the audio or to one performer's appearance in it.

Audios have no card grid, so both audio review kinds always review one audio at a time. The **Multiple** layout, card annotations, card tag bins, the preferred grid/wall view, and **Select all on page load** are offered only for video reviews.

Because an audio shows nothing while it plays, its description sits directly under the player rather than behind a tab, in both audio review kinds. The **Description** control collapses and expands it; that choice is remembered in the browser and is not saved with the review. An audio with no description says so instead of hiding the panel.

Tag-group reviews retain their existing selection and group assignment controls. Review configuration is account-scoped where permitted, with browser recovery support. Legacy video/occurrence progress remains stored but is ignored by the filter-driven workspace.
