import { apiPublicUrl } from '@api/const/api-url';
import APP_TITLE from '@infra/const/app-title';
import type { Express } from 'express';

export const appRoutes = (app: Express) => {
  app.get(apiPublicUrl.server, (req, res) => {
    res.send(`${APP_TITLE.hi}, ${APP_TITLE.name}!`);
  });
};
