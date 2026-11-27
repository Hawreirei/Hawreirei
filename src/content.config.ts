/**
 * Content collections.
 *
 * potw — Problem of the Week (issue #14).
 *   One folder per week, one file per language:
 *     src/content/potw/2026-11-23/id.mdx
 *     src/content/potw/2026-11-23/en.mdx
 *   Write math as $…$ / $$…$$. Use <Hint> and <Solution> directly (no imports needed).
 */
import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const levels = ['primary', 'edexcel', 'achievement-tests', 'tka-utbk-casn', 'olympiad'] as const;

const potw = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/potw' }),
  schema: z.object({
    /** Week start date (Monday). The newest date is "this week's" problem. */
    date: z.coerce.date(),
    title: z.string(),
    level: z.enum(levels),
    /** Optional big expression shown beside the problem, in TeX, e.g. "7^{2026}". */
    big: z.string().optional(),
    /** Short answer shown in the archive after the solution is opened (TeX allowed with $…$). */
    answer: z.string().optional(),
    /** Mark sample problems written as placeholders (shows a "Sample / Contoh" badge). */
    sample: z.boolean().default(false),
    /** Hide a problem without deleting it. */
    draft: z.boolean().default(false),
  }),
});

export const collections = { potw };
