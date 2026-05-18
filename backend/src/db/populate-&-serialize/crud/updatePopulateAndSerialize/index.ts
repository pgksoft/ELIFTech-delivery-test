import { findByIdPopulateAndSerialize } from '@db/populate-&-serialize/helpers/find-by-id-populate-and-serialize';
import type { TPopulateNode } from '@db/populate-&-serialize/types';
import type TUnknownRecord from '@infra/app-type-helpers/t-unknown-record';
import type { RulesFor } from '@serialization/dsl-types';
import type { ClientSession, Model, UpdateQuery } from 'mongoose';

export const updatePopulateAndSerialize = async <
  TDbPopulated extends TUnknownRecord, // populated type
  TRules extends RulesFor<TDbPopulated>,
  TApi extends TUnknownRecord,
  TModelSchema extends TUnknownRecord, // schema type
>(
  model: Model<TModelSchema>,
  id: string,
  patch: UpdateQuery<TModelSchema>,
  rules: TRules,
  populateConfig?: TPopulateNode | TPopulateNode[],
  session?: ClientSession,
): Promise<TApi | null> => {
  await model.findByIdAndUpdate(
    id,
    { $set: patch },
    {
      new: true,
      runValidators: true,
      context: 'query',
      returnDocument: 'after',
      session,
    },
  );

  return findByIdPopulateAndSerialize<TDbPopulated, TRules, TApi, TModelSchema>(
    model,
    id,
    rules,
    populateConfig,
    session,
  );
};
