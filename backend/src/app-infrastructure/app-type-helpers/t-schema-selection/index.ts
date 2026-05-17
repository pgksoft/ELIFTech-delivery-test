export type TModeSelection = 'all' | 'include' | 'exclude';

export type TSchemaSelection<T extends object, K extends keyof T = keyof T> =
  | { mode: Extract<TModeSelection, 'all'>; keys?: K[] }
  | { mode: Extract<TModeSelection, 'include'>; keys: K[] }
  | { mode: Extract<TModeSelection, 'exclude'>; keys: K[] };
