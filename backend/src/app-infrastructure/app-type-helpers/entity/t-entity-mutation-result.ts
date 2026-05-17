import type TypeGuard from '@app-types/type-guard';

export type TEntityMutationSuccessJson<T> = {
  isSuccess: true;
  code: number;
  data: T;
  responseType?: 'json';
};

export type TEntityMutationSuccessBinary = {
  isSuccess: true;
  code: number;
  // Buffer | ReadableStream | Uint8Array
  raw: Buffer | NodeJS.ReadableStream;
  headers?: Record<string, string>;
  responseType: 'binary' | 'stream';
};

export type TEntityMutationError = {
  isSuccess: false;
  code: number;
  errorMessage: string;
};

type TEntityMutationResult<T> =
  | TEntityMutationSuccessJson<T>
  | TEntityMutationSuccessBinary
  | TEntityMutationError;

export default TEntityMutationResult;

export class EntityMutationError extends Error {
  constructor(public result: TEntityMutationError) {
    super('Abort transaction due to business error');
  }
}

export type TMutationSuccess = { isSuccess: true };
export type TMutationError = { isSuccess: false; message: string };
export type TMutationResult = TMutationSuccess | TMutationError;

// Helpers
export const isEntityMutationSuccessBinary: TypeGuard<TEntityMutationSuccessBinary> = (
  value,
): value is TEntityMutationSuccessBinary => {
  return (
    value !== null &&
    typeof value === 'object' &&
    'responseType' in value &&
    (value.responseType === 'binary' || value.responseType === 'stream')
  );
};
