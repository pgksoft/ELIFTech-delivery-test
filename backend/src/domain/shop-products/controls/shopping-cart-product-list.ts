import type TEntityMutationResult from '@app-types/entity/t-entity-mutation-result';
import type TUnknownRecord from '@app-types/t-unknown-record';
import {
  ShopProductModel,
  type TApiShoppingCartProduct,
  type TApiShoppingCartProducts,
  type TShoppingCartProductPopulated,
  type TShopProductSchema,
} from '../model';
import { listPopulateAndSerialize } from '@db/populate-&-serialize';
import {
  shoppingCartPopulateConfig,
  shoppingCartSerializationRules,
} from '../const/serialization&populate-config/shopping-cart';
import { getCrudResultSuccessJson } from '@helpers/send-mutation-result/crud-result';
import { analyzeMongoError } from '@db/analyze-mongo-error';

export const shoppingCartProductList = async (
  filter: TUnknownRecord,
): Promise<TEntityMutationResult<TApiShoppingCartProducts>> => {
  try {
    const apiShoppingCartProducts = await listPopulateAndSerialize<
      TShoppingCartProductPopulated,
      typeof shoppingCartSerializationRules,
      TApiShoppingCartProduct,
      TShopProductSchema
    >(ShopProductModel, filter, shoppingCartSerializationRules, shoppingCartPopulateConfig);
    return getCrudResultSuccessJson(apiShoppingCartProducts);
  } catch (e) {
    return analyzeMongoError(e);
  }
};
