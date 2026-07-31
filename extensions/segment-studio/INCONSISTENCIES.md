# Segment Studio UI gaps and inconsistencies

This document records a UI-first review of the installed Segment Studio
extension, followed by source inspection of
`src/SegmentStudio/ui/SegmentStudio.js` and its UI tests. The live pass
covered:

- Videos in grid and list display modes
- Segments browse
- General, Shortcuts, Organization, and Derivation settings
- Basic and Full workflow modes
- the recycling-bin route
- desktop and narrow mobile viewports

No library entity names, entity IDs, environment domains, or private links are
included below.

## Priority summary

| ID | Priority | Surface | Finding |
| --- | --- | --- | --- |
| UI-01 | Critical | Basic mode | Basic still exposes the Full Segments inventory, review states, performer filtering, full-only settings, and full-only shortcuts. |
| UI-02 | Critical | Bin | The bin is not reachable from normal navigation, has no bulk-empty action, marks the wrong tab active, and renders its complete contents without paging. |
| UI-03 | High | Segments list | Segments lacks the count, sort, direction, page-size, and display controls offered by Videos even though its request model supports most of them. |
| UI-04 | High | Settings performance | Every settings panel mounts and fetches on initial General load, producing thousands of hidden controls and loading administrative data before it is needed. |
| UI-05 | High | Derivation maintenance | Lineage issues are context-free, use raw machine labels, cannot be paged or filtered, and “Export issues” exports only the loaded first page. |
| UI-06 | Medium | Videos list | List display drops duration, date, organized, and VR metadata that grid display shows. Selected sort values are often not visible in either result. |
| UI-07 | Medium | Tag filters | Videos, Segments, Organization, performer-slot setup, and Derivation use three different canonical-tag selection patterns. |
| UI-08 | Medium | Organization | The page does not scale: every group is expanded, every tag has arrow/remove actions, and the same option list is repeated in every group. |
| UI-09 | Medium | Navigation | Settings and editor return links discard discovery state; settings sections cannot be deep-linked and reset to General on reload. |
| UI-10 | Medium | Shortcuts | The binding list is ungrouped despite category metadata, includes Full-only commands in Basic, and emits a React missing-key warning. |
| UI-11 | Medium | Derivation rules | A long, unfiltered rule list can contain visually indistinguishable duplicate source-to-derived pairs. |
| UI-12 | Medium | Mobile settings | The settings tab strip clips the final tab at narrow widths without a clear scroll affordance. |
| UI-13 | Low | Save behavior | Persistence scope and save feedback vary by setting, and a shared status message can follow the user into an unrelated tab. |
| UI-14 | Low | Accessibility | Several repeated or destructive controls have non-contextual accessible names, and the lineage policy select has no accessible label. |
| UI-15 | Low | Language and formatting | Bin, review, lineage, count, and action terminology is inconsistent or overly implementation-oriented. |

## Detailed findings

### UI-01 — Basic mode exposes Full-mode functionality

Observed behavior:

- Selecting Basic leaves the Segments tab visible and its route accessible.
- The Segments page still shows review-state filters, an any-slot performer
  filter, approval/rejection badges, unpublished records, restoration, and
  permanent deletion.
- The Basic Videos page displays a warning that unpublished Segment Studio work
  is hidden, while the adjacent Segments tab exposes that same class of work.
- Settings still shows Derivation and performer-slot definitions.
- Keyboard binding settings still show approval, rejection, review navigation,
  performer assignment, AI-feedback, and other Full-only commands.

Source cause:

- `SegmentStudioTabs` always creates both workspace tabs and receives no mode or
  capability input.
- `SegmentStudioRoutes` sends `segments` and `review` to
  `SegmentStudioBrowsePage` without checking the selected mode.
- `SegmentStudioSettingsPage` renders all four sections without mode gating.
- Shortcut definitions already carry `reviewOnly`, but
  `ShortcutBindingSettings` calls `resolveSegmentStudioShortcuts(overrides)`
  without a mode and does not filter those definitions.

Impact:

- Basic is not a credible reduced product surface.
- The Videos warning contradicts an immediately adjacent page.
- A future attempt to remove Full functionality by deleting components would
  be risky because route, navigation, settings, and shortcut decisions are
  scattered.

Recommended correction:

1. Derive one capability object from the selected mode and pass it through
   tabs, routes, settings, editor controls, filters, and shortcut resolution.
2. In Basic, omit the Segments tab, reject or redirect direct Segments routes,
   omit review/approval controls, omit performer slots, and omit derivation.
3. Keep Segment groups available in both modes.
4. Show the bin as the Basic deletion-management destination.
5. Ensure Full-only panels are not merely hidden; do not fetch their data in
   Basic.

Acceptance checks:

- A Basic-mode UI query finds no Segments tab, review-state control, approval
  action, performer-slot UI, derived-segment UI, or Full-only shortcut.
- Navigating directly to the Segments route in Basic redirects to Videos or
  shows a deliberate unavailable state.
- Full restores all Full capabilities without reinstalling or migrating data.

### UI-02 — The recycling-bin workflow is orphaned and does not scale

Observed behavior:

- Moving a segment to the bin is available in the Basic editor, and a bin route
  exists, but Videos, Segments, Settings, and the editor provide no link to it.
- Reaching the route directly highlights Segments as the active tab even though
  the page heading says “Recycling bin.”
- The page loads every rejected item into one document. In the reviewed data
  set this produced hundreds of buttons and a document tens of thousands of
  pixels tall.
- There is no result count, search, filter, sort, pagination, or page-size
  control.
- There is no “Empty bin” action; permanent deletion is available only one item
  at a time.
- Rows display raw provenance/source keys even though the editor already has a
  friendly `provenanceSourceLabel` formatter.
- Time labels can mix whole-second and millisecond precision.

Product inconsistency:

- The existing plan says rejected records are managed from Segments in Full
  rather than through a separate bin destination.
- The new Basic-mode requirement needs a bin because Basic must not have a
  Segments tab.
- The implementation currently has both a Full-like Segments deletion surface
  and a hidden legacy bin surface, without making either mode distinction clear.

Recommended correction:

1. Make the route part of the Basic navigation and give it its own active state.
2. Decide whether Full also links to the bin or continues managing rejected
   records in Segments, then encode that decision in the shared capability
   object.
3. Back the page with paged list state and add count, search, sort, and page-size
   controls.
4. Add an “Empty bin” flow with a server-generated preview, affected-item and
   lineage counts, permission/integrity warnings, typed confirmation when
   warranted, and one idempotent execute operation.
5. Use friendly provenance labels and one time-precision policy.

Acceptance checks:

- A Basic user can move an item to the bin, navigate to the bin without typing a
  URL, restore it, or empty the bin.
- The bin never renders an unbounded result set.
- The active navigation state says Bin, not Segments.

### UI-03 — Videos and Segments list pages have different list capabilities

Videos provides:

- a visible result range and total
- free-text search
- sort field and direction
- grid/list display selection
- items per page
- top and bottom numbered pagination

Segments provides:

- filter fields and review-state checkboxes
- top and bottom numbered pagination
- a fixed card grid

Missing from Segments:

- visible result count
- sort field
- sort direction
- items per page
- a compact list option

The mismatch is not forced by the backend model:
`BROWSE_URL_OPTIONS` and `buildBrowseRequest` already carry `sort`, `direction`,
and `perPage`, but the page does not render a toolbar that can change them.

Impact:

- Large inventories are difficult to triage.
- Users cannot tell how many results matched except by interpreting the last
  page number.
- URL parameters and server capabilities exist without a discoverable UI.

Recommended correction:

- Give Segments a `DetailListToolbar` or a purpose-built equivalent with total,
  sort, direction, and page size.
- Define useful segment sorts such as video/title, tag, start time, updated
  time, review state, and provenance as supported by the service.
- Either add a list display or explicitly document why segment cards are the
  only supported presentation.
- Use the same responsive control order on both pages.

### UI-04 — Settings eagerly mounts and loads hidden panels

Live evidence from an initial General settings view:

- Derivation rules, Segment groups, lineage issues, rollout state, telemetry,
  and canonical tags were all requested before their tabs were opened.
- The General page DOM contained over one hundred hidden articles, more than
  two dozen selects, thousands of options, and well over one thousand buttons.

Source cause:

- Panels are always created and switched with the HTML `hidden` attribute.
- Every group is always mapped to a hidden `SegmentGroupCard`.
- Effects in `DerivedSegmentRuleSettings` and `SegmentStudioSettingsPage` run
  on mount regardless of the selected section.

Impact:

- General settings pays the latency, memory, render, and accessibility-tree
  preparation cost of administrative sections the user may never visit.
- Basic mode still fetches Full-only settings.
- The cost grows with groups, rules, tags, and issues.

Recommended correction:

1. Mount and fetch the active panel only.
2. Cache loaded panel data after first visit if switching back must be instant.
3. Lift only genuinely unsaved draft state above the conditional panel.
4. In Basic, never mount or fetch unavailable Full panels.
5. Add an integration check that General initial load does not request groups,
   derivation rules, or lineage maintenance resources.

Note: the current source-level UI test explicitly requires hidden mounting.
That assertion should be replaced with behavior and state-preservation tests.

### UI-05 — Lineage maintenance issues are not actionable enough

Observed behavior:

- Each issue row shows only a raw kind such as a kebab-case machine value.
- Every row then repeats raw action values such as `restore-tag`,
  `recalculate`, `remove`, and `ignore`.
- The row does not identify the affected video/segment/tag in friendly terms,
  show when the issue was detected, explain the mismatch, or summarize the
  likely effect of each action.
- There is no issue search, filter, sort, or pagination.
- The UI requests only the first issue page. “Export issues” serializes the
  currently loaded array, so the label promises a complete export even when
  more pages exist.
- Telemetry shows an open-issue count but there is no visible “showing N of M”
  relationship.
- Scan and ingestion actions disable controls without changing their labels or
  displaying progress until a response returns.
- Any initial maintenance request failure hides the whole maintenance section,
  making authorization denial indistinguishable from a transient load failure.
- The lineage deletion policy select is not programmatically labelled.

Recommended correction:

- Render a user-facing issue title, concise explanation, affected entity
  context, detected time, and state.
- Replace machine action values with labels and one-line consequences.
- Preview every mutating action, including Ignore if it changes persisted state.
- Page/filter issues and make export a server-side complete export, or rename it
  “Export shown issues.”
- Show scan/ingestion progress, last completed time, and resumable state.
- Distinguish unavailable-by-permission from failed-to-load.
- Wrap the deletion policy select in a label or provide `aria-label`.

### UI-06 — Videos list display loses grid metadata

Observed behavior:

- Grid cards show duration, date, organized state, VR state, and segment
  summary.
- List rows show only thumbnail, title, and segment summary.
- On mobile the thumbnail consumes a large portion of the row while the
  metadata area remains sparse.
- Sorting by Created or Updated does not show the selected sort value on either
  card type. Grid’s displayed content date is not necessarily the created or
  updated timestamp.

Impact:

- Toggling display mode changes information, not just layout density.
- Date-based ordering cannot be visually verified.

Recommended correction:

- Define one result metadata model and render it in both `DiscoveryCard` and
  `DiscoveryRow`.
- At minimum retain duration and date in list display plus Organized/VR when
  present.
- When sorting by Created or Updated, show that timestamp or a labelled relative
  value in both displays.
- Include meaningful metadata in the link’s accessible name or description.

### UI-07 — Canonical-tag selection is inconsistent and coupled

Current patterns:

- Videos uses a separate “Find canonical segment tag” search input plus a native
  “Segment tag” select populated with the first matching page.
- Segments uses one Cove `EntityReferenceSelector` autocomplete.
- Derivation rule editing also uses `EntityReferenceSelector`.
- Organization uses one global “Find canonical tags to add” input plus a native
  select inside every group.
- Performer-slot setup reuses Organization’s filtered option array, so a search
  labelled as finding tags “to add” also silently changes the unrelated
  “Activity tag” selector.

Additional gaps:

- No-match searches leave only placeholder options without a visible no-results
  message.
- Organization’s initial tag request is capped, so selecting a tag outside the
  first page depends on understanding the separate global search.
- Refiltering can remove a selected option from the option array while component
  state still holds its value.

Recommended correction:

- Standardize on the single autocomplete control already used by Segments,
  Derivation, and the editor.
- Give each group and performer-slot selector its own query lifecycle.
- Preserve and visibly render an already selected entity even when it is not in
  the latest search page.
- Provide loading, no-results, and load-failure states in the control.

### UI-08 — Organization does not scale with configured groups

Observed behavior:

- Every group is fully expanded.
- Every member tag renders its own order number, up/down controls, and Remove
  button.
- Every group repeats a canonical-tag select populated from the same option
  page.
- The reviewed page was roughly twenty-five thousand pixels tall and contained
  thousands of option/button nodes.
- There is no group count, group search, collapse-all control, or jump
  navigation.
- Segment groups and performer-slot definitions are placed in one long section
  even though they are separate tasks.
- Repeated actions use generic visible/accessibility labels such as “Delete,”
  “Remove,” and “Add tag.”

Recommended correction:

- Show collapsed group summaries by default and expand one or a few groups on
  demand.
- Add group search/jump and group/member counts.
- Use drag-and-drop with keyboard-accessible move alternatives, or move actions
  into a compact menu.
- Load tag search options only for the group being edited.
- Separate “Segment groups” and “Performer slots” into clearly headed
  subsections; omit Performer slots in Basic.
- Give destructive and repeated actions contextual accessible names.

### UI-09 — Navigation does not preserve user context

Observed behavior:

- Opening Settings from Videos list display and using “Back to discovery”
  returns to the default grid and drops search, filter, sort, and page state.
- Workspace tab links also use bare route paths, so switching away does not
  retain the other list’s query state.
- Settings section changes do not update the URL. Reload always returns to
  General, and browser Back cannot return from Derivation to Organization.

Source cause:

- `SegmentStudioSettingsAction`, settings back, editor exit, and workspace tabs
  build routes without a return location.
- `activeSettingsTab` is local state initialized to `"general"`.

Recommended correction:

- Preserve a validated extension-local return URL when entering Settings or the
  editor, or use history Back with a safe discovery fallback.
- Encode settings section in the route, query, or hash.
- Consider retaining per-list query state when switching Videos/Segments during
  the same session.

### UI-10 — Shortcut settings ignore their own structure

Observed behavior:

- The shortcut definitions already have categories, but settings renders one
  long undifferentiated list inside a nested scroll area.
- At a narrow viewport the binding list’s scroll content is many thousands of
  pixels long inside a fixed-height panel.
- Basic shows Full-only review, AI-feedback, and performer-slot bindings.
- Nearly every row shows a disabled Reset button, adding visual noise.
- Key labels mix casing and platform notation (`Ctrl`, `Cmd`, lowercase letters,
  arrow names, and symbol aliases) without one presentation convention.
- Playback uses “Reset defaults”; bindings uses “Reset all defaults.”
- Opening the Shortcuts section emits React’s “Each child in a list should have
  a unique key” warning from `ShortcutBindingSettings`.

Recommended correction:

- Group by the existing category field, with collapsible headings and search.
- Filter `reviewOnly` and other capability-specific bindings by mode.
- Hide or de-emphasize per-row Reset until a binding differs from default.
- Use one platform-aware key-label formatter and consistent reset language.
- Add keys to the unkeyed heading children and make a no-console-warning browser
  check part of UI verification.

### UI-11 — Derivation rules are difficult to audit

Observed behavior:

- All enabled rules appear in one long list with no search, grouping, sort, or
  count near the heading.
- The live list contained exact duplicate source-to-derived pairs.
- Duplicate-looking cards expose only pair name, slot-mapping count, edge count,
  Edit, and Disable, so a user cannot tell whether they differ by mapping,
  version, or accidental duplication.
- Historical rules are represented only by a total at the end and cannot be
  inspected from the UI.

Recommended correction:

- Add source/derived tag search, sort, enabled count, and duplicate detection.
- If duplicate pairs are valid, show the distinguishing mapping/version detail.
  If they are invalid, prevent them and offer a deduplication/repair path.
- Provide an optional read-only historical view with effective/disabled times.

### UI-12 — Narrow settings navigation hides a section

At a narrow mobile viewport, General, Shortcuts, and Organization consume the
visible tab strip and Derivation is clipped to a fragment. The strip is
horizontally scrollable, but there is no fade, overflow indicator, or other
affordance that another section exists.

Recommended correction:

- Prefer wrapping into two rows at this width, or use a scrollable tab strip
  that scrolls the active tab into view and shows an edge fade/chevron.
- Add narrow-viewport screenshots for every settings section.

### UI-13 — Save scope and feedback vary by setting

Examples:

- Workflow mode says it is account-scoped and shows a saved status.
- Shortcuts say they are browser-scoped and show per-change status.
- Merge confirmation is browser-scoped but does not say so and gives no saved
  feedback.
- Playback interval fields save on every change with no saved/error status.
- Group names require an explicit Save button while tag adds, removes, and moves
  save immediately.
- A single page-level settings message is reused by mode, group, and lineage
  actions. Switching tabs does not clear it, so a success message can appear in
  an unrelated section.

Recommended correction:

- Label persistence scope consistently: “This account” or “This browser.”
- Choose and document an autosave pattern; show Saving/Saved/Error near the
  control or section that owns it.
- Use panel-local status regions and clear stale messages on section change.
- Reserve explicit Save for multi-field atomic editors and explain unsaved
  state there.

### UI-14 — Repeated controls need stronger accessible context

Observed/source-confirmed examples:

- Lineage deletion’s select has no associated label.
- Every derivation rule repeats “Edit” and “Disable.”
- Every lineage issue repeats the same machine action names.
- Group cards repeat “Delete,” “Remove,” and “Add tag.”
- Segment cards repeat “Edit segment.”
- A segment preview button sets an explicit accessible label with activity,
  review state, and times but omits its source video; the explicit label
  overrides useful descendant text.
- Settings section buttons visually act like tabs but expose navigation with
  `aria-current`; there is no tablist/tab relationship or route semantics.

Recommended correction:

- Include the relevant group, tag, rule, issue, segment, or video context in
  `aria-label`.
- Use labelled native controls and either proper tab semantics or real links for
  settings sections.
- Add an automated accessibility pass for all list/settings states at desktop
  and mobile widths.

### UI-15 — Language and numeric formatting are inconsistent

Examples:

- “Move to bin,” “Recycling bin,” “rejected,” and “Delete permanently” describe
  one lifecycle with different nouns.
- Basic’s hidden-work count and lineage telemetry use raw digit strings, while
  the Videos result total uses locale-style thousands separators.
- Lineage repair actions expose machine-oriented kebab-case.
- “Native ID,” “lineage component,” “active assertions,” “materialized lineage
  edges,” and raw source keys appear without progressive explanation.
- “New Segment group” and “Segment group” capitalize the common noun
  inconsistently with the rest of the interface.

Recommended correction:

- Choose one user-facing lifecycle vocabulary, for example “Move to bin,”
  “Bin,” “Restore,” and “Delete permanently.”
- Format user-visible counts consistently with locale-aware formatting.
- Put operational/internal details behind expandable help where possible.
- Use sentence case consistently.

## Test gaps and suggested regression coverage

The current UI tests are predominantly source-pattern assertions. They confirm
that components and strings exist, but several assertions actively preserve the
gaps above.

Add rendered or browser-level tests for:

1. Basic and Full capability matrices, including direct-route behavior.
2. Bin discoverability, correct active navigation, paging, and bulk-empty
   preview/confirmation.
3. Grid/list metadata parity.
4. Videos/Segments toolbar parity and URL round-trips.
5. Settings section deep links, reload, Back/Forward, and return-to-discovery
   state.
6. No Full-only settings requests or controls in Basic.
7. General initial load not fetching or mounting inactive heavy panels.
8. Organization behavior with many groups and a canonical tag outside the first
   result page.
9. Complete lineage issue export across multiple pages.
10. Contextual accessible names and no React console warnings.
11. Narrow viewport screenshots for Videos grid/list, Segments, Bin, and every
    settings section.

## Recommended implementation order

1. Introduce shared mode capabilities and enforce them in routes, navigation,
   settings, editor controls, and shortcuts.
2. Finish the Basic bin workflow and decide the Full-mode rejected-item
   destination.
3. Lazy-mount/fetch settings panels.
4. Bring Segments list controls up to parity with Videos.
5. Standardize canonical-tag selectors.
6. Make Organization and Derivation scalable and contextual.
7. Preserve navigation state and deep-link settings sections.
8. Complete metadata, accessibility, terminology, and responsive polish.
