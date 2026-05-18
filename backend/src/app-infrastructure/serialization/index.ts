import { Types } from 'mongoose';
import type { TSerializationRules, TSerializeRule } from './dsl-types';
import type TUnknownRecord from '@infra/app-type-helpers/t-unknown-record';

type TNormalizedRules = TSerializationRules;

const rulesCache = new WeakMap<object, TNormalizedRules>();
const emptyRules: TSerializationRules = {};

const normalizeRules = (rules: TSerializationRules): TNormalizedRules => {
  // Validation, normalization, etc. can be done here in the future.
  return rules;
};

const getNormalizedRules = (rules: TSerializationRules): TNormalizedRules => {
  const cached = rulesCache.get(rules);
  if (cached) return cached;
  const normalized = normalizeRules(rules);
  rulesCache.set(rules, normalized);
  return normalized;
};

const resolveTargetKey = (key: string, rule?: TSerializeRule): string => {
  // 1. explicit rename has highest priority
  if (rule?.kind === 'rename') return rule.to;

  // 2. explicit renameObjectId forces 'id'
  if (rule?.kind === 'renameObjectId') return 'id';

  // 3. default mapping for Mongo _id -> id
  if (key === '_id') return 'id';

  // 4. otherwise keep original key
  return key;
};

export const serializeEntity = <TDbPopulated, TApi>(
  entity: TDbPopulated,
  rules: TSerializationRules = emptyRules,
): TApi => {
  const normalizedRules = getNormalizedRules(rules);
  return innerSerializeEntity<TDbPopulated, TApi>(entity, normalizedRules);
};

const innerSerializeEntity = <TDbPopulated, TApi>(
  entity: TDbPopulated,
  rules: TSerializationRules,
): TApi => {
  const result: TUnknownRecord = {};
  const entityRecord = entity as unknown as TUnknownRecord;

  for (const key in entityRecord) {
    const value = entityRecord[key];
    const rule: TSerializeRule | undefined = rules[key];

    // exclude
    if (rule?.kind === 'exclude') continue;

    // rename
    const targetKey = resolveTargetKey(key, rule);

    // date (explicit rule or actual type)
    if (rule?.kind === 'date' || value instanceof Date) {
      const asDate = value as Date | null | undefined;
      result[targetKey] = asDate?.toISOString?.() ?? null;
      continue;
    }

    // objectId (explicit rule or actual type)
    if (
      rule?.kind === 'objectId' ||
      rule?.kind === 'renameObjectId' ||
      value instanceof Types.ObjectId
    ) {
      const asObjectId = value as Types.ObjectId | null | undefined;
      result[targetKey] = asObjectId?.toString?.() ?? null;
      continue;
    }

    // entityOf — nested entity
    if (rule?.kind === 'entityOf') {
      result[targetKey] = innerSerializeEntity<unknown, unknown>(value, rule.rules ?? emptyRules);
      continue;
    }

    // array
    if (Array.isArray(value)) {
      const itemRules = getNestedRules(rule);

      result[targetKey] = value.map((v) => {
        if (v !== null && typeof v === 'object') {
          return innerSerializeEntity<unknown, unknown>(v, itemRules);
        }
        return v;
      });
      continue;
    }

    // nested object without explicit entityOf, but with rules inside
    if (value !== null && typeof value === 'object') {
      const nestedRules = getNestedRules(rule);

      result[targetKey] = innerSerializeEntity<unknown, unknown>(value, nestedRules);
      continue;
    }

    // primitive without special rules
    result[targetKey] = value;
  }

  return result as TApi;
};

const getNestedRules = (rule: TSerializeRule | undefined): TSerializationRules => {
  if (rule && 'rules' in rule && rule.rules) {
    return rule.rules;
  }
  return emptyRules;
};
