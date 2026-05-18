import type { RequestHandler } from 'express';

declare module 'swagger-ui-express' {
  // swaggerUi provides ready-made middleware
  export const serve: RequestHandler[];
  export function setup(
    swaggerDoc: object,
    options?: {
      explorer?: boolean;
      customCss?: string;
      customJs?: string;
      customfavIcon?: string;
      customSiteTitle?: string;
    },
  ): RequestHandler;
}
