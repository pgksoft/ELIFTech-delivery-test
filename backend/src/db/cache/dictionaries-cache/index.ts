import { ShopModel } from '@domain/shops/model';
import { ProductCategoryModel } from '@domain/product-category-dic/model';
import type { TFilterCheckboxItem, TFilterCheckboxItems } from '@app-types/t-filter-checkbox-items';
import { logger } from '@logger/index';
import { analyzeMongoError } from '@db/analyze-mongo-error';

class DictionariesCache {
  private shopCheckboxes: TFilterCheckboxItems = [];
  private categoryCheckboxes: TFilterCheckboxItems = [];

  public async load(): Promise<void> {
    try {
      const shops = await ShopModel.find({}).lean();
      this.shopCheckboxes = shops.map((item) => {
        return {
          key: item._id.toString(),
          title: item.name.toString(),
          value: false,
        } satisfies TFilterCheckboxItem;
      });

      const categories = await ProductCategoryModel.find({}).lean();
      this.categoryCheckboxes = categories.map((item) => {
        return {
          key: item._id.toString(),
          title: item.name.toString(),
          value: false,
        } satisfies TFilterCheckboxItem;
      });
    } catch (error) {
      logger.error(analyzeMongoError(error), 'Failed to preload dictionaries cache:');
    }
  }

  public getShops(): TFilterCheckboxItems {
    return this.shopCheckboxes;
  }

  public getCategories(): TFilterCheckboxItems {
    return this.categoryCheckboxes;
  }
}

export const dictionariesCache = new DictionariesCache();
