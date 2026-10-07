import type { TCamelToKebab } from '@app-types/camel-to-kebab';
import type { TEntityNameKeys, TTEntityNameKeyViews } from '@app-types/entity/t-entity-name-key';

type TCollectionNames = { [K in TEntityNameKeys]: TCamelToKebab<K> } & {
  [K in TTEntityNameKeyViews]: TCamelToKebab<K>;
};

export const collectionNames = {
  shops: 'shops',
  shopsView: 'shops-view',
  customers: 'customers',
  customersView: 'customers-view',
  productCategoryDic: 'product-category-dic',
  productCategoryDicView: 'product-category-dic-view',
  productDic: 'product-dic',
  productDicView: 'product-dic-view',
  shopProducts: 'shop-products',
  shopProductsView: 'shop-products-view',
  shoppingCart: 'shopping-cart',
  shoppingCartView: 'shopping-cart-view',
  guestLog: 'guest-log',
  guestLogView: 'guest-log-view',
  actionLog: 'action-log',
  actionLogView: 'action-log-view',
} as const satisfies TCollectionNames;
