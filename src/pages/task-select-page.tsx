import { Link } from 'react-router-dom';
import { useState } from 'react';
import { tasksByDifficulty } from '@/engine/content-loader';
import { useSession } from '@/app/session-context';
import type { Difficulty, Task } from '@/engine/content-types';

const GROUPS: { difficulty: Difficulty; label: string; emoji: string }[] = [
  { difficulty: 'easy',   label: 'Лёгкие · 1 балл',   emoji: '🟢' },
  { difficulty: 'medium', label: 'Средние · 3 балла', emoji: '🟡' },
  { difficulty: 'hard',   label: 'Сложные · 7 баллов', emoji: '🔴' },
];

function formatTime(ms: number): string {
  if (!ms) return '—';
  const total = Math.floor(ms / 1000);
  const m = Math.floor(total / 60);
  const s = total % 60;
  return `${m}:${s.toString().padStart(2, '0')}`;
}

function TaskCard({ t }: { t: Task }) {
  const { getTaskProgress } = useSession();
  const p = getTaskProgress(t.id);
  const icon =
    p.status === 'solved'         ? '✅' :
    p.status === 'solvedWithHint' ? '💡' : '⬜';
  const pts = p.status === 'unsolved' ? '—' : `${p.points} балл${p.points === 1 ? '' : 'ов'}`;
  return (
    <Link className="task-card" to={`/task/${t.id}`} title={t.title}>
      <div className="task-card__id">{t.id}</div>
      <div className="task-card__icon">{icon}</div>
      <div className="task-card__pts">{pts}</div>
      <div className="task-card__time">{formatTime(p.timeMs)}</div>
      <div className="task-card__title">{t.title}</div>
    </Link>
  );
}

export function TaskSelectPage() {
  const { totalPoints, resetAll } = useSession();
  const [confirmReset, setConfirmReset] = useState(false);

  return (
    <div className="screen screen--select">
      <header className="topbar">
        <h1 className="topbar__title">CSS Rescue Squad</h1>
        <div className="topbar__right">
          <span className="topbar__points">⭐ {totalPoints}/20</span>
          <Link className="btn btn--ghost" to="/docs">Документация ↗</Link>
          <button className="btn btn--danger" onClick={() => setConfirmReset(true)}>Заново</button>
        </div>
      </header>

      <main className="select-grid">
        {GROUPS.map(g => {
          const tasks = tasksByDifficulty(g.difficulty);
          return (
            <section key={g.difficulty} className="select-group">
              <h2 className="select-group__title">{g.emoji} {g.label}</h2>
              <div className="select-group__cards">
                {tasks.map(t => <TaskCard key={t.id} t={t} />)}
              </div>
            </section>
          );
        })}
      </main>

      {confirmReset && (
        <div className="modal-backdrop" onClick={() => setConfirmReset(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <h3>Сбросить сессию?</h3>
            <p>Все задачи станут нерешёнными, очки обнулятся. Прогресс не вернуть.</p>
            <div className="modal__actions">
              <button className="btn" onClick={() => setConfirmReset(false)}>Отмена</button>
              <button className="btn btn--danger" onClick={() => { resetAll(); setConfirmReset(false); }}>Сбросить</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
