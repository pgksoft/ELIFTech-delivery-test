import type {
  TApiEntityMongoDbMember,
  TEntityMongoDbMember,
} from '@app-types/entity/t-entity-mongodb-member';
import type { OpenAPIV3 } from 'openapi-types';

export const schemaEntityMember: Record<keyof TEntityMongoDbMember, OpenAPIV3.SchemaObject> = {
  _id: { type: 'string', description: 'MongoDB autocomplete' },
  __v: { type: 'number', description: 'MongoDB autocomplete' },
};

export const openApiSchemaEntityMember: Record<
  keyof TApiEntityMongoDbMember,
  OpenAPIV3.SchemaObject
> = {
  id: { type: 'string', description: 'MongoDB autocomplete' },
};
