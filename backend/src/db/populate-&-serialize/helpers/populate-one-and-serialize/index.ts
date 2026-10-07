import type { TMongooseQueryOne } from '@db/populate-&-serialize/types';
import type TUnknownRecord from '@infra/app-type-helpers/t-unknown-record';
import type { RulesFor } from '@serialization/dsl-types';
import { serializeEntity } from '@serialization/index';

export const populateOneAndSerialize = async <
  TDbPopulated extends TUnknownRecord, // populated type
  TRules extends RulesFor<TDbPopulated>,
  TApi,
  TModelSchema extends TUnknownRecord, // schema type
>(
  query: TMongooseQueryOne<TModelSchema>,
  rules: TRules,
): Promise<TApi | null> => {
  const populated = (await query.lean().exec()) as TDbPopulated | null;

  if (!populated) return null;
  return serializeEntity<TDbPopulated, TApi>(populated, rules);
};
