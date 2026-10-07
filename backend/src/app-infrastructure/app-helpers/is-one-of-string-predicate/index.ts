import type TypeGuard from '@app-types/type-guard';

export const isOneOfStringPredicate = <T extends readonly string[]>(
  allowed: T,
): TypeGuard<T[number]> => {
  return (value: unknown): value is T[number] => {
    return typeof value === 'string' && (allowed as readonly string[]).includes(value);
  };
};
