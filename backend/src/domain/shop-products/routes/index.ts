import { Router } from 'express';
import { shoppingCartProductList } from '../controls/shopping-cart-product-list';
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

const router = Router();

export default router;

/**
 * @openapi
 * /api/shop-products:
 *   get:
 *     tags: [ShopProducts]
 *     summary: Get lists of products in stores
 *     security: []
 *     responses:
 *       200:
 *         description: Lists of products in stores
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ShoppingCartList'
 */
router.get('/', async (req, res) => {
  const result = await shoppingCartProductList({ ...req.query });
  sendMutationResult(result, res);
});

/**
 * @openapi
 * /api/shop-products/{id}/store:
 *   get:
 *     tags: [ShopProducts]
 *     summary: Get list of products in store
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
 *         description: Lists of products in store
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ShopProductList'
 */
router.get('/:id/store', async (req, res) => {
  const id = req.params.id;
  if (!isStrictValidObjectId(id)) {
    return sendMutationResult(getCrudResultError(400, MONGODB_TITLE.invalidId), res);
  }
  const result = await shopProductList({ shop: id });
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
 *         description: File uploaded
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
