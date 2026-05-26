export type QuestionDifficulty = 'easy' | 'moderate' | 'challenging';

export type QuestionTypeKey = 'multipleChoice' | 'shortAnswer' | 'diagram' | 'numerical';

export interface QuestionTypeConfig {
  type: QuestionTypeKey;
  label: string;
  count: number;
  marks: number;
  difficulty: QuestionDifficulty;
}

export interface AssignmentQuestionType extends QuestionTypeConfig {}

export interface AssignmentSummary {
  _id: string;
  title: string;
  subject: string;
  className: string;
  dueDate: string;
  instructions?: string;
  status: 'draft' | 'queued' | 'processing' | 'completed' | 'failed';
  totalQuestions: number;
  totalMarks: number;
  createdAt: string;
  updatedAt: string;
  generatedPaperId?: string | GeneratedPaperSummary | null;
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

export interface GeneratedPaperSummary {
  _id: string;
  assignment: string;
  title: string;
  subject: string;
  className: string;
  duration: string;
  totalMarks: number;
  sections: GeneratedSection[];
  answerKey: Array<{
    question: string;
    answer: string;
    explanation?: string;
  }>;
  pdfPath?: string;
  pdfUrl?: string;
  status: 'processing' | 'completed' | 'failed';
  createdAt: string;
  updatedAt: string;
}

export interface CreateAssignmentFormValues {
  title: string;
  subject: string;
  className: string;
  dueDate: string;
  instructions: string;
  sourceText: string;
  questionTypes: QuestionTypeConfig[];
  totalQuestions: number;
  totalMarks: number;
  file?: FileList | null;
}

export interface AssignmentsListResponse {
  items: AssignmentSummary[];
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface ApiEnvelope<T> {
  data: T;
}

export type SocketStatus = 'disconnected' | 'connecting' | 'connected';