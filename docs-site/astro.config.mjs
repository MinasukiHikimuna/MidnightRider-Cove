import fs from "node:fs";
import starlight from "@astrojs/starlight";
import { defineConfig } from "astro/config";
import { extensionPath, guidePath, guideTree, loadExtensions } from "./src/lib/extensions.mjs";

const config = JSON.parse(fs.readFileSync(new URL("./site.config.json", import.meta.url), "utf8"));
// DOCS_SITE_BASE lets a custom domain serve the site from "/" later.
const base = process.env.DOCS_SITE_BASE ?? config.base;
const site = process.env.DOCS_SITE_URL ?? config.site;
const extensions = loadExtensions();

// Starlight adds the base path to sidebar links itself.
const sitePath = path => `/${path}`;
const extensionItem = extension => {
  const tree = guideTree(extension.guides);
  if (tree.length === 0) return { label: extension.name, link: sitePath(extensionPath(extension)) };
  return {
    label: extension.name,
    collapsed: true,
    items: [
      { label: "Overview", link: sitePath(extensionPath(extension)) },
      ...tree.map(({ guide, children }) =>
        children.length === 0
          ? { label: guide.title, link: sitePath(guidePath(extension, guide)) }
          : {
              label: guide.title,
              items: [guide, ...children].map(item => ({ label: item.title, link: sitePath(guidePath(extension, item)) })),
            },
      ),
    ],
  };
};

export default defineConfig({
  site,
  base,
  trailingSlash: "always",
  integrations: [
    starlight({
      title: config.title,
      description: config.description,
      customCss: ["./src/styles/theme.css"],
      social: [{ icon: "github", label: "GitHub", href: config.repository }],
      sidebar: [
        { label: "All extensions", link: sitePath("") },
        { label: "Extensions", items: extensions.filter(extension => !extension.developerTool).map(extensionItem) },
        { label: "Developer tools", items: extensions.filter(extension => extension.developerTool).map(extensionItem) },
      ].filter(group => !group.items || group.items.length > 0),
    }),
  ],
});
