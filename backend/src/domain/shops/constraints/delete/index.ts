import { ShopProductModel } from '@domain/shop-products/model';
import { shopSchema } from '@domain/shops/model';

const errMsg = 'Cannot delete product: products in stores reference it';

const definitionShopDeleteConstraints = () => {
  shopSchema.pre('deleteOne', { document: true, query: false }, async function () {
    const shopId = this._id;
    if (await ShopProductModel.exists({ shop: shopId })) {
      throw new Error(errMsg);
    }
  });

  shopSchema.pre('deleteOne', { document: false, query: true }, async function () {
    const id = this.getFilter()._id;
    if (!id) return;
    if (await ShopProductModel.exists({ shop: id })) {
      throw new Error(errMsg);
    }
  });

  shopSchema.pre('findOneAndDelete', { query: true }, async function () {
    const filter = this.getFilter();
    const id = filter._id ?? (filter._id = filter.id);
    if (!id) return;
    if (await ShopProductModel.exists({ shop: id })) {
      throw new Error(errMsg);
    }
  });
};

export default definitionShopDeleteConstraints;
