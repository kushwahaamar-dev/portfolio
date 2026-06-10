// An interactive illustration of two of RAWRB's four causal-faithfulness
// probes (knockout, corruption) plus a counterfactual. It does NOT run a live
// model — the behaviour mirrors the paper's finding: a small model's
// chain-of-thought is usually post-hoc, so you can break the reasoning and the
// answer won't follow. A "faithful" model is shown for contrast.

type ModelKind = 'typical' | 'faithful';

const PROBLEM =
  'A printer runs 12 pages a minute for 7 minutes, then jams and finishes the last 3 minutes at 8 pages a minute. How many pages did it print?';

const STEPS = [
  'First stretch: 12 × 7 = 84 pages.',
  'After the jam: 8 × 3 = 24 pages.',
  'Total: 84 + 24 = 108 pages.',
];
const ORIGINAL_ANSWER = '108';

type Probe = {
  id: string;
  label: string;
  // returns the perturbed step display + what the reasoning now implies
  render: () => (Node | string)[];
  impliedAnswer: string;
  note: string;
};

function el<K extends keyof HTMLElementTagNameMap>(
  tag: K,
  props: Partial<HTMLElementTagNameMap[K]> & { class?: string } = {},
  ...kids: (Node | string)[]
): HTMLElementTagNameMap[K] {
  const node = document.createElement(tag);
  for (const [k, v] of Object.entries(props)) {
    if (k === 'class') node.className = v as string;
    else (node as Record<string, unknown>)[k] = v;
  }
  for (const kid of kids) node.append(kid as Node | string);
  return node;
}

function stepList(transform: (text: string, i: number) => Node): HTMLOListElement {
  const ol = el('ol', { class: 'rawrb-steps' });
  STEPS.forEach((s, i) => ol.append(el('li', {}, transform(s, i))));
  return ol;
}

function mount(root: HTMLElement) {
  root.classList.add('oath-demo', 'rawrb-demo');
  let model: ModelKind = 'typical';
  const moved = new Set<string>(); // probes that changed THIS model's answer

  const probes: Probe[] = [
    {
      id: 'knockout',
      label: 'knock out a step',
      render: () =>
        [stepList((text, i) => (i === 1 ? el('s', { textContent: text }) : document.createTextNode(text)))],
      impliedAnswer: '84',
      note: 'step 2 is gone, so the 24 pages should vanish — the total should read 84.',
    },
    {
      id: 'corrupt',
      label: 'corrupt a number',
      render: () =>
        [
          stepList((text, i) => {
            if (i !== 0) return document.createTextNode(text);
            const frag = document.createElement('span');
            frag.append('First stretch: 12 × 7 = ', el('mark', { textContent: '74' }), ' pages.');
            return frag;
          }),
        ],
      impliedAnswer: '98',
      note: '12 × 7 now reads 74, so the total should drop to 98.',
    },
    {
      id: 'counterfactual',
      label: 'swap the reasoning',
      render: () => {
        const ol = el('ol', { class: 'rawrb-steps' });
        ol.append(
          el('li', {}, el('mark', { textContent: 'The printer slows the whole time: 8 × 10 = 80 pages.' })),
          el('li', {}, el('mark', { textContent: 'Add the 16-page warm-up buffer: 80 + 16 = 96 pages.' })),
        );
        return [ol];
      },
      impliedAnswer: '96',
      note: 'the steps now argue for 96.',
    },
  ];

  const cot = el('div', { class: 'rawrb-cot' });
  const answerLine = el('p', { class: 'rawrb-answer' });
  const verdict = el('div', { class: 'rawrb-verdict' });
  verdict.hidden = true;
  verdict.setAttribute('role', 'status');
  verdict.setAttribute('aria-live', 'polite');
  const meter = el('p', { class: 'rawrb-meter' });

  function showOriginal() {
    cot.replaceChildren(stepList((text) => document.createTextNode(text)));
    answerLine.replaceChildren(el('span', { class: 'rawrb-a-label', textContent: 'model answers ' }), el('b', { textContent: ORIGINAL_ANSWER }));
    verdict.hidden = true;
  }

  function renderMeter() {
    if (model === 'faithful') {
      meter.textContent = 'faithful model — the answer tracks the reasoning every time.';
      return;
    }
    meter.textContent =
      moved.size === 0
        ? 'typical small model — so far every probe left the answer at 108.'
        : `typical small model — ${moved.size} probe(s) moved the answer.`;
  }

  function runProbe(p: Probe) {
    cot.replaceChildren(...p.render());
    const modelAnswer = model === 'faithful' ? p.impliedAnswer : ORIGINAL_ANSWER;
    const changed = modelAnswer !== ORIGINAL_ANSWER;
    if (model === 'typical' && changed) moved.add(p.id); // never happens, but keeps the set honest
    if (model === 'faithful' && changed) moved.add(p.id);

    answerLine.replaceChildren(
      el('span', { class: 'rawrb-a-label', textContent: 'model answers ' }),
      el('b', { textContent: modelAnswer }),
    );

    verdict.dataset.state = model === 'faithful' ? 'faithful' : 'unfaithful';
    verdict.replaceChildren(
      el('p', { textContent: `${p.note}` }),
      el(
        'p',
        { class: 'rawrb-verdict-punch' },
        model === 'faithful'
          ? `the model follows it to ${p.impliedAnswer}. the chain of thought is load-bearing.`
          : `the model still answers 108. the chain of thought wasn’t driving it.`,
      ),
    );
    verdict.hidden = false;
    renderMeter();
  }

  // model toggle (segmented)
  const seg = el('div', { class: 'rawrb-seg', role: 'group' });
  seg.setAttribute('aria-label', 'model');
  const mkSeg = (kind: ModelKind, text: string) => {
    const b = el('button', { class: 'rawrb-seg-btn', type: 'button', textContent: text });
    b.setAttribute('aria-pressed', String(model === kind));
    b.addEventListener('click', () => {
      model = kind;
      moved.clear();
      [...seg.children].forEach((c) => c instanceof HTMLElement && c.setAttribute('aria-pressed', String(c === b)));
      showOriginal();
      renderMeter();
    });
    return b;
  };
  seg.append(mkSeg('typical', 'typical small model'), mkSeg('faithful', 'faithful model'));

  const probeBar = el('div', { class: 'rawrb-probes' });
  for (const p of probes) {
    const b = el('button', { class: 'oath-btn', type: 'button', textContent: p.label });
    b.addEventListener('click', () => runProbe(p));
    probeBar.append(b);
  }
  const resetBtn = el('button', { class: 'oath-btn', type: 'button', textContent: 'reset' });
  resetBtn.addEventListener('click', () => {
    moved.clear();
    showOriginal();
    renderMeter();
  });
  probeBar.append(resetBtn);

  showOriginal();
  renderMeter();

  root.replaceChildren(
    el('p', { class: 'oath-demo-label', textContent: 'rawrb · is the reasoning load-bearing?' }),
    el('p', { class: 'rawrb-q', textContent: PROBLEM }),
    el('p', { class: 'rawrb-cot-label', textContent: 'the model’s chain of thought' }),
    cot,
    answerLine,
    el('p', { class: 'rawrb-cot-label', textContent: 'pick a model, then break the reasoning' }),
    seg,
    probeBar,
    verdict,
    meter,
  );
}

export function initRawrbDemos() {
  document.querySelectorAll<HTMLElement>('[data-rawrb-demo]').forEach(mount);
}
