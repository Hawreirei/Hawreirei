/**
 * Tutoring programmes (homepage rows + the "Learn with me" page — issue #9).
 * `slug` becomes the anchor on the Learn page: /<lang>/learn/#<slug>
 * `topics` follow the standard syllabus of each curriculum/exam. Intro copy is placeholder for owner review.
 */
import type { Lang } from '../i18n/ui';

type Viz = 'squares' | 'lissajous' | 'waves' | 'tunnel' | 'phyllotaxis';

export interface Programme {
  slug: string;
  title: Record<Lang, string>;
  meta: Record<Lang, string>;
  intro: Record<Lang, string>;
  topics: Record<Lang, string[]>;
  viz: Viz;
}

export const programmes: Programme[] = [
  {
    slug: 'primary',
    title: { id: 'Primary', en: 'Primary' },
    meta: { id: 'SD · dasar yang kuat', en: 'Primary school · strong foundations' },
    intro: {
      id: 'Membangun dasar yang kuat: paham konsep bilangan, lancar berhitung, dan percaya diri menghadapi soal cerita.',
      en: 'Building strong foundations: real number sense, fluent calculation, and confidence with word problems.',
    },
    topics: {
      id: ['Bilangan & nilai tempat', 'Operasi hitung & perkalian', 'Pecahan, desimal & persen', 'Geometri & pengukuran', 'Data & diagram', 'Soal cerita'],
      en: ['Number & place value', 'Operations & times tables', 'Fractions, decimals & percentages', 'Geometry & measurement', 'Data & charts', 'Word problems'],
    },
    viz: 'squares',
  },
  {
    slug: 'edexcel',
    title: { id: 'Pearson Edexcel', en: 'Pearson Edexcel' },
    meta: { id: 'Kurikulum internasional', en: 'International curriculum' },
    intro: {
      id: 'Pendampingan untuk kurikulum Pearson Edexcel — dari iPrimary dan iLowerSecondary sampai IGCSE — termasuk teknik menjawab ujian.',
      en: 'Support for the Pearson Edexcel curriculum — from iPrimary and iLowerSecondary to IGCSE — including exam technique.',
    },
    topics: {
      id: ['Bilangan', 'Aljabar', 'Geometri & pengukuran', 'Statistika & peluang', 'Latihan soal tahun lalu', 'Teknik menjawab ujian'],
      en: ['Number', 'Algebra', 'Geometry & measures', 'Statistics & probability', 'Past-paper practice', 'Exam technique'],
    },
    viz: 'lissajous',
  },
  {
    slug: 'achievement-tests',
    title: { id: 'Achievement Test', en: 'Achievement Tests' },
    meta: { id: 'Pearson · persiapan tes', en: 'Pearson · test preparation' },
    intro: {
      id: 'Persiapan Pearson Achievement Test akhir tahun: mengulang materi setahun, memahami format tes, dan berlatih dengan waktu.',
      en: 'Preparation for the end-of-year Pearson Achievement Tests: reviewing the year’s content, understanding the format, and timed practice.',
    },
    topics: {
      id: ['Review materi satu tahun', 'Format & jenis soal', 'Latihan dengan batas waktu', 'Strategi mengecek jawaban', 'Menutup celah pemahaman'],
      en: ['Review of the year’s content', 'Test format & question types', 'Timed practice', 'Answer-checking strategies', 'Closing knowledge gaps'],
    },
    viz: 'waves',
  },
  {
    slug: 'tka-utbk-casn',
    title: { id: 'TKA · UTBK · CASN', en: 'TKA · UTBK · CASN' },
    meta: { id: 'Persiapan ujian', en: 'Exam preparation' },
    intro: {
      id: 'Persiapan bagian matematika dan numerik untuk TKA, UTBK-SNBT, dan SKD CASN — konsep, pola soal, dan kecepatan.',
      en: 'Preparation for the maths and numerical sections of TKA, UTBK-SNBT and the CASN SKD — concepts, question patterns and speed.',
    },
    topics: {
      id: ['TKA Matematika', 'UTBK: Penalaran Matematika', 'UTBK: Pengetahuan Kuantitatif', 'SKD CASN: TIU numerik', 'Deret, perbandingan & soal cerita', 'Simulasi & manajemen waktu'],
      en: ['TKA Mathematics', 'UTBK: Mathematical Reasoning', 'UTBK: Quantitative Knowledge', 'CASN SKD: numerical TIU', 'Sequences, ratios & word problems', 'Simulations & time management'],
    },
    viz: 'tunnel',
  },
  {
    slug: 'olympiad',
    title: { id: 'Olimpiade', en: 'Olympiad' },
    meta: { id: 'OSN · KSN · kompetisi', en: 'OSN · KSN · competitions' },
    intro: {
      id: 'Untuk siswa yang suka tantangan: strategi pemecahan masalah dan latihan soal bergaya OSN/KSN dan kompetisi.',
      en: 'For students who love a challenge: problem-solving strategies and practice in the style of OSN/KSN and other competitions.',
    },
    topics: {
      id: ['Teori bilangan', 'Kombinatorika', 'Geometri', 'Aljabar & ketaksamaan', 'Strategi pemecahan masalah', 'Menulis solusi & bukti'],
      en: ['Number theory', 'Combinatorics', 'Geometry', 'Algebra & inequalities', 'Problem-solving strategies', 'Writing solutions & proofs'],
    },
    viz: 'phyllotaxis',
  },
];

/**
 * Stats strip on the homepage. Leave EMPTY until the owner gives real figures —
 * the strip is hidden while this list is empty. Example entry:
 *   { value: '8', unit: '+', label: { id: 'Tahun mengajar', en: 'Years teaching' } }
 */
export const stats: { value: string; unit?: string; label: Record<Lang, string> }[] = [];

/** "How lessons work" journey on the Learn page. PLACEHOLDER copy for owner review. */
export const journey: { title: Record<Lang, string>; text: Record<Lang, string> }[] = [
  {
    title: { id: 'Hubungi', en: 'Contact' },
    text: { id: 'Kirim pesan WhatsApp atau email: ceritakan kelas, kurikulum, dan targetnya.', en: 'Send a WhatsApp message or email: tell me the grade, curriculum and goal.' },
  },
  {
    title: { id: 'Diagnosa', en: 'Diagnose' },
    text: { id: 'Tes singkat untuk melihat apa yang sudah dan belum dipahami.', en: 'A short check to see what is already understood and what is not.' },
  },
  {
    title: { id: 'Rencana', en: 'Plan' },
    text: { id: 'Rencana belajar sesuai target: nilai rapor, ujian, atau olimpiade.', en: 'A learning plan for the goal: school grades, an exam, or an olympiad.' },
  },
  {
    title: { id: 'Belajar & evaluasi', en: 'Learn & review' },
    text: { id: 'Konsep dulu, latihan bertahap, lalu cek kemajuan secara berkala.', en: 'Concept first, step-by-step practice, then regular progress checks.' },
  },
];

/**
 * FAQ on the Learn page. Online + in-person confirmed by the owner; prices and schedule deliberately
 * left as "ask on WhatsApp" until the owner gives them.
 */
export const faq: { q: Record<Lang, string>; a: Record<Lang, string> }[] = [
  {
    q: { id: 'Untuk kelas berapa saja?', en: 'Which grades do you teach?' },
    a: { id: 'Dari SD (Primary) sampai SMA, persiapan ujian (TKA, UTBK, CASN), kurikulum Pearson Edexcel, dan olimpiade.', en: 'From primary school to senior high, exam prep (TKA, UTBK, CASN), the Pearson Edexcel curriculum, and olympiad.' },
  },
  {
    q: { id: 'Bagaimana jadwalnya?', en: 'How does scheduling work?' },
    a: { id: 'Jadwal disepakati bersama. Kirim pesan WhatsApp untuk menanyakan waktu yang tersedia.', en: 'The schedule is agreed together. Send a WhatsApp message to ask about available times.' },
  },
  {
    q: { id: 'Online atau tatap muka?', en: 'Online or in person?' },
    a: { id: 'Keduanya bisa: online maupun tatap muka. Hubungi saya lewat WhatsApp untuk mengatur format dan lokasinya.', en: 'Both: online and in person. Message me on WhatsApp to arrange the format and location.' },
  },
  {
    q: { id: 'Berapa biayanya?', en: 'How much does it cost?' },
    a: { id: 'Biaya tergantung program dan jumlah pertemuan. Hubungi saya untuk informasi lengkap.', en: 'It depends on the programme and number of sessions. Contact me for full details.' },
  },
  {
    q: { id: 'Materi belajarnya dari mana?', en: 'What materials do you use?' },
    a: { id: 'Materi disesuaikan dengan kurikulum dan target siswa, termasuk lembar kerja dan aplikasi web buatan saya sendiri.', en: 'Materials follow the student’s curriculum and goal, including worksheets and web apps I built myself.' },
  },
];
