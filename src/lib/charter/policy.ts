import type {
  ActionAnswers,
  Decision,
  MemoryAction,
  MemoryCall,
  MemoryDecision,
  PolicyTrace,
  TurnAnswers,
  Verdict,
  WriteAnswers,
} from "./types";

export const THRESHOLDS = {
  holdIrreversible: 0.7,
  holdExfil: 0.6,
  holdInjection: 0.7,
  holdCreds: 0.6,
  askBlast: 2.5,
  steerScope: 0.7,
  finish: 0.85,
  stuck: 0.8,
  tests: 0.75,
  writeViolation: 0.7,
  keep: 0.5,
  userAuthorized: 0.75,
} as const;

export function decideAction(
  a: ActionAnswers,
  userExplicitlyAsked: boolean,
  mechanical: string | null,
): Decision {
  if (mechanical) {
    return { verdict: "BLOCK", reason: mechanical, mechanical: true, traces: [{ rule: mechanical, fired: true }] };
  }
  const t: PolicyTrace[] = [];
  const fire = (rule: string, fired: boolean) => {
    t.push({ rule, fired });
    return fired;
  };
  if (fire(`injection >= ${THRESHOLDS.holdInjection}`, a.injection >= THRESHOLDS.holdInjection)) {
    return { verdict: "BLOCK", reason: "Judged as prompt injection", mechanical: false, traces: t };
  }
  if (
    fire(`exfiltration >= ${THRESHOLDS.holdExfil}`, a.exfiltration >= THRESHOLDS.holdExfil) ||
    fire(`credentials >= ${THRESHOLDS.holdCreds}`, a.credentials >= THRESHOLDS.holdCreds)
  ) {
    return { verdict: "BLOCK", reason: "Exfiltration or credential leak", mechanical: false, traces: t };
  }
  const destructive = a.irreversible >= THRESHOLDS.holdIrreversible || a.blastRadius >= THRESHOLDS.askBlast;
  fire(`irreversible >= ${THRESHOLDS.holdIrreversible}`, a.irreversible >= THRESHOLDS.holdIrreversible);
  fire(`blast >= ${THRESHOLDS.askBlast}`, a.blastRadius >= THRESHOLDS.askBlast);
  if (destructive) {
    const authorized = userExplicitlyAsked || a.userAuthorized >= THRESHOLDS.userAuthorized;
    fire("user authorized destructive action", authorized);
    if (authorized) {
      return {
        verdict: "ASK",
        reason: "User named this destructive action — confirm before running",
        mechanical: false,
        traces: t,
      };
    }
    return { verdict: "BLOCK", reason: "Model invented a destructive action", mechanical: false, traces: t };
  }
  if (fire(`scope_creep >= ${THRESHOLDS.steerScope}`, a.scopeCreep >= THRESHOLDS.steerScope)) {
    return {
      verdict: "STEER",
      reason: "Off-goal work — run it, but tell the worker to get back on the task",
      mechanical: false,
      traces: t,
    };
  }
  return { verdict: "ALLOW", reason: "No clause fired", mechanical: false, traces: t };
}

export function decideWrite(a: WriteAnswers): Decision {
  const t: PolicyTrace[] = [];
  if (a.ruleViolation >= THRESHOLDS.writeViolation || a.slop >= THRESHOLDS.writeViolation) {
    t.push({ rule: "write violation / slop", fired: true });
    return {
      verdict: "STEER",
      reason:
        a.violatedClause && a.violatedClause !== "none"
          ? `Quote clause: ${a.violatedClause}`
          : "Slop or clause violation — make the worker fix it on the next edit",
      mechanical: false,
      traces: t,
    };
  }
  if (a.unverifiedClaim >= THRESHOLDS.writeViolation) {
    t.push({ rule: "unverified claim", fired: true });
    return {
      verdict: "STEER",
      reason: "Claimed the change works with no passing test in state",
      mechanical: false,
      traces: t,
    };
  }
  return { verdict: "ALLOW", reason: "Write clauses passed", mechanical: false, traces: t };
}

export function decideTurn(a: TurnAnswers): Decision {
  const t: PolicyTrace[] = [];
  if (a.needsHuman >= THRESHOLDS.stuck) {
    t.push({ rule: "needs_human", fired: true });
    return {
      verdict: "ASK",
      reason: "Needs credentials, product judgment, or destructive permission",
      mechanical: false,
      traces: t,
    };
  }
  if (a.workerStuck >= THRESHOLDS.stuck || a.workOffTrack >= THRESHOLDS.stuck) {
    t.push({ rule: "stuck / off-track", fired: true });
    return {
      verdict: "STEER",
      reason: "Same strategy looping or drifted off goal — demand a new hypothesis",
      mechanical: false,
      traces: t,
    };
  }
  if (a.doneClaimUnverified >= THRESHOLDS.writeViolation) {
    t.push({ rule: "done without tests", fired: true });
    return {
      verdict: "STEER",
      reason: "Said done without a passing test — force verification",
      mechanical: false,
      traces: t,
    };
  }
  if (a.readyToFinish >= THRESHOLDS.finish && a.testsSufficient >= THRESHOLDS.tests) {
    t.push({ rule: "ready_to_finish", fired: true });
    return {
      verdict: "ALLOW",
      reason: "Verified complete — hand back to the user",
      mechanical: false,
      traces: t,
    };
  }
  return { verdict: "ALLOW", reason: "Continue", mechanical: false, traces: t };
}

export function decideMemoryCall(
  call: MemoryCall,
  keepCall: number,
  keepResult: number,
  keepThreshold = THRESHOLDS.keep,
): MemoryDecision {
  if (call.pinned) {
    return { id: call.id, tool: call.tool, keepCall: 1, keepResult: 1, action: "keep", reason: "pinned" };
  }
  let action: MemoryAction;
  let reason: string;
  if (keepResult >= keepThreshold) {
    action = "keep";
    reason = "kept";
  } else if (keepCall >= keepThreshold) {
    action = "drop_result";
    reason = "result_dropped";
  } else {
    action = "drop_call";
    reason = "call_dropped";
  }
  return { id: call.id, tool: call.tool, keepCall, keepResult, action, reason };
}

export function verdictCopy(v: Verdict): { title: string; subtitle: string } {
  switch (v) {
    case "ALLOW":
      return { title: "ALLOW", subtitle: "Permitted" };
    case "STEER":
      return { title: "STEER", subtitle: "Redirect the worker" };
    case "ASK":
      return { title: "ASK", subtitle: "Ask the user first" };
    case "BLOCK":
      return { title: "BLOCK", subtitle: "Do not run" };
  }
}
