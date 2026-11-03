import type {
  TEntityMutationError,
  TEntityMutationSuccessBinary,
  TEntityMutationSuccessJson,
  TEntityMutationSuccessList,
  TEntityView,
} from '@app-types/entity/t-entity-mutation-result';
import type { TPaginationValues } from '@helpers/get-pagination-values';
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

export const getCrudResultSuccessList = <T>(
  data: T,
  total: number,
  paginationValues: TPaginationValues,
  statusCode: number = 200,
): TEntityMutationSuccessList<T> => {
  const result = {
    isSuccess: true,
    code: statusCode,
    data: { items: data, total },
    responseType: 'json',
  } satisfies TEntityMutationSuccessList<T>;
  if (paginationValues.enabled) {
    const { page, size } = paginationValues;
    const lastPage = Math.ceil(total / size);
    const maybePreviousPage = page - 1;
    const maybeNextPage = page + 1;
    const entityView = {
      entityView: {
        page,
        size,
        first: 1,
        last: lastPage,
        previous: maybePreviousPage < 1 ? page : maybePreviousPage,
        next: maybeNextPage > lastPage ? page : maybeNextPage,
      } satisfies TEntityView,
    };
    result.data = { ...result.data, ...entityView };
  }
  return result;
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
