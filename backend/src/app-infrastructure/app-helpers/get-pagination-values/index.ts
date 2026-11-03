import type { TPaginationParams } from '@app-types/mongo-type/t-pagination-params';
import { PAGE_SIZE } from '@meta/const';

export type TPaginationValues =
  | { enabled: false }
  | { enabled: true; page: number; offset: number; size: number };

const getPaginationValues = (paginationParams: TPaginationParams): TPaginationValues => {
  if (paginationParams.tk <= 0) return { enabled: false };
  const size = Number(paginationParams.sz) || PAGE_SIZE;
  const page = Number(paginationParams.tk);
  return { enabled: true, page, offset: (page - 1) * size, size };
};

export default getPaginationValues;
