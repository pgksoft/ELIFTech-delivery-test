import type { TEntityNameKeys } from '@app-types/entity/t-entity-name-key';
import type { OpenAPIV3 } from 'openapi-types';
import type { TFindFieldConfig } from '..';

type TDefineFindParamOptions<T extends string> = {
  entityNameKey: TEntityNameKeys;
  parameters: Record<string, OpenAPIV3.ParameterObject>;
  config: TFindFieldConfig<T>;
  formattedKey: string;
};

export default TDefineFindParamOptions;
