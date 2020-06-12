import { Request, Response, NextFunction } from 'express';
import Redis from 'ioredis';
import { RateLimiterRedis } from 'rate-limiter-flexible';

import AppError from '@shared/errors/AppError';

import cacheConfig from '@config/cache';

const storeClient = new Redis(cacheConfig.config.redis);

const rateLimiter = new RateLimiterRedis({
  storeClient,
  keyPrefix: 'ratelimit-middleware',
  points: 5,
  duration: 60,
});

export default async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    await rateLimiter.consume(req.ip);
  } catch {
    throw new AppError('Too many requests', 429);
  }

  return next();
};
