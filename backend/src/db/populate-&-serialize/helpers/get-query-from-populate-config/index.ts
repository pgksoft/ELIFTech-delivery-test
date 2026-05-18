import type TUnknownRecord from '@infra/app-type-helpers/t-unknown-record';
import type {
  TMongooseQueryMany,
  TMongooseQueryOne,
  TPopulateNode,
} from '@db/populate-&-serialize/types';

// Apply populate-config to query
export const getQueryFromPopulateConfig = <
  TModelSchema extends TUnknownRecord,
  TQuery extends TMongooseQueryOne<TModelSchema> | TMongooseQueryMany<TModelSchema>,
>(
  query: TQuery,
  config?: TPopulateNode | TPopulateNode[],
): TQuery => {
  if (!config) return query;

  const nodes = Array.isArray(config) ? config : [config];

  let q: any = query;
  for (const node of nodes) {
    q = q.populate(node);
  }

  return q as TQuery;
};
