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
import { getCrudResultSuccessList } from '@helpers/send-mutation-result/crud-result';
import { analyzeMongoError } from '@db/analyze-mongo-error';
import type TSortRecord from '@app-types/mongo-type/t-sort-record';
import type { TPaginationParams } from '@app-types/mongo-type/t-pagination-params';
import getPaginationValues from '@helpers/get-pagination-values';

export const productCategoryList = async (
  rawFilter: TUnknownRecord,
  rawSort: TSortRecord,
  rawPage: TPaginationParams,
): Promise<TEntityMutationResult<TApiProductCategoryDic>> => {
  try {
    const paginationValues = getPaginationValues(rawPage);
    const [apiProductCategoryDic, total] = await Promise.all([
      listPopulateAndSerialize<
        TProductCategoryPopulated,
        typeof productCategorySerializationRules,
        TApiProductCategory,
        TProductCategorySchema
      >(
        ProductCategoryModel,
        rawFilter,
        rawSort,
        productCategorySerializationRules,
        paginationValues,
        productCategoryPopulateConfig,
      ),
      ProductCategoryModel.countDocuments(rawFilter),
    ]);
    return getCrudResultSuccessList(apiProductCategoryDic, total, paginationValues);
  } catch (e) {
    return analyzeMongoError(e);
  }
};
