import { openApiSchemaEntityMember } from '@db/open-api-schema-entity-member';
import { productFieldsSchema } from '@domain/product-dic/model';
import { getOpenApiSchema } from '@helpers/get-open-api-schema';
import type { OpenAPIV3 } from 'openapi-types';

export const openApiProductSchemas: Record<
  string,
  OpenAPIV3.ReferenceObject | OpenAPIV3.SchemaObject
> = {
  Product: getOpenApiSchema(
    productFieldsSchema,
    { mode: 'all' },
    { ...openApiSchemaEntityMember, category: { $ref: '#/components/schemas/ProductCategory' } },
  ),
  ProductMutationDto: getOpenApiSchema(productFieldsSchema, {
    mode: 'exclude',
    keys: ['mutationDate'],
  }),
  ProductList: {
    type: 'array',
    items: { $ref: '#/components/schemas/Product' },
  },
};
