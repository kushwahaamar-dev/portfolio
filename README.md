# amarkushwaha.com

My personal site. One quiet column of text — no framework, almost no JavaScript,
and the source is meant to read as well as the page.

The content is hand-written static HTML, so the text paints before any script
runs. Critical path is roughly **5 KB gzipped**. Everything interactive is a
small progressive enhancement that loads only when you reach for it; turn
JavaScript off and the whole site still reads.

## Design

- **Type** — [Newsreader](https://fonts.google.com/specimen/Newsreader),
  self-hosted and glyph-subset to the characters the site actually uses, shipped
  as two optical cuts (a display cut for the name, a text cut for body). A
  metric-matched `@font-face` fallback gives a measured **CLS of 0** on font
  swap. System monospace for labels and metadata.
- **Color** — warm paper / warm near-black, chosen by `prefers-color-scheme` or
  the theme toggle, with a single teal accent used only on focus rings, markers,
  and active states. Hierarchy comes from weight and gray value, not size. All
  text meets WCAG AA.
- **Motion** — one staggered fade on load and cross-page
  [View Transitions](https://developer.mozilla.org/docs/Web/API/View_Transitions_API),
  both gated behind `prefers-reduced-motion`. Nothing moves on scroll.

## Interactive bits

All code-split, so they only load on the page that uses them:

- A **⌘K command palette** (native `<dialog>`, fully keyboard-driven) to jump to
  any page, project, or post.
- A three-state **theme toggle** (system / light / dark) with a no-flash inline
  script.
- Two **explorables** embedded in posts: an [Oath](https://amarkushwaha.com/writing/delete-the-oracle)
  state machine that runs the real on-chain classification logic in the browser,
  and a [RAWRB](https://amarkushwaha.com/writing/right-answer-wrong-reason) demo
  where you break a model's chain-of-thought and watch the answer (not) follow.

## Writing

Each post is a markdown file in `writing/posts/`. A build step
(`scripts/build-writing.mjs`) turns the folder into the `/writing` index, the
post pages, a `/colophon`, an RSS feed, and a sitemap. Adding a post is dropping
a file and rebuilding.

The [colophon](https://amarkushwaha.com/colophon) documents the engineering in
more detail — the craft is part of the content.

## Develop

```bash
npm install
npm run dev      # vite dev server (regenerates writing pages first)
npm run build    # generate pages → tsc -b → vite build → dist/
npm run preview  # serve the build
npm run lint
```

Deployed on [Vercel](https://vercel.com) from `main`.
