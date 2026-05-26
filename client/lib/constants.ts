import type { QuestionTypeConfig } from '@/types';

export const NAV_ITEMS = [
  { label: 'Home', href: '/', icon: 'layout-grid' },
  { label: 'My Groups', href: '/groups', icon: 'users' },
  { label: 'Assignments', href: '/assignments', icon: 'clipboard-list' },
  { label: "AI Teacher's Toolkit", href: '/toolkit', icon: 'sparkles' },
  { label: 'My Library', href: '/library', icon: 'book-open' }
] as const;

export const QUESTION_TYPE_OPTIONS: Array<QuestionTypeConfig & { description: string }> = [
  { type: 'multipleChoice', label: 'Multiple Choice Questions', count: 4, marks: 1, difficulty: 'easy', description: 'Objective recall and concept checks' },
  { type: 'shortAnswer', label: 'Short Questions', count: 3, marks: 2, difficulty: 'moderate', description: 'Concise explanation-based responses' },
  { type: 'diagram', label: 'Diagram/Graph-Based Questions', count: 5, marks: 5, difficulty: 'challenging', description: 'Visual interpretation and reasoning' },
  { type: 'numerical', label: 'Numerical Problems', count: 5, marks: 5, difficulty: 'challenging', description: 'Structured problem-solving' }
];

export const DEFAULT_QUESTION_TYPES: QuestionTypeConfig[] = QUESTION_TYPE_OPTIONS.map(({ description, ...questionType }) => questionType);