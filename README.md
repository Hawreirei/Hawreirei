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

## Add a Problem of the Week

Each week is one folder with one file per language:

```
src/content/potw/2026-11-30/id.mdx
src/content/potw/2026-11-30/en.mdx
```

Copy last week's folder, rename it to the new Monday's date, and edit:

```mdx
---
date: 2026-11-30        # Monday of the week; the newest date is "this week"
title: Judul soal
level: olympiad         # primary | edexcel | achievement-tests | tka-utbk-casn | olympiad
big: "7^{2026}"         # optional big expression beside the problem (TeX)
answer: "$9$"           # optional short answer
sample: false           # true shows a "Sample / Contoh" badge
draft: false            # true hides it without deleting
---

Soal di sini. Math: $x^2$ inline, $$\frac{a}{b}$$ on its own line.

<Hint>Petunjuk singkat.</Hint>

<Solution>Pembahasan lengkap.</Solution>
```

`<Hint>` and `<Solution>` need no import and label themselves in the page's language.
Problems dated in the future stay hidden until the first build on or after that date.
The four problems marked `sample: true` are placeholders — replace or delete them.

