import type TEntityMutationResult from '@app-types/entity/t-entity-mutation-result';
import {
  ShopProductModel,
  type TApiShoppingCartProduct,
  type TShoppingCartProductPopulated,
  type TShopProductMutationDto,
  type TShopProductSchema,
} from '../model';
import type { ClientSession } from 'mongoose';
import { analyzeMongoError } from '@db/analyze-mongo-error';
import { createPopulateAndSerialize } from '@db/populate-&-serialize';
import {
  getCrudResultError,
  getCrudResultSuccessJson,
} from '@helpers/send-mutation-result/crud-result';
import {
  shoppingCartPopulateConfig,
  shoppingCartSerializationRules,
} from '../const/serialization&populate-config/shopping-cart';
import { MULTER_REQUEST_KEY } from '@infra/multer';
import { ensureProductExists, ensureShopExists } from '../guards';

export const shopProductCreate = async (
  shopProductMutationDto: TShopProductMutationDto,
  file: Express.Multer.File,
  session: ClientSession,
): Promise<TEntityMutationResult<TApiShoppingCartProduct>> => {
  try {
    await ensureShopExists(shopProductMutationDto.shop, session);
    await ensureProductExists(shopProductMutationDto.product, session);

    const { originalname, mimetype, size, buffer } = file;
    const apiShopProduct = await createPopulateAndSerialize<
      TShoppingCartProductPopulated,
      typeof shoppingCartSerializationRules,
      TApiShoppingCartProduct,
      TShopProductSchema
    >(
      ShopProductModel,
      {
        ...shopProductMutationDto,
        fileMeta: { originalname, mimetype, size },
        [MULTER_REQUEST_KEY]: buffer,
      },
      shoppingCartSerializationRules,
      shoppingCartPopulateConfig,
      session,
    );
    if (!apiShopProduct) return getCrudResultError(464);
    return getCrudResultSuccessJson(apiShopProduct, 201);
  } catch (e) {
    await session.abortTransaction();
    return analyzeMongoError(e);
  }
};
