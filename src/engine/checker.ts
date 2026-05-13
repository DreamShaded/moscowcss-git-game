import { normalizeStep, stepIncludes } from './normalize';
import type { Modifier, Task, ValidSolution } from './content-types';

export interface CheckResult {
  passed: boolean;
  matchedSolution: ValidSolution | null;
  forbiddenHit: string | null;
  tooLong: boolean;
  reason: string;
  basePoints: number;
  bonuses: { reason: string; points: number }[];
  penalties: { reason: string; points: number }[];
  totalPoints: number;
}

function stepContainsCommand(step: string, command: string): boolean {
  const s = normalizeStep(step);
  const c = normalizeStep(command);
  return s === c || s.startsWith(c + ' ');
}

function evaluateModifier(m: Modifier, user: string[], matchedKind?: string): boolean {
  const cond = m.condition;
  switch (cond.type) {
    case 'usesCommand':
      return cond.command ? user.some(s => stepContainsCommand(s, cond.command!)) : false;
    case 'usesFlag':
      return cond.flag ? user.some(s => stepIncludes(s, cond.flag!)) : false;
    case 'usesArg':
      return cond.arg ? user.some(s => stepIncludes(s, cond.arg!)) : false;
    case 'usesAnyOf':
      return (cond.commands ?? []).some(cmd => user.some(s => normalizeStep(s) === normalizeStep(cmd)));
    case 'avoidsCommand':
      return cond.command ? !user.some(s => stepContainsCommand(s, cond.command!)) : false;
    case 'sequenceLengthAtMost':
      return typeof cond.length === 'number' ? user.length <= cond.length : false;
    case 'matchesSolutionKind':
      return cond.kind ? matchedKind === cond.kind : false;
    default:
      return false;
  }
}

function matchSolution(user: string[], sol: ValidSolution): boolean {
  if (user.length !== sol.sequence.length) return false;
  return sol.sequence.every((s, i) => s.acceptableVariants.includes(user[i]));
}

export function checkSolution(task: Task, raw: string[]): CheckResult {
  const user = raw.map(normalizeStep).filter(Boolean);

  if (user.length > task.maxCommands) {
    return {
      passed: false,
      matchedSolution: null,
      forbiddenHit: null,
      tooLong: true,
      reason: `Превышен лимит команд (${task.maxCommands}).`,
      basePoints: 0,
      bonuses: [],
      penalties: [],
      totalPoints: 0,
    };
  }

  for (const forbidden of task.inGame.forbiddenCommands) {
    const f = normalizeStep(forbidden);
    const hit = user.find(s => s === f || s.startsWith(f + ' '));
    if (hit) {
      return {
        passed: false,
        matchedSolution: null,
        forbiddenHit: forbidden,
        tooLong: false,
        reason: `Использована запрещённая команда: ${forbidden}`,
        basePoints: 0,
        bonuses: [],
        penalties: [],
        totalPoints: 0,
      };
    }
  }

  let matched: ValidSolution | null = null;
  for (const sol of task.inGame.validSolutions) {
    if (matchSolution(user, sol)) { matched = sol; break; }
  }

  if (!matched) {
    return {
      passed: false,
      matchedSolution: null,
      forbiddenHit: null,
      tooLong: false,
      reason: 'Последовательность не совпадает ни с одним из допустимых решений.',
      basePoints: 0,
      bonuses: [],
      penalties: [],
      totalPoints: 0,
    };
  }

  const base = task.points;
  const bonusesApplied: { reason: string; points: number }[] = [];
  const penaltiesApplied: { reason: string; points: number }[] = [];

  for (const m of task.inGame.pointsModifiers?.bonuses ?? []) {
    if (evaluateModifier(m, user, matched.kind)) bonusesApplied.push({ reason: m.reason, points: m.points });
  }
  for (const m of task.inGame.pointsModifiers?.penalties ?? []) {
    if (evaluateModifier(m, user, matched.kind)) penaltiesApplied.push({ reason: m.reason, points: m.points });
  }

  const total =
    base +
    bonusesApplied.reduce((a, b) => a + b.points, 0) +
    penaltiesApplied.reduce((a, b) => a + b.points, 0);

  return {
    passed: true,
    matchedSolution: matched,
    forbiddenHit: null,
    tooLong: false,
    reason: `Решение засчитано (${matched.kind}${matched.label ? `: ${matched.label}` : ''}).`,
    basePoints: base,
    bonuses: bonusesApplied,
    penalties: penaltiesApplied,
    totalPoints: Math.max(0, total),
  };
}
