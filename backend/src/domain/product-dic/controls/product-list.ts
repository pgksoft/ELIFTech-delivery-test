import type TEntityMutationResult from '@app-types/entity/t-entity-mutation-result';
import type TUnknownRecord from '@app-types/t-unknown-record';
import type { TApiProduct, TApiProductDic, TProductPopulated } from '../model';
import { ProductViewModel } from '../model';
import { productSerializationRules } from '../const/serialization&populate-config';
import { getCrudResultSuccessJson } from '@helpers/send-mutation-result/crud-result';
import { analyzeMongoError } from '@db/analyze-mongo-error';
import { serializeEntity } from '@serialization/index';
import type TSortRecord from '@app-types/mongo-type/t-sort-record';

export const productList = async (
  rawFilter: TUnknownRecord,
  rawSort: TSortRecord,
): Promise<TEntityMutationResult<TApiProductDic>> => {
  try {
    const [apiProductDic, total] = await Promise.all([
      ProductViewModel.find(rawFilter).sort(rawSort).lean<TProductPopulated[]>(),
      ProductViewModel.countDocuments(rawFilter),
    ]);
    const apiProductDicSerialize = apiProductDic.map((doc) =>
      serializeEntity<TProductPopulated, TApiProduct>(doc, productSerializationRules),
    );
    return getCrudResultSuccessJson(apiProductDicSerialize);
  } catch (e) {
    return analyzeMongoError(e);
  }
};
