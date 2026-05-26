import { Worker } from 'bullmq';
import { redisConnection } from '../config/redis.js';
import { PDF_QUEUE } from '../queue/pdf.queue.js';
import { GeneratedPaper } from '../models/GeneratedPaper.js';
import { generatePaperPdf } from '../services/pdf.service.js';
import { emitToPaper } from '../sockets/index.js';
let socketServer = null;
export const setPdfWorkerSocket = (io) => {
    socketServer = io;
};
export const startPdfWorker = () => {
    return new Worker(PDF_QUEUE, async (job) => {
        const { paperId } = job.data;
        const paper = (await GeneratedPaper.findById(paperId));
        if (!paper) {
            throw new Error('Paper not found');
        }
        emitToPaper(socketServer, paperId, 'generation_progress', { paperId, progress: 75, message: 'Generating PDF' });
        const pdfPath = await generatePaperPdf(paper);
        paper.pdfPath = pdfPath;
        paper.pdfUrl = `/api/papers/${paperId}/pdf`;
        // GeneratedPaperDocument type may not include Mongoose document methods like `save`.
        // Use the model to persist changes to avoid type issues.
        await GeneratedPaper.updateOne({ _id: paperId }, { $set: { pdfPath: paper.pdfPath, pdfUrl: paper.pdfUrl } });
        emitToPaper(socketServer, paperId, 'pdf_ready', { paperId, pdfPath, message: 'PDF generated' });
        return { pdfPath };
    }, { connection: redisConnection });
};
