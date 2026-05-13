const STORAGE_KEY = 'crs.v1.state';

export type TaskStatus = 'unsolved' | 'solved' | 'solvedWithHint';

export interface TaskProgress {
  status: TaskStatus;
  points: number;
  timeMs: number;
  hintsUsed: number;
  idkOpened: boolean;
}

export interface SessionState {
  tasks: Record<string, TaskProgress>;
}

function emptyTaskProgress(): TaskProgress {
  return { status: 'unsolved', points: 0, timeMs: 0, hintsUsed: 0, idkOpened: false };
}

export function loadSession(): SessionState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { tasks: {} };
    return JSON.parse(raw);
  } catch {
    return { tasks: {} };
  }
}

export function saveSession(s: SessionState): void {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(s)); } catch { /* ignore */ }
}

export function resetSession(): SessionState {
  const s: SessionState = { tasks: {} };
  saveSession(s);
  return s;
}

export function getProgress(s: SessionState, taskId: string): TaskProgress {
  return s.tasks[taskId] ?? emptyTaskProgress();
}

export function setProgress(s: SessionState, taskId: string, p: TaskProgress): SessionState {
  const next: SessionState = { ...s, tasks: { ...s.tasks, [taskId]: p } };
  saveSession(next);
  return next;
}

export function totalPoints(s: SessionState): number {
  return Object.values(s.tasks).reduce((acc, p) => acc + (p.status === 'solved' ? p.points : 0), 0);
}
