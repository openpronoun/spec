import { env } from "node:process";
import { defineConfig } from "astro/config";
import starlight from "@astrojs/starlight";
import react from "@astrojs/react";
import vue from "@astrojs/vue";
import svelte from "@astrojs/svelte";
import solid from "@astrojs/solid-js";
import preact from "@astrojs/preact";
import alpine from "@astrojs/alpinejs";

// base is /spec on GitHub Pages, / locally.
// Set GITHUB_ACTIONS=true (auto-set in CI) to enable the /spec prefix.
const isCI = env.GITHUB_ACTIONS === "true";
const SITE = isCI ? "https://openpronoun.github.io" : "http://localhost:4321";
const BASE = isCI ? "/spec" : "/";

export default defineConfig({
  site: SITE,
  base: BASE,
  output: "static",
  integrations: [
    starlight({
      title: "OpenPronoun",
      customCss: ["./src/styles/custom.css"],
      social: [
        {
          icon: "github",
          label: "GitHub",
          href: "https://github.com/openpronoun/spec",
        },
      ],
      sidebar: [
        {
          label: "Introduction",
          items: [{ autogenerate: { directory: "introduction" } }],
        },
        {
          label: "Specification",
          items: [{ autogenerate: { directory: "specification" } }],
        },
        {
          label: "Guidance",
          items: [{ autogenerate: { directory: "guidance" } }],
        },
        {
          label: "Project",
          items: [{ autogenerate: { directory: "project" } }],
        },
        {
          label: "Usage",
          items: [{ autogenerate: { directory: "usage" } }],
        },
      ],
    }),
    // JSX disambiguation: React and Preact share .jsx/.tsx — split by directory.
    react({ include: ["**/examples/react/**"] }),
    preact({ include: ["**/examples/preact/**"] }),
    vue(),
    svelte(),
    solid({ include: ["**/examples/solid/**"] }),
    alpine(),
  ],
});
