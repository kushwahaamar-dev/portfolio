# amarkushwaha.com

My personal site. One column of text, no framework, almost no JavaScript.

The whole thing is a single static `index.html` plus one stylesheet. The only
runtime script (`src/main.ts`, ~1.5 KB gzipped) handles click-to-copy on the
email address and loads Vercel Analytics. The text lives in the HTML, so it
paints before any script runs.

## Design

- **Type** — [Newsreader](https://fonts.google.com/specimen/Newsreader),
  self-hosted as a subset variable `woff2` (upright + italic), preloaded, with a
  metric-matched fallback so the swap doesn't shift the layout. System monospace
  for the small labels and metadata.
- **Color** — warm paper / warm near-black via `prefers-color-scheme`, one teal
  accent used only on link underlines. Hierarchy comes from weight and gray
  value, not size. All text meets WCAG AA contrast.
- **Motion** — one staggered fade on load, gated behind
  `prefers-reduced-motion`. Nothing moves on scroll.
- **Tokens** — the entire system is a handful of CSS custom properties at the
  top of `src/index.css`.

Every external link was verified live before each deploy.

## Develop

```bash
npm install
npm run dev      # vite dev server
npm run build    # tsc -b && vite build  → dist/
npm run preview  # serve the build
npm run lint
```

## Deploy

Pushed to GitHub; Vercel builds and deploys `dist/` automatically.
