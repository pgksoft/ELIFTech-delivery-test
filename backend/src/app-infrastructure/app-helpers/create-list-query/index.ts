import type TSortRecord from '@app-types/mongo-type/t-sort-record';
import type TUnknownRecord from '@app-types/t-unknown-record';
import type TMongoListQuery from '@db/db-type-helpers/t-mongo-list-query';
import type { TPaginationValues } from '@helpers/get-pagination-values';
import type { Model } from 'mongoose';

const createListQuery = <TApiEntity>(
  model: Model<TApiEntity>,
  rawFilter: TUnknownRecord,
  rawSort: TSortRecord,
  paginationValues: TPaginationValues,
): TMongoListQuery<TApiEntity> => {
  const query = model.find(rawFilter).sort(rawSort);

  if (paginationValues.enabled) {
    query.skip(paginationValues.offset).limit(paginationValues.size);
  }

  return query;
};

export default createListQuery;
