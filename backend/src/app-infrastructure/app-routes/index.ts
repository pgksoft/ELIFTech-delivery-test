import { apiPublicUrl } from '@api/const/api-url';
import APP_TITLE from '@infra/const/app-title';
import type { Express } from 'express';
import shopsRouter from '@domain/shops/routes';
import productDicRouter from '@domain/product-dic/routes';
import productCategoryDicRouter from '@domain/product-category-dic/routes';
import shopProductsRouter from '@domain/shop-products/routes';

export const appRoutes = (app: Express) => {
  // Public Url

  app.get(apiPublicUrl.server, (req, res) => {
    res.send(`${APP_TITLE.hi}, ${APP_TITLE.serverName}: ${APP_TITLE.name}!`);
  });

  app.use(apiPublicUrl.shops, shopsRouter);
  app.use(apiPublicUrl.productDic, productDicRouter);
  app.use(apiPublicUrl.productCategoryDic, productCategoryDicRouter);
  app.use(apiPublicUrl.shopProducts, shopProductsRouter);
};
