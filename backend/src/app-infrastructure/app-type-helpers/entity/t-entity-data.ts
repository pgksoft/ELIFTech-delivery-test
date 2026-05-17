import type TypeGuard from '@app-types/type-guard';

type TPrimitiveValueType = string | number | boolean;

export type TValueType = TPrimitiveValueType | [];

export type TFieldValue = TValueType[];

export type TEntityRecord = Record<string, TFieldValue>;

export type TEntityData = TEntityRecord[];

// helper
export const isPrimitiveValueType: TypeGuard<TPrimitiveValueType> = (
  value: unknown,
): value is TPrimitiveValueType => {
  return typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean';
};
