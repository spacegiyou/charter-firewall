# Share copy

Paste as-is. The 39.2% number is from a published ablation on [typesafe-ai-firewall](https://github.com/AnshChoudhary/typesafe-ai-firewall), not a CHARTER eval. Do not imply CHARTER measured it.

Repo: https://github.com/spacegiyou/charter-firewall

---

## X (single post)

CHARTER: a constitutional firewall for coding agents.

The LLM writes.
Judgment is probability.
Code enforces.

One "is this dangerous?" question blocked 39% of legitimate-but-scary work in a published Jev-week ablation.
Decompose the hazards. Let policy.ts decide ALLOW / STEER / ASK / BLOCK.

https://github.com/spacegiyou/charter-firewall

---

## X (thread)

1/
Most agent "guardrails" are one LLM call: "is this dangerous?"

That's a blunt instrument. Scary ≠ unauthorized. A user-named DROP TABLE is not the same as a model-invented force-push.

2/
A published ablation (typesafe-ai-firewall) collapsed a 5-hazard battery into that single question.

Catch rate on attacks: still 100%.
Block rate on legitimate-but-scary work: 39.2%.

The model isn't the problem. The question is.

3/
CHARTER splits the job. Not Jev — a portable constitution.

Mechanical cuts (rm -rf /, curl|sh) never wait on a model.
Then a battery: injection, exfil, credentials, irreversible, scope creep.
Then ordinary code applies the law.

4/
Verdicts:

ALLOW — no clause fired
STEER — run it, but quote the clause and yank the worker back
ASK — user named a destructive action; confirm
BLOCK — injection, leak, or invented destruction

5/
The model is not the judge. The model is a probability source. policy.ts is the court.

Clone and replay, no install:

git clone https://github.com/spacegiyou/charter-firewall
node examples/replay.mjs

---

## Reddit (r/LocalLLaMA, r/programming, r/MachineLearning)

**Title:** CHARTER — stop asking the LLM "is this dangerous?" and put the constitution in code

**Body:**

I got tired of agent harnesses that treat every tool call as a chat problem.

CHARTER is a small constitutional firewall:

- The worker (any LLM) still writes code.
- A fast judge answers *typed* questions about the *same* state, in parallel.
- `policy.ts` maps those probabilities onto ALLOW / STEER / ASK / BLOCK.

The important split: **the model does not get to be the court.** A user-named `DROP TABLE` is ASK. A model-invented `git push --force origin main` is BLOCK. Drive-by Prettier on a typo fix is STEER — the call can run, the worker gets quoted `stay_on_goal`.

Mechanical regex still owns the dumb-lethal stuff (`rm -rf /`, `curl | sh`) so a downed model cannot fail open.

Why not one "is this dangerous?" question? In the published [typesafe-ai-firewall](https://github.com/AnshChoudhary/typesafe-ai-firewall) ablation, that single question matched attack catch-rate (100%) but **blocked 39.2% of hard negatives** — legitimate work that merely looks catastrophic. Decomposition is the difference between a firewall and a blunt instrument. CHARTER copies that split; it is not TypeSafe Jev and it is not calibrated on your traces.

This is a playground + a portable policy engine, not a Claude Code plugin. Clone and replay, no install:

```
git clone https://github.com/spacegiyou/charter-firewall
node examples/replay.mjs
```

Expected: `rm-root` and `pipe-sh` mechanical BLOCK, `drop-asked` ASK, `force-invented` BLOCK, `scope` STEER, `tests` ALLOW.

Happy to be told the thresholds are wrong. That's the point — they're in code, so you can replay logs without spending another token.
