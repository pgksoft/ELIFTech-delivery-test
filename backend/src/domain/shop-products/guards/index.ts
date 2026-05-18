import { EntityMutationError } from '@app-types/entity/t-entity-mutation-result';
import { ProductModel } from '@domain/product-dic/model';
import { ShopModel } from '@domain/shops/model';
import { getCrudResultError } from '@helpers/send-mutation-result/crud-result';
import type { ClientSession, Types } from 'mongoose';

export const ensureShopExists = async (
  shopId: Types.ObjectId,
  session: ClientSession,
): Promise<void> => {
  const shopExists = await ShopModel.exists({
    _id: shopId,
  }).session(session);
  if (!shopExists) {
    throw new EntityMutationError(getCrudResultError(400, 'Shop not found'));
  }
};

export const ensureProductExists = async (
  productId: Types.ObjectId,
  session: ClientSession,
): Promise<void> => {
  const productExists = await ProductModel.exists({
    _id: productId,
  }).session(session);
  if (!productExists) {
    throw new EntityMutationError(getCrudResultError(400, 'Product not found'));
  }
};
