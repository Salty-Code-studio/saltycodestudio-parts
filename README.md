# saltycodestudio-parts

A curated kit for **building the best websites** — premium components, animations, page
sections, full templates, a design-system foundation, and a taste playbook. Built so that
when I build with a local Ollama model, it can assemble finished, high-end work instead of
generating fancy effects from scratch (which smaller models are weak at).

Built and maintained by [saltycodestudio](https://saltycodestudio.com) · _Sand & Surf_.

## What's in here

| Layer | Folder | What |
|-------|--------|------|
| 🧱 Templates | `templates/` | Full, runnable pages (`index.html`) — clone & adapt |
| 🧩 Sections | `sections/` | Page-ready blocks (hero, features, pricing, footer…), React `.tsx` + plain `section.html` |
| ⚙️ Components | `components/` | Atoms, effects & animations — `react/`, `css/`, `vanilla/`, `motion/` |
| 🎨 Foundations | `foundations/` | Design system: palettes, type scale, font pairings, tokens, Tailwind preset, base/shadows/gradients/motion CSS |
| 📖 Playbook | `playbook/` | How to build with taste — workflow, anti-slop, layout, type, color, motion, a11y, SEO/perf |
| 🚀 Starters | `starters/` | Project skeletons: Vite+React+TW, Astro, Next.js, plain HTML+TW |

Each component/section/template lives in its own folder with a `part.json`, a live preview,
a `README.md`, and the source.

## How to use it

**With a local model:** point it at [`USING-WITH-OLLAMA.md`](./USING-WITH-OLLAMA.md) — it
explains the read order (playbook → starter → foundations → templates/sections/components)
and tells the model to consult [`INDEX.md`](./INDEX.md) / `manifest.json` to find parts.

**By hand:** browse [`INDEX.md`](./INDEX.md) for the full map, or open
[`gallery.html`](./gallery.html) to see every preview live with filters & search.

## Tiers

- 🏆 **showcase** — bold, award-site-grade.
- ✅ **practical** — premium but production-safe; ships clean.

## Growing the kit

Add a folder under the right layer with a `part.json` (schema documented atop
`scripts/build-index.mjs`), then regenerate the maps:

```bash
node scripts/build-index.mjs && node scripts/build-gallery.mjs
```

## Roadmap

- [ ] Wire kit lookup into the JARVIS daemon for semantic search (currently disk-only).
