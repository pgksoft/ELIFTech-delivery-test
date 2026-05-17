import type { RulesFor } from '@serialization/dsl-types';
import type { TShopPopulated } from '../model';
import { buildPopulateConfigFromRules } from '@db/populate-&-serialize/helpers/build-populate-config-from-rules';

export const shopSerializationRules: RulesFor<TShopPopulated> = {
  mutationDate: { kind: 'date' },
  _id: { kind: 'objectId' },
  __v: { kind: 'exclude' },
} as const;

export const shopPopulateConfig = buildPopulateConfigFromRules(shopSerializationRules);
