import type TEntityMutationResult from '@app-types/entity/t-entity-mutation-result';
import { ProductModel, type TProduct } from '../model';
import {
  getCrudResultError,
  getCrudResultSuccessJson,
} from '@helpers/send-mutation-result/crud-result';
import { analyzeMongoError } from '@db/analyze-mongo-error';

export const productRemove = async (id: string): Promise<TEntityMutationResult<TProduct>> => {
  try {
    const product = await ProductModel.findByIdAndDelete({ _id: id }).lean();
    if (!product) return getCrudResultError(404);
    return getCrudResultSuccessJson(product, 204);
  } catch (e) {
    return analyzeMongoError(e);
  }
};
