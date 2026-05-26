import { env } from '../config/env.js';
import { openai } from '../config/openai.js';
import type { CreateAssignmentInput } from '../validators/assignment.validator.js';
import { buildQuestionPaperPrompt } from '../prompts/prompt.builder.js';

interface BuildPaperArgs {
  assignment: CreateAssignmentInput;
  fileName?: string;
  extractedText?: string;
  sectionTitle?: string;
}

export const generateQuestionPaperFromAI = async (args: BuildPaperArgs): Promise<{ prompt: string; response: string; model: string }> => {
  const prompt = buildQuestionPaperPrompt(args.assignment, {
    fileName: args.fileName,
    extractedText: args.extractedText
  });

  if (!env.OPENAI_API_KEY) {
    return {
      prompt,
      response: JSON.stringify({
        title: args.assignment.title,
        subject: args.assignment.subject,
        class: args.assignment.className,
        duration: '45 minutes',
        totalMarks: args.assignment.totalMarks,
        sections: args.assignment.questionTypes.map((questionType, index) => ({
          title: `Section ${String.fromCharCode(65 + index)}`,
          instruction: `Answer the ${questionType.label.toLowerCase()} questions carefully.`,
          questions: Array.from({ length: questionType.count }, (_, questionIndex) => ({
            question: `${questionType.label} question ${questionIndex + 1} on ${args.assignment.subject}.`,
            difficulty: questionType.difficulty,
            marks: questionType.marks,
            answer: `Sample answer for ${questionType.label} ${questionIndex + 1}`,
            topic: args.assignment.subject
          }))
        })),
        answerKey: args.assignment.questionTypes.flatMap((questionType, typeIndex) =>
          Array.from({ length: questionType.count }, (_, questionIndex) => ({
            question: `${questionType.label} question ${questionIndex + 1} on ${args.assignment.subject}.`,
            answer: `Sample answer for ${questionType.label} ${questionIndex + 1}`,
            explanation: `This answer matches the expected response for section ${typeIndex + 1}.`
          }))
        )
      }),
      model: 'offline-fallback'
    };
  }

  const completion = await openai.chat.completions.create({
    model: env.OPENAI_MODEL,
    temperature: 0.4,
    response_format: { type: 'json_object' },
    messages: [
      { role: 'system', content: 'You generate strict JSON question papers for school assessments.' },
      { role: 'user', content: prompt }
    ]
  });

  return {
    prompt,
    response: completion.choices[0]?.message?.content ?? '{}',
    model: env.OPENAI_MODEL
  };
};