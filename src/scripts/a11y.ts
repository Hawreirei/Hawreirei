/**
 * Small accessibility helpers (issue #15).
 * Wide formulas scroll sideways: make only the ones that actually overflow keyboard-focusable
 * (WCAG 2.1.1), with a label, so short formulas don't add pointless tab stops.
 */
const label = document.documentElement.lang === 'id' ? 'Rumus (geser untuk melihat semuanya)' : 'Formula (scroll to see all of it)';

function markScrollableMath() {
  document.querySelectorAll<HTMLElement>('.math-display').forEach((el) => {
    const scrollable = el.scrollWidth > el.clientWidth + 1;
    if (scrollable && !el.hasAttribute('tabindex')) {
      el.tabIndex = 0;
      el.setAttribute('role', 'region');
      el.setAttribute('aria-label', label);
    } else if (!scrollable && el.getAttribute('role') === 'region') {
      el.removeAttribute('tabindex');
      el.removeAttribute('role');
      el.removeAttribute('aria-label');
    }
  });
}

markScrollableMath();
addEventListener('resize', markScrollableMath);
// <details> solutions are measured when opened
document.addEventListener('toggle', markScrollableMath, true);
