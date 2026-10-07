import type { TEntityMongoDbMember } from '@app-types/entity/t-entity-mongodb-member';
import type { TFieldsSchema } from '@app-types/t-fields-schema';
import type TypeGuard from '@app-types/type-guard';
import { collectionNames } from '@db/const/collection-names';
import { applyMutationDateTrigger } from '@db/triggers/mutation-date';
import { isOneOfStringPredicate } from '@helpers/is-one-of-string-predicate';
import { model, Schema } from 'mongoose';
import definitionShopDeleteConstraints from '../constraints/delete';

export type TShop = { name: String; rating: number; mutationDate: Date } & TEntityMongoDbMember;

export type TShopPopulated = TShop;

export type TApiShop = Omit<TShopPopulated, 'mutationDate' | '__v'> & { mutationDate: String };

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

export const shopSchema = new Schema<TShopSchema>(shopFieldsSchema);
applyMutationDateTrigger(shopSchema, { field: 'mutationDate' });
definitionShopDeleteConstraints();

export const ShopModel = model<TShopSchema>(
  collectionNames.shops,
  shopSchema,
  collectionNames.shops,
);

// Allow filter keys
export type TFilterShopKey = keyof Pick<TApiShop, 'name' | 'rating' | 'mutationDate'>;
export const allowFilterShopKeys: TFilterShopKey[] = ['name', 'rating', 'mutationDate'] as const;

// Allow sort keys
export type TSortShopKey = keyof Pick<TApiShop, 'name' | 'rating'>;
export const allowSortShopKeys: TSortShopKey[] = ['name', 'rating'] as const;

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

export const isFilterShopKey = isOneOfStringPredicate(allowFilterShopKeys);

export const isSortShopKey = isOneOfStringPredicate(allowSortShopKeys);
