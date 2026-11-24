/**
 * Tutoring programmes (used on the homepage and, later, the "Learn with me" page — issue #9).
 * `slug` becomes the anchor on the Learn page: /<lang>/learn/#<slug>
 */
import type { Lang } from '../i18n/ui';

export interface Programme {
  slug: string;
  title: Record<Lang, string>;
  meta: Record<Lang, string>;
}

export const programmes: Programme[] = [
  {
    slug: 'primary',
    title: { id: 'Primary', en: 'Primary' },
    meta: { id: 'SD · dasar yang kuat', en: 'Primary school · strong foundations' },
  },
  {
    slug: 'edexcel',
    title: { id: 'Pearson Edexcel', en: 'Pearson Edexcel' },
    meta: { id: 'Kurikulum internasional', en: 'International curriculum' },
  },
  {
    slug: 'achievement-tests',
    title: { id: 'Achievement Test', en: 'Achievement Tests' },
    meta: { id: 'Pearson · persiapan tes', en: 'Pearson · test preparation' },
  },
  {
    slug: 'tka-utbk-casn',
    title: { id: 'TKA · UTBK · CASN', en: 'TKA · UTBK · CASN' },
    meta: { id: 'Persiapan ujian', en: 'Exam preparation' },
  },
  {
    slug: 'olympiad',
    title: { id: 'Olimpiade', en: 'Olympiad' },
    meta: { id: 'OSN · KSN · kompetisi', en: 'OSN · KSN · competitions' },
  },
];

/**
 * Stats strip on the homepage. Leave EMPTY until the owner gives real figures —
 * the strip is hidden while this list is empty. Example entry:
 *   { value: '8', unit: '+', label: { id: 'Tahun mengajar', en: 'Years teaching' } }
 */
export const stats: { value: string; unit?: string; label: Record<Lang, string> }[] = [];
