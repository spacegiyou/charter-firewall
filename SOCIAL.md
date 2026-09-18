# Share copy

## X (single post)

CHARTER: a constitutional firewall for coding agents.

The LLM writes.
Judgment is probability.
Code enforces.

One "is this dangerous?" question blocks ~39% of legitimate-but-scary work.
Decompose the hazards. Let policy.ts decide ALLOW / STEER / ASK / BLOCK.

https://github.com/spacegiyou/charter-firewall

## X (thread)

1/
Most agent "guardrails" are one LLM call: "is this dangerous?"

That's a blunt instrument. Scary != unauthorized. A user-named DROP TABLE is not the same as a model-invented force-push.

2/
CHARTER splits the job.

Mechanical cuts (rm -rf /, curl|sh) never wait on a model.
Then a battery: injection, exfil, credentials, irreversible, scope creep.
Then ordinary code applies the constitution.

3/
Verdicts:

ALLOW — no clause fired
STEER — run it, but quote the clause and yank the worker back
ASK — user named a destructive action; confirm
BLOCK — injection, leak, or invented destruction

4/
The model is not the judge. The model is a probability source. policy.ts is the law.

Repo + replay:
https://github.com/spacegiyou/charter-firewall

## Reddit (r/LocalLLaMA, r/programming, r/MachineLearning)

**Title:** CHARTER — stop asking the LLM "is this dangerous?" and put the constitution in code

**Body:**

I got tired of agent harnesses that treat every tool call as a chat problem.

CHARTER is a small constitutional firewall:

- The worker (any LLM) still writes code.
- A fast judge answers typed questions (Noul / Score) about the same state, in parallel.
- policy.ts maps those probabilities onto ALLOW / STEER / ASK / BLOCK.

The important split: the model does not get to be the court. A user-named DROP TABLE is ASK. A model-invented git push --force origin main is BLOCK. Drive-by Prettier on a typo fix is STEER — the call can run, the worker gets quoted stay_on_goal.

Mechanical regex still owns the dumb-lethal stuff (rm -rf /, curl | sh) so a downed model cannot fail open.

This is a playground + a portable policy engine, not a Claude Code plugin and not TypeSafe Jev. Inspired by the Jev-week experiments (firewall ablation, pi-warden, keep/delete compaction). Clone and replay:

```
git clone https://github.com/spacegiyou/charter-firewall
node examples/replay.mjs
```

Happy to be told the thresholds are wrong. That's the point — they're in code, so you can replay logs without spending another token.
