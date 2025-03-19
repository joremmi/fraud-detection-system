import Redis from 'ioredis';
import { Request, Response, NextFunction } from 'express';

const redis = new Redis({
  host: process.env.REDIS_HOST || 'localhost',
  port: parseInt(process.env.REDIS_PORT || '6379'),
  password: process.env.REDIS_PASSWORD
});

export const apiLimiter = async (req: Request, res: Response, next: NextFunction) => {
  const key = `ratelimit:${req.ip}`;
  const limit = 100; // requests
  const window = 900; // 15 minutes in seconds

  try {
    const result = await redis.multi()
      .incr(key)
      .expire(key, window)
      .exec();

    const current = result?.[0]?.[1] as number;
    
    if (current > limit) {
      return res.status(429).json({
        message: 'Too many requests, please try again later'
      });
    }

    next();
  } catch (error) {
    console.error('Rate limiting error:', error);
    next();
  }
}; 