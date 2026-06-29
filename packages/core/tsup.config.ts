import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.ts"],
  format: ["esm", "cjs"],
  dts: true,
  sourcemap: true,
  clean: true,
  target: "es2022",
  // Bundle the internal workspace package so consumers of @openpronoun/core
  // don't need @openpronoun/zod installed separately. The zod peer dep itself
  // remains external and is resolved via the workspace root node_modules.
  noExternal: ["@openpronoun/zod"],
});
