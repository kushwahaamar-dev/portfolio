import { inject } from '@vercel/analytics';
import { injectSpeedInsights } from '@vercel/speed-insights';
import { posts } from './posts.gen';

inject();
injectSpeedInsights();

const root = document.documentElement;
const colophon = document.querySelector('.colophon');

/* ── Theme: system → light → dark, persisted ─────────────────── */

type Theme = 'system' | 'light' | 'dark';
const THEME_KEY = 'theme';
const mq = window.matchMedia('(prefers-color-scheme: dark)');

const ICONS: Record<Theme, string> = {
  system:
    '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.3"><circle cx="8" cy="8" r="5.2"/><path d="M8 2.8v10.4" /><path d="M8 2.8a5.2 5.2 0 0 0 0 10.4z" fill="currentColor" stroke="none"/></svg>',
  light:
    '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"><circle cx="8" cy="8" r="3.1"/><path d="M8 1.4v1.6M8 13v1.6M1.4 8h1.6M13 8h1.6M3.4 3.4l1.1 1.1M11.5 11.5l1.1 1.1M12.6 3.4l-1.1 1.1M4.5 11.5l-1.1 1.1"/></svg>',
  dark: '<svg viewBox="0 0 16 16" fill="currentColor"><path d="M13 9.6A5.6 5.6 0 1 1 6.4 3 4.4 4.4 0 0 0 13 9.6z"/></svg>',
};

function storedTheme(): Theme {
  const t = localStorage.getItem(THEME_KEY);
  return t === 'light' || t === 'dark' ? t : 'system';
}

function applyTheme(t: Theme) {
  if (t === 'system') {
    delete root.dataset.theme;
    localStorage.removeItem(THEME_KEY);
  } else {
    root.dataset.theme = t;
    localStorage.setItem(THEME_KEY, t);
  }
}

let toggleBtn: HTMLButtonElement | null = null;
function renderToggle() {
  if (!toggleBtn) return;
  const t = storedTheme();
  toggleBtn.innerHTML = `${ICONS[t]}<span>${t}</span>`;
  toggleBtn.setAttribute('aria-label', `Theme: ${t}. Click to change.`);
}

function cycleTheme() {
  const next: Record<Theme, Theme> = { system: 'light', light: 'dark', dark: 'system' };
  const t = next[storedTheme()];
  applyTheme(t);
  renderToggle();
  const resolved = t === 'system' ? `system (${mq.matches ? 'dark' : 'light'})` : t;
  announce(`Theme: ${resolved}`);
}

function buildSiteControls() {
  if (!colophon) return;
  const wrap = document.createElement('span');
  wrap.className = 'site-controls';

  toggleBtn = document.createElement('button');
  toggleBtn.type = 'button';
  toggleBtn.className = 'theme-toggle';
  toggleBtn.addEventListener('click', cycleTheme);
  renderToggle();

  const hint = document.createElement('button');
  hint.type = 'button';
  hint.className = 'cmdk-hint';
  hint.innerHTML = '<kbd>⌘K</kbd> menu';
  hint.addEventListener('click', () => openPalette());

  wrap.append(toggleBtn, hint);
  colophon.append(document.createElement('br'), wrap);
}

mq.addEventListener('change', renderToggle);

/* ── Command palette (⌘K) ────────────────────────────────────── */

type Entry = { label: string; group: string; keywords?: string; run: () => void };

const go = (url: string) => () => {
  window.location.href = url;
};
const ext = (url: string) => () => {
  window.open(url, '_blank', 'noopener');
};

const EMAIL = 'amkushwa@ttu.edu';

const entries: Entry[] = [
  { label: 'Home', group: 'go', run: go('/') },
  { label: 'Projects', group: 'go', run: go('/projects/') },
  { label: 'Writing', group: 'go', run: go('/writing/') },
  ...posts.map((p) => ({ label: p.title, group: 'post', keywords: 'writing post blog', run: go(`/writing/${p.slug}/`) })),
  { label: 'git0x — secret scanner', group: 'project', keywords: 'npm cli', run: ext('https://www.npmjs.com/package/git0x') },
  { label: 'Kayden — agent homes', group: 'project', run: ext('https://kayden-dao.vercel.app') },
  { label: 'Oath — agent guardrail', group: 'project', run: ext('https://oa-th.wiki') },
  { label: 'Universal Sentinel', group: 'project', run: ext('https://sentinel-sigma-five.vercel.app') },
  { label: 'Play the Oath demo', group: 'do', keywords: 'interactive try', run: go('/writing/delete-the-oracle/') },
  { label: 'Copy email', group: 'do', keywords: 'contact mail', run: copyEmail },
  { label: 'Toggle theme', group: 'do', keywords: 'dark light mode', run: cycleTheme },
  { label: 'GitHub', group: 'link', run: ext('https://github.com/kushwahaamar-dev') },
  { label: 'X / Twitter', group: 'link', run: ext('https://x.com/amarkushwaha__') },
  { label: 'Résumé (PDF)', group: 'link', run: ext('/Amar_Kushwaha_Resume.pdf') },
  { label: 'View source', group: 'link', keywords: 'github repo code', run: ext('https://github.com/kushwahaamar-dev/portfolio') },
];

let dialog: HTMLDialogElement | null = null;
let input: HTMLInputElement | null = null;
let list: HTMLUListElement | null = null;
let filtered: Entry[] = [];
let active = 0;
let lastFocus: HTMLElement | null = null;

function buildPalette() {
  dialog = document.createElement('dialog');
  dialog.className = 'cmdk';
  dialog.setAttribute('aria-label', 'Command menu');

  input = document.createElement('input');
  input.className = 'cmdk-input';
  input.type = 'text';
  input.placeholder = 'Jump to a page, project, or action…';
  input.setAttribute('aria-label', 'Search commands');
  input.setAttribute('role', 'combobox');
  input.setAttribute('aria-expanded', 'true');
  input.setAttribute('aria-controls', 'cmdk-list');
  input.setAttribute('aria-autocomplete', 'list');
  input.autocapitalize = 'off';
  input.autocomplete = 'off';
  input.spellcheck = false;

  list = document.createElement('ul');
  list.className = 'cmdk-list';
  list.id = 'cmdk-list';
  list.setAttribute('role', 'listbox');
  list.setAttribute('aria-label', 'Commands');

  dialog.append(input, list);
  document.body.append(dialog);

  input.addEventListener('input', () => render(input!.value));
  input.addEventListener('keydown', onKey);
  dialog.addEventListener('close', () => {
    if (list) list.innerHTML = '';
    lastFocus?.focus();
  });
  dialog.addEventListener('click', (e) => {
    if (e.target === dialog) dialog!.close();
  });
}

function render(query: string) {
  if (!list) return;
  const q = query.trim().toLowerCase();
  filtered = q
    ? entries.filter((e) => `${e.label} ${e.group} ${e.keywords ?? ''}`.toLowerCase().includes(q))
    : entries.slice();
  active = 0;
  list.replaceChildren();
  if (!filtered.length) {
    const empty = document.createElement('li');
    empty.className = 'cmdk-empty';
    empty.textContent = 'nothing here';
    list.append(empty);
    return;
  }
  filtered.forEach((e, i) => {
    const li = document.createElement('li');
    li.className = 'cmdk-item';
    li.id = `cmdk-opt-${i}`;
    li.setAttribute('role', 'option');
    li.setAttribute('aria-selected', String(i === active));
    const label = document.createElement('span');
    label.className = 'cmdk-item-label';
    label.textContent = e.label;
    const group = document.createElement('span');
    group.className = 'cmdk-item-group';
    group.textContent = e.group;
    li.append(label, group);
    li.addEventListener('click', () => choose(i));
    li.addEventListener('mousemove', () => setActive(i));
    list!.append(li);
  });
}

function setActive(i: number) {
  if (!list) return;
  active = (i + filtered.length) % filtered.length;
  [...list.children].forEach((c, idx) => {
    if (c instanceof HTMLElement && c.classList.contains('cmdk-item')) {
      c.setAttribute('aria-selected', String(idx === active));
      if (idx === active) {
        c.scrollIntoView({ block: 'nearest' });
        input?.setAttribute('aria-activedescendant', c.id);
      }
    }
  });
}

function choose(i: number) {
  const e = filtered[i];
  dialog?.close();
  e?.run();
}

function onKey(e: KeyboardEvent) {
  if (e.key === 'ArrowDown') {
    e.preventDefault();
    setActive(active + 1);
  } else if (e.key === 'ArrowUp') {
    e.preventDefault();
    setActive(active - 1);
  } else if (e.key === 'Enter') {
    e.preventDefault();
    if (filtered.length) choose(active);
  }
}

function openPalette() {
  lastFocus = document.activeElement as HTMLElement | null;
  if (!dialog) buildPalette();
  render('');
  if (input) input.value = '';
  dialog?.showModal();
  input?.focus();
}

window.addEventListener('keydown', (e) => {
  if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
    e.preventDefault();
    if (dialog?.open) dialog.close();
    else openPalette();
  }
});

/* ── Copy email ──────────────────────────────────────────────── */

const copyBtn = document.getElementById('copy-email');
const copied = document.getElementById('copied');
let copyTimer: number | undefined;

function copyEmail() {
  navigator.clipboard.writeText(EMAIL).then(
    () => {
      if (!copied) return;
      copied.hidden = false;
      window.clearTimeout(copyTimer);
      copyTimer = window.setTimeout(() => (copied.hidden = true), 1600);
    },
    () => {
      window.location.href = `mailto:${EMAIL}`;
    },
  );
}

copyBtn?.addEventListener('click', copyEmail);

/* ── Accessibility scaffolding ───────────────────────────────── */

const liveRegion = document.createElement('span');
liveRegion.className = 'sr-only';
liveRegion.setAttribute('role', 'status');
liveRegion.setAttribute('aria-live', 'polite');

function announce(message: string) {
  liveRegion.textContent = '';
  // a fresh text node on the next frame so repeated messages re-announce
  requestAnimationFrame(() => (liveRegion.textContent = message));
}

function installSkipLink() {
  const main = document.querySelector('main');
  if (main && !main.id) main.id = 'main';
  const skip = document.createElement('a');
  skip.className = 'skip-link';
  skip.href = '#main';
  skip.textContent = 'Skip to content';
  document.body.prepend(skip);
  document.body.append(liveRegion);
}

/* ── Boot ────────────────────────────────────────────────────── */

installSkipLink();
buildSiteControls();

if (document.querySelector('[data-oath-demo]')) {
  import('./oath-demo').then((m) => m.initOathDemos());
}
