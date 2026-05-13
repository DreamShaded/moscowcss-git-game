import type { CheckResult } from '@/engine/checker';

interface Props {
  result: CheckResult;
  onClose: () => void;
  onBackToSelect: () => void;
  taskId: string;
}

export function ResultPanel({ result, onClose, onBackToSelect, taskId }: Props) {
  const docsUrl = `#/docs/tasks/${taskId}`;
  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className={`modal result ${result.passed ? 'result--ok' : 'result--fail'}`} onClick={e => e.stopPropagation()}>
        <h3>{result.passed ? '✅ Решено' : '❌ Не засчитано'}</h3>
        <p>{result.reason}</p>

        {result.passed && (
          <div className="result__points">
            <div>База: <b>{result.basePoints}</b></div>
            {result.bonuses.map((b, i) => (
              <div key={`b${i}`} className="result__bonus">+{b.points} — {b.reason}</div>
            ))}
            {result.penalties.map((p, i) => (
              <div key={`p${i}`} className="result__penalty">{p.points} — {p.reason}</div>
            ))}
            <div className="result__total">Итого: <b>{result.totalPoints}</b></div>
          </div>
        )}

        <div className="modal__actions">
          <button className="btn" onClick={onClose}>
            {result.passed ? 'Попробовать снова' : 'Изменить и попробовать'}
          </button>
          <a className="btn btn--ghost" href={docsUrl} target="_blank" rel="noreferrer">Разбор ↗</a>
          <button className="btn btn--primary" onClick={onBackToSelect}>К выбору задач</button>
        </div>
      </div>
    </div>
  );
}
