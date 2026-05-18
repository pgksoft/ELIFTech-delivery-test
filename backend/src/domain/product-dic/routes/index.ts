import sendMutationResult from '@helpers/send-mutation-result';
import { Router } from 'express';
import { productList } from '../controls/product-list';
import { isProductMutationDto } from '../model';
import { getCrudResultError } from '@helpers/send-mutation-result/crud-result';
import { productCreate } from '../controls/product-create';
import { isStrictValidObjectId } from '@db/is-strict-valid-object-id';
import { MONGODB_TITLE } from '@db/const/mongodb_title';
import { productUpdate } from '../controls/product-update';
import { withTransaction } from '@middleware/with-transaction';

const router = Router();

export default router;

/**
 * @openapi
 * /api/product-dic:
 *   get:
 *     tags: [ProductDic]
 *     summary: Get product dictionary
 *     security: []
 *     responses:
 *       200:
 *         description: Product dictionary
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ProductList'
 */
router.get('/', async (req, res) => {
  const result = await productList({ ...req.query });
  sendMutationResult(result, res);
});

/**
 * @openapi
 * /api/product-dic:
 *   post:
 *     tags: [ProductDic]
 *     summary: Create a new product name
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ProductMutationDto'
 *     security: []
 *     responses:
 *       201:
 *         description: Product name successfully created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *       400:
 *         description: Invalid input
 */
router.post(
  '/',
  withTransaction(async (req, res, session) => {
    const productMutationDto = req.body;
    const isMutationProductDto = isProductMutationDto(productMutationDto);
    if (!isMutationProductDto) {
      return sendMutationResult(getCrudResultError(400), res);
    }
    const result = await productCreate(productMutationDto, session);
    return sendMutationResult(result, res);
  }),
);

/**
 * @openapi
 * /api/product-dic/{id}:
 *   put:
 *     tags: [ProductDic]
 *     summary: Update an existing product name
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
 *             $ref: '#/components/schemas/ProductMutationDto'
 *     security: []
 *     responses:
 *       200:
 *         description: Product name successfully updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *       400:
 *         description: Invalid input or ID
 *       404:
 *         description: Product not found
 */
router.put(
  '/:id',
  withTransaction<{ id: string }>(async (req, res, session) => {
    const id = req.params.id;
    if (!isStrictValidObjectId(id)) {
      return sendMutationResult(getCrudResultError(400, MONGODB_TITLE.invalidId), res);
    }
    const productMutationDto = req.body;
    const isMutationProductDto = isProductMutationDto(productMutationDto);
    if (!isMutationProductDto) {
      return sendMutationResult(getCrudResultError(400), res);
    }
    const result = await productUpdate(id, productMutationDto, session);
    return sendMutationResult(result, res);
  }),
);
