import { Schema } from 'mongoose';
import type { TFieldsSchema } from '@infra/app-type-helpers/t-fields-schema';
import type { TSchemaSelection } from '@infra/app-type-helpers/t-schema-selection';
import type { SchemaTypeOptions } from 'mongoose';
import type { OpenAPIV3 } from 'openapi-types';
import type TUnknownRecord from '@infra/app-type-helpers/t-unknown-record';

export const getOpenApiSchema = <
  T extends object,
  K extends keyof T,
  Extra extends Record<string, OpenAPIV3.ReferenceObject | OpenAPIV3.SchemaObject> = {},
>(
  fields: TFieldsSchema<T>,
  selection: TSchemaSelection<T, K> = { mode: 'all' }, // default: all fields
  extra?: Extra,
  extraMode: 'merge' | 'override' = 'override',
  options?: {
    /**
     * anyOf — an array of alternative schema variants.
     * Each element can include its own properties, required fields, and description.
     * Use this when the object must satisfy at least one of the listed variants.
     * Example: either a `description` field is required OR a `file` field is required.
     */
    anyOf?: Array<OpenAPIV3.SchemaObject>;

    /**
     * oneOf — an array of mutually exclusive schema variants.
     * Swagger UI will show that the object must match exactly one of the variants.
     * Example: either a text DTO OR a file DTO, but not both at the same time.
     */
    oneOf?: Array<OpenAPIV3.SchemaObject>;

    /**
     * allOf — an array of combined schema fragments.
     * Use this for composition: the object must satisfy all listed schemas simultaneously.
     * Example: a base entity schema plus an extension schema with extra fields.
     */
    allOf?: Array<OpenAPIV3.SchemaObject>;

    /**
     * requiredMode — strategy for computing required fields:
     * - 'selection'   → all selected fields are marked as required.
     * - 'fromFields'  → required fields are inferred from the original field definitions (fields.required).
     * - 'none'        → no fields are required.
     * - { only: K[] } → explicitly specify which fields are required.
     *
     * This provides flexible control over required fields without duplicating logic.
     */
    requiredMode?: 'selection' | 'fromFields' | 'none' | { only: K[] };
  },
): OpenAPIV3.SchemaObject => {
  let keys: K[] = [];

  const { mode } = selection;
  mode === 'all' && (keys = Object.keys(fields) as K[]);
  mode === 'include' && (keys = selection.keys);
  if (mode === 'exclude') {
    const excludeSet = new Set(selection.keys);
    keys = Object.keys(fields).filter((k) => !excludeSet.has(k as K)) as K[];
  }

  const baseProps: Record<string, OpenAPIV3.ReferenceObject | OpenAPIV3.SchemaObject> =
    Object.fromEntries(keys.map((key) => [String(key), mapFieldToOpenApi(fields[key])]));

  let properties: Record<string, OpenAPIV3.ReferenceObject | OpenAPIV3.SchemaObject> = {};

  // merge: extra adds new fields but does not replace existing ones
  extraMode === 'merge' && (properties = { ...(extra ?? {}), ...baseProps });
  // override: extra replaces fields with the same key
  extraMode === 'override' && (properties = { ...baseProps, ...(extra ?? {}) });

  // compute required according to mode
  let required: string[] | undefined;
  const requiredMode = options?.requiredMode ?? 'selection';
  if (requiredMode === 'selection') {
    required = keys.map(String);
  } else if (requiredMode === 'fromFields') {
    required = keys.filter((k) => fields[k]?.required).map(String);
    if (required.length === 0) required = undefined;
  } else if (requiredMode === 'none') {
    required = undefined;
  } else if (typeof requiredMode === 'object' && 'only' in requiredMode) {
    required = requiredMode.only.map(String);
  }

  const schema: OpenAPIV3.SchemaObject = {
    type: 'object',
    properties,
    ...(required ? { required } : {}),
  };

  // allow full SchemaObject in anyOf/oneOf/allOf
  if (options?.anyOf) {
    schema.anyOf = options.anyOf.map((rule) => ({
      ...rule,
      required: rule.required?.map(String),
    }));
  }
  if (options?.oneOf) {
    schema.oneOf = options.oneOf.map((rule) => ({
      ...rule,
      required: rule.required?.map(String),
    }));
  }
  if (options?.allOf) {
    schema.allOf = options.allOf.map((rule) => ({
      ...rule,
      required: rule.required?.map(String),
    }));
  }

  return schema;
};

// Helpers
type TOpenApiField = {
  type?: unknown;
  required?: boolean;
  enum?: ReadonlyArray<unknown>;
  default?: unknown;
  maxLength?: SchemaTypeOptions<unknown>['maxLength'];
  minLength?: SchemaTypeOptions<unknown>['minLength'];
  openApi?: OpenAPIV3.SchemaObject;
};

const mapFieldToOpenApi = <T extends object, K extends keyof T>(
  field: TFieldsSchema<T>[K],
): OpenAPIV3.SchemaObject => {
  return mapFieldToOpenApiInternal(field as unknown as TOpenApiField);
};

const mapFieldToOpenApiInternal = (field: TOpenApiField): OpenAPIV3.SchemaObject => {
  const { type } = field;

  // 1. Array: type: [ ... ]
  if (Array.isArray(type)) {
    return mapArrayFieldToOpenApi(field, type);
  }

  // 2. Nested object: type: { ... }
  if (type && typeof type === 'object') {
    return mapObjectFieldToOpenApi(field, type as Record<string, TOpenApiField>);
  }

  // 3. Primitive
  return mapPrimitiveFieldToOpenApi(field);
};

const mapArrayFieldToOpenApi = (
  field: TOpenApiField,
  typeArray: ReadonlyArray<unknown>,
): OpenAPIV3.SchemaObject => {
  const [itemType] = typeArray;

  const itemField: TOpenApiField = {
    ...field,
    // for items we only care about the type, the rest (enum, max/min, openApi) should be specified at the element level
    type: itemType,
  };

  const itemsSchema = mapFieldToOpenApiInternal(itemField);

  const schema: OpenAPIV3.SchemaObject = {
    type: 'array',
    items: itemsSchema,
  };

  if (field.required) {
    schema.nullable = false;
  }

  if (field.openApi) {
    Object.assign(schema, field.openApi);
  }

  return schema;
};

const mapObjectFieldToOpenApi = (
  field: TOpenApiField,
  typeObject: Record<string, TOpenApiField>,
): OpenAPIV3.SchemaObject => {
  const properties: Record<string, OpenAPIV3.SchemaObject> = Object.fromEntries(
    Object.entries(typeObject).map(([key, nestedField]) => [
      key,
      mapFieldToOpenApiInternal(nestedField),
    ]),
  );

  const schema: OpenAPIV3.SchemaObject = {
    type: 'object',
    properties,
  };

  if (field.required) {
    schema.nullable = false;
  }

  if (field.openApi) {
    Object.assign(schema, field.openApi);
  }

  return schema;
};

const mapPrimitiveFieldToOpenApi = (field: TOpenApiField): OpenAPIV3.SchemaObject => {
  const { type } = field;

  let openApiType: OpenAPIV3.NonArraySchemaObjectType = 'string';
  let format: string | undefined;

  if (type === Number) {
    openApiType = 'number';
  } else if (type === Boolean) {
    openApiType = 'boolean';
  } else if (type === Date) {
    openApiType = 'string';
    format = 'date-time';
  } else if (type === Schema.Types.ObjectId) {
    openApiType = 'string';
    format = 'objectId';
  } else {
    // default - string (String, undefined, other constructors)
    openApiType = 'string';
  }

  const schema: OpenAPIV3.SchemaObject = { type: openApiType };
  if (format) schema.format = format;

  // length constraints
  schema.maxLength = extractLength(field.maxLength);
  schema.minLength = extractLength(field.minLength);

  // enum
  if (field.enum && field.enum.length > 0) {
    schema.enum = [...field.enum];
  }

  // default
  if (field.default !== undefined) {
    schema.default = field.default as OpenAPIV3.NonArraySchemaObject['default'];
  }

  // required
  if (field.required) {
    schema.nullable = false;
  }

  // merge custom OpenAPI metadata
  if (field.openApi) {
    Object.assign(schema, field.openApi);
  }

  return schema;
};

const extractLength = (
  value:
    | SchemaTypeOptions<TUnknownRecord>['maxLength']
    | SchemaTypeOptions<TUnknownRecord>['minLength'],
): number | undefined => {
  if (!value) return undefined;
  if (typeof value === 'number') return value;
  return value[0];
};
