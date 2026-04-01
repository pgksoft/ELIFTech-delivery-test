import type { Logger } from 'pino';

declare global {
  namespace Express {
    interface Request {
      requestId?: string;
    }
    interface Locals {
      logger?: Logger;
    }
  }
}

export {};
