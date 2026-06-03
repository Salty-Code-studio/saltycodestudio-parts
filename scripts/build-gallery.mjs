#!/usr/bin/env node
/**
 * build-gallery.mjs — reads manifest.json and emits gallery.html at repo root:
 * one scrollable page with a live, lazy-loaded preview of every part + filters
 * for templates / sections / component stacks / tiers.
 *
 * Run:  node scripts/build-gallery.mjs   (after build-index.mjs)
 */
import { readFile, writeFile } from "node:fs/promises";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const parts = JSON.parse(await readFile(join(ROOT, "manifest.json"), "utf8"));

const STACK_LABEL = { react: "React + Tailwind", css: "CSS-only", vanilla: "Vanilla JS", motion: "GSAP / Motion" };
const esc = (s = "") => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

function label(p) {
  if (p.kind === "template") return "Template";
  if (p.kind === "section") return `Section · ${p.category}`;
  return STACK_LABEL[p.category] || p.category;
}
// component stack for filtering; templates/sections filter by kind
const dataCat = (p) => (p.kind === "component" ? p.category : p.kind);

const nC = parts.filter((p) => p.kind === "component").length;
const nS = parts.filter((p) => p.kind === "section").length;
const nT = parts.filter((p) => p.kind === "template").length;
const showcase = parts.filter((p) => p.tier === "showcase").length;

// templates first, then sections, then components — most impressive on top
const order = { template: 0, section: 1, component: 2 };
const sorted = [...parts].sort((a, b) => (order[a.kind] - order[b.kind]) || a.name.localeCompare(b.name));

const cards = sorted.map((p) => {
  const tier = p.tier === "showcase"
    ? `<span class="badge badge-show">🏆 showcase</span>`
    : `<span class="badge badge-prac">✅ practical</span>`;
  const tags = (p.tags || []).slice(0, 6).map((t) => `<span class="tag">${esc(t)}</span>`).join("");
  const frame = p.preview
    ? `<iframe class="frame" loading="lazy" src="${esc(p.preview)}" title="${esc(p.name)} preview"></iframe>`
    : `<div class="frame frame-missing">no preview</div>`;
  return `      <article class="card" data-kind="${esc(p.kind)}" data-cat="${esc(dataCat(p))}" data-tier="${esc(p.tier)}" data-text="${esc((p.name + " " + (p.tags || []).join(" ")).toLowerCase())}">
        <div class="card-head">
          <div class="card-titles"><h3>${esc(p.name)}</h3><p class="desc">${esc(p.description || "")}</p></div>
          ${tier}
        </div>
        <div class="frame-wrap">${frame}</div>
        <div class="card-foot">
          <span class="cat">${esc(label(p))}</span>
          <div class="tags">${tags}</div>
          ${p.preview ? `<a class="open" href="${esc(p.preview)}" target="_blank" rel="noopener">open ↗</a>` : ""}
        </div>
      </article>`;
}).join("\n");

const html = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>saltycodestudio-parts — gallery</title>
<style>
  :root{--sand:#f4ece0;--sand-2:#ece0cd;--cream:#fbf7f0;--ink:#1c2b33;--ink-soft:#4a5d66;
    --teal:#1f8a8a;--teal-deep:#0f5c5c;--surf:#2ec3c3;--line:rgba(28,43,51,.10);--shadow:0 10px 40px -12px rgba(28,43,51,.22);}
  *{box-sizing:border-box}html{scroll-behavior:smooth}
  body{margin:0;font:15px/1.5 ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,sans-serif;color:var(--ink);
    background:radial-gradient(120% 120% at 0% 0%,var(--cream),var(--sand) 60%,var(--sand-2));min-height:100vh}
  header{padding:48px clamp(20px,5vw,64px) 28px;max-width:1400px;margin:0 auto}
  .kicker{font-size:12px;letter-spacing:.22em;text-transform:uppercase;color:var(--teal-deep);font-weight:700}
  h1{font-size:clamp(28px,5vw,46px);margin:.25em 0 .15em;letter-spacing:-.02em}
  .sub{color:var(--ink-soft);max-width:62ch;margin:0}
  .stats{margin-top:18px;color:var(--ink-soft);font-size:13px}.stats b{color:var(--ink)}
  .controls{position:sticky;top:0;z-index:20;backdrop-filter:blur(12px);background:linear-gradient(var(--cream),rgba(251,247,240,.7));border-bottom:1px solid var(--line)}
  .controls-inner{max-width:1400px;margin:0 auto;padding:14px clamp(20px,5vw,64px);display:flex;gap:12px;flex-wrap:wrap;align-items:center}
  .filters{display:flex;gap:8px;flex-wrap:wrap}
  .filters button{font:inherit;font-size:13px;font-weight:600;cursor:pointer;border:1px solid var(--line);background:#fff;color:var(--ink-soft);padding:7px 14px;border-radius:999px;transition:.18s}
  .filters button:hover{border-color:var(--teal);color:var(--teal-deep)}
  .filters button.active{background:var(--ink);color:var(--cream);border-color:var(--ink)}
  .search{margin-left:auto;flex:1;min-width:180px;max-width:280px}
  .search input{width:100%;font:inherit;font-size:13px;padding:8px 14px;border-radius:999px;border:1px solid var(--line);background:#fff;color:var(--ink)}
  .search input:focus{outline:none;border-color:var(--teal)}
  main{max-width:1400px;margin:0 auto;padding:28px clamp(20px,5vw,64px) 80px}
  .grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(360px,1fr));gap:24px}
  .card{background:#fff;border:1px solid var(--line);border-radius:18px;overflow:hidden;box-shadow:var(--shadow);display:flex;flex-direction:column;transition:.2s}
  .card:hover{transform:translateY(-3px);box-shadow:0 18px 50px -14px rgba(28,43,51,.3)}
  .card-head{display:flex;gap:12px;align-items:flex-start;padding:16px 18px 10px}
  .card-titles{flex:1;min-width:0}.card-head h3{margin:0;font-size:16px;letter-spacing:-.01em}
  .desc{margin:3px 0 0;font-size:12.5px;color:var(--ink-soft);line-height:1.45}
  .badge{font-size:11px;font-weight:700;white-space:nowrap;padding:4px 9px;border-radius:999px}
  .badge-show{background:linear-gradient(135deg,#fde7c8,#f7d49b);color:#7a4a12}
  .badge-prac{background:#e2f3f0;color:var(--teal-deep)}
  .frame-wrap{position:relative;height:300px;background:repeating-conic-gradient(var(--sand) 0% 25%,var(--cream) 0% 50%) 50%/22px 22px;border-top:1px solid var(--line);border-bottom:1px solid var(--line)}
  .frame{width:100%;height:100%;border:0;display:block;background:#fff}
  .frame-missing{display:grid;place-items:center;color:var(--ink-soft);font-size:13px;height:100%}
  .card-foot{display:flex;gap:10px;align-items:center;padding:12px 18px;flex-wrap:wrap}
  .cat{font-size:11px;font-weight:700;letter-spacing:.04em;color:var(--teal-deep);text-transform:uppercase}
  .tags{display:flex;gap:6px;flex-wrap:wrap;flex:1}
  .tag{font-size:11px;color:var(--ink-soft);background:var(--sand);padding:3px 8px;border-radius:6px}
  .open{font-size:12.5px;font-weight:700;color:var(--teal-deep);text-decoration:none;white-space:nowrap}.open:hover{text-decoration:underline}
  .empty{display:none;text-align:center;color:var(--ink-soft);padding:60px 0}
  footer{max-width:1400px;margin:0 auto;padding:0 clamp(20px,5vw,64px) 60px;color:var(--ink-soft);font-size:12.5px}
  code{background:var(--sand);padding:2px 6px;border-radius:5px;font-size:12px}
</style>
</head>
<body>
  <header>
    <div class="kicker">saltycodestudio · site-building kit</div>
    <h1>Component, section &amp; template gallery</h1>
    <p class="sub">Every part rendered live. Filter by templates, sections, stack, or tier; search by name/tag; click <b>open ↗</b> for the full preview. Pair with <code>foundations/</code> + <code>playbook/</code> to build whole sites.</p>
    <p class="stats"><b>${parts.length}</b> parts · 🧱 <b>${nT}</b> templates · 🧩 <b>${nS}</b> sections · ⚙️ <b>${nC}</b> components · 🏆 <b>${showcase}</b> showcase · ✅ <b>${parts.length - showcase}</b> practical</p>
  </header>
  <div class="controls"><div class="controls-inner">
    <div class="filters" id="filters">
      <button class="active" data-filter="all">All</button>
      <button data-filter="kind:template">🧱 Templates</button>
      <button data-filter="kind:section">🧩 Sections</button>
      <button data-filter="cat:react">React</button>
      <button data-filter="cat:css">CSS</button>
      <button data-filter="cat:vanilla">Vanilla</button>
      <button data-filter="cat:motion">Motion</button>
      <button data-filter="tier:showcase">🏆 Showcase</button>
      <button data-filter="tier:practical">✅ Practical</button>
    </div>
    <div class="search"><input id="search" type="search" placeholder="Search name or tag…" /></div>
  </div></div>
  <main>
    <div class="grid" id="grid">
${cards}
    </div>
    <p class="empty" id="empty">No parts match that filter.</p>
  </main>
  <footer>Regenerate with <code>node scripts/build-index.mjs &amp;&amp; node scripts/build-gallery.mjs</code>.</footer>
<script>
  const grid=document.getElementById('grid'),cards=[...grid.querySelectorAll('.card')],empty=document.getElementById('empty'),search=document.getElementById('search');
  let active='all';
  function apply(){
    const q=search.value.trim().toLowerCase();let shown=0;
    for(const c of cards){
      let ok=true;
      if(active.startsWith('kind:'))ok=c.dataset.kind===active.slice(5);
      else if(active.startsWith('cat:'))ok=c.dataset.cat===active.slice(4);
      else if(active.startsWith('tier:'))ok=c.dataset.tier===active.slice(5);
      if(ok&&q)ok=c.dataset.text.includes(q);
      c.style.display=ok?'':'none';if(ok)shown++;
    }
    empty.style.display=shown?'none':'block';
  }
  document.getElementById('filters').addEventListener('click',e=>{const b=e.target.closest('button');if(!b)return;
    document.querySelectorAll('#filters button').forEach(x=>x.classList.remove('active'));b.classList.add('active');active=b.dataset.filter;apply();});
  search.addEventListener('input',apply);
</script>
</body>
</html>
`;

await writeFile(join(ROOT, "gallery.html"), html);
console.log(`✓ Built gallery.html — ${parts.length} previews (${nT} templates, ${nS} sections, ${nC} components)`);
