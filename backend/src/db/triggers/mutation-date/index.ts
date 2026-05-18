import type { Schema, HydratedDocument, UpdateQuery, Query } from 'mongoose';

export type MutationDateOptions<T> = {
  field: keyof T & string;
  strategy?: Array<'validate' | 'save' | 'updateOne' | 'findOneAndUpdate'>;
  onlyOnFields?: Array<keyof T & string>;
};

/**
 * Main applier
 */
export const applyMutationDateTrigger = <T extends object>(
  schema: Schema<T>,
  options: MutationDateOptions<T>,
) => {
  const {
    field,
    strategy = ['validate', 'save', 'updateOne', 'findOneAndUpdate'],
    onlyOnFields,
  } = options;

  if (strategy.includes('validate')) {
    schema.pre('validate', function () {
      const doc = this as unknown as HydratedDocument<T>;
      if (shouldUpdateForDoc(doc, onlyOnFields)) {
        setMutationDateForDoc(doc, field);
      }
    });
  }

  if (strategy.includes('save')) {
    schema.pre('save', async function () {
      const doc = this as unknown as HydratedDocument<T>;
      if (shouldUpdateForDoc(doc, onlyOnFields)) {
        setMutationDateForDoc(doc, field);
      }
    });
  }

  if (strategy.includes('updateOne')) {
    schema.pre('updateOne', async function () {
      const query = this as unknown as Query<any, T>;
      if (shouldUpdateForQuery(query, onlyOnFields)) {
        setMutationDateForQuery(query, field);
      }
    });
  }

  if (strategy.includes('findOneAndUpdate')) {
    schema.pre('findOneAndUpdate', async function () {
      const query = this as unknown as Query<any, T>;
      if (shouldUpdateForQuery(query, onlyOnFields)) {
        setMutationDateForQuery(query, field);
      }
    });
  }
};

/**
 * Helpers
 */
const shouldUpdateForDoc = <T extends object>(
  doc: HydratedDocument<T>,
  onlyOnFields?: Array<keyof T & string>,
): boolean => {
  if (!onlyOnFields || onlyOnFields.length === 0) return true;
  return onlyOnFields.some((f) => doc.isModified(f));
};

const shouldUpdateForQuery = <T extends object>(
  query: Query<any, T>,
  onlyOnFields?: Array<keyof T & string>,
): boolean => {
  if (!onlyOnFields || onlyOnFields.length === 0) return true;

  const update = query.getUpdate?.();
  if (!update || typeof update !== 'object') return false;

  const operatorKeys = Object.keys(update).filter((k) => k.startsWith('$'));
  const keys =
    operatorKeys.length > 0
      ? Object.keys((update as UpdateQuery<T>).$set ?? {})
      : Object.keys(update);

  return keys.some((k) => onlyOnFields.includes(k as keyof T & string));
};

const setMutationDateForDoc = <T extends object>(
  doc: HydratedDocument<T>,
  field: keyof T & string,
) => {
  (doc as any)[field] = new Date();
};

const setMutationDateForQuery = <T extends object>(
  query: Query<any, T>,
  field: keyof T & string,
) => {
  const update = query.getUpdate?.();
  if (!update || typeof update !== 'object') {
    query.setUpdate({ $set: { [field]: new Date() } });
    return;
  }

  const hasOperator = Object.keys(update).some((k) => k.startsWith('$'));

  if (hasOperator) {
    const currentSet = (update as UpdateQuery<T>).$set ?? {};
    const newSet = { ...currentSet, [field]: new Date() };
    const newUpdate = { ...update, $set: newSet };
    query.setUpdate(newUpdate);
  } else {
    const newSet = { ...update, [field]: new Date() };
    query.setUpdate({ $set: newSet });
  }
};
