# Itman Arif Hariri — Math Teacher Portfolio

Bilingual (Bahasa Indonesia / English) portfolio website for a math teacher, built with [Astro](https://astro.build) and hosted on GitHub Pages.

- Live (after first deploy): https://hawreirei.github.io/Hawreirei/
- Art direction: **VOID / 01** — futuristic monochrome (see issue #3)
- Build plan: GitHub issues #1–#17

## Run locally

Requires Node.js 22.23.4 or newer.

```bash
npm install
npm run dev       # http://localhost:4321/Hawreirei/
npm run build     # outputs static site to dist/
npm run preview   # serve the built site
```

## Structure

```
src/
  i18n/        ui.ts (all UI text in ID + EN), utils.ts (translation & URL helpers)
  layouts/     BaseLayout.astro (html head, header, footer)
  pages/
    index.astro        root → redirects to /id/ or /en/
    [lang]/index.astro homepage for each language
    404.astro
  components/  reusable UI (coming in Phase 1)
  content/     lessons, questions, Problem of the Week (coming in Phase 3)
  styles/      global.css
public/        static files (photos, PDFs)
```

## Languages

URLs are `/id/...` (default) and `/en/...`. All interface text lives in `src/i18n/ui.ts`;
add a key to both `id` and `en` objects and use it with `t('key')`.

## Custom domain (later)

In `astro.config.mjs`, set `site` to the new domain and remove `base` (issue #17).
