\set ON_ERROR_STOP on

-- Run once, with Cove stopped, after backing up an unpublished installation
-- that already applied every pre-release Segment Studio migration. The public
-- 1.0 package has one baseline receipt and no legacy workspace schema.
BEGIN;

SELECT pg_advisory_xact_lock(hashtext('segment-studio-migration-rebaseline'));
LOCK TABLE extension_migrations IN EXCLUSIVE MODE;

DO $rebaseline$
DECLARE
    expected TEXT[] := ARRAY[
        '001_create_workspaces',
        '002_create_provenance',
        '003_create_candidate_projection',
        '004_repair_candidate_projection',
        '005_align_projection_with_canonical_values',
        '006_use_canonical_segment_reviews',
        '007_create_segment_groups',
        '008_create_segment_group_operation_receipts',
        '009_import_canonical_segment_slots',
        '010_add_browse_indexes',
        '011_add_stable_segment_items',
        '012_add_installation_normalization_gate',
        '013_add_user_preferences',
        '014_add_segment_lineage_foundation',
        '015_track_external_lineage_deletions',
        '016_add_lineage_rollout_controls',
        '017_create_shot_boundaries',
        '018_create_incorrect_examples',
        '019_add_editor_history',
        '020_add_analysis_runs',
        '021_link_analysis_candidates_to_items',
        '022_allow_analysis_candidate_item_reuse',
        '023_index_marker_replacement_native_segment',
        '024_enforce_derivation_rule_integrity',
        '025_simplify_derivation_rule_lifecycle',
        '026_reconcile_rule_cleanup_side_effects',
        '027_remove_lineage_delete_policy',
        '028_require_owned_derived_segments',
        '029_separate_editor_history_by_mode',
        '030_add_native_recycle_bin',
        '031_preserve_native_bin_provenance',
        '032_authorize_basic_history_receipts',
        '033_remove_untrusted_basic_history',
        '034_expire_basic_history_receipts',
        '035_share_ai_feedback_and_zip_exports',
        '036_preserve_basic_feedback_anchors'
    ];
    actual TEXT[];
BEGIN
    SELECT array_agg(migration_name::TEXT ORDER BY migration_name)
    INTO actual
    FROM extension_migrations
    WHERE extension_id = 'segment-studio';

    IF actual IS DISTINCT FROM expected THEN
        RAISE EXCEPTION
            'Segment Studio receipts do not match the complete pre-release chain';
    END IF;

    IF to_regclass('segment_studio_items') IS NULL
       OR to_regclass('segment_studio_lineage_nodes') IS NULL
       OR to_regclass('segment_studio_training_export_frames') IS NULL
       OR to_regprocedure('segment_studio_delete_rule_derivations()') IS NULL
    THEN
        RAISE EXCEPTION
            'Segment Studio final schema objects are missing';
    END IF;

    IF EXISTS (SELECT 1 FROM segment_studio_workspaces)
       OR EXISTS (SELECT 1 FROM segment_studio_workspace_markers)
    THEN
        RAISE EXCEPTION
            'Legacy Segment Studio workspace tables are not empty';
    END IF;
END
$rebaseline$;

DROP VIEW IF EXISTS segment_studio_item_compatibility;
DROP TABLE segment_studio_workspace_markers;
DROP TABLE segment_studio_workspaces;

DELETE FROM extension_migrations
WHERE extension_id = 'segment-studio';

INSERT INTO extension_migrations (extension_id, migration_name)
VALUES ('segment-studio', '001_initial_schema');

COMMIT;
