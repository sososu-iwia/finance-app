import { AppError } from './base.error.js';
import { InternalServerError } from './system.errors.js';
import { logger } from '../logging/logger.js';

export const errorHandler = (err, req, res, next) => {
  if (err instanceof AppError) {
    logger.warn({
      type: err.name,
      message: err.message,
      path: req.originalUrl,
    });

    return res.status(err.statusCode).json({
      timestamp: new Date().toISOString(),
      status: err.statusCode,
      error: err.name,
      message: err.message,
    });
  }

  logger.error({
    message: err.message,
    stack: err.stack,
    path: req.originalUrl,
  });

  const internal = new InternalServerError();

  res.status(500).json({
    timestamp: new Date().toISOString(),
    status: 500,
    error: internal.name,
    message: internal.message,
  });
};
