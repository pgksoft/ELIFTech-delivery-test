import type TUnknownRecord from '@app-types/t-unknown-record';
import { isStrictValidObjectId } from '@db/is-strict-valid-object-id';
import createIsUnknownRecordKeyGuard from '@helpers/create-is-unknown-record-key-guard';
import isArrayOfTypePredicate from '@helpers/is-array-of-type-predicate';
import isPlainObject from '@helpers/is-plain-object';
import { Types } from 'mongoose';

type TShortFilterOperator = 'gt' | 'gte' | 'lt' | 'lte' | 'in' | 'nin' | 'ne' | 'exists';

type TOperatorMap = { [K in TShortFilterOperator]: `$${K}` };

const OPERATOR_MAP = {
  gt: '$gt',
  gte: '$gte',
  lt: '$lt',
  lte: '$lte',
  in: '$in',
  nin: '$nin',
  ne: '$ne',
  exists: '$exists',
} as const satisfies TOperatorMap;

export const isShortFilterOperator = createIsUnknownRecordKeyGuard(OPERATOR_MAP);

const normalizeToFilterMongo = (
  raw: TUnknownRecord,
  castFn: TCastFn = defaultCast,
): TUnknownRecord => {
  const flat = flattenRaw(raw);
  const filterMongo: TUnknownRecord = {};

  for (const [path, val] of Object.entries(flat)) {
    // 1) если val — массив => $in (с приведением элементов)
    if (Array.isArray(val)) {
      const casted = val.map((v) => {
        return castFn(v);
      });
      filterMongo[path] = { $in: casted };
      continue;
    }

    // 2) объект с короткими операторами: field[gt]=... => { field: { gt: '...' } }
    if (isPlainObject(val)) {
      const operators: TUnknownRecord = {};
      for (const [shortOp, valOp] of Object.entries(val)) {
        const mongoOp = (isShortFilterOperator(shortOp) && OPERATOR_MAP[shortOp]) || null;
        // если shortOp не оператор — пропускаем
        if (!mongoOp) continue;

        // если значение похоже на "/pattern/flags" — конвертим в $regex/$options
        const maybeRegex = parseRegexString(valOp);
        if (maybeRegex) {
          operators['$regex'] = maybeRegex.pattern;
          if (maybeRegex.flags) operators['$options'] = maybeRegex.flags;
        } else {
          operators[mongoOp] = castFn(valOp);
        }
      }
      if (Object.keys(operators).length) filterMongo[path] = operators;
      continue;
    }
    // 3) val — примитив: name=/pattern/i  или name=string
    const maybe = parseRegexString(val);
    if (maybe) {
      filterMongo[path] = { $regex: maybe.pattern };
      if (maybe.flags) (filterMongo[path] as TUnknownRecord)['$options'] = maybe.flags;
    } else {
      filterMongo[path] = castFn(val);
    }
  }
  return filterMongo;
};

export default normalizeToFilterMongo;

// Helpers
type TCastFn = (value: unknown) => unknown;

const defaultCast: TCastFn = (v) => {
  if (typeof v === 'string') {
    // number
    if (/^-?\d+(\.\d+)?$/.test(v)) {
      const n = Number(v);
      if (Number.isFinite(n)) return n;
    }
    // ISO date
    const d = Date.parse(v);
    if (!Number.isNaN(d) && v.includes('T')) return new Date(v);

    // ObjectId
    if (typeof v === 'string' && isStrictValidObjectId(v)) {
      try {
        return new Types.ObjectId(v);
      } catch {
        /* fallback */
      }
    }
  }
  return v;
};

const parseRegexString = (v: unknown) => {
  if (typeof v !== 'string') return null;
  const m = v.match(/^\/(.+)\/([gimsuy]*)$/);
  if (!m) return null;
  return { pattern: m[1], flags: m[2] || undefined };
};

/**
 * flattenAndNormalize:
 * - рекурсивно обходит raw объект
 * - строит map: dotPath -> rawValue
 *   (если встречает операторный объект field: { gt: '...' } — оставляет как оператор-объект)
 */
const flattenRaw = (raw: TUnknownRecord, prefix = ''): TUnknownRecord => {
  const out: TUnknownRecord = {};
  for (const [k, v] of Object.entries(raw)) {
    const path = prefix ? `${prefix}.${k}` : k;
    if (isPlainObject(v)) {
      // Если ключи этого объекта — короткие операторы (gt/gte/...) — считаем это операторным объектом
      const isAllShortOps = isArrayShortFilterOperator(Object.keys(v));
      if (isAllShortOps) {
        out[path] = v; // операторный объект, обработаем позже
      } else {
        // вложенный объект — рекурсивно расплющиваем
        Object.assign(out, flattenRaw(v as TUnknownRecord, path));
      }
    } else {
      // примитив или массив
      out[path] = v;
    }
  }
  return out;
};

const isArrayShortFilterOperator = isArrayOfTypePredicate(isShortFilterOperator);
