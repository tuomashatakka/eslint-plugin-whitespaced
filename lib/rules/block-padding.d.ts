/**
 * @fileoverview Type definitions for block-padding rule
 * @author tuomashatakka
 */

import type { Rule } from 'eslint';

interface BlockPaddingOptions {
  rootBlockPadding?: number;
  nestedBlockPadding?: number;
  enforceBeginningPadding?: boolean;
  enforceEndPadding?: boolean;
  docstringPadding?: number;
  treatCommentsAsDocstrings?: boolean;
}

declare const rule: Rule.RuleModule;
export = rule;
