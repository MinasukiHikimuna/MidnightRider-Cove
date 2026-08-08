import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import path from "node:path";

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: "../dist",
    emptyOutDir: true,
    lib: {
      entry: path.resolve(__dirname, "src/index.ts"),
      formats: ["es"],
      fileName: () => "ui.mjs",
    },
    cssCodeSplit: false,
    rollupOptions: {
      external: ["react", "react/jsx-runtime"],
      output: {
        assetFileNames: (asset) => asset.name?.endsWith(".css") ? "ui.css" : "[name][extname]",
      },
    },
  },
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: "src/test/setup.ts",
    css: true,
    restoreMocks: true,
  },
});
