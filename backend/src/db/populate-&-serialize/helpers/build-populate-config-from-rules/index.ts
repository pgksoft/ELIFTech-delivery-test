import type TUnknownRecord from '@infra/app-type-helpers/t-unknown-record';
import type { TPopulateNode } from '@db/populate-&-serialize/types';
import type { RulesFor } from '@serialization/dsl-types';

type EntityOfRule = {
  kind: 'entityOf';
  rules: RulesFor<TUnknownRecord>;
};

type AnyRule = { kind: string } & TUnknownRecord;

export const buildPopulateConfigFromRules = <TDbPopulated extends TUnknownRecord>(
  rules: RulesFor<TDbPopulated>,
): TPopulateNode[] => {
  const nodes: TPopulateNode[] = [];

  for (const [field, rule] of Object.entries(rules as Record<string, AnyRule>)) {
    if (rule.kind === 'entityOf') {
      const entityRule = rule as EntityOfRule;

      if (!entityRule.rules) {
        throw new Error(
          `entityOf rule for field "${field}" has no rules (undefined). Possible circular import.`,
        );
      }

      const nestedPopulate = buildPopulateConfigFromRules(
        entityRule.rules as RulesFor<TUnknownRecord>,
      );

      nodes.push({
        path: field,
        populate: nestedPopulate.length > 0 ? nestedPopulate : undefined,
      });
    }
  }

  return nodes;
};
