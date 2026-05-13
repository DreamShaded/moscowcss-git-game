import contentJson from '@generated/content.json';
import knowledgeJson from '@generated/knowledge.json';
import type { ContentJson, KnowledgeJson, Task } from './content-types';

const content = contentJson as ContentJson;
const knowledge = knowledgeJson as KnowledgeJson;

export function allTasks(): Task[] {
  return content.tasks;
}

export function tasksByDifficulty(difficulty: 'easy' | 'medium' | 'hard'): Task[] {
  return content.tasks.filter(t => t.difficulty === difficulty);
}

export function getTask(id: string): Task | undefined {
  return content.tasks.find(t => t.id === id);
}

export function getKnowledgePage(slug: string) {
  return knowledge[slug];
}

export function allKnowledge(): KnowledgeJson {
  return knowledge;
}
