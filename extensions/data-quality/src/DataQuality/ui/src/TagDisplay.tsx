import { createContext, useContext, type ReactNode } from "react";
import { TagBadge } from "@cove/runtime/components";
import type { TagInfo } from "./api";

/**
 * Whether tag badges here leave out Cove's image preview on hover. Cove renders that preview in a
 * portal on the page's body, which a modal <dialog> (the browser's top layer) always covers: inside
 * one the preview would open unseen underneath.
 */
const WithoutImagePreview = createContext(false);

/** Tag badges inside a modal <dialog>: colours and group dots as everywhere, no image preview. */
export function WithoutTagImagePreviews({ children }: { children: ReactNode }) {
  return <WithoutImagePreview.Provider value>{children}</WithoutImagePreview.Provider>;
}

/**
 * One tag as Cove's video page shows it: Cove's tag badge, coloured by the tag or its group and
 * marked with the group's dot, without navigation (the review never leaves the page from a tag).
 * A tag still loading or unreadable shows the given placeholder name in a plain badge.
 */
export function ReviewTagBadge({ tag, name }: { tag?: TagInfo | null; name?: string }) {
  const withoutPreview = useContext(WithoutImagePreview);
  // Cove shows the image preview only for a badge that knows its tag's id.
  const shown =
    tag && withoutPreview ? { color: tag.color, tagGroupColor: tag.tagGroupColor } : tag;
  return <TagBadge name={tag?.name ?? name ?? ""} tag={shown ?? undefined} />;
}
