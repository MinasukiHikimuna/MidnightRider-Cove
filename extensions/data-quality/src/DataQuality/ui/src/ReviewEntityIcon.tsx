import { Film, Headphones, Tags as TagsIcon } from "@cove/runtime/lucide-react";
import { mediaKindOf, type ReviewEntityType } from "./model";

export const REVIEW_ENTITY_LABELS: Record<ReviewEntityType, string> = {
  video: "Video review",
  audio: "Audio review",
  tag: "Tag review",
  performerOccurrence: "Performer occurrence review",
  audioPerformerOccurrence: "Audio performer occurrence review",
};

/** The icon for a review's kind, labelled for assistive technology. */
export function ReviewEntityIcon({ entityType }: { entityType: ReviewEntityType }) {
  const label = REVIEW_ENTITY_LABELS[entityType];
  if (entityType === "tag") return <TagsIcon role="img" aria-label={label} />;
  return mediaKindOf(entityType) === "audio" ? (
    <Headphones role="img" aria-label={label} />
  ) : (
    <Film role="img" aria-label={label} />
  );
}
