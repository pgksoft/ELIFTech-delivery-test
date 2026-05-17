import { getArrayAsStringConst } from '@helpers/get-array-as-string-const';

const mainEntityActions = getArrayAsStringConst(
  'readOne',
  'readList',
  'create',
  'update',
  'delete',
);

export const appActions = [...mainEntityActions] as const;

export type TAppAction = (typeof appActions)[number];
