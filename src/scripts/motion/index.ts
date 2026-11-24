/**
 * Motion entry (issue #4). Loaded once by BaseLayout.
 * Every effect checks reduced-motion and pointer type itself.
 */
import { initIntro, introDone } from './intro';
import { initCursor } from './cursor';
import { initMathViz } from './mathviz';
import { initHeroCanvas } from './heroCanvas';
import {
  getLenis,
  initMagnetic,
  initMarquee,
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

// Hero lines ([data-reveal="manual"]) wait for the intro curtain.
introDone.then(() =>
  requestAnimationFrame(() => document.querySelectorAll('[data-reveal="manual"]').forEach(revealNow)),
);

// Freeze smooth scroll behind the MENU overlay.
document.addEventListener('menu:open', () => getLenis()?.stop());
document.addEventListener('menu:close', () => getLenis()?.start());
