/* Build content: YAML tasks + MD knowledge → src/generated/content.json + knowledge.json */
import fs from 'node:fs';
import path from 'node:path';
import { parse as parseYaml } from 'yaml';
import Ajv from 'ajv';
import addFormats from 'ajv-formats';
import MarkdownIt from 'markdown-it';

const ROOT = path.resolve(process.cwd());
const TASKS_DIR = path.join(ROOT, 'content/tasks');
const KNOWLEDGE_DIR = path.join(ROOT, 'content/knowledge');
const SCHEMA_PATH = path.join(ROOT, 'content/schema/task-schema.json');
const OUT_DIR = path.join(ROOT, 'src/generated');

const POINTS_FOR_DIFF: Record<string, number> = { easy: 1, medium: 3, hard: 7 };

function normalizeText(s: string): string {
  return s.replace(/\s+/g, ' ').trim();
}

function localize(field: any): string {
  if (typeof field === 'string') return field;
  if (field && typeof field === 'object' && 'ru' in field) return field.ru;
  return String(field ?? '');
}

function readYamlTasks(): any[] {
  if (!fs.existsSync(TASKS_DIR)) return [];
  const files = fs.readdirSync(TASKS_DIR).filter(f => f.endsWith('.yaml') || f.endsWith('.yml'));
  return files.map(f => {
    const raw = fs.readFileSync(path.join(TASKS_DIR, f), 'utf8');
    const data = parseYaml(raw);
    data.__file = f;
    return data;
  });
}

function readKnowledge(): Record<string, { title: string; html: string; source: string }> {
  if (!fs.existsSync(KNOWLEDGE_DIR)) return {};
  const md = new MarkdownIt({ html: false, linkify: true, breaks: false });
  const files = fs.readdirSync(KNOWLEDGE_DIR).filter(f => f.endsWith('.md'));
  const out: Record<string, any> = {};
  for (const f of files) {
    const slug = f.replace(/\.md$/, '');
    const src = fs.readFileSync(path.join(KNOWLEDGE_DIR, f), 'utf8');
    const firstLine = src.split('\n').find(l => l.startsWith('# ')) || `# ${slug}`;
    const title = firstLine.replace(/^#\s+/, '').trim();
    out[slug] = { title, html: md.render(src), source: src };
  }
  return out;
}

function buildBankFromTask(t: any): string[] {
  const b = t.inGame.bank || {};
  const prebuilt: string[] = b.prebuilt || [];
  const decoys: string[] = b.decoys || [];
  // bankChips = prebuilt ∪ decoys (ready strings, no atom decomposition)
  return [...prebuilt, ...decoys].map(normalizeText);
}

function verifySolutionsBuildable(task: any, bank: string[]): string[] {
  const errors: string[] = [];
  const bankSet = new Set(bank);
  for (const sol of task.inGame.validSolutions) {
    for (const s of sol.sequence) {
      const variants: string[] = s.acceptableVariants?.length ? s.acceptableVariants : [s.step];
      let anyOk = false;
      for (const variant of variants) {
        if (bankSet.has(normalizeText(variant))) { anyOk = true; break; }
      }
      if (!anyOk) errors.push(`${task.id}: step "${s.step}" not in bank.prebuilt`);
    }
  }
  return errors;
}

function verifySolutionsCommentary(task: any): string[] {
  const errors: string[] = [];
  const labels: string[] = (task.inGame.validSolutions ?? []).map((sol: any) => sol.label ?? '');
  const commentaryLabels: string[] = (task.knowledge?.solutionsCommentary ?? []).map((c: any) => c.solutionLabel ?? '');
  for (const label of labels) {
    if (label && !commentaryLabels.includes(label)) {
      errors.push(`${task.id}: validSolution label "${label}" has no solutionsCommentary entry`);
    }
  }
  return errors;
}

async function main() {
  const ajv = new Ajv({ allErrors: true, strict: false });
  addFormats(ajv);
  const schema = JSON.parse(fs.readFileSync(SCHEMA_PATH, 'utf8'));
  const validate = ajv.compile(schema);

  const rawTasks = readYamlTasks();
  const errors: string[] = [];
  const tasks: any[] = [];
  const idSeen = new Set<string>();

  for (const tRaw of rawTasks) {
    if (!validate(tRaw)) {
      errors.push(`${(tRaw as any).__file}: ${ajv.errorsText(validate.errors)}`);
      continue;
    }
    const t: any = tRaw as any;
    if (idSeen.has(t.id)) errors.push(`${t.__file}: duplicate id ${t.id}`);
    idSeen.add(t.id);

    const expectedPoints = POINTS_FOR_DIFF[t.difficulty];
    if (expectedPoints !== t.points) {
      errors.push(`${t.id}: points ${t.points} doesn't match difficulty ${t.difficulty} (expected ${expectedPoints})`);
    }

    const normalizedTask = {
      id: t.id,
      title: localize(t.title),
      difficulty: t.difficulty,
      points: t.points,
      maxCommands: t.maxCommands,
      inGame: {
        story: localize(t.inGame.story),
        goal: localize(t.inGame.goal),
        initialStateDisplay: t.inGame.initialStateDisplay ?? null,
        bank: t.inGame.bank ?? {},
        bankChips: buildBankFromTask(t),
        validSolutions: t.inGame.validSolutions.map((sol: any) => ({
          kind: sol.kind,
          label: sol.label ?? '',
          sequence: sol.sequence.map((s: any) => ({
            step: normalizeText(s.step),
            acceptableVariants: (s.acceptableVariants ?? [s.step]).map(normalizeText),
          })),
        })),
        forbiddenCommands: t.inGame.forbiddenCommands ?? [],
        pointsModifiers: t.inGame.pointsModifiers ?? { bonuses: [], penalties: [] },
        hints: (t.inGame.hints ?? []).map(localize),
      },
      knowledge: {
        explanation: localize(t.knowledge?.explanation ?? ''),
        solutionsCommentary: (t.knowledge?.solutionsCommentary ?? []).map((s: any) => ({
          solutionLabel: s.solutionLabel,
          commentary: localize(s.commentary),
        })),
        extraPatterns: t.knowledge?.extraPatterns ?? [],
        aliases: t.knowledge?.aliases ?? [],
        relatedKnowledge: t.knowledge?.relatedKnowledge ?? [],
        externalLinks: t.knowledge?.externalLinks ?? [],
      },
    };

    for (const sol of normalizedTask.inGame.validSolutions) {
      if (sol.sequence.length > t.maxCommands) {
        errors.push(`${t.id}: solution "${sol.label}" length ${sol.sequence.length} > maxCommands ${t.maxCommands}`);
      }
    }

    const buildErrors = verifySolutionsBuildable(normalizedTask, normalizedTask.inGame.bankChips);
    errors.push(...buildErrors);

    const commentaryErrors = verifySolutionsCommentary(t);
    errors.push(...commentaryErrors);

    tasks.push(normalizedTask);
  }

  const knowledge = readKnowledge();

  for (const t of tasks) {
    for (const slug of t.knowledge.relatedKnowledge) {
      if (!(slug in knowledge)) {
        errors.push(`${t.id}: relatedKnowledge references missing "${slug}"`);
      }
    }
  }

  if (errors.length) {
    console.error('\n[build-content] VALIDATION FAILED:');
    for (const e of errors) console.error('  -', e);
    process.exit(1);
  }

  tasks.sort((a, b) => a.id.localeCompare(b.id, 'en', { numeric: true }));

  if (!fs.existsSync(OUT_DIR)) fs.mkdirSync(OUT_DIR, { recursive: true });
  fs.writeFileSync(path.join(OUT_DIR, 'content.json'), JSON.stringify({ tasks }, null, 2));
  fs.writeFileSync(path.join(OUT_DIR, 'knowledge.json'), JSON.stringify(knowledge, null, 2));

  console.log(`[build-content] ${tasks.length} tasks, ${Object.keys(knowledge).length} knowledge pages → src/generated/`);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
