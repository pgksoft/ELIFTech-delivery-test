import type { RulesFor } from '@serialization/dsl-types';
import type { TProductCategoryPopulated } from '../model';
import { buildPopulateConfigFromRules } from '@db/populate-&-serialize/helpers/build-populate-config-from-rules';

export const productCategorySerializationRules: RulesFor<TProductCategoryPopulated> = {
  mutationDate: { kind: 'date' },
  _id: { kind: 'objectId' },
  __v: { kind: 'exclude' },
} as const;

export const productCategoryPopulateConfig = buildPopulateConfigFromRules(
  productCategorySerializationRules,
);
