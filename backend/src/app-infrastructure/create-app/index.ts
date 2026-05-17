import { appRoutes } from '@infra/app-routes';
import { applyMiddleware } from '@middleware/apply-middleware';
import { errorBoundaryHandler } from '@middleware/error-boundary-handler';
import { notFoundHandler } from '@middleware/not-found-handler';
import type { Express } from 'express';
import express from 'express';

export const createApp = (): Express => {
  const app = express();
  applyMiddleware(app);
  appRoutes(app);
  app.use(notFoundHandler);
  app.use(errorBoundaryHandler);
  return app;
};
