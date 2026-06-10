// An in-browser model of the Oath program's record_action → slash logic.
// The classification mirrors programs/oath/src/instructions/record_action.rs:
// the four scope checks, in order, none of which revert — they only set a
// status. Out-of-scope mints a Violation that anyone can slash.

type Kind = 'transfer' | 'approve';
type Recipient = { id: string; label: string; whitelisted: boolean };

const ALLOWED_TYPES: Kind[] = ['transfer'];
const PER_TX_CAP = 200;
const SPEND_CAP = 500;
const STAKE = '1.5 SOL';
const RECIPIENTS: Recipient[] = [
  { id: 'alice.base', label: 'alice.base', whitelisted: true },
  { id: 'vendor.base', label: 'vendor.base', whitelisted: true },
  { id: '0x9f…aE', label: '0x9f…aE  (not whitelisted)', whitelisted: false },
];

type Verdict =
  | { status: 'pending'; reason: string }
  | { status: 'violation'; reason: string }
  | { status: 'error'; reason: string };

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

function mount(root: HTMLElement) {
  let spent = 0;
  let pending = 0;
  let active = true;

  const typeSel = el('select', { ariaLabel: 'action type' });
  typeSel.append(el('option', { value: 'transfer', textContent: 'transfer' }));
  typeSel.append(el('option', { value: 'approve', textContent: 'approve' }));

  const recipSel = el('select', { ariaLabel: 'recipient' });
  for (const r of RECIPIENTS) recipSel.append(el('option', { value: r.id, textContent: r.label }));

  const amount = el('input', { type: 'number', value: '80', min: '0', step: '10', ariaLabel: 'amount in USDC' });
  amount.style.width = '5.5rem';

  const recordBtn = el('button', { class: 'oath-btn oath-btn-primary', textContent: 'record action' });
  const result = el('div', { class: 'oath-result' });
  result.setAttribute('role', 'status');
  result.setAttribute('aria-live', 'polite');
  result.hidden = true;

  const nodes = {
    record: el('span', { class: 'oath-node', textContent: 'record_action' }),
    pending: el('span', { class: 'oath-node', textContent: 'Pending' }),
    commit: el('span', { class: 'oath-node', textContent: 'commit ✓' }),
    violation: el('span', { class: 'oath-node', textContent: 'Violation' }),
    slash: el('span', { class: 'oath-node', textContent: 'slash ⚡' }),
  };
  const lightFlow = (on: Partial<Record<keyof typeof nodes, string>>) => {
    for (const [k, node] of Object.entries(nodes)) {
      const v = on[k as keyof typeof nodes];
      if (v) node.dataset.on = v;
      else delete node.dataset.on;
    }
  };

  const meter = el('p', { class: 'oath-meter' });
  const renderMeter = () => {
    meter.textContent = `committed $${spent} · pending $${pending} · cap $${SPEND_CAP}`;
  };
  renderMeter();

  function classify(type: Kind, recipient: Recipient, amt: number): Verdict {
    if (!active) return { status: 'error', reason: 'this oath has been slashed — it is no longer active.' };
    if (!(amt > 0)) return { status: 'error', reason: 'a malformed request (amount ≤ 0) is rejected outright — it never becomes a slashable attempt.' };
    if (!ALLOWED_TYPES.includes(type)) return { status: 'violation', reason: `action type “${type}” isn’t in the oath’s allowed types.` };
    if (!recipient.whitelisted) return { status: 'violation', reason: `recipient ${recipient.id} isn’t on the whitelist.` };
    if (amt > PER_TX_CAP) return { status: 'violation', reason: `amount $${amt} exceeds the per-tx cap of $${PER_TX_CAP}.` };
    if (spent + pending + amt > SPEND_CAP)
      return { status: 'violation', reason: `this would push committed + pending to $${spent + pending + amt}, over the $${SPEND_CAP} total cap.` };
    return { status: 'pending', reason: `in scope — $${amt} reserved against the cap.` };
  }

  function showResult(state: string, head: string, body: string, actions: HTMLElement[] = []) {
    result.dataset.state = state;
    result.replaceChildren(
      el('p', { class: 'oath-result-head', textContent: head }),
      el('p', { textContent: body }),
    );
    if (actions.length) {
      const bar = el('div', { class: 'oath-result-actions' });
      for (const a of actions) bar.append(a);
      result.append(bar);
    }
    result.hidden = false;
  }

  recordBtn.addEventListener('click', () => {
    const type = typeSel.value as Kind;
    const recipient = RECIPIENTS.find((r) => r.id === recipSel.value)!;
    const amt = Number(amount.value);
    const v = classify(type, recipient, amt);

    if (v.status === 'error') {
      lightFlow({ record: 'violation' });
      showResult('violation', 'rejected', v.reason);
      return;
    }
    if (v.status === 'pending') {
      pending += amt;
      renderMeter();
      lightFlow({ record: 'pending', pending: 'pending' });
      const commitBtn = el('button', { class: 'oath-btn oath-btn-primary', textContent: 'commit' });
      const cancelBtn = el('button', { class: 'oath-btn', textContent: 'cancel' });
      commitBtn.addEventListener('click', () => {
        spent += amt;
        pending -= amt;
        renderMeter();
        lightFlow({ record: 'pending', pending: 'pending', commit: 'commit' });
        showResult('committed', 'committed', `the action went through. $${spent} of the $${SPEND_CAP} cap is now spent.`);
      });
      cancelBtn.addEventListener('click', () => {
        pending -= amt;
        renderMeter();
        lightFlow({});
        result.hidden = true;
      });
      showResult('pending', 'pending', v.reason, [commitBtn, cancelBtn]);
      return;
    }
    // violation
    lightFlow({ record: 'violation', violation: 'violation' });
    const slashBtn = el('button', { class: 'oath-btn', textContent: 'slash ⚡' });
    slashBtn.addEventListener('click', () => {
      active = false;
      lightFlow({ record: 'violation', violation: 'violation', slash: 'slash' });
      showResult('slashed', 'slashed', `anyone could call this — the on-chain Attempt is the proof. the ${STAKE} stake moves to the user and the oath terminates.`);
      recordBtn.disabled = true;
      typeSel.disabled = recipSel.disabled = amount.disabled = true;
      reset.hidden = false;
    });
    showResult('violation', 'violation', `${v.reason} it’s now a slashable attempt — no oracle needed.`, [slashBtn]);
  });

  const reset = el('button', { class: 'oath-btn', textContent: 'reset the demo' });
  reset.hidden = true;
  reset.style.marginTop = '0.9rem';
  reset.addEventListener('click', () => {
    spent = pending = 0;
    active = true;
    recordBtn.disabled = false;
    typeSel.disabled = recipSel.disabled = amount.disabled = false;
    result.hidden = true;
    reset.hidden = true;
    lightFlow({});
    renderMeter();
  });

  const preset = (label: string, fn: () => void) => {
    const b = el('button', { class: 'oath-btn', textContent: label });
    b.addEventListener('click', fn);
    return b;
  };

  root.replaceChildren(
    el('p', { class: 'oath-demo-label', textContent: 'oath · record_action' }),
    el(
      'p',
      { class: 'oath-rules' },
      'this oath lets the agent ',
      el('b', { textContent: 'transfer' }),
      ' only, to ',
      el('b', { textContent: 'alice.base / vendor.base' }),
      `, at most `,
      el('b', { textContent: `$${PER_TX_CAP}` }),
      ' per action and ',
      el('b', { textContent: `$${SPEND_CAP}` }),
      ` total. stake: ${STAKE}.`,
    ),
    el('div', { class: 'oath-presets' },
      preset('in-scope', () => { typeSel.value = 'transfer'; recipSel.value = 'alice.base'; amount.value = '80'; }),
      preset('out-of-scope', () => { typeSel.value = 'transfer'; recipSel.value = '0x9f…aE'; amount.value = '80'; }),
      preset('over the cap', () => { typeSel.value = 'transfer'; recipSel.value = 'alice.base'; amount.value = '300'; }),
    ),
    el('div', { class: 'oath-field' }, el('span', { textContent: 'action' }), typeSel),
    el('div', { class: 'oath-field' }, el('span', { textContent: 'recipient' }), recipSel),
    el('div', { class: 'oath-field' }, el('span', { textContent: 'amount $' }), amount),
    recordBtn,
    result,
    meter,
    el('div', { class: 'oath-flow' },
      nodes.record, el('span', { textContent: '→' }),
      nodes.pending, el('span', { textContent: '→' }), nodes.commit,
      el('span', { textContent: '   /   ' }),
      nodes.violation, el('span', { textContent: '→' }), nodes.slash,
    ),
    reset,
  );
}

export function initOathDemos() {
  document.querySelectorAll<HTMLElement>('[data-oath-demo]').forEach(mount);
}
