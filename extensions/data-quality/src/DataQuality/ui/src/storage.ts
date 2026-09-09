import { request } from "./api";
import { mergeReviews, parseReviews, type Review } from "./model";

const CONFIG_SCOPE = "ext:com.midnightrider.data-quality:configuration";
const IMPORT_SCOPE = "ext:cove-data-quality:video-reviews";
const PROGRESS_SCOPE = "ext:com.midnightrider.data-quality:progress";
interface RecordRow {
  id: number;
  uiOptions: string;
  name: string;
}
interface Configuration {
  version: 2;
  revision: string;
  reviews: Review[];
  deletedIds: string[];
  importedIds: string[];
}
interface Session {
  userId: string;
  recordId?: number;
  config: Configuration;
  readable: boolean;
  writable: boolean;
  durable: boolean;
}
const sessions = new Map<string, Session>();
const writes = new Map<string, Promise<unknown>>();
const has = (permissions: string[], value: string) =>
  permissions.includes("*") || permissions.includes(value);
const list = (scope: string) =>
  request<RecordRow[]>(`/api/savedfilters?mode=${encodeURIComponent(scope)}`);
const newConfig = (): Configuration => ({
  version: 2,
  revision: crypto.randomUUID(),
  reviews: [],
  deletedIds: [],
  importedIds: [],
});

function stringIds(value: unknown): string[] {
  if (!Array.isArray(value) || !value.every((id) => typeof id === "string"))
    throw new Error(
      "Review migration history is invalid. Existing data has been kept.",
    );
  return value;
}
function decode(raw: string): Configuration {
  const data = JSON.parse(raw);
  if (data?.version !== 2)
    throw new Error(
      "Unsupported Data Quality configuration version. Existing data has been kept.",
    );
  if (typeof data.revision !== "string")
    throw new Error(
      "Invalid configuration revision. Existing data has been kept.",
    );
  return {
    ...data,
    reviews: parseReviews(JSON.stringify(data.reviews)),
    deletedIds: stringIds(data.deletedIds),
    importedIds: stringIds(data.importedIds),
  };
}
function legacy(userId: string) {
  const keys = [
    `cove-data-quality-reviews-v1:${userId}`,
    `cove-video-reviews-v1:${userId}`,
  ];
  let reviews: Review[] | undefined;
  const known = new Set<string>();
  for (const key of keys) {
    const raw = localStorage.getItem(key);
    if (raw !== null) {
      const source = parseReviews(raw);
      reviews ??= source; // Even an empty newest snapshot is authoritative.
      source.forEach((review) => known.add(review.id));
    }
    stringIds(
      JSON.parse(localStorage.getItem(`${key}:account-imports`) ?? "[]"),
    ).forEach((id) => known.add(id));
  }
  return {
    reviews: reviews ?? [],
    known: [...known],
    present: reviews !== undefined,
  };
}
async function currentAccount(session: Session) {
  const me = await request<{ user: { id: string | number } }>("/api/auth/me");
  if (String(me.user.id) !== session.userId)
    throw new Error("The signed-in account changed. Reload before saving.");
}
function serial<T>(key: string, operation: () => Promise<T>): Promise<T> {
  const next = (writes.get(key) ?? Promise.resolve())
    .catch(() => undefined)
    .then(operation);
  writes.set(key, next);
  void next
    .finally(() => {
      if (writes.get(key) === next) writes.delete(key);
    })
    .catch(() => undefined);
  return next;
}

let loading: ReturnType<typeof loadAccountReviews> | null = null;
export function loadReviews(): ReturnType<typeof loadAccountReviews> {
  if (loading) return loading;
  const result = loadAccountReviews();
  loading = result;
  void result
    .finally(() => {
      if (loading === result) loading = null;
    })
    .catch(() => undefined);
  return result;
}

async function loadAccountReviews() {
  const me = await request<{
    user: { id: string | number };
    permissions: string[];
  }>("/api/auth/me");
  const userId = String(me.user.id);
  const storageKey = `cove-data-quality-v2:${userId}`;
  const readable = has(me.permissions, "savedfilters.read");
  const writable = readable && has(me.permissions, "savedfilters.write");
  const records = readable
    ? (await list(CONFIG_SCOPE))
        .filter((row) => row.name === "Data Quality configuration")
        .sort((a, b) => a.id - b.id)
    : [];
  if (records.length > 1) {
    const equivalent = (row: RecordRow) => {
      const { revision: _revision, ...data } = decode(row.uiOptions);
      return JSON.stringify(data);
    };
    if (records.some((row) => equivalent(row) !== equivalent(records[0])))
      throw new Error(
        "Conflicting Data Quality configurations were found. Existing data has been kept; resolve the duplicate account records before saving.",
      );
    // Preserve identical first-install races as recovery records; never delete account data.
    if (writable)
      for (const row of records.slice(1))
        await request(`/api/savedfilters/${row.id}`, {
          method: "PUT",
          body: JSON.stringify({ name: `Data Quality recovery ${row.id}` }),
        });
    records.splice(1);
  }
  let config = records.length ? decode(records[0].uiOptions) : newConfig();
  // A completed migration never consults prototype keys again. Keep the originals as recovery data.
  const migrated = localStorage.getItem(`${storageKey}:migrated`) === "true";
  const localRaw = localStorage.getItem(storageKey);
  const localOnly = localStorage.getItem(`${storageKey}:local-only`) === "true";
  if (!records.length && localRaw) config = decode(localRaw);
  let needsMigration = !records.length;
  if (records.length && localOnly && localRaw) {
    const offline = decode(localRaw);
    if (
      offline.reviews.some((local) => {
        const remote = config.reviews.find((review) => review.id === local.id);
        return remote && JSON.stringify(remote) !== JSON.stringify(local);
      })
    )
      throw new Error(
        "Browser-only reviews conflict with account edits. Neither version was overwritten. Export the browser reviews before reconciling them with the account configuration.",
      );
    const deletedIds = [
      ...new Set([...config.deletedIds, ...offline.deletedIds]),
    ];
    config = {
      ...config,
      reviews: mergeReviews(config.reviews, offline.reviews).filter(
        (review) => !deletedIds.includes(review.id),
      ),
      deletedIds,
      importedIds: [
        ...new Set([...config.importedIds, ...offline.importedIds]),
      ],
    };
    needsMigration = true;
  }
  if (!migrated) {
    const beforeMigration = JSON.stringify(config);
    const old = legacy(userId);
    if (
      records.length &&
      old.reviews.some((local) => {
        const remote = config.reviews.find((review) => review.id === local.id);
        return remote && JSON.stringify(remote) !== JSON.stringify(local);
      })
    )
      throw new Error(
        "Unmigrated browser reviews conflict with account edits. Neither version was overwritten. Export the browser reviews for recovery, then use a fresh browser to review the account configuration.",
      );
    const imports = readable
      ? (await list(IMPORT_SCOPE)).flatMap((record) =>
          parseReviews(record.uiOptions ?? "[]"),
        )
      : [];
    const locallyDeleted = old.known.filter(
      (id) => !old.reviews.some((review) => review.id === id),
    );
    const deleted = new Set([...config.deletedIds, ...locallyDeleted]);
    // Import local edits once, preserving IDs, order, and explicit deletions. A known remote deletion wins.
    config = {
      ...config,
      reviews: mergeReviews(
        old.reviews,
        config.reviews,
        imports.filter(
          (review) =>
            !old.known.includes(review.id) &&
            !config.importedIds.includes(review.id),
        ),
      ).filter((review) => !deleted.has(review.id)),
      deletedIds: [...deleted],
      importedIds: [
        ...new Set([
          ...config.importedIds,
          ...old.known,
          ...imports.map((review) => review.id),
        ]),
      ],
    };
    needsMigration ||= JSON.stringify(config) !== beforeMigration;
  }
  const session: Session = {
    userId,
    recordId: records[0]?.id,
    config,
    readable,
    writable,
    durable: writable,
  };
  sessions.set(storageKey, session);
  if (needsMigration && writable) {
    // Preserve the actual server revision for the concurrency check during first adoption.
    const migratedConfig = config;
    if (records.length) session.config = decode(records[0].uiOptions);
    await persist(storageKey, migratedConfig);
    config = session.config;
  } else if (!records.length) {
    localStorage.setItem(storageKey, JSON.stringify(config));
    if (!readable && (!migrated || localOnly))
      localStorage.setItem(`${storageKey}:local-only`, "true");
  }
  // A browser with read-only saved filters can review the remote configuration, but cannot edit it.
  if (!readable) localStorage.setItem(`${storageKey}:migrated`, "true");
  else if (writable) {
    try {
      localStorage.setItem(`${storageKey}:migrated`, "true");
    } catch {
      /* Account migration completed. */
    }
  }
  return {
    reviews: config.reviews,
    storageKey,
    canWrite: has(me.permissions, "videos.write"),
    canWriteVideos: has(me.permissions, "videos.write"),
    canWriteTags: has(me.permissions, "tags.write"),
    canReadTagGroups: has(me.permissions, "taggroups.read"),
    canConfigure: !readable || writable,
    storageNotice: !readable
      ? "Reviews and progress are saved only in this browser. Saved filter read and write permissions enable account storage."
      : !writable
        ? "Account reviews are read-only. Saved filter write permission is required to save configuration and progress."
        : "",
  };
}

async function persist(key: string, next: Configuration) {
  const session = sessions.get(key);
  if (!session) throw new Error("Reload reviews before saving.");
  if (session.readable && !session.writable)
    throw new Error(
      "Saved filter write permission is required to save account reviews.",
    );
  const updated = { ...next, revision: crypto.randomUUID() };
  if (session.durable) {
    await currentAccount(session);
    if (session.recordId != null) {
      const remote = await request<RecordRow>(
        `/api/savedfilters/${session.recordId}`,
      );
      if (decode(remote.uiOptions).revision !== session.config.revision)
        throw new Error(
          "Reviews changed in another browser. Your draft is still open. Export it, then reload before saving.",
        );
    }
    const row = await request<RecordRow>(
      session.recordId == null
        ? "/api/savedfilters"
        : `/api/savedfilters/${session.recordId}`,
      {
        method: session.recordId == null ? "POST" : "PUT",
        body: JSON.stringify({
          mode: CONFIG_SCOPE,
          name: "Data Quality configuration",
          uiOptions: JSON.stringify(updated),
        }),
      },
    );
    session.recordId = row.id;
  } else {
    localStorage.setItem(key, JSON.stringify(updated));
    localStorage.setItem(`${key}:local-only`, "true");
  }
  session.config = updated;
  if (session.durable) {
    // The server is authoritative; a cache/quota failure cannot turn a completed server save into a failed save.
    try {
      localStorage.setItem(key, JSON.stringify(updated));
      localStorage.setItem(`${key}:migrated`, "true");
      localStorage.removeItem(`${key}:local-only`);
    } catch {
      /* Kept on the account. */
    }
  }
}

export function saveReviews(
  key: string,
  reviews: Review[],
): Promise<void> {
  parseReviews(JSON.stringify(reviews));
  return serial(key, async () => {
    const session = sessions.get(key);
    if (!session) throw new Error("Reload reviews before saving.");
    const removed = session.config.reviews
      .filter((review) => !reviews.some((next) => next.id === review.id))
      .map((review) => review.id);
    await persist(key, {
      ...session.config,
      reviews,
      deletedIds: [
        ...new Set([...session.config.deletedIds, ...removed]),
      ].filter((id) => !reviews.some((review) => review.id === id)),
    });
  });
}

export interface ReviewProgress {
  version: 1;
  signature: string;
  filter: Record<string, unknown>;
  focusedId: number | null;
  index: number;
  displayMode: "grid" | "list" | "wall";
  cardSize: number | null;
  updatedAt: number;
  occurrence?: {
    answerSignature?: string;
    focusedKey: string | null;
    outcomes: Record<string, "reviewed" | "cannotDetermine">;
  };
}
function progressValue(raw: string): ReviewProgress {
  const value = JSON.parse(raw);
  if (
    value?.version !== 1 ||
    typeof value.signature !== "string" ||
    !value.filter ||
    typeof value.filter !== "object" ||
    Array.isArray(value.filter) ||
    !Number.isSafeInteger(value.index) ||
    value.index < 0 ||
    (value.focusedId !== null &&
      (!Number.isSafeInteger(value.focusedId) || value.focusedId <= 0)) ||
    !["grid", "list", "wall"].includes(value.displayMode) ||
    (value.cardSize !== null &&
      (!Number.isFinite(value.cardSize) ||
        value.cardSize < 115 ||
        value.cardSize > 380)) ||
    !Number.isFinite(value.updatedAt) ||
    (value.occurrence !== undefined && (
      !value.occurrence ||
      (value.occurrence.answerSignature !== undefined && typeof value.occurrence.answerSignature !== "string") ||
      (value.occurrence.focusedKey !== null && !/^[1-9]\d*:[1-9]\d*$/.test(value.occurrence.focusedKey)) ||
      !value.occurrence.outcomes || typeof value.occurrence.outcomes !== "object" || Array.isArray(value.occurrence.outcomes) ||
      !Object.entries(value.occurrence.outcomes).every(([key, outcome]) => /^[1-9]\d*:[1-9]\d*$/.test(key) && ["reviewed", "cannotDetermine"].includes(String(outcome)))
    ))
  )
    throw new Error(
      "Saved review progress could not be read. Existing progress has been kept.",
    );
  return value;
}
export async function loadProgress(
  key: string,
  reviewId: string,
): Promise<ReviewProgress | null> {
  const session = sessions.get(key);
  if (!session) return null;
  const raw = localStorage.getItem(`${key}:progress:${reviewId}`);
  const local = raw ? progressValue(raw) : null;
  if (!session.readable) return local;
  const record = (await list(PROGRESS_SCOPE)).find(
    (row) => row.name === reviewId,
  );
  const remote = record ? progressValue(record.uiOptions) : null;
  return local && (!remote || local.updatedAt > remote.updatedAt)
    ? local
    : remote;
}
export function saveProgress(
  key: string,
  reviewId: string,
  progress: ReviewProgress,
): Promise<void> {
  const localKey = `${key}:progress:${reviewId}`;
  try {
    localStorage.setItem(localKey, JSON.stringify(progress));
  } catch {
    /* Try durable storage below. */
  }
  return serial(localKey, async () => {
    const session = sessions.get(key);
    if (!session?.writable) return;
    await currentAccount(session);
    const record = (await list(PROGRESS_SCOPE)).find(
      (row) => row.name === reviewId,
    );
    await request(
      record ? `/api/savedfilters/${record.id}` : "/api/savedfilters",
      {
        method: record ? "PUT" : "POST",
        body: JSON.stringify({
          mode: PROGRESS_SCOPE,
          name: reviewId,
          uiOptions: JSON.stringify(progress),
        }),
      },
    );
  });
}
