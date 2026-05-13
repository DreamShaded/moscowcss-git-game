import { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { DndContext, type DragEndEvent, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { getTask } from '@/engine/content-loader';
import { useSession } from '@/app/session-context';
import { checkSolution, type CheckResult } from '@/engine/checker';
import { CommandChip } from '@/components/command-chip';
import { SlotZone } from '@/components/slot-zone';
import { ResultPanel } from '@/components/result-panel';

function formatTime(ms: number): string {
  const s = Math.floor(ms / 1000);
  return `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, '0')}`;
}

export function TaskPlayPage() {
  const { id } = useParams();
  const nav = useNavigate();
  const task = id ? getTask(id) : undefined;
  const { getTaskProgress, updateTaskProgress } = useSession();
  const progress = task ? getTaskProgress(task.id) : null;

  const [slots, setSlots] = useState<(string | null)[]>([]);
  const [hintIdx, setHintIdx] = useState<number>(-1);
  const [result, setResult] = useState<CheckResult | null>(null);
  const [elapsedMs, setElapsedMs] = useState(0);
  const startedAtRef = useRef<number | null>(null);
  const frozenRef = useRef(false);
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }));

  useEffect(() => {
    if (task) setSlots(Array(task.maxCommands).fill(null));
  }, [task?.id]);

  useEffect(() => {
    if (!startedAtRef.current || frozenRef.current) return;
    const t = setInterval(() => {
      setElapsedMs(Date.now() - (startedAtRef.current ?? Date.now()));
    }, 250);
    return () => clearInterval(t);
  }, [startedAtRef.current, frozenRef.current]);

  if (!task) {
    return (
      <div className="screen">
        <p>Задача не найдена. <Link to="/">К выбору</Link></p>
      </div>
    );
  }

  const startTimerIfNeeded = () => {
    if (!startedAtRef.current) startedAtRef.current = Date.now();
  };

  const fillFirstEmpty = (label: string) => {
    startTimerIfNeeded();
    setSlots(s => {
      const next = [...s];
      const i = next.findIndex(x => x === null);
      if (i >= 0) next[i] = label;
      return next;
    });
  };

  const clearSlot = (idx: number) => {
    setSlots(s => {
      const next = [...s];
      next[idx] = null;
      return next;
    });
  };

  const handleDragEnd = (e: DragEndEvent) => {
    if (!e.over) return;
    const overData = e.over.data.current as { slotIndex?: number } | undefined;
    if (overData?.slotIndex === undefined) return;
    const dragData = e.active.data.current as { origin?: 'bank' | 'slot'; label?: string } | undefined;
    if (!dragData?.label) return;
    startTimerIfNeeded();
    setSlots(s => {
      const next = [...s];
      if (dragData.origin === 'slot') {
        const fromMatch = /^slot-chip-(\d+)$/.exec(String(e.active.id));
        if (fromMatch) {
          const from = Number(fromMatch[1]);
          const tmp = next[overData.slotIndex!];
          next[overData.slotIndex!] = next[from];
          next[from] = tmp;
        }
      } else {
        next[overData.slotIndex!] = dragData.label!;
      }
      return next;
    });
  };

  const reset = () => {
    setSlots(Array(task.maxCommands).fill(null));
    setHintIdx(-1);
    setResult(null);
    startedAtRef.current = null;
    frozenRef.current = false;
    setElapsedMs(0);
  };

  const useHint = () => {
    frozenRef.current = true;
    setHintIdx(i => Math.min(i + 1, task.inGame.hints.length - 1));
  };

  const openIdk = () => {
    frozenRef.current = true;
    const next = { ...(progress!), status: 'solvedWithHint' as const, idkOpened: true, timeMs: elapsedMs };
    updateTaskProgress(task.id, next);
    window.open(`#/docs/tasks/${task.id}`, '_blank');
  };

  const submit = () => {
    const userSeq = slots.filter((s): s is string => Boolean(s));
    const r = checkSolution(task, userSeq);
    setResult(r);
    if (r.passed) {
      frozenRef.current = true;
      const halved = progress?.hintsUsed && progress.hintsUsed > 0;
      const finalPts = halved ? Math.floor(r.totalPoints / 2) : r.totalPoints;
      updateTaskProgress(task.id, {
        status: progress?.idkOpened ? 'solvedWithHint' : (halved ? 'solvedWithHint' : 'solved'),
        points: progress?.idkOpened ? 0 : finalPts,
        timeMs: elapsedMs,
        hintsUsed: progress?.hintsUsed ?? 0,
        idkOpened: progress?.idkOpened ?? false,
      });
    }
  };

  const filled = slots.filter(Boolean).length;
  const canRun = filled > 0;

  return (
    <div className="screen screen--play">
      <header className="topbar">
        <Link to="/" className="btn btn--ghost">← К выбору</Link>
        <h1 className="topbar__title">{task.id}. {task.title}</h1>
        <div className="topbar__right">
          <span className="topbar__points">⭐ {task.points}</span>
          <span className="topbar__timer">⏱ {formatTime(elapsedMs)}</span>
        </div>
      </header>

      <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
        <main className="play-grid">
          <aside className="play-story">
            <h2>Сюжет</h2>
            <pre className="story-text">{task.inGame.story}</pre>
            <h3>Цель</h3>
            <p>{task.inGame.goal}</p>
            {task.inGame.initialStateDisplay && (
              <>
                <h3>Начальное состояние</h3>
                <pre className="repo-snapshot">{JSON.stringify(task.inGame.initialStateDisplay, null, 2)}</pre>
              </>
            )}
            {hintIdx >= 0 && (
              <div className="hint">
                💡 <b>Подсказка {hintIdx + 1}/{task.inGame.hints.length}:</b> {task.inGame.hints[hintIdx]}
              </div>
            )}
          </aside>

          <section className="play-board">
            <h2>Последовательность</h2>
            <div className="slots">
              {slots.map((v, i) => (
                <SlotZone key={i} index={i} value={v} onClear={() => clearSlot(i)} />
              ))}
            </div>

            <h2>Банк команд</h2>
            <div className="bank">
              {task.inGame.bankChips.map((c, i) => (
                <CommandChip key={`b-${i}-${c}`} id={`bank-${i}`} label={c} origin="bank" onClick={() => fillFirstEmpty(c)} />
              ))}
            </div>

            <div className="play-actions">
              <button className="btn btn--primary" onClick={submit} disabled={!canRun}>Запустить</button>
              <button className="btn" onClick={reset}>Заново</button>
              <button className="btn" onClick={useHint} disabled={hintIdx >= task.inGame.hints.length - 1}>Подсказка</button>
              <button className="btn btn--ghost" onClick={openIdk}>Не знаю ↗</button>
            </div>
          </section>
        </main>
      </DndContext>

      {result && (
        <ResultPanel
          result={result}
          taskId={task.id}
          onClose={() => {
            const passed = result.passed;
            setResult(null);
            if (passed) reset();
          }}
          onBackToSelect={() => nav('/')}
        />
      )}
    </div>
  );
}
