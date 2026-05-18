import type { RulesFor } from '@serialization/dsl-types';
import type { TProductPopulated } from '../model';
import { buildPopulateConfigFromRules } from '@db/populate-&-serialize/helpers/build-populate-config-from-rules';
import { productCategorySerializationRules } from '@domain/product-category-dic/const/serialization&populate-config';

export const productSerializationRules: RulesFor<TProductPopulated> = {
  category: { kind: 'entityOf', rules: productCategorySerializationRules },
  mutationDate: { kind: 'date' },
  _id: { kind: 'objectId' },
  __v: { kind: 'exclude' },
} as const;

export const productPopulateConfig = buildPopulateConfigFromRules(productSerializationRules);
