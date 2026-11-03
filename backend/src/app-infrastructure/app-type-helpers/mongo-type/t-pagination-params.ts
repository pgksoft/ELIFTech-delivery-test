import type TypeGuard from '@app-types/type-guard';
import { isOnlyDigits } from '@helpers/is-only-digits';
import isPlainObject from '@helpers/is-plain-object';

export type TPaginationParams = { tk: number; sz?: number };

export const isPaginationParams: TypeGuard<TPaginationParams> = (
  value,
): value is TPaginationParams => {
  return (
    isPlainObject(value) &&
    'tk' in value &&
    typeof value.tk === 'string' &&
    isOnlyDigits(value.tk) &&
    (('sz' in value && typeof value.sz === 'string' && isOnlyDigits(value.sz)) || !value.sz)
  );
};
