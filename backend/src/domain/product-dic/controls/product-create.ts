import type TEntityMutationResult from '@app-types/entity/t-entity-mutation-result';
import type { TApiProduct, TProductMutationDto, TProductPopulated, TProductSchema } from '../model';
import { ProductModel } from '../model';
import { createPopulateAndSerialize } from '@db/populate-&-serialize';
import {
  productPopulateConfig,
  productSerializationRules,
} from '../const/serialization&populate-config';
import {
  getCrudResultError,
  getCrudResultSuccessJson,
} from '@helpers/send-mutation-result/crud-result';
import { analyzeMongoError } from '@db/analyze-mongo-error';
import type { ClientSession } from 'mongoose';
import { ensureCategoryExists } from '../guards';

export const productCreate = async (
  productMutationDto: TProductMutationDto,
  session: ClientSession,
): Promise<TEntityMutationResult<TApiProduct>> => {
  try {
    await ensureCategoryExists(productMutationDto.category, session);

    const apiProduct = await createPopulateAndSerialize<
      TProductPopulated,
      typeof productSerializationRules,
      TApiProduct, // API DTO
      TProductSchema // schema type
    >(ProductModel, productMutationDto, productSerializationRules, productPopulateConfig, session);

    if (!apiProduct) return getCrudResultError(464);
    return getCrudResultSuccessJson(apiProduct, 201);
  } catch (e) {
    await session.abortTransaction();
    return analyzeMongoError(e);
  }
};
