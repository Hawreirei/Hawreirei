/**
 * Interactions (issue #4): 3D tilt + glare, magnetic tags, parallax, scroll reveals,
 * smooth scroll, scroll telemetry and live clock.
 */
import Lenis from 'lenis';
import { hasFinePointer, isDesktop, onTick, prefersReducedMotion } from './core';

/* ---------- 3D tilt + glare (cards with [data-tilt]) ---------- */
export function initTilt(root: ParentNode = document) {
  if (!hasFinePointer() || prefersReducedMotion()) return;
  root.querySelectorAll<HTMLElement>('[data-tilt]').forEach((card) => {
    if (card.dataset.tiltReady) return;
    card.dataset.tiltReady = '1';
    const tag = card.querySelector<HTMLElement>('[data-magnetic]');
    card.addEventListener('pointermove', (e) => {
      const r = card.getBoundingClientRect();
      const x = e.clientX - r.left;
      const y = e.clientY - r.top;
      const nx = x / r.width - 0.5;
      const ny = y / r.height - 0.5;
      card.style.transform = `rotateX(${(-ny * 7).toFixed(2)}deg) rotateY(${(nx * 7).toFixed(2)}deg) translateY(-4px)`;
      card.style.setProperty('--mx', `${(x / r.width) * 100}%`);
      card.style.setProperty('--my', `${(y / r.height) * 100}%`);
      if (tag) tag.style.transform = `translate(${nx * 14}px, ${ny * 14}px)`;
    });
    card.addEventListener('pointerleave', () => {
      card.style.transform = '';
      if (tag) tag.style.transform = '';
    });
  });
}

/* ---------- Magnetic buttons ([data-magnetic-btn]) ---------- */
export function initMagnetic(root: ParentNode = document) {
  if (!hasFinePointer() || prefersReducedMotion()) return;
  root.querySelectorAll<HTMLElement>('[data-magnetic-btn]').forEach((el) => {
    el.addEventListener('pointermove', (e) => {
      const r = el.getBoundingClientRect();
      const dx = e.clientX - (r.left + r.width / 2);
      const dy = e.clientY - (r.top + r.height / 2);
      el.style.transform = `translate(${dx * 0.25}px, ${dy * 0.35}px)`;
    });
    el.addEventListener('pointerleave', () => (el.style.transform = ''));
  });
}

/* ---------- Reveals: [data-reveal] (split lines) and .fade-up ---------- */
export function revealNow(el: Element) {
  el.classList.add('is-revealed');
}

export function initReveals(root: ParentNode = document) {
  const els = root.querySelectorAll<HTMLElement>('.fade-up, [data-reveal]:not([data-reveal="manual"])');
  if (prefersReducedMotion()) {
    els.forEach(revealNow);
    return;
  }
  const io = new IntersectionObserver(
    (entries) =>
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        revealNow(entry.target);
        io.unobserve(entry.target);
      }),
    { threshold: 0.12, rootMargin: '0px 0px -5% 0px' },
  );
  els.forEach((el) => io.observe(el));
}

/* ---------- Parallax: [data-parallax="0.03"] (desktop only) ---------- */
export function initParallax(root: ParentNode = document) {
  if (prefersReducedMotion()) return;
  const els = [...root.querySelectorAll<HTMLElement>('[data-parallax]')];
  if (!els.length) return;
  let lastY = -1;
  onTick(() => {
    const y = scrollY;
    if (y === lastY) return;
    lastY = y;
    const desktop = isDesktop();
    const vh = innerHeight;
    els.forEach((el) => {
      if (!desktop) {
        el.style.transform = '';
        return;
      }
      const speed = parseFloat(el.dataset.parallax || '0');
      // measure without our own transform
      const r = el.getBoundingClientRect();
      const current = parseFloat(el.dataset.pOffset || '0');
      const top = r.top - current;
      if (top > vh * 1.5 || top + r.height < -vh * 0.5) return;
      const offset = (top + r.height / 2 - vh / 2) * speed;
      el.dataset.pOffset = String(offset);
      el.style.transform = `translate3d(0, ${offset.toFixed(1)}px, 0)`;
    });
  });
}

/* ---------- Smooth scroll ---------- */
let lenis: Lenis | null = null;
export const getLenis = () => lenis;

export function initSmoothScroll() {
  if (prefersReducedMotion() || !hasFinePointer() || lenis) return;
  lenis = new Lenis({ anchors: true, lerp: 0.1, wheelMultiplier: 1 });
  onTick((now) => lenis?.raf(now));
}

/* ---------- Telemetry: [data-scroll-pct], live clock [data-clock] ---------- */
export function initTelemetry() {
  const pctEls = document.querySelectorAll<HTMLElement>('[data-scroll-pct]');
  if (pctEls.length) {
    const update = () => {
      const max = document.documentElement.scrollHeight - innerHeight;
      const pct = max > 0 ? Math.round(Math.min(1, Math.max(0, scrollY / max)) * 100) : 0;
      pctEls.forEach((el) => (el.textContent = `${String(pct).padStart(3, '0')}%`));
    };
    addEventListener('scroll', update, { passive: true });
    update();
  }

  const clocks = document.querySelectorAll<HTMLElement>('[data-clock]');
  if (clocks.length) {
    const tick = () =>
      clocks.forEach((el) => {
        const tz = el.dataset.clock || 'Asia/Jakarta';
        const time = new Intl.DateTimeFormat('en-GB', {
          timeZone: tz,
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: false,
        }).format(new Date());
        el.textContent = `${el.dataset.clockLabel ?? 'WIB'} ${time}`;
      });
    tick();
    setInterval(tick, 1000);
  }
}

/* ---------- Marquee: speed follows scroll velocity ([data-marquee]) ---------- */
export function initMarquee(root: ParentNode = document) {
  if (prefersReducedMotion()) return;
  const anims = [...root.querySelectorAll<HTMLElement>('[data-marquee] .marquee-track')]
    .map((el) => el.getAnimations()[0])
    .filter(Boolean) as Animation[];
  if (!anims.length) return;
  let lastY = scrollY;
  let rate = 1;
  onTick(() => {
    const v = Math.abs(scrollY - lastY);
    lastY = scrollY;
    const target = 1 + Math.min(v * 0.35, 6);
    rate += (target - rate) * 0.08;
    anims.forEach((a) => (a.playbackRate = rate));
  });
}

/* ---------- Horizontal scroll strip ([data-hscroll] > [data-hscroll-track]) ---------- */
export function initHScroll(root: ParentNode = document) {
  const sections = [...root.querySelectorAll<HTMLElement>('[data-hscroll]')];
  if (!sections.length) return;
  const reduced = prefersReducedMotion();

  const setup = () =>
    sections.forEach((sec) => {
      const track = sec.querySelector<HTMLElement>('[data-hscroll-track]');
      if (!track) return;
      const pinned = isDesktop() && hasFinePointer() && !reduced;
      sec.classList.toggle('is-pinned', pinned);
      if (!pinned) {
        sec.style.height = '';
        track.style.transform = '';
        return;
      }
      const overflow = Math.max(0, track.scrollWidth - track.clientWidth);
      const header = document.querySelector<HTMLElement>('.site-header')?.offsetHeight ?? 0;
      sec.dataset.overflow = String(overflow);
      sec.dataset.header = String(header);
      // pinned area is the viewport minus the sticky header; extra height = horizontal travel
      sec.style.height = `${innerHeight - header + overflow}px`;
    });

  setup();
  addEventListener('resize', setup);
  new ResizeObserver(setup).observe(document.body);

  onTick(() =>
    sections.forEach((sec) => {
      if (!sec.classList.contains('is-pinned')) return;
      const track = sec.querySelector<HTMLElement>('[data-hscroll-track]');
      const overflow = parseFloat(sec.dataset.overflow || '0');
      if (!track || !overflow) return;
      const r = sec.getBoundingClientRect();
      const header = parseFloat(sec.dataset.header || '0');
      const p = Math.min(1, Math.max(0, (header - r.top) / overflow));
      track.style.transform = `translate3d(${(-p * overflow).toFixed(1)}px, 0, 0)`;
    }),
  );
}
