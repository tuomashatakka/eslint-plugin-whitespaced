/**
 * @fileoverview Type definitions for multiline-format rule
 * @author tuomashatakka
 */

import type { Rule } from 'eslint';

interface MultilineFormatOptions {
  allowSingleLine?: boolean;
  multilineStyle?: 'consistent' | 'always' | 'never';
  minItems?: number;
  maxLineLength?: number;
  bracketStyle?: 'same-line' | 'new-line';
  indentation?: number;
  trailingComma?: 'always' | 'never';
  emptyLineBetweenGroups?: boolean;
  consistentSpacing?: boolean;
  objectAlignment?: 'colon' | 'value' | 'none';
}

declare const rule: Rule.RuleModule;
export = rule;
