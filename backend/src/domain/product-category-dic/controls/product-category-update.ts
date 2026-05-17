import type TEntityMutationResult from '@app-types/entity/t-entity-mutation-result';
import type {
  TApiProductCategory,
  TProductCategoryMutationDto,
  TProductCategoryPopulated,
  TProductCategorySchema,
} from '../model';
import { ProductCategoryModel } from '../model';
import { updatePopulateAndSerialize } from '@db/populate-&-serialize';
import {
  productCategoryPopulateConfig,
  productCategorySerializationRules,
} from '../const/serialization&populate-config';
import {
  getCrudResultError,
  getCrudResultSuccessJson,
} from '@helpers/send-mutation-result/crud-result';
import { analyzeMongoError } from '@db/analyze-mongo-error';

export const productCategoryUpdate = async (
  id: string,
  productCategoryMutationDto: TProductCategoryMutationDto,
): Promise<TEntityMutationResult<TApiProductCategory>> => {
  try {
    const apiProductCategory = await updatePopulateAndSerialize<
      TProductCategoryPopulated,
      typeof productCategorySerializationRules,
      TApiProductCategory,
      TProductCategorySchema
    >(
      ProductCategoryModel,
      id,
      productCategoryMutationDto,
      productCategorySerializationRules,
      productCategoryPopulateConfig,
    );

    if (!apiProductCategory) return getCrudResultError(464);
    return getCrudResultSuccessJson(apiProductCategory, 200);
  } catch (e) {
    return analyzeMongoError(e);
  }
};
