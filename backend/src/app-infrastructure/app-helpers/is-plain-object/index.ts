import type TUnknownRecord from '@app-types/t-unknown-record';
import type TypeGuard from '@app-types/type-guard';

const isPlainObject: TypeGuard<TUnknownRecord> = (v: unknown): v is TUnknownRecord =>
  v !== null && typeof v === 'object' && !Array.isArray(v);

export default isPlainObject;
