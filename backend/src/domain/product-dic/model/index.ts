import { model, Schema, type Types } from 'mongoose';
import type { TEntityMongoDbMember } from '@app-types/entity/t-entity-mongodb-member';
import type { TFieldsSchema } from '@app-types/t-fields-schema';
import type TypeGuard from '@app-types/type-guard';
import { collectionNames } from '@db/const/collection-names';
import { applyMutationDateTrigger } from '@db/triggers/mutation-date';
import type { TApiProductCategory, TProductCategory } from '@domain/product-category-dic/model';
import { isStrictValidObjectId } from '@db/is-strict-valid-object-id';

export type TProduct = {
  name: String;
  category: Types.ObjectId;
  mutationDate: Date;
} & TEntityMongoDbMember;

export type TProductPopulated = Omit<TProduct, 'category'> & { category: TProductCategory };

export type TApiProduct = Omit<TProductPopulated, 'category' | 'mutationDate'> & {
  category: TApiProductCategory;
  mutationDate: String;
};

export type TProductDic = TProduct[];

export type TApiProductDic = TApiProduct[];

export type TProductSchema = Omit<TProduct, '_id' | '__v'>;

export type TProductMutationDto = Omit<TProductSchema, 'mutationDate'>;

export const productFieldsSchema: TFieldsSchema<TProductSchema> = {
  name: {
    type: String,
    required: true,
    unique: true,
    maxLength: 160,
    openApi: { description: 'Product name' },
  },
  category: {
    type: Schema.Types.ObjectId,
    ref: collectionNames.productCategoryDic,
    required: true,
    index: true,
    openApi: { description: 'ID of the product category name' },
  },
  mutationDate: {
    type: Date,
    required: true,
    openApi: {
      type: 'string',
      format: 'date-time',
      description: 'Product name mutation datetime in ISO 8601 format (UTC). Server autocomplete',
    },
  },
};

const productSchema = new Schema<TProductSchema>(productFieldsSchema);
applyMutationDateTrigger(productSchema, { field: 'mutationDate' });

export const ProductModel = model<TProductSchema>(
  collectionNames.productDic,
  productSchema,
  collectionNames.productDic,
);

// helpers
export const isProductMutationDto: TypeGuard<TProductMutationDto> = (
  value,
): value is TProductMutationDto => {
  return (
    value !== null &&
    typeof value === 'object' &&
    'name' in value &&
    typeof value.name === 'string' &&
    'category' in value &&
    typeof value.category === 'string' &&
    isStrictValidObjectId(value.category as string)
  );
};
