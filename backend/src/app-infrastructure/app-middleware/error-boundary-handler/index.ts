import { analyzeMongoError } from '@db/analyze-mongo-error';
import sendMutationResult from '@helpers/send-mutation-result';
import { logger } from '@logger/index';
import type { Request, Response, NextFunction } from 'express';

export const errorBoundaryHandler = (
  err: unknown,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (!err) return next();
  if (res.headersSent) return next(err);
  logger.error({ err, path: req.path, method: req.method }, 'Unhandled error');
  return sendMutationResult(analyzeMongoError(err), res);
};
