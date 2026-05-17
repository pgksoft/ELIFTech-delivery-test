import type { TMongooseQueryMany } from '@db/populate-&-serialize/types';
import type TUnknownRecord from '@infra/app-type-helpers/t-unknown-record';
import type { RulesFor } from '@serialization/dsl-types';
import { serializeEntity } from '@serialization/index';

export const populateManyAndSerialize = async <
  TDbPopulated extends TUnknownRecord,
  TRules extends RulesFor<TDbPopulated>,
  TApi,
  TModelSchema extends TUnknownRecord,
>(
  query: TMongooseQueryMany<TModelSchema>,
  rules: TRules,
): Promise<TApi[]> => {
  const populated = await query.lean<TDbPopulated[]>().exec();
  return populated.map((doc) => serializeEntity<TDbPopulated, TApi>(doc, rules));
};
