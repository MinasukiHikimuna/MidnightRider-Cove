import { Film, Headphones, Mic, Tag, Users } from "@cove/runtime/lucide-react";
import type { ReviewEntityType } from "./model";

export const REVIEW_ENTITY_LABELS: Record<ReviewEntityType, string> = {
  video: "Video review",
  audio: "Audio review",
  tag: "Tag review",
  performerOccurrence: "Performer occurrence review",
  audioPerformerOccurrence: "Audio performer occurrence review",
};

/** What a review of each kind reviews: the new-review form's choices and the reviews list's Type. */
export const REVIEW_KIND_NAMES: Record<ReviewEntityType, string> = {
  video: "Videos",
  audio: "Audios",
  tag: "Tags",
  performerOccurrence: "Performer occurrence tags",
  audioPerformerOccurrence: "Audio performer occurrence tags",
};

const ICONS = {
  video: Film,
  audio: Headphones,
  tag: Tag,
  performerOccurrence: Users,
  audioPerformerOccurrence: Mic,
} satisfies Record<ReviewEntityType, unknown>;

/** The icon for a review's kind, labelled for assistive technology. */
export function ReviewEntityIcon({ entityType }: { entityType: ReviewEntityType }) {
  const Icon = ICONS[entityType];
  return <Icon role="img" aria-label={REVIEW_ENTITY_LABELS[entityType]} />;
}
