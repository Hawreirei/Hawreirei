/**
 * Text effects (warm editorial blend):
 *  - [data-roll]  headings roll in letter by letter, and roll again on hover
 *  - [data-fill]  paragraph words go from muted to full ink as you scroll through it
 * Inner elements (e.g. <span class="serif">) are kept. Screen readers get the original text.
 * Nothing is split with reduced motion.
 */
import { onTick, prefersReducedMotion } from './core';

type Wrap = (text: string, index: { n: number }) => DocumentFragment;

/** Original text (not CSS-uppercased), with spaces at line breaks and between block children. */
function readableText(node: Node): string {
  let out = '';
  node.childNodes.forEach((child) => {
    if (child.nodeType === Node.TEXT_NODE) out += child.textContent ?? '';
    else if (child.nodeName === 'BR') out += ' ';
    else if (child.nodeType === Node.ELEMENT_NODE) {
      const block = !getComputedStyle(child as Element).display.startsWith('inline');
      out += (block ? ' ' : '') + readableText(child) + (block ? ' ' : '');
    }
  });
  return out;
}

/** Replace every text node inside `el` using `wrap`, keeping element structure. */
function splitText(el: HTMLElement, wrap: Wrap) {
  const label = readableText(el).replace(/\s+/g, ' ').trim();
  const visual = document.createElement('span');
  visual.setAttribute('aria-hidden', 'true');
  visual.className = 'split-visual';
  while (el.firstChild) visual.appendChild(el.firstChild);

  const index = { n: 0 };
  const walk = (node: Node) => {
    [...node.childNodes].forEach((child) => {
      if (child.nodeType === Node.TEXT_NODE) {
        const text = child.textContent ?? '';
        if (text.trim() || text.includes(' ')) child.replaceWith(wrap(text, index));
      } else if (child.nodeType === Node.ELEMENT_NODE && (child as Element).tagName !== 'BR') {
        walk(child);
      }
    });
  };
  walk(visual);

  const sr = document.createElement('span');
  sr.className = 'sr-only';
  sr.textContent = label;
  el.append(sr, visual);
  return index.n;
}

/* ---------- Rolling letters ---------- */
const rollWrap: Wrap = (text, index) => {
  const frag = document.createDocumentFragment();
  text.split(/(\s+)/).forEach((part) => {
    if (!part) return;
    if (/^\s+$/.test(part)) {
      frag.append(document.createTextNode(' '));
      return;
    }
    const word = document.createElement('span');
    word.className = 'rw';
    [...part].forEach((ch) => {
      const cell = document.createElement('span');
      cell.className = 'rc';
      const inner = document.createElement('span');
      inner.className = 'rc-in';
      inner.dataset.ch = ch;
      inner.textContent = ch;
      inner.style.setProperty('--ci', String(index.n++));
      cell.append(inner);
      word.append(cell);
    });
    frag.append(word);
  });
  return frag;
};

export function initRoll(root: ParentNode = document) {
  if (prefersReducedMotion()) return;
  const els = [...root.querySelectorAll<HTMLElement>('[data-roll]:not([data-roll-ready])')];
  if (!els.length) return;
  const io = new IntersectionObserver(
    (entries) =>
      entries.forEach((e) => {
        if (!e.isIntersecting) return;
        e.target.classList.add('is-rolled');
        io.unobserve(e.target);
      }),
    { threshold: 0.2 },
  );
  els.forEach((el) => {
    el.dataset.rollReady = '1';
    const count = splitText(el, rollWrap);
    el.style.setProperty('--rc-count', String(count));
    el.classList.add('roll');
    io.observe(el);
  });
}

/* ---------- Scroll-fill paragraph ---------- */
const fillWrap: Wrap = (text, index) => {
  const frag = document.createDocumentFragment();
  text.split(/(\s+)/).forEach((part) => {
    if (!part) return;
    if (/^\s+$/.test(part)) {
      frag.append(document.createTextNode(' '));
      return;
    }
    const w = document.createElement('span');
    w.className = 'fw';
    w.dataset.wi = String(index.n++);
    w.textContent = part;
    frag.append(w);
  });
  return frag;
};

export function initFill(root: ParentNode = document) {
  if (prefersReducedMotion()) return;
  const items = [...root.querySelectorAll<HTMLElement>('[data-fill]:not([data-fill-ready])')].map((el) => {
    el.dataset.fillReady = '1';
    splitText(el, fillWrap);
    el.classList.add('fill');
    return { el, words: [...el.querySelectorAll<HTMLElement>('.fw')], lit: -1 };
  });
  if (!items.length) return;
  onTick(() => {
    const vh = innerHeight;
    items.forEach((it) => {
      const r = it.el.getBoundingClientRect();
      if (r.bottom < -vh || r.top > vh * 2) return;
      // 0 when the paragraph's top reaches 85% of the screen, 1 when its bottom reaches 45%
      const start = vh * 0.85;
      const end = vh * 0.45;
      const p = Math.min(1, Math.max(0, (start - r.top) / (start - end + r.height)));
      const lit = Math.round(p * it.words.length);
      if (lit === it.lit) return;
      it.words.forEach((w, i) => w.classList.toggle('on', i < lit));
      it.lit = lit;
    });
  });
}
