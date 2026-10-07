import type TUnknownRecord from '@app-types/t-unknown-record';
import type TypeGuard from '@app-types/type-guard';

const createIsUnknownRecordKeyGuard = <T extends TUnknownRecord>(unknownRecord: {
  [K in keyof T]: unknown;
}): TypeGuard<keyof T> => {
  return (value: unknown): value is keyof T => {
    return typeof value === 'string' && Object.keys(unknownRecord).includes(value);
  };
};

export default createIsUnknownRecordKeyGuard;
