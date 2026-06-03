/* Split Text Stagger — saltycodestudio
 * Splits a heading into chars or words (plain JS, no paid SplitText) and
 * staggers them in. Optionally fires on scroll into view.
 * Requires: gsap. ScrollTrigger optional (only if data-split-scroll is set).
 *
 * Markup:
 *   <h1 data-split="chars">Make it move</h1>
 *   <h2 data-split="words" data-split-scroll>Words stagger on scroll</h2>
 *
 * Attributes:
 *   data-split          "chars" | "words"  (default "chars")
 *   data-split-scroll   present => trigger when it scrolls into view
 *   data-split-stagger  per-unit stagger seconds (default chars .03 / words .07)
 */

/* Splits text into wrapped, masked units. Preserves spaces & word boundaries.
 * Returns the inner moving elements to animate. */
function splitText(el, mode) {
  const source = el.textContent;
  el.textContent = '';
  el.setAttribute('aria-label', source); // keep it readable for screen readers
  const units = [];

  const makeUnit = (text) => {
    const outer = document.createElement('span');
    outer.className = 'split-unit';
    outer.setAttribute('aria-hidden', 'true');
    const inner = document.createElement('span');
    inner.className = 'split-unit-inner';
    inner.textContent = text;
    outer.appendChild(inner);
    el.appendChild(outer);
    units.push(inner);
  };

  if (mode === 'words') {
    source.split(/(\s+)/).forEach((chunk) => {
      if (chunk === '') return;
      if (/^\s+$/.test(chunk)) {
        el.appendChild(document.createTextNode(chunk));
      } else {
        makeUnit(chunk);
      }
    });
  } else {
    // chars: keep words intact for wrapping, split chars inside each word
    source.split(/(\s+)/).forEach((chunk) => {
      if (chunk === '') return;
      if (/^\s+$/.test(chunk)) {
        el.appendChild(document.createTextNode(chunk));
        return;
      }
      const word = document.createElement('span');
      word.className = 'split-word';
      Array.from(chunk).forEach((ch) => {
        const outer = document.createElement('span');
        outer.className = 'split-unit';
        outer.setAttribute('aria-hidden', 'true');
        const inner = document.createElement('span');
        inner.className = 'split-unit-inner';
        inner.textContent = ch;
        outer.appendChild(inner);
        word.appendChild(outer);
        units.push(inner);
      });
      el.appendChild(word);
    });
  }

  return units;
}

export function initSplitStagger(root = document) {
  if (typeof gsap === 'undefined') {
    console.warn('[split-text-stagger] GSAP not found.');
    return;
  }
  const hasScrollTrigger = typeof ScrollTrigger !== 'undefined';
  if (hasScrollTrigger) gsap.registerPlugin(ScrollTrigger);

  root.querySelectorAll('[data-split]').forEach((el) => {
    const mode = el.getAttribute('data-split') === 'words' ? 'words' : 'chars';
    const units = splitText(el, mode);
    const stagger =
      parseFloat(el.getAttribute('data-split-stagger')) ||
      (mode === 'words' ? 0.07 : 0.03);

    gsap.set(units, { yPercent: 120, autoAlpha: 0 });

    const animate = () =>
      gsap.to(units, {
        yPercent: 0,
        autoAlpha: 1,
        duration: 0.8,
        ease: 'power4.out',
        stagger,
      });

    if (el.hasAttribute('data-split-scroll') && hasScrollTrigger) {
      ScrollTrigger.create({
        trigger: el,
        start: 'top 85%',
        once: true,
        onEnter: animate,
      });
    } else {
      animate();
    }
  });
}

if (typeof window !== 'undefined' && !window.__SPLIT_MANUAL__) {
  window.initSplitStagger = initSplitStagger;
}
