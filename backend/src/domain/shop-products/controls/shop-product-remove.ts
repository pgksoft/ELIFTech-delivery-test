import type TEntityMutationResult from '@app-types/entity/t-entity-mutation-result';
import { ShopProductModel, type TShopProduct } from '../model';
import {
  getCrudResultError,
  getCrudResultSuccessJson,
} from '@helpers/send-mutation-result/crud-result';
import { analyzeMongoError } from '@db/analyze-mongo-error';

export const shopProductRemove = async (
  id: string,
): Promise<TEntityMutationResult<TShopProduct>> => {
  try {
    const shopProduct = await ShopProductModel.findByIdAndDelete({ _id: id }).lean();
    if (!shopProduct) return getCrudResultError(404);
    return getCrudResultSuccessJson(shopProduct, 204);
  } catch (e) {
    return analyzeMongoError(e);
  }
};
