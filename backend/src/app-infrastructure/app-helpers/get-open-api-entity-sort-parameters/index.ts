import type { OpenAPIV3 } from 'openapi-types';
import type { TEntityNameKeys } from '@app-types/entity/t-entity-name-key';
import getPascalCaseFromDot from '@helpers/get-pascal-case-from-dot';

const getOpenApiEntitySortParameters = <T extends string>(
  entityNameKey: TEntityNameKeys,
  allowedKeys: readonly T[],
): Record<string, OpenAPIV3.ParameterObject> => {
  const parameters: Record<string, OpenAPIV3.ParameterObject> = {};

  for (const key of allowedKeys) {
    const componentName = `${entityNameKey}${getPascalCaseFromDot(key)}SortParam`;
    parameters[componentName] = {
      name: `sort[${key}]`,
      in: 'query',
      required: false,
      description: `Sort by \`${key}\` field`,
      schema: {
        type: 'string',
        enum: ['asc', 'desc', '1', '-1'],
      },
    };
  }

  return parameters;
};

export default getOpenApiEntitySortParameters;
