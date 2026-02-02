import { createApp } from './app.js';
import { env } from './config/env.js';
import { logger } from './logging/logger.js';

const database = {
  async ping() {
    return true;
  },
};

const app = createApp({ db: database });

app.listen(env.PORT, () => {
  logger.info(`Server running on port ${env.PORT}`);
});

process.on('unhandledRejection', (err) => {
  logger.fatal({ err }, 'Unhandled Rejection');
  process.exit(1);
});

process.on('uncaughtException', (err) => {
  logger.fatal({ err }, 'Uncaught Exception');
  process.exit(1);
});
