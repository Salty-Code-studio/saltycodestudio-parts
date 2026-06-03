#!/usr/bin/env node
/**
 * build-index.mjs — scans the whole kit and regenerates INDEX.md + manifest.json.
 *
 * Roots scanned:
 *   components/<stack>/<slug>/part.json   kind "component"  (preview.html)
 *   sections/<slug>/part.json             kind "section"    (preview.html)
 *   templates/<slug>/part.json            kind "template"   (index.html is the preview)
 * Also lists foundations/, playbook/, starters/ as a reference block.
 *
 * Run:  node scripts/build-index.mjs   (from repo root)
 *
 * part.json contract (every part folder MUST have one):
 *   name, slug, category, tier ("showcase"|"practical"), tags[], description,
 *   deps[], files[], usage, source, license   (+ kind for sections/templates)
 */
import { readdir, readFile, writeFile, stat } from "node:fs/promises";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const COMPONENT_CATS = ["react", "css", "vanilla", "motion"];
const TIER_EMOJI = { showcase: "🏆", practical: "✅" };
const CAT_LABEL = {
  react: "React + Tailwind",
  css: "CSS-only",
  vanilla: "Vanilla HTML/CSS/JS",
  motion: "GSAP / Scroll Motion",
};

async function exists(p) { try { await stat(p); return true; } catch { return false; } }

async function readPart(dir, relPath, { kind, previewFile = "preview.html" }) {
  const file = join(dir, "part.json");
  let meta;
  try {
    meta = JSON.parse(await readFile(file, "utf8"));
  } catch (err) {
    throw new Error(`Failed to read/parse part.json at ${file}: ${err.message}`);
  }
  meta.path = relPath;
  meta.kind = meta.kind || kind;
  meta.preview = (await exists(join(dir, previewFile))) ? `${relPath}/${previewFile}` : null;
  await validate(meta, dir);
  return meta;
}

const REQUIRED_FIELDS = ["name", "slug", "category", "tier", "tags", "description", "deps", "files", "usage", "source", "license"];
const problems = [];

async function validate(meta, dir) {
  const label = meta.path || dir;
  for (const field of REQUIRED_FIELDS) {
    if (!(field in meta) || meta[field] === undefined || meta[field] === null || meta[field] === "") {
      problems.push(`${label}: missing required field "${field}"`);
    }
  }
  if ("tier" in meta && meta.tier !== "showcase" && meta.tier !== "practical") {
    problems.push(`${label}: tier must be "showcase" or "practical" (got "${meta.tier}")`);
  }
  for (const arrField of ["tags", "deps", "files"]) {
    if (arrField in meta && !Array.isArray(meta[arrField])) {
      problems.push(`${label}: "${arrField}" must be an array`);
    }
  }
  if (Array.isArray(meta.files)) {
    for (const f of meta.files) {
      if (!(await exists(join(dir, f)))) {
        problems.push(`${label}: listed file "${f}" does not exist on disk`);
      }
    }
  }
}

async function scanFlat(root, relRoot, opts) {
  const base = join(ROOT, root);
  if (!(await exists(base))) return [];
  const out = [];
  for (const e of await readdir(base, { withFileTypes: true })) {
    if (!e.isDirectory()) continue;
    if (!(await exists(join(base, e.name, "part.json")))) continue;
    out.push(await readPart(join(base, e.name), `${relRoot}/${e.name}`, opts));
  }
  return out;
}

async function collect() {
  const parts = [];
  for (const cat of COMPONENT_CATS) {
    const found = await scanFlat(`components/${cat}`, `components/${cat}`, { kind: "component" });
    for (const m of found) { m.kind = "component"; m.category = cat; }
    parts.push(...found);
  }
  const sections = await scanFlat("sections", "sections", { kind: "section" });
  for (const m of sections) m.kind = "section";
  parts.push(...sections);
  const templates = await scanFlat("templates", "templates", { kind: "template", previewFile: "index.html" });
  for (const m of templates) { m.kind = "template"; m.category = "template"; }
  parts.push(...templates);
  return parts;
}

async function listGuides() {
  const guides = {};
  for (const g of ["foundations", "playbook"]) {
    const base = join(ROOT, g);
    if (await exists(base)) guides[g] = (await readdir(base)).filter((f) => !f.startsWith(".") && f !== "README.md").sort();
  }
  const sb = join(ROOT, "starters");
  if (await exists(sb)) guides.starters = (await readdir(sb, { withFileTypes: true })).filter((e) => e.isDirectory()).map((e) => e.name).sort();
  return guides;
}

const esc = (s = "") => String(s).replace(/\|/g, "\\|");
function table(rows) {
  let md = `| Part | Tier | Tags | What it's for | Path |\n|------|------|------|---------------|------|\n`;
  for (const p of rows) md += `| **${esc(p.name)}** | ${TIER_EMOJI[p.tier] || p.tier} | ${esc((p.tags || []).join(", "))} | ${esc(p.description)} | \`${p.path}\` |\n`;
  return md + `\n`;
}

function buildIndex(parts, guides) {
  const comps = parts.filter((p) => p.kind === "component");
  const secs = parts.filter((p) => p.kind === "section");
  const tpls = parts.filter((p) => p.kind === "template");
  const byTier = parts.reduce((a, p) => (a[p.tier] = (a[p.tier] || 0) + 1, a), {});

  let md = `# INDEX — saltycodestudio-parts\n\n`;
  md += `> **Local model: read this file first.** It maps the whole site-building kit. Match the\n`;
  md += `> user's need to a row by \`tags\`, open that folder, read its \`README.md\`, then copy the\n`;
  md += `> source \`files\`. To build a FULL site: read \`playbook/00-how-to-build-a-great-site.md\`,\n`;
  md += `> start from a \`starters/\` skeleton, apply \`foundations/\`, then compose templates → sections → components.\n\n`;
  md += `**${parts.length} parts** — ${comps.length} components · ${secs.length} sections · ${tpls.length} templates · 🏆 ${byTier.showcase || 0} showcase · ✅ ${byTier.practical || 0} practical\n\n`;
  md += `Tiers: 🏆 = bold / showcase-grade · ✅ = premium but production-safe\n\n---\n\n`;

  if (tpls.length) {
    md += `## 🧱 Templates — full runnable pages\nClone an \`index.html\`, open it in a browser, adapt the copy.\n\n` + table(tpls);
  }
  if (secs.length) {
    md += `## 🧩 Sections — page-ready blocks\nEach ships a React \`.tsx\` and a plain \`section.html\` variant.\n\n`;
    for (const c of [...new Set(secs.map((s) => s.category))].sort()) md += `### ${c}\n\n` + table(secs.filter((s) => s.category === c));
  }
  md += `## ⚙️ Components — atoms, effects & animations\n\n`;
  for (const cat of COMPONENT_CATS) {
    const rows = comps.filter((p) => p.category === cat);
    if (rows.length) md += `### ${CAT_LABEL[cat]} (${rows.length})\n\n` + table(rows);
  }

  md += `## 🎨 Foundations, Playbook & Starters\n\n`;
  if (guides.foundations) md += `**\`foundations/\`** — the design system; apply to everything: ${guides.foundations.map((f) => `\`${f}\``).join(", ")}\n\n`;
  if (guides.playbook) md += `**\`playbook/\`** — read these to build with taste: ${guides.playbook.map((f) => `\`${f}\``).join(", ")}\n\n`;
  if (guides.starters) md += `**\`starters/\`** — scaffold a project from one: ${guides.starters.map((f) => `\`${f}\``).join(", ")}\n\n`;

  md += `---\n_Generated by \`scripts/build-index.mjs\` — do not edit by hand; re-run after adding parts._\n`;
  return md;
}

const parts = await collect();
const guides = await listGuides();

if (problems.length) {
  console.error(`✗ Validation failed — ${problems.length} problem(s) found:\n`);
  for (const p of problems) console.error(`  • ${p}`);
  console.error(`\nFix the issues above and re-run. INDEX.md / manifest.json were NOT regenerated.`);
  process.exit(1);
}

await writeFile(join(ROOT, "manifest.json"), JSON.stringify(parts, null, 2) + "\n");
await writeFile(join(ROOT, "INDEX.md"), buildIndex(parts, guides));
const n = (k) => parts.filter((p) => p.kind === k).length;
console.log(`✓ Indexed ${parts.length} parts (${n("component")} components, ${n("section")} sections, ${n("template")} templates) → INDEX.md + manifest.json`);
