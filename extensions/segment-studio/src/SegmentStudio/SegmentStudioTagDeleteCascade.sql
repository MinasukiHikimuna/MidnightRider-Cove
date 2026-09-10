-- Run rule lifecycle cleanup while every derivation edge is still present. An
-- AFTER DELETE FK cascade on tags alone has no ordering guarantee between rules,
-- edges, and items, and can otherwise leave unsupported derived items behind.
CREATE OR REPLACE FUNCTION segment_studio_delete_tag_rules()
RETURNS trigger
LANGUAGE plpgsql
AS $function$
BEGIN
    DELETE FROM segment_studio_derivation_rules
    WHERE source_tag_id = OLD."Id" OR derived_tag_id = OLD."Id";
    RETURN OLD;
END;
$function$;

CREATE TRIGGER segment_studio_tags_delete_rules
BEFORE DELETE ON tags
FOR EACH ROW EXECUTE FUNCTION segment_studio_delete_tag_rules();

ALTER TABLE segment_studio_items
    DROP CONSTRAINT "FK_segment_studio_items_tags",
    ADD CONSTRAINT "FK_segment_studio_items_tags"
        FOREIGN KEY (tag_id) REFERENCES tags("Id") ON DELETE CASCADE;

ALTER TABLE segment_studio_native_recycle_bin
    DROP CONSTRAINT "FK_segment_studio_native_bin_tags",
    ADD CONSTRAINT "FK_segment_studio_native_bin_tags"
        FOREIGN KEY (tag_id) REFERENCES tags("Id") ON DELETE CASCADE;

ALTER TABLE segment_studio_derivation_rules
    DROP CONSTRAINT "FK_segment_studio_derivation_rules_source_tag",
    DROP CONSTRAINT "FK_segment_studio_derivation_rules_derived_tag",
    ADD CONSTRAINT "FK_segment_studio_derivation_rules_source_tag"
        FOREIGN KEY (source_tag_id) REFERENCES tags("Id") ON DELETE CASCADE,
    ADD CONSTRAINT "FK_segment_studio_derivation_rules_derived_tag"
        FOREIGN KEY (derived_tag_id) REFERENCES tags("Id") ON DELETE CASCADE;

ALTER TABLE segment_studio_derivation_edges
    DROP CONSTRAINT "FK_segment_studio_derivation_edges_source_tag",
    DROP CONSTRAINT "FK_segment_studio_derivation_edges_derived_tag",
    ADD CONSTRAINT "FK_segment_studio_derivation_edges_source_tag"
        FOREIGN KEY (source_tag_id_at_creation) REFERENCES tags("Id") ON DELETE CASCADE,
    ADD CONSTRAINT "FK_segment_studio_derivation_edges_derived_tag"
        FOREIGN KEY (derived_tag_id_at_creation) REFERENCES tags("Id") ON DELETE CASCADE;

ALTER TABLE segment_studio_slot_definition_sets
    DROP CONSTRAINT "FK_segment_studio_slot_definition_sets_tags",
    ADD CONSTRAINT "FK_segment_studio_slot_definition_sets_tags"
        FOREIGN KEY (tag_id) REFERENCES tags("Id") ON DELETE CASCADE;

-- Each feedback example must reference exactly one representation, so it cannot
-- survive deletion of that item or recycle-bin entry with a null reference.
ALTER TABLE segment_studio_incorrect_examples
    DROP CONSTRAINT "FK_segment_studio_incorrect_examples_items",
    DROP CONSTRAINT "FK_segment_studio_incorrect_examples_native_bin",
    ADD CONSTRAINT "FK_segment_studio_incorrect_examples_items"
        FOREIGN KEY (item_id) REFERENCES segment_studio_items(id) ON DELETE CASCADE,
    ADD CONSTRAINT "FK_segment_studio_incorrect_examples_native_bin"
        FOREIGN KEY (native_bin_entry_id) REFERENCES segment_studio_native_recycle_bin(id) ON DELETE CASCADE;
