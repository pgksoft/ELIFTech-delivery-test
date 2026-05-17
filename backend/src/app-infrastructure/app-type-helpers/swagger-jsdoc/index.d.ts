import type { OpenAPIV3 } from 'openapi-types';

declare module 'swagger-jsdoc' {
  export interface Options {
    definition: OpenAPIV3.Document;
    apis: string[];
  }

  export default function swaggerJSDoc(options: Options): OpenAPIV3.Document;
}
