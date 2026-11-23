import { Router } from 'express';
import sendMutationResult from '@helpers/send-mutation-result';
import { shopProductList } from '../controls/shop-product-list';
import { isStrictValidObjectId } from '@db/is-strict-valid-object-id';
import { getCrudResultError } from '@helpers/send-mutation-result/crud-result';
import { MONGODB_TITLE } from '@db/const/mongodb_title';
import { uploadSingleToMemory } from '@infra/multer';
import { createValidator } from '../validators/create-validator';
import { withTransaction } from '@middleware/with-transaction';
import { shopProductCreate } from '../controls/shop-product-create';
import { shopProductImage } from '../controls/shop-product-image';
import checkingAllowKeysEntityFilter from '@middleware/checking-allow-keys-entity-filter';
import { isFilterShopProductKey, isSortShopProductKey, ShopProductsViewModel } from '../model';
import { shopProductRemove } from '../controls/shop-product-remove';
import { updateValidator } from '../validators/update-validator';
import { shopProductUpdate } from '../controls/shop-product-update';
import checkingPage from '@middleware/checking-page';
import normalizeToFilterMongo from '@helpers/normalize-to-filter-mongo';

const router = Router();

export default router;

/**
 * @openapi
 * /api/shop-products:
 *   get:
 *     tags: [ShopProducts]
 *     summary: Get lists of products in stores
 *     security: []
 *     parameters:
 *       - $ref: '#/components/parameters/PageTake'
 *       - $ref: '#/components/parameters/PageSize'
 *       - $ref: '#/components/parameters/shopProductsShopNameSortParam'
 *       - $ref: '#/components/parameters/shopProductsShopRatingSortParam'
 *       - $ref: '#/components/parameters/shopProductsProductNameSortParam'
 *       - $ref: '#/components/parameters/shopProductsProductCategoryNameSortParam'
 *       - $ref: '#/components/parameters/shopProductsPriceSortParam'
 *       - $ref: '#/components/parameters/shopProductsProductNameFindParam'
 *       - $ref: '#/components/parameters/shopProductsMutationDateGteFindParam'
 *       - $ref: '#/components/parameters/shopProductsMutationDateLteFindParam'
 *       - $ref: '#/components/parameters/shopProductsShopRatingGteFindParam'
 *       - $ref: '#/components/parameters/shopProductsShopRatingLteFindParam'
 *       - $ref: '#/components/parameters/shopProductsShop_idFindParam'
 *       - $ref: '#/components/parameters/shopProductsProductCategory_idFindParam'
 *     responses:
 *       200:
 *         description: Lists of products in stores
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ShoppingCartList'
 */
router.get(
  '/',
  checkingAllowKeysEntityFilter(isFilterShopProductKey, isSortShopProductKey),
  checkingPage({ model: ShopProductsViewModel }),
  async (req, res) => {
    const result = await shopProductList(req.queryFilter, req.querySort, req.page, req.total);
    sendMutationResult(result, res);
  },
);

/**
 * @openapi
 * /api/shop-products/{id}/store:
 *   get:
 *     tags: [ShopProducts]
 *     summary: Get list of products in store
 *     security: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           pattern: "^[a-fA-F0-9]{24}$"
 *       - $ref: '#/components/parameters/PageTake'
 *       - $ref: '#/components/parameters/PageSize'
 *       - $ref: '#/components/parameters/shopProductsProductNameSortParam'
 *       - $ref: '#/components/parameters/shopProductsProductCategoryNameSortParam'
 *       - $ref: '#/components/parameters/shopProductsPriceSortParam'
 *       - $ref: '#/components/parameters/shopProductsProductNameFindParam'
 *       - $ref: '#/components/parameters/shopProductsMutationDateGteFindParam'
 *       - $ref: '#/components/parameters/shopProductsMutationDateLteFindParam'
 *     responses:
 *       200:
 *         description: Lists of products in store
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ShopProductList'
 */
router.get(
  '/:id/store',
  checkingAllowKeysEntityFilter(isFilterShopProductKey, isSortShopProductKey),
  checkingPage({ model: ShopProductsViewModel, idFilter: 'shop._id' }),
  async (req, res) => {
    const id = req.params.id;
    if (typeof id !== 'string' || !isStrictValidObjectId(id)) {
      return sendMutationResult(getCrudResultError(400, MONGODB_TITLE.invalidId), res);
    }
    const idFiler = normalizeToFilterMongo({ 'shop._id': [id] });
    const result = await shopProductList(
      { ...req.queryFilter, ...idFiler },
      req.querySort,
      req.page,
      req.total,
    );
    sendMutationResult(result, res);
  },
);

/**
 * @openapi
 * /api/shop-products/{id}/image:
 *   get:
 *     tags: [ShopProducts]
 *     summary: Get store product image
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           pattern: "^[a-fA-F0-9]{24}$"
 *     security: []
 *     responses:
 *       200:
 *         description: Get binary image file. Use as `<img src="/api/shop-products/{id}/image" />` or fetch as blob.
 *         content:
 *           image/png:
 *             schema:
 *               type: string
 *               format: binary
 *           image/jpeg:
 *             schema:
 *               type: string
 *               format: binary
 *           application/octet-stream:
 *             schema:
 *               type: string
 *               format: binary
 *       304:
 *         description: Not Modified. Client cache is fresh.
 *       400:
 *         description: Invalid id
 *       404:
 *         description: Image not found
 */
router.get('/:id/image', async (req, res) => {
  const id = req.params.id;
  if (!isStrictValidObjectId(id)) {
    return sendMutationResult(getCrudResultError(400, MONGODB_TITLE.invalidId), res);
  }
  const result = await shopProductImage(id);

  sendMutationResult(result, res);
});

/**
 * @openapi
 * /api/shop-products:
 *   post:
 *     tags: [ShopProducts]
 *     summary: Add (create) new product to store & upload product image
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             $ref: '#/components/schemas/ShopProductCreateDto'
 *     responses:
 *       201:
 *         description: Product to store successfully created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ShoppingCartList'
 *       400:
 *         description: Invalid input
 */
router.post(
  '/',
  uploadSingleToMemory,
  createValidator,
  withTransaction(async (req, res, session) => {
    const result = await shopProductCreate(req.body, req.file!, session);
    return sendMutationResult(result, res);
  }),
);

/**
 * @openapi
 * /api/shop-products/{id}:
 *   put:
 *     tags: [ShopProducts]
 *     summary: Update an existing product to store and/or upload product image
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ShopProductBaseDto'
 *         multipart/form-data:
 *           schema:
 *             anyOf:
 *               - $ref: '#/components/schemas/ShopProductCreateDto'
 *               - $ref: '#/components/schemas/ShopProductUploadImageDto'
 *     security: []
 *     responses:
 *       200:
 *         description: Product to store successfully updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ShoppingCartList'
 *       400:
 *         description: Invalid input or ID
 *       404:
 *         description: Record not found
 */
router.put(
  '/:id',
  uploadSingleToMemory,
  updateValidator,
  withTransaction<{ id: string }>(async (req, res, session) => {
    const id = req.params.id;
    if (!isStrictValidObjectId(id)) {
      return sendMutationResult(getCrudResultError(400, MONGODB_TITLE.invalidId), res);
    }
    const result = await shopProductUpdate(id, req.body, req.file ?? null, session);
    return sendMutationResult(result, res);
  }),
);

/**
 * @openapi
 * /api/shop-products/{id}:
 *   delete:
 *     tags: [ShopProducts]
 *     summary: Delete an existing product in shop
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     security: []
 *     responses:
 *       204:
 *         description: Existing product in shop successfully deleted
 *       400:
 *         description: Invalid ID
 *       404:
 *         description: Product in shop not found
 */
router.delete('/:id', async (req, res) => {
  const id = req.params.id;
  if (!isStrictValidObjectId(id)) {
    return sendMutationResult(getCrudResultError(400, MONGODB_TITLE.invalidId), res);
  }
  const result = await shopProductRemove(id);
  return sendMutationResult(result, res);
});
