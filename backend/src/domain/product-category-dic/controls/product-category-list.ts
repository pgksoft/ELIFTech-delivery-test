import type TEntityMutationResult from '@app-types/entity/t-entity-mutation-result';
import type TUnknownRecord from '@app-types/t-unknown-record';
import type {
  TApiProductCategory,
  TApiProductCategoryDic,
  TProductCategoryPopulated,
  TProductCategorySchema,
} from '../model';
import { ProductCategoryModel } from '../model';
import { listPopulateAndSerialize } from '@db/populate-&-serialize';
import {
  productCategoryPopulateConfig,
  productCategorySerializationRules,
} from '../const/serialization&populate-config';
import { getCrudResultSuccessJson } from '@helpers/send-mutation-result/crud-result';
import { analyzeMongoError } from '@db/analyze-mongo-error';
import type TSortRecord from '@app-types/mongo-type/t-sort-record';

export const productCategoryList = async (
  rawFilter: TUnknownRecord,
  rawSort: TSortRecord,
): Promise<TEntityMutationResult<TApiProductCategoryDic>> => {
  try {
    const apiProductCategoryDic = await listPopulateAndSerialize<
      TProductCategoryPopulated,
      typeof productCategorySerializationRules,
      TApiProductCategory,
      TProductCategorySchema
    >(
      ProductCategoryModel,
      rawFilter,
      rawSort,
      productCategorySerializationRules,
      productCategoryPopulateConfig,
    );
    return getCrudResultSuccessJson(apiProductCategoryDic);
  } catch (e) {
    return analyzeMongoError(e);
  }
};
