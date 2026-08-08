import test from "node:test";
import { assert, fs, manifest, repositoryRoot, source, sourceByModule, TestElement, ui } from "../SegmentStudioUiHarness.mjs";
test("UI imports only components available in the declared Cove runtime", () => {
  assert.equal(manifest.version, "0.70.0");
  assert.equal(manifest.minCoveVersion, "1.1.0");
  assert.match(source, /from "@cove\/runtime\/api"/);
  assert.doesNotMatch(source, /EntityTileFrame/);
  assert.match(source, /DetailListToolbar/);
  assert.match(source, /EntityReferenceMultiSelector/);
  assert.match(source, /EntityReferenceSelector/);
  assert.match(source, /VideoPlayer/);
});

test("video results use compact Cove-style cards", () => {
  const cards = source.slice(source.indexOf("function SegmentSummary"), source.indexOf("function DiscoveryFilters"));
  const discoveryPage = source.slice(source.indexOf("function SegmentStudioDiscoveryPage"), source.indexOf("function SegmentStudioEditorPage"));
  assert.match(cards, /absolute bottom-1 right-1/);
  assert.match(cards, /SEGMENT_STATE_PRESENTATION\[state\]/);
  assert.match(cards, /text-\[11px\]/);
  assert.doesNotMatch(cards, /Open editor/);
  assert.match(discoveryPage, /className: "w-full space-y-5"/);
  assert.match(discoveryPage, /gridTemplateColumns: "repeat\(auto-fill, minmax\(275px, 1fr\)\)"/);
  assert.doesNotMatch(discoveryPage, /max-w-7xl|p-4 sm:p-6/);
  assert.match(cards, /showReviewStates/);
  assert.match(source, /const showReviewStates = compatibilityMode \|\| mode === "review"/);
});

test("segment results use compact video-like cards", () => {
  const cards = source.slice(source.indexOf("function BrowseSegmentCard"), source.indexOf("function BrowsePlayer"));
  const player = source.slice(source.indexOf("function BrowsePlayer"), source.indexOf("function SegmentStudioBrowsePage"));
  const browsePage = sourceByModule["browse/SegmentStudioBrowsePage.js"];
  assert.match(cards, /relative aspect-video/);
  assert.doesNotMatch(cards, /absolute right-1 top-1/);
  assert.match(cards, /gap-1\.5 p-2\.5/);
  assert.match(cards, /SegmentStateBadge, \{ key: "state", state: item\.reviewState, includeLabel: false \}/);
  assert.match(cards, /h\(PerformerSublaneAvatars/);
  assert.match(cards, /performerAssignments/);
  assert.match(cards, /interactive: false/);
  assert.doesNotMatch(cards, /key: "range"/);
  assert.doesNotMatch(cards, /key: "slots"/);
  assert.match(cards, /style: segmentRailItemStyle\(selected\)/);
  assert.match(player, /max-w-2xl/);
  assert.match(player, /aria-label": "Close segment preview"/);
  assert.match(cards, /"data-segment-key": item\.key/);
  assert.match(cards, /item\.reviewState === "rejected" && !item\.published/);
  assert.match(cards, /"Restore"/);
  assert.match(cards, /"Delete permanently"/);
  assert.match(browsePage, /document\.querySelector\(`\[data-segment-key="\$\{selectedKey\}"\]`\)/);
  assert.match(browsePage, /setSelectedKey\(null\)[\s\S]*requestAnimationFrame\(\(\) => trigger\?\.focus\(\)\)/);
  assert.match(browsePage, /onClose: closePreview/);
  assert.match(browsePage, /\/bin\/\$\{item\.itemId\}\/restore/);
  assert.match(browsePage, /operationDiscardsMissingImage\(operationKey\)/);
  assert.match(browsePage, /rememberMissingImageDiscard\(operationKey\)/);
  assert.match(browsePage, /\/items\/\$\{item\.itemId\}\/delete\/preview/);
  assert.match(browsePage, /dependencyDeletionAllowed\(preview, setMessage\)/);
  assert.match(browsePage, /confirmDependencyDeletion\(preview\)/);
  assert.match(browsePage, /className: "w-full space-y-5"/);
  assert.match(browsePage, /gridTemplateColumns: "repeat\(auto-fill, minmax\(275px, 1fr\)\)"/);
  assert.doesNotMatch(browsePage, /max-w-7xl|p-4 sm:p-6/);
});

test("list views omit redundant page headings and descriptions", () => {
  const browsePage = sourceByModule["browse/SegmentStudioBrowsePage.js"];
  const discoveryPage = sourceByModule["discovery/SegmentStudioDiscoveryPage.js"];
  assert.doesNotMatch(browsePage, /Find and play the segments you already have|text-2xl font-semibold/);
  assert.doesNotMatch(discoveryPage, /Compatibility mode preserves existing approval decisions|Find accessible Cove videos|text-2xl font-semibold text-foreground/);
  assert.match(browsePage, /h\("h1", \{ key: "title", className: "sr-only" \}, "Segments"\)/);
  assert.match(discoveryPage, /h\("h1", \{ key: "title", className: "sr-only" \}, "Videos"\)/);
  assert.doesNotMatch(discoveryPage, /h\(SegmentStudioModeSelector/);
});

test("database-backed history computes backward and forward restoration steps", () => {
  const actions = [
    { sequence: 1, beforeState: { value: 0 }, afterState: { value: 1 } },
    { sequence: 2, beforeState: { value: 1 }, afterState: { value: 2 } },
    { sequence: 3, beforeState: { value: 2 }, afterState: { value: 3 } },
  ];

  assert.deepEqual(ui.historyActionsForTarget({ cursorSequence: 3, actions }, 1), [
    { action: actions[2], direction: "backward", state: { value: 2 } },
    { action: actions[1], direction: "backward", state: { value: 1 } },
  ]);
  assert.deepEqual(ui.historyActionsForTarget({ cursorSequence: 1, actions }, 3), [
    { action: actions[1], direction: "forward", state: { value: 2 } },
    { action: actions[2], direction: "forward", state: { value: 3 } },
  ]);
  assert.match(source, /aria-label": "Editor history"/);
  assert.match(source, /Before recent changes/);
  assert.match(source, /acceptHistory\(EMPTY_EDITOR_HISTORY\)/);
  assert.doesNotMatch(source, /Partially updated \$\{completedCandidates\.length\}/);
  assert.doesNotMatch(source, /UNDO_STORAGE_KEY|Undo recent/);
});

test("selected discovery entities survive reload through URL-backed Cove selectors", () => {
  const filters = source.slice(source.indexOf("function DiscoveryFilters"), source.indexOf("function SegmentGroupCard"));

  assert.match(filters, /value: segmentTagId/);
  assert.match(filters, /values: normalizeDiscoveryIds\(objectFilter\.videoTagIds\)/);
  assert.match(filters, /values: normalizeDiscoveryIds\(objectFilter\.performerIds\)/);
  assert.match(filters, /value: Number\(objectFilter\.studioId\) \|\| undefined/);
  assert.doesNotMatch(filters, /requestCoveJson/);
});

test("shot navigation finds strict previous and next boundaries", () => {
  const shots = [
    { id: 1, startSec: 0, endSec: 4 },
    { id: 2, startSec: 4, endSec: 7 },
    { id: 3, startSec: 7, endSec: 10 },
  ];
  assert.equal(ui.findAdjacentShot(shots, 4, -1).id, 1);
  assert.equal(ui.findAdjacentShot(shots, 4, 1).id, 3);
  assert.equal(ui.findAdjacentShot(shots, 0, -1), null);
  assert.equal(ui.shotBoundaryFingerprint([
    { id: 2, startSec: 4, revision: 8 },
    { id: 1, startSec: 0, revision: 3 },
  ]), "1:3,2:8");
});

test("shot cuts use the precise Stash Marker Studio axis visualization", () => {
  const timeline = source.slice(source.indexOf("function SwimlaneTimeline"), source.indexOf("function SegmentActiveEditor"));

  assert.match(timeline, /data-shot-boundary-marker/);
  assert.match(timeline, /Shot boundary.*formatTime\(shot\.startSec\)/);
  assert.match(timeline, /width: "2px"/);
  assert.match(timeline, /bg-orange-400/);
  assert.match(timeline, /rounded-full/);
});

test("shot-boundary shortcuts are registered from the shared shortcut map", () => {
  assert.equal(ui.findEditorShortcut({ key: "y" }, false), null);
  assert.equal(ui.findEditorShortcut({ key: "u" }, false), null);
  assert.equal(ui.findEditorShortcut({ key: "A", shiftKey: true }, false), null);
  assert.equal(ui.findEditorShortcut({ key: "V", shiftKey: true }, false), null);
  assert.equal(ui.findEditorShortcut({ key: "y" }, true).id, "navigation.previousShot");
  assert.equal(ui.findEditorShortcut({ key: "u" }, true).id, "navigation.nextShot");
  assert.equal(ui.findEditorShortcut({ key: "A", shiftKey: true }, true).id, "shot.split");
  assert.equal(ui.findEditorShortcut({ key: "V", shiftKey: true }, true).id, "shot.merge");
  assert.match(source, /recordHistoryAction\(\s*"shots\.update"/);
  assert.match(source, /History restored\./);
  assert.match(source, /shot-boundaries\/restore/);
  assert.match(source, /type: "shots"/);
  assert.match(source, /savingShotRef\.current/);
  assert.match(source, /typeof nextDetail === "function"/);
});

test("boundary jump shortcuts match Stash Marker Studio", () => {
  const event = (key, shiftKey = false) => ({ key, shiftKey, ctrlKey: false, altKey: false, metaKey: false });
  const segmentStart = ui.timelineTimePercent(25, 100);
  const segmentEnd = ui.timelineTimePercent(75, 100);
  assert.equal(ui.findEditorShortcut(event("i"), false)?.id, "video.jumpToSegmentStart");
  assert.equal(ui.findEditorShortcut(event("o"), false)?.id, "video.jumpToSegmentEnd");
  assert.equal(ui.findEditorShortcut(event("i", true), false)?.id, "video.jumpToVideoStart");
  assert.equal(ui.findEditorShortcut(event("o", true), false)?.id, "video.jumpToVideoEnd");
  assert.equal(ui.calculateTimelinePlayheadPosition(25, 100).percent, segmentStart);
  assert.equal(ui.calculateTimelinePlayheadPosition(75, 100).percent, segmentEnd);
  assert.match(source, /seekRef\.current\?\.\(selectedSegment\.startSec, false\)/);
  assert.match(source, /seekRef\.current\?\.\(selectedSegment\.endSec \?\? selectedSegment\.startSec, false\)/);
  assert.match(source, /seekRef\.current\?\.\(timelineDuration, false\)/);
  assert.match(source, /timelineTimePercent\(segment\.startSec, safeDuration\)/);
  assert.match(source, /timelineTimePercent\(end, safeDuration\) - startPercent/);
});

test("timing and tag editing shortcuts match Stash Marker Studio", () => {
  const event = (key, shiftKey = false) => ({ key, shiftKey, ctrlKey: false, altKey: false, metaKey: false });
  assert.equal(ui.findEditorShortcut(event("q"), false)?.id, "marker.editTag");
  assert.equal(ui.findEditorShortcut(event("w"), false)?.id, "marker.setStart");
  assert.equal(ui.findEditorShortcut(event("e"), false)?.id, "marker.setEnd");
  assert.equal(ui.findEditorShortcut(event("t"), false)?.id, "marker.copyTiming");
  assert.equal(ui.findEditorShortcut(event("t", true), false)?.id, "marker.pasteTiming");
  assert.deepEqual(ui.validateSegmentTiming(3, 8, 10), { startSec: 3, endSec: 8 });
  assert.equal(ui.validateSegmentTiming(9, 8, 10).error, "End time cannot be before start time.");
  assert.equal(ui.validateSegmentTiming(-1, 8, 10).error, "Timing must stay within the video.");
  assert.equal(ui.validateSegmentTiming(3, 11, 10).error, "Timing must stay within the video.");
  assert.deepEqual(ui.validateSegmentTiming(3, 11, null), { startSec: 3, endSec: 11 });
  assert.match(source, /tagSearchRef\.current\?\.querySelector\("input"\)/);
  assert.match(source, /writeTimingClipboard/);
  assert.match(source, /readTimingClipboard/);
  assert.match(source, /applyShortcutTiming\(currentTime, selectedSegment\.endSec\)/);
  assert.match(source, /lineage\.data\?\.tagReadOnly/);
  assert.match(source, /const mediaDuration = Number\(video\.videoFile\?\.duration\) > 0/);
});

test("modal Enter and Escape take priority over editor shortcuts", () => {
  let confirmed = 0;
  let canceled = 0;
  const event = (key) => ({
    key,
    target: { tagName: "INPUT" },
    preventDefault() { this.defaultPrevented = true; },
    stopPropagation() { this.stopped = true; },
  });
  const enter = event("Enter");
  assert.equal(ui.handleModalKey(enter, { onConfirm: () => confirmed++ }), true);
  assert.equal(confirmed, 1);
  assert.equal(enter.defaultPrevented, true);
  assert.equal(enter.stopped, true);
  const escape = event("Escape");
  assert.equal(ui.handleModalKey(escape, { onCancel: () => canceled++ }), true);
  assert.equal(canceled, 1);
  assert.equal(ui.handleModalKey(event("x"), { onCancel: () => canceled++ }), false);
  assert.equal(ui.handleModalKey({ ...event("Enter"), target: { tagName: "SELECT" } }, { onConfirm: () => confirmed++ }), false);
  assert.equal(ui.handleModalKey({ ...event("Enter"), target: { tagName: "BUTTON" } }, { onConfirm: () => confirmed++ }), false);
  assert.equal(ui.handleModalKey({ ...event("Enter"), repeat: true }, { onConfirm: () => confirmed++ }), false);
  assert.equal(ui.handleModalKey({ ...event("Enter"), isComposing: true }, { onConfirm: () => confirmed++ }), false);
  assert.equal(ui.handleModalKey({ ...event("Escape"), target: { tagName: "OPTION" } }, { onCancel: () => canceled++ }), false);
  assert.equal(confirmed, 1);
  assert.match(source, /confirmSlotButtonRef\.current\?\.click/);
  assert.match(source, /handleModalKey\(event, \{\s*onCancel: closeSlots/);
  assert.match(source, /if \(savingRef\.current\) return/);
});

test("R merges the current same-swimlane selection", () => {
  const event = (shiftKey = false) => ({ key: "r", shiftKey, ctrlKey: false, altKey: false, metaKey: false });
  assert.equal(ui.findEditorShortcut(event(), true)?.id, "marker.mergeSelection");
  assert.equal(ui.findEditorShortcut(event(true), true), null);
  assert.doesNotMatch(source, /mergeSourceSegmentId|marker\.copyForMerge|marker\.merge"/);
  assert.match(source, /shortcut\.id === "marker\.mergeSelection"[\s\S]*mergeSelectedSwimlane/);
  assert.match(source, /if \(mergeSavingRef\.current \|\| savingSegmentId != null\) return/);
  assert.match(source, /mergeSavingRef\.current = true[\s\S]*finally \{[\s\S]*mergeSavingRef\.current = false/);
});

test("C and Shift+C use durable incorrect-example feedback", () => {
  const event = (shiftKey = false) => ({ key: "c", shiftKey, ctrlKey: false, altKey: false, metaKey: false });
  assert.equal(ui.findEditorShortcut(event(), true)?.id, "marker.toggleIncorrectExample");
  assert.equal(ui.findEditorShortcut(event(true), true)?.id, "marker.openIncorrectExamples");
  assert.equal(ui.findEditorShortcut(event(), false)?.id, "marker.toggleIncorrectExample");
  assert.equal(ui.findEditorShortcut(event(true), false)?.id, "marker.openIncorrectExamples");
  assert.equal(ui.shortcutRequiresSingleSegment("marker.toggleIncorrectExample"), false);
  assert.deepEqual(
    ui.feedbackSelectionPlan(
      [
        { id: "first", itemId: 11, swimlaneKey: "lane-a" },
        { id: "second", itemId: 22, swimlaneKey: "lane-b" },
      ],
      [{ id: 101, itemId: 11 }],
    ),
    {
      action: "collect",
      segments: [
        { id: "first", itemId: 11, swimlaneKey: "lane-a" },
        { id: "second", itemId: 22, swimlaneKey: "lane-b" },
      ],
    },
  );
  assert.deepEqual(
    ui.feedbackSelectionPlan(
      [
        { id: "first", itemId: 11, swimlaneKey: "lane-a" },
        { id: "second", itemId: 22, swimlaneKey: "lane-b" },
      ],
      [{ id: 101, itemId: 11 }, { id: 102, itemId: 22 }],
    ),
    {
      action: "remove",
      segments: [
        { id: "first", itemId: 11, swimlaneKey: "lane-a" },
        { id: "second", itemId: 22, swimlaneKey: "lane-b" },
      ],
    },
  );
  assert.equal(ui.feedbackResultMatchesAction("collect", { collected: true }), true);
  assert.equal(ui.feedbackResultMatchesAction("collect", { collected: false }), false);
  assert.equal(ui.feedbackResultMatchesAction("remove", { collected: false }), true);
  assert.equal(ui.feedbackResultMatchesAction("remove", { collected: true }), false);
  assert.match(source, /incorrect-examples\/collect/);
  assert.match(source, /incorrect-examples\/\$\{example\.id\}\/remove/);
  assert.match(source, /feedbackResultMatchesAction\(plan\.action, result\)/);
  assert.match(source, /error\.status !== 409[\s\S]*\/editor[\s\S]*submitAction\(submittedSegment, null\)/);
  assert.match(source, /segment\.nativeSegmentId != null/);
  assert.match(source, /selectedSegments\.length === 0/);
  assert.match(source, /Partially collected \$\{completed\.length\} of \$\{candidates\.length\} selected segments/);
  assert.match(source, /training-exports/);
  assert.match(source, /Download AI Feedback ZIP/);
  assert.doesNotMatch(source, /Download Marker Studio ZIP/);
  assert.doesNotMatch(source, /Marker Studio-compatible ZIP/);
  assert.match(source, /FormData/);
  assert.match(source, /extractFeedbackFrames/);
  assert.match(source, /autoFocus: true/);
  assert.match(source, /incorrectExamples\.length > 0 \? h\("button"/);
  assert.match(source, /Open AI feedback collection, \$\{incorrectExamples\.length\} example/);
  assert.match(source, /onClick: \(\) => setIncorrectExamplesOpen\(true\)/);
  assert.match(source, /AI feedback \(\$\{incorrectExamples\.length\}\)/);
});

test("feedback frame sampling matches Marker Studio thresholds and clamps inside segments", () => {
  assert.deepEqual(ui.feedbackFrameTimestamps(10, null), [10]);
  assert.deepEqual(ui.feedbackFrameTimestamps(10, 20), [14]);
  assert.deepEqual(ui.feedbackFrameTimestamps(10, 40), [14, 30]);
  assert.deepEqual(ui.feedbackFrameTimestamps(10, 70), [14, 30, 60]);
  assert.deepEqual(ui.feedbackFrameTimestamps(10, 130), [14, 30, 60, 110]);
  assert.deepEqual(ui.feedbackFrameTimestamps(10, 11), [10.999]);
  assert.deepEqual(ui.feedbackFrameTimestamps(10, 10.0004), [10]);
});

test("incorrect examples group repeated tags like multi-selection summaries", () => {
  const first = { id: 1, tagName: "Example tag", startSec: 10 };
  const second = { id: 2, tagName: "Example tag", startSec: 20 };
  const untagged = { id: 3, tagName: "  ", startSec: 30 };
  assert.deepEqual(
    ui.groupIncorrectExamplesByTag([first, second, untagged]),
    [
      { tagName: "Example tag", examples: [first, second] },
      { tagName: "Tag segment", examples: [untagged] },
    ],
  );
  assert.deepEqual(ui.groupIncorrectExamplesByTag(null), []);
  assert.match(source, /const exampleGroups = groupIncorrectExamplesByTag\(examples\)/);
  assert.match(source, /exampleGroups\.map/);
  assert.match(source, /const \[expandedTagNames, setExpandedTagNames\] = useState\(\[\]\)/);
  assert.match(source, /"aria-expanded": expanded/);
  assert.match(source, /expanded \? "▾" : "▸"/);
  assert.match(source, /expanded \? h\("div"/);
  assert.match(source, /`\$\{group\.examples\.length\} example/);
  assert.match(source, /formatTime\(example\.startSec\)/);
  assert.doesNotMatch(source, /`\$\{example\.tagName \|\| "Tag segment"\} ·/);
});

test("collected AI feedback is hidden from review without changing its data", () => {
  const collected = { id: "collected", itemId: 11, reviewState: "rejected" };
  const ordinary = { id: "ordinary", itemId: 22, reviewState: "rejected" };
  assert.deepEqual(
    ui.hideCollectedFeedbackSegments(
      [collected, ordinary],
      [{ id: 101, itemId: 11 }],
      true,
    ),
    [ordinary],
  );
  assert.deepEqual(
    ui.hideCollectedFeedbackSegments(
      [collected, ordinary],
      [{ id: 101, itemId: 11 }],
      false,
    ),
    [collected, ordinary],
  );
  assert.deepEqual(ui.hideCollectedFeedbackSegments(null, null, true), []);
  assert.doesNotMatch(source, /Hide collected from review|Show collected in review/);
  assert.match(source, /hideCollectedFeedbackSegments\([\s\S]*incorrectExamples,[\s\S]*true/);
  assert.match(source, /const approvalFacetSegments = hideCollectedFeedbackSegments\([\s\S]*incorrectExamples,[\s\S]*true/);
  assert.match(source, /Restore to review/);
});

test("feedback downloads retain the server's unique ZIP filename", () => {
  assert.equal(
    ui.downloadFileNameFromContentDisposition(
      "attachment; filename=feedback.zip; filename*=UTF-8''segment-studio-ai-feedback-20260730T173000Z-abcdef.zip"),
    "segment-studio-ai-feedback-20260730T173000Z-abcdef.zip",
  );
  assert.equal(
    ui.downloadFileNameFromContentDisposition(
      'attachment; filename="segment-studio-ai-feedback-20260730T173000Z-fedcba.zip"'),
    "segment-studio-ai-feedback-20260730T173000Z-fedcba.zip",
  );
  assert.equal(
    ui.downloadFileNameFromContentDisposition(null),
    "segment-studio-ai-feedback.zip",
  );
  const workflow = sourceByModule["editor/actions/workflow.js"];
  assert.match(workflow, /requestDownload\(result\.downloadUrl\)/);
  assert.match(workflow, /anchor\.download = download\.fileName/);
  assert.doesNotMatch(
    workflow,
    /anchor\.download = "segment-studio-ai-feedback\.zip"/);
});

test("Shift+X previews and deletes rejected segments with dependent derivations", () => {
  const event = { key: "x", shiftKey: true, ctrlKey: false, altKey: false, metaKey: false };
  assert.equal(ui.findEditorShortcut(event, true)?.id, "system.deleteRejected");
  assert.equal(ui.findEditorShortcut(event, false)?.id, "system.emptyBin");
  assert.match(source, /shortcut\.id === "system\.deleteRejected".*deleteRejectedSegments\(\)/);
  assert.match(source, /shortcut\.id === "system\.emptyBin".*emptyRecyclingBin\(\)/);
  assert.match(source, /rejected\/deletion\/preview/);
  assert.match(source, /rejected\/deletion\/execute/);
  assert.match(source, /confirmDependencyDeletion\(preview\)/);
  assert.match(source, /preview\.deferredRejectedSegmentCount/);
  assert.match(source, /preview\.protectedIncorrectExampleCount/);
  assert.match(source, /must be exported before/);
  assert.match(source, /feedback-protected rejected segment/);
  assert.match(source, /await onReload\(\)/);
  const lanes = ui.groupSegmentsIntoSwimlanes([
    { id: 1, tagId: 10, tagName: "First", startSec: 1, reviewState: "approved" },
    { id: 2, tagId: 10, tagName: "First", startSec: 2, reviewState: "rejected" },
    { id: 3, tagId: 10, tagName: "First", startSec: 3, reviewState: "unreviewed" },
    { id: 4, tagId: 20, tagName: "Second", startSec: 1, reviewState: "unreviewed" },
    { id: 5, tagId: 30, tagName: "Third", startSec: 1, reviewState: "rejected" },
    { id: 6, tagId: 30, tagName: "Third", startSec: 2, reviewState: "unreviewed" },
  ], [
    { id: "group", name: "Group", sortOrder: 0, tags: [
      { tagId: 10, sortOrder: 0 },
      { tagId: 20, sortOrder: 1 },
      { tagId: 30, sortOrder: 2 },
    ] },
  ], []);
  assert.equal(ui.nextUnapprovedAfterRejectedDeletion(lanes, new Set([2, 5])).id, 3);
  assert.equal(ui.nextUnapprovedAfterRejectedDeletion(lanes, new Set([2, 3, 5])).id, 4);
  assert.equal(ui.nextUnapprovedAfterRejectedDeletion(lanes, new Set([2, 3, 4, 5])).id, 6);
  assert.equal(ui.nextUnapprovedAfterRejectedDeletion(lanes, new Set([99])), null);
});

test("editor previews and confirms bulk performer auto-assignment like Marker Studio", () => {
  assert.match(source, /Auto-Assign Performers/);
  assert.match(source, /one valid complete assignment/);
  assert.match(source, /findUniquePerformerSlotAssignment/);
  const groups = ui.groupAutoAssignCandidates([
    {
      id: 3, tagId: 10, tagName: "Tag", startSec: 12, endSec: 15,
      reviewState: "approved", assignment: [
        { slot: { slotDefinitionId: 1 }, performer: { performerId: 20, name: "One" } },
      ],
    },
    {
      id: 2, tagId: 10, tagName: "Tag", startSec: 5, endSec: 7,
      reviewState: "unreviewed", assignment: [
        { slot: { slotDefinitionId: 1 }, performer: { performerId: 20, name: "One" } },
      ],
    },
    {
      id: 4, tagId: 10, tagName: "Tag", startSec: 9, endSec: null,
      reviewState: "rejected", assignment: [
        { slot: { slotDefinitionId: 1 }, performer: { performerId: 21, name: "Two" } },
      ],
    },
  ]);
  assert.equal(groups.length, 2);
  assert.deepEqual(groups[0].candidates.map((candidate) => candidate.id), [2, 3]);
  assert.deepEqual(groups[0].counts, { unreviewed: 1, approved: 1, rejected: 0 });
  assert.deepEqual(groups[0].assignment.map(({ performer }) => performer.performerId), [20]);
  const repeatedPerformer = ui.groupAutoAssignCandidates([{
    id: 5, tagId: 11, tagName: "Solo", startSec: 1, reviewState: "unreviewed",
    assignment: [
      { slot: { slotDefinitionId: 1, label: "Giver" }, performer: { performerId: 20, name: "One" } },
      { slot: { slotDefinitionId: 2, label: "Receiver" }, performer: { performerId: 20, name: "One" } },
    ],
  }])[0];
  assert.deepEqual(repeatedPerformer.assignment.map(({ slot, performer }) =>
    `${slot.label}: ${performer.name}`), ["Giver: One", "Receiver: One"]);
  assert.match(source, /h\(PerformerAvatar/);
  assert.match(source, /"aria-label": `\$\{slotLabel\}: \$\{performer\.name\}`/);
  assert.match(source, /\}, `\$\{slotLabel\}: \$\{performer\.name\}`\)/);
  assert.match(source, /h\(LaneReviewCounts/);
  assert.match(source, /h\(SegmentStateBadge/);
  assert.match(source, /provenanceSourceLabel\(candidate\.sourceKey\)/);
  assert.match(source, /segments\/auto-assign-performer-slots/);
  assert.match(source, /nativeSegmentIds: autoAssignCandidates/);
  assert.match(source, /itemIds: autoAssignCandidates/);
  assert.match(source, /headers: \{ "Content-Type": "application\/json" \}/);
  assert.match(source, /role: "alert"/);
  assert.match(source, /assignedSegmentCount/);
  assert.match(source, /await onReload\(\)/);
});

test("editor previews and materializes derived segments like Marker Studio", () => {
  const editor = source.slice(
    source.indexOf("function SegmentEditor"),
    source.indexOf("const DISCOVERY_URL_OPTIONS"),
  );

  assert.match(source, /function DerivedSegmentMaterializationDialog/);
  assert.match(editor, /\/videos\/\$\{video\.id\}\/derived-segments\/preview/);
  assert.match(editor, /\/videos\/\$\{video\.id\}\/derived-segments\/materialize/);
  assert.match(editor, /fingerprint: materializePreview\.fingerprint/);
  assert.match(editor, /await onReload\(\)/);
  assert.match(editor, /Auto-Materialize/);
  assert.match(editor, /materializePreview\.createCount \+ materializePreview\.linkCount/);
  assert.match(source, /Conflicts skipped/);
  assert.match(source, /Resolve these through lineage maintenance/);
  assert.match(source, /onKeyDownCapture: trapModalFocus/);
  assert.match(source, /style: \{ maxHeight: "calc\(100dvh - 2rem\)" \}/);
  assert.match(source, /key: "body", className: "min-h-0 flex-1 overflow-y-auto p-5"/);
  assert.deepEqual(ui.groupMaterializationOutputs([
    { rootItemId: 10, rootTagName: "Root", rootStartSec: 12, sourceTagName: "Root", derivedTagName: "Child", depth: 1 },
    { rootItemId: 10, rootTagName: "Root", rootStartSec: 12, sourceTagName: "Child", derivedTagName: "Leaf", depth: 2 },
    { rootItemId: 20, rootTagName: "Other", rootStartSec: 30, sourceTagName: "Other", derivedTagName: "Result", depth: 1 },
  ]).map((group) => [group.key, group.rootTagName, group.outputs.length]), [
    ["10", "Root", 2],
    ["20", "Other", 1],
  ]);
  assert.match(source, /`\$\{group\.rootTagName\} @ \$\{formatTime\(group\.rootStartSec\)\}`/);
  assert.match(source, /Math\.max\(0, output\.depth - 1\) \* 1\.25/);
  assert.match(source, /key: "cancel", ref: cancelButtonRef, type: "button", autoFocus: true/);
  assert.match(editor, /Derived segments were materialized, but the editor could not refresh/);
  assert.match(editor, /createCount: 0, linkCount: 0/);
});

test("Settings action is shared by list views and the video editor", () => {
  assert.match(source, /function SegmentStudioSettingsAction/);
  assert.match(source, /h\(SegmentStudioSettingsAction, \{ key: "settings", onNavigate \}\)/);
  assert.match(source, /h\(SegmentStudioSettingsAction, \{ key: "settings", onNavigate, compact: true \}\)/);
});

test("keyboard bindings can be customized without registry drift", () => {
  const overrides = ui.parseShortcutBindingOverrides(JSON.stringify({
    "marker.create": [{ key: "p", ctrl: true }],
    unknown: [{ key: "x" }],
    "marker.split": [{ key: "Shift" }, { key: "" }],
  }));
  assert.deepEqual(overrides, {
    "marker.create": [{ key: "p", ctrl: true }],
    "marker.split": [],
  });
  assert.equal(ui.findEditorShortcut({ key: "p", ctrlKey: true, altKey: false, shiftKey: false, metaKey: false }, false, overrides)?.id, "marker.create");
  assert.equal(ui.findEditorShortcut({ key: "a", ctrlKey: false, altKey: false, shiftKey: false, metaKey: false }, false, overrides), null);
  assert.deepEqual(ui.shortcutBindingFromEvent({ key: "k", code: "KeyK", ctrlKey: true, shiftKey: true }), { key: "k", ctrl: true, shift: true });
  assert.deepEqual(ui.shortcutBindingFromEvent({ key: "<", code: "Comma", shiftKey: true }), { key: "<", code: "Comma", shift: true });
  assert.deepEqual(ui.shortcutBindingFromEvent({ key: "p", ctrlKey: true, altKey: false, shiftKey: false, metaKey: false }), { key: "p", ctrl: true });
  assert.equal(ui.shortcutBindingFromEvent({ key: "Shift", shiftKey: true }), null);
  assert.equal(ui.shortcutBindingsOverlap(
    { key: "<", code: "Comma", shift: true },
    { key: ",", code: "Comma", shift: true },
  ), true);
  assert.equal(ui.shortcutBindingsOverlap(
    { key: "<", code: "Comma", shift: true },
    { key: ",", shift: true },
  ), true);
  assert.equal(ui.shortcutBindingsOverlap(
    { key: ">", code: "Period", shift: true },
    { key: ".", shift: true },
  ), true);
  assert.equal(ui.shortcutBindingsOverlap(
    { key: "<", code: "Comma", shift: true },
    { key: ".", code: "Period", shift: true },
  ), false);
  assert.equal(ui.shortcutBindingsOverlap({ key: "+", shift: true }, { key: "+" }), true);
  assert.equal(ui.shortcutBindingsOverlap({ key: "+", shift: true }, { key: "+", ctrl: true }), false);
  assert.equal(ui.shortcutBindingsOverlap({ key: "ArrowUp", platform: true }, { key: "ArrowUp", ctrl: true }), true);
  assert.equal(ui.shortcutBindingsOverlap({ key: "ArrowUp", platform: true }, { key: "ArrowUp", ctrl: true, meta: true }), false);
  assert.equal(ui.shortcutBindingsOverlap({ key: "a" }, { key: "b" }), false);
  assert.equal(ui.shouldExitShortcutCapture({ key: "Tab", shiftKey: false }), true);
  assert.equal(ui.shouldExitShortcutCapture({ key: "Tab", shiftKey: true }), true);
  assert.equal(ui.shouldExitShortcutCapture({ key: "Tab", ctrlKey: true }), false);
  assert.match(source, /segment-studio\.shortcut-bindings\.v1/);
  assert.match(source, /Backspace unassigns it; conflicts are rejected/);
  assert.match(source, /Reset all defaults/);
  assert.match(source, /overrides: readShortcutBindingOverrides\(\)/);
  assert.match(source, /shouldExitShortcutCapture\(event\).*setCapturingId\(null\)/s);
  assert.match(source, /shortcutBindingsOverlap\(binding, candidate\)/);
});

test("keyboard binding settings group and search rows with compact inline reset icons", () => {
  const settings = sourceByModule["settings/shortcuts.js"].slice(
    sourceByModule["settings/shortcuts.js"].indexOf("function ShortcutBindingSettings()"),
  );

  assert.match(settings, /h\("h2", \{ key: "title"/);
  assert.match(settings, /h\("p", \{ key: "description"/);
  assert.match(settings, /Search bindings/);
  assert.match(settings, /filterSegmentStudioShortcuts\(shortcuts, query\)/);
  assert.match(settings, /splitShortcutCategoriesIntoColumns\(filteredShortcuts, 1\)/);
  assert.match(settings, /splitShortcutCategoriesIntoColumns\(filteredShortcuts\)/);
  assert.match(settings, /space-y-6 lg:hidden/);
  assert.match(settings, /hidden items-start gap-6 lg:grid lg:grid-cols-2/);
  assert.match(settings, /className: "divide-y divide-border rounded-md border border-border"/);
  assert.doesNotMatch(settings, /max-h-\[32rem\]|overflow-y-auto/);
  assert.match(settings, /gridTemplateColumns: "minmax\(0,1fr\) auto"/);
  assert.match(settings, /key: "binding-controls", className: "flex items-center gap-1"/);
  assert.match(settings, /document\.addEventListener\("keydown", handleCaptureKeyDown, true\)/);
  assert.match(settings, /document\.removeEventListener\("keydown", handleCaptureKeyDown, true\)/);
  assert.match(settings, /event\.stopImmediatePropagation\(\)/);
  assert.doesNotMatch(settings, /onKeyDown: capturingId === shortcut\.id/);
  assert.match(settings, /"aria-label": `\$\{bindingText\} — change binding for \$\{shortcut\.description\}`/);
  assert.match(settings, /"aria-label": `Reset \$\{shortcut\.description\} to default`/);
  assert.match(settings, /"aria-hidden": "true" \}, "↻"/);
  assert.doesNotMatch(settings, /\}, "Reset"\)/);
  assert.match(settings, /No keyboard bindings match your search/);
});

test("derived rule slot mappings remain compact and expose an accessible remove control", () => {
  const settings = source.slice(source.indexOf("function DerivedSegmentRuleSettings("), source.indexOf("function PlaybackShortcutSettings()"));

  assert.match(settings, /className: "flex items-center gap-2"/);
  assert.match(settings, /min-w-0 flex-1 rounded-md border border-border bg-surface/);
  assert.match(settings, /"aria-label": `Remove performer slot mapping \$\{index \+ 1\}`/);
  assert.match(settings, /\}, "🗑"\)/);
});
