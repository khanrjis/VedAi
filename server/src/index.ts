import http from 'node:http';
import { createApp } from './app.js';
import { env } from './config/env.js';
import { connectDatabase } from './config/db.js';
import { connectRedis, disconnectRedis } from './config/redis.js';
import { createSocketServer } from './sockets/index.js';
import { setAssignmentWorkerSocket, startAssignmentWorker } from './workers/assignment.worker.js';
import { setPdfWorkerSocket, startPdfWorker } from './workers/pdf.worker.js';

const bootstrap = async (): Promise<void> => {
  await connectDatabase();
  await connectRedis();

  const app = createApp();
  const httpServer = http.createServer(app);
  const io = createSocketServer(httpServer);
  setAssignmentWorkerSocket(io);
  setPdfWorkerSocket(io);
  startAssignmentWorker();
  startPdfWorker();

  httpServer.listen(env.PORT, () => {
    console.log(`API listening on port ${env.PORT}`);
  });

  const shutdown = async (): Promise<void> => {
    io.close();
    httpServer.close();
    await disconnectRedis();
    process.exit(0);
  };

  process.on('SIGINT', shutdown);
  process.on('SIGTERM', shutdown);
};

bootstrap().catch((error) => {
  console.error('Failed to start server', error);
  process.exit(1);
});