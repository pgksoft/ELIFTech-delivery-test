export const isOneOfStringPredicate = <T extends readonly string[]>(allowed: T) => {
  return (value: unknown): value is T[number] => {
    return typeof value === 'string' && (allowed as readonly string[]).includes(value);
  };
};
