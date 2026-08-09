import test from "node:test";
import { assert, fs, manifest, repositoryRoot, source, sourceByModule, TestElement, ui } from "../SegmentStudioUiHarness.mjs";
test("editor discovery preserves filters without reading hidden Full work in Basic", () => {
  const params = ui.buildDiscoverySearchParams(
    { q: "sample", page: 2, perPage: 24, sort: "segment_count", direction: "desc" },
    {
      segments: "has",
      reviewState: "approved",
      segmentTagId: 17,
      videoTagIds: [41, 42],
      performerIds: [21, 22],
      studioId: 31,
      shotBoundaries: "none",
    },
  );

  assert.equal(params.get("hasSegments"), "true");
  assert.equal(params.has("reviewState"), false);
  assert.equal(params.get("segmentTagId"), "17");
  assert.equal(params.get("videoTagIds"), "41,42");
  assert.equal(params.get("performerIds"), "21,22");
  assert.equal(params.get("studioId"), "31");
  assert.equal(params.has("hasShotBoundaries"), false);
  assert.equal(params.has("workspace"), false);
  const legacyParams = ui.buildDiscoverySearchParams(
    { page: 1, perPage: 24 },
    { tagId: 19 },
  );
  assert.equal(legacyParams.get("segmentTagId"), "19");
  assert.equal(legacyParams.has("tagId"), false);
  const fullParams = ui.buildDiscoverySearchParams(
    { page: 1, perPage: 24 },
    { reviewState: "unreviewed" },
    "full",
  );
  assert.equal(fullParams.get("reviewState"), "unreviewed");
  assert.equal(fullParams.get("workflow"), "full");
  assert.match(source, /includeCounts:\s*["']false["']/);
  const discovery = source.slice(source.indexOf("function SegmentStudioDiscoveryPage"), source.indexOf("function SegmentStudioEditorPage"));
  assert.doesNotMatch(discovery, /requestJson\("\/review\/segments"/);
  assert.doesNotMatch(discovery, /\/drafts/);
  assert.doesNotMatch(discovery, /method:\s*["']PUT["']/);
});

test("video discovery exposes Cove's seeded random sort", () => {
  const params = ui.buildDiscoverySearchParams(
    { page: 3, perPage: 24, sort: "random", direction: "asc", seed: 2468 },
    {},
  );

  assert.equal(params.get("sort"), "random");
  assert.equal(params.get("seed"), "2468");
  assert.deepEqual(
    ui.DISCOVERY_SORT_OPTIONS.find((option) => option.value === "random"),
    { value: "random", label: "Random" },
  );
});

test("video discovery uses URL-backed Cove entity selectors and focused clear behavior", () => {
  const filters = source.slice(source.indexOf("function DiscoveryFilters"), source.indexOf("function SegmentGroupCard"));
  const discovery = source.slice(source.indexOf("function SegmentStudioDiscoveryPage"), source.indexOf("function SegmentStudioEditorPage"));

  assert.match(filters, /"Segment data"/);
  assert.match(filters, /"Video metadata"/);
  assert.match(filters, /h\(EntityReferenceSelector/);
  assert.match(filters, /h\(EntityReferenceMultiSelector/);
  assert.equal((filters.match(/segment-studio-reference-filter/g) || []).length, 3);
  assert.match(filters, /entityType: "performer"/);
  assert.match(filters, /entityType: "studio"/);
  assert.match(filters, /placeholder: "Search Segment tags…"/);
  assert.match(filters, /placeholder: "Search Video tags…"/);
  assert.match(filters, /"Clear filters"/);
  assert.doesNotMatch(filters, /type: "search"[\s\S]*Find .*segment tag/);
  assert.match(discovery, /function clearObjectFilters\(\) \{ setObjectFilter\(\{\}\); setFilter\(\{ \.\.\.filter, page: 1 \}\); \}/);
  assert.match(discovery, /setObjectFilter\(next\); setFilter\(\{ \.\.\.filter, page: 1 \}\)/);
  assert.doesNotMatch(discovery, /setDisplayMode\("grid"\)|q: ""|sort: "title"/);
});

test("video discovery ID filters normalize for URL reload persistence", () => {
  assert.deepEqual(ui.normalizeDiscoveryIds([42, "41", 42, 0, "bad"]), [42, 41]);
  assert.deepEqual(ui.normalizeDiscoveryIds("21,22,21"), [21, 22]);
  assert.deepEqual(ui.normalizeDiscoveryIds(null), []);
});

test("direct editor has no workspace creation gate", () => {
  assert.doesNotMatch(source, /\/workspace/);
  assert.doesNotMatch(source, /Start review|Resume review|Review not started/);
  assert.match(source, /\/videos\/\$\{video\.id\}\/segments\/\$\{segment\.id\}/);
  assert.doesNotMatch(source, /changes save immediately/);
  assert.match(source, /LaneReviewCounts, \{ key: "review-counts", counts: visibleCounts \}/);
});

test("Basic and Full modes are database-backed per-user settings", () => {
  assert.equal(ui.normalizeSegmentStudioMode("editor"), "editor");
  assert.equal(ui.normalizeSegmentStudioMode("review"), "review");
  assert.equal(ui.normalizeSegmentStudioMode("unexpected"), "editor");
  assert.doesNotMatch(source, /segment-studio\.mode\.v1/);
  assert.doesNotMatch(source, /readSegmentStudioMode|writeSegmentStudioMode/);
  assert.match(source, /requestJson\("\/preferences"/);
  assert.match(source, /Mode is saved to your Cove user account/);
  assert.doesNotMatch(source, /requestJson\("\/compatibility"/);
  assert.match(source, /legacyCompatibilityRequired/);
  assert.doesNotMatch(source, /SegmentStudioLegacyTabs/);
  assert.match(source, /value: "basic" }, "Basic"/);
  assert.match(source, /value: "full" }, "Full"/);
  assert.match(source, /normalizeSegmentStudioFeatureProfile/);
  const settings = source.slice(source.indexOf("function SegmentStudioSettingsPage"), source.indexOf("function SegmentStudioTabs"));
  assert.match(settings, /SegmentStudioModeSelector/);
  const discovery = source.slice(source.indexOf("function SegmentStudioDiscoveryPage"), source.indexOf("function SegmentStudioEditorPage"));
  assert.doesNotMatch(discovery, /SegmentStudioModeSelector/);
});

test("workflow settings explain the Basic and Full storage boundary", () => {
  const settings = source.slice(
    source.indexOf('h("section", { key: "mode"'),
    source.indexOf('h("div", { key: "derivation-rules-panel"'),
  );
  assert.match(settings, /Create and edit ordinary Cove segments directly/);
  assert.match(settings, /No Segment Studio registration or review decision is required/);
  assert.match(settings, /Adds Segment Studio-owned drafts, review, performer slots, derivation/);
  assert.match(settings, /Live segments are preserved when modes change/);
  assert.match(settings, /clears Basic undo history/);
  assert.match(settings, /Materialized derivations remain Segment Studio-owned and appear only in Full/);
});

test("selected segments render preloaded provenance without per-selection requests", () => {
  assert.match(source, /detail\.itemMetadata\?\.\[selectedSegment\.itemId\]/);
  assert.match(source, /selectedSegment\?\.fieldProvenance/);
  assert.doesNotMatch(sourceByModule["editor/SegmentEditor.js"], /`\/items\/\$\{itemId\}\/provenance`/);
  assert.doesNotMatch(sourceByModule["editor/SegmentEditor.js"], /`\/videos\/\$\{video\.id\}\/segments\/\$\{nativeSegmentId\}\/provenance`/);
  assert.match(source, /aria-label": "Segment provenance"/);
  assert.equal(ui.provenanceSourceLabel("ext:segment-studio:stash-marker-studio"), "Stash Marker Studio · legacy");
  assert.equal(ui.provenanceSourceLabel("segment-studio/user"), "Manual");
  assert.equal(ui.provenanceSourceLabel("ext:ai.tagging"), "Cove AI Tagging");
  assert.equal(ui.provenanceSourceLabel("tpdb"), "TPDB");
  assert.equal(ui.provenanceSourceLabel(" TPDB ", "The Porn Database"), "The Porn Database");
  assert.equal(ui.compactProvenanceSummary({ items: [] }, "ext:segment-studio:stash-marker-studio"), "Stash Marker Studio · legacy");
  assert.equal(ui.compactProvenanceSummary({ items: [
    { sourceKey: "ext:ai.tagging", sourceDisplayName: "Cove AI Tagging" },
    { sourceKey: "user", sourceDisplayName: "Manual" },
  ] }), "Cove AI Tagging +1");
  assert.match(source, /"aria-expanded": open/);
  assert.match(source, /Detailed run and model information was not recorded/);
  assert.match(source, /assertion\.activityExternalRunId \|\| assertion\.sourceRunId/);
  assert.doesNotMatch(source, /Source \$\{segment\.sourceKey \|\| "unknown"\}/);
});

test("selected segments use preloaded lineage and derived tags are read-only", () => {
  assert.match(source, /selectedItemMetadata\?\.lineage \|\| null/);
  assert.doesNotMatch(sourceByModule["editor/SegmentEditor.js"], /requestJson\(`\/items\/\$\{itemId\}\/lineage`/);
  assert.match(source, /"aria-label": "Segment lineage"/);
  assert.match(source, /function DerivedSegmentIcon/);
  assert.match(source, /title: "Derived segment"/);
  assert.match(source, /"aria-label": "Derived segment"/);
  assert.match(source, /segment\.isDerived \? h\(DerivedSegmentIcon/);
  assert.match(source, /selectedSegment\?\.isDerived \? h\(DerivedSegmentIcon/);
  assert.match(source, /disabled: savingSegmentId != null \|\| lineage\.data\?\.tagReadOnly === true/);
  assert.match(source, /This tag is read-only because it is set by a derivation rule\./);
  assert.match(source, /onNavigateLineageItem\(parent\.itemId\)/);
});

test("derived segments can be hidden with a persistent accessible editor control", () => {
  const segments = [
    { id: 1, isDerived: false },
    { id: 2, isDerived: true },
    { id: 3 },
  ];
  assert.deepEqual(ui.filterDerivedSegments(segments, false), segments);
  assert.deepEqual(ui.filterDerivedSegments(segments, true).map((segment) => segment.id), [1, 3]);
  assert.equal(ui.resolveVisibleSelectedSegment(segments, 2)?.id, 2);
  assert.equal(ui.resolveVisibleSelectedSegment(ui.filterDerivedSegments(segments, true), 2)?.id, 1);
  assert.equal(ui.resolveVisibleSelectedSegment([], 2), null);
  assert.equal(ui.reconcileFilteredSelectedSegmentId(segments, [segments[0], segments[2]], 2), 1);
  assert.equal(ui.reconcileFilteredSelectedSegmentId(segments, [], 2), null);
  assert.equal(ui.reconcileFilteredSelectedSegmentId(segments, segments, 2), 2);
  assert.equal(ui.reconcileFilteredSelectedSegmentId(segments, segments, null), null);
  assert.equal(ui.reconcileFilteredSelectedSegmentId(segments, segments, 99), 99);
  assert.equal(ui.parseHideDerivedSegmentsPreference("true"), true);
  assert.equal(ui.parseHideDerivedSegmentsPreference("false"), false);
  assert.equal(ui.parseHideDerivedSegmentsPreference("anything-else"), false);
  assert.match(source, /segment-studio\.hide-derived-segments\.v1/);
  assert.match(source, /Hide derived segments/);
  assert.match(source, /checked: hideDerivedSegments/);
  assert.match(source, /onHideDerivedChange\(event\.target\.checked\)/);
  assert.match(source, /selectedSegmentIdRef\.current = selectedSegment\?\.id \?\? null/);
  assert.match(source, /No segments match the current editor filters\./);
  assert.match(source, /h\(DerivedSegmentIcon/);
});

test("editor filters consistently combine review, any-slot performer, provenance, derivation, and AI confidence", () => {
  const segments = [
    { id: 1, reviewState: "approved", sourceKey: "user", confidence: null, isDerived: false },
    { id: 2, reviewState: "unreviewed", sourceKey: "ext:ai.tagging", confidence: 0.35, isDerived: false },
    { id: 3, reviewState: "unreviewed", sourceKey: "ext:ai.tagging", confidence: 0.8, isDerived: true },
    { id: 4, reviewState: "rejected", sourceKey: "tpdb", confidence: 0.6, isDerived: false },
  ];
  const slots = [
    { segmentId: 1, performerId: 10, label: "Giver" },
    { segmentId: 2, performerId: 20, label: "Receiver" },
    { segmentId: 3, performerId: 10, label: "Receiver" },
    { segmentId: 4, performerId: null, label: "Receiver" },
  ];
  const defaults = ui.normalizeEditorSegmentFilters({});
  assert.deepEqual(defaults, {
    reviewStates: ["unreviewed", "approved", "rejected"],
    performerId: null,
    tagId: null,
    segmentGroupId: null,
    sourceKey: null,
    confidenceMin: 0,
    confidenceMax: 1,
    includeUnscored: true,
  });
  assert.deepEqual(ui.filterEditorSegments(segments, slots, defaults, false).map((segment) => segment.id), [1, 2, 3, 4]);
  assert.deepEqual(ui.filterEditorSegments(segments, slots, {
    reviewStates: ["unreviewed"],
    performerId: 10,
    sourceKey: "ext:ai.tagging",
    confidenceMin: 0.5,
    confidenceMax: 0.9,
  }, true).map((segment) => segment.id), []);
  assert.deepEqual(ui.filterEditorSegments(segments, slots, {
    reviewStates: ["unreviewed"],
    performerId: 10,
    sourceKey: "ext:ai.tagging",
    confidenceMin: 0.5,
    confidenceMax: 0.9,
  }, false).map((segment) => segment.id), [3]);
  assert.deepEqual(ui.filterEditorSegments(segments, slots, {
    reviewStates: ["approved", "rejected"],
    performerId: null,
    sourceKey: null,
    confidenceMin: 0.5,
    confidenceMax: 0.7,
  }, false).map((segment) => segment.id), [1, 4]);
  assert.deepEqual(ui.normalizeEditorSegmentFilters({ reviewStates: [], confidenceMin: 0.9, confidenceMax: 0.2 }), {
    reviewStates: [],
    performerId: null,
    tagId: null,
    segmentGroupId: null,
    sourceKey: null,
    confidenceMin: 0.2,
    confidenceMax: 0.9,
    includeUnscored: true,
  });
  assert.deepEqual(ui.normalizeEditorSegmentFilters({ confidenceMin: "invalid", confidenceMax: Infinity }), defaults);
  assert.equal(ui.activeEditorFilterCount(defaults, false), 0);
  assert.equal(ui.activeEditorFilterCount({
    reviewStates: ["approved"],
    performerId: 10,
    sourceKey: "user",
    confidenceMin: 0.2,
    confidenceMax: 0.8,
  }, true), 5);
  assert.equal(ui.dualRangeValueFromPointer(75, 50, 100), 0.25);
  assert.equal(ui.dualRangeValueFromPointer(85.6, 50, 100), 0.36);
  assert.equal(ui.dualRangeValueFromPointer(20, 50, 100), 0);
  assert.equal(ui.dualRangeValueFromPointer(180, 50, 100), 1);
  assert.equal(ui.dualRangeValueFromPointer(NaN, 50, 100), 0);
  const collapsedFromMinimum = ui.updateDualRangeValues(0.2, 0.6, "minimum", 0.6);
  assert.deepEqual(collapsedFromMinimum, { minimum: 0.6, maximum: 0.6, coincidentTop: "maximum" });
  assert.deepEqual(
    ui.updateDualRangeValues(collapsedFromMinimum.minimum, collapsedFromMinimum.maximum, collapsedFromMinimum.coincidentTop, 0.8),
    { minimum: 0.6, maximum: 0.8, coincidentTop: "maximum" },
  );
  const collapsedFromMaximum = ui.updateDualRangeValues(0.4, 0.8, "maximum", 0.4);
  assert.deepEqual(collapsedFromMaximum, { minimum: 0.4, maximum: 0.4, coincidentTop: "minimum" });
  assert.deepEqual(
    ui.updateDualRangeValues(collapsedFromMaximum.minimum, collapsedFromMaximum.maximum, collapsedFromMaximum.coincidentTop, 0.2),
    { minimum: 0.2, maximum: 0.4, coincidentTop: "minimum" },
  );

  const filterUi = source.slice(source.indexOf("function EditorFiltersDialog"), source.indexOf("function SegmentEditor"));
  const editor = source.slice(source.indexOf("function SegmentEditor"), source.indexOf("const DISCOVERY_URL_OPTIONS"));
  assert.match(filterUi, /Editor filters/);
  assert.match(filterUi, /Any assigned slot/);
  assert.match(source, /Minimum AI confidence/);
  assert.match(source, /Maximum AI confidence/);
  assert.match(source, /data-confidence-range/);
  assert.match(source, /zIndex: minimum === maximum && coincidentTop === kind \? 2 : 1/);
  assert.equal((source.match(/role: "slider"/g) || []).length, 2);
  assert.doesNotMatch(filterUi, /type: "range"/);
  assert.match(filterUi, /tabIndex: -1,\s*onKeyDownCapture: trapModalFocus/);
  assert.match(editor, /ref: filtersButtonRef/);
  assert.match(editor, /filtersButtonRef\.current\.focus\(\{ preventScroll: true \}\)/);
  assert.match(editor, /onClose: closeEditorFilters/);
  assert.doesNotMatch(editor, /key: "rail-tools"[\s\S]*setFilter\(state\)/);
});

test("root tag changes preview every destructive lineage effect before execution", () => {
  assert.match(source, /\/tag-change\/preview/);
  assert.match(source, /preview\.removedEdgeIds\.length/);
  assert.match(source, /preview\.deletedItemIds\.length/);
  assert.match(source, /window\.confirm\(/);
  assert.match(source, /componentFingerprint: preview\.componentFingerprint/);
  assert.match(source, /\/tag-change\/execute/);
});

test("dependency deletion previews exact effects and always asks for confirmation", () => {
  assert.doesNotMatch(source, /lineageDeletePolicy/);
  assert.doesNotMatch(source, /Lineage deletion/);
  assert.match(source, /\/delete\/preview/);
  assert.match(source, /preview\.permissionFailureCount/);
  assert.match(source, /preview\.integrityWarnings/);
  assert.match(source, /preview\.selectedSegmentCount/);
  assert.match(source, /preview\.dependentSegmentCount/);
  assert.match(source, /preview\.retainedSharedSegmentCount/);
  assert.doesNotMatch(source, /requiresTypedConfirmation/);
  assert.doesNotMatch(source, /DELETE SEGMENTS/);
  assert.match(source, /\/delete\/execute/);
  assert.match(source, /fingerprint: preview\.fingerprint/);
});

test("settings keep lineage repair machinery out of the rule-management view", () => {
  const settings = source.slice(
    source.indexOf("function SegmentStudioSettingsPage"),
    source.indexOf("function SegmentStudioTabs"),
  );

  assert.doesNotMatch(settings, /Lineage maintenance/);
  assert.doesNotMatch(settings, /\/maintenance\/lineage\/issues/);
  assert.doesNotMatch(settings, /restore-tag/);
  assert.doesNotMatch(settings, /Pause lineage writes/);
  assert.doesNotMatch(settings, /Ingest native AI provenance/);
});

test("Full editor opens owned and native items in the unified editor", () => {
  assert.match(source, /\/review\/segments/);
  assert.match(source, /Create segment at the playhead/);
  assert.doesNotMatch(source, /key: "create-segment"/);
  assert.doesNotMatch(source, /requestedNativeEditor|editor=native/);
  assert.match(source, /compatibilityMode: mode === "review", profile/);
  assert.match(source, /const approvedDrafts = useMemo\(\s*\(\) => segments\.filter\(\(segment\) => !segment\.published && segment\.reviewState === "approved"\),\s*\[segments\],\s*\);\s*const approvedDraftCount = approvedDrafts\.length/);
  assert.match(source, /`Publish approved\$\{approvedDraftCount \? ` \(\$\{approvedDraftCount\}\)` : ""\}`/);
  assert.doesNotMatch(source, /"Complete review"/);
  assert.match(source, /\/complete-review/);
  assert.doesNotMatch(source, /\?workflow=full/);
  assert.match(source, /const editorPath = \(requestedVideoId\)/);
  assert.match(source, /requestJson\(editorPath\(requestedVideoId\)\)/);
});

test("Full editor previews rejected dependency deletion through the Stash shortcut", () => {
  const editor = source.slice(source.indexOf("function SegmentEditor"), source.indexOf("const DISCOVERY_URL_OPTIONS"));
  assert.match(editor, /system\.deleteRejected/);
  assert.match(editor, /\/videos\/\$\{video\.id\}\/rejected\/deletion\/preview/);
  assert.match(editor, /\/videos\/\$\{video\.id\}\/rejected\/deletion\/execute/);
  assert.match(editor, /segment\.reviewState === "approved"/);
  assert.match(editor, /\/complete-review/);
});

test("manual segment creation matches the Stash Marker Studio shortcut contract", () => {
  assert.equal(ui.findEditorShortcut({ key: "a", ctrlKey: false, metaKey: false, altKey: false, shiftKey: false }, false)?.id, "marker.create");
  assert.equal(ui.findEditorShortcut({ key: "d", ctrlKey: false, metaKey: false, altKey: false, shiftKey: false }, false)?.id, "marker.duplicate");
  assert.equal(ui.findEditorShortcut({ key: "D", ctrlKey: false, metaKey: false, altKey: false, shiftKey: true }, false)?.id, "marker.duplicateAtPlayhead");
  assert.equal(ui.findEditorShortcut({ key: "s", ctrlKey: false, metaKey: false, altKey: false, shiftKey: false }, false)?.id, "marker.split");
  assert.match(source, /description: "Create segment at the playhead"/);
  assert.match(source, /startSec \+ 20/);
  assert.match(source, /shortcut\.id === "marker\.create"/);
  assert.match(source, /shortcut\.id === "marker\.duplicate"/);
  assert.match(source, /shortcut\.id === "marker\.duplicateAtPlayhead"/);
  assert.match(source, /shortcut\.id === "marker\.split"/);
  assert.match(source, /Create segment at the playhead/);
  const editor = source.slice(source.indexOf("function SegmentEditor"), source.indexOf("const DISCOVERY_URL_OPTIONS"));
  assert.doesNotMatch(editor, /window\.prompt\("Segment tag ID"/);
  assert.match(editor, /resolveSegmentCreationAction\(segments, selectedSegment, requestedTagId\)/);
  assert.match(editor, /pendingTagEditSegmentIdRef\.current = createdSegment\.id/);
  assert.match(editor, /replaceSegmentSelection\(createdSegment\.id\)/);
  assert.match(source, /shouldAcceptCurrentTagFromEnter\(event, selectedSegment\.tagName\)[\s\S]*saveTag\(selectedSegment\.tagId\)/);
  assert.match(editor, /createdIdentity = \{ itemId: result\.draft\?\.itemId \}/);
  assert.match(editor, /createdIdentity = \{ nativeSegmentId: created\.id \}/);
  assert.match(editor, /findSegmentByStableIdentity\(loaded\?\.segments, createdIdentity\)/);
  assert.match(editor, /duplicateIdentity = duplicateIdentityFromResponse\(false, result\)/);
  assert.match(editor, /duplicateIdentity = duplicateIdentityFromResponse\(true, duplicate\)/);
  assert.match(editor, /findSegmentByStableIdentity\(loaded\?\.segments, duplicateIdentity\)/);
  assert.match(editor, /setSelectedSegmentId\(duplicatedSegment\.id\)/);
  assert.deepEqual(ui.duplicateIdentityFromResponse(false, {
    createdDraft: { itemId: 91 },
  }), { itemId: 91 });
  assert.deepEqual(ui.duplicateIdentityFromResponse(true, {
    id: 42,
  }), { nativeSegmentId: 42 });
  assert.throws(() => ui.duplicateIdentityFromResponse(false, {
    createdDraft: {},
  }), /stable item identity/);
  assert.throws(() => ui.duplicateIdentityFromResponse(true, {}), /stable native identity/);
  assert.notEqual(
    ui.duplicateOperationKey(7, { published: true, id: 41, updatedAt: "first" }, false, 0),
    ui.duplicateOperationKey(7, { published: true, id: 42, updatedAt: "first" }, false, 0),
  );
  assert.notEqual(
    ui.duplicateOperationKey(7, { published: true, id: 41, updatedAt: "first" }, false, 0),
    ui.duplicateOperationKey(8, { published: true, id: 41, updatedAt: "first" }, false, 0),
  );
  assert.equal(
    ui.duplicateOperationKey(7, { published: true, id: 41, updatedAt: "first" }, true, 12.5),
    "duplicate-native:7:41:first:12.5",
  );
  assert.equal(
    ui.duplicateOperationKey(7, { published: false, itemId: 91, revision: 3 }, false, 0),
    "duplicate-draft:7:91:3:in-place",
  );
  const visibility = ui.editorVisibilityIncludingSegment({
    id: -91,
    reviewState: "approved",
    sourceKey: "ext:ai.tagging",
    confidence: 0.905,
    isDerived: true,
  }, [
    { segmentId: -91, performerId: 8 },
  ], {
    reviewStates: ["unreviewed"],
    performerId: 7,
    sourceKey: "user",
    confidenceMin: 0,
    confidenceMax: 0.5,
  }, true);
  assert.deepEqual(visibility, {
    filters: {
      reviewStates: ["unreviewed", "approved"],
      performerId: null,
      tagId: null,
      segmentGroupId: null,
      sourceKey: null,
      confidenceMin: 0,
      confidenceMax: 0.91,
      includeUnscored: true,
    },
    hideDerivedSegments: false,
  });
  assert.equal(ui.filterEditorSegments([
    {
      id: -91,
      reviewState: "approved",
      sourceKey: "ext:ai.tagging",
      confidence: 0.905,
      isDerived: true,
    },
  ], [{ segmentId: -91, performerId: 8 }], visibility.filters, visibility.hideDerivedSegments).length, 1);
  assert.match(editor, /const pendingDuplicateRef = useRef\(null\)/);
  assert.match(editor, /pendingDuplicateRef\.current\?\.operationKey === operationKey/);
  assert.match(editor, /pendingDuplicateRef\.current = \{ operationKey, duplicateIdentity \}/);
  assert.match(editor, /setSelectedSegmentIds\(\[duplicatedSegment\.id\]\)/);
  assert.match(editor, /selectionAnchorIdRef\.current = duplicatedSegment\.id/);
  assert.match(editor, /selectionRangeBaseIdsRef\.current = \[\]/);
  assert.match(editor, /Duplicate created, but the editor could not refresh it; repeat the duplicate shortcut to retry selection\./);
  assert.match(editor, /setTagEditing\(true\)/);
  assert.match(editor, /\[tagEditing, selectedSegmentId\]/);
});

test("empty videos choose a tag before creating their first swimlane", () => {
  assert.deepEqual(ui.resolveSegmentCreationAction([], null), { kind: "choose-tag" });
  assert.deepEqual(
    ui.resolveSegmentCreationAction([{ id: 1, tagId: 12 }], { id: 1, tagId: 12 }),
    { kind: "create", tagId: 12, openTagEditor: true },
  );
  assert.deepEqual(
    ui.resolveSegmentCreationAction([], null, 18),
    { kind: "create", tagId: 18, openTagEditor: false },
  );
  assert.deepEqual(
    ui.resolveSegmentCreationAction([{ id: 1, tagId: 12 }], null),
    { kind: "invalid-selection" },
  );

  const firstSegmentDialog = source.slice(
    source.indexOf("function FirstSegmentTagDialog"),
    source.indexOf("function EditorFiltersDialog"),
  );
  const editor = source.slice(source.indexOf("function SegmentEditor"), source.indexOf("const DISCOVERY_URL_OPTIONS"));
  assert.match(firstSegmentDialog, /Choose a tag for the first segment/);
  assert.match(firstSegmentDialog, /EntityReferenceSelector/);
  assert.match(firstSegmentDialog, /role: "dialog"/);
  assert.match(firstSegmentDialog, /onKeyDownCapture: trapModalFocus/);
  assert.match(editor, /firstSegmentTagOpen \? h\(FirstSegmentTagDialog/);
  assert.match(editor, /onSelect: \(tagId\) => createSegment\(tagId\)/);
  assert.match(editor, /if \(creation\.kind === "choose-tag"\)/);
  assert.match(editor, /pendingFirstSegmentStartSecRef\.current = startSec/);
  assert.match(editor, /Number\.isFinite\(pendingStartSec\) \? pendingStartSec : currentTime/);
  assert.match(editor, /if \(creation\.openTagEditor\)\s*pendingTagEditSegmentIdRef\.current = createdSegment\.id/);
});

test("Enter accepts an unchanged tag only when autocomplete and IME are idle", () => {
  const input = {
    value: "Alpha",
    getAttribute: () => null,
  };
  const currentTarget = {
    querySelector: (selector) => selector === "input" ? input : null,
  };
  const event = { key: "Enter", currentTarget, defaultPrevented: false, isComposing: false, keyCode: 13 };
  assert.equal(ui.shouldAcceptCurrentTagFromEnter(event, "Alpha"), true);
  assert.equal(ui.shouldAcceptCurrentTagFromEnter({ ...event, isComposing: true }, "Alpha"), false);
  assert.equal(ui.shouldAcceptCurrentTagFromEnter({ ...event, defaultPrevented: true }, "Alpha"), false);
  input.getAttribute = (name) => name === "aria-activedescendant" ? "tag-option-2" : null;
  assert.equal(ui.shouldAcceptCurrentTagFromEnter(event, "Alpha"), false);
  input.getAttribute = () => null;
  input.value = "Beta";
  assert.equal(ui.shouldAcceptCurrentTagFromEnter(event, "Alpha"), false);
});

test("editor mode exposes the complete recycling-bin workflow", () => {
  const move = source.slice(source.indexOf("async function moveToBin"), source.indexOf("async function loadLineage"));
  const bin = source.slice(source.indexOf("function SegmentStudioBinPage"), source.indexOf("function reviewStateLabel"));
  assert.match(source, /\/move-to-bin/);
  assert.match(move, /selectedSegments/);
  assert.match(move, /segments\/move-to-bin/);
  assert.match(move, /notifyRecyclingBinChanged\(\)/);
  assert.doesNotMatch(move, /window\.confirm\("Move/);
  assert.match(source, /\/bin\/\$\{item\.itemId\}\/restore/);
  assert.match(source, /\/bin\/empty/);
  assert.match(bin, /Empty recycling bin/);
  assert.match(bin, /confirmEmptyRecyclingBin/);
  assert.match(source, /window\.confirm\(recyclingBinDeletionPrompt/);
  assert.match(bin, /system\.emptyBin/);
  assert.match(bin, /const overrides = readShortcutBindingOverrides\(\)/);
  assert.match(bin, /shouldHandleEditorShortcut\(event, ownerDocument, false, overrides\)/);
  assert.match(bin, /findEditorShortcut\(event, false, overrides\)/);
  assert.ok((bin.match(/notifyRecyclingBinChanged\(\)/g) || []).length >= 2);
  assert.deepEqual(
    ui.recyclingBinDeletionSummary([
      { videoId: 10 },
      { videoId: 10 },
      { videoId: 20 },
    ], 3),
    { sceneCount: 2, segmentCount: 3 },
  );
  assert.equal(
    ui.recyclingBinDeletionPrompt([{ videoId: 10 }, { videoId: 10 }], 2),
    "Permanently delete 2 segments from 1 scene in the recycling bin? This cannot be undone.",
  );
  assert.match(source, /native ID/);
  assert.match(source, /Recycling bin/);
  assert.match(source, /segment-studio\.operations\.v1/);
  assert.match(source, /operationIdFor\(operationKey\)/);
  assert.match(source, /completeOperation\(operationKey\)/);
  assert.match(source, /operationDiscardsMissingImage\(operationKey\)/);
  assert.match(source, /rememberMissingImageDiscard\(operationKey\)/);
  assert.match(source, /error\.payload\?\.code !== "missing-image"/);
  assert.match(source, /discardMissingImage/);
});

test("Basic recycling errors preserve the fitted editor and only stale conflicts reload", () => {
  assert.match(source, /const splitLayout = useSplitEditorLayout\(\);/);
  assert.doesNotMatch(source, /useSplitEditorLayout\(\) && !error/);
  const move = source.slice(
    source.indexOf("async function moveToBin"),
    source.indexOf("async function applySegmentHistoryState"),
  );
  assert.match(move, /CANONICAL_SEGMENT_CHANGED/);
  assert.match(move, /setSaveMessage\(error\.message/);
  assert.match(source, /const canMoveSelectionToBin = !compatibilityMode/);
  assert.match(source, /selectedSegments\.every\(\(segment\) => segment\.nativeSegmentId != null/);
});

test("editor tag selection uses Cove's single autocomplete control", () => {
  const editor = source.slice(source.indexOf("function SegmentActiveEditor"), source.indexOf("const DISCOVERY_SORT_OPTIONS"));
  assert.match(editor, /placeholder: "Find a tag…"/);
  assert.match(editor, /h\(EntityReferenceSelector/);
  assert.match(editor, /entityType: "tag"/);
  assert.match(editor, /selectedDisplay: "input"/);
  assert.match(editor, /creatable: false/);
  assert.match(editor, /allowCreate: false/);
  const tagEditor = editor.slice(editor.indexOf('key: "tag-editor"'), editor.indexOf('key: "selected"'));
  assert.doesNotMatch(tagEditor, /h\("select"/);
});
