import type { Express } from 'express';
import swaggerUi from 'swagger-ui-express';
import { corsErrorHandler, corsMiddleware } from '@middleware/cors-config';
import { ensureGuestId } from '@middleware/ensure-guest-id';
import { requestLogger } from '@middleware/request-logger';
import { json } from 'express';
import cookieParser from 'cookie-parser';
import { apiPublicUrl } from '@api/const/api-url';
import { swaggerSpec } from '@infra/swagger';
import qs from 'qs';

export const applyMiddleware = (app: Express) => {
  app.set('query parser', (str: string) => {
    return qs.parse(str, { allowDots: false, depth: 5, arrayLimit: 100, allowPrototypes: false });
  });

  app.use(json());
  app.use(cookieParser());
  app.use(corsMiddleware);
  app.use(corsErrorHandler);
  app.use(ensureGuestId);
  app.use(requestLogger);
  app.use(apiPublicUrl.openApiDocs, swaggerUi.serve, swaggerUi.setup(swaggerSpec));
};
