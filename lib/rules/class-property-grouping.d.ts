/**
 * @fileoverview Type definitions for class-property-grouping rule
 * @author tuomashatakka
 */

import type { Rule } from 'eslint';

interface GroupDefinition {
  name: string;
  types: string[];
  matches: string[];
  order: number;
}

interface ClassPropertyGroupingOptions {
  groups?: GroupDefinition[];
  paddingBetweenGroups?: number;
  enforceAlphabeticalSorting?: boolean;
}

declare const rule: Rule.RuleModule;
export = rule;
