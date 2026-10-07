import { productSchema } from '@domain/product-dic/model';
import { ShopProductModel } from '@domain/shop-products/model';

const errMsg = 'Cannot delete product: products in stores reference it';

const definitionProductDeleteConstraints = () => {
  productSchema.pre('deleteOne', { document: true, query: false }, async function () {
    const productId = this._id;
    if (await ShopProductModel.exists({ product: productId })) {
      throw new Error(errMsg);
    }
  });

  productSchema.pre('deleteOne', { document: false, query: true }, async function () {
    const id = this.getFilter()._id;
    if (!id) return;
    if (await ShopProductModel.exists({ product: id })) {
      throw new Error(errMsg);
    }
  });

  productSchema.pre('findOneAndDelete', { query: true }, async function () {
    const filter = this.getFilter();
    const id = filter._id ?? (filter._id = filter.id);
    if (!id) return;
    if (await ShopProductModel.exists({ product: id })) {
      throw new Error(errMsg);
    }
  });
};

export default definitionProductDeleteConstraints;
