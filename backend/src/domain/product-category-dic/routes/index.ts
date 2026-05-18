import sendMutationResult from '@helpers/send-mutation-result';
import { Router } from 'express';
import { productCategoryList } from '../controls/product-category-list';
import { isProductCategoryMutationDto } from '../model';
import { getCrudResultError } from '@helpers/send-mutation-result/crud-result';
import { productCategoryCreate } from '../controls/product-category-create';
import { isStrictValidObjectId } from '@db/is-strict-valid-object-id';
import { MONGODB_TITLE } from '@db/const/mongodb_title';
import { productCategoryUpdate } from '../controls/product-category-update';

const router = Router();

export default router;

/**
 * @openapi
 * /api/product-category-dic:
 *   get:
 *     tags: [ProductCategoryDic]
 *     summary: Get product category dictionary
 *     security: []
 *     responses:
 *       200:
 *         description: Product category dictionary
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ProductCategoryList'
 */
router.get('/', async (req, res) => {
  const result = await productCategoryList({});
  sendMutationResult(result, res);
});

/**
 * @openapi
 * /api/product-category-dic:
 *   post:
 *     tags: [ProductCategoryDic]
 *     summary: Create a new product category name
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ProductCategoryMutationDto'
 *     security: []
 *     responses:
 *       201:
 *         description: Product category name successfully created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ProductCategory'
 *       400:
 *         description: Invalid input
 */
router.post('/', async (req, res) => {
  const productCategoryMutationDto = req.body;
  const isMutationProductCategoryDto = isProductCategoryMutationDto(productCategoryMutationDto);
  if (!isMutationProductCategoryDto) {
    return sendMutationResult(getCrudResultError(400), res);
  }
  const result = await productCategoryCreate(productCategoryMutationDto);
  return sendMutationResult(result, res);
});

/**
 * @openapi
 * /api/product-category-dic/{id}:
 *   put:
 *     tags: [ProductCategoryDic]
 *     summary: Update an existing product category name
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
 *             $ref: '#/components/schemas/ProductCategoryMutationDto'
 *     security: []
 *     responses:
 *       200:
 *         description: Product category name successfully updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ProductCategory'
 *       400:
 *         description: Invalid input or ID
 *       404:
 *         description: Product not found
 */
router.put('/:id', async (req, res) => {
  const id = req.params.id;
  if (!isStrictValidObjectId(id)) {
    return sendMutationResult(getCrudResultError(400, MONGODB_TITLE.invalidId), res);
  }
  const productCategoryMutationDto = req.body;
  const isMutationProductCategoryDto = isProductCategoryMutationDto(productCategoryMutationDto);
  if (!isMutationProductCategoryDto) {
    return sendMutationResult(getCrudResultError(400), res);
  }
  const result = await productCategoryUpdate(id, productCategoryMutationDto);
  return sendMutationResult(result, res);
});
