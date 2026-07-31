# Segment Studio future work

This file records intentionally deferred product work. Items here are not part
of the current native-segment import implementation.

## Audio segment support

Plan Segment Studio 1.1 around extension-owned audio segments rather than
waiting for Cove's native segment surfaces to support audio. Segment Studio
will own audio-segment storage, discovery, editing, deep links, inventory, and
bounded playback. Native Cove publication remains a later, explicit ownership
transition after the extension implementation proves the required contracts.

The detailed design, release boundary, implementation slices, and native
adoption path are recorded in
[Segment Studio-Owned Audio Segments Plan](audio-segment-support-plan.md).

## Analysis controls

- Let users remove all shot boundaries from a video.
- Let users run shot-boundary analysis without AI analysis.
- Let users run AI analysis without shot-boundary analysis.
- Build analysis options from the capabilities and models reported by the
  Segment Studio analysis service catalog.
- Hide **Full Scan** in Basic mode. Basic mode should use Cove's native
  **Run AI** action instead.

These items should converge on one analysis dialog in Full mode. The dialog
should present currently available service capabilities, make each analysis
kind independently selectable, and distinguish running analysis from the
destructive action that clears existing shot boundaries.

## Native import performance

- Profile and batch native-segment imports. Importing several hundred segments
  currently performs provenance ingestion, anchor lookup and persistence, and
  review transitions one segment at a time. A 577-segment import has taken
  about a minute in development.
- Preserve the current all-or-nothing transaction, provenance equivalence,
  idempotency, and missing-image behavior while replacing the per-segment
  database and service calls with bounded bulk operations.

## Routing

- Make the direct `/segment-studio/segments` URL resolve through the same slug
  handling as in-app Segments navigation. Hard-loading or refreshing that URL
  must not fall back to the Videos page.
