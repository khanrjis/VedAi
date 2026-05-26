import { Router } from 'express';
import { assignmentRouter } from './assignment.routes.js';
import { paperRouter } from './paper.routes.js';

export const apiRouter = Router();

apiRouter.use('/assignments', assignmentRouter);
apiRouter.use('/papers', paperRouter);