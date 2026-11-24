/**
 * First-load intro (issue #4): big 00 → 100 counter, then a curtain lifts.
 * Runs once per browser session. The inline head script in BaseLayout adds
 * `intro-run` to <html> only when it should play (not seen yet, motion allowed),
 * so there is no flash and no-JS visitors never see it.
 */
const DURATION = 1900;
const ease = (p: number) => (p < 0.5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2);

let resolveDone: () => void;
export const introDone = new Promise<void>((r) => (resolveDone = r));

export function initIntro() {
  const root = document.documentElement;
  const el = document.querySelector<HTMLElement>('[data-intro]');
  if (!root.classList.contains('intro-run') || !el) {
    resolveDone();
    return;
  }
  const num = el.querySelector<HTMLElement>('[data-intro-count]');
  const bar = el.querySelector<HTMLElement>('[data-intro-bar]');
  const start = performance.now();

  const step = (now: number) => {
    const p = Math.min(1, (now - start) / DURATION);
    const v = Math.round(ease(p) * 100);
    if (num) num.textContent = String(v).padStart(2, '0');
    if (bar) bar.style.transform = `scaleX(${ease(p)})`;
    if (p < 1) requestAnimationFrame(step);
    else finish();
  };

  const finish = () => {
    try {
      sessionStorage.setItem('intro-seen', '1');
    } catch {}
    el.classList.add('is-leaving');
    // let the hero start revealing while the curtain lifts
    setTimeout(resolveDone, 350);
    el.addEventListener(
      'transitionend',
      () => {
        root.classList.remove('intro-run');
        el.remove();
      },
      { once: true },
    );
  };

  requestAnimationFrame(step);
}
