import { openApiProductSchemas } from '@api/api-docs/schemas/product';
import { openApiProductCategorySchemas } from '@api/api-docs/schemas/product-category-dic';
import { openApiShopSchemas } from '@api/api-docs/schemas/shop';
import { openApiShopProductSchemas } from '@api/api-docs/schemas/shop-product';
import APP_TITLE from '@infra/const/app-title';
import type { OpenAPIV3 } from 'openapi-types';
import type { Options } from 'swagger-jsdoc';
import swaggerJSDoc from 'swagger-jsdoc';

const options: Options = {
  definition: {
    openapi: '3.0.3',
    info: {
      title: APP_TITLE.name,
      version: '1.0.0',
      description: 'API documentation',
    },
    paths: {},
    components: {
      // securitySchemes: { basicAuth: { type: 'http', scheme: 'basic' } },
      schemas: {
        ...openApiShopSchemas,
        ...openApiProductSchemas,
        ...openApiProductCategorySchemas,
        ...openApiShopProductSchemas,
      },
    },
    // security: [
    //   {
    //     basicAuth: [],
    //   },
    // ],
  },
  apis: ['src/domain/**/routes/**/*.ts'],
};

export const swaggerSpec: OpenAPIV3.Document = swaggerJSDoc(options);
