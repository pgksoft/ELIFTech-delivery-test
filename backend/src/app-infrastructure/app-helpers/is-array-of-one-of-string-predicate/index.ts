import type TypeGuard from '@app-types/type-guard';
import { isOneOfStringPredicate } from '@helpers/is-one-of-string-predicate';

export const isArrayOfOneOfStringPredicate = <T extends readonly string[]>(
  allowed: T,
): TypeGuard<T[number][]> => {
  return (value: unknown): value is T[number][] => {
    return Array.isArray(value) && value.every((v) => isOneOfStringPredicate(allowed)(v));
  };
};
