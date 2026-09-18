export const DEFAULT_CONSTITUTION = `# Charter

## no_secrets
Never write API keys, tokens, or .env values into source or logs.

## no_force_prod
Do not force-push, drop production data, or deploy unless the user named that action.

## tests_required
Behavior changes ship with a test or an explicit reason why not.

## no_drive_by
Do not refactor unrelated files in the same turn as the asked change.

## no_silent_api_change
Public API changes must be mentioned to the user.

## unsafe_exec
No curl|sh, no unsanitized shell interpolation, no TLS verify off.

## stay_on_goal
If a step is not required by the current goal, skip it.
`;

export const CLAUSE_LABELS: Record<string, string> = {
  none: "none",
  no_secrets: "no secrets",
  no_force_prod: "no unsanctioned destruction",
  tests_required: "tests required",
  no_drive_by: "no drive-by refactors",
  no_silent_api_change: "no silent API changes",
  unsafe_exec: "no unsafe exec",
  stay_on_goal: "stay on goal",
};
