import { Worker } from 'bullmq';
import type { Server as SocketIOServer } from 'socket.io';
import { redisConnection } from '../config/redis.js';
import { PDF_QUEUE } from '../queue/pdf.queue.js';
import { GeneratedPaper } from '../models/GeneratedPaper.js';
import type { GeneratedPaperDocument } from '../models/GeneratedPaper.js';
import { generatePaperPdf } from '../services/pdf.service.js';
import { emitToPaper } from '../sockets/index.js';

let socketServer: SocketIOServer | null = null;

export const setPdfWorkerSocket = (io: SocketIOServer): void => {
  socketServer = io;
};

export const startPdfWorker = (): Worker => {
  return new Worker(
    PDF_QUEUE,
    async (job) => {
      const { paperId } = job.data as { paperId: string };
      const paper = (await GeneratedPaper.findById(paperId)) as GeneratedPaperDocument | null;

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
    },
    { connection: redisConnection }
  );
};