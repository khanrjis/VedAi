import { Router } from 'express';
import multer from 'multer';
import fs from 'node:fs';
import path from 'node:path';
import { createAssignmentController, generateAssignmentController, getAssignmentController, listAssignmentsController } from '../controllers/assignment.controller.js';
const uploadDir = path.resolve(process.cwd(), 'uploads');
fs.mkdirSync(uploadDir, { recursive: true });
const upload = multer({
    dest: uploadDir,
    limits: {
        fileSize: 10 * 1024 * 1024
    }
});
export const assignmentRouter = Router();
assignmentRouter.post('/create', upload.single('file'), createAssignmentController);
assignmentRouter.get('/', listAssignmentsController);
assignmentRouter.get('/:id', getAssignmentController);
assignmentRouter.post('/:id/generate', generateAssignmentController);
