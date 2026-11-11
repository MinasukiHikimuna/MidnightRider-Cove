import { defineCollection } from "astro:content";
import { docsLoader } from "@astrojs/starlight/loaders";
import { docsSchema } from "@astrojs/starlight/schema";

// Every page is generated from the extensions' own files in src/pages/, so this collection stays empty.
export const collections = {
  docs: defineCollection({ loader: docsLoader(), schema: docsSchema() }),
};
