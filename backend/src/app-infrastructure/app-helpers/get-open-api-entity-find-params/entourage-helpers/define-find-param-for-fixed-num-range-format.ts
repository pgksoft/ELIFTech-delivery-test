import type TDefineFindParamOptions from './t-define-find-param-options';

export const defineFindParamForFixedNumRangeFormat = <T extends string>(
  options: TDefineFindParamOptions<T>,
) => {
  const { entityNameKey, parameters, config, formattedKey } = options;

  if (config.format === 'fixed-num-range') {
    const { key, fixedRanges, description } = config;

    const gteKey = `${key}[gte]`;
    const lteKey = `${key}[lte]`;

    const gteComponentName = `${entityNameKey}${formattedKey}GteFindParam`;
    const lteComponentName = `${entityNameKey}${formattedKey}LteFindParam`;

    let rangesHint = '';
    if (fixedRanges && fixedRanges.length > 0) {
      const listStr = fixedRanges
        .map((r) => `\n\n• **${r.title}** → \`gte: ${r.fromNum}\`, \`lte: ${r.toNum}\``)
        .join('\n');
      rangesHint = `\n\nAllowed fixed ranges:\n\n${listStr}`;
    }

    parameters[gteComponentName] = {
      name: gteKey,
      in: 'query',
      required: false,
      description:
        (description || `Fixed numerical range filter for \`${key}\`.`) +
        ` (Lower bound / gte).` +
        rangesHint,
      schema: {
        type: 'number',
        example: fixedRanges?.[0]?.fromNum ?? 0,
      },
    };

    parameters[lteComponentName] = {
      name: lteKey,
      in: 'query',
      required: false,
      description:
        (description || `Fixed numerical range filter for \`${key}\`.`) +
        ` (Upper bound / lte).` +
        rangesHint,
      schema: {
        type: 'number',
        example: fixedRanges?.[0]?.toNum ?? 10,
      },
    };
  }
};
