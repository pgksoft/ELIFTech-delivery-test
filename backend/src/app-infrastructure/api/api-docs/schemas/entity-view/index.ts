import { getArrayAsStringConst } from '@helpers/get-array-as-string-const';
import type { OpenAPIV3 } from 'openapi-types';

const entityViewKeys = getArrayAsStringConst('page', 'size', 'first', 'last', 'next', 'previous');

type TEntityViewKeys = (typeof entityViewKeys)[number];

type TProperties = { [K in TEntityViewKeys]: OpenAPIV3.SchemaObject | OpenAPIV3.ReferenceObject };

export const openApiEntityViewSchema: Record<string, OpenAPIV3.SchemaObject> = {
  EntityView: {
    type: 'object',
    properties: {
      page: { type: 'integer', description: 'Current page number' },
      size: { type: 'integer', description: 'Items per page' },
      first: { type: 'integer', description: 'First page. Usually equal to one.  ' },
      last: { type: 'integer', description: 'Last page' },
      next: { type: 'integer', description: 'Next page number (Or equal to last page)' },
      previous: { type: 'integer', description: 'Previous page number (Or equal to one)' },
    } satisfies TProperties,
    required: [...entityViewKeys],
  },
};

export const getPaginatedListSchema = (itemRef: string): OpenAPIV3.SchemaObject => ({
  type: 'object',
  properties: {
    items: {
      type: 'array',
      items: { $ref: itemRef },
    },
    total: { type: 'integer' },
    entityView: { $ref: '#/components/schemas/EntityView' },
  },
  required: ['items', 'total'],
});
