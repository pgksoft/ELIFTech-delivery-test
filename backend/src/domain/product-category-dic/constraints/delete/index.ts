import { productCategorySchema } from '@domain/product-category-dic/model';
import { ProductModel } from '@domain/product-dic/model';

const errMsg = 'Cannot delete category: products reference it';

const definitionProductCategoryDeleteConstraints = () => {
  productCategorySchema.pre('deleteOne', { document: true, query: false }, async function () {
    const categoryId = this._id;
    if (await ProductModel.exists({ category: categoryId })) {
      throw new Error(errMsg);
    }
  });

  productCategorySchema.pre('deleteOne', { document: false, query: true }, async function () {
    const id = this.getFilter()._id;
    if (!id) return;
    if (await ProductModel.exists({ category: id })) {
      throw new Error(errMsg);
    }
  });

  productCategorySchema.pre('findOneAndDelete', { query: true }, async function () {
    const filter = this.getFilter();
    const id = filter._id ?? (filter._id = filter.id);
    if (!id) return;
    if (await ProductModel.exists({ category: id })) {
      throw new Error(errMsg);
    }
  });
};

export default definitionProductCategoryDeleteConstraints;
