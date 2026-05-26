import path from 'node:path';
import fs from 'node:fs/promises';
import { asyncHandler } from '../utils/async-handler.js';
import { enqueuePdfGeneration, getPaperById } from '../services/paper.service.js';
export const getPaperController = asyncHandler(async (request, response) => {
    const id = Array.isArray(request.params.id) ? request.params.id[0] : request.params.id;
    const paper = await getPaperById(id ?? '');
    response.json({ data: paper });
});
export const regeneratePaperController = asyncHandler(async (request, response) => {
    const id = Array.isArray(request.params.id) ? request.params.id[0] : request.params.id;
    const result = await enqueuePdfGeneration(id ?? '');
    response.status(202).json({ data: result });
});
export const getPdfController = asyncHandler(async (request, response) => {
    const id = Array.isArray(request.params.id) ? request.params.id[0] : request.params.id;
    const paper = await getPaperById(id ?? '');
    if (!paper.pdfPath) {
        response.status(404).json({ message: 'PDF not generated yet' });
        return;
    }
    const absolutePath = path.resolve(paper.pdfPath);
    await fs.access(absolutePath);
    response.setHeader('Content-Type', 'application/pdf');
    response.download(absolutePath, `${paper.title}.pdf`);
});
