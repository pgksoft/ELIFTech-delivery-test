import type { TMongooseQueryMany, TMongooseQueryOne } from '@db/populate-&-serialize/types';
import type TUnknownRecord from '@infra/app-type-helpers/t-unknown-record';

// Apply multiple populate configurations
export const applyPopulateMany = <TModelSchema extends TUnknownRecord>(
  query: TMongooseQueryOne<TModelSchema> | TMongooseQueryMany<TModelSchema>,
  configs: Array<(q: typeof query) => typeof query>,
) => configs.reduce((acc, fn) => fn(acc), query);
