/**
 * @fileoverview Type definitions for consistent-line-spacing rule
 * @author tuomashatakka
 */

import type { Rule } from 'eslint';

interface ConsistentLineSpacingOptions {
  beforeImports?: number;
  afterImports?: number;
  beforeExports?: number;
  afterExports?: number;
  beforeClass?: number;
  afterClass?: number;
  beforeFunction?: number;
  afterFunction?: number;
  beforeComment?: number;
  ignoreTopLevelCode?: boolean;
  skipImportGroups?: boolean;
}

declare const rule: Rule.RuleModule;
export = rule;
