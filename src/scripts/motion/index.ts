/**
 * Motion entry (issue #4). Loaded once by BaseLayout.
 * Every effect checks reduced-motion and pointer type itself.
 */
import { initIntro, introDone } from './intro';
import { initCursor } from './cursor';
import { initMathViz } from './mathviz';
import { initFill, initRoll } from './text';
import { initHeroCanvas } from './heroCanvas';
import {
  getLenis,
  initMagnetic,
  initMarquee,
  initHScroll,
  initParallax,
  initReveals,
  initSmoothScroll,
  initTelemetry,
  initTilt,
  revealNow,
} from './interactions';

initIntro();
initSmoothScroll();
initCursor();
initTelemetry();
initHeroCanvas();
initMathViz();
initTilt();
initMagnetic();
initParallax();
initReveals();
initMarquee();
initRoll();
initFill();
initHScroll();

// Hero lines ([data-reveal="manual"]) wait for the intro curtain.
introDone.then(() =>
  requestAnimationFrame(() => document.querySelectorAll('[data-reveal="manual"]').forEach(revealNow)),
);

// Freeze smooth scroll behind the MENU overlay.
document.addEventListener('menu:open', () => getLenis()?.stop());
document.addEventListener('menu:close', () => getLenis()?.start());
