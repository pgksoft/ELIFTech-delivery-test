import type { Express } from 'express';
import { corsErrorHandler, corsMiddleware } from '@middleware/cors-config';
import { ensureGuestId } from '@middleware/ensure-guest-id';
import { requestLogger } from '@middleware/request-logger';
import { json } from 'express';
import cookieParser from 'cookie-parser';

export const applyMiddleware = (app: Express) => {
  app.use(json());
  app.use(cookieParser());
  app.use(corsMiddleware);
  app.use(corsErrorHandler);
  app.use(ensureGuestId);
  app.use(requestLogger);
};
