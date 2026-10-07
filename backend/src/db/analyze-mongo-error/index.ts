import {
  EntityMutationError,
  type TEntityMutationError,
} from '@app-types/entity/t-entity-mutation-result';
import { MONGODB_TITLE } from '@db/const/mongodb_title';
import { getCrudResultError } from '@helpers/send-mutation-result/crud-result';
import { logger } from '@logger/index';
import { MongoServerError } from 'mongodb';

enum MongoErrorCode {
  DuplicateKey = 11000,
  ValidationFailed = 121,
  Unauthorized = 13,
  AuthFailed = 18,
  NotFound = 47,
}

export const analyzeMongoError = (e: unknown): TEntityMutationError => {
  if (e instanceof MongoServerError) {
    logger.debug(e, 'analyzeMongoError - MongoServerError');
    switch (e.code) {
      case MongoErrorCode.DuplicateKey:
        return getCrudResultError(409, MONGODB_TITLE.duplicateKey);
      case MongoErrorCode.ValidationFailed:
        return getCrudResultError(400, MONGODB_TITLE.validationFailed);
      case MongoErrorCode.Unauthorized:
        return getCrudResultError(401, MONGODB_TITLE.unauthorized);
      case MongoErrorCode.AuthFailed:
        return getCrudResultError(401, MONGODB_TITLE.authFailed);
      case MongoErrorCode.NotFound:
        return getCrudResultError(404, MONGODB_TITLE.notFound);
      default:
        return getCrudResultError(400, e.message);
    }
  }

  if (e instanceof EntityMutationError) {
    logger.debug(e, 'analyzeMongoError - EntityMutationError');
    return getCrudResultError(500, e.message || MONGODB_TITLE.unknownError);
  }

  if (e instanceof Error) {
    logger.debug(e, 'analyzeMongoError - Error');
    return getCrudResultError(500, e.message || MONGODB_TITLE.unknownError);
  }

  logger.debug(e, 'analyzeMongoError - unknownError');
  return getCrudResultError(500, MONGODB_TITLE.unknownError);
};
