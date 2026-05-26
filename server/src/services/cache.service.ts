import { redis } from '../config/redis.js';

export const cacheJson = async <T>(key: string, value: T, ttlSeconds = 60): Promise<void> => {
  await redis.set(key, JSON.stringify(value), 'EX', ttlSeconds);
};

export const getCachedJson = async <T>(key: string): Promise<T | null> => {
  const cachedValue = await redis.get(key);
  return cachedValue ? (JSON.parse(cachedValue) as T) : null;
};

export const removeCachedKeys = async (keys: string[]): Promise<void> => {
  if (keys.length > 0) {
    await redis.del(...keys);
  }
};