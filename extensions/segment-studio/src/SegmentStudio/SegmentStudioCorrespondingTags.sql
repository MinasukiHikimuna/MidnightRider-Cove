ALTER TABLE segment_studio_analysis_candidates
    ADD COLUMN source_tag_id integer;

UPDATE segment_studio_analysis_candidates AS candidate
SET source_tag_id = source_tag.id
FROM (
    SELECT MIN("Id") AS id, LOWER(BTRIM("Name")) AS normalized_name
    FROM tags
    GROUP BY LOWER(BTRIM("Name"))
    HAVING COUNT(*) = 1
) AS source_tag
WHERE LOWER(BTRIM(candidate.tag_name)) = source_tag.normalized_name;

CREATE INDEX "IX_segment_studio_analysis_candidates_source_tag_id"
    ON segment_studio_analysis_candidates (source_tag_id);

ALTER TABLE segment_studio_analysis_candidates
    ADD CONSTRAINT "FK_segment_studio_analysis_candidates_source_tags"
    FOREIGN KEY (source_tag_id) REFERENCES tags("Id") ON DELETE SET NULL;

CREATE TABLE segment_studio_corresponding_tag_mappings (
    source_tag_id integer NOT NULL,
    corresponding_tag_id integer NOT NULL,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    CONSTRAINT "PK_segment_studio_corresponding_tag_mappings"
        PRIMARY KEY (source_tag_id),
    CONSTRAINT "CK_segment_studio_corresponding_tag_mappings_distinct_tags"
        CHECK (source_tag_id <> corresponding_tag_id),
    CONSTRAINT "FK_segment_studio_corresponding_tag_mappings_source_tags"
        FOREIGN KEY (source_tag_id) REFERENCES tags("Id") ON DELETE CASCADE,
    CONSTRAINT "FK_segment_studio_corresponding_tag_mappings_corresponding_tags"
        FOREIGN KEY (corresponding_tag_id) REFERENCES tags("Id") ON DELETE CASCADE
);

CREATE INDEX "IX_segment_studio_corresponding_tag_mappings_corresponding_tag_id"
    ON segment_studio_corresponding_tag_mappings (corresponding_tag_id);
