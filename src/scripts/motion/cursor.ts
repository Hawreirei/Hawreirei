/**
 * Crosshair cursor + velocity trail (issue #4). Desktop mouse only; off with reduced motion.
 * Drawn in white on a `mix-blend-mode: difference` canvas, so it reads on white and black.
 * Interactive elements can set a label: <a data-cursor="OPEN">…</a>
 * Also feeds header telemetry: [data-xy] shows "(x, y)".
 */
import { hasFinePointer, onTick, prefersReducedMotion } from './core';

export function initCursor() {
  if (!hasFinePointer() || prefersReducedMotion() || document.querySelector('.cursor-canvas')) return;

  const canvas = document.createElement('canvas');
  canvas.className = 'cursor-canvas';
  canvas.setAttribute('aria-hidden', 'true');
  document.body.appendChild(canvas);
  const ctx = canvas.getContext('2d')!;
  document.documentElement.classList.add('has-cursor');

  let w = 0,
    h = 0,
    dpr = 1;
  const resize = () => {
    dpr = Math.min(devicePixelRatio || 1, 2);
    w = innerWidth;
    h = innerHeight;
    canvas.width = w * dpr;
    canvas.height = h * dpr;
  };
  resize();
  addEventListener('resize', resize);

  const p = { x: w / 2, y: h / 2, vx: 0, vy: 0, active: false };
  const s = { x: w / 2, y: h / 2 };
  const trail: { x: number; y: number; v: number }[] = [];
  const MAX = 34;
  let scale = 1,
    targetScale = 1,
    label = '',
    pressed = false;

  const xyEls = document.querySelectorAll<HTMLElement>('[data-xy]');
  const interactive = 'a, button, [role="button"], [data-cursor], label, summary';

  addEventListener(
    'pointermove',
    (e) => {
      if (e.pointerType !== 'mouse') return;
      if (!p.active) {
        s.x = e.clientX;
        s.y = e.clientY;
        p.active = true;
      }
      p.vx = e.clientX - p.x;
      p.vy = e.clientY - p.y;
      p.x = e.clientX;
      p.y = e.clientY;

      const target = (e.target as Element | null)?.closest?.(interactive) as HTMLElement | null;
      targetScale = target ? 2.6 : 1;
      label = target?.dataset.cursor ?? '';

      if (xyEls.length) {
        const txt = `(${String(Math.round(p.x)).padStart(4, '0')}, ${String(Math.round(p.y)).padStart(4, '0')})`;
        xyEls.forEach((el) => (el.textContent = txt));
      }
    },
    { passive: true },
  );
  document.addEventListener('pointerleave', () => (p.active = false));
  addEventListener('pointerdown', () => (pressed = true));
  addEventListener('pointerup', () => (pressed = false));

  onTick(() => {
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, w, h);
    if (!p.active) {
      trail.length = 0;
      return;
    }

    s.x += (p.x - s.x) * 0.28;
    s.y += (p.y - s.y) * 0.28;
    scale += ((pressed ? targetScale * 0.8 : targetScale) - scale) * 0.18;
    const speed = Math.min(Math.hypot(p.vx, p.vy), 45);
    p.vx *= 0.85;
    p.vy *= 0.85;

    trail.push({ x: s.x, y: s.y, v: speed });
    if (trail.length > MAX) trail.shift();

    // tapering trail, width reacts to speed
    ctx.lineCap = 'round';
    for (let i = 1; i < trail.length; i++) {
      const a = trail[i - 1],
        b = trail[i];
      const r = i / trail.length;
      ctx.strokeStyle = `rgba(255,255,255,${r * 0.75})`;
      ctx.lineWidth = Math.max(0.6, r * (1.8 + b.v * 0.06));
      ctx.beginPath();
      ctx.moveTo(a.x, a.y);
      ctx.lineTo(b.x, b.y);
      ctx.stroke();
    }
    for (let i = 4; i < trail.length; i += 8) {
      const n = trail[i];
      ctx.fillStyle = `rgba(255,255,255,${(i / trail.length) * 0.65})`;
      ctx.fillRect(n.x - 1.5, n.y - 1.5, 3, 3);
    }

    // reticle
    const R = 10 * scale;
    ctx.save();
    ctx.translate(s.x, s.y);
    ctx.strokeStyle = '#fff';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.arc(0, 0, R, 0, Math.PI * 2);
    ctx.stroke();
    const tick = 4;
    ctx.beginPath();
    ctx.moveTo(-R - tick, 0);
    ctx.lineTo(-R + 2, 0);
    ctx.moveTo(R - 2, 0);
    ctx.lineTo(R + tick, 0);
    ctx.moveTo(0, -R - tick);
    ctx.lineTo(0, -R + 2);
    ctx.moveTo(0, R - 2);
    ctx.lineTo(0, R + tick);
    ctx.stroke();
    ctx.fillStyle = '#fff';
    if (label && scale > 1.6) {
      ctx.font = '600 9px "JetBrains Mono Variable", monospace';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(label, 0, 0.5);
    } else {
      ctx.fillRect(-1.5, -1.5, 3, 3);
    }
    ctx.restore();
  });
}
