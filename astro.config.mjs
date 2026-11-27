// @ts-check
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import { satteri } from '@astrojs/markdown-satteri';
import { katexPlugin } from './src/lib/satteri-katex.mjs';

// GitHub Pages (project site) for now.
// When the custom domain is ready (issue #17): set `site` to the domain and remove `base`.
export default defineConfig({
  site: 'https://hawreirei.github.io',
  base: '/Hawreirei',
  trailingSlash: 'always',
  i18n: {
    locales: ['id', 'en'],
    defaultLocale: 'id',
    routing: {
      prefixDefaultLocale: true,
      redirectToDefaultLocale: false,
    },
  },
  // Math in Markdown/MDX: $inline$ and $$display$$ rendered with KaTeX at build time (issue #11).
  // MDX inherits this processor.
  markdown: {
    processor: satteri({ features: { math: true }, hastPlugins: [katexPlugin] }),
  },
  integrations: [
    mdx(),
    // Sitemap of public pages only (issue #15). Test/preview pages and the root redirect are left out.
    sitemap({
      filter: (page) =>
        !/\/(styleguide|preview|math-demo)\//.test(page) && !/\/404\/?$/.test(page) && !/\/Hawreirei\/$/.test(page),
      i18n: { defaultLocale: 'id', locales: { id: 'id-ID', en: 'en-US' } },
    }),
  ],
});
