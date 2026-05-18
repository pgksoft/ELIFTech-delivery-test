import { EntityMutationError } from '@app-types/entity/t-entity-mutation-result';
import { ProductCategoryModel } from '@domain/product-category-dic/model';
import { getCrudResultError } from '@helpers/send-mutation-result/crud-result';
import type { ClientSession, Types } from 'mongoose';

export const ensureCategoryExists = async (
  categoryId: Types.ObjectId,
  session: ClientSession,
): Promise<void> => {
  const categoryExists = await ProductCategoryModel.exists({
    _id: categoryId,
  }).session(session);
  if (!categoryExists) {
    throw new EntityMutationError(getCrudResultError(400, 'Product category not found'));
  }
};
