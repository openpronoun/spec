import { env } from "node:process";
import { defineConfig } from "astro/config";
import starlight from "@astrojs/starlight";
import react from "@astrojs/react";
import vue from "@astrojs/vue";
import svelte from "@astrojs/svelte";
import solid from "@astrojs/solid-js";
import preact from "@astrojs/preact";
import alpine from "@astrojs/alpinejs";
import { visit } from "unist-util-visit";

// base is /spec on GitHub Pages, / locally.
// Set GITHUB_ACTIONS=true (auto-set in CI) to enable the /spec prefix.
const isCI = env.GITHUB_ACTIONS === "true";
const SITE = isCI ? "https://openpronoun.github.io" : "http://localhost:4321";
const BASE = isCI ? "/spec" : "/";

// Rewrites root-relative href="/..." links and src="/..." images in Markdown
// content to include the Astro base path. Astro does not do this automatically
// for inline MD links, or for images served from public/ (e.g. /media/...).
function rehypeRebaseLinks() {
  if (BASE === "/") return () => {};
  const prefix = BASE.replace(/\/$/, "");
  const rebase = (value) =>
    typeof value === "string" &&
    value.startsWith("/") &&
    !value.startsWith("//") &&
    !value.startsWith(`${prefix}/`)
      ? prefix + value
      : value;
  return (tree) => {
    visit(tree, "element", (node) => {
      if (node.tagName === "a") node.properties.href = rebase(node.properties?.href);
      if (node.tagName === "img") node.properties.src = rebase(node.properties?.src);
      if (node.tagName === "source") node.properties.srcSet = rebase(node.properties?.srcSet);
    });
    // Raw HTML blocks in Markdown (e.g. <figure><picture>…) arrive unparsed.
    visit(tree, "raw", (node) => {
      node.value = node.value.replace(
        /\b(src|srcset|href)="(\/(?!\/)[^"]*)"/g,
        (_, attr, url) => `${attr}="${rebase(url)}"`,
      );
    });
  };
}

export default defineConfig({
  site: SITE,
  base: BASE,
  output: "static",
  markdown: {
    rehypePlugins: [rehypeRebaseLinks],
  },
  integrations: [
    starlight({
      title: "OpenPronoun",
      description:
        "An open technical standard for modeling, parsing, storing, and displaying pronouns in software.",
      logo: {
        light: "./src/assets/wordmark-light.svg",
        dark: "./src/assets/wordmark-dark.svg",
        replacesTitle: true,
      },
      favicon: "/favicon.svg",
      customCss: [
        "@fontsource-variable/atkinson-hyperlegible-next",
        "@fontsource-variable/atkinson-hyperlegible-mono",
        "./src/styles/custom.css",
      ],
      components: {
        Hero: "./src/components/Hero.astro",
      },
      expressiveCode: {
        styleOverrides: {
          borderRadius: "0.75rem",
          codeFontFamily: "var(--sl-font-mono)",
          uiFontFamily: "var(--sl-font)",
        },
      },
      editLink: {
        baseUrl: "https://github.com/openpronoun/spec/edit/main/docs/",
      },
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
