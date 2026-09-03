import { Redis } from 'ioredis';

export const redis = new Redis({
  port: Number(process.env.REDIS_PORT) || 6379,
  host: process.env.REDIS_HOST || 'localhost',
  password: process.env.REDIS_PASSWORD || undefined,
  db: Number(process.env.REDIS_DB) || 0,
  retryStrategy(times: number) {
    return Math.min(times * 50, 1000);
  },
  maxRetriesPerRequest: 3,
  enableReadyCheck: true,
  showFriendlyErrorStack: true,
  enableOfflineQueue: true,
  enableAutoPipelining: true,
});

redis.on('connect', () => {
  console.log('Connected to Redis');
});
redis.on('error', (error) => {
  console.error('Redis error:', error);
});
redis.on('reconnecting', () => {
  console.log('Reconnecting to Redis');
});
redis.on('ready', () => {
  console.log('Redis is ready');
});
redis.on('close', () => {
  console.log('Redis connection closed');
});
redis.on('end', () => {
  console.log('Redis connection ended');
});
redis.on('warning', (warning) => {
  console.warn('Redis warning:', warning);
});