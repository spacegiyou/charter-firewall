export type HookKind = "action" | "write" | "turn" | "memory";

export type Verdict = "ALLOW" | "STEER" | "ASK" | "BLOCK";

export type ToolName = "bash" | "write" | "edit" | "apply_patch" | "read";

export type BlastLevel = 0 | 1 | 2 | 3;

export interface ToolCall {
  name: ToolName;
  input: Record<string, string>;
  targetPaths: string[];
}

export interface RepoState {
  branch: string;
  dirtyFiles: string[];
  protectedBranch: boolean;
}

export interface ActionAnswers {
  injection: number;
  exfiltration: number;
  credentials: number;
  irreversible: number;
  scopeCreep: number;
  effectOutsideTree: number;
  userAuthorized: number;
  blastRadius: number;
}

export interface WriteAnswers {
  ruleViolation: number;
  violatedClause: string;
  slop: number;
  unverifiedClaim: number;
}

export interface TurnAnswers {
  implementationComplete: number;
  testsSufficient: number;
  workerStuck: number;
  workOffTrack: number;
  doneClaimUnverified: number;
  needsHuman: number;
  readyToFinish: number;
}

export interface MemoryCall {
  id: string;
  tool: string;
  inputPreview: string;
  resultPreview: string;
  resultChars: number;
  isError: boolean;
  pinned: boolean;
}

export type MemoryAction = "keep" | "drop_result" | "drop_call";

export interface MemoryDecision {
  id: string;
  tool: string;
  keepCall: number;
  keepResult: number;
  action: MemoryAction;
  reason: string;
}

export interface PolicyTrace {
  rule: string;
  fired: boolean;
}

export interface Decision {
  verdict: Verdict;
  reason: string;
  traces: PolicyTrace[];
  mechanical: boolean;
}

export interface JudgmentRecord {
  id: string;
  at: number;
  hook: HookKind;
  title: string;
  verdict: Verdict;
  reason: string;
  mechanical: boolean;
}

export interface Scenario {
  id: string;
  hook: HookKind;
  title: string;
  blurb: string;
  goal: string;
  userExplicitlyAsked: boolean;
  repo: RepoState;
  tool?: ToolCall;
  writeDiff?: string;
  assistantClaim?: string;
  testsPassed?: boolean;
  recentFailures?: string[];
  memoryCalls?: MemoryCall[];
}
