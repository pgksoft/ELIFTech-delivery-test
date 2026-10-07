import type TEntityMutationResult from '@app-types/entity/t-entity-mutation-result';
import {
  ShopProductModel,
  type TApiShopProduct,
  type TShopProductMutationDto,
  type TShopProductPopulated,
  type TShopProductSchema,
} from '../model';
import type { ClientSession } from 'mongoose';
import { analyzeMongoError } from '@db/analyze-mongo-error';
import { createPopulateAndSerialize } from '@db/populate-&-serialize';
import {
  getCrudResultError,
  getCrudResultSuccessJson,
} from '@helpers/send-mutation-result/crud-result';
import { MULTER_REQUEST_KEY } from '@infra/multer';
import { ensureProductExists, ensureShopExists } from '../guards';
import {
  shopProductPopulateConfig,
  shopProductSerializationRules,
} from '../const/serialization&populate-config/selecting-products-by-shop';

export const shopProductCreate = async (
  shopProductMutationDto: TShopProductMutationDto,
  file: Express.Multer.File,
  session: ClientSession,
): Promise<TEntityMutationResult<TApiShopProduct>> => {
  try {
    await ensureShopExists(shopProductMutationDto.shop, session);
    await ensureProductExists(shopProductMutationDto.product, session);

    const { originalname, mimetype, size, buffer } = file;
    const apiShopProduct = await createPopulateAndSerialize<
      TShopProductPopulated,
      typeof shopProductSerializationRules,
      TApiShopProduct,
      TShopProductSchema
    >(
      ShopProductModel,
      {
        ...shopProductMutationDto,
        fileMeta: { originalname, mimetype, size },
        [MULTER_REQUEST_KEY]: buffer,
      },
      shopProductSerializationRules,
      shopProductPopulateConfig,
      session,
    );
    if (!apiShopProduct) return getCrudResultError(464);
    return getCrudResultSuccessJson(apiShopProduct, 201);
  } catch (e) {
    await session.abortTransaction();
    return analyzeMongoError(e);
  }
};
