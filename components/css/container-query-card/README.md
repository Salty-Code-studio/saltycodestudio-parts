# Container-Query Adaptive Card

A self-contained card that reflows from **stacked** to **side-by-side** based on
the width of its **parent slot**, not the viewport. The same markup drops into a
narrow sidebar, a constrained modal, or a full-bleed hero and always lays out
correctly — with **no media queries and no JavaScript**.

## How it works

1. The wrapper (`.cq-slot`) opts into containment with
   `container-type: inline-size` and a `container-name: card`. This makes the
   wrapper a *query container* — children can size themselves against the
   wrapper's inline-size instead of the viewport.
2. The card (`.cq-card`) is narrow-first: a single stacked column by default.
3. `@container card (min-width: 24rem)` flips it to a side-by-side grid and bumps
   the type scale. A second step at `40rem` grows the media panel and headline.

Because the queries target the *container* (not the screen), one card can render
three different ways on the same page, depending only on the slot it occupies.

## Files

- `styles.css` — the canonical, copy-paste CSS for the part (includes the
  `.cq-scope` "Sand & Surf" brand tokens).
- `index.html` — the minimal markup snippet for one card inside a slot.
- `preview.html` — open in any modern browser to see the card live in a
  sidebar/main app shell, a modal, a hero, and a drag-to-resize sandbox.

## Dependencies

None. Container queries are native Baseline CSS, supported across modern Chrome,
Edge, Safari, and Firefox.

## Paste-in instructions

1. Copy `styles.css` into your stylesheet (or `<link>` it). If you already have
   design tokens, you can drop the `.cq-scope` block and supply your own
   `--sand-bg`, `--ink`, `--teal`, etc. on `:root`.
2. Add the markup from `index.html`:

   ```html
   <div class="cq-slot">           <!-- the query container -->
     <article class="cq-card">
       <div class="cq-card__media"><span class="cq-card__tag">Tag</span></div>
       <div class="cq-card__body">
         <p class="cq-card__eyebrow">Eyebrow</p>
         <h3 class="cq-card__title">Title</h3>
         <p class="cq-card__text">Body copy…</p>
         <div class="cq-card__footer">
           <a class="cq-card__cta" href="#">Action</a>
           <span class="cq-card__meta">Meta</span>
         </div>
       </div>
     </article>
   </div>
   ```

3. Make sure `.cq-scope` (or your own token vars) sits on an ancestor so the
   colors resolve. Put the `.cq-slot` wherever you want — its width drives the
   layout. To tune the breakpoints, edit the `min-width` values in the
   `@container card (…)` rules.

## Accessibility / motion

Hover lift and CTA transitions are disabled under
`@media (prefers-reduced-motion: reduce)`. Layout itself is purely structural.

## Source / inspiration

Technique inspired by [web.dev — "Container queries are now stable in all modern
browsers"](https://web.dev/blog/cq-stable). web.dev content is under CC-BY 4.0;
this is a clean reimplementation. Container queries themselves are a native,
Baseline web platform feature.
