/**
 * @fileoverview ESLint plugin for whitespaced formatting in JavaScript/TypeScript
 * @author tuomashatakka
 */

import blockPadding from './rules/block-padding.js';
import classPropertyGrouping from './rules/class-property-grouping.js';
import alignedAssignments from './rules/aligned-assignments.js';
import consistentLineSpacing from './rules/consistent-line-spacing.js';
import multilineFormat from './rules/multiline-format.js';

export default {
  // Rule definitions
  rules: {
    "block-padding": blockPadding,
    "class-property-grouping": classPropertyGrouping,
    "aligned-assignments": alignedAssignments,
    "consistent-line-spacing": consistentLineSpacing,
    "multiline-format": multilineFormat
  },

  // Recommended configuration
  configs: {
    recommended: {
      plugins: ["whitespaced"],
      rules: {
        "whitespaced/block-padding": ["error", {
          rootBlockPadding: 2,
          nestedBlockPadding: 1,
          enforceBeginningPadding: false,
          enforceEndPadding: true,
          docstringPadding: 1,
          treatCommentsAsDocstrings: true
        }],
        "whitespaced/class-property-grouping": ["error", {
          paddingBetweenGroups: 1,
          enforceAlphabeticalSorting: false,
          groups: [
            {
              name: "static-properties",
              types: ["ClassProperty"],
              matches: ["static"],
              order: 0
            },
            {
              name: "static-methods",
              types: ["MethodDefinition"],
              matches: ["static"],
              order: 1
            },
            {
              name: "instance-properties",
              types: ["ClassProperty"],
              matches: [],
              order: 2
            },
            {
              name: "constructor",
              types: ["MethodDefinition"],
              matches: ["constructor"],
              order: 3
            },
            {
              name: "instance-methods",
              types: ["MethodDefinition"],
              matches: [],
              order: 4
            }
          ]
        }],
        "whitespaced/aligned-assignments": ["error", {
          alignComments: false,
          alignLiterals: false,
          blockSize: 2,
          ignoreAdjacent: true,
          ignoreIfAssignmentsNotInBlock: true,
          alignTypes: true,
          ignoreTypesMismatch: true
        }],
        "whitespaced/consistent-line-spacing": ["error", {
          beforeImports: 1,
          afterImports: 1,
          beforeExports: 1,
          afterExports: 1,
          beforeClass: 2,
          afterClass: 2,
          beforeFunction: 2,
          afterFunction: 2,
          beforeComment: 1,
          ignoreTopLevelCode: false,
          skipImportGroups: true
        }],
        "whitespaced/multiline-format": ["error", {
          allowSingleLine: true,
          multilineStyle: "consistent",
          minItems: 3,
          maxLineLength: 80,
          bracketStyle: "same-line",
          indentation: 2,
          trailingComma: "always",
          emptyLineBetweenGroups: false,
          consistentSpacing: true,
          objectAlignment: "none"
        }]
      }
    }
  }
};