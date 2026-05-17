import type { CamelToKebab } from '@app-types/camel-to-kebab';
import type { TEntityNameKeys } from '@app-types/entity/t-entity-name-key';

export const collectionNames: Record<TEntityNameKeys, CamelToKebab<TEntityNameKeys>> = {
  shops: 'shops',
  customers: 'customers',
  productCategoryDic: 'product-category-dic',
  productDic: 'product-dic',
  shopProducts: 'shop-products',
  shoppingCart: 'shopping-cart',
  guestLog: 'guest-log',
  actionLog: 'action-log',
};
