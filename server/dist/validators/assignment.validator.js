import { z } from 'zod';
const questionTypeSchema = z.object({
    type: z.enum(['multipleChoice', 'shortAnswer', 'diagram', 'numerical']),
    label: z.string().min(1),
    count: z.coerce.number().int().min(1).max(100),
    marks: z.coerce.number().int().min(1).max(100),
    difficulty: z.enum(['easy', 'moderate', 'challenging'])
});
export const createAssignmentSchema = z.object({
    title: z.string().min(3).max(160),
    subject: z.string().min(1).max(120),
    className: z.string().min(1).max(50),
    dueDate: z.string().datetime().or(z.string().date()),
    instructions: z.string().max(5000).optional().default(''),
    sourceText: z.string().max(50000).optional().default(''),
    questionTypes: z.array(questionTypeSchema).min(1),
    totalQuestions: z.coerce.number().int().min(1).max(500),
    totalMarks: z.coerce.number().int().min(1).max(5000)
});
export const listAssignmentsQuerySchema = z.object({
    search: z.string().optional(),
    status: z.enum(['draft', 'queued', 'processing', 'completed', 'failed']).optional(),
    page: z.coerce.number().int().min(1).optional().default(1),
    limit: z.coerce.number().int().min(1).max(100).optional().default(12)
});
export const assignmentIdSchema = z.object({
    id: z.string().min(1)
});
