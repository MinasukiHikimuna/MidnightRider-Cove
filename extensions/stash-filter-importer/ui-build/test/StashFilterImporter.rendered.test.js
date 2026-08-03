import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, expect, test } from "vitest";
import { extensionFetch } from "@cove/runtime/api";
import extension from "../../src/StashFilterImporter/ui/StashFilterImporter.js";

const filter = {
  sourceId: "1", name: "Retry me", sourceMode: "SCENES", status: "direct", importable: true,
  payload: { mode: "Videos", name: "Retry me", findFilter: "{}", objectFilter: "{}", uiOptions: "{}" }, rules: [],
};
const jsonResponse = (body, status = 200) => ({ ok: status < 300, status, json: async () => body });

beforeEach(() => {
  extensionFetch.mockReset();
  localStorage.clear();
});

test("renders the real importer and retries a failed selected import", async () => {
  let posts = 0;
  extensionFetch.mockImplementation(async (url, options) => {
    if (url === "/api/plugins/com.midnightrider.stash-filter-importer/analyze") {
      expect(options).toEqual({
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ stashDbPath: "/tmp/stash.sqlite" }),
      });
      return jsonResponse({ filters: [filter] });
    }
    if (url === "/api/savedfilters?mode=Videos") {
      expect(options).toEqual({ headers: { "Content-Type": "application/json" } });
      return jsonResponse([]);
    }
    if (url === "/api/savedfilters") {
      posts += 1;
      expect(options).toEqual({
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(filter.payload),
      });
      return posts === 1
        ? jsonResponse({ message: "Temporary failure" }, 500)
        : { ok: true, status: 204, json: async () => null };
    }
    throw new Error(`Unexpected request ${url}`);
  });
  const user = userEvent.setup();
  const Page = extension.components.StashFilterImporterPage;
  render(React.createElement(Page));

  await user.type(screen.getByLabelText("Server-side Stash database path"), "/tmp/stash.sqlite");
  await user.click(screen.getByRole("button", { name: "Analyze" }));
  await screen.findByRole("checkbox", { name: "Select Retry me" });
  await user.click(screen.getByRole("checkbox", { name: "Select Retry me" }));
  expect(screen.getByText("1 selected")).toBeTruthy();

  await user.click(screen.getByRole("button", { name: "Import selected" }));
  await screen.findByText("Temporary failure");
  expect(screen.getByRole("checkbox", { name: "Select Retry me" }).disabled).toBe(false);
  expect(screen.getByText("1 selected")).toBeTruthy();

  await user.click(screen.getByRole("button", { name: "Import selected" }));
  expect(await screen.findByLabelText("Imported")).toBeTruthy();
  expect(posts).toBe(2);
  expect(screen.queryByText("Temporary failure")).toBeNull();
  expect(extensionFetch.mock.calls.map(([url]) => url)).toEqual([
    "/api/plugins/com.midnightrider.stash-filter-importer/analyze",
    "/api/savedfilters?mode=Videos",
    "/api/savedfilters?mode=Videos",
    "/api/savedfilters",
    "/api/savedfilters?mode=Videos",
    "/api/savedfilters",
  ]);
});
