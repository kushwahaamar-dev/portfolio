import { defineConfig } from 'vite';
import { globSync } from 'node:fs';

// Every page is a static HTML entry: the home page, the projects archive,
// the writing index, and one file per post (generated into writing/ by
// scripts/build-writing.mjs before the build runs).
const pages = Object.fromEntries(
  ['index.html', 'projects/index.html', 'colophon/index.html', ...globSync('writing/**/index.html')].map((p) => [
    p.replace(/\/index\.html$/, '').replace(/\.html$/, '') || 'main',
    p,
  ]),
);

// https://vite.dev/config/
export default defineConfig({
  build: {
    target: 'es2022',
    rollupOptions: { input: pages },
  },
});
