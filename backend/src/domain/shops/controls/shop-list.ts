import type TEntityMutationResult from '@app-types/entity/t-entity-mutation-result';
import type TUnknownRecord from '@app-types/t-unknown-record';
import { ShopModel } from '../model';
import type { TApiShop, TApiShops, TShopPopulated, TShopSchema } from '../model';
import { analyzeMongoError } from '@db/analyze-mongo-error';
import { getCrudResultSuccessList } from '@helpers/send-mutation-result/crud-result';
import { shopPopulateConfig, shopSerializationRules } from '../const/serialization&populate-config';
import { listPopulateAndSerialize } from '@db/populate-&-serialize';
import type TSortRecord from '@app-types/mongo-type/t-sort-record';
import type { TPaginationParams } from '@app-types/mongo-type/t-pagination-params';
import getPaginationValues from '@helpers/get-pagination-values';

export const shopList = async (
  rawFilter: TUnknownRecord,
  rawSort: TSortRecord,
  rawPage: TPaginationParams,
  total: number,
): Promise<TEntityMutationResult<TApiShops>> => {
  try {
    const paginationValues = getPaginationValues(rawPage);
    const apiShops = await listPopulateAndSerialize<
      TShopPopulated,
      typeof shopSerializationRules,
      TApiShop,
      TShopSchema
    >(ShopModel, rawFilter, rawSort, shopSerializationRules, paginationValues, shopPopulateConfig);
    return getCrudResultSuccessList(apiShops, total, paginationValues);
  } catch (e) {
    return analyzeMongoError(e);
  }
};
