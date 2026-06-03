# Tabs

Accessible tabs built on the WAI-ARIA tabs pattern, with a sliding indicator that
animates between the active tabs. Click or use the keyboard: Left/Right (or
Up/Down) to move, Home/End to jump to ends. Roving `tabindex` keeps only the
selected tab in the tab order. Every `[data-tabs]` block auto-initialises.

## Files

- `styles.css` — tab styling, the sliding indicator, panel fade
- `script.js` — selection, roving tabindex, keyboard nav, indicator positioning

## Required markup

```html
<div class="tabs" data-tabs>
  <div class="tabs__list" role="tablist" aria-label="Sample tabs">
    <button class="tabs__tab" role="tab" id="tab-1" aria-controls="panel-1" aria-selected="true"  tabindex="0">Overview</button>
    <button class="tabs__tab" role="tab" id="tab-2" aria-controls="panel-2" aria-selected="false" tabindex="-1">Details</button>
    <span class="tabs__indicator" aria-hidden="true"></span>
  </div>

  <div class="tabs__panel" role="tabpanel" id="panel-1" aria-labelledby="tab-1" tabindex="0">…</div>
  <div class="tabs__panel" role="tabpanel" id="panel-2" aria-labelledby="tab-2" tabindex="0" hidden>…</div>
</div>
```

### Wiring rules

- Each `[role="tab"]` `aria-controls` must equal its panel's `id`.
- Each `[role="tabpanel"]` `aria-labelledby` must equal its tab's `id`.
- Mark the initially-open tab `aria-selected="true"` / `tabindex="0"`; the rest
  `aria-selected="false"` / `tabindex="-1"` and their panels `hidden`.
- Keep the `.tabs__indicator` span as the last child of `.tabs__list`.

## Paste-in

1. Copy `styles.css` and `script.js`.
2. Link `styles.css`; load `script.js`.
3. Drop in the markup with matching ids.

## Notes

- Multiple tab groups per page are supported.
- The indicator re-measures on resize and after web fonts load.
- `prefers-reduced-motion` disables the slide + fade.
- Re-init dynamically added groups with `Tabs.initAll()` or `Tabs.init(rootEl)`.
