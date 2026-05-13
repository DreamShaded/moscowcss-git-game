import { Link } from 'react-router-dom';
import { allTasks, allKnowledge } from '@/engine/content-loader';

export function DocsIndexPage() {
  const tasks = allTasks();
  const knowledge = allKnowledge();
  const slugs = Object.keys(knowledge).sort();
  return (
    <div className="screen screen--docs">
      <header className="topbar">
        <Link to="/" className="btn btn--ghost">← К игре</Link>
        <h1 className="topbar__title">Документация CSS Rescue Squad</h1>
      </header>
      <main className="docs-main">
        <section>
          <h2>Задачи</h2>
          <ul className="docs-list">
            {tasks.map(t => (
              <li key={t.id}>
                <Link to={`/docs/tasks/${t.id}`}>{t.id}. {t.title}</Link>
                <span className="docs-list__meta"> · {t.difficulty} · {t.points} балл{t.points === 1 ? '' : 'ов'}</span>
              </li>
            ))}
          </ul>
        </section>
        <section>
          <h2>База знаний</h2>
          <ul className="docs-list">
            {slugs.map(slug => (
              <li key={slug}>
                <Link to={`/docs/knowledge/${slug}`}>{knowledge[slug].title}</Link>
              </li>
            ))}
          </ul>
        </section>
      </main>
    </div>
  );
}
