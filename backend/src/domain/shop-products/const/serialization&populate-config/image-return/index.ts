import type { TApiImageReturn } from '@domain/shop-products/model';
import type { RulesFor } from '@serialization/dsl-types';

const imageReturnSerializationRules: RulesFor<TApiImageReturn> = {} as const;

export default imageReturnSerializationRules;
