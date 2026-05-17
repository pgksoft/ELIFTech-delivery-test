import type { TEntityRecord } from '@app-types/entity/t-entity-data';
import type { TEntityMongoDbMember } from '@app-types/entity/t-entity-mongodb-member';
import type { TFieldsSchema } from '@app-types/t-fields-schema';
import type TypeGuard from '@app-types/type-guard';
import { collectionNames } from '@db/const/collection-names';
import { applyMutationDateTrigger } from '@db/triggers/mutation-date';
import { model, Schema } from 'mongoose';

export type TProductCategory = { name: String; mutationDate: Date } & TEntityMongoDbMember;

export type TProductCategoryPopulated = TProductCategory;

export type TApiProductCategory = Omit<TProductCategoryPopulated, 'mutationDate'> & {
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
    minLength: 5,
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

const productCategorySchema = new Schema<TProductCategorySchema>(productCategoryFieldsSchema);
applyMutationDateTrigger(productCategorySchema, { field: 'mutationDate' });

export const ProductCategoryModel = model<TProductCategorySchema>(
  collectionNames.productCategoryDic,
  productCategorySchema,
  collectionNames.productCategoryDic,
);

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
