export type Difficulty = 'easy' | 'medium' | 'hard';
export type SolutionKind = 'ideal' | 'standard' | 'long';

export interface SolutionStep {
  step: string;
  acceptableVariants: string[];
}

export interface ValidSolution {
  kind: SolutionKind;
  label: string;
  sequence: SolutionStep[];
}

export interface Modifier {
  condition: {
    type: 'usesCommand' | 'usesFlag' | 'usesArg' | 'avoidsCommand' | 'lengthAtMost';
    command?: string;
    flag?: string;
    arg?: string;
    length?: number;
  };
  points: number;
  reason: string;
}

export interface Task {
  id: string;
  title: string;
  difficulty: Difficulty;
  points: number;
  maxCommands: number;
  inGame: {
    story: string;
    goal: string;
    initialStateDisplay: any;
    bank: any;
    bankChips: string[];
    validSolutions: ValidSolution[];
    forbiddenCommands: string[];
    pointsModifiers: { bonuses: Modifier[]; penalties: Modifier[] };
    hints: string[];
  };
  knowledge: {
    explanation: string;
    solutionsCommentary: { solutionLabel: string; commentary: string }[];
    extraPatterns: any[];
    aliases: any[];
    relatedKnowledge: string[];
    externalLinks: { title: string; url: string }[];
  };
}

export interface ContentJson {
  tasks: Task[];
}

export interface KnowledgePage {
  title: string;
  html: string;
  source: string;
}

export type KnowledgeJson = Record<string, KnowledgePage>;
