import type { TAsyncAppMiddleware } from '@app-types/middleware';
import { analyzeMongoError } from '@db/analyze-mongo-error';
import sendMutationResult from '@helpers/send-mutation-result';
import { isShopProductMutationDto } from '../model';
import { getCrudResultError } from '@helpers/send-mutation-result/crud-result';
import { logger } from '@logger/index';

export const createValidator: TAsyncAppMiddleware = async (req, res, next) => {
  // Rule: All fields must be provided
  try {
    const { file } = req;
    const shopProductMutationDto = req.body;
    logger.debug({ shopProductMutationDto }, 'shop-product createValidator');
    logger.debug({ file }, 'shop-product createValidator');
    if (!isShopProductMutationDto(shopProductMutationDto) || !file) {
      return sendMutationResult(
        getCrudResultError(400, 'Bad request: All fields must be provided'),
        res,
      );
    }
    // If all checks passed → continue
    next();
  } catch (e) {
    return sendMutationResult(analyzeMongoError(e), res);
  }
};
