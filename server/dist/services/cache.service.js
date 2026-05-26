import { redis } from '../config/redis.js';
export const cacheJson = async (key, value, ttlSeconds = 60) => {
    await redis.set(key, JSON.stringify(value), 'EX', ttlSeconds);
};
export const getCachedJson = async (key) => {
    const cachedValue = await redis.get(key);
    return cachedValue ? JSON.parse(cachedValue) : null;
};
export const removeCachedKeys = async (keys) => {
    if (keys.length > 0) {
        await redis.del(...keys);
    }
};
