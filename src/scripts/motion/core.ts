/**
 * Motion core (issue #4): user preferences, one shared animation loop, theme-aware ink.
 */

export const prefersReducedMotion = (): boolean =>
  matchMedia('(prefers-reduced-motion: reduce)').matches;

/** Mouse/trackpad (not touch). */
export const hasFinePointer = (): boolean => matchMedia('(hover: hover) and (pointer: fine)').matches;

export const isDesktop = (): boolean => matchMedia('(min-width: 1024px)').matches;

/* ---------- Shared requestAnimationFrame loop ---------- */

type Tick = (time: number, dt: number) => void;
const ticks = new Set<Tick>();
let rafId = 0;
let last = 0;

function frame(now: number) {
  const dt = last ? Math.min(now - last, 64) : 16;
  last = now;
  ticks.forEach((fn) => fn(now, dt));
  rafId = ticks.size ? requestAnimationFrame(frame) : 0;
}

/** Register a per-frame callback. Returns an unsubscribe function. */
export function onTick(fn: Tick): () => void {
  ticks.add(fn);
  if (!rafId && !document.hidden) {
    last = 0;
    rafId = requestAnimationFrame(frame);
  }
  return () => ticks.delete(fn);
}

document.addEventListener('visibilitychange', () => {
  if (document.hidden) {
    cancelAnimationFrame(rafId);
    rafId = 0;
  } else if (ticks.size && !rafId) {
    last = 0;
    rafId = requestAnimationFrame(frame);
  }
});

/* ---------- Theme-aware ink colour for canvases ---------- */

let ink = { r: 0, g: 0, b: 0 };
let paper = { r: 255, g: 255, b: 255 };

function parseHex(hex: string) {
  const h = hex.trim().replace('#', '');
  const full = h.length === 3 ? h.split('').map((c) => c + c).join('') : h;
  const n = parseInt(full, 16);
  return { r: (n >> 16) & 255, g: (n >> 8) & 255, b: n & 255 };
}

function readTheme() {
  const cs = getComputedStyle(document.documentElement);
  ink = parseHex(cs.getPropertyValue('--fg') || '#000');
  paper = parseHex(cs.getPropertyValue('--bg') || '#fff');
}
readTheme();

const themeListeners = new Set<() => void>();
export const onThemeChange = (fn: () => void) => themeListeners.add(fn);

new MutationObserver(() => {
  readTheme();
  themeListeners.forEach((fn) => fn());
}).observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });

/** Foreground colour with alpha, e.g. inkA(0.2) → "rgba(255,255,255,0.2)" in void theme. */
export const inkA = (a = 1) => `rgba(${ink.r},${ink.g},${ink.b},${a})`;
export const paperA = (a = 1) => `rgba(${paper.r},${paper.g},${paper.b},${a})`;

/* ---------- Canvas helpers ---------- */

/** Resize a canvas to its CSS box at devicePixelRatio (capped at 2). Returns CSS size. */
export function fitCanvas(canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D) {
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  const w = canvas.clientWidth;
  const h = canvas.clientHeight;
  const W = Math.max(1, Math.round(w * dpr));
  const H = Math.max(1, Math.round(h * dpr));
  if (canvas.width !== W || canvas.height !== H) {
    canvas.width = W;
    canvas.height = H;
  }
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  return { w, h };
}

/** Track whether an element is on screen, so off-screen canvases stop drawing. */
export function watchVisibility(el: Element, cb: (visible: boolean) => void) {
  const io = new IntersectionObserver(([entry]) => cb(entry.isIntersecting), { rootMargin: '100px' });
  io.observe(el);
  return () => io.disconnect();
}
