export type TCamelToKebab<S extends string> = S extends `${infer First}${infer Rest}`
  ? Rest extends Uncapitalize<Rest>
    ? `${Lowercase<First>}${TCamelToKebab<Rest>}`
    : `${Lowercase<First>}-${TCamelToKebab<Rest>}`
  : S;
