import { logger } from '@logger/index';
import mongoose from 'mongoose';

export const setupProcessHandlers = () => {
  process.on('uncaughtException', (err) => {
    logger.fatal({ err }, 'Uncaught Exception');
    process.exit(1);
  });

  process.on('unhandledRejection', (reason) => {
    logger.fatal({ reason }, 'Unhandled Rejection');
    process.exit(1);
  });

  ['SIGINT', 'SIGTERM'].forEach((signal) => {
    process.on(signal, async () => {
      logger.info(`Received ${signal}, shutting down...`);
      await mongoose.disconnect();
      process.exit(0);
    });
  });
};
