---
title: right answer, wrong reason
slug: right-answer-wrong-reason
date: 2026-06-10
index_date: 2026 · 06
meta_line: 2026 · 06 — interactive
dek: i built four probes to check whether a small model's chain-of-thought actually drives its answer. mostly, it doesn't — and you can watch it happen below.
---

> a small model solves a math problem, shows its work, gets it right. clean chain of thought, correct answer. then i corrupt one of its reasoning steps — change a number so the math now points somewhere else — and ask again. it gives the same answer. the reasoning was never driving anything. it was a story told after the fact.

## the question

chain-of-thought made small models look like they reason. you ask for the steps, they produce steps, the answer gets better. but "produces text that looks like reasoning" and "reasons" are not the same claim, and i wanted to know which one was actually true for models small enough to run on a laptop.

so i built RAWRB — Right Answer, Wrong Reason Benchmark. the idea is almost embarrassingly simple: if a chain of thought is real, messing with it should mess with the answer. break the reasoning, and a faithful model breaks with it. if you can corrupt the steps and the answer doesn't move, the reasoning wasn't load-bearing — it was a post-hoc rationalization the model generated to look like it was thinking.

## four ways to poke it

RAWRB has four causal probes. two of them are in the toy below:

- **knockout** — delete a reasoning step and re-ask. a faithful model loses whatever work that step was doing. an unfaithful one shrugs.
- **corruption** — change a number inside a step so the math now leads somewhere else. faithful follows it off the cliff. unfaithful stays put.
- the other two: **counterfactual** (swap in reasoning that argues for a different answer) and **paraphrase stability** (reword the steps without changing the logic, and check the answer doesn't wobble for no reason).

here's the part you can play with. pick a model, run a probe, and watch whether the answer follows the reasoning or ignores it:

<div data-rawrb-demo></div>

## what i actually found

across five open models in two size tiers, on GSM8K, MATH, and FOLIO:

- **bigger isn't more honest.** the medium-tier models got about 20 points more accurate — and 11 to 18 points *less* faithful. accuracy and faithfulness pulled in opposite directions (Spearman ρ ≈ −0.90). the models that look smartest are often the ones whose reasoning matters least.
- **the chain of thought anchors the answer.** feed a model a stale or wrong chain of thought and its rate of changing the answer drops by 50–70 points. once it has written the steps, it commits to where they were heading — even when they're wrong.
- **almost nothing is both right and honest.** only 4 to 14 percent of problems came out simultaneously correct *and* faithful. most "correct" answers were right for a reason the model couldn't actually defend.
- **harder problems are more faithful.** on the toughest MATH problems the model leaned on its reasoning more (42% faithful) than on the easiest (34%). when it can't shortcut straight to the answer, it has to actually use the steps.

all of it runs locally through Ollama — no API, fully reproducible. the whole point was that you shouldn't have to take my word for it either.

## why it matters

we're wiring these models into agents that explain their decisions, and the explanation is the part a human checks. if the explanation is decorative — generated to be plausible, not to be the actual cause — then "the model told me why" is worth less than it looks. that isn't a reason to throw out chain of thought. it's a reason to test whether yours is load-bearing instead of assuming it.

i corrupted the reasoning and the answer didn't move. that should bother you a little. it bothered me enough to write [a paper](/rawrb-paper.pdf) about it.
