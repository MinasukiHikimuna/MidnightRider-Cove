import { defineConfig } from "vite";
import path from "node:path";

export default defineConfig({
  build: {
    outDir: "../dist",
    emptyOutDir: true,
    lib: {
      entry: path.resolve(__dirname, "SegmentStudio.js"),
      formats: ["es"],
      fileName: () => "ui.mjs",
    },
    rollupOptions: {
      external: id => id.startsWith("@cove/runtime/"),
    },
  },
});
