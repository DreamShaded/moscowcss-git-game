import { Link, useParams } from 'react-router-dom';
import { getTask } from '@/engine/content-loader';

export function DocsTaskPage() {
  const { id } = useParams();
  const task = id ? getTask(id) : undefined;
  if (!task) return <div className="screen"><p>Задача {id} не найдена.</p></div>;

  return (
    <div className="screen screen--docs">
      <header className="topbar">
        <Link to="/docs" className="btn btn--ghost">← Все задачи</Link>
        <h1 className="topbar__title">{task.id}. {task.title}</h1>
      </header>
      <main className="docs-main docs-task">
        <p className="docs-meta">
          <b>Сложность:</b> {task.difficulty} ·{' '}
          <b>Очки:</b> {task.points} ·{' '}
          <b>Лимит команд:</b> {task.maxCommands}
        </p>

        <h2>Сюжет</h2>
        <pre className="story-text">{task.inGame.story}</pre>

        <h2>Цель</h2>
        <p>{task.inGame.goal}</p>

        {task.knowledge.explanation && (<>
          <h2>Подвох / объяснение</h2>
          <pre className="story-text">{task.knowledge.explanation}</pre>
        </>)}

        <h2>Решения</h2>
        {task.inGame.validSolutions.map((sol, i) => {
          const commentary = task.knowledge.solutionsCommentary.find(c => c.solutionLabel === sol.label)?.commentary;
          return (
            <section className="docs-solution" key={i}>
              <h3>{sol.kind.toUpperCase()}{sol.label && ` — ${sol.label}`}</h3>
              <ol>
                {sol.sequence.map((s, j) => <li key={j}><code>{s.step}</code></li>)}
              </ol>
              {commentary && <pre className="story-text">{commentary}</pre>}
            </section>
          );
        })}

        {task.knowledge.aliases.length > 0 && (
          <section>
            <h2>Алиасы и короткие формы</h2>
            <ul>
              {task.knowledge.aliases.map((a: any, i: number) => (
                <li key={i}><code>{a.from}</code> → <code>{a.to}</code>{a.note ? ` — ${a.note}` : ''}</li>
              ))}
            </ul>
          </section>
        )}

        {task.knowledge.relatedKnowledge.length > 0 && (
          <section>
            <h2>Связанные темы</h2>
            <ul>
              {task.knowledge.relatedKnowledge.map(slug => (
                <li key={slug}><Link to={`/docs/knowledge/${slug}`}>{slug}</Link></li>
              ))}
            </ul>
          </section>
        )}

        {task.knowledge.externalLinks.length > 0 && (
          <section>
            <h2>Внешние ссылки</h2>
            <ul>
              {task.knowledge.externalLinks.map((l, i) => (
                <li key={i}><a href={l.url} target="_blank" rel="noreferrer">{l.title}</a></li>
              ))}
            </ul>
          </section>
        )}
      </main>
    </div>
  );
}
