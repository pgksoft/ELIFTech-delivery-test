import type { TCamelToKebab } from '@app-types/camel-to-kebab';
import type { TEntityNameKeys } from '@app-types/entity/t-entity-name-key';
import type TValueOf from '@app-types/t-value-of';

type TAppUrlKey = 'server' | 'openApiDocs' | 'uploads';

type TAppPublicUrl = { [K in TAppUrlKey]: string } & {
  [K in TEntityNameKeys]: `/api/${TCamelToKebab<K>}`;
};

export const apiPublicUrl = {
  server: '/',
  openApiDocs: '/open-api-docs',
  shops: '/api/shops',
  productDic: '/api/product-dic',
  productCategoryDic: '/api/product-category-dic',
  shopProducts: '/api/shop-products',
  shoppingCart: '/api/shopping-cart',
  customers: '/api/customers',
  guestLog: '/api/guest-log',
  actionLog: '/api/action-log',
  uploads: '/uploads',
} as const satisfies TAppPublicUrl;

export type TApiPublicUrl = TValueOf<typeof apiPublicUrl>;

export const listApiPublicUrl: readonly TApiPublicUrl[] = Object.values(
  apiPublicUrl,
) as readonly TApiPublicUrl[];
