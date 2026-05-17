import type {
  TEntityMutationError,
  TEntityMutationSuccessBinary,
  TEntityMutationSuccessJson,
} from '@app-types/entity/t-entity-mutation-result';
import APP_TITLE from '@infra/const/app-title';

export const getCrudResultError = (
  statusCode: number = 400,
  messageError?: string,
): TEntityMutationError => {
  const errorMessage =
    messageError ||
    APP_TITLE[statusCode.toString() as keyof typeof APP_TITLE] ||
    APP_TITLE.unknownError;
  return {
    isSuccess: false,
    code: statusCode,
    errorMessage,
  };
};

export const getCrudResultSuccessJson = <T>(
  data: T,
  statusCode: number = 200,
): TEntityMutationSuccessJson<T> => {
  return {
    isSuccess: true,
    code: statusCode,
    data,
    responseType: 'json',
  };
};

export const getCrudResultSuccessBinary = (
  raw: Buffer,
  headers: Record<string, string>,
  statusCode: number = 200,
): TEntityMutationSuccessBinary => {
  return {
    isSuccess: true,
    code: statusCode,
    raw,
    headers,
    responseType: 'binary',
  };
};
