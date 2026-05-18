import type TEntityMutationResult from '@app-types/entity/t-entity-mutation-result';
import { ShopModel } from '../model';
import type { TApiShop, TShopMutationDto, TShopPopulated, TShopSchema } from '../model';
import { createPopulateAndSerialize } from '@db/populate-&-serialize';
import { shopPopulateConfig, shopSerializationRules } from '../const/serialization&populate-config';
import {
  getCrudResultError,
  getCrudResultSuccessJson,
} from '@helpers/send-mutation-result/crud-result';
import { analyzeMongoError } from '@db/analyze-mongo-error';

export const shopCreate = async (
  shopMutationDto: TShopMutationDto,
): Promise<TEntityMutationResult<TApiShop>> => {
  try {
    const apiShop = await createPopulateAndSerialize<
      TShopPopulated,
      typeof shopSerializationRules,
      TApiShop, // API DTO
      TShopSchema // schema type
    >(ShopModel, shopMutationDto, shopSerializationRules, shopPopulateConfig);

    if (!apiShop) return getCrudResultError(464);
    return getCrudResultSuccessJson(apiShop, 201);
  } catch (e) {
    return analyzeMongoError(e);
  }
};
