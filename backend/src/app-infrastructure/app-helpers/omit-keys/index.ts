// Remove the specified keys
export const omitKeys = <S, U extends keyof S>(obj: S, keys?: U[]): Omit<S, U> => {
  const clone = { ...obj };
  if (keys) keys.forEach((k) => delete clone[k]);
  return clone;
};
