import { TagBadge } from "@cove/runtime/components";
import type { TagInfo } from "./api";

/**
 * One tag as Cove's video page shows it: Cove's tag badge, coloured by the tag or its group and
 * marked with the group's dot, without navigation (the review never leaves the page from a tag).
 * A tag still loading or unreadable shows the given placeholder name in a plain badge.
 */
export function ReviewTagBadge({ tag, name }: { tag?: TagInfo | null; name?: string }) {
  return <TagBadge name={tag?.name ?? name ?? ""} tag={tag ?? undefined} />;
}
