import type TEntityMutationResult from '@app-types/entity/t-entity-mutation-result';
import { ProductCategoryModel, type TProductCategory } from '../model';
import {
  getCrudResultError,
  getCrudResultSuccessJson,
} from '@helpers/send-mutation-result/crud-result';
import { analyzeMongoError } from '@db/analyze-mongo-error';

export const productCategoryRemove = async (
  id: string,
): Promise<TEntityMutationResult<TProductCategory>> => {
  try {
    const productCategory = await ProductCategoryModel.findByIdAndDelete({ _id: id }).lean();
    if (!productCategory) return getCrudResultError(404);
    return getCrudResultSuccessJson(productCategory, 204);
  } catch (e) {
    return analyzeMongoError(e);
  }
};
