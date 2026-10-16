import { defineConfig } from "vitest/config";
import preact from "@preact/preset-vite";

export default defineConfig({
  plugins: [preact({ reactAliasesEnabled: false })],
  test: {
    environment: "jsdom",
    globals: true,
  },
});
