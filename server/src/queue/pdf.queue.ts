import { Queue } from 'bullmq';
import { redisConnection } from '../config/redis.js';

export const PDF_QUEUE = 'paper-pdf-generation';

export const pdfQueue = new Queue(PDF_QUEUE, {
  connection: redisConnection
});