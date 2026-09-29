import { useEffect, useState } from "react";
import { request } from "./api";
import type { ProfileTag } from "./attention";

/**
 * Performers' profile tags for their flags (attention.ts), read at most once per performer for the
 * page's session: the item column needs the flags of the performer on screen, and moving between
 * that performer's items must not read their profile again. A read that fails, or is abandoned
 * before it answers, is not remembered, so the performer is read again next time. A fresh read
 * elsewhere (the focused performer's) replaces what is kept.
 */
const profiles = new Map<number, ProfileTag[]>();

function tagsOf(value: unknown): ProfileTag[] {
  if (!Array.isArray(value)) return [];
  return value.flatMap((tag) =>
    tag && Number.isSafeInteger(tag.id) && typeof tag.name === "string"
      ? [{ id: tag.id as number, name: tag.name as string }]
      : [],
  );
}

/** Keep a performer's profile tags as a read just returned them. */
export function rememberProfile(performerId: number, tags: unknown): ProfileTag[] {
  const kept = tagsOf(tags);
  profiles.set(performerId, kept);
  return kept;
}

/** The profile tags kept for a performer, if any. */
export function cachedProfile(performerId: number): ProfileTag[] | undefined {
  return profiles.get(performerId);
}

/** Forget every kept profile (tests). */
export function clearProfiles() {
  profiles.clear();
}

/**
 * The profile tags of this performer: kept ones at once, otherwise one read, aborted when the
 * performer changes or the view goes. Undefined while unknown; null asks for nothing.
 */
export function usePerformerProfile(performerId: number | null): ProfileTag[] | undefined {
  const [read, setRead] = useState<{ id: number; tags: ProfileTag[] } | null>(null);
  useEffect(() => {
    if (performerId === null || profiles.has(performerId)) return;
    const abort = new AbortController();
    request<{ tags?: unknown }>(`/api/performers/${performerId}`, { signal: abort.signal }).then(
      (performer) => {
        const tags = rememberProfile(performerId, performer?.tags);
        if (!abort.signal.aborted) setRead({ id: performerId, tags });
      },
      () => {
        // Not kept: the performer is read again when shown next.
      },
    );
    return () => abort.abort();
  }, [performerId]);
  if (performerId === null) return undefined;
  return profiles.get(performerId) ?? (read?.id === performerId ? read.tags : undefined);
}
