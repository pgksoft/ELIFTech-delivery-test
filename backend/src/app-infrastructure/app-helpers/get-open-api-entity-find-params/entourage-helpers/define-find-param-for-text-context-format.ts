import type TDefineFindParamOptions from './t-define-find-param-options';

export const defineFindParamForTextContextFormat = <T extends string>(
  options: TDefineFindParamOptions<T>,
) => {
  const {
    entityNameKey,
    parameters,
    config: { key, format, description },
    formattedKey,
  } = options;

  if (format === 'text-context') {
    const componentName = `${entityNameKey}${formattedKey}FindParam`;
    parameters[componentName] = {
      name: key,
      in: 'query',
      required: false,
      description:
        description || `Case-insensitive regex search by \`${key}\`. Format: \`/<value>/i\`.`,
      schema: {
        type: 'string',
        example: '/bur/i',
        pattern: '^/.+/i$',
      },
    };
  }
};
