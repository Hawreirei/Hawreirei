/**
 * Apps shown on the portfolio (owner's selection). Screenshots in src/assets/apps/.
 * To add an app: add a screenshot (1440×900) and an entry here.
 */
import type { ImageMetadata } from 'astro';
import type { Lang } from '../i18n/ui';
import fractionPuzzle from '../assets/apps/fraction-pixel-puzzle.png';
import factorFrenzy from '../assets/apps/factor-frenzy.png';
import rocketRace from '../assets/apps/maths-rocket-race.png';

export interface App {
  slug: string;
  title: string;
  kind: Record<Lang, string>;
  description: Record<Lang, string>;
  tags: Record<Lang, string[]>;
  demo: string;
  code: string;
  image: ImageMetadata;
}

export const apps: App[] = [
  {
    slug: 'fraction-pixel-puzzle',
    title: 'Mystery Pixel Fraction Puzzle',
    kind: { id: 'Alat guru', en: 'Teacher tool' },
    description: {
      id: 'Mengubah gambar apa pun menjadi teka-teki piksel: siswa menjawab soal pecahan untuk mewarnai setiap kotak dan menemukan gambar rahasianya. Lembar siswa dan kunci jawaban siap cetak.',
      en: 'Turns any picture into a mystery pixel puzzle: students solve fraction questions to colour each cell and reveal the hidden picture. Student sheet and answer key ready to print.',
    },
    tags: { id: ['Pecahan', 'Siap cetak', 'Alat guru'], en: ['Fractions', 'Printable', 'Teacher tool'] },
    demo: 'https://hawreirei.github.io/Coloring-Generator/',
    code: 'https://github.com/Hawreirei/Coloring-Generator',
    image: fractionPuzzle,
  },
  {
    slug: 'factor-frenzy',
    title: 'Factor Frenzy',
    kind: { id: 'Game kelas', en: 'Classroom game' },
    description: {
      id: 'Balapan matematika untuk 2–3 pemain tentang pasangan faktor serta perkalian dan pembagian dengan 10 dan 100. Semua mendapat soal yang sama — jawaban benar tercepat mendapat bonus.',
      en: 'A two- or three-player maths race on factor pairs and multiplying and dividing by 10 and 100. Everyone gets the same question — the fastest correct answer earns the bonus.',
    },
    tags: { id: ['Faktor', 'Multipemain', 'Game'], en: ['Factors', 'Multiplayer', 'Game'] },
    demo: 'https://hawreirei.github.io/frenzy/',
    code: 'https://github.com/Hawreirei/frenzy',
    image: factorFrenzy,
  },
  {
    slug: 'maths-rocket-race',
    title: 'Maths Rocket Race',
    kind: { id: 'Game kelas', en: 'Classroom game' },
    description: {
      id: 'Latihan perkalian (1×1 sampai 12×12) dan persen untuk 1–4 pemain. Jawab cepat, jaga streak, dan isi kekuatan hero untuk memenangkan balapan.',
      en: "Times tables (1×1 to 12×12) and percentages for 1–4 players. Answer fast, keep a streak and charge your hero's power to win the race.",
    },
    tags: { id: ['Perkalian', 'Persen', 'Game'], en: ['Times tables', 'Percentages', 'Game'] },
    demo: 'https://hawreirei.github.io/Basic-Multiplication/',
    code: 'https://github.com/Hawreirei/Basic-Multiplication',
    image: rocketRace,
  },
];
