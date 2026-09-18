import type { ToolCall } from "./types";

export function mechanicalDeny(tool: ToolCall | undefined): string | null {
  if (!tool) return null;
  const blob = [tool.name, JSON.stringify(tool.input), tool.targetPaths.join(" ")].join("\n").toLowerCase();
  const command = (tool.input.command ?? tool.input.content ?? "").toLowerCase();

  if (
    /rm\s+-[a-z]*r[a-z]*f[a-z]*\s+(\/|~|\/\*|\$home)/.test(command) ||
    /rm\s+-[a-z]*f[a-z]*r[a-z]*\s+(\/|~|\/\*|\$home)/.test(command)
  ) {
    return "Mechanical cut: recursive delete of / or home";
  }
  if (
    /git\s+push/.test(command) &&
    /(--force|--force-with-lease|\s-f(\s|$))/.test(command) &&
    /(origin\s+)?(main|master)\b/.test(command)
  ) {
    return "Mechanical cut: force-push to a protected branch";
  }
  if (/(curl|wget).+\|\s*(ba)?sh/.test(command) || /(curl|wget).+\|\s*bash/.test(blob)) {
    return "Mechanical cut: remote script piped to a shell";
  }
  if (/chmod\s+777/.test(command)) {
    return "Mechanical cut: world-writable permissions";
  }
  return null;
}

export function commandLooksAuthorized(goal: string, command: string): boolean {
  const g = goal.toLowerCase();
  const c = command.toLowerCase();
  return /drop|delete|force.?push|production/.test(g) && /drop|rm |git push|deploy/.test(c);
}
