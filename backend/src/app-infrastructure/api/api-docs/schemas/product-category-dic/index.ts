import { openApiSchemaEntityMember } from '@db/open-api-schema-entity-member';
import { productCategoryFieldsSchema } from '@domain/product-category-dic/model';
import { getOpenApiSchema } from '@helpers/get-open-api-schema';
import type { OpenAPIV3 } from 'openapi-types';
import { getPaginatedListSchema } from '../entity-view';

export const openApiProductCategorySchemas: Record<
  string,
  OpenAPIV3.ReferenceObject | OpenAPIV3.SchemaObject
> = {
  ProductCategory: getOpenApiSchema(
    productCategoryFieldsSchema,
    { mode: 'all' },
    { ...openApiSchemaEntityMember },
  ),
  ProductCategoryMutationDto: getOpenApiSchema(productCategoryFieldsSchema, {
    mode: 'exclude',
    keys: ['mutationDate'],
  }),
  ProductCategoryList: getPaginatedListSchema('#/components/schemas/ProductCategory'),
};
