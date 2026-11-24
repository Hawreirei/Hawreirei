/**
 * Generative monochrome math visuals for cards (issue #4).
 * Usage: <canvas data-mathviz="lissajous"></canvas>
 * Variants: squares · lissajous · waves · tunnel · phyllotaxis
 * Draws one still frame with reduced motion; pauses when off-screen or tab hidden.
 */
import { fitCanvas, inkA, onThemeChange, onTick, prefersReducedMotion, watchVisibility } from './core';

type Draw = (ctx: CanvasRenderingContext2D, w: number, h: number, t: number) => void;

function grid(ctx: CanvasRenderingContext2D, w: number, h: number, step: number, a: number) {
  ctx.strokeStyle = inkA(a);
  ctx.lineWidth = 1;
  ctx.beginPath();
  for (let x = step; x < w; x += step) {
    ctx.moveTo(x + 0.5, 0);
    ctx.lineTo(x + 0.5, h);
  }
  for (let y = step; y < h; y += step) {
    ctx.moveTo(0, y + 0.5);
    ctx.lineTo(w, y + 0.5);
  }
  ctx.stroke();
}

function axes(ctx: CanvasRenderingContext2D, w: number, h: number, a: number) {
  ctx.strokeStyle = inkA(a);
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(0, h / 2);
  ctx.lineTo(w, h / 2);
  ctx.moveTo(w / 2, 0);
  ctx.lineTo(w / 2, h);
  ctx.stroke();
}

const variants: Record<string, Draw> = {
  /** Geometry: nested squares rotating in alternate directions. */
  squares(ctx, w, h, t) {
    grid(ctx, w, h, 36, 0.08);
    const m = Math.min(w, h);
    for (let k = 1; k <= 7; k++) {
      const size = k * m * 0.06 + Math.sin(t * 1.4 + k * 0.5) * 6;
      ctx.save();
      ctx.translate(w / 2, h / 2);
      ctx.rotate(t * 0.25 * (k % 2 ? -1 : 1) + k * 0.12);
      ctx.strokeStyle = k === 4 ? inkA(1) : inkA(0.15 + k * 0.08);
      ctx.lineWidth = k === 4 ? 1.5 : 0.8;
      ctx.strokeRect(-size / 2, -size / 2, size, size);
      ctx.restore();
    }
  },

  /** Parametric curves: x = sin(3t + φ), y = sin(4t). */
  lissajous(ctx, w, h, t) {
    axes(ctx, w, h, 0.12);
    const rx = w * 0.36;
    const ry = h * 0.36;
    for (let layer = 0; layer < 3; layer++) {
      const s = 1 - layer * 0.12;
      const phase = t * 1.1 + layer * 0.45;
      ctx.beginPath();
      for (let i = 0; i <= 360; i++) {
        const a = (i / 360) * Math.PI * 2;
        const x = w / 2 + Math.sin(3 * a + phase) * rx * s;
        const y = h / 2 + Math.sin(4 * a + t * 0.6) * ry * s;
        i ? ctx.lineTo(x, y) : ctx.moveTo(x, y);
      }
      ctx.strokeStyle = layer === 0 ? inkA(1) : inkA(0.35 - layer * 0.1);
      ctx.lineWidth = layer === 0 ? 1.6 : 0.8;
      ctx.stroke();
    }
  },

  /** Functions: a field of short strokes rotating with a radial sine wave. */
  waves(ctx, w, h, t) {
    const cols = 18;
    const rows = Math.max(8, Math.round((cols * h) / w));
    const cw = w / cols;
    const ch = h / rows;
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const nx = c / cols - 0.5;
        const ny = r / rows - 0.5;
        const d = Math.hypot(nx, ny);
        const angle = Math.sin(d * 9 - t * 2.2) * Math.PI * 0.75;
        const len = cw * (0.35 + 0.45 * Math.cos(d * 7 - t * 1.8));
        const near = d < 0.28;
        ctx.save();
        ctx.translate((c + 0.5) * cw, (r + 0.5) * ch);
        ctx.rotate(angle);
        ctx.strokeStyle = near ? inkA(1) : inkA(0.35);
        ctx.lineWidth = near ? 2 : 1;
        ctx.beginPath();
        ctx.moveTo(-len / 2, 0);
        ctx.lineTo(len / 2, 0);
        ctx.stroke();
        ctx.restore();
      }
    }
  },

  /** Limits: frames rushing toward a vanishing point (n → ∞). */
  tunnel(ctx, w, h, t) {
    const cx = w / 2;
    const cy = h / 2;
    ctx.strokeStyle = inkA(0.14);
    ctx.lineWidth = 0.8;
    ctx.beginPath();
    for (const [x, y] of [
      [0, 0],
      [w, 0],
      [0, h],
      [w, h],
    ]) {
      ctx.moveTo(x, y);
      ctx.lineTo(cx, cy);
    }
    ctx.stroke();
    const frames = 12;
    for (let i = 0; i < frames; i++) {
      const p = (i / frames + t * 0.16) % 1;
      const s = Math.pow(p, 2.1);
      ctx.strokeStyle = inkA(p * 0.85);
      ctx.lineWidth = p > 0.7 ? 1.5 : 0.8;
      ctx.strokeRect(cx - (w * s) / 2, cy - (h * s) / 2, w * s, h * s);
    }
  },

  /** Golden angle: sunflower seed pattern (phyllotaxis), r = c√n, θ = n·137.5°. */
  phyllotaxis(ctx, w, h, t) {
    const golden = Math.PI * (3 - Math.sqrt(5));
    const n = 420;
    const c = (Math.min(w, h) * 0.46) / Math.sqrt(n);
    const spin = t * 0.08;
    for (let i = 1; i <= n; i++) {
      const r = c * Math.sqrt(i);
      const th = i * golden + spin;
      const pulse = 0.5 + 0.5 * Math.sin(i * 0.05 - t * 1.6);
      const size = 0.6 + pulse * 1.6;
      ctx.fillStyle = inkA(0.25 + pulse * 0.75);
      ctx.fillRect(w / 2 + r * Math.cos(th) - size / 2, h / 2 + r * Math.sin(th) - size / 2, size, size);
    }
  },
};

export function initMathViz(root: ParentNode = document) {
  const reduced = prefersReducedMotion();
  root.querySelectorAll<HTMLCanvasElement>('canvas[data-mathviz]').forEach((canvas) => {
    if (canvas.dataset.vizReady) return;
    canvas.dataset.vizReady = '1';
    const draw = variants[canvas.dataset.mathviz ?? ''];
    const ctx = canvas.getContext('2d');
    if (!draw || !ctx) return;

    const offset = Math.random() * 10;
    let visible = false;
    let stop: (() => void) | null = null;

    const render = (t: number) => {
      const { w, h } = fitCanvas(canvas, ctx);
      if (!w || !h) return;
      ctx.clearRect(0, 0, w, h);
      draw(ctx, w, h, t);
    };

    const still = () => render(offset + 2);

    if (reduced) {
      still();
      onThemeChange(still);
      new ResizeObserver(still).observe(canvas);
      return;
    }

    watchVisibility(canvas, (v) => {
      visible = v;
      if (visible && !stop) stop = onTick((now) => render(offset + now / 1000));
      else if (!visible && stop) {
        stop();
        stop = null;
      }
    });
    onThemeChange(() => !visible && still());
    still();
  });
}
