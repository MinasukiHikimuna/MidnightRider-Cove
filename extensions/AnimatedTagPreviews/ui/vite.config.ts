import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import path from "node:path";

export default defineConfig(({ mode }) => ({
  plugins: [react()],
  resolve: mode === "test" ? {
    alias: {
      "@cove/runtime/components": path.resolve(__dirname, "src/test/runtime-components.tsx"),
    },
  } : undefined,
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
      external: [
        "react",
        "react/jsx-runtime",
        "@cove/runtime/components",
      ],
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
}));
