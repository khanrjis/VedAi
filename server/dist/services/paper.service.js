import { Types } from 'mongoose';
import { GeneratedPaper } from '../models/GeneratedPaper.js';
import { AppError } from '../utils/AppError.js';
import { pdfQueue } from '../queue/pdf.queue.js';
export const getPaperById = async (id) => {
    if (!Types.ObjectId.isValid(id)) {
        throw new AppError('Invalid paper id', 400);
    }
    const paper = await GeneratedPaper.findById(id).lean();
    if (!paper) {
        throw new AppError('Paper not found', 404);
    }
    return paper;
};
export const enqueuePdfGeneration = async (paperId) => {
    if (!Types.ObjectId.isValid(paperId)) {
        throw new AppError('Invalid paper id', 400);
    }
    const paper = await GeneratedPaper.findById(paperId);
    if (!paper) {
        throw new AppError('Paper not found', 404);
    }
    const job = await pdfQueue.add('generate-pdf', { paperId }, { attempts: 3, backoff: { type: 'exponential', delay: 1500 }, removeOnComplete: 20, removeOnFail: 50 });
    return { jobId: job.id?.toString() ?? '' };
};
