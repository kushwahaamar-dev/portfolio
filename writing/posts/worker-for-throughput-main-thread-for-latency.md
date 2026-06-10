---
title: worker for throughput, main thread for latency
slug: worker-for-throughput-main-thread-for-latency
date: 2026-06-07
index_date: 2026 · 06
meta_line: 2026 · 06 — informational
dek: "always run heavy work off the main thread" is good advice that is sometimes exactly wrong.
---

> i have a web worker in this thing specifically to keep heavy work off the main thread. and then for the one feature where you'd expect a worker most — live, on-every-keystroke scanning — i deliberately don't use it. here's why that's not a bug.

## what git0x does

git0x scans code for secrets that shouldn't be there. aws keys, stripe tokens, private keys — the stuff that ends up in a commit at 2am and on the front page of hn a week later. there's a CLI, but there's also a browser version with a live playground: paste code, and it highlights leaked secrets as you type.

two very different workloads live in the same app:

1. **scan a whole repo or a pile of dropped files.** could be megabytes. takes real time. you do not want the tab to freeze while it churns.
2. **scan the textarea on every keystroke**, so the highlight updates live as you type.

the standard advice covers case 1 perfectly: move heavy work off the main thread into a web worker so the UI stays responsive. so i did. there's a `worker.js` and a little client that talks to it.

## the bridge

the worker replies over `postMessage`, which is fire-and-forget, so you have to match each reply to the call that asked for it. i give every message an id and stash its promise:

```js
return new Promise((resolve, reject) => {
    const id = ++messageId;
    pendingMessages.set(id, { resolve, reject });
    w.postMessage({ id, type, payload });
});
```

worker does the scan, posts back `{ id, type: 'result', payload }`, the client looks up `id`, resolves that promise, deletes it from the map. bulk file scans even stream progress events back through the same channel so there's a live counter. and if the browser doesn't support workers at all, the same call quietly falls back to importing the engine and running on the main thread. fine.

## the part where i ignored the advice

now case 2. real-time scanning, on every keystroke. this is the *most* "obviously put it in a worker" feature in the app — heavy-ish work, runs constantly, sitting directly in the path of the user typing. textbook offload.

i run it on the main thread on purpose.

```js
// Quick scan for real-time highlighting
// Uses main thread to avoid message overhead
export async function quickScan(content) {
    const { quickScan: qs } = await import('./engine.js');
    return qs(content);
}
```

here's the reasoning. when you `postMessage` to a worker, the payload gets structured-cloned — copied across the thread boundary — on the way in, and the result gets cloned again on the way back. for a whole repo, that copy is nothing next to the actual scanning; the worker wins easily. but for a few hundred characters in a textarea, the copy *is* the work. you'd be serializing the content, hopping threads, serializing the result, hopping back — every keystroke — to save yourself a regex pass that takes microseconds.

so i split the engine. the real-time path is a stripped-down `quickScan`: loop the patterns, run each regex, drop the obvious false positives, return the hits. no entropy math, no context scoring, none of the heavier layers the full scan does. it's small enough that running it inline, synchronously, on the main thread beats the round-trip to a worker that would do it "properly."

the rule i landed on:

- **throughput workload** (big, occasional, can tolerate latency) → worker. the copy cost is a rounding error and you keep the UI alive.
- **latency workload** (small, constant, in the typing loop) → main thread. the round-trip costs more than the work, so paying it is the slow option.

same app, opposite answers, and the second one looks wrong until you do the arithmetic.

## the other small thing: where results go

related decision. scan history gets stored locally so your past scans stick around. the obvious move is `localStorage`. i used IndexedDB instead, with a one-time migration off localStorage for anyone who'd used the old version.

reason: `localStorage` caps out around 5MB and it's synchronous — every read and write blocks the main thread. for a few settings, who cares. for scan results that can get large, you'd be back to janking the UI on the storage side right after carefully un-janking it on the compute side. IndexedDB is async and roughly unbounded. it's more API to deal with, but it's the right tool once the data isn't tiny.

## takeaway

"offload heavy work to a worker" and "use localStorage for persistence" are both good defaults, and i broke both in the same app for the same reason: the default optimizes for the common case, and the live playground isn't the common case. it's small, it's constant, and it's sitting right in the user's typing loop — where the cost of *moving* the work is bigger than the work.

defaults are defaults. measure the one path that's actually hot.
