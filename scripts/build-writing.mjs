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
    <link rel="alternate" type="application/rss+xml" title="Amar Kushwaha — Writing" href="/feed.xml" />
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
    <main id="main" class="band post" data-animate>
      <nav aria-label="Back"><a class="back-link" href="/writing/">← writing</a></nav>
      <article>
        <h1>${esc(p.title)}</h1>
        <p class="post-meta">${esc(p.meta_line || p.date)}</p>
        <div class="post-body">
${p.html}
        </div>
      </article>
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
    <header class="masthead band" data-animate>
      <nav aria-label="Back"><a class="back-link" href="/">← Amar Kushwaha</a></nav>
      <h1>Writing</h1>
      <p class="archive-intro">notes from building things — what was hard, what was surprising, what i'd do again.</p>
    </header>
    <main id="main" class="band">
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

// ── /colophon — the engineering, documented (the craft IS the content) ──
const colophon = `${head('Colophon — Amar Kushwaha', 'How this site is built: self-hosted optically-sized Newsreader, a ~5KB critical path, near-zero JavaScript, and a markdown writing pipeline.', 'https://amarkushwaha.com/colophon')}
    <header class="masthead band" data-animate>
      <nav aria-label="Back"><a class="back-link" href="/">← Amar Kushwaha</a></nav>
      <h1>Colophon</h1>
      <p class="archive-intro">how this site is built — and why it's this small.</p>
    </header>
    <main id="main" class="band post" data-animate>
      <article class="post-body">
        <p>This page is the argument the rest of the site only implies: that restraint is an engineering choice, not a missing feature. The whole thing is static HTML I wrote by hand, built with Vite, and served from a CDN. No framework renders it.</p>
        <h2>Type</h2>
        <p>Set in <a href="https://fonts.google.com/specimen/Newsreader" target="_blank" rel="noopener noreferrer">Newsreader</a>, self-hosted. I subset it to only the glyphs the site actually uses and ship two optical cuts — a display cut for the name, a text cut for everything else — so headings get the high-contrast drawing they were designed for and body text gets the sturdier one. A metric-matched <code>@font-face</code> fallback means the web font swaps in with <strong>zero layout shift</strong> (measured CLS 0). Labels and metadata use the system monospace, which costs nothing to load.</p>
        <h2>Weight</h2>
        <p>The home page is one document of hand-written HTML — the text is in the markup, so it paints before any script runs. Critical path is roughly five kilobytes gzipped. The only JavaScript is a small progressive-enhancement bundle: a click-to-copy email, a theme toggle, a ⌘K command palette, and cross-page view transitions. Turn JavaScript off and everything still reads.</p>
        <h2>Color &amp; motion</h2>
        <p>Warm paper and warm near-black, chosen by your system preference or the toggle in the footer, with a single teal accent that only ever touches a focus ring, a marker, or an active state. One entrance fade on load; nothing moves on scroll. All of it yields to <code>prefers-reduced-motion</code>.</p>
        <h2>Writing</h2>
        <p>Each post is a markdown file. A small build step turns the folder into this site's <a href="/writing/">writing</a> section, the post pages, an RSS feed, and a sitemap. Adding a post is dropping a file and rebuilding.</p>
        <h2>The interactive bits</h2>
        <p>The <a href="/writing/delete-the-oracle/">Oath demo</a> runs the real on-chain classification logic in your browser. It and the command palette are code-split, so they only load when you reach for them. The source is on <a href="https://github.com/kushwahaamar-dev/portfolio" target="_blank" rel="noopener noreferrer">GitHub</a>.</p>
      </article>
    </main>
    <footer class="colophon band" data-animate style="animation-delay: 120ms">
      <a href="/">← back to amarkushwaha.com</a>
    </footer>
${foot}`;
mkdirSync(join(root, 'colophon'), { recursive: true });
writeFileSync(join(root, 'colophon', 'index.html'), colophon);

// ── sitemap.xml, robots.txt, RSS feed (into public/, copied to dist root) ──
const BASE = 'https://amarkushwaha.com';
const pub = join(root, 'public');
const staticRoutes = [
  { loc: '/', lastmod: posts[0]?.date },
  { loc: '/projects', lastmod: posts[0]?.date },
  { loc: '/writing', lastmod: posts[0]?.date },
  { loc: '/colophon', lastmod: posts[0]?.date },
];
const postRoutes = posts.map((p) => ({ loc: `/writing/${p.slug}`, lastmod: p.date }));
const urls = [...staticRoutes, ...postRoutes];

writeFileSync(
  join(pub, 'sitemap.xml'),
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls
    .map((u) => `  <url><loc>${BASE}${u.loc}</loc>${u.lastmod ? `<lastmod>${u.lastmod}</lastmod>` : ''}</url>`)
    .join('\n')}\n</urlset>\n`,
);

writeFileSync(join(pub, 'robots.txt'), `User-agent: *\nAllow: /\n\nSitemap: ${BASE}/sitemap.xml\n`);

const rssItems = posts
  .map((p) => {
    const link = `${BASE}/writing/${p.slug}`;
    const pubDate = new Date(`${p.date}T12:00:00Z`).toUTCString();
    return `    <item>\n      <title>${esc(p.title)}</title>\n      <link>${link}</link>\n      <guid>${link}</guid>\n      <pubDate>${pubDate}</pubDate>\n      <description>${esc(p.dek || '')}</description>\n    </item>`;
  })
  .join('\n');
writeFileSync(
  join(pub, 'feed.xml'),
  `<?xml version="1.0" encoding="UTF-8"?>\n<rss version="2.0">\n  <channel>\n    <title>Amar Kushwaha — Writing</title>\n    <link>${BASE}/writing</link>\n    <description>Notes on building AI-agent infrastructure, ML, and research.</description>\n    <language>en</language>\n${rssItems}\n  </channel>\n</rss>\n`,
);

console.log(`build-writing: ${posts.length} post(s) + index + colophon + sitemap/robots/feed`);
