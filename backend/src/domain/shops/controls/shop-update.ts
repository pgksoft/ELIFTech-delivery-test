import type { TApiShop, TShopMutationDto, TShopPopulated, TShopSchema } from '../model';
import { ShopModel } from '../model';
import type TEntityMutationResult from '@app-types/entity/t-entity-mutation-result';
import { updatePopulateAndSerialize } from '@db/populate-&-serialize';
import { shopPopulateConfig, shopSerializationRules } from '../const/serialization&populate-config';
import {
  getCrudResultError,
  getCrudResultSuccessJson,
} from '@helpers/send-mutation-result/crud-result';
import { analyzeMongoError } from '@db/analyze-mongo-error';

export const shopUpdate = async (
  id: string,
  shopMutationDto: TShopMutationDto,
): Promise<TEntityMutationResult<TApiShop>> => {
  try {
    const apiShop = await updatePopulateAndSerialize<
      TShopPopulated,
      typeof shopSerializationRules,
      TApiShop,
      TShopSchema
    >(ShopModel, id, shopMutationDto, shopSerializationRules, shopPopulateConfig);

    if (!apiShop) return getCrudResultError(464);
    return getCrudResultSuccessJson(apiShop, 200);
  } catch (e) {
    return analyzeMongoError(e);
  }
};
