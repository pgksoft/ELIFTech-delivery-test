import type TypeGuard from '@app-types/type-guard';

const isArrayOfTypePredicate = <T>(itemCheck: TypeGuard<T>): TypeGuard<T[]> => {
  return (value: unknown): value is T[] => {
    return Array.isArray(value) && value.every(itemCheck);
  };
};

export default isArrayOfTypePredicate;
