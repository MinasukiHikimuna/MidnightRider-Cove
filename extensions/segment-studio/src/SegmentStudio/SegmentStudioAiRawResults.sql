-- The per-frame tag predictions an AI run returned, kept so they can be compared
-- with the segments a reviewer published. Candidates keep only spans above
-- Segment Studio's review floor, merged across frames, so they cannot answer
-- what the model predicted at a lower floor or frame by frame.
--
-- One row per Segment Studio analysis run, which is one per (AI run, video).
-- The legacy `result` column of segment_studio_analysis_runs holds an older
-- aggregated shape and is deliberately not reused.
CREATE TABLE segment_studio_ai_raw_results (
    run_id uuid NOT NULL,
    video_id integer NOT NULL,
    ai_run_id text NOT NULL,
    -- The threshold the AI run requested from the server; NULL when the request
    -- did not name one and the server applied a default nobody recorded.
    threshold double precision,
    frame_interval_seconds double precision,
    duration_seconds double precision,
    frame_count integer NOT NULL,
    models jsonb NOT NULL,
    schema_version integer NOT NULL,
    payload jsonb NOT NULL,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    CONSTRAINT segment_studio_ai_raw_results_pkey PRIMARY KEY (run_id),
    CONSTRAINT "FK_segment_studio_ai_raw_results_runs"
        FOREIGN KEY (run_id) REFERENCES segment_studio_analysis_runs(id) ON DELETE CASCADE,
    CONSTRAINT "CK_segment_studio_ai_raw_results_frame_count" CHECK (frame_count >= 0),
    CONSTRAINT "CK_segment_studio_ai_raw_results_schema_version" CHECK (schema_version > 0)
);

CREATE INDEX "IX_segment_studio_ai_raw_results_video_id_created_at"
    ON segment_studio_ai_raw_results USING btree (video_id, created_at);
