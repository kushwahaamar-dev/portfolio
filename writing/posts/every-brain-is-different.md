---
title: every brain is different
slug: every-brain-is-different
date: 2026-06-04
index_date: 2026 · 06
meta_line: 2026 · 06 — informational + fun
dek: the fix for "the test subjects are different humans" wasn't a bigger model. it was a whitening trick from 2019 and a method from the 2000s.
---

> i spent a datathon trying to read which limb someone was imagining moving, from their brain. the test subjects were complete strangers to the model — different people than it trained on. the thing that actually fixed it wasn't a transformer. it was a covariance trick from 2019, and the single most useful model in my final ensemble was a method older than i'd like to admit.

## the task

rice datathon, neurotrack challenge. you get EEG recordings — 64 electrodes, 656 time points per trial, 160 Hz — of people doing motor imagery. they're imagining moving a limb, and you classify which one: left hand, right hand, both hands, both feet. four classes.

i named my solution NEXUS because at some point it was connecting like nine different models together and i needed to feel organized about it.

the score: 76.66% on the four-class problem. chance is 25%, so call it a bit over 3× better than guessing. that number is not the interesting part. how i got there is.

## the actual problem: it's not your brain

here's the catch that makes EEG hard, and it took me a while to really feel it. **the test subjects are different people than the training subjects.**

that sounds minor. it is not. every brain is physically different — skull thickness, where the electrodes land, baseline rhythms, how strongly two regions co-activate. a classifier that nails the people it trained on will faceplant on a new person, because it learned *those specific brains*, not "imagining your left hand." it overfits to the human, not the task.

so the whole game is generalizing across brains you've never seen. and you can't fix that by making the model bigger — a bigger model overfits the training humans *better*. i tried. more capacity, the validation gap just got worse.

## the fix nobody tells you about

what worked was making the brains look more alike *before* the model ever saw them.

the trick is called Euclidean Alignment, and it's almost insultingly simple. for each trial you compute the covariance matrix — basically "which electrodes move together." you average those to get a subject's characteristic covariance, then build a whitening matrix that, multiplied through, makes that average covariance the identity. apply it to every trial:

```python
mean_cov = np.mean(covs, axis=0)
eigvals, eigvecs = np.linalg.eigh(mean_cov)
eigvals = np.clip(eigvals, self.reg, None)
ref_matrix = eigvecs @ np.diag(1.0 / np.sqrt(eigvals)) @ eigvecs.T
# then for every trial:  X_aligned = ref_matrix @ X
```

in plain terms: it re-centers each subject's data onto a common reference, so subject A's brain and subject B's brain arrive at the model already speaking roughly the same units. the model stops burning capacity learning "this is what person 7's resting state looks like" and gets to spend it on the actual signal. one `reg = 1e-4` on the diagonal so nothing blows up, an eigenvalue clip so the inverse-sqrt stays stable, an identity fallback if the decomposition ever fails. that's the whole thing. it's from 2019 and it did more for my score than any architecture choice i made.

## the part that actually surprised me

i had a pile of deep nets in the ensemble — EEGNet, a couple of conv nets, a CNN-transformer hybrid, a graph net over the electrodes, a conformer. modern stuff. then, almost out of guilt, i threw in CSP + SVM: common spatial patterns into a support vector machine. it's the classic brain-computer-interface method. it is *old*. people were running it on EEG before deep learning was cool.

to decide how much to trust each model i didn't hand-tune the weights — i sampled thousands of weightings from a Dirichlet distribution and kept whichever combination scored best on validation:

```python
weights = np.random.dirichlet(np.ones(n_models) * 0.5)
# keep the set with the best validation accuracy
```

when it settled, the highest weight in the entire ensemble — 0.19 — went to CSP + SVM. the oldest, simplest model in the lineup. higher than any of the deep nets, even though its accuracy *alone* was lower than theirs.

that stopped me for a second. but it makes sense once you sit with it: the ensemble doesn't want the most accurate models, it wants the most *complementary* ones. all my deep nets look at the problem the same way, so they make the same mistakes, so stacking them adds less than you'd hope. CSP+SVM looks at the spatial structure differently. it's wrong in different places. and a model that's wrong where the others are right is worth more to an ensemble than a slightly-better model that's wrong in all the same spots.

(this all ran on my laptop, by the way — `mps` backend, no cluster. you don't need a datacenter to do this.)

## what i took from it

two things stuck.

one: when your problem is "generalize across things that are individually different" — people, devices, sessions — look for a way to *normalize the difference out* before modeling, not a model big enough to memorize all of them. the alignment trick beat the architecture search.

two: in an ensemble, diversity beats individual accuracy. the best single model is not automatically the most valuable member. the weird old method that's wrong in its own particular way might be carrying more than the shiny one.

a 20-year-old algorithm got the top vote. i'm fine with that.
