// @ts-check
import { defineConfig } from 'astro/config';

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
});
