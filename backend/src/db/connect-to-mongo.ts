import mongoose from 'mongoose';
import { MONGODB_TITLE } from './const/mongodb_title';
import { logger } from '@logger/index';
import { config } from '@env/index';

export const connectToMongo = async () => {
  await mongoose.connect(config.mongoUri, {
    dbName: config.dbName,
  });

  mongoose.connection.on('connected', () => {
    logger.info(MONGODB_TITLE.connected);
  });

  mongoose.connection.on('error', (err) => {
    logger.error(MONGODB_TITLE.error, err);
  });

  mongoose.connection.on('disconnected', () => {
    logger.warn(MONGODB_TITLE.disconnected);
  });
};
