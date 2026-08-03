import { defineConfig } from "vitest/config";
import path from "node:path";

export default defineConfig({
  resolve: {
    alias: {
      "@cove/runtime/react": path.resolve(import.meta.dirname, "test/runtime-react.js"),
      "@cove/runtime/api": path.resolve(import.meta.dirname, "test/runtime-api.js"),
      "@cove/runtime/lucide-react": path.resolve(import.meta.dirname, "test/runtime-icons.js"),
    },
  },
  test: { environment: "jsdom", restoreMocks: true },
});
