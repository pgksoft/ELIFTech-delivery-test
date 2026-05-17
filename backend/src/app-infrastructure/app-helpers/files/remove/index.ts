import type { TMutationResult } from '@app-types/entity/t-entity-mutation-result';
import { unlink } from 'fs/promises';

export const removeFile = async (nameFile: string): Promise<TMutationResult> => {
  try {
    await unlink(nameFile);
    return { isSuccess: true };
  } catch (e) {
    return { isSuccess: false, message: (e as Error).message };
  }
};
