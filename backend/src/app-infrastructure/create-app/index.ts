import { appRoutes } from '@infra/app-routes';
import { applyMiddleware } from '@middleware/apply-middleware';
import type { Express } from 'express';
import express from 'express';

export const createApp = (): Express => {
  const app = express();
  applyMiddleware(app);
  appRoutes(app);
  //   app.use(apiUnAuthUrl.apiDocsV1, swaggerUi.serve, swaggerUi.setup(swaggerSpecV1));
  return app;
};
