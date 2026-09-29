-- Foreign-key actions look up child rows with a plain "column = $1" predicate.
-- The existing item indexes on video_id and tag_id are partial on
-- native_segment_id IS NULL, which that predicate cannot prove, and the other
-- columns had no leading-column index at all. Without these, deleting videos,
-- tags, or items scans each child table once per deleted parent row.
CREATE INDEX IF NOT EXISTS "IX_segment_studio_items_video_id"
    ON segment_studio_items USING btree (video_id);

CREATE INDEX IF NOT EXISTS "IX_segment_studio_items_tag_id"
    ON segment_studio_items USING btree (tag_id);

CREATE INDEX IF NOT EXISTS "IX_segment_studio_history_sessions_video_id"
    ON segment_studio_history_sessions USING btree (video_id);

CREATE INDEX IF NOT EXISTS "IX_segment_studio_segment_operations_item_id"
    ON segment_studio_segment_operations USING btree (item_id);

CREATE INDEX IF NOT EXISTS "IX_segment_studio_native_recycle_bin_tag_id"
    ON segment_studio_native_recycle_bin USING btree (tag_id);
