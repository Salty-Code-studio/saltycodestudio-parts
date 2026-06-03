/* Scroll Text Reveal — saltycodestudio
 * Lines / words rise + fade as they enter the viewport.
 * Requires: gsap, gsap/ScrollTrigger.
 *
 * Usage:
 *   <h2 data-reveal>Whole element rises as one</h2>
 *   <p  data-reveal="words">Each word staggers in</p>
 *   <div data-reveal="lines"><span class="reveal-line">Line A</span><span class="reveal-line">Line B</span></div>
 *
 * Notes on splitting:
 *   - data-reveal            -> reveals the element itself
 *   - data-reveal="words"    -> splits on whitespace, wraps each word (keeps spaces)
 *   - data-reveal="lines"    -> reveals existing children marked .reveal-line (you author the lines)
 */

function wrapWords(el) {
  const text = el.textContent;
  el.textContent = '';
  const frag = document.createDocumentFragment();
  text.split(/(\s+)/).forEach((chunk) => {
    if (/^\s+$/.test(chunk) || chunk === '') {
      frag.appendChild(document.createTextNode(chunk));
      return;
    }
    const outer = document.createElement('span');
    outer.className = 'reveal-word';
    const inner = document.createElement('span');
    inner.className = 'reveal-word-inner';
    inner.textContent = chunk;
    outer.appendChild(inner);
    frag.appendChild(outer);
  });
  el.appendChild(frag);
  return el.querySelectorAll('.reveal-word-inner');
}

export function initScrollReveal(root = document) {
  if (typeof gsap === 'undefined') {
    console.warn('[scroll-text-reveal] GSAP not found.');
    return;
  }
  gsap.registerPlugin(ScrollTrigger);

  const els = root.querySelectorAll('[data-reveal]');

  els.forEach((el) => {
    const mode = el.getAttribute('data-reveal');
    let targets;

    if (mode === 'words') {
      targets = wrapWords(el);
    } else if (mode === 'lines') {
      targets = el.querySelectorAll('.reveal-line');
    } else {
      targets = [el];
    }

    gsap.set(targets, { yPercent: 110, autoAlpha: 0 });

    gsap.to(targets, {
      yPercent: 0,
      autoAlpha: 1,
      duration: 0.9,
      ease: 'power3.out',
      stagger: targets.length > 1 ? 0.06 : 0,
      scrollTrigger: {
        trigger: el,
        start: 'top 85%',
        once: true,
      },
    });
  });
}

if (typeof window !== 'undefined' && !window.__REVEAL_MANUAL__) {
  window.initScrollReveal = initScrollReveal;
}
