import type TEntityMutationResult from '@app-types/entity/t-entity-mutation-result';
import type TUnknownRecord from '@app-types/t-unknown-record';
import {
  ShopProductsViewModel,
  type TApiShopProduct,
  type TApiShopProducts,
  type TShopProductPopulated,
} from '../model';
import { shopProductSerializationRules } from '../const/serialization&populate-config/selecting-products-by-shop';
import { getCrudResultSuccessList } from '@helpers/send-mutation-result/crud-result';
import { analyzeMongoError } from '@db/analyze-mongo-error';
import { serializeEntity } from '@serialization/index';
import type TSortRecord from '@app-types/mongo-type/t-sort-record';
import type { TPaginationParams } from '@app-types/mongo-type/t-pagination-params';
import getPaginationValues from '@helpers/get-pagination-values';
import createListQuery from '@helpers/create-list-query';

export const shopProductList = async (
  rawFilter: TUnknownRecord,
  rawSort: TSortRecord,
  rawPage: TPaginationParams,
): Promise<TEntityMutationResult<TApiShopProducts>> => {
  try {
    const paginationValues = getPaginationValues(rawPage);
    const listQuery = createListQuery(ShopProductsViewModel, rawFilter, rawSort, paginationValues);
    const [apiShopProducts, total] = await Promise.all([
      listQuery.lean<TShopProductPopulated[]>(),
      ShopProductsViewModel.countDocuments(rawFilter),
    ]);
    const apiShopProductsSerialize = apiShopProducts.map((doc) =>
      serializeEntity<TShopProductPopulated, TApiShopProduct>(doc, shopProductSerializationRules),
    );
    return getCrudResultSuccessList(apiShopProductsSerialize, total, paginationValues);
  } catch (e) {
    return analyzeMongoError(e);
  }
};
