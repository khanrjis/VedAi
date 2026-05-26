import type { Request, Response } from 'express';
import fs from 'node:fs/promises';
import { asyncHandler } from '../utils/async-handler.js';
import { createAssignmentSchema, listAssignmentsQuerySchema } from '../validators/assignment.validator.js';
import { createAssignment, enqueueGeneration, getAssignmentById, listAssignments } from '../services/assignment.service.js';

const parseQuestionTypes = (rawValue: unknown) => {
  if (Array.isArray(rawValue)) {
    return rawValue;
  }

  if (typeof rawValue === 'string') {
    return JSON.parse(rawValue);
  }

  return [];
};

export const createAssignmentController = asyncHandler(async (request: Request, response: Response) => {
  const parsed = createAssignmentSchema.parse({
    ...request.body,
    questionTypes: parseQuestionTypes(request.body.questionTypes)
  });

  const filePath = request.file?.path;
  const fileName = request.file?.originalname;

  const assignment = await createAssignment({
    ...parsed,
    filePath,
    fileName
  });

  response.status(201).json({ data: assignment });

  if (request.file && filePath) {
    request.on('close', async () => {
      await fs.access(filePath).catch(() => undefined);
    });
  }
});

export const listAssignmentsController = asyncHandler(async (request: Request, response: Response) => {
  const query = listAssignmentsQuerySchema.parse(request.query);
  const assignments = await listAssignments(query);
  response.json({ data: assignments });
});

export const getAssignmentController = asyncHandler(async (request: Request, response: Response) => {
  const id = Array.isArray(request.params.id) ? request.params.id[0] : request.params.id;
  const assignment = await getAssignmentById(id ?? '');
  response.json({ data: assignment });
});

export const generateAssignmentController = asyncHandler(async (request: Request, response: Response) => {
  const id = Array.isArray(request.params.id) ? request.params.id[0] : request.params.id;
  const result = await enqueueGeneration(id ?? '');
  response.status(202).json({ data: result });
});