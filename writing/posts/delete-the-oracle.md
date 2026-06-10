---
title: delete the oracle
slug: delete-the-oracle
date: 2026-06-09
index_date: 2026 · 06
meta_line: 2026 · 06 — informational + fun
dek: i built a trusted oracle to catch my agent misbehaving, then deleted it and the system got safer.
---

> the readme still promises an oracle. some trusted signer sitting off to the side, watching the agent, and when it catches a violation it signs an attestation you can slash against. there's a `keys/oracle.json` and everything.
>
> i deleted it. turns out if the violation is already provable on-chain, you don't need anyone to vouch for it.

## the thing i was building

oath is a little protocol for keeping AI agents honest. before an agent does something with consequences — spend money, book a thing, call an API that costs you — it has to post a promise on solana first. scoped, time-bound, backed by its own staked SOL. the user co-signs. if the agent breaks the promise, the stake gets slashed automatically. no lawsuit, no support ticket, no trusting the agent's vendor to do the right thing.

the whole pitch is "nothing is trust-based." which is a great line right up until you look at how the slashing actually worked in my first design.

## the oracle, my first answer

here's what i wrote first. the agent acts. some of those actions are out of scope — it tried to pay a recipient that wasn't whitelisted, or went over the cap you set. an off-chain service watches for that, decides "yeah, that's a violation," and signs an attestation with an ed25519 key. you hand that signature to the `slash` instruction, the program verifies it against a hardcoded oracle pubkey, and the stake moves.

it works. solana even has an ed25519 precompile, so verifying the signature on-chain is cheap. i had `keys/oracle.json`, the constant for the trusted pubkey, the whole setup.

but look at what i'd actually built. a protocol whose entire selling point is "no single party is the trust anchor" — with a single party as the trust anchor. whoever holds `oracle.json` decides what counts as a violation. if that key signs a bad attestation, the program slashes. if it never signs, nobody ever gets slashed. i'd moved the trust around. i hadn't removed it.

## the part i missed

the question that fixed it: *who actually knows whether the agent violated its oath?*

i'd been assuming you needed judgment — someone has to look at the action and decide if it was in bounds. but the bounds are not vague. the oath says: these action types, these recipients, this much per transaction, this much total, before this timestamp. that's not a judgment call. that's four comparisons.

and the chain can do comparisons.

so i moved the check into the program. there's an instruction called `record_action` that the agent has to call before it does anything off-chain. the key decision: **it always succeeds.** it never reverts. instead it writes a little account — an `Attempt` — and stamps it with a status:

```rust
let status = if !oath.allowed_action_types.contains(&args.action_type) {
    AttemptStatus::Violation
} else if !oath.allowed_recipients.contains(&args.recipient) {
    AttemptStatus::Violation
} else if args.amount > oath.per_tx_cap {
    AttemptStatus::Violation
} else if projected > oath.spend_cap {
    AttemptStatus::Violation
} else {
    AttemptStatus::Pending
};
```

that's the whole judge. in scope → `Pending`. out of scope → `Violation`. the program wrote down, on-chain, permanently, whether the agent just stepped out of line.

now slashing needs no oracle. the `slash` instruction reads the `Attempt`, checks the status is `Violation`, drains the vault to the user, and ends the oath. anyone can call it — there's no privileged signer, because there's nothing left to attest to. the proof is already sitting on chain. the comment i left on that function is the most satisfied i've ever been with a code comment:

> No oracle. No off-chain attestation. The on-chain Attempt IS the proof.

## the subtlety that took a second pass

one distinction matters and i got it wrong the first time: *a malformed request is not a violation.*

if the agent calls `record_action` against an oath that already expired, or one that's already been slashed — that's not the agent misbehaving, that's just a broken request. you don't want to mint a slashable attempt for it and nuke someone's stake over a timing bug. so those cases *do* revert. they're program errors. only the in-scope-vs-out-of-scope question becomes a status.

so the rule ended up being: well-formed but out of bounds → record it as a violation, anyone can slash. malformed → reject outright. "you broke a rule" and "you sent me garbage" are different things, and the program treats them differently.

## what i'd actually take from this

i don't think this is really about blockchains. the pattern is: i reached for a trusted third party to make a decision, and the decision turned out to be mechanical. the oracle was a crutch for a classification i could just — compute, in the place where everyone could already see it.

whenever you're about to add a trusted signer, an admin role, a "we'll verify it on our backend" step — it's worth asking whether the thing you're verifying is a real judgment call or just a comparison you haven't moved into the open yet. half the time it's a comparison.

oath runs on solana devnet. the oracle is gone and it's not coming back.

✌️
