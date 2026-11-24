/**
 * Site-wide contact details and navigation (issue #5).
 * Change contact info here only — header, menu, footer and buttons all read from this file.
 */
import type { Lang } from '../i18n/ui';

export const contact = {
  name: 'Itman Arif Hariri',
  email: 'arifhariri2@gmail.com',
  /** International format, no + or leading 0 (Indonesia = 62). */
  whatsapp: '628881571820',
  /** Pre-filled WhatsApp message per language. */
  waMessage: {
    id: 'Halo, saya ingin bertanya tentang les matematika.',
    en: "Hello, I'd like to ask about math lessons.",
  } satisfies Record<Lang, string>,
  emailSubject: {
    id: 'Pertanyaan tentang les matematika',
    en: 'Question about math lessons',
  } satisfies Record<Lang, string>,
};

export const waLink = (lang: Lang, message = contact.waMessage[lang]) =>
  `https://wa.me/${contact.whatsapp}?text=${encodeURIComponent(message)}`;

export const mailLink = (lang: Lang) =>
  `mailto:${contact.email}?subject=${encodeURIComponent(contact.emailSubject[lang])}`;

/** Main navigation. `key` maps to `nav.<key>` in src/i18n/ui.ts; `path` is relative to /<lang>/. */
export const nav = [
  { key: 'home', path: '' },
  { key: 'about', path: 'about' },
  { key: 'hire', path: 'hire' },
  { key: 'learn', path: 'learn' },
  { key: 'resources', path: 'resources' },
  { key: 'apps', path: 'apps' },
  { key: 'contact', path: 'contact' },
] as const;

/** Short links shown in the desktop header. */
export const headerNav = ['hire', 'learn', 'resources'] as const;
