import { openApiSchemaEntityMember } from '@db/open-api-schema-entity-member';
import { shopFieldsSchema } from '@domain/shops/model';
import { getOpenApiSchema } from '@helpers/get-open-api-schema';
import type { OpenAPIV3 } from 'openapi-types';

export const openApiShopSchemas: Record<
  string,
  OpenAPIV3.ReferenceObject | OpenAPIV3.SchemaObject
> = {
  Shop: getOpenApiSchema(shopFieldsSchema, { mode: 'all' }, { ...openApiSchemaEntityMember }),
  ShopMutationDto: getOpenApiSchema(shopFieldsSchema, {
    mode: 'exclude',
    keys: ['mutationDate'],
  }),
  ShopList: {
    type: 'array',
    items: { $ref: '#/components/schemas/Shop' },
  },
};
