# Font Pairings

Eight curated Google Fonts pairings for the saltycodestudio system. Each pairing
combines a **display** face (headlines, hero, big type) with a **body** face
(paragraphs, UI, long-form). They're chosen to balance personality with
readability and to play well with the fluid scale in `typography.css`.

## How to use

1. Pick a pairing below and copy its `<link>` tags into your `<head>`.
2. Override the two custom properties from `typography.css`:

   ```css
   :root {
     --font-heading: "Display Family", <fallback stack>;
     --font-body: "Body Family", <fallback stack>;
   }
   ```

3. Each pairing's `font-family` block is copy-paste ready with sensible
   fallbacks already included.

**Performance note:** All `<link>` tags include `display=swap` (text shows in a
fallback immediately, then swaps) and the two `preconnect` hints below. Add the
preconnect once; you don't need it per pairing.

```html
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
```

To keep payloads small, request only the weights you actually use. The links
below ship a sensible default (regular + a couple of bolder weights).

---

## 1. Editorial — Fraunces + Inter

Literary and confident. A high-contrast "old style" display serif with optical
sizing, paired with the cleanest neutral sans for body. Reads like a modern
magazine.

**Vibe:** editorial, premium publishing, opinionated long-form, thoughtful
brands.

```html
<link href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,600;9..144,700&family=Inter:wght@400;500;600&display=swap" rel="stylesheet" />
```

```css
:root {
  --font-heading: "Fraunces", Georgia, "Times New Roman", serif;
  --font-body: "Inter", system-ui, -apple-system, "Segoe UI", sans-serif;
}
```

---

## 2. Modern-tech — Space Grotesk + Inter

Geometric, slightly quirky display sans with mechanical detailing, grounded by
Inter for body. The default "smart software" feel without looking like every
other startup.

**Vibe:** modern-tech, developer tools, SaaS, fintech, product-led.

```html
<link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&family=Inter:wght@400;500;600&display=swap" rel="stylesheet" />
```

```css
:root {
  --font-heading: "Space Grotesk", system-ui, sans-serif;
  --font-body: "Inter", system-ui, -apple-system, "Segoe UI", sans-serif;
}
```

---

## 3. Friendly — Poppins + Work Sans

Rounded geometric headings that feel warm and approachable, with a humanist
sans for comfortable reading. Inviting without being childish.

**Vibe:** friendly, consumer apps, community, education, wellness, onboarding.

```html
<link href="https://fonts.googleapis.com/css2?family=Poppins:wght@500;600;700&family=Work+Sans:wght@400;500;600&display=swap" rel="stylesheet" />
```

```css
:root {
  --font-heading: "Poppins", system-ui, sans-serif;
  --font-body: "Work Sans", system-ui, -apple-system, sans-serif;
}
```

---

## 4. Luxury — Cormorant Garamond + Jost

Elegant, high-contrast display serif at large sizes paired with a refined
geometric sans. Lots of air and restraint — let it breathe with generous
spacing.

**Vibe:** luxury, fashion, beauty, fine hospitality, premium goods.

```html
<link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;500;600&family=Jost:wght@300;400;500&display=swap" rel="stylesheet" />
```

```css
:root {
  --font-heading: "Cormorant Garamond", Garamond, Georgia, serif;
  --font-body: "Jost", system-ui, -apple-system, sans-serif;
}
```

> Tip: pair this with a lighter heading weight (400–500) and wide tracking on
> small labels for the most upscale feel.

---

## 5. Bold / Brutalist — Archivo + Archivo Narrow

A single superfamily used for tension: heavy, condensed-feeling headlines
against a narrower body. Punchy, graphic, and confident.

**Vibe:** bold, sports/streetwear, music, editorial-with-attitude, agencies.

```html
<link href="https://fonts.googleapis.com/css2?family=Archivo:wght@600;700;800&family=Archivo+Narrow:wght@400;500;600&display=swap" rel="stylesheet" />
```

```css
:root {
  --font-heading: "Archivo", system-ui, sans-serif;
  --font-body: "Archivo Narrow", system-ui, sans-serif;
}
```

---

## 6. Warm-classic — Playfair Display + Source Sans 3

Timeless pairing: a high-contrast transitional serif for headlines and a
sturdy, highly legible humanist sans for body. Trustworthy and established.

**Vibe:** classic, professional services, finance, real estate, corporate-warm.

```html
<link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@500;600;700&family=Source+Sans+3:wght@400;500;600&display=swap" rel="stylesheet" />
```

```css
:root {
  --font-heading: "Playfair Display", Georgia, "Times New Roman", serif;
  --font-body: "Source Sans 3", system-ui, -apple-system, sans-serif;
}
```

---

## 7. Clean-minimal — Sora + Inter

Sora is a low-contrast geometric display that feels precise and contemporary;
Inter keeps the body invisible and neutral. Ideal when the design should feel
calm and the content should lead.

**Vibe:** minimal, design portfolios, studios, premium B2B, calm interfaces.

```html
<link href="https://fonts.googleapis.com/css2?family=Sora:wght@500;600;700&family=Inter:wght@400;500;600&display=swap" rel="stylesheet" />
```

```css
:root {
  --font-heading: "Sora", system-ui, sans-serif;
  --font-body: "Inter", system-ui, -apple-system, "Segoe UI", sans-serif;
}
```

---

## 8. Technical / Code — IBM Plex Sans + IBM Plex Mono

A coherent technical superfamily: a grotesque sans for prose and a companion
monospace for code, data, and labels. Great for docs, dashboards, and anything
developer-facing where mono needs to feel intentional.

**Vibe:** technical, documentation, dashboards, dev platforms, data products.

```html
<link href="https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:wght@400;500;600;700&family=IBM+Plex+Mono:wght@400;500&display=swap" rel="stylesheet" />
```

```css
:root {
  --font-heading: "IBM Plex Sans", system-ui, sans-serif;
  --font-body: "IBM Plex Sans", system-ui, -apple-system, sans-serif;
  --font-mono: "IBM Plex Mono", ui-monospace, SFMono-Regular, Menlo, monospace;
}
```

> This pairing intentionally overrides `--font-mono` too, so code blocks and the
> `.nums-tabular` utility match the rest of the system.

---

## Quick reference

| # | Pairing                        | Display              | Body            | Vibe          |
|---|--------------------------------|----------------------|-----------------|---------------|
| 1 | Editorial                      | Fraunces             | Inter           | editorial     |
| 2 | Modern-tech                    | Space Grotesk        | Inter           | modern-tech   |
| 3 | Friendly                       | Poppins              | Work Sans       | friendly      |
| 4 | Luxury                         | Cormorant Garamond   | Jost            | luxury        |
| 5 | Bold / Brutalist               | Archivo              | Archivo Narrow  | bold          |
| 6 | Warm-classic                   | Playfair Display     | Source Sans 3   | classic       |
| 7 | Clean-minimal                  | Sora                 | Inter           | minimal       |
| 8 | Technical / Code               | IBM Plex Sans        | IBM Plex Sans   | technical     |

### Pairing principles (why these work)

- **Contrast, not conflict.** A serif display with a sans body (or a quirky
  display sans with a neutral body sans) creates a clear hierarchy.
- **Let the body disappear.** The reading face should be unremarkable; save the
  personality for headlines.
- **Limit weights.** Two to three weights per family keeps the page fast and the
  design disciplined.
- **Match x-heights loosely.** All body faces here have generous x-heights so
  they stay readable at the small end of the fluid scale.
