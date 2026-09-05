-- Migrate the retired Segment Studio organization model to Cove tag groups.
-- Run with Cove stopped and a current database backup. The script is rerunnable.
-- Existing Cove tag assignments always win; only currently ungrouped tags move.

BEGIN;

SELECT pg_advisory_xact_lock(hashtext('segment-studio-native-tag-groups'));

DO $preflight$
BEGIN
    IF to_regclass('segment_studio_segment_groups') IS NULL
       OR to_regclass('segment_studio_segment_group_tags') IS NULL
    THEN
        RAISE EXCEPTION 'The Segment Studio group tables are missing';
    END IF;
    IF to_regclass('tag_groups') IS NULL OR to_regclass('tags') IS NULL THEN
        RAISE EXCEPTION 'The Cove tag-group tables are missing';
    END IF;
END
$preflight$;

DO $migration$
DECLARE
    created_group_count INTEGER;
    migrated_tag_count INTEGER;
    preserved_tag_count INTEGER;
BEGIN
    SELECT COUNT(*)
    INTO preserved_tag_count
    FROM segment_studio_segment_group_tags membership
    JOIN tags tag ON tag."Id" = membership.tag_id
    WHERE tag."TagGroupId" IS NOT NULL;

    WITH existing_max AS (
        SELECT COALESCE(MAX("SortOrder"), 0) AS sort_order
        FROM tag_groups
    ), missing_groups AS (
        SELECT source.name,
               ROW_NUMBER() OVER (ORDER BY source.sort_order, source.id) AS sequence
        FROM segment_studio_segment_groups source
        WHERE NOT EXISTS (
            SELECT 1
            FROM tag_groups native_group
            WHERE native_group."Name" = source.name
        )
    )
    INSERT INTO tag_groups (
        "Name", "Description", "Color", "SortOrder", "CreatedAt", "UpdatedAt")
    SELECT missing.name,
           NULL,
           NULL,
           existing_max.sort_order + (missing.sequence * 10)::integer,
           CURRENT_TIMESTAMP,
           CURRENT_TIMESTAMP
    FROM missing_groups missing
    CROSS JOIN existing_max
    ON CONFLICT ("Name") DO NOTHING;
    GET DIAGNOSTICS created_group_count = ROW_COUNT;

    UPDATE tags tag
    SET "TagGroupId" = native_group."Id",
        "UpdatedAt" = CURRENT_TIMESTAMP
    FROM segment_studio_segment_group_tags membership
    JOIN segment_studio_segment_groups source
      ON source.id = membership.segment_group_id
    JOIN tag_groups native_group
      ON native_group."Name" = source.name
    WHERE tag."Id" = membership.tag_id
      AND tag."TagGroupId" IS NULL;
    GET DIAGNOSTICS migrated_tag_count = ROW_COUNT;

    RAISE NOTICE 'Created % Cove tag groups; migrated % tags; preserved % existing native assignments',
        created_group_count, migrated_tag_count, preserved_tag_count;
END
$migration$;

COMMIT;
