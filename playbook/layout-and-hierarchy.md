# Layout & Hierarchy

How to arrange things on a page so the eye knows where to go, in what order, and never feels lost. This is the structural backbone of a site that looks intentional instead of assembled.

Rule of thumb: **a viewer should be able to squint at any screen and still understand what matters first, second, third.** If everything is equally loud, nothing is.

---

## 1. The 12-Column Grid (default for desktop)

Use a 12-column grid. It divides cleanly into halves (6/6), thirds (4/4/4), quarters (3/3/3/3), and the asymmetric 8/4 and 7/5 splits that look designed rather than centered-by-default.

**Concrete defaults:**
- Max content width: `1200px`–`1280px` for marketing sites. Never let text run edge-to-edge on a 1920px monitor.
- Gutter (space between columns): `24px`–`32px`.
- Outer margin / page padding: `24px` mobile, `48px`–`80px` desktop.
- Center the grid in the viewport; let the background bleed full-width, constrain the content.

```css
.container { max-width: 1200px; margin-inline: auto; padding-inline: 24px; }
@media (min-width: 768px) { .container { padding-inline: 48px; } }
```

**DO** let a hero image or color band span the full viewport width while its text stays inside the 1200px container.
**DON'T** put body text in a single column spanning 1400px+ — lines over ~75 characters are exhausting to read.

**Optimal measure (line length):** 50–75 characters per line for body copy. Use `max-width: 65ch` on paragraph blocks.

---

## 2. Visual Hierarchy — The Order of Attention

Hierarchy is built from **four levers**, in order of power:

1. **Size** — biggest thing wins. The eye goes there first.
2. **Weight / contrast** — bold dark text on light beats thin gray.
3. **Color** — one saturated accent in a muted field pulls focus.
4. **Position & space** — isolation creates importance (whitespace around an element = "look here").

Stack these deliberately. A headline should win on *several* levers at once (big + bold + high contrast). A caption should lose on all of them (small + light + muted).

**Type scale — pick a ratio and commit.** A modular scale (1.25 or 1.333) keeps sizes related:

| Role | Size (desktop) | Weight |
|---|---|---|
| Display / hero | 56–80px | 600–700 |
| Section heading (H2) | 32–44px | 600 |
| Subheading (H3) | 22–28px | 600 |
| Body | 16–18px | 400 |
| Small / caption | 13–14px | 400–500 |

**DO** make the jump between levels obvious — hero (72px) to body (18px) is a 4x ratio. The contrast reads as confidence.
**DON'T** ship a page where the H1 is 28px and body is 16px. A 1.75x ratio looks timid and "corporate template."

**The 3-level rule:** On any given screen, the user should perceive at most 3 levels of importance. More than that and the hierarchy collapses into noise.

---

## 3. Focal Points — One Hero Per View

Every section needs **one** clear focal point. Decide what it is before you place anything else, then make everything else defer to it.

- In a hero: the focal point is usually the headline + primary CTA, OR a single striking image. Not both fighting.
- A single saturated/contrasting element in an otherwise calm field becomes the focal point automatically.
- The primary CTA should be the single most visually dominant interactive element on the screen — one solid filled button. Secondary actions are ghost/text links.

**DON'T** put two equally-weighted CTAs side by side ("Get Started" and "Learn More" both as solid filled buttons). One filled, one outline/text.
**DO** use the squint test: blur your eyes — the focal point should still pop. If three things pop, you have no focal point.

---

## 4. Asymmetry — The Antidote to "AI Template" Look

Dead-center, perfectly symmetric layouts read as default and lifeless. Asymmetry signals a human made a decision.

**Tactics:**
- **Off-center hero text:** Put the headline in the left 7 columns, leave the right 5 for an image or negative space. More dynamic than centered.
- **Broken grid moments:** Let one image overlap the gutter or bleed off the edge. Controlled rule-breaking creates energy.
- **Alternating rows:** In a feature list, alternate image-left/text-right then image-right/text-left. Avoid 4 identical centered cards in a row when you can stagger.
- **Asymmetric splits:** Prefer 8/4 or 7/5 over 6/6. A 60/40 split looks composed; 50/50 looks like you couldn't decide.

**DO** balance an asymmetric layout with visual weight — a large image on the right balanced by a bold headline + whitespace on the left.
**DON'T** confuse asymmetric with unbalanced. Asymmetry still needs equilibrium: heavy element on one side, breathing room + a strong type anchor on the other.

**Caveat:** Centered IS correct for short focused moments — a single CTA section, a pricing callout, a quote. Use centering as a deliberate "pause," not as your default for everything.

---

## 5. Alignment — The Invisible Discipline

Misalignment is the #1 tell of an amateur layout. Everything should align to *something*.

**Hard rules:**
- Establish edges and stick to them. Text blocks, images, and buttons should share left edges (or right, or center) across a section — pick one and hold it.
- **Left-align body text.** Justified text creates ugly rivers of whitespace; centered body text (more than ~2 lines) is hard to read. Center only short headlines or single-line labels.
- Align to the grid columns, not to arbitrary pixel positions.
- Optical alignment beats mathematical when needed: a round shape or punctuation may need a nudge to *look* aligned even when it isn't numerically.

**DO** keep a consistent left margin so the eye can track straight down the page.
**DON'T** center one section, left-align the next, right-align a third with no reason. Inconsistent alignment feels like drift.

**Baseline alignment:** When elements sit in a row (icon + label, image + caption), align their baselines or centers — not their bounding boxes. Mismatched vertical alignment in a row looks broken even at a glance.

---

## 6. Contrast in Size & Weight — Where Premium Comes From

Confident design lives in **bold contrast**, not gentle gradation. Timid spacing between sizes/weights is what makes a design feel cheap.

- **Size contrast:** A huge headline next to small supporting text. Don't be afraid of 64px+ display type on desktop. The drama is the point.
- **Weight contrast:** Pair one bold weight (600/700) with one regular (400). Skip the in-between 500 for body — it muddies the contrast. Use weight, not just size, to separate a label from its value.
- **Contrast pairing:** Big-thin can be elegant (large light display type); big-bold is loud and confident. Pick per brand. Small-bold is great for eyebrow labels/kickers above a heading.

**DO** pair extremes: 72px/700 headline with 16px/400 body. The gap reads as intentional.
**DON'T** use five different weights and six sizes that are all close together. That's mush, not hierarchy.

**Eyebrow/kicker pattern (high value, low effort):**
```
TINY UPPERCASE LABEL  ← 13px, 600, letter-spacing 0.08em, accent color
Big Confident Headline  ← 48px, 700
Calm supporting sentence that explains.  ← 18px, 400, muted
```

---

## 7. Above-the-Fold Composition

The first screen (no scrolling) must answer three questions in under 5 seconds: **What is this? Why should I care? What do I do next?**

**The above-the-fold checklist:**
- [ ] One clear headline stating the value proposition (not a clever tagline nobody understands).
- [ ] One supporting line of context (1–2 sentences max).
- [ ] One primary CTA, visually dominant.
- [ ] One supporting visual OR generous negative space (don't cram).
- [ ] Logo / nav, minimal.
- [ ] A hint of the next section peeking above the fold so users know to scroll (don't make the hero exactly 100vh with a hard bottom edge — let the next section's top edge show by ~40–80px).

**DON'T** stuff the hero with headline + subhead + 3 stats + 2 CTAs + a logo cloud + a product screenshot. Pick the essentials; push the rest below.
**DO** treat the fold like a movie poster: bold, singular, instantly legible.

**Vertical centering caution:** Centering hero content vertically in 100vh works on laptops but strands content on tall monitors. Prefer top-weighted hero content with comfortable top padding (e.g. starts ~15–20vh down) so it reads consistently across screen heights.

---

## 8. Reading Patterns — Place Content Where Eyes Go

Western readers scan in an **F-pattern** (text-heavy pages) or **Z-pattern** (sparse landing pages).

- **Z-pattern (hero/landing):** Logo top-left → nav/CTA top-right → diagonal sweep → headline lower-left → CTA lower-right. Place your primary CTA at the end of the Z.
- **F-pattern (content/blog):** Strong headline across the top, important info front-loaded on the left of each line, scannable subheads down the left edge.

**DO** put the logo top-left and a single nav CTA top-right — it matches ingrained habit.
**DON'T** bury the primary action in the bottom-center where the scan pattern doesn't naturally land.

---

## 9. Responsive Hierarchy — Reflow, Don't Just Shrink

Hierarchy must survive the jump to mobile.

- Multi-column desktop layouts collapse to a **single column** on mobile. Decide the source order so it reads logically top-to-bottom (text usually before image).
- Scale display type down but keep the contrast ratio: 72px desktop → ~36–40px mobile (not 20px).
- Reduce, don't reflow chaotically: an 8/4 split becomes stacked, image below text.
- Increase tap targets to min `44x44px`. Buttons go full-width or near it on mobile.

**DON'T** let a 64px headline stay 64px on a 375px screen — it wraps into 5 ugly lines.
**DO** test the squint/hierarchy on a 375px width, not just desktop. Most traffic is mobile.

---

## Quick Audit Checklist

Before shipping a layout, verify:

- [ ] Squint test passes — one clear focal point per screen.
- [ ] Type scale has obvious jumps (≥1.25 ratio), max 3 perceived levels per screen.
- [ ] One primary CTA, visually dominant; secondaries are quieter.
- [ ] Body text 50–75 chars/line, left-aligned, max ~65ch.
- [ ] Everything aligns to a shared edge / the grid. No drifting elements.
- [ ] Layout uses asymmetry with balance (not dead-center-everything, not lopsided).
- [ ] Content max-width constrained (~1200px); backgrounds may bleed full-width.
- [ ] Above-the-fold answers what/why/next; next section peeks below.
- [ ] Hierarchy holds on a 375px mobile width.
- [ ] No two solid CTAs competing; no 5 weights of type.
