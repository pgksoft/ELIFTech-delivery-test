import type { Request, Response, NextFunction, RequestHandler } from 'express';
import { runInTransaction } from '@db/run-In-transaction';
import type { ClientSession } from 'mongoose';
import type TUnknownRecord from '@app-types/t-unknown-record';

export function withTransaction<
  P extends TUnknownRecord,
  ResBody extends TUnknownRecord = any,
  ReqBody extends TUnknownRecord = any,
  ReqQuery extends TUnknownRecord = any,
>(
  handler: (
    req: Request<P, ResBody, ReqBody, ReqQuery>,
    res: Response,
    session: ClientSession,
  ) => Promise<any>,
): RequestHandler {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await runInTransaction(async (session) => {
        return handler(req as Request<P, ResBody, ReqBody, ReqQuery>, res, session);
      });
      if (!res.headersSent) {
        res.json(result);
      }
    } catch (err) {
      next(err);
    }
  };
}
