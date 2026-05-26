import path from 'node:path';
import { Types } from 'mongoose';
import { Assignment } from '../models/Assignment.js';
import { GeneratedPaper } from '../models/GeneratedPaper.js';
import { JobStatus } from '../models/JobStatus.js';
import { assignmentQueue } from '../queue/assignment.queue.js';
import { cacheJson, getCachedJson, removeCachedKeys } from './cache.service.js';
import { AppError } from '../utils/AppError.js';
import { extractSourceTextFromFile } from './file-extractor.service.js';
import type { CreateAssignmentInput } from '../validators/assignment.validator.js';

export interface CreateAssignmentPayload extends CreateAssignmentInput {
  filePath?: string;
  fileName?: string;
}

const assignmentListCacheKey = (page: number, limit: number, search?: string, status?: string): string => {
  return `assignments:${page}:${limit}:${search ?? ''}:${status ?? ''}`;
};

export const listAssignments = async ({ page, limit, search, status }: { page: number; limit: number; search?: string; status?: string }) => {
  const cacheKey = assignmentListCacheKey(page, limit, search, status);
  const cached = await getCachedJson<unknown>(cacheKey);

  if (cached) {
    return cached;
  }

  const query: Record<string, unknown> = {};

  if (search) {
    query.$or = [
      { title: { $regex: search, $options: 'i' } },
      { subject: { $regex: search, $options: 'i' } },
      { className: { $regex: search, $options: 'i' } }
    ];
  }

  if (status) {
    query.status = status;
  }

  const [items, total] = await Promise.all([
    Assignment.find(query).sort({ createdAt: -1 }).skip((page - 1) * limit).limit(limit).lean(),
    Assignment.countDocuments(query)
  ]);

  const payload = {
    items,
    page,
    limit,
    total,
    totalPages: Math.ceil(total / limit)
  };

  await cacheJson(cacheKey, payload, 30);
  return payload;
};

export const createAssignment = async (payload: CreateAssignmentPayload): Promise<unknown> => {
  const sourceText = payload.sourceText || (payload.filePath ? await extractSourceTextFromFile(payload.filePath) : '');

  const totalQuestions = payload.questionTypes.reduce((sum, questionType) => sum + questionType.count, 0);
  const totalMarks = payload.questionTypes.reduce((sum, questionType) => sum + questionType.count * questionType.marks, 0);

  if (payload.totalQuestions !== totalQuestions) {
    throw new AppError('Total questions does not match the question type distribution', 400);
  }

  if (payload.totalMarks !== totalMarks) {
    throw new AppError('Total marks does not match the question type distribution', 400);
  }

  const assignment = await Assignment.create({
    title: payload.title,
    subject: payload.subject,
    className: payload.className,
    dueDate: payload.dueDate,
    instructions: payload.instructions,
    sourceText,
    uploadedFilePath: payload.filePath || '',
    uploadedFileName: payload.fileName || '',
    questionTypes: payload.questionTypes,
    totalQuestions,
    totalMarks,
    status: 'queued'
  });

  await removeCachedKeys([assignmentListCacheKey(1, 12), assignmentListCacheKey(1, 12, '', 'completed')]);

  const job = await assignmentQueue.add(
    'generate-paper',
    { assignmentId: assignment._id.toString() },
    { attempts: 3, backoff: { type: 'exponential', delay: 2000 }, removeOnComplete: 20, removeOnFail: 50 }
  );

  await JobStatus.create({
    jobId: job.id?.toString() ?? '',
    queueName: 'assignment-generation',
    referenceType: 'assignment',
    referenceId: assignment._id.toString(),
    status: 'waiting',
    message: 'Assignment queued for generation'
  });

  return assignment;
};

export const getAssignmentById = async (id: string): Promise<unknown> => {
  if (!Types.ObjectId.isValid(id)) {
    throw new AppError('Invalid assignment id', 400);
  }

  const assignment = await Assignment.findById(id).populate('generatedPaperId').lean();

  if (!assignment) {
    throw new AppError('Assignment not found', 404);
  }

  return assignment;
};

export const enqueueGeneration = async (assignmentId: string): Promise<{ jobId: string }> => {
  if (!Types.ObjectId.isValid(assignmentId)) {
    throw new AppError('Invalid assignment id', 400);
  }

  const assignment = await Assignment.findById(assignmentId);

  if (!assignment) {
    throw new AppError('Assignment not found', 404);
  }

  assignment.status = 'queued';
  await assignment.save();

  const job = await assignmentQueue.add(
    'generate-paper',
    { assignmentId },
    { attempts: 3, backoff: { type: 'exponential', delay: 2000 }, removeOnComplete: 20, removeOnFail: 50 }
  );

  await JobStatus.create({
    jobId: job.id?.toString() ?? '',
    queueName: 'assignment-generation',
    referenceType: 'assignment',
    referenceId: assignmentId,
    status: 'waiting',
    message: 'Assignment queued for generation'
  });

  return { jobId: job.id?.toString() ?? '' };
};

export const createGeneratedPaperForAssignment = async (assignmentId: string, paperData: {
  title: string;
  subject: string;
  className: string;
  duration: string;
  totalMarks: number;
  sections: Array<{
    title: string;
    instruction: string;
    questions: Array<{
      question: string;
      difficulty: string;
      marks: number;
      answer?: string;
      topic?: string;
    }>;
  }>;
  answerKey: Array<{ question: string; answer: string; explanation?: string }>;
  generationPrompt: string;
  model: string;
}): Promise<string> => {
  const paper = await GeneratedPaper.create({
    assignment: assignmentId,
    title: paperData.title,
    subject: paperData.subject,
    className: paperData.className,
    duration: paperData.duration,
    totalMarks: paperData.totalMarks,
    sections: paperData.sections,
    answerKey: paperData.answerKey,
    generationPrompt: paperData.generationPrompt,
    model: paperData.model,
    status: 'completed'
  });

  await Assignment.findByIdAndUpdate(assignmentId, {
    status: 'completed',
    generatedPaperId: paper._id
  });

  await removeCachedKeys([assignmentListCacheKey(1, 12), assignmentListCacheKey(1, 12, '', 'completed')]);

  return paper._id.toString();
};