export type CamelToKebab<S extends string> = S extends `${infer First}${infer Rest}`
  ? Rest extends Uncapitalize<Rest>
    ? `${Lowercase<First>}${CamelToKebab<Rest>}`
    : `${Lowercase<First>}-${CamelToKebab<Rest>}`
  : S;
