import { z } from 'zod';
import { AppError } from '../utils/AppError.js';
export const generatedPaperResponseSchema = z.object({
    title: z.string().min(1),
    subject: z.string().min(1),
    class: z.string().min(1),
    duration: z.string().min(1),
    totalMarks: z.number().int().nonnegative(),
    sections: z.array(z.object({
        title: z.string().min(1),
        instruction: z.string().min(1),
        questions: z.array(z.object({
            question: z.string().min(1),
            difficulty: z.enum(['easy', 'moderate', 'challenging']),
            marks: z.number().int().positive(),
            answer: z.string().optional(),
            topic: z.string().optional()
        }))
    })),
    answerKey: z.array(z.object({
        question: z.string().min(1),
        answer: z.string().min(1),
        explanation: z.string().optional()
    }))
});
export const parseGeneratedPaperResponse = (rawResponse) => {
    const normalized = rawResponse
        .replace(/```json/gi, '```')
        .replace(/```/g, '')
        .trim();
    const parsedJson = JSON.parse(normalized);
    const validated = generatedPaperResponseSchema.safeParse(parsedJson);
    if (!validated.success) {
        throw new AppError('AI response failed validation', 502, validated.error.flatten());
    }
    return validated.data;
};
