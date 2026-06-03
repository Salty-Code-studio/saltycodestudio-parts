# Accessibility Playbook (WCAG 2.2 AA)

A working checklist for building accessible sites. Target **WCAG 2.2 Level AA**. Don't bolt this on at the end — most of it is free if you do it while building.

How to use this file: each section has a rule of thumb, concrete do/don't examples, and a checklist you can run line by line.

---

## 0. The 10-second sanity pass

Before anything fancy, every page must survive these:

- [ ] Unplug the mouse. Can you reach and operate **everything** with Tab / Shift+Tab / Enter / Space / arrows?
- [ ] Is the focused element **always visibly outlined**?
- [ ] Zoom the browser to **200%**. Does content reflow without horizontal scroll or clipping?
- [ ] Turn images off. Does the page still make sense from alt text and labels?
- [ ] Run the page heading outline. Is it a logical document, not a soup of `<div>`s?

If any of these fail, fix that before adding ARIA, animations, or polish.

---

## 1. Semantic HTML first

**Rule:** Use the element that already does the job. Native HTML gives you keyboard support, focus, roles, and states for free. ARIA gives you none of that — it only renames things.

### Do
```html
<button type="button">Delete</button>
<a href="/pricing">Pricing</a>
<nav aria-label="Primary">…</nav>
<main>…</main>
<input type="checkbox" id="terms"> <label for="terms">I agree</label>
```

### Don't
```html
<!-- No keyboard, no role, no Enter/Space handling, no focusability -->
<div class="btn" onclick="del()">Delete</div>
<span class="link" onclick="go()">Pricing</span>
```

### Landmarks (one structural skeleton per page)
- `<header>` — site header (banner)
- `<nav>` — navigation; **label each** with `aria-label` if there's more than one (`aria-label="Primary"`, `aria-label="Footer"`)
- `<main>` — the unique page content. **Exactly one per page.**
- `<aside>` — complementary content
- `<footer>` — site footer (contentinfo)
- Use `<section>` only with an accessible name (an `aria-labelledby` pointing at its heading). A nameless `<section>` is just a `<div>`.

### Checklist
- [ ] Buttons that do an action = `<button>`. Things that navigate to a URL = `<a href>`. Never swap them.
- [ ] Exactly one `<main>`, one `<h1>`.
- [ ] All interactive widgets are native elements unless genuinely impossible.
- [ ] Lists are `<ul>`/`<ol>`/`<li>`, not stacked divs.
- [ ] Tables are `<table>` with `<th scope="col|row">` — not CSS grid faking a table.
- [ ] No `onclick` on `<div>`/`<span>` for interactive behavior.

---

## 2. Heading order

**Rule:** Headings are an outline, not font sizes. Screen-reader users jump by heading (H key) and rely on a clean tree. Style with CSS, structure with levels.

### Do
```
h1  Page title (one only)
  h2  Section
    h3  Subsection
    h3  Subsection
  h2  Section
```

### Don't
- Skip levels going down (h2 → h4). Going back up is fine (h4 → h2).
- Pick `<h3>` because "it looks the right size." Pick the level, then style it.
- Use a heading as a label for a form field — use `<label>`.

### Checklist
- [ ] Exactly one `<h1>` describing the page.
- [ ] No skipped levels descending.
- [ ] Every major section starts with a heading.
- [ ] Headings describe content, not decoration ("Pricing", not "Look here").
- [ ] Verify with a headings extension (e.g. headingsMap) or DevTools accessibility tree.

---

## 3. Keyboard navigation & focus order

**Rule:** Everything works with a keyboard, in an order that matches the visual layout.

### Focus order
- DOM order = focus order. If CSS (flex/grid `order`, `position`) makes visual order differ from DOM order, fix the DOM, not with `tabindex` hacks.
- **Never use positive tabindex** (`tabindex="2"`). It hijacks the whole page order.
  - `tabindex="0"` — add a non-native element to the natural tab order (rare; prefer native).
  - `tabindex="-1"` — focusable by script only (e.g. move focus to a heading or dialog). Good.

### Keyboard interactions to honor
- `<button>` / links: Enter (and Space for buttons) activate.
- Modal/dialog: Escape closes; focus is **trapped** inside while open; focus returns to the trigger on close.
- Menus / tabs / comboboxes: arrow keys move within; Home/End jump; Escape exits. (Follow the [APG patterns](https://www.w3.org/WAI/ARIA/apg/patterns/).)
- Custom dropdowns must not be a `<div>` you can't reach. Use `<select>` or a real combobox pattern.

### Traps
- **No keyboard traps** (except intentional modal focus trapping). If Tab gets stuck in a widget (common with embeds/iframes/date pickers), it's a fail.

### Checklist
- [ ] Tab reaches every interactive element; Shift+Tab reverses cleanly.
- [ ] Tab order follows visual reading order.
- [ ] No positive `tabindex`.
- [ ] Modals trap focus, close on Escape, restore focus to the trigger.
- [ ] Custom widgets implement expected arrow-key behavior.
- [ ] Dropdown/autocomplete is operable without a mouse.
- [ ] Nothing is reachable by mouse but not keyboard (and vice versa).

---

## 4. Visible focus

**Rule:** A keyboard user must always see where they are. **Never** `outline: none` without a replacement.

### Do
```css
/* Don't kill the default outline globally. If you restyle, make it strong. */
:focus-visible {
  outline: 3px solid #1a73e8;
  outline-offset: 2px;
  border-radius: 2px;
}
```
- Use `:focus-visible` so mouse clicks don't show a ring but keyboard focus does.
- Focus indicator must have **≥ 3:1 contrast** against the adjacent background (WCAG 2.2 SC 2.4.11) and be clearly visible (≥ 2px thick is a safe target).

### Don't
```css
*:focus { outline: none; }          /* removes focus for everyone — fail */
button:focus { outline: 0; }        /* same */
```

### Checklist
- [ ] No global `outline: none` without a visible replacement.
- [ ] Focus ring visible on every interactive element, including custom ones.
- [ ] Focus indicator meets ≥ 3:1 contrast and isn't clipped by `overflow: hidden`.
- [ ] On dark and light themes both, the ring is visible.
- [ ] Sticky headers don't cover the focused element (scroll-padding / `scroll-margin`).

---

## 5. ARIA — only when needed

**Rule:** **No ARIA is better than bad ARIA.** First rule of ARIA: don't use ARIA if a native element works. ARIA changes the accessibility tree but adds **zero** behavior — you must wire up keyboard + state yourself.

### When you actually need it
- Naming a landmark that repeats: `aria-label="Footer navigation"`.
- Linking a custom control to its label/description: `aria-labelledby`, `aria-describedby`.
- Live regions for dynamic updates (see §9).
- Communicating state on custom widgets: `aria-expanded`, `aria-selected`, `aria-current`, `aria-checked`, `aria-pressed`.
- Hiding decorative/duplicate content from AT: `aria-hidden="true"`.

### Do
```html
<button aria-expanded="false" aria-controls="menu">Menu</button>
<ul id="menu" hidden>…</ul>
<!-- update aria-expanded to "true" when opened -->

<a href="/about" aria-current="page">About</a>   <!-- marks current nav item -->
```

### Don't
```html
<button role="button">…</button>        <!-- redundant role -->
<a href="#" role="link">…</a>            <!-- redundant -->
<div role="button">…</div>               <!-- now you owe keyboard + Space/Enter + focus -->
<input aria-hidden="true">               <!-- never hide a focusable element from AT -->
```

### Hard rules
- Don't put `aria-hidden="true"` on anything focusable or containing focusable elements — it creates "ghost" tab stops with no announcement.
- Don't override native roles (`<h2 role="tab">`) unless implementing a full APG pattern.
- Keep ARIA **state attributes updated** in JS. A `aria-expanded` that never flips to `true` is a lie.

### Checklist
- [ ] Every ARIA role is paired with the keyboard + state behavior it implies.
- [ ] No redundant roles on native elements.
- [ ] `aria-hidden` only on non-focusable decorative content.
- [ ] Dynamic states (`expanded`, `selected`, `current`, `checked`) update in real time.
- [ ] Prefer `aria-labelledby`/`<label>` over `aria-label` when visible text exists.

---

## 6. Color & contrast

**Rule:** Don't rely on color alone, and meet contrast ratios.

### Ratios (WCAG AA)
- **Normal text:** ≥ **4.5:1** against its background.
- **Large text** (≥ 24px, or ≥ 18.66px bold / 14pt bold): ≥ **3:1**.
- **UI components & graphics** (icons, input borders, focus rings, chart segments you must distinguish): ≥ **3:1** (SC 1.4.11).
- Disabled controls are exempt, but don't abuse that to dodge contrast on real controls.

### Don't rely on color alone (SC 1.4.1)
- Error fields: add an icon + text ("Email is required"), not just a red border.
- Links in body text: underline them, or ensure ≥ 3:1 contrast vs surrounding text **and** a non-color cue on hover/focus.
- Charts/legends: use labels, patterns, or direct labeling, not color swatches only.
- "Required" status: add `*` + text, plus `aria-required`/`required`.

### Watch-outs
- Light gray placeholder text usually fails. Placeholder is **not** a label anyway (see §8).
- Text over images/gradients: add a scrim/overlay and re-check contrast at the worst pixel.
- Hover/focus/visited states each need to pass too.

### Checklist
- [ ] All text meets 4.5:1 (3:1 for large).
- [ ] Icons, borders, focus rings, and meaningful graphics meet 3:1.
- [ ] No information conveyed by color alone (errors, links, status, charts).
- [ ] Text over imagery passes at the lowest-contrast spot.
- [ ] Checked with a contrast tool (DevTools, axe, Stark, Polypane).

---

## 7. Alt text

**Rule:** Alt text describes **purpose in context**, not the file. Every `<img>` needs an `alt` attribute — sometimes empty.

### Decision tree
- **Informative image** → describe what it conveys. `alt="Bar chart: sales doubled from 2024 to 2025"`.
- **Functional image** (logo link, icon button) → describe the action/destination, not the picture. `alt="Salty Code Studio — home"`.
- **Decorative image** (background texture, divider) → `alt=""` (empty, present). This hides it from AT. Or use CSS backgrounds for pure decoration.
- **Complex image** (detailed chart/diagram) → short `alt` + a longer description nearby (visible caption or linked text).
- **Image of text** → avoid entirely; if unavoidable, `alt` contains the exact text.

### Do
```html
<img src="hero.jpg" alt="">                                  <!-- decorative -->
<img src="map.png" alt="Office at 12 Kaya Grandi, Kralendijk">
<a href="/"><img src="logo.svg" alt="Salty Code Studio home"></a>
<button><svg aria-hidden="true">…</svg><span class="sr-only">Close</span></button>
```

### Don't
```html
<img src="photo.jpg">                          <!-- missing alt = filename read aloud -->
<img src="x.jpg" alt="image">                  <!-- useless -->
<img src="x.jpg" alt="photo of a photo of…">   <!-- don't start with "image of" -->
```

### Checklist
- [ ] Every `<img>` has an `alt` (empty `alt=""` for decorative).
- [ ] Alt describes purpose/context, not "image of…".
- [ ] Icon-only buttons/links have an accessible name (`sr-only` text or `aria-label`).
- [ ] SVGs: decorative ones get `aria-hidden="true"`; meaningful ones get `<title>` or `aria-label` + `role="img"`.
- [ ] No important info trapped in an image of text.

---

## 8. Forms & labels

**Rule:** Every input has a real, programmatically associated label. Placeholders are not labels.

### Labels
```html
<label for="email">Email address</label>
<input id="email" type="email" name="email" autocomplete="email" required>
```
- Visible `<label for>` matched to input `id` is the gold standard.
- Wrapping also works: `<label>Email <input type="email"></label>`.
- If a visible label is truly impossible (e.g. a search icon field), use `aria-label`.

### Help & errors
```html
<label for="pw">Password</label>
<input id="pw" type="password" aria-describedby="pw-help pw-err" aria-invalid="true">
<p id="pw-help">At least 12 characters.</p>
<p id="pw-err">Password is too short.</p>
```
- Associate hints and errors with `aria-describedby`.
- Mark invalid fields with `aria-invalid="true"`.
- Error messages: specific and text-based ("Enter a valid email like name@site.com"), not just a red ring.
- On submit failure, move focus to the first error (or a summary at top that links to fields).

### Make it easy
- Use the right `type` (`email`, `tel`, `url`, `number`, `date`) for mobile keyboards.
- Use `autocomplete` tokens (`name`, `email`, `tel`, `street-address`, `cc-number`…). Required for SC 1.3.5.
- Group related controls: `<fieldset>` + `<legend>` for radios/checkboxes.
- Don't disable the submit button until valid — it's confusing and often unreachable; validate and explain instead.
- Inputs need a visible focus state and ≥ 3:1 border contrast.

### Checklist
- [ ] Every field has an associated `<label>` (or justified `aria-label`).
- [ ] Placeholder is never the only label.
- [ ] `autocomplete` set on personal-data fields.
- [ ] Correct `type` for each field.
- [ ] Radio/checkbox groups wrapped in `<fieldset>`/`<legend>`.
- [ ] Errors are text, specific, linked via `aria-describedby`, and `aria-invalid` set.
- [ ] Focus moves to the first error on failed submit.
- [ ] Required fields indicated in text + `required`/`aria-required`, not color alone.
- [ ] Tap/click targets ≥ 24×24px (SC 2.5.8), comfortably 44×44px.

---

## 9. Motion & sensory

**Rule:** Respect users who get sick or distracted by motion. Honor `prefers-reduced-motion`.

### Do
```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```
- Build the reduced-motion version as a real path — replace parallax/auto-scroll/large transforms with a static or near-instant state, not just faster jank.
- Use the JS matchMedia equivalent for canvas/WebGL/JS animations: `matchMedia('(prefers-reduced-motion: reduce)')`.

### Hard rules
- **Auto-playing motion > 5s** (carousels, video, marquees) must have a visible pause/stop/hide control (SC 2.2.2).
- **No flashing > 3 times per second** (seizure risk, SC 2.3.1).
- Parallax, auto-advancing carousels, and big scroll-jacking effects must reduce or stop under reduced-motion.
- Don't auto-play video with sound. Provide controls.

### Other sensory
- Don't rely on shape/location/sound alone ("click the round button on the right") — name it.
- Animations triggered by interaction should be subtle and brief; long ones block task completion.

### Checklist
- [ ] `prefers-reduced-motion: reduce` honored in CSS **and** JS animations.
- [ ] Reduced-motion path is a genuine static/calm alternative.
- [ ] Auto-playing content > 5s has pause/stop/hide.
- [ ] Nothing flashes more than 3×/second.
- [ ] No autoplay audio; media has controls.
- [ ] Instructions don't depend on color, shape, or position alone.

---

## 10. Other essentials (don't skip)

- **Page `<title>`** is unique and descriptive per page (SC 2.4.2): `"Pricing — Salty Code Studio"`.
- **`lang` attribute** on `<html lang="en">` (and `lang` on any inline foreign-language passages, e.g. `<span lang="pap">Dushi</span>`).
- **Skip link** as the first focusable element: `<a href="#main" class="skip-link">Skip to content</a>` that becomes visible on focus.
- **Link text makes sense out of context** — no bare "click here" / "read more"; say "Read the pricing guide."
- **Reflow:** usable at 320px wide / 400% zoom with no 2-D scrolling (SC 1.4.10).
- **Text spacing:** layout survives user-applied line-height/letter-spacing overrides (SC 1.4.12); avoid fixed-height text containers with `overflow: hidden`.
- **Don't disable zoom:** no `user-scalable=no` / `maximum-scale=1` in the viewport meta.
- **Media:** captions for video, transcripts for audio, audio description where needed.
- **Status messages** (cart updated, form saved, "3 results") announced via a live region without moving focus:
  ```html
  <div role="status" aria-live="polite">Item added to cart</div>
  ```
  Use `aria-live="assertive"`/`role="alert"` only for urgent errors.

### Checklist
- [ ] Unique, descriptive `<title>` per page.
- [ ] `lang` on `<html>` and on foreign-language passages.
- [ ] Visible-on-focus skip link to `<main>`.
- [ ] All link text is meaningful standalone.
- [ ] No `user-scalable=no`; pinch-zoom works.
- [ ] Reflows at 320px / 400% zoom.
- [ ] Dynamic updates announced via `role="status"`/`aria-live`.
- [ ] Video captioned; audio transcribed.

---

## 11. Testing — how to actually verify

Automated tools catch ~30–40%. The rest is manual. Do both.

### Automated (fast, do on every build)
- [ ] **axe DevTools** browser extension or `@axe-core/playwright` in CI — zero violations on key pages.
- [ ] **Lighthouse** Accessibility audit (Chrome DevTools) — treat as a floor, not a pass mark.
- [ ] **WAVE** (wave.webaim.org) for a visual overlay of issues/landmarks/contrast.
- [ ] HTML validates (nesting errors break AT).

### Manual keyboard (do per page)
- [ ] Tab through the whole page — order logical, focus always visible, no traps.
- [ ] Operate every control with keyboard only (Enter/Space/arrows/Escape).
- [ ] Modals/menus: open, trap, Escape, focus returns.

### Screen reader (do on critical flows: nav, forms, checkout)
- **macOS:** VoiceOver — `Cmd+F5` to toggle. Navigate with `Ctrl+Option+→`, rotor `Ctrl+Option+U`. Test in **Safari** (best pairing).
- **Windows:** **NVDA** (free) in Firefox/Chrome — the most representative real-world combo. Arrow keys read; `H` next heading; `D` landmarks; `F` form fields; `K` links; `Insert+F7` element list.
- **Mobile:** VoiceOver (iOS, swipe to move) and TalkBack (Android).
- Listen for: Are labels announced? Do buttons say what they do? Are headings/landmarks navigable? Are errors and live updates announced? Any element read as "clickable" with no name, or skipped entirely?

### Visual / zoom
- [ ] Zoom to 200% and 400% — reflow, no clipping, no horizontal scroll at 320px.
- [ ] Force-dark and high-contrast OS modes don't hide content.
- [ ] Contrast checked on text, icons, borders, focus rings (DevTools contrast / Stark).

### Reduced motion
- [ ] OS "Reduce motion" on → animations calm/static, carousels stop.

### Per-page release gate (copy this into your PR template)
- [ ] axe: 0 violations
- [ ] Keyboard-only walkthrough passes
- [ ] One screen-reader pass on the primary flow
- [ ] 200% zoom + 320px reflow OK
- [ ] Contrast verified on new UI
- [ ] Reduced-motion verified if anything animates

---

## Quick reference — the numbers

| Thing | Requirement |
|---|---|
| Normal text contrast | 4.5:1 |
| Large text contrast (≥24px / ≥18.66px bold) | 3:1 |
| UI / icons / borders / focus ring contrast | 3:1 |
| Target size (min) | 24×24px (aim 44×44px) |
| Flashing | < 3 per second |
| Auto-motion needing a control | > 5 seconds |
| Reflow / zoom | usable at 320px / 400% |
| `<h1>` per page | exactly 1 |
| `<main>` per page | exactly 1 |
| Positive `tabindex` | never |
| `outline: none` without replacement | never |
