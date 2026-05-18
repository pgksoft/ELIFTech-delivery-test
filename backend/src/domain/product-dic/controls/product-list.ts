import type TEntityMutationResult from '@app-types/entity/t-entity-mutation-result';
import type TUnknownRecord from '@app-types/t-unknown-record';
import type { TApiProduct, TApiProductDic, TProductPopulated, TProductSchema } from '../model';
import { ProductModel } from '../model';
import { listPopulateAndSerialize } from '@db/populate-&-serialize';
import {
  productPopulateConfig,
  productSerializationRules,
} from '../const/serialization&populate-config';
import { getCrudResultSuccessJson } from '@helpers/send-mutation-result/crud-result';
import { analyzeMongoError } from '@db/analyze-mongo-error';

export const productList = async (
  filter: TUnknownRecord,
): Promise<TEntityMutationResult<TApiProductDic>> => {
  try {
    // logger.debug({ filter }, 'productList');
    const apiProductDic = await listPopulateAndSerialize<
      TProductPopulated,
      typeof productSerializationRules,
      TApiProduct,
      TProductSchema
    >(ProductModel, filter, productSerializationRules, productPopulateConfig);
    return getCrudResultSuccessJson(apiProductDic);
  } catch (e) {
    return analyzeMongoError(e);
  }
};
