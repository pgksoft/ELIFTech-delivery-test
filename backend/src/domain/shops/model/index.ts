import type { TEntityRecord } from '@app-types/entity/t-entity-data';
import type { TEntityMongoDbMember } from '@app-types/entity/t-entity-mongodb-member';
import type { TFieldsSchema } from '@app-types/t-fields-schema';
import type TypeGuard from '@app-types/type-guard';
import { collectionNames } from '@db/const/collection-names';
import { applyMutationDateTrigger } from '@db/triggers/mutation-date';
import { model, Schema } from 'mongoose';

export type TShop = { name: String; rating: number; mutationDate: Date } & TEntityMongoDbMember;

export type TShopPopulated = TShop;

export type TApiShop = Omit<TShopPopulated, 'mutationDate'> & { mutationDate: String };

export type TShops = TShop[];

export type TApiShops = TApiShop[];

export type TShopSchema = Omit<TShop, '_id' | '__v'>;

export type TShopMutationDto = Omit<TShopSchema, 'mutationDate'>;

export const shopFieldsSchema: TFieldsSchema<TShopSchema> = {
  name: {
    type: String,
    required: true,
    unique: true,
    minLength: 5,
    maxLength: 160,
    openApi: { description: 'Shop name' },
  },
  rating: {
    type: Number,
    required: true,
    min: 0,
    max: 50,
    default: 0,
    openApi: {
      type: 'integer',
      description:
        'Shop rating, must stored as integer 0–50 (mapped to 0.0–5.0 with 0.1 increments)',
    },
  },
  mutationDate: {
    type: Date,
    required: true,
    openApi: {
      type: 'string',
      format: 'date-time',
      description: 'Shop name mutation datetime in ISO 8601 format (UTC). Server autocomplete',
    },
  },
};

const shopSchema = new Schema<TShopSchema>(shopFieldsSchema);
applyMutationDateTrigger(shopSchema, { field: 'mutationDate' });

export const ShopModel = model<TShopSchema>(
  collectionNames.shops,
  shopSchema,
  collectionNames.shops,
);

// helpers
export const isShopMutationDto: TypeGuard<TShopMutationDto> = (
  value,
): value is TShopMutationDto => {
  return (
    value !== null &&
    typeof value === 'object' &&
    'name' in value &&
    typeof value.name === 'string' &&
    'rating' in value &&
    typeof value.rating === 'number'
  );
};
