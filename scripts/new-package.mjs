#!/usr/bin/env node

/**
 * Package generator for the @openpronoun/* monorepo.
 *
 * Usage:
 *   npm run new -- <name>           # standard package
 *   npm run new -- <name> --react   # React adapter (adds peer deps + core dep)
 *
 * Scaffolds packages/<name>/ with all files needed to immediately pass
 * build, typecheck, test, and check:exports.
 */

import { existsSync, mkdirSync, writeFileSync } from "node:fs";
import { resolve, join } from "node:path";
import { argv, exit, cwd } from "node:process";

// ---------------------------------------------------------------------------
// Parse args
// ---------------------------------------------------------------------------
const args = argv.slice(2);
const flags = new Set(args.filter((a) => a.startsWith("--")));
const positional = args.filter((a) => !a.startsWith("--"));

const name = positional[0];
const isReact = flags.has("--react");

if (!name) {
  console.error("Usage: npm run new -- <name> [--react]");
  exit(1);
}

if (!/^[a-z][a-z0-9-]*$/.test(name)) {
  console.error(
    `Invalid package name "${name}". Use lowercase alphanumeric characters and hyphens only, starting with a letter.`,
  );
  exit(1);
}

const root = resolve(cwd());
const pkgDir = join(root, "packages", name);

if (existsSync(pkgDir)) {
  console.error(`Directory already exists: packages/${name}`);
  exit(1);
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
function write(relPath, content) {
  const full = join(pkgDir, relPath);
  const dir = full.substring(0, full.lastIndexOf("/"));
  mkdirSync(dir, { recursive: true });
  writeFileSync(full, content, "utf8");
}

function json(obj) {
  return JSON.stringify(obj, null, 2) + "\n";
}

// ---------------------------------------------------------------------------
// package.json
// ---------------------------------------------------------------------------
const pkg = {
  name: `@openpronoun/${name}`,
  version: "0.0.0",
  description: "PLACEHOLDER — owned by maintainer.",
  license: "MIT",
  type: "module",
  sideEffects: false,
  publishConfig: { access: "public", provenance: true },
  files: ["dist"],
  exports: {
    ".": {
      import: {
        types: "./dist/index.d.ts",
        default: "./dist/index.js",
      },
      require: {
        types: "./dist/index.d.cts",
        default: "./dist/index.cjs",
      },
    },
  },
  main: "./dist/index.cjs",
  module: "./dist/index.js",
  types: "./dist/index.d.ts",
  scripts: {
    build: "tsup",
    dev: "tsup --watch",
    test: "vitest run",
    lint: "eslint .",
    typecheck: "tsc --noEmit",
    "check:exports": "publint && attw --pack .",
  },
  devDependencies: {
    "@arethetypeswrong/cli": "latest",
    eslint: "latest",
    "typescript-eslint": "latest",
    "@eslint/js": "latest",
    publint: "latest",
    tsup: "latest",
    typescript: "latest",
    vitest: "latest",
  },
};

if (isReact) {
  pkg.peerDependencies = {
    react: ">=18",
  };
  pkg.dependencies = {
    "@openpronoun/core": "^0.0.0",
  };
  pkg.devDependencies = {
    ...pkg.devDependencies,
    react: "latest",
    "react-dom": "latest",
    "@types/react": "latest",
    "@types/react-dom": "latest",
  };
}

write("package.json", json(pkg));

// ---------------------------------------------------------------------------
// tsconfig.json
// ---------------------------------------------------------------------------
const tsconfig = {
  extends: "../../tsconfig.base.json",
  compilerOptions: {
    outDir: "./dist",
    rootDir: "./src",
    ...(isReact
      ? {
          lib: ["ES2022", "DOM", "DOM.Iterable"],
          jsx: "react-jsx",
        }
      : {}),
  },
  include: ["src"],
};

write("tsconfig.json", json(tsconfig));

// ---------------------------------------------------------------------------
// tsup.config.ts
// ---------------------------------------------------------------------------
const tsupExternal = isReact
  ? `
  external: ["react", "react/jsx-runtime"],`
  : "";

write(
  "tsup.config.ts",
  `import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.ts${isReact ? "x" : ""}"],
  format: ["esm", "cjs"],
  dts: true,
  sourcemap: true,
  clean: true,
  target: "es2022",${tsupExternal}
});
`,
);

// ---------------------------------------------------------------------------
// eslint.config.js (extends root)
// ---------------------------------------------------------------------------
write(
  "eslint.config.js",
  `import rootConfig from "../../eslint.config.js";

export default rootConfig;
`,
);

// ---------------------------------------------------------------------------
// Source files
// ---------------------------------------------------------------------------
if (isReact) {
  write(
    "src/index.tsx",
    `// PLACEHOLDER — implementation owned by the maintainer. Do not build out.

import { placeholder } from "@openpronoun/core";

export function Pronoun(): React.JSX.Element {
  const value = placeholder();
  return <span data-openpronoun>{value}</span>;
}
`,
  );

  write(
    "src/index.test.tsx",
    `import { describe, it, expect } from "vitest";
import { Pronoun } from "./index.js";

describe("${name}", () => {
  it("exports Pronoun component", () => {
    expect(Pronoun).toBeDefined();
    expect(typeof Pronoun).toBe("function");
  });
});
`,
  );
} else {
  write(
    "src/index.ts",
    `// PLACEHOLDER — implementation owned by the maintainer. Do not build out.

/**
 * Placeholder export. Returns a static string.
 * The maintainer replaces this with the real implementation.
 */
export function placeholder(): string {
  return "they/them";
}
`,
  );

  write(
    "src/index.test.ts",
    `import { describe, it, expect } from "vitest";
import { placeholder } from "./index.js";

describe("${name}", () => {
  it("placeholder returns a string", () => {
    expect(typeof placeholder()).toBe("string");
  });
});
`,
  );
}

// ---------------------------------------------------------------------------
// README.md
// ---------------------------------------------------------------------------
write(
  "README.md",
  `# @openpronoun/${name}

> PLACEHOLDER — owned by maintainer.

Part of the [OpenPronoun](https://github.com/openpronoun/spec) ecosystem.
`,
);

// ---------------------------------------------------------------------------
// Done
// ---------------------------------------------------------------------------
console.log(`✓ Created packages/${name}/`);
console.log(`  → package.json (@openpronoun/${name})`);
console.log(`  → tsconfig.json, tsup.config.ts, eslint.config.js`);
console.log(`  → src/index.ts${isReact ? "x" : ""}, src/index.test.ts${isReact ? "x" : ""}`);
console.log(`  → README.md`);
if (isReact) {
  console.log(`  → React mode: peer dep on react, dependency on @openpronoun/core`);
}
console.log(`\nRun \`npm install\` to link the new workspace.`);
