import type TEntityMutationResult from '@app-types/entity/t-entity-mutation-result';
import { ShopModel, type TShop } from '../model';
import {
  getCrudResultError,
  getCrudResultSuccessJson,
} from '@helpers/send-mutation-result/crud-result';
import { analyzeMongoError } from '@db/analyze-mongo-error';

export const shopRemove = async (id: string): Promise<TEntityMutationResult<TShop>> => {
  try {
    const shop = await ShopModel.findByIdAndDelete({ _id: id }).lean();
    if (!shop) return getCrudResultError(404);
    return getCrudResultSuccessJson(shop, 204);
  } catch (e) {
    return analyzeMongoError(e);
  }
};
