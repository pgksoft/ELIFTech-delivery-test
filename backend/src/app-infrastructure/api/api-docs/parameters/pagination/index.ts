import type { OpenAPIV3 } from 'openapi-types';

export const openApiPaginationParameters: Record<string, OpenAPIV3.ParameterObject> = {
  PageTake: {
    name: 'page[tk]',
    in: 'query',
    required: false,
    description:
      'Page number to take (tk = to take page). If not specified or its value is less than or equal to zero, pagination is considered disabled.',
    schema: {
      type: 'integer',
      minimum: 0,
      default: 1,
    },
  },
  PageSize: {
    name: 'page[sz]',
    in: 'query',
    required: false,
    description: 'Number of items per page (sz = size)',
    schema: {
      type: 'integer',
      minimum: 1,
      default: 10,
    },
  },
};
