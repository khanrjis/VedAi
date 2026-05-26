import { Worker } from 'bullmq';
import { redisConnection } from '../config/redis.js';
import { ASSIGNMENT_QUEUE } from '../queue/assignment.queue.js';
import { Assignment } from '../models/Assignment.js';
import { JobStatus } from '../models/JobStatus.js';
import { generateQuestionPaperFromAI } from '../services/ai.service.js';
import { parseGeneratedPaperResponse } from '../parsers/ai-response.parser.js';
import { createGeneratedPaperForAssignment } from '../services/assignment.service.js';
import { emitToAssignment } from '../sockets/index.js';
import { pdfQueue } from '../queue/pdf.queue.js';
let socketServer = null;
export const setAssignmentWorkerSocket = (io) => {
    socketServer = io;
};
export const startAssignmentWorker = () => {
    return new Worker(ASSIGNMENT_QUEUE, async (job) => {
        const { assignmentId } = job.data;
        const assignment = await Assignment.findById(assignmentId).lean();
        if (!assignment) {
            throw new Error('Assignment not found');
        }
        emitToAssignment(socketServer, assignmentId, 'generation_started', { assignmentId, message: 'Generation started' });
        await JobStatus.findOneAndUpdate({ jobId: job.id?.toString() }, { status: 'active', progress: 10, message: 'Building prompt' }, { upsert: true });
        const aiResult = await generateQuestionPaperFromAI({
            assignment: {
                title: assignment.title,
                subject: assignment.subject,
                className: assignment.className,
                dueDate: assignment.dueDate.toISOString(),
                instructions: assignment.instructions,
                sourceText: assignment.sourceText,
                totalQuestions: assignment.totalQuestions,
                totalMarks: assignment.totalMarks,
                questionTypes: assignment.questionTypes
            },
            fileName: assignment.uploadedFileName,
            extractedText: assignment.sourceText
        });
        emitToAssignment(socketServer, assignmentId, 'generation_progress', { assignmentId, progress: 55, message: 'AI response received' });
        await JobStatus.findOneAndUpdate({ jobId: job.id?.toString() }, { progress: 55, message: 'Parsing AI response' });
        const parsed = parseGeneratedPaperResponse(aiResult.response);
        const paperId = await createGeneratedPaperForAssignment(assignmentId, {
            title: parsed.title,
            subject: parsed.subject,
            className: parsed.class,
            duration: parsed.duration,
            totalMarks: parsed.totalMarks,
            sections: parsed.sections,
            answerKey: parsed.answerKey,
            generationPrompt: aiResult.prompt,
            model: aiResult.model
        });
        emitToAssignment(socketServer, assignmentId, 'generation_completed', { assignmentId, paperId, message: 'Generation completed' });
        await JobStatus.findOneAndUpdate({ jobId: job.id?.toString() }, { status: 'completed', progress: 100, message: 'Generation completed', metadata: { paperId } });
        await pdfQueue.add('generate-pdf', { paperId }, { attempts: 3, backoff: { type: 'exponential', delay: 1500 } });
        return { paperId };
    }, { connection: redisConnection });
};
