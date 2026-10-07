import type { ClientSession } from 'mongoose';
import {
  ShopProductModel,
  type TApiShopProduct,
  type TShopProductMutationDto,
  type TShopProductPopulated,
  type TShopProductSchema,
} from '../model';
import type TEntityMutationResult from '@app-types/entity/t-entity-mutation-result';
import { ensureProductExists, ensureShopExists } from '../guards';
import { updatePopulateAndSerialize } from '@db/populate-&-serialize';
import {
  getCrudResultError,
  getCrudResultSuccessJson,
} from '@helpers/send-mutation-result/crud-result';
import { analyzeMongoError } from '@db/analyze-mongo-error';
import { MULTER_REQUEST_KEY } from '@infra/multer';
import type TUnknownRecord from '@app-types/t-unknown-record';
import {
  shopProductPopulateConfig,
  shopProductSerializationRules,
} from '../const/serialization&populate-config/selecting-products-by-shop';

export const shopProductUpdate = async (
  id: string,
  shopProductMutationDto: TShopProductMutationDto | null,
  file: Express.Multer.File | null,
  session: ClientSession,
): Promise<TEntityMutationResult<TApiShopProduct>> => {
  try {
    const patch: Partial<TShopProductSchema> = {};

    if (shopProductMutationDto) {
      await ensureShopExists(shopProductMutationDto.shop, session);
      await ensureProductExists(shopProductMutationDto.product, session);
      Object.assign(patch, shopProductMutationDto);
    }

    if (file) {
      patch.fileMeta = {
        originalname: file.originalname,
        mimetype: file.mimetype,
        size: file.size,
      };
      // MULTER_REQUEST_KEY === 'image'
      (patch as TUnknownRecord)[MULTER_REQUEST_KEY] = file.buffer;
    }

    const apiShopProduct = await updatePopulateAndSerialize<
      TShopProductPopulated,
      typeof shopProductSerializationRules,
      TApiShopProduct,
      TShopProductSchema
    >(
      ShopProductModel,
      id,
      patch,
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
