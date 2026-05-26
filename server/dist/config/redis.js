import { Redis } from 'ioredis';
import { env } from './env.js';
export const redis = new Redis(env.REDIS_URL, {
    maxRetriesPerRequest: null,
    enableReadyCheck: false,
    lazyConnect: true
});
export const redisConnection = {
    host: redis.options.host,
    port: redis.options.port,
    password: redis.options.password,
    maxRetriesPerRequest: null
};
export const connectRedis = async () => {
    if (redis.status === 'wait' || redis.status === 'end') {
        await redis.connect();
    }
};
export const disconnectRedis = async () => {
    await redis.quit();
};
