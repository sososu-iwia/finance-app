import mongoose from 'mongoose';
import { logger } from '../logging/logger.js';

export async function connectDb(mongoUri) {
  if (!mongoUri) {
    throw new Error('DATABASE_URL is required');
  }

  mongoose.set('strictQuery', true);

  await mongoose.connect(mongoUri, {
    serverSelectionTimeoutMS: 10_000,
  });

  logger.info({ event: 'DB_CONNECTED', host: mongoose.connection.host });

  return mongoose.connection;
}

