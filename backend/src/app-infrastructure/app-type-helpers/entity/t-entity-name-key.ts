import { getArrayAsStringConst } from '@helpers/get-array-as-string-const';

export const entityNameKeys = getArrayAsStringConst(
  'shops',
  'productDic',
  'productCategoryDic',
  'shopProducts',
  'shoppingCart',
  'customers',
  'guestLog',
  'actionLog',
);

export type TEntityNameKeys = (typeof entityNameKeys)[number];

export type TTEntityNameKeyViews = `${TEntityNameKeys}View`;
