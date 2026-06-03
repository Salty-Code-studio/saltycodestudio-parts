# Spacing & Rhythm

Spacing is the single biggest difference between a site that looks expensive and one that looks like a template. Amateurs decorate; professionals space. Generous, consistent, intentional spacing reads as confidence and quality — even with plain type and a two-color palette.

Core belief: **most cheap-looking sites are not ugly, they are cramped.** When in doubt, add space.

---

## 1. Use a Spacing Scale — Never Random Numbers

Pick a base unit and only use multiples of it. **Base = 4px** (or 8px for simpler systems). Every margin, padding, and gap comes from the scale. This is what makes spacing feel "tuned" instead of arbitrary.

**Recommended scale (4px base):**

```
4   8   12   16   24   32   48   64   96   128   160   192
```

Note it's roughly geometric at the large end — gaps get bigger as you go up, which matches how spacing should scale.

**DO** snap every value to the scale: `padding: 24px`, `gap: 32px`, `margin-top: 64px`.
**DON'T** ship `margin-top: 23px`, `padding: 17px 30px`, `gap: 14px`. Random odd numbers are the fingerprint of guessing.

**Implementation — define tokens, then reuse:**
```css
:root {
  --space-1: 4px;   --space-2: 8px;   --space-3: 12px;
  --space-4: 16px;  --space-6: 24px;  --space-8: 32px;
  --space-12: 48px; --space-16: 64px; --space-24: 96px;
  --space-32: 128px;
}
```
If using Tailwind, this scale is already built in (`p-4` = 16px, `py-24` = 96px) — just stick to it and avoid arbitrary `[23px]` values.

---

## 2. Section Padding That Feels Expensive

The fastest upgrade to any site: **more vertical padding between sections.** This is where premium lives.

**Vertical section padding (top + bottom of each major section):**
- Tight / dense apps: `48px`–`64px`
- Standard marketing site: `80px`–`96px`
- Premium / luxury / spacious editorial: `120px`–`160px`+

**DO** give marketing sections `96px`–`128px` of vertical breathing room on desktop. The empty space signals "we're confident, we don't need to shout."
**DON'T** pack sections with `32px` top/bottom on a marketing page — it feels busy and budget. Cramped padding is the #1 tell of a cheap site.

```css
.section { padding-block: 96px; }
@media (min-width: 1024px) { .section { padding-block: 128px; } }
@media (max-width: 640px)  { .section { padding-block: 64px; } }  /* scale down on mobile */
```

**Rule:** the space *between* two sections should be clearly larger than the space *within* a section. If the gap between a heading and its paragraph equals the gap between two sections, the structure dissolves.

---

## 3. Vertical Rhythm & Proximity

Spacing communicates relationship. **Things that belong together sit close; things that don't sit far apart.** This is the law of proximity, and it does more for clarity than any divider line.

**A reliable spacing ladder within a section:**
- Label/eyebrow → heading: `8px`–`12px` (tightly bound)
- Heading → body paragraph: `16px`–`24px`
- Paragraph → paragraph: `16px`–`20px`
- Body → CTA button: `32px`–`40px`
- Content block → next content block: `48px`–`64px`
- Section → section: `96px`–`160px`

**DO** group a label, heading, and intro with tight internal spacing, then push the next group far away. The grouping does the explaining.
**DON'T** use uniform `24px` everywhere. Equal spacing erases hierarchy — the eye can't tell what's grouped.

**Line-height (the vertical rhythm of text):**
- Body copy: `1.5`–`1.65` (never `1.0`–`1.2` — it's claustrophobic)
- Headings: `1.1`–`1.25` (tight, because large type needs less)
- Buttons / labels: `1`–`1.2`

**Paragraph spacing:** Set space between paragraphs to roughly one line-height (`~1em`–`1.5em`). Don't rely on first-line indents on the web.

---

## 4. Whitespace Is a Feature, Not Wasted Space

Whitespace (negative space) is not "empty" — it's an active design tool. It creates focus, signals quality, and gives the eye rest.

- **Micro whitespace:** space between letters, words, lines, list items. Controls readability.
- **Macro whitespace:** space around major blocks, margins, the void around a hero headline. Controls perceived value.

**DO** let a hero headline sit in a large field of nothing. Isolation = importance. A single centered statement with huge margins reads as luxury (think Apple, premium fashion).
**DON'T** fill every empty area with a badge, illustration, or "as seen in" strip just because it's blank. Resist the urge to fill. The blankness is doing work.

**Letter-spacing (tracking):**
- Large display headings: tighten slightly, `-0.01em` to `-0.03em` (big type looks loose by default).
- All-caps labels/eyebrows: open up, `+0.05em` to `+0.1em` (caps need air).
- Body text: leave at `0` (default).

---

## 5. Density vs. Breathing Room — Match the Context

Spacing isn't "more is always better" — it's "right for the job." Calibrate to content type:

| Context | Density | Section padding | Why |
|---|---|---|---|
| Marketing / landing | Spacious | 96–160px | Selling a feeling; space = premium |
| Editorial / blog | Generous | 64–96px | Readability and calm |
| Dashboard / data app | Compact | 24–48px | Users scan lots of info fast |
| Pricing / comparison table | Medium | 16–32px cells | Dense but scannable |
| Forms | Medium | 16–24px between fields | Group related fields, separate steps |

**DO** make a SaaS dashboard denser than its marketing site — power users want information density, not poster-sized whitespace.
**DON'T** apply `128px` section padding to an analytics dashboard. It forces endless scrolling and frustrates the user. Context dictates density.

**Even in dense UIs, keep the scale.** Compact still means `8/12/16/24`, not random `7/13/19`.

---

## 6. Internal Padding — Cards, Buttons, Inputs

Components need internal breathing room proportional to their size.

**Buttons:**
- Padding: `12px 24px` (vertical horizontal) for standard; `16px 32px` for large/hero CTAs.
- Horizontal padding should clearly exceed vertical (roughly 2x) — cramped side padding makes buttons look pinched.

**Cards:**
- Internal padding: `24px`–`32px` for content cards; `32px`–`48px` for feature/pricing cards.
- Keep padding consistent on all four sides unless deliberately asymmetric.

**Inputs:**
- Padding: `12px 16px`. Match button height so adjacent input + button align.

**DO** give a pricing card `40px` of internal padding so the content floats comfortably.
**DON'T** let text touch a card's edge with `8px` padding — it looks like the content is trying to escape. Tight internal padding is a classic cheap tell.

---

## 7. Consistency — The Spacing Is the System

The exact values matter far less than **using the same values everywhere.** A site with consistent (even imperfect) spacing looks designed; a site with twelve slightly-different gaps looks broken.

- Reuse the same section padding for every section (one value, applied via a `.section` class).
- Use the same gap inside every grid of cards.
- Same vertical gap between every heading and its body across the whole site.

**DO** define spacing tokens once and apply them by name everywhere.
**DON'T** eyeball each section separately — you'll end up with `88px`, `92px`, `96px`, `104px` gaps that the eye reads as "sloppy" even if no single one is wrong.

**Optical consistency:** sometimes equal numbers look unequal (e.g. a heading with descenders vs. one without). Trust your eye over the spec for the final nudge — but only after the system is consistent.

---

## 8. Common Spacing Mistakes (The Cheap Tells)

Things that instantly make a site look amateur:

- **Cramped sections** — `32px` between sections on a marketing page.
- **Uniform spacing** — `16px` between everything, killing hierarchy.
- **Text touching edges** — no padding on cards, content flush to screen edge on mobile.
- **Tight line-height** — body at `1.2`, headings at `1.5` (backwards).
- **Random values** — `17px`, `23px`, `31px` instead of a scale.
- **No mobile reduction** — `128px` desktop section padding left unchanged on a 375px phone, wasting half the screen.
- **Inconsistent gutters** — card grids with mismatched horizontal/vertical gaps.

---

## Quick Audit Checklist

Before shipping, verify:

- [ ] Every spacing value is a multiple of the base (4px or 8px). No `17px`, `23px`.
- [ ] Section padding is generous: 80–160px vertical on marketing (scaled down per context).
- [ ] Gap *between* sections clearly exceeds gap *within* sections.
- [ ] Proximity grouping: related items close, unrelated far. Spacing isn't uniform.
- [ ] Body line-height 1.5–1.65; heading line-height 1.1–1.25 (headings tighter, not looser).
- [ ] Cards/buttons/inputs have comfortable internal padding (no text touching edges).
- [ ] Whitespace is preserved, not filled with clutter.
- [ ] Density matches context (dashboard compact, landing spacious).
- [ ] Spacing values are consistent and token-based, applied the same way everywhere.
- [ ] Mobile padding scaled down (e.g. 128px → 64px) so big screens and phones both feel right.
