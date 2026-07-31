import { groupSegmentsIntoSwimlanes, revealCollapsedSegmentGroup, segmentGroupKeyForSegment } from "../model/swimlanes.js";
import { normalizeEditorSegmentFilters, selectAllVideoSegmentIds, updateAnchoredSegmentSelection, updateSegmentCollectionSelection } from "../model/selection.js";

function createSelectionActions(context) {
  const { allSwimlanes, editorRef, performerSlots, seekRef, segmentGroups, segments, selectedSegmentId, selectedSegmentIds, selectionAnchorIdRef, selectionRangeBaseIdsRef, setCollapsedSegmentGroups, setEditorFilters, setHideDerivedSegments, setSaveMessage, setSelectedSegmentGroupKey, setSelectedSegmentId, setSelectedSegmentIds } = context;

  function revealSegmentGroupForSelection(segmentId) {
      const groupKey = segmentGroupKeyForSegment(allSwimlanes, segmentId);
      if (!groupKey) return;
      setCollapsedSegmentGroups((current) => revealCollapsedSegmentGroup(current, groupKey));
    }

    function replaceSegmentSelection(segmentId) {
      setSelectedSegmentId(segmentId);
      setSelectedSegmentIds(segmentId == null ? [] : [segmentId]);
      selectionAnchorIdRef.current = segmentId;
      selectionRangeBaseIdsRef.current = [];
    }

    function selectSegment(segment, {
      focusEditor = false,
      seekToSegment = false,
      additive = false,
      rangeSegmentIds = null,
    } = {}) {
      const next = updateAnchoredSegmentSelection({
        selectedSegmentIds,
        activeSegmentId: selectedSegmentId,
        anchorSegmentId: selectionAnchorIdRef.current,
        rangeBaseSegmentIds: selectionRangeBaseIdsRef.current,
      }, segment.id, rangeSegmentIds, additive);
      setSelectedSegmentIds(next.selectedSegmentIds);
      setSelectedSegmentId(next.activeSegmentId);
      selectionAnchorIdRef.current = next.anchorSegmentId;
      selectionRangeBaseIdsRef.current = next.rangeBaseSegmentIds;
      if (next.activeSegmentId != null)
        setSelectedSegmentGroupKey(segmentGroupKeyForSegment(allSwimlanes, next.activeSegmentId));
      revealSegmentGroupForSelection(segment.id);
      if (focusEditor) editorRef.current?.focus({ preventScroll: true });
      if (seekToSegment) seekRef.current?.(segment.startSec, false);
    }

    function selectSegmentCollection(segmentIds) {
      const next = updateSegmentCollectionSelection(
        selectedSegmentIds,
        selectedSegmentId,
        segmentIds,
      );
      setSelectedSegmentIds(next.selectedSegmentIds);
      setSelectedSegmentId(next.activeSegmentId);
      selectionAnchorIdRef.current = next.activeSegmentId;
      selectionRangeBaseIdsRef.current = [];
      if (next.activeSegmentId != null) {
        setSelectedSegmentGroupKey(segmentGroupKeyForSegment(allSwimlanes, next.activeSegmentId));
        revealSegmentGroupForSelection(next.activeSegmentId);
      }
    }

    function selectAllVideoSegments() {
      const segmentIds = selectAllVideoSegmentIds(segments);
      const activeSegmentId = segmentIds.includes(selectedSegmentId)
        ? selectedSegmentId
        : segmentIds[0] ?? null;
      setEditorFilters(normalizeEditorSegmentFilters({}));
      setHideDerivedSegments(false);
      setSelectedSegmentIds(segmentIds);
      setSelectedSegmentId(activeSegmentId);
      selectionAnchorIdRef.current = activeSegmentId;
      selectionRangeBaseIdsRef.current = [];
      if (activeSegmentId != null)
        setSelectedSegmentGroupKey(segmentGroupKeyForSegment(
          groupSegmentsIntoSwimlanes(segments, segmentGroups, performerSlots),
          activeSegmentId,
        ));
      setSaveMessage(segmentIds.length === 0
        ? "There are no segments to select."
        : `${segmentIds.length} segments selected. Collapsed Segment groups keep their selected segments.`);
      editorRef.current?.focus({ preventScroll: true });
    }

  return { revealSegmentGroupForSelection, replaceSegmentSelection, selectSegment, selectSegmentCollection, selectAllVideoSegments };
}

export { createSelectionActions };
