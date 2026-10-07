import { buildPopulateConfigFromRules } from '@db/populate-&-serialize/helpers/build-populate-config-from-rules';
import { productSerializationRules } from '@domain/product-dic/const/serialization&populate-config';
import type { TShopProductPopulated } from '@domain/shop-products/model';
import { shopSerializationRules } from '@domain/shops/const/serialization&populate-config';
import type { RulesFor } from '@serialization/dsl-types';

export const shopProductSerializationRules: RulesFor<TShopProductPopulated> = {
  shop: { kind: 'entityOf', rules: shopSerializationRules },
  product: { kind: 'entityOf', rules: productSerializationRules },
  mutationDate: { kind: 'date' },
  _id: { kind: 'objectId' },
  __v: { kind: 'exclude' },
} as const;

export const shopProductPopulateConfig = buildPopulateConfigFromRules(
  shopProductSerializationRules,
);
