import type TEntityMutationResult from '@app-types/entity/t-entity-mutation-result';
import type TUnknownRecord from '@app-types/t-unknown-record';
import {
  ShopProductsViewModel,
  type TApiShopProduct,
  type TApiShopProducts,
  type TShopProductPopulated,
} from '../model';
import { shopProductSerializationRules } from '../const/serialization&populate-config/selecting-products-by-shop';
import { getCrudResultSuccessJson } from '@helpers/send-mutation-result/crud-result';
import { analyzeMongoError } from '@db/analyze-mongo-error';
import { serializeEntity } from '@serialization/index';
import type TSortRecord from '@app-types/mongo-type/t-sort-record';

export const shopProductList = async (
  rawFilter: TUnknownRecord,
  rawSort: TSortRecord,
): Promise<TEntityMutationResult<TApiShopProducts>> => {
  try {
    const [apiShopProducts, total] = await Promise.all([
      ShopProductsViewModel.find(rawFilter).sort(rawSort).lean<TShopProductPopulated[]>(),
      ShopProductsViewModel.countDocuments(rawFilter),
    ]);
    const apiShopProductsSerialize = apiShopProducts.map((doc) =>
      serializeEntity<TShopProductPopulated, TApiShopProduct>(doc, shopProductSerializationRules),
    );
    return getCrudResultSuccessJson(apiShopProductsSerialize);
  } catch (e) {
    return analyzeMongoError(e);
  }
};
