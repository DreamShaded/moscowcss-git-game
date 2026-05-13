import { Link, useParams } from 'react-router-dom';
import { getKnowledgePage } from '@/engine/content-loader';

export function DocsKnowledgePage() {
  const { slug } = useParams();
  const page = slug ? getKnowledgePage(slug) : undefined;
  if (!page) return <div className="screen"><p>Страница {slug} не найдена.</p></div>;

  return (
    <div className="screen screen--docs">
      <header className="topbar">
        <Link to="/docs" className="btn btn--ghost">← В индекс</Link>
        <h1 className="topbar__title">{page.title}</h1>
      </header>
      <main className="docs-main docs-knowledge">
        <article dangerouslySetInnerHTML={{ __html: page.html }} />
      </main>
    </div>
  );
}
