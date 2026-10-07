import { model, Schema, type Types } from 'mongoose';
import type { TEntityMongoDbMember } from '@app-types/entity/t-entity-mongodb-member';
import type { TApiProduct, TApiProductKey, TProductPopulated } from '@domain/product-dic/model';
import type { TApiShop, TShopPopulated } from '@domain/shops/model';
import type { TFieldsSchema } from '@app-types/t-fields-schema';
import { collectionNames } from '@db/const/collection-names';
import type TypeGuard from '@app-types/type-guard';
import type { MULTER_REQUEST_KEY } from '@infra/multer';
import { applyMutationDateTrigger } from '@db/triggers/mutation-date';
import { isStrictValidObjectId } from '@db/is-strict-valid-object-id';
import { isOnlyDigits } from '@helpers/is-only-digits';
import { isOneOfStringPredicate } from '@helpers/is-one-of-string-predicate';

export type TFileMeta = Pick<Express.Multer.File, 'originalname' | 'mimetype' | 'size'>;

export type TShopProduct = {
  shop: Types.ObjectId;
  product: Types.ObjectId;
  price: number;
  [MULTER_REQUEST_KEY]?: Buffer;
  fileMeta?: TFileMeta;
  mutationDate: Date;
} & TEntityMongoDbMember;

/**
 * For the scenario of selecting products by shop
 * */
export type TShopProductPopulated = Omit<
  TShopProduct,
  'shop' | 'product' | typeof MULTER_REQUEST_KEY
> & {
  shop: TShopPopulated;
  product: TProductPopulated;
};

export type TApiShopProduct = Omit<
  TShopProduct,
  'shop' | 'product' | typeof MULTER_REQUEST_KEY | '__v'
> & {
  shop: TApiShop;
  product: TApiProduct;
};

export type TApiShopProductKey =
  | keyof Omit<TApiShopProduct, 'shop' | 'product' | 'fileMeta'>
  | `shop.${keyof TApiShop}`
  | `product.${TApiProductKey}`
  | `fileMeta.${keyof TFileMeta}`;

export type TApiShopProducts = TApiShopProduct[];

/**
 * Definition Schema & Dto & Model
 * */
export type TShopProductSchema = Omit<TShopProduct, '_id' | '__v'>;

export type TShopProductMutationDto = Pick<TShopProductSchema, 'shop' | 'product' | 'price'>;

export const shopProductFieldsSchema: TFieldsSchema<TShopProductSchema> = {
  shop: {
    type: Schema.Types.ObjectId,
    ref: collectionNames.shops,
    required: true,
    index: true,
    openApi: { description: 'Shop ID.' },
  },
  product: {
    type: Schema.Types.ObjectId,
    ref: collectionNames.productDic,
    required: true,
    index: true,
    openApi: { description: 'Product ID.' },
  },
  fileMeta: {
    type: {
      originalname: { type: String, required: true },
      mimetype: { type: String, required: true },
      size: { type: Number, required: true },
    },
    required: false,
    openApi: { description: 'Metadata of uploaded file' },
  },
  mutationDate: {
    type: Date,
    required: true,
    openApi: {
      type: 'string',
      format: 'date-time',
      description:
        'Date and time when this record was mutated (ISO 8601, UTC). Server autocomplete',
    },
  },
  price: {
    type: Number,
    required: true,
    openApi: { type: 'integer', description: 'Product price in whole cents' },
  },
  /**
   * Filled from req.file.buffer when uploaded via memoryStorage
   * */
  image: {
    type: Buffer,
    required: false,
    select: false,
    openApi: { description: 'Binary image of an image file' },
  },
};

const shopProductSchema = new Schema<TShopProductSchema>(shopProductFieldsSchema);
applyMutationDateTrigger(shopProductSchema, { field: 'mutationDate' });
shopProductSchema.index({ shop: 1, product: 1 }, { unique: true });

export const ShopProductModel = model<TShopProductSchema>(
  collectionNames.shopProducts,
  shopProductSchema,
  collectionNames.shopProducts,
);

// View
const shopProductsViewSchema = new Schema<TApiProduct>({}, { strict: false });
export const ShopProductsViewModel = model<TApiProduct>(
  collectionNames.shopProductsView,
  shopProductsViewSchema,
  collectionNames.shopProductsView,
);

// Allow filter keys
export type TFilterShopProductsKey = Extract<
  TApiShopProductKey,
  'shop._id' | 'shop.rating' | 'product.name' | 'product.category._id' | 'mutationDate'
>;
export const allowFilterShopProductKeys: TFilterShopProductsKey[] = [
  'shop._id',
  'shop.rating',
  'product.name',
  'product.category._id',
  'mutationDate',
] as const;

// Allow sort keys
export type TSortShopProductsKey = Extract<
  TApiShopProductKey,
  'shop.name' | 'shop.rating' | 'product.name' | 'product.category.name' | 'price'
>;
export const allowSortShopProductKeys: TSortShopProductsKey[] = [
  'shop.name',
  'shop.rating',
  'product.name',
  'product.category.name',
  'price',
] as const;

// helpers
export const isShopProductMutationDto: TypeGuard<TShopProductMutationDto> = (
  value,
): value is TShopProductMutationDto => {
  return (
    value !== null &&
    typeof value === 'object' &&
    'shop' in value &&
    typeof value.shop === 'string' &&
    isStrictValidObjectId(value.shop as string) &&
    'product' in value &&
    typeof value.product === 'string' &&
    isStrictValidObjectId(value.product as string) &&
    'price' in value &&
    isOnlyDigits(value.price as string)
  );
};

export const isFilterShopProductKey = isOneOfStringPredicate(allowFilterShopProductKeys);

export const isSortShopProductKey = isOneOfStringPredicate(allowSortShopProductKeys);
