import { defineConfig } from "astro/config";
import starlight from "@astrojs/starlight";
import react from "@astrojs/react";
import vue from "@astrojs/vue";
import svelte from "@astrojs/svelte";
import solid from "@astrojs/solid-js";
import preact from "@astrojs/preact";
import alpine from "@astrojs/alpinejs";

// TODO(maintainer): set these for your GitHub Pages target.
// Project page:  site = "https://<owner>.github.io", base = "/<repo>"
// Custom domain: site = "https://openpronoun.org", base = "/"
const SITE = "https://openpronoun.github.io";
const BASE = "/spec";

export default defineConfig({
  site: SITE,
  base: BASE,
  output: "static",
  integrations: [
    starlight({
      title: "OpenPronoun",
      customCss: [
        // Relative path to your custom CSS file
        './src/styles/custom.css',
      ],
      social: [
        {
          icon: "github",
          label: "GitHub",
          href: "https://github.com/openpronoun/spec",
        },
      ],
      sidebar: [
        {
          label: "Specification",
          items: [{ autogenerate: { directory: "spec" } }],
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
