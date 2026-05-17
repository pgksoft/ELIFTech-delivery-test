import type { SchemaTypeOptions } from 'mongoose';
import type { OpenAPIV3 } from 'openapi-types';

export type TFieldsSchema<T extends object> = {
  [K in keyof T]: SchemaTypeOptions<T[K]> & {
    openApi?: Partial<OpenAPIV3.SchemaObject>;
  };
};

export type TPickFieldsSchema<T extends object, K extends keyof T> = {
  [P in K]: TFieldsSchema<T>[P];
};
