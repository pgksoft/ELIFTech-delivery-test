import type { TAsyncAppMiddleware } from '@app-types/middleware';
import { analyzeMongoError } from '@db/analyze-mongo-error';
import sendMutationResult from '@helpers/send-mutation-result';
import { isShopProductMutationDto } from '../model';
import { getCrudResultError } from '@helpers/send-mutation-result/crud-result';
import { isStrictValidObjectId } from '@db/is-strict-valid-object-id';
import { MONGODB_TITLE } from '@db/const/mongodb_title';

// export const updateValidator: TAsyncAppMiddleware = async (req, res, next) => {
export const updateValidator: TAsyncAppMiddleware = async (req, res, next) => {
  try {
    // Rule 1
    const { id } = req.params;
    if (!isStrictValidObjectId((typeof id === 'string' && id) || '')) {
      return sendMutationResult(getCrudResultError(400, MONGODB_TITLE.invalidId), res);
    }

    // Rule 2: At least one field must be provided
    const { file } = req;
    const shopProductMutationDto = req.body;
    if (!isShopProductMutationDto(shopProductMutationDto) && !file) {
      return sendMutationResult(
        getCrudResultError(400, 'Bad request: At least one field must be provided'),
        res,
      );
    }
    // If all checks passed → continue
    next();
  } catch (e) {
    return sendMutationResult(analyzeMongoError(e), res);
  }
};
