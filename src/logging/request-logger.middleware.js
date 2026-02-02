import { randomUUID } from 'crypto';
import { logger } from './logger.js';

export const requestLogger = (req, res, next) => {
  const requestId = randomUUID();
  req.requestId = requestId;

  res.on('finish', () => {
    logger.info({
      requestId,
      method: req.method,
      path: req.originalUrl,
      statusCode: res.statusCode,
      userId: req.user?.userId,
    });
  });

  next();
};
