import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

test("uses Cove's authenticated extension API runtime", async () => {
  const source = await readFile(new URL("../src/CompleteTheCove/ui/CompleteTheCove.js", import.meta.url), "utf8");
  const manifest = JSON.parse(await readFile(new URL("../src/CompleteTheCove/extension.json", import.meta.url), "utf8"));

  assert.match(source, /import \{ extensionFetch \} from "@cove\/runtime\/api"/);
  assert.match(source, /const response = await extensionFetch\(url,/);
  assert.doesNotMatch(source, /const response = await fetch\(url,/);
  assert.equal(manifest.minCoveVersion, "1.1.1-dev.153");
});

test("accepts successful extension API responses with empty bodies", async () => {
  const source = await readFile(new URL("../src/CompleteTheCove/ui/CompleteTheCove.js", import.meta.url), "utf8");
  const declaration = source.match(/async function request\(url, options\) \{[\s\S]*?\n\}/)?.[0];
  assert.ok(declaration, "request helper should be present");
  const request = Function("extensionFetch", `"use strict"; ${declaration}; return request;`)(
    async (url) => url.endsWith("/config")
      ? new Response(null, { status: 200 })
      : Response.json({ available: true }),
  );

  assert.equal(await request("/api/plugins/com.midnightrider.complete-the-cove/config", { method: "POST" }), null);
  assert.deepEqual(await request("/api/plugins/com.midnightrider.complete-the-cove/providers"), { available: true });
});

test("uses Cove's shared list shell and canonical pagination", async () => {
  const source = await readFile(new URL("../src/CompleteTheCove/ui/CompleteTheCove.js", import.meta.url), "utf8");
  const declarations = source.match(/function clampCatalogPage\(page, totalCount, perPage\) \{[\s\S]*?(?=\n\nfunction VideoGrid)/)?.[0];

  assert.match(source, /import \{[^}]*ListPage[^}]*\} from "@cove\/runtime\/components"/);
  assert.match(source, /h\(ListPage,/);
  assert.doesNotMatch(source, /DetailListPagination/);
  assert.doesNotMatch(source, /\bPager\b/);
  assert.ok(declarations, "catalog page-clamping helpers should be present");
  const { clampCatalogPage, clampCatalogFilters } = Function(`"use strict"; ${declarations}; return { clampCatalogPage, clampCatalogFilters };`)();
  assert.equal(clampCatalogPage(8, 25, 24), 2);
  assert.equal(clampCatalogPage(4, 0, 24), 1);
  assert.equal(clampCatalogPage(2, 100, 24), 2);
  assert.deepEqual(clampCatalogFilters({ page: 9 }, { total: 24, perPage: 24, query: "page=9" }, "page=9"), { page: 1 });
  assert.deepEqual(clampCatalogFilters({ page: 9 }, { total: 24, perPage: 24, query: "page=2" }, "page=9"), { page: 9 }, "stale response data must not clamp a newly restored URL");
  assert.match(source, /total: null/);
  assert.match(source, /setData\(\{ \.\.\.value, query: requestQuery \}\)/);
});

test("delegates toolbar, filtering, saved views, and pagination to the shared shell", async () => {
  const source = await readFile(new URL("../src/CompleteTheCove/ui/CompleteTheCove.js", import.meta.url), "utf8");
  assert.match(source, /savedFilterScope: SAVED_FILTER_SCOPE/);
  assert.match(source, /cardSizeEntityType: "video"/);
  assert.match(source, /manageDocumentTitle: !scope/);
  assert.match(source, /maxPageSize: 1000/);
  assert.match(source, /\? "ctcPerPage" : "perPage"/);
  assert.match(source, /pageKey: "complete-the-cove-missing-videos"/);
  assert.match(source, /customFilterSections/);
  assert.doesNotMatch(source, /function CatalogControls/);
});

test("renders extension cards as the shared shell content", async () => {
  const source = await readFile(new URL("../src/CompleteTheCove/ui/CompleteTheCove.js", import.meta.url), "utf8");
  const stylesheet = await readFile(new URL("../src/CompleteTheCove/ui/CompleteTheCove.css", import.meta.url), "utf8");

  assert.match(source, /className: "complete-the-cove-content complete-the-cove-grid"/);
  assert.match(source, /className: "complete-the-cove-content rounded-lg/);
  assert.match(source, /\}, data\.items\.length/);
  assert.match(stylesheet, /\.complete-the-cove-grid/);
});

test("formats last-refreshed timestamps with Cove's UTC ISO style", async () => {
  const source = await readFile(new URL("../src/CompleteTheCove/ui/CompleteTheCove.js", import.meta.url), "utf8");
  const declaration = source.match(/function formatDateTime\(value\) \{[\s\S]*?\n\}/)?.[0];
  assert.ok(declaration, "formatDateTime declaration should be present in the packaged UI bundle");
  const formatDateTime = Function(`"use strict"; ${declaration}; return formatDateTime;`)();

  assert.equal(formatDateTime("2024-01-15T23:30:00-05:00"), "2024-01-16 04:30:00 UTC");
  assert.match(source, /Last refreshed \$\{formatDateTime\(state\.tracked\.lastRefreshAt\)\}/);
  assert.doesNotMatch(source, /new Date\([^)]*\)\.toLocaleString/);
});

test("declares a scoped stylesheet for the catalog controls and cards", async () => {
  const manifest = JSON.parse(await readFile(new URL("../src/CompleteTheCove/extension.json", import.meta.url), "utf8"));
  const stylesheet = await readFile(new URL("../src/CompleteTheCove/ui/CompleteTheCove.css", import.meta.url), "utf8");

  assert.equal(manifest.cssBundle, "ui/CompleteTheCove.css");
  assert.match(stylesheet, /\.complete-the-cove-toolbar/);
  assert.match(stylesheet, /\.complete-the-cove-search-icon/);
  assert.match(stylesheet, /grid-template-columns: repeat\(auto-fill, minmax\(var\(--card-min-width, 275px\), 1fr\)\)/);
  const selectorLines = stylesheet.split("\n").map((line) => line.trim()).filter((line) => line.endsWith("{"));
  assert.ok(selectorLines.every((line) => line.startsWith(".complete-the-cove-") || line.startsWith("@media")), "stylesheet selectors must remain extension-scoped");
});

test("mirrors Cove's native video-card layout with missing-video data", async () => {
  const source = await readFile(new URL("../src/CompleteTheCove/ui/CompleteTheCove.js", import.meta.url), "utf8");
  const stylesheet = await readFile(new URL("../src/CompleteTheCove/ui/CompleteTheCove.css", import.meta.url), "utf8");

  assert.match(source, /complete-the-cove-card-preview card-media/);
  assert.match(source, /complete-the-cove-performer-badge/);
  assert.match(source, /video\.details \? h\("p"/);
  assert.match(source, /complete-the-cove-card-popovers/);
  assert.match(source, /function VideoMetadataPopover/);
  assert.match(source, /createPortal\(/);
  assert.match(source, /h\("a", \{[\s\S]*complete-the-cove-card-link/);
  assert.match(source, /aria-expanded/);
  assert.match(source, /aria-controls/);
  assert.match(source, /event\.key === "Escape"/);
  assert.match(source, /window\.addEventListener\("scroll", dismissOnScroll, true\)/);
  assert.match(source, /panelRef\.current\?\.contains\(event\.target\)/);
  assert.match(source, /complete-the-cove-card-popover-performer/);
  assert.match(source, /complete-the-cove-card-popover-tag/);
  assert.match(source, /performer\.covePerformerId/);
  assert.match(source, /\/api\/performers\/\$\{performer\.covePerformerId\}\/image/);
  assert.match(source, /href: `\/performer\/\$\{item\.covePerformerId\}`/);
  assert.doesNotMatch(source, /`\/performers\/\$\{item\.covePerformerId\}`/);
  assert.match(source, /complete-the-cove-performer-badge-fallback/);
  assert.match(source, /event\.currentTarget\.nextElementSibling\.style\.display = "block"/);
  assert.match(source, /label: "Performers"/);
  assert.match(source, /label: "Tags"/);
  assert.match(source, /performers\.length/);
  assert.match(source, /tags\.length/);
  assert.match(source, /function providerLabel/);
  assert.match(source, /providerLabel\(video\.remoteEndpoint\)/);
  assert.doesNotMatch(source, /complete-the-cove-card-tags/);
  assert.match(stylesheet, /\.complete-the-cove-card-body[\s\S]*padding: 0\.5rem 0\.625rem/);
  assert.match(stylesheet, /\.complete-the-cove-card-popovers[\s\S]*min-height: 28px/);
  assert.match(stylesheet, /\.complete-the-cove-panel[\s\S]*padding-top: 0\.75rem/);
  assert.doesNotMatch(stylesheet.match(/\.complete-the-cove-toolbar\s*\{[\s\S]*?\}/)?.[0] ?? "", /margin-bottom/);
  assert.match(stylesheet, /\.complete-the-cove-card-popover-items-performers[\s\S]*grid-template-columns: repeat\(2/);
  assert.match(stylesheet, /\.complete-the-cove-card-popover-tag[\s\S]*color: var\(--color-accent\)/);
});

test("uses Cove's persisted video-card sizing profile through the shared shell", async () => {
  const source = await readFile(new URL("../src/CompleteTheCove/ui/CompleteTheCove.js", import.meta.url), "utf8");
  assert.match(source, /cardSizeEntityType: "video"/);
  assert.doesNotMatch(source, /localStorage\.getItem\("cove\.cardSize\.video"\)/);
});

test("provides a URL-backed tracked-records overview with grouped target sections", async () => {
  const source = await readFile(new URL("../src/CompleteTheCove/ui/CompleteTheCove.js", import.meta.url), "utf8");

  assert.match(source, /params\.set\("view", "tracked"\)/);
  assert.match(source, /targetType/);
  assert.match(source, /targetId/);
  assert.match(source, /\}, \["Tracked",/);
  assert.doesNotMatch(source, /\["Tracked Records",/);
  assert.match(source, /Performers/);
  assert.match(source, /Studios/);
  assert.match(source, /Tags/);
  assert.match(source, /Search tracked records/);
  assert.match(source, /ConfirmDialog/);
  assert.match(source, /Stop tracking/);
  assert.match(source, /"aria-controls": "complete-the-cove-panel"/);
  assert.match(source, /onKeyDown: handleTabKey/);
});

test("provides native filter-dialog criteria with removable legacy entity sections", async () => {
  const source = await readFile(new URL("../src/CompleteTheCove/ui/CompleteTheCove.js", import.meta.url), "utf8");
  const stylesheet = await readFile(new URL("../src/CompleteTheCove/ui/CompleteTheCove.css", import.meta.url), "utf8");

  assert.match(source, /const criteriaDefinitions/);
  assert.match(source, /type: "multiId", entityType: "performers", filterKey: "performersCriterion"/);
  assert.match(source, /type: "multiId", entityType: "tags", filterKey: "tagsCriterion"/);
  assert.match(source, /type: "multiId", entityType: "studios", filterKey: "studiosCriterion"/);
  assert.match(source, /hierarchyToggleLabel: "Include sub-studios"/);
  assert.match(source, /id: "ignored", label: "Ignored", type: "bool", filterKey: "ignoredCriterion"/);
  assert.match(source, /const customFilterSections/);
  assert.match(source, /function createFacetSection/);
  assert.match(source, /Includes All/);
  assert.match(source, /Is Null/);
  assert.match(source, /Not Null/);
  assert.match(source, /createFacetSection\("performer", "Legacy performer links"/);
  assert.match(source, /excludeStudio/);
  assert.match(source, /createFacetSection\("tag", "Legacy tag links"/);
  assert.match(source, /createFacetSection\("studio", "Legacy studio links"/);
  assert.doesNotMatch(source, /facets\.performers/);
  assert.doesNotMatch(source, /facets\.tags/);
  assert.doesNotMatch(source, /Ignored Status/);
  assert.match(source, /savedFilterScope: SAVED_FILTER_SCOPE/);
  assert.doesNotMatch(source, /function CatalogFilterPanel/);
  assert.match(stylesheet, /\.complete-the-cove-filter-choice-active/);
});

test("maps native Cove entity and ignored criteria to catalog query values", async () => {
  const source = await readFile(new URL("../src/CompleteTheCove/ui/CompleteTheCove.js", import.meta.url), "utf8");
  const defaults = source.match(/const DEFAULT_CATALOG_FILTERS = Object\.freeze\([\s\S]*?\n\}\);/)?.[0];
  const declarations = source.match(/function catalogObjectFilter\(filters\) \{[\s\S]*?(?=\n\nfunction readInitialCatalogFilters)/)?.[0];
  assert.ok(defaults && declarations, "catalog object-filter adapters should be present");
  const { catalogObjectFilter, applyCatalogObjectFilter } = Function(`"use strict"; ${defaults}; ${declarations}; return { catalogObjectFilter, applyCatalogObjectFilter };`)();
  const filters = {
    ...structuredClone({
      q: "", provider: "", performer: ["41"], excludePerformer: ["42"], performerMode: "all",
      studio: ["51"], excludeStudio: ["52"], studioMode: "any", includeSubstudios: true,
      tag: ["73"], excludeTag: [], tagMode: "any", includeSubtags: true, ignored: "ignored", sort: "release", direction: "desc", page: 1, perPage: 40,
    }),
  };

  const objectFilter = catalogObjectFilter(filters);
  assert.deepEqual(objectFilter.performersCriterion, { value: [41], excludes: [42], modifier: "INCLUDES_ALL" });
  assert.deepEqual(objectFilter.tagsCriterion, { value: [73], excludes: undefined, modifier: "INCLUDES", depth: -1 });
  assert.deepEqual(objectFilter.studiosCriterion, { value: [51], excludes: [52], modifier: "INCLUDES", depth: -1 });
  assert.deepEqual(objectFilter.ignoredCriterion, { modifier: "EQUALS", value: true });
  const roundTrip = applyCatalogObjectFilter(filters, objectFilter);
  assert.deepEqual(roundTrip.performer, ["41"]);
  assert.deepEqual(roundTrip.excludePerformer, ["42"]);
  assert.deepEqual(roundTrip.tag, ["73"]);
  assert.deepEqual(roundTrip.studio, ["51"]);
  assert.equal(roundTrip.ignored, "ignored");

  const legacy = { ...filters, performer: ["https://example.test/graphql|remote-performer"], excludePerformer: [], performerMode: "all" };
  const legacyRoundTrip = applyCatalogObjectFilter(legacy, catalogObjectFilter(legacy));
  assert.deepEqual(legacyRoundTrip.performer, legacy.performer, "applying an unrelated native dialog change must preserve legacy remote bookmarks");
  assert.equal(legacyRoundTrip.performerMode, "all");
  assert.deepEqual(applyCatalogObjectFilter(legacy, {}).performer, [], "clearing the dialog must remove legacy remote bookmarks");
  assert.equal(applyCatalogObjectFilter(filters, { ignoredCriterion: { modifier: "EQUALS", value: false } }).ignored, "not-ignored");
  assert.equal(applyCatalogObjectFilter(filters, {}).ignored, "all", "clearing the dialog must include both ignored states");
  assert.equal(applyCatalogObjectFilter(filters, { ignoredCriterion: { modifier: "EQUALS", value: "ignored" } }).ignored, "ignored", "old saved filters must retain ignored=true");

  const legacyStudio = { ...filters, studio: ["https://example.test/graphql|remote-studio"], excludeStudio: [], studioMode: "all", includeSubstudios: true };
  const legacyStudioObject = catalogObjectFilter(legacyStudio);
  assert.equal(legacyStudioObject.studiosCriterion, undefined, "remote-only modes must not use an empty native criterion");
  assert.deepEqual(legacyStudioObject.studioCriterion, { include: legacyStudio.studio, exclude: [], mode: "all", includeSubstudios: true });
  const oldSavedStudio = applyCatalogObjectFilter(filters, { studioCriterion: legacyStudioObject.studioCriterion });
  assert.deepEqual(oldSavedStudio.studio, legacyStudio.studio);
  assert.equal(oldSavedStudio.studioMode, "all");
  assert.equal(oldSavedStudio.includeSubstudios, true);
  const legacyNullStudioObject = catalogObjectFilter({ ...legacyStudio, studioMode: "null" });
  assert.equal(legacyNullStudioObject.studiosCriterion, undefined);
  assert.equal(legacyNullStudioObject.studioCriterion.mode, "null");
  assert.match(source, /return saved\?\.objectFilter \? applyCatalogObjectFilter\(base, saved\.objectFilter\) : base;/, "a fresh visit without a saved object filter must retain the not-ignored default");
});

test("renders provider-specific completion only for successfully measured providers", async () => {
  const source = await readFile(new URL("../src/CompleteTheCove/ui/CompleteTheCove.js", import.meta.url), "utf8");
  const stylesheet = await readFile(new URL("../src/CompleteTheCove/ui/CompleteTheCove.css", import.meta.url), "utf8");

  assert.match(source, /function ProviderProgress/);
  assert.match(source, /providers\.map/);
  assert.match(source, /Refresh to calculate progress/);
  assert.match(source, /No eligible videos/);
  assert.match(source, /Math\.round\(\(provider\.ownedVideoCount \/ provider\.eligibleVideoCount\) \* 100\)/);
  assert.match(source, /provider\.lastRefreshError/);
  assert.equal((source.match(/h\(ProviderProgress,/g) || []).length, 3);
  assert.match(stylesheet, /\.complete-the-cove-progress-bar/);
  assert.match(stylesheet, /\.complete-the-cove-progress-fill/);
});

test("keeps tracked target names readable and actions below content on mobile", async () => {
  const stylesheet = await readFile(new URL("../src/CompleteTheCove/ui/CompleteTheCove.css", import.meta.url), "utf8");
  const mobile = stylesheet.match(/@media \(max-width: 639px\) \{[\s\S]*\n\}/)?.[0] ?? "";

  assert.match(mobile, /\.complete-the-cove-target-row\s*\{[\s\S]*?flex-direction: column/);
  assert.match(mobile, /\.complete-the-cove-target-name\s*\{[\s\S]*?white-space: normal/);
  assert.match(mobile, /\.complete-the-cove-target-actions\s*\{[\s\S]*?flex-direction: row/);
});

test("uses Cove video terminology and reserves the missing-cover ribbon for detail", async () => {
  const source = await readFile(new URL("../src/CompleteTheCove/ui/CompleteTheCove.js", import.meta.url), "utf8");
  const stylesheet = await readFile(new URL("../src/CompleteTheCove/ui/CompleteTheCove.css", import.meta.url), "utf8");

  assert.match(source, /"Missing Videos"/);
  assert.match(source, /"Remote videos missing from this Cove/);
  assert.match(source, /"Search missing videos\.\.\."/);
  assert.match(source, /label: "Ignored", type: "bool"/);
  assert.match(source, /"No missing videos match this view."/);
  assert.match(source, /\/missing-videos/);
  assert.match(source, /\/missing-video\//);
  assert.match(source, /`\$\{API\}\/videos/);
  assert.match(source, /function LegacyMissingVideosPage/);
  assert.match(source, /replaceUrl\(`\/missing-videos\$\{window\.location\.search\}`\)/);
  assert.match(source, /function LegacyMissingVideoDetailPage/);
  assert.match(source, /replaceUrl\(`\/missing-video\/\$\{id\}\$\{window\.location\.search\}`\)/);
  assert.match(source, /function MissingBanner/);
  assert.equal((source.match(/h\(MissingBanner/g) || []).length, 1);
  assert.doesNotMatch(source, /key: "blur"/);
  assert.doesNotMatch(source, /blur-2xl/);
  assert.match(stylesheet, /\.complete-the-cove-missing-banner/);
});

test("parses and writes catalog URLs without losing unrelated parameters", async () => {
  const source = await readFile(new URL("../src/CompleteTheCove/ui/CompleteTheCove.js", import.meta.url), "utf8");
  const declarations = source.match(/function readCatalogLocation\(\) \{[\s\S]*?(?=\n\nfunction navigateUrl)/)?.[0];
  assert.ok(declarations, "catalog URL helpers should be present");
  let pushedUrl = "";
  const window = {
    location: { pathname: "/missing-videos", search: "?view=tracked&targetType=performer&targetId=42&keep=yes" },
    history: { pushState: (_state, _title, url) => { pushedUrl = url; } },
  };
  const helpers = Function("window", `"use strict"; ${declarations}; return { readCatalogLocation, writeCatalogLocation };`)(window);

  assert.deepEqual(helpers.readCatalogLocation(), { view: "tracked", targetType: "performer", targetId: 42 });
  helpers.writeCatalogLocation({ view: "videos", targetType: "tag", targetId: 9 });
  assert.equal(pushedUrl, "/missing-videos?keep=yes&targetType=tag&targetId=9");

  pushedUrl = "";
  window.location.search = "?view=tracked&targetType=performer&targetId=42&keep=yes";
  helpers.writeCatalogLocation({ view: "tracked", targetType: null, targetId: null });
  assert.equal(pushedUrl, "/missing-videos?keep=yes&view=tracked");
  window.location.search = "?keep=yes&view=tracked";
  pushedUrl = "";
  helpers.writeCatalogLocation({ view: "tracked", targetType: null, targetId: null });
  assert.equal(pushedUrl, "", "selecting the active catalog view should not add history");

  window.location.search = "?targetType=video&targetId=-2";
  assert.deepEqual(helpers.readCatalogLocation(), { view: "videos", targetType: null, targetId: null });
});

test("persists missing-video catalog filters in the URL", async () => {
  const source = await readFile(new URL("../src/CompleteTheCove/ui/CompleteTheCove.js", import.meta.url), "utf8");
  const declarations = source.match(/const DEFAULT_CATALOG_FILTERS[\s\S]*?(?=\n\nfunction navigateUrl)/)?.[0];
  assert.ok(declarations, "catalog filter URL helpers should be present");
  let replacedUrl = "";
  const window = {
    location: {
      pathname: "/missing-videos",
      search: "?keep=yes&q=Crystal&provider=https%3A%2F%2Fexample.test%2Fgraphql&performerMode=all&performer=remote%7C7&performer=remote%7C17&excludePerformer=remote%7C27&studio=remote%7C8&includeSubstudios=true&tagMode=not-null&excludeTag=remote%7C9&ignored=all&sort=title&direction=asc&page=3",
    },
    history: { replaceState: (_state, _title, url) => { replacedUrl = url; } },
  };
  const helpers = Function("window", `"use strict"; ${declarations}; return { readCatalogFilters, writeCatalogFilters, catalogQueryString, missingVideoDetailUrl, missingVideosCatalogUrl };`)(window);

  assert.deepEqual(helpers.readCatalogFilters(), {
    q: "Crystal",
    provider: "https://example.test/graphql",
    performer: ["remote|7", "remote|17"],
    excludePerformer: ["remote|27"],
    performerMode: "all",
    studio: ["remote|8"],
    excludeStudio: [],
    studioMode: "any",
    includeSubstudios: true,
    tag: [],
    excludeTag: ["remote|9"],
    tagMode: "not-null",
    includeSubtags: false,
    ignored: "all",
    sort: "title",
    direction: "asc",
    page: 3,
    perPage: 40,
  });
  assert.match(helpers.catalogQueryString(), /performer=remote%7C7&performer=remote%7C17/);
  assert.match(helpers.missingVideoDetailUrl(17), /^\/missing-video\/17\?keep=yes&/);
  assert.match(helpers.missingVideosCatalogUrl(), /^\/missing-videos\?keep=yes&/);

  helpers.writeCatalogFilters({
    q: "", provider: "",
    performer: [], excludePerformer: [], performerMode: "any",
    studio: [], excludeStudio: [], studioMode: "any", includeSubstudios: false,
    tag: [], excludeTag: [], tagMode: "any", includeSubtags: false,
    ignored: "not-ignored", sort: "release", direction: "desc", page: 1, perPage: 40,
  });
  assert.equal(replacedUrl, "/missing-videos?keep=yes", "default values should be omitted without losing unrelated parameters");

  window.location.pathname = "/performer/42";
  window.location.search = "?tab=ext%3Amissing-videos&q=host-search&view=host-view&returnTo=host-return&ctcQ=test&ctcSort=title";
  assert.equal(helpers.readCatalogFilters().q, "test", "scoped tabs must read extension-owned parameters");
  replacedUrl = "";
  helpers.writeCatalogFilters({
    q: "changed", provider: "",
    performer: [], excludePerformer: [], performerMode: "any",
    studio: [], excludeStudio: [], studioMode: "any", includeSubstudios: false,
    tag: [], excludeTag: [], tagMode: "any", includeSubtags: false,
    ignored: "not-ignored", sort: "title", direction: "desc", page: 1, perPage: 40,
  });
  assert.equal(replacedUrl, "/performer/42?tab=ext%3Amissing-videos&q=host-search&view=host-view&returnTo=host-return&ctcQ=changed&ctcSort=title");
  const scopedDetailUrl = helpers.missingVideoDetailUrl(17);
  assert.equal(scopedDetailUrl, "/missing-video/17?tab=ext%3Amissing-videos&q=host-search&view=host-view&returnTo=host-return&ctcQ=test&ctcSort=title&ctcReturnTo=%2Fperformer%2F42");
  window.location.pathname = "/missing-video/17";
  window.location.search = scopedDetailUrl.slice(scopedDetailUrl.indexOf("?"));
  assert.equal(helpers.missingVideosCatalogUrl(), "/performer/42?tab=ext%3Amissing-videos&q=host-search&view=host-view&returnTo=host-return&ctcQ=test&ctcSort=title");
  for (const unsafeReturnTo of ["https://evil.test/path", "//evil.test/path", "/performer/42/../43", "/performer/not-a-number"]) {
    window.location.search = `?ctcQ=test&ctcReturnTo=${encodeURIComponent(unsafeReturnTo)}`;
    assert.equal(helpers.missingVideosCatalogUrl(), "/missing-videos?ctcQ=test", `must reject unsafe return path ${unsafeReturnTo}`);
  }

  window.location.search = "?q=test&ignored=unknown&sort=unknown&direction=sideways&page=-2";
  assert.deepEqual(helpers.readCatalogFilters(), {
    q: "test", provider: "",
    performer: [], excludePerformer: [], performerMode: "any",
    studio: [], excludeStudio: [], studioMode: "any", includeSubstudios: false,
    tag: [], excludeTag: [], tagMode: "any", includeSubtags: false,
    ignored: "not-ignored", sort: "release", direction: "desc", page: 1, perPage: 40,
  });
});

test("carries the catalog query through missing-video detail navigation", async () => {
  const source = await readFile(new URL("../src/CompleteTheCove/ui/CompleteTheCove.js", import.meta.url), "utf8");

  assert.match(source, /navigateUrl\(missingVideoDetailUrl\(video\.id\)\)/);
  assert.match(source, /navigateUrl\(missingVideosCatalogUrl\(\)\)/);
  assert.doesNotMatch(source, /else onNavigate\(\{ page: "missing-video", id: video\.id \}\)/);
  assert.doesNotMatch(source, /else onNavigate\(\{ page: "missing-videos" \}\)/);
});

test("URL-backs catalog filters in scoped entity tabs", async () => {
  const source = await readFile(new URL("../src/CompleteTheCove/ui/CompleteTheCove.js", import.meta.url), "utf8");

  assert.match(source, /useEffect\(\(\) => \{ writeCatalogFilters\(filters\); \}, \[filters\]\)/);
  assert.match(source, /SCOPED_CATALOG_FILTER_KEYS/);
  assert.match(source, /ctcReturnTo/);
});

test("normalizes legacy entity-tab bookmarks to the video tab key", async () => {
  const source = await readFile(new URL("../src/CompleteTheCove/ui/CompleteTheCove.js", import.meta.url), "utf8");

  assert.match(source, /params\.get\("tab"\) === "ext:missing-scenes"/);
  assert.match(source, /params\.set\("tab", "ext:missing-videos"\)/);
  assert.match(source, /normalizeLegacyTabLocation\(\);/);
  assert.match(source, /normalizeLegacyTabParams\(new URLSearchParams\(catalogQueryString\(\)\)\)/);
});

test("filters videos by provider and renders linked native-like detail entities", async () => {
  const source = await readFile(new URL("../src/CompleteTheCove/ui/CompleteTheCove.js", import.meta.url), "utf8");
  assert.match(source, /id: "provider", label: "Provider", type: "enum"/);
  assert.match(source, /Open \$\{providerLabel\(video\.remoteEndpoint\)\} metadata page/);
  assert.match(source, /rounded-full border border-border bg-card px-3 py-1 text-xs text-accent/);
  assert.match(source, /video\.coveStudioId/);
  assert.match(source, /tag\.coveTagId/);
  assert.match(source, /performerImageUrl\(performer\)/);
  assert.match(source, /PerformerTile/);
  assert.match(source, /TagBadge/);
  assert.match(source, /headerImage/);
  assert.match(source, /\/api\/studios\/\$\{video\.coveStudioId\}\/image/);
});

test("filters ignored videos with Cove's native boolean criterion", async () => {
  const source = await readFile(new URL("../src/CompleteTheCove/ui/CompleteTheCove.js", import.meta.url), "utf8");

  assert.match(source, /ignored: "not-ignored"/);
  assert.match(source, /result\.ignoredCriterion = \{ modifier: "EQUALS", value: filters\.ignored === "ignored" \}/);
  assert.match(source, /ignored === true \|\| ignored === "ignored"/);
  assert.match(source, /filterKey: "ignoredCriterion"/);
  assert.match(source, /value\("showIgnored"\) === "true" \? "all"/);
  assert.doesNotMatch(source, /Show ignored videos/);
  assert.doesNotMatch(source, /More catalog options/);
  assert.match(source, /method: video\.isIgnored \? "DELETE" : "POST"/);
  assert.match(source, /video\.isIgnored \? "Unignore" : "Ignore"/);
  assert.match(source, /video\.isIgnored \? Eye : EyeOff/);
});

test("settings select multiple configured metadata providers", async () => {
  const source = await readFile(new URL("../src/CompleteTheCove/ui/CompleteTheCove.js", import.meta.url), "utf8");
  const manifest = JSON.parse(await readFile(new URL("../src/CompleteTheCove/extension.json", import.meta.url), "utf8"));
  const declaration = source.match(/function normalizeProviderEndpoint\(endpoint\) \{[\s\S]*?\n\}/)?.[0];

  assert.ok(manifest.settings.some((setting) => setting.name === "selected_metadata_endpoints"));
  assert.match(source, /\/api\/plugins\/com\.midnightrider\.complete-the-cove\/providers/);
  assert.match(source, /type: "checkbox"/);
  assert.match(source, /selected_metadata_endpoints: selected\.join\(","\)/);
  assert.match(source, /Loading configured providers/);
  assert.match(source, /No compatible metadata providers are configured in Cove/);
  assert.match(source, /placeholder: "Tag name, Another tag"/);
  assert.doesNotMatch(source, /placeholder: "Compilation"/);
  assert.ok(declaration);
  const normalizeProviderEndpoint = Function(`"use strict"; ${declaration}; return normalizeProviderEndpoint;`)();
  assert.equal(normalizeProviderEndpoint(" HTTPS://FANSDB.XYZ/graphql/ "), "https://fansdb.xyz/graphql");
});

test("refresh controls use a split button for all or one enabled provider", async () => {
  const source = await readFile(new URL("../src/CompleteTheCove/ui/CompleteTheCove.js", import.meta.url), "utf8");
  const stylesheet = await readFile(new URL("../src/CompleteTheCove/ui/CompleteTheCove.css", import.meta.url), "utf8");

  assert.match(source, /function RefreshSplitButton/);
  assert.match(source, /providers\.filter\(\(provider\) => provider\.enabled === true\)/);
  assert.match(source, /Refresh all providers/);
  assert.match(source, /Refresh from \$\{provider\.name/);
  assert.match(source, /providerEndpoint: provider\.endpoint/);
  assert.match(source, /request\("\/api\/plugins\/com\.midnightrider\.complete-the-cove\/providers"\)/);
  assert.match(source, /h\(RefreshSplitButton,/);
  assert.match(source, /function TargetRow\(\{ target, providers,/);
  assert.match(source, /refresh: \(provider\) => onRefresh\(target, provider\)/);
  assert.match(source, /entityId: String\(target\.entityId\), \.\.\.\(provider \? \{ providerEndpoint: provider\.endpoint \}/);
  assert.doesNotMatch(source, /disabled: refreshing \|\| enabled\.length === 0/);
  assert.match(stylesheet, /\.complete-the-cove-refresh-group/);
  assert.match(stylesheet, /\.complete-the-cove-refresh-menu/);
});
