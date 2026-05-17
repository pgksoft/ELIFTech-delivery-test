import { findByIdPopulateAndSerialize } from '@db/populate-&-serialize/helpers/find-by-id-populate-and-serialize';
import type { TCreatePayloadForModel, TPopulateNode } from '@db/populate-&-serialize/types';
import type TUnknownRecord from '@infra/app-type-helpers/t-unknown-record';
import type { RulesFor } from '@serialization/dsl-types';
import type { ClientSession, Model } from 'mongoose';

export const createPopulateAndSerialize = async <
  TDbPopulated extends TUnknownRecord, // populated type
  TRules extends RulesFor<TDbPopulated>,
  TApi extends TUnknownRecord,
  TModelSchema extends TUnknownRecord, // schema type
>(
  model: Model<TModelSchema>,
  payload: TCreatePayloadForModel<TModelSchema>,
  rules: TRules,
  populateConfig?: TPopulateNode | TPopulateNode[],
  session?: ClientSession,
): Promise<TApi | null> => {
  const created = await model.create([payload], { session });
  const result = await findByIdPopulateAndSerialize<TDbPopulated, TRules, TApi, TModelSchema>(
    model,
    String(created[0]._id),
    rules,
    populateConfig,
    session,
  );

  if (!result) return null;

  return result;
};
