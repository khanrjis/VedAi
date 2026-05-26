import { z } from 'zod';

export const questionTypeSchema = z.object({
  type: z.enum(['multipleChoice', 'shortAnswer', 'diagram', 'numerical']),
  label: z.string().min(1),
  count: z.coerce.number().int().min(1).max(100),
  marks: z.coerce.number().int().min(1).max(100),
  difficulty: z.enum(['easy', 'moderate', 'challenging'])
});

export const createAssignmentSchema = z.object({
  title: z.string().min(3, 'Title is required'),
  subject: z.string().min(1, 'Subject is required'),
  className: z.string().min(1, 'Class is required'),
  dueDate: z.string().min(1, 'Due date is required'),
  instructions: z.string().max(5000).optional().default(''),
  sourceText: z.string().max(50000).optional().default(''),
  questionTypes: z.array(questionTypeSchema).min(1, 'Add at least one question type'),
  totalQuestions: z.coerce.number().int().min(1),
  totalMarks: z.coerce.number().int().min(1)
});

export type CreateAssignmentSchema = z.infer<typeof createAssignmentSchema>;