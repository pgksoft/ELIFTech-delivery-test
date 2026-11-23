import { logger } from '@logger/index';
import type TDefineFindParamOptions from './t-define-find-param-options';

export const defineFindParamForListCheckBoxFormat = <T extends string>(
  options: TDefineFindParamOptions<T>,
) => {
  const { entityNameKey, parameters, config, formattedKey } = options;

  if (config.format === 'list-checkbox') {
    const { key, description } = config;

    const queryParamName = `${key}[]`;
    const componentName = `${entityNameKey}${formattedKey}FindParam`;

    parameters[componentName] = {
      name: queryParamName,
      in: 'query',
      required: false,
      style: 'form',
      explode: true, // Tell Swagger to send like repeated keys: key[]=id1&key[]=id2
      description: description || `Filter by multiple IDs for \`${key}\`.`,
      schema: {
        type: 'array',
        items: {
          type: 'string',
        },
        example: ['69dff361788adf4bcde063c1', '69dff396788adf4bcde063c3'],
      },
    };
  }
};
