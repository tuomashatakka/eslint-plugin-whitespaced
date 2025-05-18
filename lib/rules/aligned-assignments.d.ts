/**
 * @fileoverview Type definitions for aligned-assignments rule
 * @author tuomashatakka
 */

import type { Rule } from 'eslint';

interface AlignedAssignmentsOptions {
  alignComments?: boolean;
  alignLiterals?: boolean;
  blockSize?: number;
  ignoreAdjacent?: boolean;
  ignoreIfAssignmentsNotInBlock?: boolean;
  alignTypes?: boolean;
  ignoreTypesMismatch?: boolean;
}

declare const rule: Rule.RuleModule;
export = rule;
