import { Redis } from 'ioredis';

const isRedisDisabled =
  process.env.REDIS_ENABLED === 'false' ||
  (!process.env.REDIS_HOST && process.env.NODE_ENV !== 'production');

let redisClient: Redis;

if (isRedisDisabled) {
  console.log('ℹ️ Redis is running in lazy/fallback mode');
  redisClient = new Redis({
    port: Number(process.env.REDIS_PORT) || 6379,
    host: process.env.REDIS_HOST || 'localhost',
    lazyConnect: true,
    enableOfflineQueue: false,
    retryStrategy() {
      // Don't retry infinitely if Redis is offline locally
      return null;
    },
    maxRetriesPerRequest: 0,
  });
} else {
  redisClient = new Redis({
    port: Number(process.env.REDIS_PORT) || 6379,
    host: process.env.REDIS_HOST || 'localhost',
    password: process.env.REDIS_PASSWORD || undefined,
    db: Number(process.env.REDIS_DB) || 0,
    retryStrategy(times: number) {
      if (times > 5) {
        console.warn('⚠️ Redis unreachable, stopping retry spam.');
        return null;
      }
      return Math.min(times * 100, 2000);
    },
    maxRetriesPerRequest: 3,
    enableReadyCheck: true,
    showFriendlyErrorStack: true,
    enableOfflineQueue: false,
    enableAutoPipelining: true,
  });
}

redisClient.on('connect', () => {
  console.log('Connected to Redis');
});
redisClient.on('error', (error) => {
  // Silent console flood if connection is refused locally
  if ((error as any).code !== 'ECONNREFUSED') {
    console.error('Redis error:', error);
  }
});
redisClient.on('ready', () => {
  console.log('Redis is ready');
});

export const redis = redisClient;
