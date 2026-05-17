import type TUnknownRecord from '@infra/app-type-helpers/t-unknown-record';
import type { Model } from 'mongoose';

// Populate-tree node.
export type TPopulateNode =
  | {
      path: string;
      populate?: TPopulateNode | TPopulateNode[];
    }
  | {
      path: string;
      populate?: undefined;
    };

//Query types are based on the model type (schema type), not the serialization type
export type TMongooseQueryOne<TModelSchema extends TUnknownRecord> =
  | ReturnType<Model<TModelSchema>['findOne']>
  | ReturnType<Model<TModelSchema>['findById']>;

export type TMongooseQueryMany<TModelSchema extends TUnknownRecord> = ReturnType<
  Model<TModelSchema>['find']
>;

// Populate configurators work with Query models
export type TPopulateConfiguratorOne<TModelSchema extends TUnknownRecord> = (
  query: TMongooseQueryOne<TModelSchema>,
) => TMongooseQueryOne<TModelSchema>;

export type TPopulateConfiguratorMany<TModelSchema extends TUnknownRecord> = (
  query: TMongooseQueryMany<TModelSchema>,
) => TMongooseQueryMany<TModelSchema>;

export type TCreatePayloadForModel<TModelSchema> = Parameters<Model<TModelSchema>['create']>[0];
