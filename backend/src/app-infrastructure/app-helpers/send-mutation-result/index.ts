import type TEntityMutationResult from '@app-types/entity/t-entity-mutation-result';
import { isEntityMutationSuccessBinary } from '@app-types/entity/t-entity-mutation-result';
import type { Response } from 'express';

const sendMutationResult = <T>(result: TEntityMutationResult<T>, res: Response) => {
  const { isSuccess, code } = result;
  if (isSuccess) {
    if (isEntityMutationSuccessBinary(result)) {
      const { headers, raw } = result;
      headers && Object.entries(headers).forEach(([k, v]) => res.set(k, v));
      return res.status(code).send(raw);
    } else {
      return res.status(code).json(result.data);
    }
  } else {
    return res.status(result.code).json({ message: result.errorMessage });
  }
};

export default sendMutationResult;
