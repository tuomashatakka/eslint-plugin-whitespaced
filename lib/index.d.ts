/**
 * @fileoverview Type definitions for ESLint plugin for whitespaced formatting
 * @author tuomashatakka
 */

import type { Rule } from 'eslint';

declare namespace pythonStylePlugin {
  export interface RuleDefinitions {
    'block-padding': Rule.RuleModule;
    'class-property-grouping': Rule.RuleModule;
    'aligned-assignments': Rule.RuleModule;
    'consistent-line-spacing': Rule.RuleModule;
    'multiline-format': Rule.RuleModule;
  }

  export interface Config {
    rules: {
      'whitespaced/block-padding': [
        string,
        {
          rootBlockPadding?: number;
          nestedBlockPadding?: number;
          enforceBeginningPadding?: boolean;
          enforceEndPadding?: boolean;
          docstringPadding?: number;
          treatCommentsAsDocstrings?: boolean;
        }?
      ];
      'whitespaced/class-property-grouping': [
        string,
        {
          groups?: Array<{
            name: string;
            types: string[];
            matches: string[];
            order: number;
          }>;
          paddingBetweenGroups?: number;
          enforceAlphabeticalSorting?: boolean;
        }?
      ];
      'whitespaced/aligned-assignments': [
        string,
        {
          alignComments?: boolean;
          alignLiterals?: boolean;
          blockSize?: number;
          ignoreAdjacent?: boolean;
          ignoreIfAssignmentsNotInBlock?: boolean;
          alignTypes?: boolean;
          ignoreTypesMismatch?: boolean;
        }?
      ];
      'whitespaced/consistent-line-spacing': [
        string,
        {
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
        }?
      ];
      'whitespaced/multiline-format': [
        string,
        {
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
        }?
      ];
    };
  }

  export interface Plugin {
    rules: RuleDefinitions;
    configs: {
      recommended: {
        plugins: ['whitespaced'];
        rules: Config['rules'];
      };
    };
  }
}

declare const plugin: pythonStylePlugin.Plugin;
export = plugin;
