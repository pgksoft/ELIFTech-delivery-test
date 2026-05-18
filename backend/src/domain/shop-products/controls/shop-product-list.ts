import type TEntityMutationResult from '@app-types/entity/t-entity-mutation-result';
import type TUnknownRecord from '@app-types/t-unknown-record';
import {
  ShopProductModel,
  type TApiShopProduct,
  type TApiShopProducts,
  type TShopProductPopulated,
  type TShopProductSchema,
} from '../model';
import { listPopulateAndSerialize } from '@db/populate-&-serialize';
import {
  shopProductPopulateConfig,
  shopProductSerializationRules,
} from '../const/serialization&populate-config/selecting-products-by-shop';
import { getCrudResultSuccessJson } from '@helpers/send-mutation-result/crud-result';
import { analyzeMongoError } from '@db/analyze-mongo-error';

export const shopProductList = async (
  filter: TUnknownRecord,
): Promise<TEntityMutationResult<TApiShopProducts>> => {
  try {
    const apiShopProducts = await listPopulateAndSerialize<
      TShopProductPopulated,
      typeof shopProductSerializationRules,
      TApiShopProduct,
      TShopProductSchema
    >(ShopProductModel, filter, shopProductSerializationRules, shopProductPopulateConfig);
    return getCrudResultSuccessJson(apiShopProducts);
  } catch (e) {
    return analyzeMongoError(e);
  }
};
