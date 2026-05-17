export const getArrayAsStringConst = <const T extends readonly string[]>(...items: T) =>
  items as readonly [...T];
