import { Router } from 'express';
import { getPdfController, getPaperController, regeneratePaperController } from '../controllers/paper.controller.js';

export const paperRouter = Router();

paperRouter.get('/:id', getPaperController);
paperRouter.post('/:id/regenerate', regeneratePaperController);
paperRouter.get('/:id/pdf', getPdfController);