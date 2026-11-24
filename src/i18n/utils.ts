import { ui, defaultLang, languages, type Lang, type UIKey } from './ui';

export const langs = Object.keys(languages) as Lang[];

export function isLang(value: unknown): value is Lang {
  return typeof value === 'string' && value in languages;
}

/** Translation helper: `const t = useTranslations(lang); t('nav.home')` */
export function useTranslations(lang: Lang) {
  return (key: UIKey): string => ui[lang][key] ?? ui[defaultLang][key];
}

const base = import.meta.env.BASE_URL.replace(/\/$/, '');

/** Build a URL for a page in a given language, respecting the site base path. */
export function localizedPath(lang: Lang, path = ''): string {
  const clean = path.replace(/^\/+|\/+$/g, '');
  return `${base}/${lang}/${clean ? clean + '/' : ''}`;
}

/** Same page, other language: swaps the language segment of the current URL. */
export function switchLangPath(url: URL, target: Lang): string {
  const rest = url.pathname.slice(base.length).replace(/^\/(id|en)(?=\/|$)/, '');
  return localizedPath(target, rest);
}

/** Path to a file in /public, respecting the base path. */
export function asset(path: string): string {
  return `${base}/${path.replace(/^\/+/, '')}`;
}
