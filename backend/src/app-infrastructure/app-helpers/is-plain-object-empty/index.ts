import isPlainObject from '@helpers/is-plain-object';

const isPlainObjectEmpty = (v: unknown): boolean => {
  return isPlainObject(v) && Object.keys(v).length === 0;
};

export default isPlainObjectEmpty;
