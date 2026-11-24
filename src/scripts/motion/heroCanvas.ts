/**
 * Hero backgrounds (issue #4). Two options for the owner to choose from:
 *   <canvas data-hero-canvas="surface">  — rotating 3D wireframe of z = sin(r − t)·e^(−r/12)
 *   <canvas data-hero-canvas="plane">    — Cartesian plane; curve morphs between functions,
 *                                          a point + tangent line follows the cursor
 *   <canvas data-hero-canvas="mix">      — owner's choice: surface on screens ≥768px, plane on phones
 */
import { fitCanvas, hasFinePointer, inkA, onThemeChange, onTick, prefersReducedMotion, watchVisibility } from './core';

const mouse = { x: 0, y: 0, tx: 0, ty: 0, clientX: -1, inside: false };

addEventListener(
  'pointermove',
  (e) => {
    if (e.pointerType !== 'mouse') return;
    mouse.tx = (e.clientX / innerWidth - 0.5) * 2;
    mouse.ty = (e.clientY / innerHeight - 0.5) * 2;
    mouse.clientX = e.clientX;
  },
  { passive: true },
);

/* ---------- Option A: surface ---------- */

function drawSurface(ctx: CanvasRenderingContext2D, w: number, h: number, t: number) {
  const N = 34; // grid resolution
  const D = 10; // domain half-size
  const spin = t * 0.12 + mouse.x * 0.5;
  const tilt = 1.02 + mouse.y * 0.12;
  const cs = Math.cos(spin),
    ss = Math.sin(spin);
  const ct = Math.cos(tilt),
    st = Math.sin(tilt);
  const unit = Math.min(w * 0.048, h * 0.07);
  const cx = w * 0.62 + mouse.x * 20;
  const cy = h * 0.56 + mouse.y * 14;
  const f = 26;

  const pts: { x: number; y: number; d: number }[][] = [];
  for (let i = 0; i <= N; i++) {
    const row: { x: number; y: number; d: number }[] = [];
    for (let j = 0; j <= N; j++) {
      const x = (i / N - 0.5) * 2 * D;
      const y = (j / N - 0.5) * 2 * D;
      const r = Math.hypot(x, y);
      const z = Math.sin(r * 1.1 - t * 1.3) * 1.6 * Math.exp(-r / 12);
      // spin about vertical axis, then tilt toward the viewer
      const x1 = x * cs - y * ss;
      const y1 = x * ss + y * cs;
      const depth = y1 * ct + z * st;
      const up = -y1 * st + z * ct;
      const p = f / (f + depth);
      row.push({ x: cx + x1 * unit * p, y: cy - up * unit * p, d: depth });
    }
    pts.push(row);
  }

  const line = (a: { x: number; y: number; d: number }, b: { x: number; y: number; d: number }) => {
    const near = 1 - (a.d + D) / (2 * D); // 1 = closest
    ctx.strokeStyle = inkA(0.05 + near * 0.3);
    ctx.beginPath();
    ctx.moveTo(a.x, a.y);
    ctx.lineTo(b.x, b.y);
    ctx.stroke();
  };

  ctx.lineWidth = 0.8;
  for (let i = 0; i <= N; i++) for (let j = 0; j < N; j++) line(pts[i][j], pts[i][j + 1]);
  ctx.lineWidth = 0.6;
  for (let j = 0; j <= N; j += 2) for (let i = 0; i < N; i++) line(pts[i][j], pts[i + 1][j]);

  // orbital ring
  ctx.beginPath();
  for (let a = 0; a <= 120; a++) {
    const ang = (a / 120) * Math.PI * 2;
    const x = Math.cos(ang) * D * 1.25;
    const y = Math.sin(ang) * D * 1.25;
    const x1 = x * cs - y * ss;
    const y1 = x * ss + y * cs;
    const depth = y1 * ct;
    const up = -y1 * st;
    const p = f / (f + depth);
    const sx = cx + x1 * unit * p;
    const sy = cy - up * unit * p;
    a ? ctx.lineTo(sx, sy) : ctx.moveTo(sx, sy);
  }
  ctx.strokeStyle = inkA(0.22);
  ctx.lineWidth = 0.8;
  ctx.stroke();
}

/* ---------- Option B: plane ---------- */

const fns: { label: string; f: (x: number) => number }[] = [
  { label: 'f(x) = 2 sin x', f: (x) => 2 * Math.sin(x) },
  { label: 'f(x) = x³/8 − x', f: (x) => (x * x * x) / 8 - x },
  { label: 'f(x) = 3e^(−x²/2)', f: (x) => 3 * Math.exp((-x * x) / 2) },
  {
    label: 'f(x) = Σ 8 sin(kx) / kπ',
    f: (x) => {
      let s = 0;
      for (let k = 1; k <= 9; k += 2) s += Math.sin(k * x) / k;
      return (8 / Math.PI) * s * 0.75;
    },
  },
];

const HOLD = 3.6;
const MORPH = 1.1;
const ease = (p: number) => (p < 0.5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2);

function drawPlane(ctx: CanvasRenderingContext2D, w: number, h: number, t: number, canvas: HTMLCanvasElement) {
  const compact = w < 640; // phones: fewer labels, softer curve
  const unit = Math.max(28, Math.min(w, h) / 9);
  const ox = w * 0.58;
  const oy = h * 0.55;
  const toX = (x: number) => ox + x * unit;
  const toY = (y: number) => oy - y * unit;
  const xMin = -ox / unit;
  const xMax = (w - ox) / unit;

  // grid
  ctx.lineWidth = 1;
  ctx.strokeStyle = inkA(0.06);
  ctx.beginPath();
  for (let i = Math.ceil(xMin); i <= xMax; i++) {
    ctx.moveTo(toX(i) + 0.5, 0);
    ctx.lineTo(toX(i) + 0.5, h);
  }
  for (let j = Math.ceil(-(h - oy) / unit); j <= oy / unit; j++) {
    ctx.moveTo(0, toY(j) + 0.5);
    ctx.lineTo(w, toY(j) + 0.5);
  }
  ctx.stroke();

  // axes + ticks
  ctx.strokeStyle = inkA(0.35);
  ctx.beginPath();
  ctx.moveTo(0, oy + 0.5);
  ctx.lineTo(w, oy + 0.5);
  ctx.moveTo(ox + 0.5, 0);
  ctx.lineTo(ox + 0.5, h);
  ctx.stroke();
  ctx.fillStyle = inkA(compact ? 0 : 0.4);
  ctx.font = '500 10px "JetBrains Mono Variable", monospace';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'top';
  for (let i = Math.ceil(xMin); i <= xMax; i++) if (i && i % 2 === 0) ctx.fillText(String(i), toX(i), oy + 6);
  ctx.textAlign = 'left';
  ctx.textBaseline = 'middle';
  for (let j = -6; j <= 6; j++) if (j && j % 2 === 0) ctx.fillText(String(j), ox + 6, toY(j));
  ctx.fillText('x', w - 16, oy - 10);
  ctx.fillText('y', ox + 8, 14);

  // current function (morphing)
  const cycle = HOLD + MORPH;
  const k = Math.floor(t / cycle);
  const local = t - k * cycle;
  const a = fns[k % fns.length];
  const b = fns[(k + 1) % fns.length];
  const m = local < HOLD ? 0 : ease((local - HOLD) / MORPH);
  const F = (x: number) => a.f(x) * (1 - m) + b.f(x) * m;

  ctx.beginPath();
  for (let px = 0; px <= w; px += 2) {
    const x = (px - ox) / unit;
    const y = toY(F(x));
    px ? ctx.lineTo(px, y) : ctx.moveTo(px, y);
  }
  ctx.strokeStyle = inkA(compact ? 0.45 : 0.9);
  ctx.lineWidth = compact ? 1.2 : 1.6;
  ctx.stroke();

  // point + tangent: follows the cursor over the hero, otherwise drifts
  const rect = canvas.getBoundingClientRect();
  const followCursor = mouse.inside && mouse.clientX >= 0;
  const x0 = followCursor ? (mouse.clientX - rect.left - ox) / unit : Math.sin(t * 0.35) * Math.min(4, xMax - 1);
  const y0 = F(x0);
  const slope = (F(x0 + 0.001) - F(x0 - 0.001)) / 0.002;
  const L = 2.4 / Math.sqrt(1 + slope * slope);

  ctx.setLineDash([3, 4]);
  ctx.strokeStyle = inkA(0.3);
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(toX(x0), toY(y0));
  ctx.lineTo(toX(x0), oy);
  ctx.moveTo(toX(x0), toY(y0));
  ctx.lineTo(ox, toY(y0));
  ctx.stroke();
  ctx.setLineDash([]);

  ctx.strokeStyle = inkA(0.75);
  ctx.beginPath();
  ctx.moveTo(toX(x0 - L), toY(y0 - slope * L));
  ctx.lineTo(toX(x0 + L), toY(y0 + slope * L));
  ctx.stroke();

  ctx.fillStyle = inkA(1);
  ctx.beginPath();
  ctx.arc(toX(x0), toY(y0), 3.5, 0, Math.PI * 2);
  ctx.fill();

  if (compact) return; // no coordinate / function labels on phones

  ctx.font = '500 11px "JetBrains Mono Variable", monospace';
  ctx.textAlign = 'left';
  ctx.textBaseline = 'bottom';
  ctx.fillStyle = inkA(0.85);
  const lx = Math.min(toX(x0) + 12, w - 190);
  const ly = toY(y0) - 12;
  ctx.fillText(`(${x0.toFixed(2)}, ${y0.toFixed(2)})`, lx, ly);
  ctx.fillStyle = inkA(0.5);
  ctx.fillText(`f′(x) = ${slope.toFixed(2)}`, lx, ly + 15);

  // function label (fades during morph)
  ctx.textAlign = 'right';
  ctx.textBaseline = 'top';
  ctx.font = '500 12px "JetBrains Mono Variable", monospace';
  ctx.fillStyle = inkA(0.8 * (1 - m));
  ctx.fillText(a.label, w - 24, h * 0.2);
  ctx.fillStyle = inkA(0.8 * m);
  ctx.fillText(b.label, w - 24, h * 0.2);
}

/* ---------- Init ---------- */

export function initHeroCanvas(root: ParentNode = document) {
  const reduced = prefersReducedMotion();
  const fine = hasFinePointer();

  root.querySelectorAll<HTMLCanvasElement>('canvas[data-hero-canvas]').forEach((canvas) => {
    if (canvas.dataset.heroReady) return;
    canvas.dataset.heroReady = '1';
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const kind = canvas.dataset.heroCanvas;
    const host = canvas.closest('[data-hero]') ?? canvas.parentElement!;

    if (fine) {
      host.addEventListener('pointerenter', () => (mouse.inside = true));
      host.addEventListener('pointerleave', () => (mouse.inside = false));
    }

    const render = (t: number) => {
      const { w, h } = fitCanvas(canvas, ctx);
      if (!w || !h) return;
      ctx.clearRect(0, 0, w, h);
      const mode = kind === 'mix' ? (w < 768 ? 'plane' : 'surface') : kind;
      if (mode === 'surface') drawSurface(ctx, w, h, t);
      else drawPlane(ctx, w, h, t, canvas);
    };

    if (reduced) {
      const still = () => render(1.5);
      still();
      onThemeChange(still);
      new ResizeObserver(still).observe(canvas);
      return;
    }

    let stop: (() => void) | null = null;
    watchVisibility(canvas, (visible) => {
      if (visible && !stop) {
        stop = onTick((now) => {
          // ease the mouse for a weighty feel
          mouse.x += (mouse.tx - mouse.x) * 0.06;
          mouse.y += (mouse.ty - mouse.y) * 0.06;
          render(now / 1000);
        });
      } else if (!visible && stop) {
        stop();
        stop = null;
      }
    });
    render(0);
  });
}
