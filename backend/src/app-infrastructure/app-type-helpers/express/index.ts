import type TSortRecord from '@app-types/mongo-type/t-sort-record';
import type TUnknownRecord from '@app-types/t-unknown-record';
import type { Logger } from 'pino';

declare global {
  namespace Express {
    interface Request {
      requestId?: string;
      queryFilter: TUnknownRecord;
      querySort: TSortRecord;
    }
    interface Locals {
      logger?: Logger;
    }
  }
}

export {};
