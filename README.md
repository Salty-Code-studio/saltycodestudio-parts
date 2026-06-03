# saltycodestudio-parts

A curated parts bin of **cool website code, animations, and components** — so when I'm
building with a local Ollama model, it can reach for a finished, premium piece instead of
generating fancy effects from scratch (which smaller models are weak at).

Built and maintained by [saltycodestudio](https://saltycodestudio.com) · _Sand & Surf_.

## What's in here

Four stacks, every part self-contained with a live preview:

| Folder | What |
|--------|------|
| `components/react/` | React + Tailwind components (`.tsx`) |
| `components/css/` | CSS-only effects — no JS |
| `components/vanilla/` | Drop-in HTML/CSS/JS, no build step |
| `components/motion/` | GSAP & scroll-driven animation |

Each part lives in its own folder with:

```
<part-name>/
├── part.json     metadata (name, tags, tier, deps, files)
├── preview.html  open in a browser to see it render
├── README.md     paste-in instructions
└── <source>      the actual code
```

## How to use it

**With a local model:** point it at [`USING-WITH-OLLAMA.md`](./USING-WITH-OLLAMA.md) in your
system prompt. It tells the model to read `INDEX.md` first, match by tag, and copy the part.

**By hand:** browse [`INDEX.md`](./INDEX.md) — every part in one table — or open any
`preview.html` to see it live, then copy the source.

## Tiers

- 🏆 **showcase** — bold, award-site-grade (WebGL touches, big motion).
- ✅ **practical** — premium but production-safe; ships clean for client work.

## Growing the library

Add a new folder under the right `components/<category>/`, give it a `part.json` (schema is
documented at the top of `scripts/build-index.mjs`), then regenerate the lookup table:

```bash
node scripts/build-index.mjs
```

That rescans every `part.json` and rewrites `INDEX.md` + `manifest.json`.

## Roadmap

- [ ] Wire library lookup into the JARVIS daemon for semantic search (currently disk-only).
