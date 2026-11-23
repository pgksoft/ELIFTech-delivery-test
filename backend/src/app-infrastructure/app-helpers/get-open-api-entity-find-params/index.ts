import type { TEntityNameKeys } from '@app-types/entity/t-entity-name-key';
import getPascalCaseFromDot from '@helpers/get-pascal-case-from-dot';
import type { OpenAPIV3 } from 'openapi-types';
import { defineFindParamForTextContextFormat } from './entourage-helpers/define-find-param-for-text-context-format';
import { defineFindParamForDateRangeFormat } from './entourage-helpers/define-find-param-for-date-range-format';
import type TDefineFindParamOptions from './entourage-helpers/t-define-find-param-options';
import type { TFixedRangeItem } from '@domain/product-dic/const/rating-determination-on-fixed-ranges';
import { defineFindParamForFixedNumRangeFormat } from './entourage-helpers/define-find-param-for-fixed-num-range-format';
import type { TFilterCheckboxItems } from '@app-types/t-filter-checkbox-items';
import { defineFindParamForListCheckBoxFormat } from './entourage-helpers/define-find-param-for-list-checkbox-format';

export type TSearchFormat = 'text-context' | 'date-range' | 'fixed-num-range' | 'list-checkbox';

type TFindFieldConfigBase<T extends string = string> = {
  key: T;
  format: TSearchFormat;
  description?: string;
};

type TFindFiledTextContext = { format: 'text-context' };
type TFindFiledDateRange = { format: 'date-range' };
type TFindFiledFixedNumRange = {
  format: 'fixed-num-range';
  fixedRanges: readonly TFixedRangeItem[];
};
type TFindFiledListCheckBox = {
  format: 'list-checkbox';
  getCheckboxItems?: () => TFilterCheckboxItems;
};

export type TFindFieldConfig<T extends string = string> = TFindFieldConfigBase<T> &
  (TFindFiledTextContext | TFindFiledDateRange | TFindFiledFixedNumRange | TFindFiledListCheckBox);

export const getOpenApiEntityFindParams = <T extends string>(
  entityNameKey: TEntityNameKeys,
  findConfigs: readonly TFindFieldConfig<T>[],
): Record<string, OpenAPIV3.ParameterObject> => {
  const parameters: Record<string, OpenAPIV3.ParameterObject> = {};

  for (const config of findConfigs) {
    const { key } = config;

    const formattedKey = getPascalCaseFromDot(key);

    const defineFindParamOptions = {
      entityNameKey,
      parameters,
      formattedKey,
      config,
    } satisfies TDefineFindParamOptions<T>;

    defineFindParamForTextContextFormat(defineFindParamOptions);

    defineFindParamForDateRangeFormat(defineFindParamOptions);

    defineFindParamForFixedNumRangeFormat(defineFindParamOptions);

    defineFindParamForListCheckBoxFormat(defineFindParamOptions);
  }

  return parameters;
};
