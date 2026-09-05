import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import path from "node:path";

export default defineConfig(({ mode }) => ({
  plugins: [react()],
  resolve:
    mode === "test"
      ? {
          alias: {
            "@cove/runtime/api": path.resolve(
              __dirname,
              "src/test/runtime-api.ts",
            ),
            "@cove/runtime/components": path.resolve(
              __dirname,
              "src/test/runtime-components.tsx",
            ),
            "@cove/runtime/lucide-react": path.resolve(
              __dirname,
              "src/test/runtime-icons.tsx",
            ),
          },
        }
      : undefined,
  build: {
    outDir: "../dist",
    emptyOutDir: true,
    lib: {
      entry: path.resolve(__dirname, "src/index.tsx"),
      formats: ["es"],
      fileName: () => "DataQuality.js",
    },
    cssCodeSplit: false,
    rollupOptions: {
      external: [
        "react",
        "react/jsx-runtime",
        "@cove/runtime/api",
        "@cove/runtime/components",
        "@cove/runtime/lucide-react",
      ],
      output: {
        assetFileNames: (asset) =>
          asset.name?.endsWith(".css") ? "DataQuality.css" : "[name][extname]",
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
