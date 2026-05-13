import { Routes, Route, Navigate } from 'react-router-dom';
import { SessionProvider } from './session-context';
import { TaskSelectPage } from '../pages/task-select-page';
import { TaskPlayPage } from '../pages/task-play-page';
import { DocsIndexPage } from '../pages/docs-index-page';
import { DocsTaskPage } from '../pages/docs-task-page';
import { DocsKnowledgePage } from '../pages/docs-knowledge-page';

export function App() {
  return (
    <SessionProvider>
      <Routes>
        <Route path="/" element={<TaskSelectPage />} />
        <Route path="/task/:id" element={<TaskPlayPage />} />
        <Route path="/docs" element={<DocsIndexPage />} />
        <Route path="/docs/tasks/:id" element={<DocsTaskPage />} />
        <Route path="/docs/knowledge/:slug" element={<DocsKnowledgePage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </SessionProvider>
  );
}
