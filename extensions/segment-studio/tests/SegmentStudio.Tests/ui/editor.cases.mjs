import test from "node:test";
import { assert, fs, manifest, repositoryRoot, source, sourceByModule, TestElement, ui } from "../SegmentStudioUiHarness.mjs";

test("editor loading state uses the native centered loading indicator", () => {
  const editorPage = sourceByModule["editor/SegmentStudioEditorPage.js"];

  assert.match(editorPage, /import \{ Loader2 \} from "@cove\/runtime\/lucide-react"/);
  assert.match(editorPage, /role: "status"/);
  assert.match(editorPage, /min-h-\[50vh\][^"\n]*items-center justify-center/);
  assert.match(editorPage, /h\(Loader2, \{[^\n]*"aria-hidden": true[^\n]*animate-spin text-muted/);
  assert.match(editorPage, /className: "sr-only" \}, "Loading editor…"/);
});

test("editor controller imports the provenance label used by source filtering", () => {
  const controller = sourceByModule["editor/SegmentEditor.js"];

  assert.match(controller, /import \{ provenanceSourceLabel \} from "\.\/SegmentDetails\.js";/);
  assert.match(controller, /provenanceSourceLabel\(left\)\.localeCompare\(provenanceSourceLabel\(right\)\)/);
});

test("native mutations reload the mode-specific editor projection", () => {
  const segment = { tagId: 10 };

  assert.equal(ui.shouldReloadAfterSegmentMutation(segment, { tagId: 11 }, false), true);
  assert.equal(ui.shouldReloadAfterSegmentMutation(segment, { tagId: 10 }, false), true);
  assert.equal(ui.shouldReloadAfterSegmentMutation(segment, { tagId: 10 }, true), true);
});

test("Basic omitted collections use stable fallbacks across renders", () => {
  const controller = sourceByModule["editor/SegmentEditor.js"];
  assert.match(controller, /const EMPTY_EDITOR_COLLECTION = Object\.freeze\(\[\]\)/);
  assert.match(controller, /performerSlots = detail\.performerSlots \|\| EMPTY_EDITOR_COLLECTION/);
  assert.match(controller, /shotBoundaries = detail\.shotBoundaries \|\| EMPTY_EDITOR_COLLECTION/);
});

test("Basic mode hides the Full Scan action", () => {
  const view = sourceByModule["editor/SegmentEditorView.js"];
  assert.match(
    view,
    /compatibilityMode \? h\("div", \{[\s\S]{0,120}key: "full-analysis"/,
  );
});

test("Full Scan offers AI-only and shot-boundary-only runs", () => {
  const view = sourceByModule["editor/SegmentEditorView.js"];
  const analysis = sourceByModule["editor/hooks/useSegmentAnalysis.js"];

  assert.match(view, /import \{ ChevronDown \} from "@cove\/runtime\/lucide-react"/);
  assert.match(view, /aria-label": "Choose Full Scan analyses"/);
  assert.match(view, /h\(ChevronDown, \{ className: "h-4 w-4" \}\)/);
  assert.match(view, /segment-studio-full-scan-run[^"\n]*px-3 py-1\.5 text-xs/);
  assert.match(view, /segment-studio-full-scan-arrow[^"\n]*border-l border-white\/30[^"\n]*py-1\.5/);
  assert.match(view, /\["AI analysis only", \["aiTagging"\]\]/);
  assert.match(view, /\["Shot boundaries only", \["omnishotcut"\]\]/);
  assert.match(analysis, /async function startFullAnalysis\(analyses = null\)/);
  assert.match(analysis, /analyses: analyses \|\| \(fullMode/);
});

test("Full mode exposes optional corresponding-tag mapping and explicit conversions", () => {
  const controller = sourceByModule["editor/SegmentEditor.js"];
  const view = sourceByModule["editor/SegmentEditorView.js"];
  const dialog = sourceByModule["editor/dialogs/CorrespondingTagsDialog.js"];
  const hook = sourceByModule["editor/hooks/useCorrespondingTags.js"];
  const history = sourceByModule["editor/actions/history-and-layout.js"];

  assert.match(view, /`Corresponding tags \(\$\{correspondingTags\.sourceTagCount\}\)`/);
  assert.match(view, /compatibilityMode && correspondingTags\.sourceTagCount > 0/);
  assert.match(dialog, /Save mappings/);
  assert.match(dialog, /Convert unreviewed/);
  assert.match(dialog, /Convert approved/);
  assert.match(dialog, /does not change any segments until you choose a conversion action/i);
  assert.match(controller, /if \(result\.history\) acceptHistory\(result\.history\)/);
  assert.match(controller, /slotPermissionProtectedCount/);
  assert.match(controller, /currentHistory/);
  assert.match(hook, /operationIdFor\(operationKey\)/);
  assert.match(hook, /correspondingTagId: row\.correspondingTagId/);
  assert.match(hook, /expectedUpdatedAt: row\.mappingUpdatedAt/);
  assert.match(hook, /currentMappings/);
  assert.match(hook, /expectedHistoryRevision/);
  assert.match(history, /state\?\.type === "composite"/);
  assert.match(history, /for \(const \[index, childState\]/);
});

test("Basic structural commands record native history and use native restoration", () => {
  const primaryActions = sourceByModule["editor/actions/primary.js"];
  const reviewActions = sourceByModule["editor/actions/review.js"];
  const historyActions = sourceByModule["editor/actions/history-and-layout.js"];
  const editorView = sourceByModule["editor/SegmentEditorView.js"];

  for (const kind of [
    "segment.create",
    "segment.duplicate",
    "segment.split",
  ])
    assert.match(primaryActions, new RegExp(`"${kind.replace(".", "\\.")}"`));
  assert.match(reviewActions, /"segments\.merge"/);
  assert.match(primaryActions, /receiptId = null/);
  assert.match(primaryActions, /historyReceiptId/);
  assert.match(reviewActions, /historyReceiptId/);
  assert.match(historyActions, /!compatibilityMode[\s\S]*\/history\/native-state/);
  assert.match(historyActions, /expectedHistoryRevision: historyRef\.current\.revision/);
  assert.match(historyActions, /actionSequence: step\.action\.sequence/);
  assert.match(historyActions, /direction: step\.direction/);
  assert.match(historyActions, /acceptHistory\(restored\.history\)/);
  assert.match(historyActions, /const next = compatibilityMode[\s\S]*historyRef\.current/);
  assert.doesNotMatch(historyActions, /sourceState,[\s\S]*targetState: state/);
  const workflowActions = sourceByModule["editor/actions/workflow.js"];
  assert.match(
    workflowActions,
    /\.\.\.\(compatibilityMode \? \{ reviewState: "rejected" \} : \{\}\)/,
  );
  assert.match(editorView, /`Undo \$\{currentUndoAction\.label\}`/);
});

test("editor view receives each controller binding used in nested component props", () => {
  const controller = sourceByModule["editor/SegmentEditor.js"];
  const view = sourceByModule["editor/SegmentEditorView.js"];
  const viewBindings = view.slice(
    view.indexOf("const {"),
    view.indexOf("} = props;") + "} = props;".length,
  );
  const viewProps = controller.slice(
    controller.indexOf("return h(SegmentEditorView, {"),
    controller.indexOf("});", controller.indexOf("return h(SegmentEditorView, {")),
  );
  const nestedBindings = [
    "currentTime",
    "duplicateSegment",
    "hideDerivedSegments",
    "lineage",
    "onSlotsChanged",
    "performerSlots",
    "performerSlotsAvailable",
    "provenance",
    "provenanceSources",
    "saveTag",
    "saveTiming",
    "segmentGroups",
    "selectedGroups",
    "selectedPerformerSlots",
    "selectedSegments",
    "shotBoundaries",
    "slotButtonRef",
    "splitSegment",
    "tagEditing",
    "tagSearchRef",
  ];

  for (const binding of nestedBindings) {
    assert.match(viewBindings, new RegExp(`\\b${binding}\\b`));
    assert.match(viewProps, new RegExp(`\\b${binding}\\b`));
  }
});

test("modified pointer selection adds and removes segments in both editor views", () => {
  assert.deepEqual(ui.updateSegmentSelection([1], 1, 2, true), {
    selectedSegmentIds: [1, 2],
    activeSegmentId: 2,
  });
  assert.deepEqual(ui.updateSegmentSelection([1, 2], 2, 2, true), {
    selectedSegmentIds: [1],
    activeSegmentId: 1,
  });
  assert.deepEqual(ui.updateSegmentSelection([1, 2], 2, 1, true), {
    selectedSegmentIds: [2],
    activeSegmentId: 2,
  });
  assert.deepEqual(ui.updateSegmentSelection([1], 1, 1, true), {
    selectedSegmentIds: [1],
    activeSegmentId: 1,
  });
  assert.deepEqual(ui.updateSegmentSelection([1, 2], 2, 3), {
    selectedSegmentIds: [3],
    activeSegmentId: 3,
  });
  assert.deepEqual(ui.reconcileSelectedSegmentIds([1, 9], [1, 2], 2), [1, 2]);
  assert.deepEqual(ui.reconcileSelectedSegmentIds([1, 9], [2], 2), [2]);
  assert.equal((source.match(/additive: event\.metaKey \|\| event\.ctrlKey/g) || []).length, 2);
  assert.match(source, /selectedSegmentIds\.includes\(segment\.id\)/);
  assert.match(source, /"aria-pressed": selected/);
});

test("modifier-clicking swimlane and group titles toggles their segment collections", () => {
  assert.deepEqual(ui.updateSegmentCollectionSelection([1], 1, [2, 3]), {
    selectedSegmentIds: [1, 2, 3],
    activeSegmentId: 2,
  });
  assert.deepEqual(ui.updateSegmentCollectionSelection([1, 2, 3, 4], 2, [2, 3]), {
    selectedSegmentIds: [1, 4],
    activeSegmentId: 4,
  });
  assert.deepEqual(ui.updateSegmentCollectionSelection([2, 3], 2, [2, 3]), {
    selectedSegmentIds: [2, 3],
    activeSegmentId: 2,
  });
  assert.match(source, /onSelectSegments\(group\.lanes\.flatMap/);
  assert.match(source, /onSelectSegments\(lane\.markers\.map/);
});

test("select all targets every segment in the video and clears visibility filters", () => {
  const segments = [{ id: 3 }, { id: 1 }, { id: 2 }];
  assert.deepEqual(ui.selectAllVideoSegmentIds(segments), [3, 1, 2]);
  assert.deepEqual(ui.selectAllVideoSegmentIds([]), []);
  assert.match(source, /function selectAllVideoSegments\(\)/);
  assert.match(source, /setEditorFilters\(normalizeEditorSegmentFilters\(\{\}\)\)/);
  assert.match(source, /setHideDerivedSegments\(false\)/);
  assert.match(source, /selectAllVideoSegmentIds\(segments\)/);
  assert.match(source, /onSelectAll: selectAllVideoSegments/);
  assert.match(source, /event\.metaKey \|\| event\.ctrlKey/);
  assert.match(source, /event\.key !== "Enter" && event\.key !== " "/);
  assert.match(source, /Cmd\/Ctrl\+click or press Enter to select every segment in this video/);
  assert.doesNotMatch(source, /key: "select-all"/);
});

test("selection lifecycle is explicit for filters, collapse, and atomic review failure", () => {
  assert.deepEqual(ui.reconcileSelectedSegmentIds([1, 2, 9], [1, 2, 3], 2), [1, 2]);
  assert.deepEqual(ui.reconcileSelectedSegmentIds([1, 9], [2, 3], 2), [2]);
  assert.deepEqual(ui.reconcileSelectedSegmentIds([1, 9], [2, 3], null), [2]);
  assert.match(source, /Collapsed Segment groups keep their selected segments/);
  assert.match(source, /Unable to update the selected segments/);
  assert.doesNotMatch(source, /completedCandidates/);
});

test("recycling-bin selection stays in the current swimlane before moving to a nearby lane", () => {
  const lanes = [
    {
      key: "current",
      markers: [
        { segment: { id: 1, startSec: 10, endSec: 20 } },
        { segment: { id: 2, startSec: 100, endSec: 110 } },
        { segment: { id: 3, startSec: 30, endSec: 40 } },
      ],
    },
    {
      key: "nearby-lane",
      markers: [
        { segment: { id: 4, startSec: 15, endSec: 25 } },
        { segment: { id: 5, startSec: 32, endSec: 35 } },
      ],
    },
    {
      key: "farther-lane",
      markers: [{ segment: { id: 6, startSec: 20, endSec: 22 } }],
    },
  ];

  assert.equal(ui.nextSegmentAfterRemoval(lanes, [1], 1)?.id, 3);
  assert.equal(ui.nextSegmentAfterRemoval(lanes, [1, 2, 3], 1)?.id, 4);
  assert.equal(ui.nextSegmentAfterRemoval(lanes, [1, 2, 3, 4, 5], 1)?.id, 6);
  assert.equal(ui.nextSegmentAfterRemoval(lanes, [1, 2, 3, 4, 5, 6], 1), null);
  assert.match(source, /nextSegmentAfterRemoval\(allSwimlanes, selectedIds, selectedSegment\.id\)/);
});

test("collecting AI feedback advances to the next unreviewed segment below the selection", () => {
  const lanes = [
    { key: "current", markers: [
      { segment: { id: 1, reviewState: "approved" } },
      { segment: { id: 2, reviewState: "unreviewed" } },
      { segment: { id: 3, reviewState: "unreviewed" } },
    ] },
    { key: "below", markers: [
      { segment: { id: 4, reviewState: "approved" } },
      { segment: { id: 5, reviewState: "unreviewed" } },
    ] },
    { key: "farther-below", markers: [
      { segment: { id: 6, reviewState: "unreviewed" } },
    ] },
  ];
  assert.equal(ui.nextUnreviewedAfterRemoval(lanes, [2], 2)?.id, 3);
  assert.equal(ui.nextUnreviewedAfterRemoval(lanes, [2, 3], 2)?.id, 5);
  assert.equal(ui.nextUnreviewedAfterRemoval(lanes, [2, 3, 5], 2)?.id, 6);
  assert.equal(ui.nextUnreviewedAfterRemoval(lanes, [2, 3, 5, 6], 2), null);
  assert.equal(ui.resolveVisibleSelectedSegment(
    lanes.flatMap((lane) => lane.markers.map(({ segment }) => segment)),
    ui.CLEARED_SEGMENT_SELECTION_ID,
  ), null);
  assert.match(source, /nextUnreviewedAfterRemoval\(\s*allSwimlanes, completedIds, activeIdentity\.id\)/);
  assert.match(source, /const transitionSelectionOwned = shouldRestoreTransitionSelection\([\s\S]*const selectionGuardId/);
  assert.match(source, /shouldRestoreTransitionSelection\(\s*selectedSegmentIdRef\.current, selectionGuardId/);
  assert.match(source, /activeCollected \? CLEARED_SEGMENT_SELECTION_ID : null/);
});

test("shift-click selects a contiguous range within one timeline swimlane", () => {
  assert.deepEqual(ui.updateSegmentRangeSelection([11], 11, 13, [11, 12, 13, 14]), {
    selectedSegmentIds: [11, 12, 13],
    activeSegmentId: 13,
  });
  assert.deepEqual(ui.updateSegmentRangeSelection([13], 13, 11, [11, 12, 13, 14]), {
    selectedSegmentIds: [11, 12, 13],
    activeSegmentId: 11,
  });
  assert.deepEqual(ui.updateSegmentRangeSelection([20], 20, 13, [11, 12, 13, 14]), {
    selectedSegmentIds: [13],
    activeSegmentId: 13,
  });
  assert.deepEqual(ui.updateSegmentRangeSelection([20], 11, 13, [11, 12, 13, 14], true), {
    selectedSegmentIds: [20, 11, 12, 13],
    activeSegmentId: 13,
  });
  assert.match(source, /rangeSegmentIds: event\.shiftKey \? lane\.markers\.map/);
});

test("additive anchors preserve earlier ranges when extending another swimlane", () => {
  let selection = {
    selectedSegmentIds: [],
    activeSegmentId: null,
    anchorSegmentId: null,
    rangeBaseSegmentIds: [],
  };
  selection = ui.updateAnchoredSegmentSelection(selection, 11);
  selection = ui.updateAnchoredSegmentSelection(selection, 13, [11, 12, 13]);
  assert.deepEqual(selection, {
    selectedSegmentIds: [11, 12, 13],
    activeSegmentId: 13,
    anchorSegmentId: 11,
    rangeBaseSegmentIds: [],
  });
  selection = ui.updateAnchoredSegmentSelection(selection, 21, null, true);
  selection = ui.updateAnchoredSegmentSelection(selection, 23, [21, 22, 23]);
  assert.deepEqual(selection, {
    selectedSegmentIds: [11, 12, 13, 21, 22, 23],
    activeSegmentId: 23,
    anchorSegmentId: 21,
    rangeBaseSegmentIds: [11, 12, 13],
  });
});

test("segment details represent the full multi-selection", () => {
  const segments = [
    { id: 1, tagName: "First" },
    { id: 2, tagName: "Second" },
    { id: 3, tagName: "Third" },
  ];
  assert.deepEqual(ui.resolveSelectedSegments(segments, [3, 1, 9]), [segments[2], segments[0]]);
  const activeEditor = source.slice(
    source.indexOf("function SegmentActiveEditor"),
    source.indexOf("function KeyboardShortcutsDialog"),
  );
  const multiDetails = source.slice(
    source.indexOf("function MultiSegmentSelectionDetails"),
    source.indexOf("function SegmentActiveEditor"),
  );
  assert.match(activeEditor, /selectedSegments\.length > 1/);
  assert.match(multiDetails, /`\$\{selectedSegments\.length\} segments selected`/);
  assert.match(multiDetails, /selectedGroups\.map/);
  assert.match(multiDetails, /aria-label": "Selected segment details"/);
});

test("multi-selection blocks single-segment commands while preserving bulk actions", () => {
  for (const shortcutId of [
    "video.playSelected",
    "video.jumpToSegmentStart",
    "video.jumpToSegmentEnd",
    "marker.duplicate",
    "marker.duplicateAtPlayhead",
    "marker.split",
    "marker.setStart",
    "marker.setEnd",
    "marker.copyTiming",
    "marker.pasteTiming",
  ])
    assert.equal(ui.shortcutRequiresSingleSegment(shortcutId), true, shortcutId);
  for (const shortcutId of [
    "marker.mergeSelection",
    "marker.editTag",
    "marker.confirm",
    "marker.reject",
    "marker.assignSlots",
    "marker.toggleIncorrectExample",
    "navigation.quickSearch",
  ])
    assert.equal(ui.shortcutRequiresSingleSegment(shortcutId), false, shortcutId);
  assert.match(source, /selectedSegments\.length > 1 && shortcutRequiresSingleSegment\(shortcut\.id\)/);
  assert.match(source, /async function duplicateSegment[\s\S]{0,150}selectedSegments\.length !== 1/);
  assert.match(source, /async function splitSegment[\s\S]{0,150}selectedSegments\.length !== 1/);
  assert.match(source, /async function saveTag[\s\S]*\/segments\/tag/);
  assert.match(source, /Change tag for \$\{selectedSegments\.length\} segments/);
  const bulkTagHandler = source.slice(
    source.indexOf("async function saveTag"),
    source.indexOf("async function moveToBin"),
  );
  assert.match(bulkTagHandler, /segments:\s*selectedSegments\.map/);
  assert.match(bulkTagHandler, /beforeState = segmentsHistoryState\(\s*selectedSegments,\s*compatibilityMode,/);
  assert.match(source, /async function saveTiming[\s\S]{0,150}selectedSegments\.length !== 1/);
  assert.match(source, /async function applyShortcutTiming[\s\S]{0,150}selectedSegments\.length !== 1/);
  assert.match(source, /async function toggleIncorrectExample[\s\S]{0,150}selectedSegments\.length === 0/);
  assert.match(source, /feedbackSelectionPlan\(selectedSegments, incorrectExamples\)/);
  assert.match(source, /async function moveToBin[\s\S]{0,150}!canMoveSelectionToBin/);
  const moveToBinHandler = source.slice(
    source.indexOf("async function moveToBin"),
    source.indexOf("async function applySegmentHistoryState"),
  );
  assert.match(moveToBinHandler, /segments:\s*candidates\.map/);
});

test("selection review shortcuts apply a state and reset only when every segment already has it", () => {
  const mixed = [{ reviewState: "approved" }, { reviewState: "unreviewed" }, { reviewState: "rejected" }];
  assert.equal(ui.toggledSelectionReviewState(mixed, "approved"), "approved");
  assert.equal(ui.toggledSelectionReviewState(mixed, "rejected"), "rejected");
  assert.equal(ui.toggledSelectionReviewState([{ reviewState: "approved" }, { reviewState: "approved" }], "approved"), "unreviewed");
  assert.equal(ui.toggledSelectionReviewState([{ reviewState: "rejected" }, { reviewState: "rejected" }], "rejected"), "unreviewed");
  const handler = source.slice(
    source.indexOf("async function saveSelectedReviewState"),
    source.indexOf("async function toggleIncorrectExample"),
  );
  assert.match(handler, /segments\/review-state/);
  assert.match(handler, /segments:\s*selectedSegments\.map/);
  assert.match(handler, /expectedHistoryRevision:\s*historyRef\.current\.revision/);
  assert.match(handler, /if \(result\.history\) acceptHistory\(result\.history\)/);
  assert.match(handler, /if \(reviewState === "approved"\)[\s\S]*onDetailChange/);
  assert.match(handler, /approvedSetVersion: result\.approvedSetVersion/);
  assert.match(handler, /else[\s\S]*await onReload\(\)/);
  assert.doesNotMatch(handler, /for \(const segment of candidates/);
  assert.doesNotMatch(handler, /Partially updated/);
});

test("one selected swimlane can be merged into its full selected time span", () => {
  const lane = {
    key: "tag:1",
    markers: [
      { segment: { id: 3, startSec: 30, endSec: 36 } },
      { segment: { id: 1, startSec: 10, endSec: 14 } },
      { segment: { id: 2, startSec: 20, endSec: 25 } },
    ],
  };
  assert.deepEqual(ui.selectedSwimlaneMerge([{
    key: "group:1",
    lanes: [lane],
  }]), {
    lane,
    segments: [
      { id: 1, startSec: 10, endSec: 14 },
      { id: 2, startSec: 20, endSec: 25 },
      { id: 3, startSec: 30, endSec: 36 },
    ],
    startSec: 10,
    endSec: 36,
  });
  assert.equal(ui.selectedSwimlaneMerge([
    { key: "group:1", lanes: [lane] },
    { key: "group:2", lanes: [{ ...lane, key: "tag:2" }] },
  ]), null);
  assert.equal(ui.selectedSwimlaneMerge([{ key: "group:1", lanes: [{ ...lane, markers: lane.markers.slice(0, 1) }] }]), null);
  assert.equal(ui.selectedSwimlaneMerge([{
    key: "group:1",
    lanes: [{
      ...lane,
      markers: [
        { segment: { id: 1, startSec: 10, endSec: 40 } },
        { segment: { id: 2, startSec: 20, endSec: null } },
      ],
    }],
  }]).endSec, 40);
  assert.notEqual(ui.selectedSwimlaneMerge([{
    key: "group:1",
    lanes: [{
      ...lane,
      markers: lane.markers.map(({ segment }) => ({
        segment: { ...segment, nativeSegmentId: segment.id },
      })),
    }],
  }], { nativeOnly: true }), null);
  assert.equal(ui.selectedSwimlaneMerge([{
    key: "group:1",
    lanes: [{
      ...lane,
      markers: [
        { segment: { id: 1, nativeSegmentId: 1, startSec: 10, endSec: 14 } },
        { segment: { id: -2, itemId: 2, startSec: 20, endSec: 25 } },
      ],
    }],
  }], { nativeOnly: true }), null);

  const multiDetails = source.slice(
    source.indexOf("function MultiSegmentSelectionDetails"),
    source.indexOf("function SegmentActiveEditor"),
  );
  assert.doesNotMatch(multiDetails, /Merge selected segments/);
  assert.match(multiDetails, /multiSelectionActionHint\(\{ mergeable, reviewable, tagEditable, slotsEditable \}\)/);
  assert.equal(ui.multiSelectionActionHint({
    mergeable: true, reviewable: true, tagEditable: true, slotsEditable: false,
  }), "Selected segments can be merged (R), retagged (Q), approved (Z) or rejected (X).");
  assert.equal(ui.multiSelectionActionHint({
    mergeable: false, reviewable: true, tagEditable: true, slotsEditable: false,
  }), "Selected segments can be retagged (Q), approved (Z) or rejected (X).");
  assert.match(source, /segments\/merge-selection/);
  assert.match(source, /drafts\/merge-selection/);
  assert.equal(ui.parseMergeConfirmationPreference(null), true);
  assert.equal(ui.parseMergeConfirmationPreference("false"), false);
  assert.match(source, /function MergeSelectionDialog/);
  assert.match(source, /The merged result becomes manually sourced; model, confidence, and active provenance are removed/);
  assert.match(source, /Do not ask again/);
  assert.match(source, /Confirm segment merges/);
  assert.match(source, /writeMergeConfirmationPreference\(next\)/);
  const mergeDialog = source.slice(
    source.indexOf("function MergeSelectionDialog"),
    source.indexOf("function DerivedSegmentMaterializationDialog"),
  );
  assert.match(mergeDialog, /onKeyDownCapture: trapModalFocus/);
  assert.match(mergeDialog, /ref: cancelButtonRef[\s\S]*autoFocus: true/);
  assert.doesNotMatch(mergeDialog, /key: "confirm"[\s\S]*autoFocus: true/);
  const mergeHandler = source.slice(
    source.indexOf("async function mergeSelectedSwimlane"),
    source.indexOf("async function saveSelectedReviewState"),
  );
  assert.doesNotMatch(mergeHandler, /window\.confirm/);
  assert.match(mergeHandler, /confirmedMerge \|\| selectedSwimlaneMerge\([\s\S]*nativeOnly: !compatibilityMode/);
  assert.match(mergeHandler, /!compatibilityMode \|\| survivor\.nativeSegmentId != null/);
  assert.match(source, /mergeSelectedSwimlane\(true, skipFuture, mergeConfirmation\)/);
  assert.match(source, /requestAnimationFrame\(\(\) => detailPanelRef\.current\?\.focus/);
});

test("bulk performer assignment requires every selected segment to share one slot shape", () => {
  const segments = [{ id: 1, tagId: 10 }, { id: 2, tagId: 10 }];
  const slots = [
    { segmentId: 1, slotDefinitionId: 10, sortOrder: 0, label: "Receiver", genderHints: ["FEMALE"] },
    { segmentId: 2, slotDefinitionId: 20, sortOrder: 0, label: "Receiver", genderHints: ["FEMALE"] },
  ];
  assert.equal(ui.sharedPerformerSlotShape(slots, segments)?.length, 2);
  assert.equal(ui.sharedPerformerSlotShape([
    ...slots,
    { segmentId: 2, slotDefinitionId: 21, sortOrder: 1, label: "Giver", genderHints: ["MALE"] },
  ], segments), null);
  assert.equal(ui.sharedPerformerSlotShape([
    { ...slots[0], allowSamePerformerInMultipleSlots: false },
    { ...slots[1], allowSamePerformerInMultipleSlots: true },
  ], segments), null);
  assert.equal(ui.sharedPerformerSlotShape(slots, [...segments, { id: 3 }]), null);
  assert.equal(ui.sharedTagPerformerSlotShape(slots, segments)?.length, 2);
  assert.equal(ui.sharedTagPerformerSlotShape(slots, [segments[0], { ...segments[1], tagId: 20 }]), null);
  assert.equal(ui.multiSelectionActionHint({
    mergeable: false, reviewable: true, tagEditable: true, slotsEditable: true,
  }), "Selected segments can be retagged (Q), approved (Z), rejected (X) or assigned performers (G).");
  const slotEditors = sourceByModule["editor/PerformerSlotEditors.js"];
  const multiEditor = slotEditors.slice(
    slotEditors.indexOf("function MultiPerformerSlotAssignmentEditor"),
    slotEditors.indexOf("export { ReviewButton"),
  );
  assert.match(multiEditor, /generatePerformerSlotAssignmentRecommendations\([\s\S]*commonSlots[\s\S]*videoPerformers/);
  assert.match(multiEditor, /Auto-assignment options/);
  assert.match(multiEditor, /applyAndSaveRecommendation/);
  assert.match(multiEditor, /Press number keys 1-/);
  const activeEditor = sourceByModule["editor/SegmentActiveEditor.js"];
  assert.match(activeEditor, /multiRecommendationShortcutRef[\s\S]*\^\[1-9\]\$[\s\S]*Number\(event\.key\) - 1/);
});

test("selected segment details mirror segment groups and swimlanes", () => {
  const lanes = [
    {
      key: "tag:1",
      segmentGroupId: 7,
      segmentGroupName: "First group",
      label: "First lane",
      performerLabel: null,
      markers: [
        { segment: { id: 1, reviewState: "unreviewed" }, track: 0 },
        { segment: { id: 2, reviewState: "approved" }, track: 0 },
      ],
    },
    {
      key: "tag:2:performers:12",
      segmentGroupId: 7,
      segmentGroupName: "First group",
      label: "Second lane",
      performerLabel: "Giver · Alex",
      markers: [
        { segment: { id: 3, reviewState: "rejected" }, track: 0 },
      ],
    },
    {
      key: "tag:3",
      segmentGroupId: null,
      segmentGroupName: null,
      label: "Ungrouped lane",
      performerLabel: null,
      markers: [
        { segment: { id: 4, reviewState: "approved" }, track: 0 },
      ],
    },
  ];
  assert.deepEqual(ui.groupSelectedSwimlanes(lanes, [4, 2, 3]), [
    {
      key: "group:7",
      id: 7,
      name: "First group",
      selectedCount: 2,
      counts: { unreviewed: 0, approved: 1, rejected: 1 },
      lanes: [
        {
          ...lanes[0],
          selectedCount: 1,
          counts: { unreviewed: 0, approved: 1, rejected: 0 },
          markers: [lanes[0].markers[1]],
        },
        {
          ...lanes[1],
          selectedCount: 1,
          counts: { unreviewed: 0, approved: 0, rejected: 1 },
          markers: [lanes[1].markers[0]],
        },
      ],
    },
    {
      key: "ungrouped",
      id: null,
      name: "Ungrouped",
      selectedCount: 1,
      counts: { unreviewed: 0, approved: 1, rejected: 0 },
      lanes: [
        {
          ...lanes[2],
          selectedCount: 1,
          counts: { unreviewed: 0, approved: 1, rejected: 0 },
          markers: [lanes[2].markers[0]],
        },
      ],
    },
  ]);
});

test("grouped selection details use collapsed lane summaries and reduce to one segment", () => {
  const details = source.slice(
    source.indexOf("function MultiSegmentSelectionDetails"),
    source.indexOf("function SegmentActiveEditor"),
  );
  assert.match(details, /data-selected-segment-group/);
  assert.match(details, /data-selected-segment-lane/);
  assert.match(details, /aria-expanded": expanded/);
  assert.match(details, /aria-current": containsActive \? "true" : undefined/);
  assert.match(details, /aria-current": segment\.id === activeSegmentId \? "true" : undefined/);
  assert.match(details, /h\(LaneReviewCounts/);
  assert.match(details, /aria-live": "polite"/);
  assert.match(details, /onClick: \(\) => onReduceSelection\(segment\)/);
  assert.match(details, /provenanceSourceLabel\(segment\.sourceKey\)/);
  assert.match(details, /segment\.isDerived \? h\(DerivedSegmentIcon/);
  assert.match(source, /detailPanelRef\.current\?\.focus/);
  assert.match(source, /aria-label": "Selected segment editor"/);
});

test("ownership transitions preserve selection through stable item identity", () => {
  const segments = [
    { id: 10, itemId: null, nativeSegmentId: 10 },
    { id: -22, itemId: 22, nativeSegmentId: null },
    { id: 30, itemId: 22, nativeSegmentId: 30 },
  ];
  assert.equal(ui.findSegmentByStableIdentity(segments, { itemId: 22, nativeSegmentId: 10 }).id, -22);
  assert.equal(ui.findSegmentByStableIdentity(segments, { nativeSegmentId: 10 }).id, 10);
  assert.equal(ui.findSegmentByStableIdentity(segments, { itemId: 99 }), null);
  assert.equal(ui.shouldRestoreTransitionSelection(-22, -22), true);
  assert.equal(ui.shouldRestoreTransitionSelection(10, -22), false);
  assert.deepEqual(ui.findPublishedSelectionIdentity(segments, -22, [
    { itemId: 22, nativeSegmentId: 30 },
  ]), { itemId: 22, nativeSegmentId: 30 });
  assert.equal(ui.findPublishedSelectionIdentity(segments, 10, [
    { itemId: 22, nativeSegmentId: 30 },
  ]), null);
  assert.match(source, /findPublishedSelectionIdentity\(\s*segments,\s*selectedSegmentIdRef\.current/s);
  assert.match(source, /identity && result[\s\S]*identity\.itemId = result\.itemId/);
  assert.match(source, /identity\.itemId = result\.itemId/);
  assert.match(source, /return loaded;/);
  assert.match(source, /shouldRestoreTransitionSelection\(selectedSegmentIdRef\.current, activeIdentity\.id\)/);
});

test("editor uses a bounded responsive two-pane review layout", () => {
  assert.match(source, /aria-label": "Segment rail"/);
  assert.doesNotMatch(source, /gridTemplateColumns: `minmax\(0,1fr\) 0\.5rem \$\{markerRailWidth\}px`/);
  assert.match(source, /position: "absolute", top: 0, right: 0/);
  assert.match(source, /height: horizontalLayoutSize\.focusRowHeight/);
  assert.match(source, /const WIDE_EDITOR_QUERY = "\(min-width: 1024px\) and \(min-height: 640px\)"/);
  assert.match(source, /matchMedia\(WIDE_EDITOR_QUERY\)/);
  assert.match(source, /height: "calc\(100dvh - 3\.25rem\)"/);
  assert.match(source, /margin: "-1rem -1\.5rem -1\.25rem"/);
  assert.match(source, /width: "calc\(100% \+ 3rem\)"/);
  assert.match(source, /wideLayout[\s\S]*position: "absolute", top: 0, right: 0[\s\S]*height: "32rem"/);
  assert.equal(source.match(/style: \{ minHeight: "16rem" \}/g)?.length, 2);
  assert.match(source, /h\("div", \{ className: "h-full min-h-0 w-full" \}, h\(VideoPlayer/);
  assert.doesNotMatch(source, /min-h-\[16rem\]/);
  assert.doesNotMatch(source, /border-y-border|border-r-border|text-secondary\/80|overscroll-contain/);
  assert.doesNotMatch(source, /border border-border border-l-4/);
  assert.match(source, /min-h-0[^"\n]*overflow-y-auto/);
  assert.match(source, /rowBottom - container\.clientHeight/);
});

test("desktop editor uses compact workspace gutters", () => {
  assert.match(source, /flex flex-col gap-2 outline-none/);
  assert.match(source, /flex shrink-0 flex-col items-stretch gap-2 rounded-md border border-border bg-surface px-3 py-2/);
  assert.match(source, /min-h-0 flex-1" : ""} relative grid gap-2/);
  assert.doesNotMatch(source, /key: "rail-tools"/);
  assert.match(source, /\) 0\.5rem minmax\(14rem/);
  assert.match(source, /space-y-2 overflow-y-auto rounded-md border border-border bg-card p-3/);
});

test("timeline-primary layout state is bounded, persistent, and accessible", () => {
  const defaults = { timelineRatio: 0.45, markerRailOpen: true, detailWidth: 352, markerRailWidth: 352, swimlaneTitleWidth: 256 };
  assert.deepEqual(ui.parseEditorLayout(null), defaults);
  assert.deepEqual(ui.parseEditorLayout("not-json"), defaults);
  assert.deepEqual(ui.parseEditorLayout('{"timelineRatio":0.6,"markerRailOpen":false,"detailWidth":420,"markerRailWidth":480,"swimlaneTitleWidth":320}'),
    { timelineRatio: 0.6, markerRailOpen: false, detailWidth: 420, markerRailWidth: 480, swimlaneTitleWidth: 320 });
  assert.deepEqual(ui.parseEditorLayout('{"timelineRatio":12,"markerRailOpen":"no","detailWidth":10,"markerRailWidth":900,"swimlaneTitleWidth":900}'),
    { timelineRatio: 0.7, markerRailOpen: true, detailWidth: 240, markerRailWidth: 560, swimlaneTitleWidth: 400 });
  for (const timelineRatio of [null, false, true, "0.6", ""]) {
    assert.deepEqual(ui.parseEditorLayout(JSON.stringify({ timelineRatio, markerRailOpen: false })),
      { ...defaults, markerRailOpen: false });
  }
  assert.equal(ui.clampEditorPanelWidth(10), 240);
  assert.equal(ui.clampEditorPanelWidth(900), 560);
  assert.equal(ui.clampEditorPanelWidth(560, 384), 384);
  assert.equal(ui.clampEditorPanelWidth("420"), 352);
  assert.equal(ui.clampSwimlaneTitleWidth(10), 160);
  assert.equal(ui.clampSwimlaneTitleWidth(900), 400);
  assert.equal(ui.clampSwimlaneTitleWidth("320"), 256);
  assert.equal(ui.clampSwimlaneTitleWidth(360, 300), 300);
  assert.equal(ui.calculateSwimlaneTitleMaximum(0), 400);
  assert.equal(ui.calculateSwimlaneTitleMaximum(400), 160);
  assert.equal(ui.calculateSwimlaneTitleMaximum(500), 180);
  assert.equal(ui.calculateSwimlaneTitleMaximum(1000), 400);
  assert.equal(ui.calculateEditorPanelMaximum(1024, 600), 424);
  assert.equal(ui.calculateEditorPanelMaximum(700, 600), 240);
  assert.match(source, /effectiveRailWidth \+ 24/);
  assert.equal(ui.clampTimelineRatio(0.1), 0.25);
  assert.equal(ui.clampTimelineRatio(0.9), 0.7);
  const bounds = ui.calculateTimelineRatioBounds(549);
  assert.ok(bounds.minimum > 0.41 && bounds.minimum < 0.42);
  assert.ok(bounds.maximum > 0.52 && bounds.maximum < 0.53);
  assert.equal(ui.clampTimelineRatioForHeight(0.6, 549), bounds.maximum);
  assert.equal(ui.calculateTimelineRatioFromPointer(600, 100, 1000), 0.5);
  assert.equal(ui.calculateTimelineRatioFromPointer(100, 100, 1000), 0.7);
  assert.match(source, /segment-studio\.layout\.v1/);
  assert.match(source, /role: "separator"/);
  assert.match(source, /"aria-orientation": "horizontal"/);
  assert.match(source, /Resize player and swimlanes/);
  assert.match(source, /Hide segment rail|Show segment rail/);
  assert.doesNotMatch(source, /Hide marker rail|Show marker rail|Segment markers/);
  assert.match(source, /groupSwimlanesBySegmentGroup\(allSwimlanes\)/);
  assert.match(source, /data-segment-rail-group/);
  assert.match(source, /gridTemplateColumns: editorLayout\.markerRailOpen/);
  assert.match(source, /Resize segment rail/);
  assert.match(source, /Resize segment details/);
  assert.match(source, /Resize swimlane titles/);
  assert.match(source, /"aria-orientation": "vertical"/);
  assert.match(source, /bg-surface lg:min-h-0/);
  assert.match(source, /buildSegmentRailRows\(groupedSegmentRail, collapsedSegmentGroups\)/);
  assert.match(source, /visibleVirtualRows\(/);
  assert.match(source, /"aria-expanded": editorLayout\.markerRailOpen/);
  assert.match(source, /selectedSegment\?\.id, segmentRailLayout, editorLayout\.markerRailOpen/);
  assert.match(source, /minmax\(16rem/);
  assert.match(source, /minmax\(14rem/);
  assert.match(source, /editorLayout\.timelineRatio \* 100\}fr/);
  assert.match(source, /SPLIT_EDITOR_QUERY = "\(min-width: 1024px\) and \(min-height: 900px\)"/);
  assert.match(source, /const splitLayout = useSplitEditorLayout\(\);/);
  assert.match(source, /h\(SegmentEditor, \{[^}]*splitLayout/s);
});

test("the primary timeline keeps its axis visible and reveals selection vertically", () => {
  assert.equal(ui.calculateVerticalRevealOffset(90, 110, 100, 200), -12);
  assert.equal(ui.calculateVerticalRevealOffset(150, 200.25, 100, 200), 2.25);
  assert.equal(ui.calculateVerticalRevealOffset(120, 180, 100, 200), 0);
  assert.match(source, /data-timeline-axis/);
  assert.match(source, /sticky top-0/);
  assert.match(source, /data-selected-timeline-marker/);
  assert.match(source, /container\.scrollTop/);
  assert.match(source, /const timelineGeometry = useMemo\([\s\S]*lanes\.map/);
  assert.match(source, /new ResizeObserver\(update\)/);
  assert.match(source, /setViewportWidth\(container\.clientWidth\)/);
  assert.doesNotMatch(source, /scrollIntoView\([^)]*inline/);
  assert.match(source, /height: "20rem"/);
  assert.match(source, /cursor: "row-resize"/);
  assert.match(source, /hover:bg-muted\/40/);
  assert.doesNotMatch(source, /cursor-row-resize|group-hover:bg-accent/);
});

test("the fitted timeline contains edge labels and gives swimlane names room", () => {
  assert.equal(ui.timelineTickAlignment(0, 6), "translate-x-0");
  assert.equal(ui.timelineTickAlignment(5, 6), "translate-x-0");
  assert.equal(ui.timelineTickAlignment(2, 6), "-translate-x-1/2");
  assert.deepEqual(ui.timelineTickPosition(0, 6, 0), { left: "0%" });
  assert.deepEqual(ui.timelineTickPosition(5, 6, 100), { right: "0" });
  assert.equal(ui.timelineTickAlignment(5, 6, 90), "-translate-x-1/2");
  assert.deepEqual(ui.timelineTickPosition(5, 6, 90), { left: "90%" });
  assert.deepEqual(ui.timelineTickPosition(0, 1, 0), { left: "0%" });
  assert.match(source, /swimlaneTitleWidth: 256/);
  assert.match(source, /buildMinuteTimelineTicks\(safeDuration\)/);
  assert.doesNotMatch(source, /data-shot-boundary-lane/);
  assert.match(source, /gridTemplateColumns: `\$\{labelWidthRem}rem minmax\(0,1fr\)`/);
  assert.match(source, /data-segment-group/);
  assert.match(source, /key: "name",[\s\S]*sticky left-0/);
  assert.match(source, /data-grouped-swimlane/);
});

test("marker rows distinguish review state and current selection", () => {
  const unreviewed = ui.segmentStateStyle("unreviewed", false);
  const approved = ui.segmentStateStyle("approved", false);
  const rejected = ui.segmentStateStyle("rejected", false);
  const selected = ui.segmentStateStyle("unreviewed", true);

  assert.notDeepEqual(unreviewed, approved);
  assert.notDeepEqual(unreviewed, rejected);
  assert.equal(unreviewed.borderLeftColor, "rgb(250, 204, 21)");
  assert.equal(approved.borderLeftColor, "rgb(52, 211, 153)");
  assert.equal(rejected.borderLeftColor, "rgb(248, 113, 113)");
  assert.equal(selected.outline, "2px solid var(--color-accent)");
  assert.equal(ui.segmentBadgeStyle("approved").color, "var(--color-foreground)");
  assert.deepEqual(ui.segmentRailItemStyle(false), {
    backgroundColor: "var(--color-card)",
  });
  assert.equal(ui.segmentRailItemStyle(true).outline, "2px solid var(--color-accent)");
  const railItem = source.slice(
    source.indexOf("function renderSegmentRailItem"),
    source.indexOf("return h(\"section\"", source.indexOf("function renderSegmentRailItem")),
  );
  assert.doesNotMatch(railItem, /border-l-4|segmentStateStyle/);
  assert.match(railItem, /key: "review"[\s\S]*key: "tag"[\s\S]*key: "time"[\s\S]*key: "provenance"/);
  assert.doesNotMatch(railItem, /key: "top"|key: "meta"|key: "confidence"/);
  const rail = source.slice(
    source.indexOf('"aria-label": "Segment rail"'),
    source.indexOf('key: "review-pane"'),
  );
  assert.match(rail, /row\.lane\.performers\?\.length \? h\(PerformerSublaneAvatars/);
  assert.match(rail, /key: "name"[\s\S]*row\.lane\.label/);
  assert.match(rail, /h\(LaneReviewCounts, \{ key: "states", counts: row\.lane\.counts \}\)/);
  assert.doesNotMatch(rail, /key: "count"[\s\S]*lane\.markers\.length/);
});

test("segment rail virtualization preserves grouped row geometry and overscan", () => {
  const grouped = [{
    key: "group:1",
    lanes: [{
      key: "lane:1",
      markers: [
        { segment: { id: 10 } },
        { segment: { id: 11 } },
      ],
    }],
  }, {
    key: "group:2",
    lanes: [{
      key: "lane:2",
      markers: [{ segment: { id: 12 } }],
    }],
  }];
  const expanded = ui.buildSegmentRailRows(grouped);
  assert.deepEqual(expanded.rows.map((row) => row.kind), [
    "group", "lane", "segment", "segment", "group", "lane", "segment",
  ]);
  assert.equal(expanded.height, 265);
  assert.deepEqual(expanded.rows.map((row) => row.top), [0, 38, 71, 112, 153, 191, 224]);

  const collapsed = ui.buildSegmentRailRows(grouped, ["group:1"]);
  assert.deepEqual(collapsed.rows.map((row) => row.key), [
    "group:1:header", "group:2:header", "lane:2:label", "segment:12",
  ]);
  assert.equal(collapsed.height, 150);
  assert.deepEqual(
    ui.visibleVirtualRows(expanded.rows, 100, 20, 0).map((row) => row.key),
    ["segment:10", "segment:11"],
  );
});

test("timeline virtualization preserves variable lane heights and collapsed groups", () => {
  const grouped = [{
    key: "group:1",
    lanes: [
      { key: "lane:1", trackCount: 1 },
      { key: "lane:2", trackCount: 3 },
    ],
  }, {
    key: "group:2",
    lanes: [{ key: "lane:3", trackCount: 2 }],
  }];
  const expanded = ui.buildTimelineRows(grouped);
  assert.deepEqual(expanded.rows.map((row) => row.kind), [
    "group", "lane", "lane", "group", "lane",
  ]);
  assert.deepEqual(expanded.rows.map((row) => row.height), [32, 28, 68, 32, 48]);
  assert.equal(expanded.height, 208);

  const collapsed = ui.buildTimelineRows(grouped, ["group:1"]);
  assert.deepEqual(collapsed.rows.map((row) => row.key), [
    "header:group:1", "header:group:2", "lane:3",
  ]);
  assert.equal(collapsed.height, 112);
  assert.deepEqual(
    ui.buildTimelineRows(grouped, [], false).rows.map((row) => row.key),
    ["lane:1", "lane:2", "lane:3"],
  );
});

test("segment rail omits redundant previous and next controls", () => {
  const editor = source.slice(source.indexOf("function SegmentEditor"), source.indexOf("const DISCOVERY_URL_OPTIONS"));
  assert.doesNotMatch(editor, /← Previous|Next →|key: "nav"/);
});

test("review-mode slot helpers remain available while editor mode hides them", () => {
  const slots = [
    { segmentId: 11, slotDefinitionId: "b", label: null, sortOrder: 1, genderHints: [], performerId: null, performerName: null },
    { segmentId: 12, slotDefinitionId: "c", label: "Giver", sortOrder: 0, genderHints: [], performerId: 202, performerName: "Other" },
    { segmentId: 11, slotDefinitionId: "a", label: "Receiver", sortOrder: 0, genderHints: ["TRANSGENDER_FEMALE", "FEMALE"], performerId: 201, performerName: "Alexis Example" },
  ];

  assert.deepEqual(ui.performerSlotsForSegment(slots, 11), [slots[2], slots[0]]);
  const indexedSlots = ui.indexPerformerSlotsBySegment(slots);
  assert.deepEqual(indexedSlots.get(11), [slots[2], slots[0]]);
  assert.deepEqual(indexedSlots.get(12), [slots[1]]);
  assert.equal(ui.performerSlotStatusFromSegmentSlots(indexedSlots.get(11)), "partial");
  assert.equal(ui.performerSlotStatusFromSegmentSlots(indexedSlots.get(13)), "not-applicable");
  assert.equal(ui.performerSlotLabel(slots[2]), "Receiver");
  assert.equal(ui.performerSlotLabel(slots[0]), "Slot 2");
  assert.equal(ui.formatGenderHint("TRANSGENDER_FEMALE"), "Transgender female");
  assert.equal(ui.performerSlotStatus(slots, 11), "partial");
  assert.equal(ui.performerSlotStatus(slots, 12), "complete");
  assert.equal(ui.performerSlotStatus(slots, 13), "not-applicable");
  assert.equal(ui.performerSlotStatus([{ ...slots[0], segmentId: 14 }], 14), "empty");
  assert.notEqual(ui.segmentTimelineStyle("approved", false, "complete").borderColor,
    ui.segmentTimelineStyle("rejected", false, "complete").borderColor);
  assert.equal(ui.segmentTimelineStyle("approved", false, "complete").backgroundColor, "rgb(22, 163, 74)");
  assert.equal(ui.segmentTimelineStyle("unreviewed", false, "complete").backgroundColor, "rgb(234, 179, 8)");
  assert.equal(ui.segmentTimelineStyle("rejected", false, "complete").backgroundColor, "rgb(220, 38, 38)");
  assert.equal(ui.segmentTimelineStyle("approved", false, "complete").boxShadow, undefined);
  assert.match(ui.segmentTimelineStyle("approved", false, "empty").boxShadow, /^inset .*253, 224, 71/);
  assert.equal(ui.segmentTimelineStyle("rejected", false, "empty").boxShadow, undefined);
  assert.equal(ui.segmentTimelineStyle("rejected", false, "partial").boxShadow, undefined);
  assert.equal(ui.segmentTimelineStyle("approved", true, "complete").outlineOffset, "-2px");
  const activeTimeline = ui.segmentTimelineStyle("approved", true, "complete", true);
  assert.equal(activeTimeline.backgroundColor, "rgb(22, 163, 74)");
  assert.equal(activeTimeline.outline, "3px solid var(--color-accent)");
  assert.equal(activeTimeline.outlineOffset, "1px");
  assert.equal(activeTimeline.zIndex, 25);
  const basicTimeline = ui.basicSegmentTimelineStyle(false, false);
  assert.equal(basicTimeline.borderColor, "rgb(20, 184, 166)");
  assert.equal(basicTimeline.backgroundColor, "rgb(20, 184, 166)");
  assert.equal(ui.basicSegmentTimelineStyle(true, false).outlineOffset, "-2px");
  assert.equal(ui.basicSegmentTimelineStyle(true, true).outlineOffset, "1px");
  assert.deepEqual(ui.segmentRailItemStyle(true, true), {
    backgroundColor: "var(--color-card)",
    outline: "3px solid var(--color-accent)",
    outlineOffset: "1px",
    zIndex: 30,
  });
  assert.match(source, /segmentTimelineStyle\(segment\.reviewState, selected, slotStatus, active\)/);
  assert.match(source, /basicSegmentTimelineStyle\(selected, active\)/);
  assert.match(source, /segmentRailItemStyle\(selected, active\)/);
  assert.equal(ui.timelineSegmentWidth(12, 0.025), "0.025%");
  assert.equal(ui.timelineSegmentWidth(12, 0), "0%");
  assert.equal(ui.timelineSegmentWidth(null, 0), "4px");
});

test("active segment editing shares the player row above swimlanes", () => {
  const editor = source.slice(source.indexOf("function SegmentActiveEditor"), source.indexOf("const DISCOVERY_URL_OPTIONS"));
  assert.match(editor, /key: "focus-row"/);
  assert.match(editor, /editorLayout\.markerRailOpen[\s\S]*`\$\{detailWidth\}px 0\.5rem minmax\(0,1fr\) 0\.5rem \$\{markerRailWidth\}px`/);
  assert.match(editor, /key: "rail-placeholder"/);
  assert.ok(editor.indexOf('key: "tools"') < editor.indexOf('key: "player"'));
  assert.ok(editor.indexOf('key: "player"') < editor.indexOf('key: "timeline"'));
  assert.match(source, /Slot status/);
  assert.match(source, /data-active-segment-scroll/);
  assert.match(source, /scrollRef\.current\.scrollTop = 0/);
  assert.match(source, /\[selectedSegment\?\.id\]/);
});

test("performer slot assignment opens on demand in a modal dialog", () => {
  const activeEditor = source.slice(source.indexOf("function SegmentActiveEditor"), source.indexOf("function SegmentEditor"));
  assert.match(activeEditor, /Edit performer slots/);
  assert.match(activeEditor, /data-performer-slot-dialog/);
  assert.match(activeEditor, /role: "dialog"/);
  assert.match(activeEditor, /"aria-modal": "true"/);
  assert.match(activeEditor, /setSlotsOpen\(true\)/);
  assert.match(activeEditor, /setSlotsOpen\(false\)/);
  assert.ok(activeEditor.indexOf("Edit performer slots") < activeEditor.indexOf("data-performer-slot-dialog"));
  assert.equal((activeEditor.match(/h\(PerformerSlotAssignmentEditor/g) || []).length, 1);
  const event = { key: "g", shiftKey: false, ctrlKey: false, altKey: false, metaKey: false };
  assert.equal(ui.findEditorShortcut(event, false), null);
  assert.equal(ui.findEditorShortcut(event, true)?.id, "marker.assignSlots");
  assert.match(source, /shortcut\.id === "marker\.assignSlots"/);
  assert.match(source, /slotButtonRef\.current\?\.click\(\)/);
});

test("selected segment details show compact performer slot assignments", () => {
  assert.deepEqual(ui.performerSlotPresentation({
    label: "Giver",
    sortOrder: 0,
    performerId: 12,
    performerName: "Alex",
    genderHints: ["FEMALE"],
  }), {
    label: "Giver",
    performer: "Alex",
    filled: true,
    title: "Giver (Female): Alex",
  });
  assert.deepEqual(ui.performerSlotPresentation({
    label: "",
    sortOrder: 1,
    performerId: null,
    performerName: null,
    genderHints: ["MALE", "TRANSGENDER_MALE"],
  }), {
    label: "Slot 2",
    performer: "Unfilled",
    filled: false,
    title: "Slot 2 (Male/Transgender male): Unfilled",
  });
  assert.equal(ui.performerSlotPresentation({
    label: "Receiver",
    performerId: 42,
    performerName: "",
  }).performer, "Performer 42");
  const activeEditor = source.slice(source.indexOf("function SegmentActiveEditor"), source.indexOf("function KeyboardShortcutsDialog"));
  assert.match(activeEditor, /role: "group"/);
  assert.match(activeEditor, /aria-label": "Performer slots"/);
  assert.match(activeEditor, /selectedPerformerSlots\.map/);
  assert.match(activeEditor, /presentation\.label/);
  assert.match(activeEditor, /presentation\.performer/);
  assert.match(activeEditor, /h\(PerformerAssignmentRows/);
  assert.match(source, /function PerformerAssignmentRows\(\{ assignments/);
  assert.match(source, /gridTemplateColumns: "minmax\(4\.5rem, auto\) minmax\(0, 1fr\) 1\.5rem"/);
  assert.match(source, /justify-self-end/);
  assert.match(source, /"aria-label": assignment\.title/);
  assert.ok((source.match(/h\(PerformerAssignmentRows/g) || []).length >= 2);
});

test("selected segment detail separates start and end times with a dash", () => {
  const editor = source.slice(
    source.indexOf("function SegmentActiveEditor"),
    source.indexOf("const DISCOVERY_SORT_OPTIONS"),
  );

  assert.match(editor, /key: "time-separator"[\s\S]*"–"/);
  const timingRow = editor.slice(editor.indexOf('key: "timing-row"'), editor.indexOf('key: "slots-row"'));
  assert.doesNotMatch(timingRow, /aria-hidden/);
});

test("editor video title links to Cove without a separate open-video action", () => {
  const editor = source.slice(
    source.indexOf("function SegmentEditor"),
    source.indexOf("function SegmentStudioSettings"),
  );

  assert.match(editor, /h\("h1", \{ key: "title"[\s\S]*h\("a", \{[\s\S]*href: `\/video\/\$\{video\.id\}`/);
  const header = editor.slice(editor.indexOf('h("header", { key: "header"'), editor.indexOf('autoAssignOpen ?'));
  assert.match(header, /videoPerformers\.map\(\(performer\) => h\(PerformerAvatar/);
  assert.match(header, /tooltip: performer\.name/);
  assert.match(header, /h\(LaneReviewCounts, \{ key: "review-counts", counts: visibleCounts \}\)/);
  assert.match(header, /flex shrink-0 flex-col items-stretch/);
  assert.match(header, /key: "identity", className: "flex min-w-0 flex-1 items-center gap-1\.5"/);
  assert.match(header, /key: "title", className: "min-w-0 truncate/);
  assert.match(header, /key: "title-row"[\s\S]*h\(SegmentStudioSettingsAction, \{ key: "settings"/);
  assert.doesNotMatch(header, /key: "review-counts", className: "mt-1"/);
  assert.match(source, /function PerformerAvatar\(\{ performer, compact = false, tooltip = null \}\)/);
  assert.match(source, /title: tooltip \|\| undefined/);
  assert.doesNotMatch(editor, /Open Cove video/);
});
