# Heart Like Burst

A like button where the heart pops with an elastic bounce and a ring of
colorful particles bursts outward — built entirely with CSS. No images, no
JavaScript, no SVG.

## How it works

A visually-hidden checkbox is the real toggle (so it is keyboard accessible
and announces state to assistive tech). The `:checked` state drives three
things on sibling elements:

1. **Elastic pop** — the heart glyph (`♥`) is scaled with an easeOutBack
   `cubic-bezier(.18, 1.55, .42, 1.06)` so it overshoots `1.0` and springs
   back.
2. **Dissolving bubble** — a `::before` ring expands from the heart and fades
   out.
3. **Particle burst** — a `::after` carries a single transparent dot with a
   list of 12 `box-shadow`s. Each shadow is placed around a circle using
   trig-precomputed `cos`/`sin` offsets multiplied by an animated
   `--hlb-r` (registered with `@property` so the length can tween). The ring
   flings outward and fades via `--hlb-o`.

Respects `prefers-reduced-motion`: the spring and burst are dropped, but the
heart still turns red when liked so the meaning is preserved.

> Note: animated `box-shadow` offsets via a custom property require
> `@property` support (Chrome/Edge/Safari 16.4+/Firefox 128+). In older
> browsers the heart still pops and recolors; only the particle ring is
> skipped.

## Dependencies

None.

## Paste-in instructions

1. Copy `styles.css` into your stylesheet (or link it).
2. Drop in the markup for each button — give every checkbox a unique `id`
   and an `aria-label`:

   ```html
   <span class="hlb">
     <input class="hlb__input" type="checkbox" id="like-1" aria-label="Like this post" />
     <span class="hlb__heart" aria-hidden="true"></span>
     <span class="hlb__glyph" aria-hidden="true"></span>
   </span>
   ```

3. Tune per instance with custom properties on the `.hlb` wrapper:

   - `--hlb-size` — overall size (default `64px`)
   - `--hlb-liked` — heart color when liked (default `#e0455e`)
   - `--hlb-idle` — heart color when not liked (default `#b9c6cc`)
   - `--hlb-ring` — dissolving bubble color (default `#2ec3c3`)

   ```html
   <span class="hlb" style="--hlb-size: 96px; --hlb-liked: #1f8a8a"> … </span>
   ```

To read the like state in your app, just read `input.checked` — it is a
plain checkbox.

## Source / inspiration

Inspired by Ana Tudor's
[Recreating the Twitter heart animation](https://css-tricks.com/recreating-the-twitter-heart-animation/)
on CSS-Tricks. Reimplemented cleanly in our own code — the multiple-box-shadow
particle-burst technique and the elastic easeOutBack timing are the borrowed
ideas. License: CSS-Tricks tutorial, code shared for learning; technique
reimplemented freely.
