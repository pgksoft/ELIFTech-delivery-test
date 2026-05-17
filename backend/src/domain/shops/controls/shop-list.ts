import type TEntityMutationResult from '@app-types/entity/t-entity-mutation-result';
import type TUnknownRecord from '@app-types/t-unknown-record';
import { ShopModel } from '../model';
import type { TApiShop, TApiShops, TShopPopulated, TShopSchema } from '../model';
import { analyzeMongoError } from '@db/analyze-mongo-error';
import { getCrudResultSuccessJson } from '@helpers/send-mutation-result/crud-result';
import { shopPopulateConfig, shopSerializationRules } from '../const/serialization&populate-config';
import { listPopulateAndSerialize } from '@db/populate-&-serialize';

export const shopList = async (
  filter: TUnknownRecord,
): Promise<TEntityMutationResult<TApiShops>> => {
  try {
    const apiShops = await listPopulateAndSerialize<
      TShopPopulated,
      typeof shopSerializationRules,
      TApiShop,
      TShopSchema
    >(ShopModel, filter, shopSerializationRules, shopPopulateConfig);
    return getCrudResultSuccessJson(apiShops);
  } catch (e) {
    return analyzeMongoError(e);
  }
};
