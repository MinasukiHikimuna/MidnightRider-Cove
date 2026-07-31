# Extension-Owned Segment Semantics Plan

## Status

Design proposal only. This document does not authorize or include implementation.

## Decision summary

Cove should support two namespaced, extension-owned segment capabilities:

1. **Filter predicates** decide whether an authorized raw segment participates in a query or profile.
2. **Grouping facets** supply an opaque semantic identity and an optional display label used while a display profile derives spans.

The canonical `Segment` remains unaware of which extensions have attached data. Extensions keep their state in extension-owned tables, views, or payload namespaces keyed by canonical segment ID. A saved filter or display-profile rule explicitly references an extension contribution by `{ extensionId, contributionId }`; Cove resolves only the requested contribution through the enabled owning extension.

The first intended consumer is Segment Studio:

- review-state predicates such as approved, rejected, and unreviewed;
- performer-slot predicates such as a particular performer occupying a particular slot;
- a performer-slot grouping facet that keeps overlapping activities with different participant assignments separate while still allowing fragments with the same assignment to merge.

This must remain generic. Cove must not add canonical review-state fields or hardcode slot names such as `giver` and `receiver`.

## Maintainer summary

Cove can currently filter, hide, color, and merge segments only using canonical fields it understands, so an extension can attach richer semantics—such as review state, participant roles, workflow status, provenance, or another domain-specific identity—but display profiles cannot use that information to decide which raw segments are eligible, which belong together, or what they should be called. Generic extension-contributed predicates and grouping facets would let profiles consume stable, opaque extension semantics without adding every extension's concepts to Cove core: Segment Studio could distinguish overlapping activities by performer slots, while other extensions could group by speaker, chapter, source event, detection track, annotation author, model run, or another extension-owned identity. Cove would continue to own authorization, profile rules, merging, caching, and presentation; extensions would supply only the missing predicate or semantic identity.

## Problem statement

### What works today

- Canonical raw segments are the source of truth.
- Display profiles decide visibility, confidence and duration thresholds, color, lane, collapse behavior, and merge gap.
- The span resolver buckets compatible raw segments and merges overlapping or nearby members.
- The Segments page supports separate derived-span and raw-segment views.
- Saved Segments filters already retain the selected display-profile ID as a UI option.
- Segment Studio stores review state in its own payload namespace and exposes an indexed extension-owned review projection.

### What is not possible today

- A profile cannot exclude a segment because an owning extension considers it rejected.
- A Segments query cannot execute a namespaced Segment Studio review-state or performer-slot predicate through Cove's normal filter machinery.
- The span resolver cannot distinguish two otherwise identical overlapping segments using extension-owned participant assignments.
- Cove cannot ask an extension for a stable semantic grouping identity or generated label.
- A saved filter that contains an extension-owned segment criterion cannot be executed consistently across all consumers.
- Extension-table mutations cannot currently participate in all relevant span and exact-count cache keys.

### Concrete motivating case

Two overlapping raw segments may have the same tag, source, kind, lane, and merge settings but describe different participant assignments. Cove currently places them in the same bucket and may merge them. Segment Studio can distinguish them using performer slots, for example:

```text
Activity — Performer A and Performer B
Activity — Performer C and Performer B
```

Those should normally remain separate. Several short fragments with the same activity and the same participant assignments should still be eligible for normal profile merging.

## Relevant prior work

### Extension-owned tag filters

The `codex/animated-tags` branch demonstrates the desired ownership boundary for filtering:

- an extension declares a typed filter with a namespaced backend filter ID;
- Cove validates the owner, entity type, modifier, and value;
- Cove supplies only host-authorized candidate IDs;
- the extension returns a subset of those IDs and a stable revision;
- Cove retains composition, ordering, counts, pagination, and saved-filter behavior;
- unavailable saved criteria remain visible instead of being silently discarded.

The declaration and saved-filter envelope are suitable precedents. Its initial execution bounds are not directly suitable for Segments: it supports only Tags, limits a query to 5,000 candidates, accepts only simple scalar values, and deals only with concrete integer entity IDs rather than resolved spans containing multiple raw segment IDs.

### Preserve-individual profile investigation

The `codex/investigate-segment-profiles` branch currently contains an opt-in profile-level `MergeOverlaps` versus `PreserveIndividual` mode. That work proves that one-to-one spans need segment-based keys and that overlapping or duplicate raw segments require explicit handling.

This plan does **not** adopt a profile-wide resolution mode initially. It is broader than the motivating need and adds permanent schema, API, and UI policy. Semantic grouping should be tried first. A strict one-to-one escape hatch remains a deferred option if real use demonstrates that semantic identity is insufficient.

### Title-aware grouping

Adding raw segment title to the grouping bucket would prevent differently titled segments from merging, but a display title is not a durable identity:

- performer names can change;
- formatting can change;
- equal or empty titles can still collide;
- an extension-generated title may overwrite an explicit canonical title;
- using names in resolved-span keys creates unnecessary key churn.

The grouping facet therefore separates a stable opaque key from its user-facing label. A title-aware bucket may still be useful as a built-in refinement, but it is not the extension contract.

## Design principles

1. **Extension ownership:** extension semantics and data remain extension-owned.
2. **Canonical neutrality:** Cove does not learn the meaning of review states or performer slots.
3. **Explicit use:** a filter or profile rule selects a contribution; Cove does not probe every extension for every segment.
4. **Stable identity:** grouping keys use stable IDs and slot keys, never mutable display names.
5. **Host authority:** Cove retains authorization, profile selection, rule matching, merge mechanics, ordering, paging, and counts.
6. **No silent semantic changes:** unavailable contributions must not quietly collapse or expose different spans.
7. **Batch execution:** providers operate on bounded batches of already-authorized raw segment IDs.
8. **Cache correctness:** extension revisions or explicit invalidation participate in every affected cache.
9. **Backward compatibility:** profiles without extension contributions retain existing results and keys.

## Conceptual model

### The Segment does not enumerate extensions

A canonical segment has only its canonical ID and fields. Extensions associate their own rows or projections with that ID. For example:

```text
segment_studio_segment_slots
  segment_id   | slot_key | performer_id
  -------------+----------+----------------
  <segment-id> | giver    | <performer-a-id>
  <segment-id> | receiver | <performer-b-id>
```

A display-profile rule may reference:

```json
{
  "extensionId": "segment-studio",
  "facetId": "performer-slots"
}
```

Cove batches the authorized segment IDs governed by that rule and asks only the declared owning provider. A missing mapping means the facet does not apply to that segment; it does not mean Cove should inspect other extensions.

### Filter predicate

A filter predicate returns membership for candidate raw segment IDs.

Example declaration:

```json
{
  "entityType": "segments",
  "filterId": "review-state",
  "label": "Segment Studio review state",
  "criterionType": "enum",
  "options": ["unreviewed", "approved", "rejected"]
}
```

Example saved criterion:

```json
{
  "extensionId": "segment-studio",
  "filterId": "review-state",
  "modifier": "equals",
  "value": "approved"
}
```

The host validates the declaration and request, supplies authorized IDs, and intersects the returned membership with the current candidate set.

### Grouping facet

A grouping facet returns a stable discriminator and optional display label for each applicable candidate segment.

Conceptual response:

```json
{
  "revision": "slot-state-184",
  "values": {
    "segment-id": {
      "key": "v1|giver:performer-a-id|receiver:performer-b-id",
      "label": "Activity — Performer A and Performer B"
    }
  }
}
```

The opaque key is namespaced by the host with the extension and facet IDs before it enters the span bucket or resolved-span identity. The label is presentation only.

For performer slots, the key must:

- use stable performer IDs;
- include stable slot keys;
- include all slots relevant to semantic identity, not only two hardcoded roles;
- sort slots deterministically;
- sort multi-valued set slots deterministically;
- distinguish role swaps even if the friendly label omits role names;
- carry an extension-controlled schema version.

## Profile integration

### Profile input criteria

A display profile may persist zero or more normalized extension criteria using the same namespaced envelope as Segments list filters. These are stable raw-input eligibility constraints for the profile, not a preservation or resolution mode. Initial composition can be an implicit intersection.

For example, a curated profile can include `review-state does-not-equal rejected`, while an approved-only profile can include `review-state equals approved`. Profiles with no extension criteria retain current eligibility behavior. This gives every consumer of the profile the same interpretation instead of requiring each surface to remember a matching ad hoc filter.

The profile-level criterion reference and the Segments-page criterion should share declaration, validation, provider execution, and unavailable-state behavior. They differ only in persistence and lifetime: the profile criterion defines the profile, while the list criterion asks a temporary or saved query question.

### Rule-level selection

The initial design should add at most one optional grouping-facet reference to a display-profile rule, not a profile-wide resolution mode. This allows a single profile to use different behavior for different rule scopes:

- ordinary merge behavior for AI detection fragments;
- Segment Studio performer-slot grouping for reviewed activity segments;
- ordinary behavior for unrelated segment sources.

Conceptually, the rule gains:

```text
GroupingFacetExtensionId: segment-studio
GroupingFacetId: performer-slots
```

The profile editor exposes a generic **Group compatible segments by** selector populated from enabled extension declarations. Cove stores only the namespaced reference.

### Eligibility and grouping are separate

A profile can use an extension predicate to decide which raw segments participate and a grouping facet to decide which participating segments may merge:

```text
Authorized raw segments
  -> built-in scope and input criteria
  -> extension-owned eligibility predicates
  -> profile visibility and thresholds
  -> extension-owned grouping facet
  -> Cove bucket construction and merge-gap behavior
  -> resolved spans
  -> span-level filtering, ordering, counts, and pagination
```

Examples:

- **Review:** include every review state; group by performer slots.
- **Curated:** exclude rejected; group by performer slots.
- **Approved playback:** include approved only; group by performer slots and merge fragments with the configured gap.
- **AI compact:** use canonical confidence and source rules; use normal Cove grouping.

An initial implementation does not need extension predicates to participate in rule specificity. Profile input criteria cover stable eligibility, while rule-level facet selection covers semantic grouping. Predicate-aware rule matching can be added later if a concrete profile needs different rule actions for different extension states within the same resolved result.

### Unavailable provider behavior

Cove must not silently omit a grouping discriminator and merge segments differently when an extension is disabled, missing, or unhealthy. The implementation must make the profile contribution visibly unavailable and choose an explicit failure policy. Preferred behavior is to make the affected profile unavailable with a clear error and allow the user to select another profile. A preserve-individually fallback is safer than merging but still changes keys and counts, so it should not be silent.

## Segments-page integration

### Saved filters and profiles

The Segments page already stores the active profile ID with saved-filter UI options. An extension criterion can therefore remain an ad hoc query while the saved preset remembers its display profile.

This distinction should remain visible:

- **Profile:** stable interpretation of raw segments, including eligibility, grouping, merging, lanes, and colors.
- **List filter:** the question being asked now, such as rejected segments or a particular performer in a slot.

The same underlying predicate may be referenced by both. A profile might exclude rejected segments globally, while a temporary filter using a review-oriented profile shows only rejected segments for quality control.

### Raw and derived surfaces

The UI must distinguish the canonical entity domain from the surface displaying it:

- `segment` is the canonical entity domain supplied to providers;
- `segments` is the profile-resolved span surface;
- `rawsegments` is the raw canonical segment surface.

Manifest contributions should declare the entity domain and supported filter surfaces explicitly rather than treating `rawsegment` as a separate entity type.

For resolved spans, extension predicates should filter raw inputs before merging to avoid ambiguous `any member` versus `all members` semantics. For the raw view, predicates must execute before count, ordering, and pagination; filtering only the returned page would produce incorrect pages and totals.

## Performer-slot filtering

The review-state enum maps directly onto the scalar filter contract demonstrated by animated tags. A slot-specific performer filter needs both a slot identity and a performer reference.

The simplest initial options are:

1. Contribute one performer-reference filter per stable slot, such as **Giver performer** and **Receiver performer**.
2. If slots are user-configurable, add a structured criterion schema containing `slotKey` and `performerId` rather than encoding both into a string.

The host should render performer selection using its built-in entity-reference selector. Segment Studio owns slot enumeration and matching semantics.

Useful initial predicates include:

- review state equals or does not equal a value;
- a specific slot contains a selected performer;
- a specific slot is filled or empty;
- any slot contains a selected performer;
- required slots are complete or incomplete.

## Provider lifecycle and security

The animated-tags provider boundary should be generalized rather than bypassed:

- declarations are owner-stamped by Cove;
- only enabled, declared providers may execute;
- the provider generation is pinned during a request;
- Cove supplies only segments already visible to the caller;
- providers may return only IDs present in the supplied batch;
- values, identifiers, result sizes, and execution time are bounded;
- cancellation propagates without allowing late provider failures to become unobserved;
- revisions remain stable across all batches of one criterion or facet evaluation.

Grouping-facet results require additional validation:

- every returned segment ID must belong to the batch;
- keys and labels must have bounded lengths;
- keys must be nonempty for applicable values;
- duplicate/conflicting entries are rejected;
- one revision must remain stable across batches.

## Query planning and scalability

The tag implementation's global 5,000-candidate ceiling must not be copied directly to Segments.

### Derived profile views

The span resolver already loads raw segments in video batches. It can resolve predicates and facets for those authorized raw IDs before constructing spans. This preserves early termination for common top-level browsing and avoids materializing every segment ID in the library for the first page.

### Raw segment view

The raw view currently relies on database-side count, ordering, and pagination. Extension membership must be applied before those operations. The implementation must choose a scalable strategy before enabling executable extension filters on that surface, such as:

- a host-owned namespaced extension entity index;
- a carefully constrained queryable membership projection;
- a streaming provider plan that can still produce correct counts and pages.

Application-side filtering after pagination is explicitly out of scope because it is incorrect.

### Multiple criteria

The initial provider composition may retain animated-tags-style intersection semantics. OR/grouped Boolean expressions and criteria that correlate multiple independently declared filters are deferred unless a concrete use case requires them. A structured slot criterion avoids incorrectly combining “has slot X” with “has performer Y somewhere” as two unrelated predicates.

## Expected Cove core scope

The minimum useful proof is a moderate, localized Cove change rather than an application-wide rewrite. The resolver is already the shared choke point for derived spans, so its consumers should not each need custom Segment Studio logic.

The grouping-facet and derived-filter proof is expected to touch roughly 10–15 production files across core entities and DTOs, extension contracts and lifecycle, the resolver, profile persistence/editor UI, and Segments criteria plumbing. It likely requires one small Cove migration and approximately 400–800 handwritten lines plus tests and generated migration output. That estimate fits two or three focused changes even though the end-to-end roadmap below is split more finely for review.

The scalable raw-segment pre-pagination mechanism is intentionally excluded from that estimate. Its cost depends on whether Cove chooses an extension membership index, a queryable projection, or another database-aware plan. The Segment Studio provider, slot projection, and UI are extension work rather than hardcoded Cove-core semantics.

## Cache and invalidation requirements

The selected profile version already participates in profile span caches. Extension-owned state adds another version dimension.

The design must cover:

- per-video resolved-span caches;
- derived-query caches;
- top-level exact span-count caches;
- saved-filter or dynamic-group result caches where applicable;
- profile-preview results.

Segment Studio already publishes the existing per-video span invalidation signal after canonical review edits. Slot mutations can publish the same signal. That is necessary but not sufficient for library-wide exact-count caches when slot state lives only in extension tables.

The provider contract should expose a cheap revision captured once per execution. A normalized contribution reference, criterion value, and provider revision can participate in cache keys. An explicit invalidation event may complement revisions for targeted eviction.

No cache may continue serving a grouping result after its slot assignment changed.

## Generated titles

Segment Studio may generate a friendly label from the canonical activity/tag and performer slots. Recommended precedence is:

1. An explicit user-authored title, if product semantics say it is authoritative.
2. The activity/tag label plus assigned performers in configured slot order.
3. The activity/tag label when no assignment exists.

The exact punctuation and name formatting are extension presentation policy. They do not enter the stable key. Performer renames should update labels without changing grouping identity or durable resolved-span references.

## Benefits to other extensions

The contract is intentionally broader than Segment Studio. Other extensions could contribute:

- transcript speaker identity so overlapping utterances from different speakers remain separate;
- detection track identity so repeated frames of the same object merge without combining different objects;
- editorial chapter or beat identity;
- sports event, player, or possession identity;
- source-event or import-record identity;
- annotation author or review-workflow state;
- model-run or provenance identity;
- camera, angle, or stream identity;
- language or subtitle-speaker identity.

The same extensions could expose those facts as list predicates without requiring Cove to add a canonical field for each domain.

## Non-goals for the initial implementation

- Adding `Segment.ReviewState` or canonical performer-slot columns.
- Hardcoding Segment Studio, giver, receiver, or activity-specific rules in Cove.
- Automatically executing every installed extension for every segment.
- Replacing Cove's display-profile or merge implementation.
- Introducing a profile-wide preserve-individual mode before semantic grouping is evaluated.
- Supporting arbitrary extension code inside database LINQ expressions.
- Filtering a paginated result after the page has already been selected.
- Guaranteeing OR/nested Boolean filter expressions in the first slice.

## Proposed implementation slices

### Slice 1: Core contract and lifecycle

- Generalize the owner-stamped executable-filter contract from Tags to the canonical Segment domain.
- Add a grouping-facet declaration and provider contract.
- Add runtime provider lookup, lifecycle pinning, batching, validation, deadlines, and revisions.
- Add contract and adversarial provider tests without changing profile behavior.

### Slice 2: Profile and rule persistence and editor

- Persist normalized namespaced input criteria on display profiles using the same criterion envelope as list filters.
- Add optional namespaced grouping-facet fields to `SegmentDisplayRule`.
- Add the migration, DTO/API mappings, profile-version bumping, and frontend types.
- Expose enabled predicate contributions in the profile editor's input criteria.
- Expose enabled grouping-facet contributions in the profile rule editor.
- Preserve existing profiles and results when no facet is configured.
- Preserve unavailable references and display a clear unavailable state.

### Slice 3: Resolver integration

- Evaluate persisted profile input criteria against authorized raw segments before rule matching and merging.
- Match profile rules before grouping-provider execution.
- Batch authorized raw segment IDs by requested facet.
- Add the namespaced opaque facet key to `SpanBucketKey` and resolved-span identity.
- Apply the facet label as resolved presentation without treating it as identity.
- Define explicit missing-entry and unavailable-provider behavior.
- Verify different slot assignments do not merge and identical assignments still follow `MergeGapSec`.

### Slice 4: Segment Studio provider

- Add or reuse an extension-owned indexed slot projection keyed by segment ID.
- Implement the performer-slot grouping facet using stable slot and performer IDs.
- Generate deterministic labels from current performer names.
- Publish span invalidation when assignments change.
- Add review-state and initial performer-slot filter declarations/providers.

### Slice 5: Segments-page filtering

- Store namespaced extension criteria in Segments saved filters.
- Execute raw-input predicates before derived profile resolution.
- Preserve and explain unavailable criteria.
- Include active criteria and provider revisions in search/count cache identity.
- Verify saved presets restore both criteria and selected profile.

### Slice 6: Cross-surface and scale verification

- Verify video segment panels, the top-level Segments view, span playback, profile preview, group span materialization, and other resolver consumers.
- Decide and implement a correct pre-pagination strategy before enabling executable extension filters in the raw-segment view.
- Integrate dynamic groups and other saved-filter consumers through a central executor rather than controller-specific copies.
- Benchmark realistic segment counts and provider batch sizes.

### Slice 7: External Marker Studio data migration

- Keep all migration tooling outside Cove and Segment Studio HTTP endpoints; the migration is a one-user operational script, not product surface.
- Treat the canonical segments that existed in Cove before the migration as already approved, matching the prior Marker Studio-to-Stash workflow.
- Import the remaining Marker Studio markers, mapping confirmed to approved, rejected to rejected, and unprocessed to unreviewed.
- Migrate performer-slot assignments and retained provenance through deterministic, fingerprinted plans and receipts.
- Require explicit reviewed dispositions for ambiguous scene, marker, tag, performer, or existing-segment collisions and fail closed on target drift.
- Make apply serializable and rerunnable without resetting the review states of previously imported markers.
- Verify post-migration counts, status totals, slot assignments, provenance, and receipt ownership before accepting the result.

## Acceptance criteria

- Existing profiles without extension contributions produce unchanged spans and keys.
- Cove contains no Segment Studio-specific review or slot semantics.
- A profile can persist a namespaced extension predicate as a raw-input eligibility criterion.
- A profile rule can explicitly select an enabled extension grouping facet.
- Two overlapping otherwise-compatible segments with different stable slot assignments do not merge.
- Fragments with the same stable slot assignment retain normal merge-gap behavior.
- Performer renames change the generated label without changing the stable grouping key.
- Slot changes invalidate every affected span and count cache.
- Review-state filters compose with built-in Segment filters and the selected display profile.
- Saved criteria survive an extension becoming unavailable and are never silently ignored.
- Providers never receive unauthorized segment IDs and cannot return IDs outside their candidate batch.
- Disabling or removing a grouping provider cannot silently change a profile's merge semantics.
- At least one test provider unrelated to Segment Studio demonstrates that the contract is generic.

## Open decisions

1. Should an unavailable grouping facet make the profile unavailable, return a resolution error, or use an explicit preserve-individually fallback with a visible warning?
2. Should the initial profile rule allow exactly one grouping facet or a deterministic ordered composition of several facets?
3. Are Segment Studio performer slots fixed enough for one reference filter per slot, or is a structured criterion editor required immediately?
4. What scalable membership mechanism should support extension predicates in the raw-segment view before database pagination?
5. Should provider revisions be sufficient for exact-count cache identity, or should Cove also expose targeted extension-owned span/count invalidation events?
6. How should extension input predicates interact with explicit union, intersection, and difference span queries?
7. After dogfooding semantic grouping, is any strict one-to-one preservation control still necessary, and if so should it be rule-level rather than profile-level?

## Recommended first decision

Start by proving the generic contract with one Segment Studio review-state predicate and one performer-slot grouping facet on derived profile views. Do not introduce profile-wide preservation or raw-view executable filtering in that first slice. This validates the ownership boundary and the motivating overlap case while keeping existing profile behavior unchanged and leaving the harder pagination and fallback policies visible rather than accidentally embedding them in the initial API.
