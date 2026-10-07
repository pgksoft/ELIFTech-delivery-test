import type { TAppMiddleware } from '@app-types/middleware';
import type TypeGuard from '@app-types/type-guard';
import isPlainObject from '@helpers/is-plain-object';
import sendMutationResult from '@helpers/send-mutation-result';
import { getCrudResultError } from '@helpers/send-mutation-result/crud-result';
import normalizeToFilterMongo, { isShortFilterOperator } from '@helpers/normalize-to-filter-mongo';
import APP_TITLE from '@infra/const/app-title';
import type TUnknownRecord from '@app-types/t-unknown-record';
import normalizeToSortMongo from '@helpers/normalize-to-sort-mongo';

const checkingAllowKeysEntityFilter = <K extends string, S extends string>(
  isFilterEntityKey: TypeGuard<K>,
  isSortEntityKey: TypeGuard<S>,
): TAppMiddleware => {
  return (req, res, next) => {
    const rawFilterQuery = (isPlainObject(req.query) && { ...req.query }) || {};
    const rawSortQuery = (isPlainObject(rawFilterQuery.sort) && rawFilterQuery.sort) || {};
    delete rawFilterQuery.sort;

    // Filter keys
    const filterKeys = getCollectKeys(rawFilterQuery);
    const isNotValidFilterKeys = filterKeys.some((k) => {
      return !isFilterEntityKey(k);
    });
    if (isNotValidFilterKeys) {
      return sendMutationResult(getCrudResultError(400, APP_TITLE.notAllowFilterKey), res);
    }
    req.queryFilter = normalizeToFilterMongo(rawFilterQuery);

    // Sort keys
    const sortKeys = getCollectKeys(rawSortQuery);
    const isNotValidSortKeys = sortKeys.some((k) => {
      return !isSortEntityKey(k);
    });
    if (isNotValidSortKeys) {
      return sendMutationResult(getCrudResultError(400, APP_TITLE.notAllowSortKey), res);
    }
    req.querySort = normalizeToSortMongo(rawSortQuery);

    next();
  };
};

// Helpers
const getCollectKeys = (obj: TUnknownRecord, prefix = ''): string[] => {
  const keys: string[] = [];
  for (const k of Object.keys(obj)) {
    const full = prefix ? (!isShortFilterOperator(k) && `${prefix}.${k}`) || `${prefix}` : k;
    const v = obj[k];
    if (isPlainObject(v)) {
      keys.push(...getCollectKeys(v, full));
    } else {
      keys.push(full);
    }
  }
  return keys;
};

export default checkingAllowKeysEntityFilter;
