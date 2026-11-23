import type TDefineFindParamOptions from './t-define-find-param-options';

export const defineFindParamForDateRangeFormat = <T extends string>(
  options: TDefineFindParamOptions<T>,
) => {
  const {
    entityNameKey,
    parameters,
    config: { key, format, description },
    formattedKey,
  } = options;

  if (format === 'date-range') {
    const gteKey = `${key}[gte]`;
    const lteKey = `${key}[lte]`;

    const gteComponentName = `${entityNameKey}${formattedKey}GteFindParam`;
    const lteComponentName = `${entityNameKey}${formattedKey}LteFindParam`;

    parameters[gteComponentName] = {
      name: gteKey,
      in: 'query',
      required: false,
      description: description
        ? `${description} (Start Date / From)`
        : `Date range start (gte) for \`${key}\`.`,
      schema: {
        type: 'string',
        format: 'date-time',
        example: '2026-01-01T00:00:00',
      },
    };

    parameters[lteComponentName] = {
      name: lteKey,
      in: 'query',
      required: false,
      description: description
        ? `${description} (End Date / To)`
        : `Date range end (lte) for \`${key}\`.`,
      schema: {
        type: 'string',
        format: 'date-time',
        example: '2026-12-31T23:59:59',
      },
    };
  }
};
