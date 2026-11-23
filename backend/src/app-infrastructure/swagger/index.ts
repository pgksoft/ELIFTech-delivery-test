import { openApiPaginationParameters } from '@api/api-docs/parameters/pagination';
import { openApiEntityViewSchema } from '@api/api-docs/schemas/entity-view';
import { openApiProductSchemas } from '@api/api-docs/schemas/product';
import { openApiProductCategorySchemas } from '@api/api-docs/schemas/product-category-dic';
import { openApiShopSchemas } from '@api/api-docs/schemas/shop';
import { openApiShopProductSchemas } from '@api/api-docs/schemas/shop-product';
import {
  productCategoryOpenApiFindParams,
  productCategoryOpenApiSortParam,
} from '@domain/product-category-dic/model';
import { productOpenApiFindParams, productOpenApiSortParam } from '@domain/product-dic/model';
import {
  shopProductsOpenApiFindParams,
  shopProductsOpenApiSortParam,
} from '@domain/shop-products/model';
import { shopOpenApiFindParams, shopOpenApiSortParam } from '@domain/shops/model';
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
      parameters: {
        ...openApiPaginationParameters,
        ...shopOpenApiSortParam,
        ...productOpenApiSortParam,
        ...productCategoryOpenApiSortParam,
        ...shopProductsOpenApiSortParam,
        ...shopOpenApiFindParams,
        ...productCategoryOpenApiFindParams,
        ...productOpenApiFindParams,
        ...shopProductsOpenApiFindParams,
      },
      schemas: {
        ...openApiEntityViewSchema,
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
