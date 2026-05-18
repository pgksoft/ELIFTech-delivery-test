import { getQueryFromPopulateConfig } from '@db/populate-&-serialize/helpers/get-query-from-populate-config';
import { populateManyAndSerialize } from '@db/populate-&-serialize/helpers/populate-many-and-serialize';
import type { TMongooseQueryMany, TPopulateNode } from '@db/populate-&-serialize/types';
import type TUnknownRecord from '@infra/app-type-helpers/t-unknown-record';
import type { RulesFor } from '@serialization/dsl-types';
import type { Model } from 'mongoose';

export const listPopulateAndSerialize = async <
  TDbPopulated extends TUnknownRecord, // populated type
  TRules extends RulesFor<TDbPopulated>,
  TApi,
  TModelSchema extends TUnknownRecord, // schema type
>(
  model: Model<TModelSchema>,
  filter: TUnknownRecord,
  rules: TRules,
  populateConfig?: TPopulateNode | TPopulateNode[],
): Promise<TApi[]> => {
  let query = model.find(filter) as TMongooseQueryMany<TModelSchema>;

  if (populateConfig) {
    query = getQueryFromPopulateConfig<TModelSchema, TMongooseQueryMany<TModelSchema>>(
      query,
      populateConfig,
    );
  }

  return populateManyAndSerialize<TDbPopulated, TRules, TApi, TModelSchema>(query, rules);
};
