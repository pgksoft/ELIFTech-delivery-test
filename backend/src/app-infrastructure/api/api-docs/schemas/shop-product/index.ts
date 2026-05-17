import { openApiSchemaEntityMember } from '@db/open-api-schema-entity-member';
import { shopProductFieldsSchema } from '@domain/shop-products/model';
import { getOpenApiSchema } from '@helpers/get-open-api-schema';
import { MULTER_REQUEST_KEY } from '@infra/multer';
import type { OpenAPIV3 } from 'openapi-types';

export const openApiShopProductSchemas: Record<
  string,
  OpenAPIV3.ReferenceObject | OpenAPIV3.SchemaObject
> = {
  ShopProduct: getOpenApiSchema(
    shopProductFieldsSchema,
    { mode: 'exclude', keys: ['image'] },
    { ...openApiSchemaEntityMember, product: { $ref: '#/components/schemas/Product' } },
  ),
  ShoppingCart: getOpenApiSchema(
    shopProductFieldsSchema,
    { mode: 'exclude', keys: ['image'] },
    {
      ...openApiSchemaEntityMember,
      shop: { $ref: '#/components/schemas/Shop' },
      product: { $ref: '#/components/schemas/Product' },
    },
  ),
  ShopProductBaseDto: getOpenApiSchema(shopProductFieldsSchema, {
    mode: 'exclude',
    keys: ['fileMeta', 'mutationDate', 'image'],
  }),
  ShopProductUploadImageDto: getOpenApiSchema(
    shopProductFieldsSchema,
    {
      mode: 'include',
      keys: ['image'],
    },
    {
      [MULTER_REQUEST_KEY]: {
        type: 'string',
        format: 'binary',
        description: 'Media file to upload',
      },
    },
    'override',
    { requiredMode: 'selection' },
  ),
  ShopProductCreateDto: {
    allOf: [
      { $ref: '#/components/schemas/ShopProductBaseDto' },
      { $ref: '#/components/schemas/ShopProductUploadImageDto' },
    ],
  },
  ShopProductUpdateDto: {
    anyOf: [
      { $ref: '#/components/schemas/ShopProductCreateDto' },
      { $ref: '#/components/schemas/ShopProductBaseDto' },
      { $ref: '#/components/schemas/ShopProductUploadImageDto' },
    ],
  },
  ShopProductList: {
    type: 'array',
    items: { $ref: '#/components/schemas/ShopProduct' },
  },
  ShoppingCartList: { type: 'array', items: { $ref: '#/components/schemas/ShoppingCart' } },
};
