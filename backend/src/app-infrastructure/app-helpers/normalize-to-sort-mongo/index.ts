import type TSortRecord from '@app-types/mongo-type/t-sort-record';
import type TUnknownRecord from '@app-types/t-unknown-record';
import type { SortOrder } from 'mongoose';

const normalizeToSortMongo = (raw: TUnknownRecord): TSortRecord => {
  const out: TSortRecord = {};
  for (const [key, val] of Object.entries(raw)) {
    const direction = toDirection(val);
    if (direction !== null) out[key] = direction;
  }
  return out;
};

export default normalizeToSortMongo;

// Helpers
const toDirection = (v: unknown): SortOrder | null => {
  if (
    v === 1 ||
    v === '1' ||
    String(v).toLowerCase() === 'asc' ||
    String(v).toLowerCase() === 'ascending'
  )
    return 1;
  if (
    v === -1 ||
    v === '-1' ||
    String(v).toLowerCase() === 'desc' ||
    String(v).toLowerCase() === 'descending'
  )
    return -1;
  return null;
};
