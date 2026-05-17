import { ShopProductModel } from '../model';
import {
  getCrudResultError,
  getCrudResultSuccessBinary,
} from '@helpers/send-mutation-result/crud-result';
import { analyzeMongoError } from '@db/analyze-mongo-error';
import type {
  TEntityMutationError,
  TEntityMutationSuccessBinary,
} from '@app-types/entity/t-entity-mutation-result';
import normalizeImageToBuffer from './normalize-image-to-buffer';

export const shopProductImage = async (
  id: string,
): Promise<TEntityMutationSuccessBinary | TEntityMutationError> => {
  try {
    const shopProduct = await ShopProductModel.findById(id).select('image fileMeta').lean();
    if (!shopProduct || !shopProduct.image) return getCrudResultError(404);

    const buf = normalizeImageToBuffer(shopProduct.image);
    if (!buf) return getCrudResultError(500, 'Cannot normalize image data');

    const mimetype = shopProduct.fileMeta?.mimetype || 'application/octet-stream';
    const filename = shopProduct.fileMeta?.originalname;
    const headers: Record<string, string> = {
      'Content-Type': mimetype,
      'Cache-Control': 'public, max-age=86400',
      'Content-Disposition':
        (filename && `inline; filename="${encodeURIComponent(filename)}"`) || 'inline',
      'Content-Length': String(buf.length),
    };

    return getCrudResultSuccessBinary(buf, headers);
  } catch (e) {
    return analyzeMongoError(e);
  }
};
