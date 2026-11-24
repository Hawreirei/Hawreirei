export const languages = {
  id: 'Bahasa Indonesia',
  en: 'English',
} as const;

export type Lang = keyof typeof languages;
export const defaultLang: Lang = 'id';

export const ui = {
  id: {
    'site.title': 'Itman Arif Hariri — Guru Matematika',
    'site.description': 'Portofolio guru matematika: mengajar, les privat, dan sumber belajar gratis.',
    'nav.home': 'Beranda',
    'nav.about': 'Tentang',
    'nav.hire': 'Rekrut Saya',
    'nav.learn': 'Belajar Bersama Saya',
    'nav.resources': 'Sumber Belajar',
    'nav.contact': 'Kontak',
    'lang.switch': 'English',
    'home.role': 'Guru Matematika',
    'home.mission': 'Membantu siswa dari “saya tidak bisa” menjadi “saya bisa membuktikannya”.',
    'home.door.hire': 'Rekrut saya',
    'home.door.hire.desc': 'Untuk sekolah & kepala sekolah',
    'home.door.learn': 'Belajar bersama saya',
    'home.door.learn.desc': 'Program les privat',
    'home.door.resources': 'Sumber belajar gratis',
    'home.door.resources.desc': 'Lembar kerja & bank soal',
    'status.skeleton': 'Kerangka situs — konten sementara',
  },
  en: {
    'site.title': 'Itman Arif Hariri — Math Teacher',
    'site.description': 'Math teacher portfolio: teaching, private tutoring, and free resources.',
    'nav.home': 'Home',
    'nav.about': 'About',
    'nav.hire': 'Hire me',
    'nav.learn': 'Learn with me',
    'nav.resources': 'Resources',
    'nav.contact': 'Contact',
    'lang.switch': 'Bahasa Indonesia',
    'home.role': 'Math Teacher',
    'home.mission': 'Helping students go from “I can’t” to “I can prove it”.',
    'home.door.hire': 'Hire me',
    'home.door.hire.desc': 'For schools & principals',
    'home.door.learn': 'Learn with me',
    'home.door.learn.desc': 'Private tutoring programmes',
    'home.door.resources': 'Free resources',
    'home.door.resources.desc': 'Worksheets & question bank',
    'status.skeleton': 'Site skeleton — placeholder content',
  },
} as const;

export type UIKey = keyof (typeof ui)['id'];
