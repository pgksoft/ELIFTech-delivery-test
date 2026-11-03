import type TEntityMutationResult from '@app-types/entity/t-entity-mutation-result';
import type TUnknownRecord from '@app-types/t-unknown-record';
import type { TApiProduct, TApiProductDic, TProductPopulated } from '../model';
import { ProductViewModel } from '../model';
import { productSerializationRules } from '../const/serialization&populate-config';
import { getCrudResultSuccessList } from '@helpers/send-mutation-result/crud-result';
import { analyzeMongoError } from '@db/analyze-mongo-error';
import { serializeEntity } from '@serialization/index';
import type TSortRecord from '@app-types/mongo-type/t-sort-record';
import type { TPaginationParams } from '@app-types/mongo-type/t-pagination-params';
import createListQuery from '@helpers/create-list-query';
import getPaginationValues from '@helpers/get-pagination-values';

export const productList = async (
  rawFilter: TUnknownRecord,
  rawSort: TSortRecord,
  rawPage: TPaginationParams,
): Promise<TEntityMutationResult<TApiProductDic>> => {
  try {
    const paginationValues = getPaginationValues(rawPage);
    const listQuery = createListQuery(ProductViewModel, rawFilter, rawSort, paginationValues);
    const [apiProductDic, total] = await Promise.all([
      listQuery.lean<TProductPopulated[]>(),
      ProductViewModel.countDocuments(rawFilter),
    ]);
    const apiProductDicSerialize = apiProductDic.map((doc) =>
      serializeEntity<TProductPopulated, TApiProduct>(doc, productSerializationRules),
    );
    return getCrudResultSuccessList(apiProductDicSerialize, total, paginationValues);
  } catch (e) {
    return analyzeMongoError(e);
  }
};
