import type { Schema } from 'mongoose';

const collectSchemasObjectIdPaths = (schema: Schema): Set<string> => {
  const out = new Set<string>();
  schema.eachPath((path, schemaType) => {
    // path is like ObjectId
    const inst = schemaType.instance;
    if (inst === 'ObjectID' || inst === 'ObjectId') {
      out.add(path);
      out.add(`${path}._id`);
    }

    // path has ref
    const options = schemaType.options || {};
    if (options && options.ref) {
      out.add(path);
      out.add(`${path}._id`);
    }
  });

  // and root _id
  out.add('_id');

  return out;
};

export default collectSchemasObjectIdPaths;
