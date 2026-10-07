import { model, Schema, type Types } from 'mongoose';
import type { TEntityMongoDbMember } from '@app-types/entity/t-entity-mongodb-member';
import type { TFieldsSchema } from '@app-types/t-fields-schema';
import type TypeGuard from '@app-types/type-guard';
import { collectionNames } from '@db/const/collection-names';
import { applyMutationDateTrigger } from '@db/triggers/mutation-date';
import type { TApiProductCategory, TProductCategory } from '@domain/product-category-dic/model';
import { isStrictValidObjectId } from '@db/is-strict-valid-object-id';
import { isOneOfStringPredicate } from '@helpers/is-one-of-string-predicate';
import definitionProductDeleteConstraints from '../constraints/delete';

export type TProduct = {
  name: String;
  category: Types.ObjectId;
  mutationDate: Date;
} & TEntityMongoDbMember;

export type TProductPopulated = Omit<TProduct, 'category'> & { category: TProductCategory };

export type TApiProduct = Omit<TProductPopulated, 'category' | 'mutationDate' | '__v'> & {
  category: TApiProductCategory;
  mutationDate: String;
};

export type TApiProductKey =
  | keyof Omit<TApiProduct, 'category'>
  | `category.${keyof TApiProductCategory}`;

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

export const productSchema = new Schema<TProductSchema>(productFieldsSchema);
applyMutationDateTrigger(productSchema, { field: 'mutationDate' });
definitionProductDeleteConstraints();

export const ProductModel = model<TProductSchema>(
  collectionNames.productDic,
  productSchema,
  collectionNames.productDic,
);

// View
const productViewSchema = new Schema<TApiProduct>({}, { strict: false });
export const ProductViewModel = model<TApiProduct>(
  collectionNames.productDicView,
  productViewSchema,
  collectionNames.productDicView,
);

// Allow filter keys
export type TFilterProductKey = Extract<TApiProductKey, 'name' | 'mutationDate' | 'category._id'>;
export const allowFilterProductKeys: TFilterProductKey[] = [
  'name',
  'mutationDate',
  'category._id',
] as const;

// Allow sort keys
export type TSortProductKey = Extract<TApiProductKey, 'name' | 'category.name'>;
export const allowSortProductKeys: TSortProductKey[] = ['name', 'category.name'] as const;

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

export const isFilterProductKey = isOneOfStringPredicate(allowFilterProductKeys);

export const isSortProductKey = isOneOfStringPredicate(allowSortProductKeys);
