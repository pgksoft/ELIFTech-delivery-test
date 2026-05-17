// Basic rules (no generics, no flatten/custom/include/entity)
export type TSerializeExcludeRule = {
  kind: 'exclude';
};

export type TSerializeRenameRule = {
  kind: 'rename';
  to: string;
};

export type TSerializePrimitiveRule =
  | { kind: 'date' }
  | { kind: 'objectId' }
  | { kind: 'renameObjectId' };

// Typed rule for a nested entity
// Key idea: generic <TEntity> gives a type-safe TApi.
export type TSerializeEntityOfRule<TEntity = unknown> = {
  kind: 'entityOf';
  // Rules for nested entity fields
  rules?: RulesFor<TEntity>;
};

// General rule for one field of type TValue
export type RuleFor<TValue> =
  | TSerializeExcludeRule
  | TSerializeRenameRule
  | TSerializePrimitiveRule
  | TSerializeEntityOfRule<TValue>;

// Universal "runtime" rule
export type TSerializeRule = RuleFor<unknown>;

// A set of rules for an entity at runtime level (general, key-unsafe)
// IMPORTANT: values ​​can be undefined because strict RulesFor<T> gives us RuleFor<T[K]> | undefined
export type TSerializationRules = Record<string, TSerializeRule | undefined>;

// Strict variant: rules for a specific T based on its keys.
export type RulesFor<T> = {
  [K in keyof T]?: RuleFor<T[K]>;
};
