export type QuestionDifficulty = 'easy' | 'moderate' | 'challenging';

export type QuestionTypeKey = 'multipleChoice' | 'shortAnswer' | 'diagram' | 'numerical';

export interface QuestionTypeConfig {
  type: QuestionTypeKey;
  label: string;
  count: number;
  marks: number;
  difficulty: QuestionDifficulty;
}

export interface GeneratedQuestion {
  question: string;
  difficulty: QuestionDifficulty;
  marks: number;
  answer?: string;
  topic?: string;
}

export interface GeneratedSection {
  title: string;
  instruction: string;
  questions: GeneratedQuestion[];
}

export interface GeneratedPaperShape {
  title: string;
  subject: string;
  class: string;
  duration: string;
  totalMarks: number;
  sections: GeneratedSection[];
  answerKey: Array<{
    question: string;
    answer: string;
    explanation?: string;
  }>;
}