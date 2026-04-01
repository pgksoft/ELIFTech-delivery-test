import type { Request, Response, NextFunction } from 'express';

export type TAppMiddleware = (req: Request, res: Response, next: NextFunction) => void;

export type TAsyncAppMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction,
) => Promise<void>;

export type TAppHandler = TAppMiddleware | TAsyncAppMiddleware;
