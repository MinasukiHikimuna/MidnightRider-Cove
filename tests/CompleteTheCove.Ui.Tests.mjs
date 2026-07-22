import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

test("uses Cove's authenticated extension API runtime", async () => {
  const source = await readFile(new URL("../extensions/CompleteTheCove/ui/CompleteTheCove.js", import.meta.url), "utf8");
  const manifest = JSON.parse(await readFile(new URL("../extensions/CompleteTheCove/extension.json", import.meta.url), "utf8"));

  assert.match(source, /import \{ extensionFetch \} from "@cove\/runtime\/api"/);
  assert.match(source, /const response = await extensionFetch\(url,/);
  assert.doesNotMatch(source, /const response = await fetch\(url,/);
  assert.equal(manifest.minCoveVersion, "1.0.0-dev");
});

test("accepts successful extension API responses with empty bodies", async () => {
  const source = await readFile(new URL("../extensions/CompleteTheCove/ui/CompleteTheCove.js", import.meta.url), "utf8");
  const declaration = source.match(/async function request\(url, options\) \{[\s\S]*?\n\}/)?.[0];
  assert.ok(declaration, "request helper should be present");
  const request = Function("extensionFetch", `"use strict"; ${declaration}; return request;`)(
    async (url) => url.endsWith("/config")
      ? new Response(null, { status: 200 })
      : Response.json({ available: true }),
  );

  assert.equal(await request("/api/plugins/complete-the-cove/config", { method: "POST" }), null);
  assert.deepEqual(await request("/api/plugins/complete-the-cove/providers"), { available: true });
});

test("uses Cove's canonical detail-list pagination", async () => {
  const source = await readFile(new URL("../extensions/CompleteTheCove/ui/CompleteTheCove.js", import.meta.url), "utf8");
  const declarations = source.match(/function clampCatalogPage\(page, totalCount, perPage\) \{[\s\S]*?(?=\n\nfunction SceneGrid)/)?.[0];

  assert.match(source, /import \{[^}]*DetailListPagination[^}]*\} from "@cove\/runtime\/components"/);
  assert.match(source, /h\(DetailListPagination,/);
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

test("renders matching pagination above and below the scene list", async () => {
  const source = await readFile(new URL("../extensions/CompleteTheCove/ui/CompleteTheCove.js", import.meta.url), "utf8");
  const paginationCalls = source.match(/h\(DetailListPagination,/g) || [];

  assert.equal(paginationCalls.length, 2);
  assert.match(source, /key: "pagination-top"/);
  assert.match(source, /key: "pagination-bottom"/);
});

test("spaces catalog content from the controls when top pagination is hidden", async () => {
  const source = await readFile(new URL("../extensions/CompleteTheCove/ui/CompleteTheCove.js", import.meta.url), "utf8");
  const stylesheet = await readFile(new URL("../extensions/CompleteTheCove/ui/CompleteTheCove.css", import.meta.url), "utf8");

  assert.match(source, /key: "error", className: "complete-the-cove-content /);
  assert.match(source, /key: "grid", className: "complete-the-cove-content complete-the-cove-grid"/);
  assert.match(source, /key: "empty", className: "complete-the-cove-content /);
  assert.match(stylesheet, /\.complete-the-cove-toolbar \+ \.complete-the-cove-content\s*\{[\s\S]*?margin-top: 0\.75rem/);
});

test("formats last-refreshed timestamps with Cove's UTC ISO style", async () => {
  const source = await readFile(new URL("../extensions/CompleteTheCove/ui/CompleteTheCove.js", import.meta.url), "utf8");
  const declaration = source.match(/function formatDateTime\(value\) \{[\s\S]*?\n\}/)?.[0];
  assert.ok(declaration, "formatDateTime declaration should be present in the packaged UI bundle");
  const formatDateTime = Function(`"use strict"; ${declaration}; return formatDateTime;`)();

  assert.equal(formatDateTime("2024-01-15T23:30:00-05:00"), "2024-01-16 04:30:00 UTC");
  assert.match(source, /Last refreshed \$\{formatDateTime\(state\.tracked\.lastRefreshAt\)\}/);
  assert.doesNotMatch(source, /new Date\([^)]*\)\.toLocaleString/);
});

test("declares a scoped stylesheet for the catalog controls and cards", async () => {
  const manifest = JSON.parse(await readFile(new URL("../extensions/CompleteTheCove/extension.json", import.meta.url), "utf8"));
  const stylesheet = await readFile(new URL("../extensions/CompleteTheCove/ui/CompleteTheCove.css", import.meta.url), "utf8");

  assert.equal(manifest.cssBundle, "ui/CompleteTheCove.css");
  assert.match(stylesheet, /\.complete-the-cove-toolbar/);
  assert.match(stylesheet, /\.complete-the-cove-search-icon/);
  assert.match(stylesheet, /grid-template-columns: repeat\(auto-fill, minmax\(var\(--card-min-width, 275px\), 1fr\)\)/);
  const selectorLines = stylesheet.split("\n").map((line) => line.trim()).filter((line) => line.endsWith("{"));
  assert.ok(selectorLines.every((line) => line.startsWith(".complete-the-cove-") || line.startsWith("@media")), "stylesheet selectors must remain extension-scoped");
});

test("mirrors Cove's native video-card layout with missing-scene data", async () => {
  const source = await readFile(new URL("../extensions/CompleteTheCove/ui/CompleteTheCove.js", import.meta.url), "utf8");
  const stylesheet = await readFile(new URL("../extensions/CompleteTheCove/ui/CompleteTheCove.css", import.meta.url), "utf8");

  assert.match(source, /complete-the-cove-card-preview card-media/);
  assert.match(source, /complete-the-cove-performer-badge/);
  assert.match(source, /scene\.details \? h\("p"/);
  assert.match(source, /complete-the-cove-card-popovers/);
  assert.match(source, /function SceneMetadataPopover/);
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
  assert.match(source, /providerLabel\(scene\.remoteEndpoint\)/);
  assert.doesNotMatch(source, /complete-the-cove-card-tags/);
  assert.match(stylesheet, /\.complete-the-cove-card-body[\s\S]*padding: 0\.5rem 0\.625rem/);
  assert.match(stylesheet, /\.complete-the-cove-card-popovers[\s\S]*min-height: 28px/);
  assert.match(stylesheet, /\.complete-the-cove-panel[\s\S]*padding-top: 0\.75rem/);
  assert.doesNotMatch(stylesheet.match(/\.complete-the-cove-toolbar\s*\{[\s\S]*?\}/)?.[0] ?? "", /margin-bottom/);
  assert.match(stylesheet, /\.complete-the-cove-card-popover-items-performers[\s\S]*grid-template-columns: repeat\(2/);
  assert.match(stylesheet, /\.complete-the-cove-card-popover-tag[\s\S]*color: var\(--color-accent\)/);
});

test("uses Cove's persisted video-card sizing profile", async () => {
  const source = await readFile(new URL("../extensions/CompleteTheCove/ui/CompleteTheCove.js", import.meta.url), "utf8");
  assert.match(source, /localStorage\.getItem\("cove\.cardSize\.video"\)/);
  assert.match(source, /Math\.round\(225 \+ level \* 50\)/);
  assert.match(source, /"--card-min-width": `\$\{cardMinWidth\}px`/);
});

test("provides a URL-backed tracked-records overview with grouped target sections", async () => {
  const source = await readFile(new URL("../extensions/CompleteTheCove/ui/CompleteTheCove.js", import.meta.url), "utf8");

  assert.match(source, /params\.set\("view", "tracked"\)/);
  assert.match(source, /targetType/);
  assert.match(source, /targetId/);
  assert.match(source, /Tracked Records/);
  assert.match(source, /Performers/);
  assert.match(source, /Studios/);
  assert.match(source, /Tags/);
  assert.match(source, /Search tracked records/);
  assert.match(source, /ConfirmDialog/);
  assert.match(source, /Stop tracking/);
  assert.match(source, /"aria-controls": "complete-the-cove-panel"/);
  assert.match(source, /onKeyDown: handleTabKey/);
});

test("parses and writes catalog URLs without losing unrelated parameters", async () => {
  const source = await readFile(new URL("../extensions/CompleteTheCove/ui/CompleteTheCove.js", import.meta.url), "utf8");
  const declarations = source.match(/function readCatalogLocation\(\) \{[\s\S]*?(?=\n\nfunction navigateUrl)/)?.[0];
  assert.ok(declarations, "catalog URL helpers should be present");
  let pushedUrl = "";
  const window = {
    location: { pathname: "/missing-scenes", search: "?view=tracked&targetType=performer&targetId=42&keep=yes" },
    history: { pushState: (_state, _title, url) => { pushedUrl = url; } },
  };
  const helpers = Function("window", `"use strict"; ${declarations}; return { readCatalogLocation, writeCatalogLocation };`)(window);

  assert.deepEqual(helpers.readCatalogLocation(), { view: "tracked", targetType: "performer", targetId: 42 });
  helpers.writeCatalogLocation({ view: "scenes", targetType: "tag", targetId: 9 });
  assert.equal(pushedUrl, "/missing-scenes?keep=yes&targetType=tag&targetId=9");

  pushedUrl = "";
  window.location.search = "?view=tracked&targetType=performer&targetId=42&keep=yes";
  helpers.writeCatalogLocation({ view: "tracked", targetType: null, targetId: null });
  assert.equal(pushedUrl, "/missing-scenes?keep=yes&view=tracked");
  window.location.search = "?keep=yes&view=tracked";
  pushedUrl = "";
  helpers.writeCatalogLocation({ view: "tracked", targetType: null, targetId: null });
  assert.equal(pushedUrl, "", "selecting the active catalog view should not add history");

  window.location.search = "?targetType=video&targetId=-2";
  assert.deepEqual(helpers.readCatalogLocation(), { view: "scenes", targetType: null, targetId: null });
});

test("persists missing-scene catalog filters in the URL", async () => {
  const source = await readFile(new URL("../extensions/CompleteTheCove/ui/CompleteTheCove.js", import.meta.url), "utf8");
  const declarations = source.match(/const DEFAULT_CATALOG_FILTERS[\s\S]*?(?=\n\nfunction navigateUrl)/)?.[0];
  assert.ok(declarations, "catalog filter URL helpers should be present");
  let replacedUrl = "";
  const window = {
    location: {
      pathname: "/missing-scenes",
      search: "?keep=yes&q=Crystal&provider=https%3A%2F%2Fexample.test%2Fgraphql&performer=remote%7C7&studio=remote%7C8&tag=remote%7C9&showIgnored=true&sort=title&direction=asc&page=3",
    },
    history: { replaceState: (_state, _title, url) => { replacedUrl = url; } },
  };
  const helpers = Function("window", `"use strict"; ${declarations}; return { readCatalogFilters, writeCatalogFilters, catalogQueryString, missingSceneDetailUrl, missingScenesCatalogUrl };`)(window);

  assert.deepEqual(helpers.readCatalogFilters(), {
    q: "Crystal",
    provider: "https://example.test/graphql",
    performer: "remote|7",
    studio: "remote|8",
    tag: "remote|9",
    showIgnored: true,
    sort: "title",
    direction: "asc",
    page: 3,
  });
  assert.equal(helpers.catalogQueryString(), "keep=yes&q=Crystal&provider=https%3A%2F%2Fexample.test%2Fgraphql&performer=remote%7C7&studio=remote%7C8&tag=remote%7C9&showIgnored=true&sort=title&direction=asc&page=3");
  assert.equal(helpers.missingSceneDetailUrl(17), "/missing-scene/17?keep=yes&q=Crystal&provider=https%3A%2F%2Fexample.test%2Fgraphql&performer=remote%7C7&studio=remote%7C8&tag=remote%7C9&showIgnored=true&sort=title&direction=asc&page=3");
  assert.equal(helpers.missingScenesCatalogUrl(), "/missing-scenes?keep=yes&q=Crystal&provider=https%3A%2F%2Fexample.test%2Fgraphql&performer=remote%7C7&studio=remote%7C8&tag=remote%7C9&showIgnored=true&sort=title&direction=asc&page=3");

  helpers.writeCatalogFilters({ q: "", provider: "", performer: "", studio: "", tag: "", showIgnored: false, sort: "release", direction: "desc", page: 1 });
  assert.equal(replacedUrl, "/missing-scenes?keep=yes", "default values should be omitted without losing unrelated parameters");

  window.location.pathname = "/performer/42";
  window.location.search = "?tab=ext%3Amissing-scenes&q=host-search&view=host-view&returnTo=host-return&ctcQ=test&ctcSort=title";
  assert.equal(helpers.readCatalogFilters().q, "test", "scoped tabs must read extension-owned parameters");
  replacedUrl = "";
  helpers.writeCatalogFilters({ q: "changed", provider: "", performer: "", studio: "", tag: "", showIgnored: false, sort: "title", direction: "desc", page: 1 });
  assert.equal(replacedUrl, "/performer/42?tab=ext%3Amissing-scenes&q=host-search&view=host-view&returnTo=host-return&ctcQ=changed&ctcSort=title");
  const scopedDetailUrl = helpers.missingSceneDetailUrl(17);
  assert.equal(scopedDetailUrl, "/missing-scene/17?tab=ext%3Amissing-scenes&q=host-search&view=host-view&returnTo=host-return&ctcQ=test&ctcSort=title&ctcReturnTo=%2Fperformer%2F42");
  window.location.pathname = "/missing-scene/17";
  window.location.search = scopedDetailUrl.slice(scopedDetailUrl.indexOf("?"));
  assert.equal(helpers.missingScenesCatalogUrl(), "/performer/42?tab=ext%3Amissing-scenes&q=host-search&view=host-view&returnTo=host-return&ctcQ=test&ctcSort=title");
  for (const unsafeReturnTo of ["https://evil.test/path", "//evil.test/path", "/performer/42/../43", "/performer/not-a-number"]) {
    window.location.search = `?ctcQ=test&ctcReturnTo=${encodeURIComponent(unsafeReturnTo)}`;
    assert.equal(helpers.missingScenesCatalogUrl(), "/missing-scenes?ctcQ=test", `must reject unsafe return path ${unsafeReturnTo}`);
  }

  window.location.search = "?q=test&showIgnored=maybe&sort=unknown&direction=sideways&page=-2";
  assert.deepEqual(helpers.readCatalogFilters(), {
    q: "test", provider: "", performer: "", studio: "", tag: "", showIgnored: false, sort: "release", direction: "desc", page: 1,
  });
});

test("carries the catalog query through missing-scene detail navigation", async () => {
  const source = await readFile(new URL("../extensions/CompleteTheCove/ui/CompleteTheCove.js", import.meta.url), "utf8");

  assert.match(source, /navigateUrl\(missingSceneDetailUrl\(scene\.id\)\)/);
  assert.match(source, /navigateUrl\(missingScenesCatalogUrl\(\)\)/);
  assert.doesNotMatch(source, /else onNavigate\(\{ page: "missing-scene", id: scene\.id \}\)/);
  assert.doesNotMatch(source, /else onNavigate\(\{ page: "missing-scenes" \}\)/);
});

test("URL-backs catalog filters in scoped entity tabs", async () => {
  const source = await readFile(new URL("../extensions/CompleteTheCove/ui/CompleteTheCove.js", import.meta.url), "utf8");

  assert.match(source, /useEffect\(\(\) => \{ writeCatalogFilters\(filters\); \}, \[filters\]\)/);
  assert.match(source, /SCOPED_CATALOG_FILTER_KEYS/);
  assert.match(source, /ctcReturnTo/);
});

test("filters scenes by provider and renders linked native-like detail entities", async () => {
  const source = await readFile(new URL("../extensions/CompleteTheCove/ui/CompleteTheCove.js", import.meta.url), "utf8");
  assert.match(source, /select\("provider", "All providers"/);
  assert.match(source, /Open \$\{providerLabel\(scene\.remoteEndpoint\)\} metadata page/);
  assert.match(source, /rounded-full border border-border bg-card px-3 py-1 text-xs text-accent/);
  assert.match(source, /scene\.coveStudioId/);
  assert.match(source, /tag\.coveTagId/);
  assert.match(source, /performerImageUrl\(performer\)/);
  assert.match(source, /PerformerTile/);
  assert.match(source, /TagBadge/);
  assert.match(source, /headerImage/);
  assert.match(source, /\/api\/studios\/\$\{scene\.coveStudioId\}\/image/);
});

test("hides ignored scenes by default and supports showing and restoring them", async () => {
  const source = await readFile(new URL("../extensions/CompleteTheCove/ui/CompleteTheCove.js", import.meta.url), "utf8");

  assert.match(source, /showIgnored: false/);
  assert.match(source, /Show ignored scenes/);
  assert.match(source, /showIgnored=\$\{filters\.showIgnored\}/);
  assert.match(source, /method: scene\.isIgnored \? "DELETE" : "POST"/);
  assert.match(source, /scene\.isIgnored \? "Unignore" : "Ignore"/);
  assert.match(source, /scene\.isIgnored \? Eye : EyeOff/);
  assert.match(source, /More catalog options/);
  assert.match(source, /h\(MoreHorizontal,/);
});

test("settings select multiple configured metadata providers", async () => {
  const source = await readFile(new URL("../extensions/CompleteTheCove/ui/CompleteTheCove.js", import.meta.url), "utf8");
  const manifest = JSON.parse(await readFile(new URL("../extensions/CompleteTheCove/extension.json", import.meta.url), "utf8"));
  const declaration = source.match(/function normalizeProviderEndpoint\(endpoint\) \{[\s\S]*?\n\}/)?.[0];

  assert.ok(manifest.settings.some((setting) => setting.name === "selected_metadata_endpoints"));
  assert.match(source, /\/api\/plugins\/complete-the-cove\/providers/);
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
  const source = await readFile(new URL("../extensions/CompleteTheCove/ui/CompleteTheCove.js", import.meta.url), "utf8");
  const stylesheet = await readFile(new URL("../extensions/CompleteTheCove/ui/CompleteTheCove.css", import.meta.url), "utf8");

  assert.match(source, /function RefreshSplitButton/);
  assert.match(source, /providers\.filter\(\(provider\) => provider\.enabled === true\)/);
  assert.match(source, /Refresh all providers/);
  assert.match(source, /Refresh from \$\{provider\.name/);
  assert.match(source, /providerEndpoint: provider\.endpoint/);
  assert.match(source, /request\("\/api\/plugins\/complete-the-cove\/providers"\)/);
  assert.match(source, /h\(RefreshSplitButton,/);
  assert.match(source, /function TargetRow\(\{ target, providers,/);
  assert.match(source, /refresh: \(provider\) => onRefresh\(target, provider\)/);
  assert.match(source, /entityId: String\(target\.entityId\), \.\.\.\(provider \? \{ providerEndpoint: provider\.endpoint \}/);
  assert.doesNotMatch(source, /disabled: refreshing \|\| enabled\.length === 0/);
  assert.match(stylesheet, /\.complete-the-cove-refresh-group/);
  assert.match(stylesheet, /\.complete-the-cove-refresh-menu/);
});
