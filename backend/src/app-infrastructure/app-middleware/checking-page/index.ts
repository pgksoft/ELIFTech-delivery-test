import type { TAsyncAppMiddleware } from '@app-types/middleware';
import type TUnknownRecord from '@app-types/t-unknown-record';
import { analyzeMongoError } from '@db/analyze-mongo-error';
import { isStrictValidObjectId } from '@db/is-strict-valid-object-id';
import getPaginationValues from '@helpers/get-pagination-values';
import normalizeToFilterMongo from '@helpers/normalize-to-filter-mongo';
import sendMutationResult from '@helpers/send-mutation-result';
import type { Model } from 'mongoose';

type TCheckingPageOption<TModelSchema extends TUnknownRecord> = {
  model: Model<TModelSchema>;
  idFilter?: string;
};

const checkingPage = <TModelSchema extends TUnknownRecord>({
  model,
  idFilter = '',
}: TCheckingPageOption<TModelSchema>): TAsyncAppMiddleware => {
  return async (req, res, next) => {
    try {
      const id = req?.params?.id;
      const queryId =
        (idFilter &&
          id &&
          typeof id === 'string' &&
          isStrictValidObjectId(id) &&
          normalizeToFilterMongo({ [idFilter]: [id] })) ||
        {};
      const filter = { ...req.queryFilter, ...queryId };
      const total = await model.countDocuments(filter);
      req.total = total;
    } catch (e) {
      return sendMutationResult(analyzeMongoError(e), res);
    }
    const paginationValues = getPaginationValues(req.page);

    if (paginationValues.enabled) {
      const { page, size } = paginationValues;
      const lastPage = Math.max(1, Math.ceil(req.total / size));
      if (page > lastPage) {
        req.page.tk = lastPage;
      }
    }

    next();
  };
};

export default checkingPage;
