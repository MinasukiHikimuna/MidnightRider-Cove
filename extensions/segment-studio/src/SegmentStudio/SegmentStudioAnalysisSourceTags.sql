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
