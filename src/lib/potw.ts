/** Problem of the Week helpers (issue #14). */
import { getCollection, type CollectionEntry } from 'astro:content';
import type { Lang } from '../i18n/ui';
import { programmes } from '../data/programmes';

export type Problem = CollectionEntry<'potw'>;

/** "2026-11-23/id" → "2026-11-23" */
export const weekOf = (p: Problem) => p.id.split('/')[0];
export const langOf = (p: Problem) => p.id.split('/')[1] as Lang;

/**
 * Published problems for one language, newest first.
 * Drafts and future-dated weeks are left out, so problems can be written ahead of time:
 * each appears on the first build on/after its date.
 */
export async function getProblems(lang: Lang): Promise<Problem[]> {
  const now = new Date();
  const all = await getCollection('potw', (p: Problem) => langOf(p) === lang && !p.data.draft && p.data.date <= now);
  return all.sort((a: Problem, b: Problem) => b.data.date.getTime() - a.data.date.getTime());
}

export const levelLabel = (slug: string, lang: Lang) => programmes.find((p) => p.slug === slug)?.title[lang] ?? slug;

export const formatDate = (d: Date, lang: Lang) =>
  new Intl.DateTimeFormat(lang === 'id' ? 'id-ID' : 'en-GB', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' }).format(d);
