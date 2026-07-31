# Segment Studio lineage and provenance

Segment Studio Full mode shows where a segment came from and how derived
segments relate to it. Select a segment in the editor to view its provenance
source, analysis run, model/version, confidence, and derivation lineage.

Derived tags are read-only because their tag is defined by the derivation rule.
Change the root tag instead; Segment Studio previews every affected segment
before applying the change. Permanent deletion previews the selected segments
and any dependent derived segments that would lose their last source. Shared
derived segments remain when another source still supports them. Every deletion
requires confirmation, with typed confirmation for ten or more segments.

Settings → Derivation shows rules grouped by Segment group in graph and list
views. A rule either exists or it does not; there is no disabled or historical
state. Editing a rule first previews and confirms removal of its current
materializations. Deleting a rule always previews and confirms the derived
segments that will also be deleted. A shared derived segment is retained when
another rule still supports it.

After creating a rule, Segment Studio offers to materialize every pending
derivation in one step. This is optional: a rule can exist before its derived
segments are materialized.

Lineage scanning, rollout controls, provenance ingestion, and repair remain
administrator operations through the maintenance API. They are intentionally
not mixed into the rule-management view.
