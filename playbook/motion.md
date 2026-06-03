# Motion Playbook — saltycodestudio

> "Clean code, warm coast." Motion here is a quiet bartender, not a stage magician.
> It points the eye, confirms an action, and gets out of the way. If a visitor
> *notices the animation* instead of the content, it's wrong.

This playbook tells you **how to move things on a saltycodestudio site**. It is
opinionated. Follow it unless you have a specific, defensible reason not to.

The motion layer lives in two files — read them, don't reinvent them:

- `foundations/motion.css` — easing curves, a duration scale, travel distances,
  `@keyframes`, the `.anim-*` utility classes, and ONE global reduced-motion guard.
- `foundations/tokens.css` (section 8) — a shorter `--ease-*` / `--duration-*`
  set for plain CSS `transition`s.
- `components/motion/*` — the heavyweight, GSAP/ScrollTrigger scroll effects
  (split text, pinned sections, parallax, scrubbed sequences, marquees).

> Note: the `.anim-*` utilities read motion.css's `--scs-duration-*` scale, which is distinct from tokens.css's `--duration-*` used for plain transitions.

---

## 1. Five principles (memorize these)

1. **Purposeful** — every animation answers "what does this tell the user?"
   (it appeared, it's loading, it's now active, you can click this). No motion
   for decoration's sake.
2. **Fast** — UI motion lives in **150–400ms**. Hovers/taps feel instant
   (`--scs-duration-fast`, 150ms). Enters settle quickly (`--scs-duration-base`,
   260ms). Only hero showpieces earn 600–900ms.
3. **Eased, never linear** — real things accelerate and decelerate. Use a named
   curve. The *only* linear motion allowed is continuous loops (marquees, spins).
4. **One thing at a time** — animate `transform` and `opacity`. That's it for
   90% of cases. They're GPU-composited and never trigger layout.
5. **Respect the user** — `prefers-reduced-motion` is honored globally and is
   non-negotiable (see §7).

---

## 2. What to animate (and what NOT to)

**Cheap & smooth — animate freely:**
- `transform` (translate / scale / rotate)
- `opacity`
- `filter: blur()` sparingly (it's GPU but heavier — keep it to short reveals)

**Expensive — do NOT animate these:**
- `width`, `height`, `top`, `left`, `margin`, `padding` → they trigger layout
  and jank. Use `transform: translate()` / `scale()` instead.
- `box-shadow` directly → animate a pseudo-element's `opacity` that holds the
  bigger shadow, or accept the small cost only on hover (low frequency).
- `background-position` is fine for the shimmer loop only (it's already tuned).

```css
/* BAD — janky, triggers layout every frame */
.card:hover { margin-top: -4px; width: 102%; }

/* GOOD — composited, buttery */
.card { transition: transform var(--duration-base) var(--ease-out); }
.card:hover { transform: translateY(-4px) scale(1.02); }
```

**`will-change` rule:** only on elements that animate *continuously* or on a
known imminent interaction (`.anim-float`, `.anim-marquee`, scrub layers already
set it). Never slap it on everything — it costs memory and can *cause* the jank
it's meant to prevent.

---

## 3. Easing — pick the curve that matches the feeling

Use the named curves from `motion.css`. Say what it should *feel* like:

| Feeling | Token | When |
|---|---|---|
| Enters, settles softly | `--scs-ease-out-expo` / `--scs-ease-out-quart` | fade-up, slide-in, things arriving on screen |
| Leaves the screen | `--scs-ease-in-quart` / `--scs-ease-in-cubic` | exit / dismiss animations |
| Returns home / toggles | `--scs-ease-in-out-quart` | state flips, accordions, loops that go and come back |
| Playful pop / overshoot | `--scs-ease-spring` | scale-in, badges, success ticks, micro-feedback |
| Bouncy "back" | `--scs-ease-back` | rare, deliberate delight (1 per page max) |
| Steady loop | `--scs-ease-linear` | marquees, spinners only |

Default for almost everything: **`--scs-ease-default`** (= `ease-out-quart`).

**Asymmetry is good.** Things should enter slowly-settling (decel) and leave
quickly (accel). A modal: open with `ease-out` ~300ms, close with `ease-in`
~200ms. Closing faster than opening feels responsive.

**Don't** invent raw `cubic-bezier()` magic numbers in component CSS. If you
genuinely need a new curve, add it to `motion.css` with a name.

---

## 4. Micro-interactions — the daily bread

These are the small, high-frequency responses to input. Keep them **fast
(80–200ms)** and subtle. They make a site feel *built*, not generated.

**Buttons / links**
```css
.btn {
  transition:
    transform   var(--duration-fast) var(--ease-out),
    background  var(--duration-fast) var(--ease-out),
    box-shadow  var(--duration-fast) var(--ease-out);
}
.btn:hover  { transform: translateY(-1px); box-shadow: var(--shadow-md); }
.btn:active { transform: translateY(0)  scale(0.98); } /* tactile press */
```

**Always include `:active`** — the press-down is what sells tactility, and it's
the only feedback touch users get (they have no hover).

**Focus must be visible and instant** — never animate focus rings in; a delayed
ring fails keyboard users. Use `:focus-visible` so only keyboard focus shows it.

```css
.btn:focus-visible { outline: 2px solid var(--color-surf-coral); outline-offset: 2px; }
```

**Checklist for any interactive element:**
- [ ] `:hover` state (desktop nicety)
- [ ] `:active` state (tactile press — works on touch too)
- [ ] `:focus-visible` state (keyboard, instant, no transition)
- [ ] transition only on `transform` / `color` / `background` / `opacity`
- [ ] 80–200ms, eased (not linear)

**Signature interactions** (use sparingly, one or two per page):
- `components/motion/magnetic-button` — hero CTA pulls toward the cursor, springs
  back elastically. No hover on touch, so it gracefully no-ops to a normal tap.
- `components/css/animated-underline`, `neon-glow-button`, `confetti-button` —
  pick at most one "delight" moment; more than that is noise.

---

## 5. Entrance animations — use the `.anim-*` utilities

For elements appearing on load or scrolling into view, **don't write keyframes** —
compose the utilities from `motion.css`:

```html
<h1 class="anim-fade-up dur-slow ease-expo">Clean code, warm coast.</h1>

<!-- a list that cascades in -->
<ul class="stagger-children">
  <li class="anim-fade-up">One</li>
  <li class="anim-fade-up">Two</li>
  <li class="anim-fade-up">Three</li>
</ul>
```

- Utilities: `.anim-fade-up`, `.anim-fade-in`, `.anim-scale-in`, `.anim-blur-in`,
  `.anim-slide-in` (`.from-left/right/top/bottom`).
- Modifiers compose freely: duration `.dur-fast … .dur-slowest`,
  easing `.ease-expo/.ease-spring/…`, delay `.delay-1 … .delay-6`.
- **Stagger:** `.stagger-children` auto-delays up to 8 direct children by
  `--scs-stagger` (70ms). Keep stagger steps small — a 6-item list should finish
  arriving in well under a second. Long cascades feel slow and sluggish.
- All enter utilities use `animation-fill-mode: both`, so there's no flash of
  unstyled content and no snap-back.

**Tune travel inline** instead of editing keyframes:
```html
<div class="anim-fade-up" style="--scs-travel-md: 16px; --scs-anim-duration: 320ms;">…</div>
```

---

## 6. Scroll animation — RESTRAINT is the whole point

Scroll effects are the easiest way to make a site feel cheap. The bar is high.

**Rules of restraint:**
1. **Reveal once, then leave it.** Content fade-ups should fire on enter with
   `once: true` and stay put. Do NOT re-animate when the user scrolls back up —
   re-triggering reveals is the #1 "AI slop" tell. (See split-text-stagger's
   `ScrollTrigger.create({ once: true })`.)
2. **Trigger early.** Start reveals around `top 85%` (element 15% into the
   viewport), not dead center — by the time the user looks, it's already settled.
3. **Scrub belongs to a few things only.** Reserve scroll-*scrubbing* (progress
   tied to scroll position) for: the reading `scroll-progress-bar`, parallax
   depth, pinned sequences, and `image-scrub-sequence`. Body copy and cards
   should fade in once — never scrub.
4. **Budget the big effects.** At most **one** pinned / scrubbed showpiece per
   page (`pinned-scroll-section`, `sticky-stacking-cards`, `horizontal-scroll-gallery`,
   `layered-zoom-scroll`). Two competing pins fight the scrollbar and nauseate.
5. **No parallax on text you must read.** Parallax is for imagery and decoration.
6. **Marquees scroll slowly and pause on hover.** `--scs-duration-loop-marquee`
   is 28s for a reason; `.anim-marquee:hover` pauses so users can read links.

**Scroll component map (`components/motion/`):**
- Reveal-once: `scroll-text-reveal`, `split-text-stagger`, `svg-text-clip-reveal`,
  `svg-line-draw-on-scroll`.
- Scrubbed/ambient: `scroll-progress-bar`, `parallax-layers`,
  `infinite-parallax-scroll`, `scroll-velocity-skew-marquee`.
- Pinned showpiece (max one/page): `pinned-scroll-section`, `sticky-grid-scroll`,
  `sticky-stacking-cards`, `horizontal-scroll-gallery`, `layered-zoom-scroll`,
  `image-scrub-sequence`, `scroll-text-cylinder`.

**GSAP/ScrollTrigger hygiene:**
- `gsap.registerPlugin(ScrollTrigger)` once; guard for `typeof gsap === 'undefined'`
  (components already do this and warn instead of throwing).
- Animate `transform`/`opacity` (these use `yPercent`, `autoAlpha`).
- Call `ScrollTrigger.refresh()` after fonts load / layout shifts, and after
  responsive breakpoints change pin distances.
- Prefer `gsap.quickTo` for pointer-driven motion (magnetic button) — allocation-free.

---

## 7. Reduced motion — honored globally, don't undermine it

`prefers-reduced-motion: reduce` is respected in **two** places already:

1. `motion.css` kills every `.anim-*` animation AND forces enter-animations to
   their finished state (`opacity:1; transform:none; filter:none`) so nothing is
   stranded invisible. Marquees freeze static.
2. `tokens.css` zeroes the `--duration-*` tokens to `0ms`, so any CSS
   `transition` reading those tokens becomes effectively instant.

**Your obligations when adding motion:**
- For plain CSS transitions, **read the duration tokens** (`var(--duration-base)`)
  so they auto-respect reduced motion — don't hardcode `250ms`.
- For JS / GSAP effects, check the preference and provide a static fallback:

```js
const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
if (reduce) {
  gsap.set(units, { autoAlpha: 1, yPercent: 0 }); // jump to final state
} else {
  animate();
}
```

- **Never strand content.** If something starts at `opacity: 0`, reduced motion
  MUST land it at `opacity: 1`. Test by toggling the OS setting (macOS:
  System Settings → Accessibility → Display → Reduce motion).
- Scroll-progress bars, focus rings, and "is it loading?" feedback should still
  *work* with reduced motion — just without the easing flourish.

---

## 8. Pre-ship motion checklist

- [ ] Every animation has a clear purpose (eye-guide, state, feedback, load).
- [ ] UI motion is 80–400ms; only hero reveals exceed it.
- [ ] No `width`/`height`/`top`/`left`/`margin` animated — `transform`/`opacity` only.
- [ ] Easing on everything except continuous loops (which are `linear`).
- [ ] Interactive elements have `:hover`, `:active`, AND `:focus-visible`.
- [ ] Scroll reveals fire **once** at ~`top 85%`; no re-trigger on scroll-up.
- [ ] At most one pinned/scrubbed showpiece on the page.
- [ ] Marquees scroll slowly and pause on hover.
- [ ] `will-change` only on continuously-animating layers.
- [ ] `prefers-reduced-motion` tested ON — nothing stranded, nothing janks.
- [ ] Used `.anim-*` utilities and `--scs-`/`--ease-`/`--duration-` tokens
      instead of bespoke keyframes and magic numbers.
