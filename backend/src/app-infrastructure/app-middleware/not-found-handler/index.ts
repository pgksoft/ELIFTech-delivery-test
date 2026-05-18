import type { Request, Response } from 'express';
import sendMutationResult from '@helpers/send-mutation-result';
import { getCrudResultError } from '@helpers/send-mutation-result/crud-result';

export const notFoundHandler = (req: Request, res: Response) => {
  return sendMutationResult(getCrudResultError(404, 'Not found'), res);
};
