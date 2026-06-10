// Generates the /writing index and each post page from markdown in writing/posts/.
// Build-time only — the output is plain static HTML, no client JS.
// Run by `npm run build` (and `npm run dev` via predev). To add a post,
// drop a new .md file in writing/posts/ with frontmatter and rebuild.

import { readFileSync, readdirSync, writeFileSync, mkdirSync, rmSync, existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { marked } from 'marked';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const postsDir = join(root, 'writing', 'posts');
const outDir = join(root, 'writing');

const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

function parseFrontmatter(raw) {
  const m = raw.match(/^---\n([\s\S]*?)\n---\n?([\s\S]*)$/);
  if (!m) return { meta: {}, body: raw };
  const meta = {};
  for (const line of m[1].split('\n')) {
    const i = line.indexOf(':');
    if (i === -1) continue;
    let v = line.slice(i + 1).trim();
    // strip surrounding quotes only when they're a matched pair, so a dek
    // that *opens* with a quoted phrase keeps its quote.
    if (v.length > 1 && (v[0] === '"' || v[0] === "'") && v.at(-1) === v[0]) v = v.slice(1, -1);
    meta[line.slice(0, i).trim()] = v;
  }
  return { meta, body: m[2] };
}

// External links open in a new tab; the rest of marked's defaults are fine.
const renderer = new marked.Renderer();
const baseLink = renderer.link.bind(renderer);
renderer.link = (token) => {
  const html = baseLink(token);
  const href = typeof token === 'object' ? token.href : token;
  return /^https?:\/\//.test(href) ? html.replace('<a ', '<a target="_blank" rel="noopener noreferrer" ') : html;
};
marked.setOptions({ renderer, mangle: false, headerIds: false });

const head = (title, desc, canonical) => `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <script>
      try {
        var t = localStorage.getItem('theme');
        if (t === 'dark' || t === 'light') document.documentElement.dataset.theme = t;
      } catch (e) {}
    </script>
    <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
    <link rel="alternate icon" href="/favicon.ico" sizes="32x32" />
    <title>${esc(title)}</title>
    <meta name="description" content="${esc(desc)}" />
    <link rel="canonical" href="${canonical}" />
    <meta name="theme-color" content="#fbfbf9" media="(prefers-color-scheme: light)" />
    <meta name="theme-color" content="#161615" media="(prefers-color-scheme: dark)" />
    <meta property="og:type" content="article" />
    <meta property="og:url" content="${canonical}" />
    <meta property="og:title" content="${esc(title)}" />
    <meta property="og:description" content="${esc(desc)}" />
    <meta property="og:image" content="https://amarkushwaha.com/og.png" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:creator" content="@amarkushwaha__" />
    <link rel="preload" href="/fonts/text.woff2" as="font" type="font/woff2" crossorigin />
    <link rel="preload" href="/fonts/display.woff2" as="font" type="font/woff2" crossorigin />
    <link rel="stylesheet" href="/src/index.css" />
  </head>
  <body>`;

const foot = `    <script type="module" src="/src/main.ts"></script>
  </body>
</html>
`;

const posts = readdirSync(postsDir)
  .filter((f) => f.endsWith('.md'))
  .map((f) => {
    const { meta, body } = parseFrontmatter(readFileSync(join(postsDir, f), 'utf8'));
    return { ...meta, slug: meta.slug || f.replace(/\.md$/, ''), html: marked.parse(body) };
  })
  .sort((a, b) => (a.date < b.date ? 1 : -1));

// Clean previously-generated post directories, then rewrite.
for (const d of readdirSync(outDir, { withFileTypes: true })) {
  if (d.isDirectory() && d.name !== 'posts') rmSync(join(outDir, d.name), { recursive: true, force: true });
}

for (const p of posts) {
  const canonical = `https://amarkushwaha.com/writing/${p.slug}`;
  const page = `${head(`${p.title} — Amar Kushwaha`, p.dek || p.title, canonical)}
    <main class="band post" data-animate>
      <a class="back-link" href="/writing/">← writing</a>
      <h1>${esc(p.title)}</h1>
      <p class="post-meta">${esc(p.meta_line || p.date)}</p>
      <div class="post-body">
${p.html}
      </div>
    </main>
    <footer class="colophon band" data-animate style="animation-delay: 120ms">
      <a href="/writing/">← all writing</a><br />
      <a href="/">amarkushwaha.com</a>
    </footer>
${foot}`;
  mkdirSync(join(outDir, p.slug), { recursive: true });
  writeFileSync(join(outDir, p.slug, 'index.html'), page);
}

const rows = posts
  .map(
    (p) => `          <a class="post-row" href="/writing/${p.slug}/">
            <span class="post-row-head">
              <span class="work-name">${esc(p.title)}</span>
              <span class="work-meta">${esc(p.index_date || p.date)}</span>
            </span>
            <span class="post-row-dek">${esc(p.dek || '')}</span>
          </a>`,
  )
  .join('\n');

const indexPage = `${head('Writing — Amar Kushwaha', 'Notes on building AI-agent infrastructure, EEG models, and brain-network simulation.', 'https://amarkushwaha.com/writing')}
    <main class="band" data-animate>
      <header class="masthead">
        <a class="back-link" href="/">← Amar Kushwaha</a>
        <h1>Writing</h1>
        <p class="archive-intro">notes from building things — what was hard, what was surprising, what i'd do again.</p>
      </header>
      <section aria-label="Posts" style="margin-top: 3rem">
        <div class="post-list">
${rows}
        </div>
      </section>
    </main>
    <footer class="colophon band" data-animate style="animation-delay: 120ms">
      <a href="/">← back to amarkushwaha.com</a>
    </footer>
${foot}`;

writeFileSync(join(outDir, 'index.html'), indexPage);

// Emit a tiny module of post titles+slugs so the command palette (main.ts)
// can list posts without hardcoding them. Generated; gitignored.
const gen = `// Generated by scripts/build-writing.mjs — do not edit.\nexport const posts: { title: string; slug: string }[] = ${JSON.stringify(
  posts.map((p) => ({ title: p.title, slug: p.slug })),
  null,
  2,
)};\n`;
writeFileSync(join(root, 'src', 'posts.gen.ts'), gen);

console.log(`build-writing: ${posts.length} post(s) + index → writing/`);
