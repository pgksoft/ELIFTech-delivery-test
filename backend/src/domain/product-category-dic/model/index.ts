import type { TEntityRecord } from '@app-types/entity/t-entity-data';
import type { TEntityMongoDbMember } from '@app-types/entity/t-entity-mongodb-member';
import type { TFieldsSchema } from '@app-types/t-fields-schema';
import type TypeGuard from '@app-types/type-guard';
import { collectionNames } from '@db/const/collection-names';
import { applyMutationDateTrigger } from '@db/triggers/mutation-date';
import { model, Schema } from 'mongoose';
import definitionProductCategoryDeleteConstraints from '../constraints/delete';
import { isOneOfStringPredicate } from '@helpers/is-one-of-string-predicate';

export type TProductCategory = { name: String; mutationDate: Date } & TEntityMongoDbMember;

export type TProductCategoryPopulated = TProductCategory;

export type TApiProductCategory = Omit<TProductCategoryPopulated, 'mutationDate' | '__v'> & {
  mutationDate: String;
};

export type TProductCategoryDic = TProductCategory[];

export type TApiProductCategoryDic = TApiProductCategory[];

export type TProductCategorySchema = Omit<TProductCategory, '_id' | '__v'>;

export type TProductCategoryMutationDto = Omit<TProductCategorySchema, 'mutationDate'>;

export const productCategoryFieldsSchema: TFieldsSchema<TProductCategorySchema> = {
  name: {
    type: String,
    required: true,
    unique: true,
    minLength: 3,
    maxLength: 160,
    openApi: { description: 'Product category name' },
  },
  mutationDate: {
    type: Date,
    required: true,
    openApi: {
      type: 'string',
      format: 'date-time',
      description:
        'Product category name mutation datetime in ISO 8601 format (UTC). Server autocomplete',
    },
  },
};

export const productCategorySchema = new Schema<TProductCategorySchema>(
  productCategoryFieldsSchema,
);
definitionProductCategoryDeleteConstraints();
applyMutationDateTrigger(productCategorySchema, { field: 'mutationDate' });

export const ProductCategoryModel = model<TProductCategorySchema>(
  collectionNames.productCategoryDic,
  productCategorySchema,
  collectionNames.productCategoryDic,
);

// Allow filter keys
export type TFilterProductCategoryKey = keyof Pick<TApiProductCategory, 'name' | 'mutationDate'>;
export const allowFilterProductCategoryKeys: TFilterProductCategoryKey[] = [
  'name',
  'mutationDate',
] as const;

// Allow sort keys
export type TSortProductCategoryKey = keyof Pick<TApiProductCategory, 'name'>;
export const allowSortProductCategoryKeys: TSortProductCategoryKey[] = ['name'] as const;

// helpers
export const isProductCategoryMutationDto: TypeGuard<TProductCategoryMutationDto> = (
  value,
): value is TProductCategoryMutationDto => {
  return (
    value !== null &&
    typeof value === 'object' &&
    'name' in value &&
    typeof (value as TEntityRecord).name === 'string'
  );
};

export const isFilterProductCategoryKey = isOneOfStringPredicate(allowFilterProductCategoryKeys);

export const isSortProductCategoryKey = isOneOfStringPredicate(allowSortProductCategoryKeys);
