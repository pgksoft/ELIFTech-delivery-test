import { Router } from 'express';
import { shopList } from '../controls/shop-list';
import sendMutationResult from '@helpers/send-mutation-result';
import { isShopMutationDto } from '../model';
import { getCrudResultError } from '@helpers/send-mutation-result/crud-result';
import { shopCreate } from '../controls/shop-create';
import { MONGODB_TITLE } from '@db/const/mongodb_title';
import { isStrictValidObjectId } from '@db/is-strict-valid-object-id';
import { shopUpdate } from '../controls/shop-update';

const router = Router();

export default router;

/**
 * @openapi
 * /api/shops:
 *   get:
 *     tags: [Shops]
 *     summary: Get shop list
 *     security: []
 *     responses:
 *       200:
 *         description: Shop list
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ShopList'
 */
router.get('/', async (req, res) => {
  const result = await shopList({});
  sendMutationResult(result, res);
});

/**
 * @openapi
 * /api/shops:
 *   post:
 *     tags: [Shops]
 *     summary: Create a new shop name
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ShopMutationDto'
 *     security: []
 *     responses:
 *       201:
 *         description: Shop name successfully created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Shop'
 *       400:
 *         description: Invalid input
 */
router.post('/', async (req, res) => {
  const shopMutationDto = req.body;
  const isMutationShop = isShopMutationDto(shopMutationDto);
  if (!isMutationShop) {
    return sendMutationResult(getCrudResultError(400), res);
  }
  const result = await shopCreate(shopMutationDto);
  return sendMutationResult(result, res);
});

/**
 * @openapi
 * /api/shops/{id}:
 *   put:
 *     tags: [Shops]
 *     summary: Update an existing shop name
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
 *             $ref: '#/components/schemas/ShopMutationDto'
 *     security: []
 *     responses:
 *       200:
 *         description: Shop name successfully updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Shop'
 *       400:
 *         description: Invalid input or ID
 *       404:
 *         description: Task not found
 */
router.put('/:id', async (req, res) => {
  const id = req.params.id;
  if (!isStrictValidObjectId(id)) {
    return sendMutationResult(getCrudResultError(400, MONGODB_TITLE.invalidId), res);
  }
  const shopMutationDto = req.body;
  const isMutationShop = isShopMutationDto(shopMutationDto);
  if (!isMutationShop) {
    return sendMutationResult(getCrudResultError(400), res);
  }
  const result = await shopUpdate(id, shopMutationDto);
  return sendMutationResult(result, res);
});
