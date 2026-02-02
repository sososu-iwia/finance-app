import express from 'express';
import { requestLogger } from './logging/request-logger.middleware.js';
import { errorHandler } from './errors/error-handler.middleware.js';
import { healthCheck } from './monitoring/health.controller.js';
import { routes } from './routes.js';
import { swaggerMiddleware } from './swagger.js';

export const createApp = (deps) => {
  const app = express();

  app.use(express.json());
  app.use(requestLogger);

  app.get('/health', healthCheck(deps.db));

  app.use('/docs', ...swaggerMiddleware);
  app.use('/api', routes(deps));

  app.use(errorHandler);

  return app;
};
