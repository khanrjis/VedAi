import { Queue } from 'bullmq';
import { redisConnection } from '../config/redis.js';
export const ASSIGNMENT_QUEUE = 'assignment-generation';
export const assignmentQueue = new Queue(ASSIGNMENT_QUEUE, {
    connection: redisConnection
});
