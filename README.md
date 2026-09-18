# CHARTER

**The LLM writes. Code enforces. Judgment is a syscall.**

CHARTER is a constitutional firewall for coding agents. It does not generate text. It takes structured state plus typed questions and returns `ALLOW` / `STEER` / `ASK` / `BLOCK`. The model only emits probabilities. Ordinary code applies the constitution.

This is a **playground and a portable policy engine**, not a drop-in replacement for a production agent runtime. It is ready to show. It is not ready to put in front of `git push --force` on a machine that can actually do it — unless you wire the policy into a real hook.

Engine: `src/lib/charter/`

## Why this exists

One question — *"is this dangerous?"* — is a blunt instrument. On a decomposed battery (injection, exfil, credentials, irreversible, scope creep), a single yes/no judge has been shown to block a large share of legitimate-but-scary work. CHARTER splits the hazards, then lets **code** combine them.

```
sensor / tool call
        |
        v
  mechanical cuts     (regex, paths, exit codes — no model)
        |
        v
  ACTION / WRITE / TURN / MEMORY battery
  (Noul / Choice / Score in parallel)
        | probabilities only
        v
  policy.ts           <- this is the constitution
        |
        v
  ALLOW | STEER | ASK | BLOCK
```

`STEER` is the default for slop and drift: the call may run, but the worker is quoted the clause and told to fix it. `BLOCK` / `ASK` are reserved for injection, leaks, and destruction. A scary action the **user named** is `ASK`. A scary action the **model invented** is `BLOCK`.

## What it is / is not

| Is | Is not |
| --- | --- |
| A decomposed guardrail with a code-owned verdict | TypeSafe Jev, or a wrapper around it |
| A replayable policy table | Calibrated on your production traces |
| Inspired by community Jev-week firewalls and wardens | A Claude Code / Cursor plugin yet |

The playground will call an LLM for the semantic battery when a key is present. If not, a **local reflex** (pattern scores, clearly labeled) hits the same `policy.ts`. Mechanical cuts (`rm -rf /`, `curl | sh`, force-push to `main`) never wait on a model.

## Quick start

```bash
git clone https://github.com/spacegiyou/charter-firewall.git
cd charter-firewall
node examples/replay.mjs
```

You should see a table of scenario id to verdict. `rm-root` and `pipe-sh` are mechanical `BLOCK`. `drop-asked` is `ASK`. `force-invented` is `BLOCK`. `scope` is `STEER`. `tests` is `ALLOW`.

## Policy in one screen

```ts
if (injection >= 0.70) return BLOCK
if (exfiltration >= 0.60 || credentials >= 0.60) return BLOCK
if (irreversible >= 0.70 || blastRadius >= 2.5)
  return userNamedIt ? ASK : BLOCK
if (scopeCreep >= 0.70) return STEER
return ALLOW
```

Thresholds live in `src/lib/charter/policy.ts`. Swap them without re-calling the model — log the raw probabilities and replay.

## Hooks

| Hook | When | Default move |
| --- | --- | --- |
| ACTION | before bash / write / edit | HOLD only on irreversible / leak / injection |
| WRITE | after a file changes | STEER; never hold. Quote the clause. |
| TURN | end of assistant turn | stuck, off-track, unverified done |
| MEMORY | before context compact | keep / truncate / drop tool calls only. User and assistant prose stay verbatim. |

Compaction that hides tool results as `ok, 4213 chars omitted` gives the judge nothing to work with. Keep the head, error lines, and paths.

## Status

Honest ceiling: this is a weekend-shaped demo of a serious architecture. The interesting part is the split — model for meaning, code for law — not a claim that the probabilities are calibrated. If you put this on a live agent, start with ACTION + mechanical cuts + jsonl logs, and retune thresholds offline.

MIT. Not affiliated with TypeSafe AI.

## Share

Ready-to-paste posts: SOCIAL.md
