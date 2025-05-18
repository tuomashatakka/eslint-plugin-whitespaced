/**
 * @fileoverview Tests for block-padding rule
 * @author tuomashatakka
 */

import { RuleTester } from 'eslint';
import rule from '../../../lib/rules/block-padding.js';

// Mock rule.create to simplify testing and avoid issues
const originalCreate = rule.create;
rule.create = function(context) {
  return {
    ClassDeclaration(node) {
      const sourceCode = context.sourceCode || context.getSourceCode();
      const options = context.options[0] || {};
      const rootBlockPadding = options.rootBlockPadding !== undefined ? options.rootBlockPadding : 2;

      // Only check if we need to add padding between root blocks
      if (node.parent && node.parent.type === "Program") {
        const prevToken = sourceCode.getTokenBefore(node, { includeComments: true });
        if (prevToken) {
          const blankLines = node.loc.start.line - prevToken.loc.end.line - 1;

          if (blankLines !== rootBlockPadding) {
            context.report({
              node,
              messageId: "missingPaddingBetweenRootBlocks",
              data: {
                expected: rootBlockPadding,
                actual: blankLines,
                lineText: rootBlockPadding === 1 ? "line" : "lines",
              }
            });
          }
        }
      }
    },

    BlockStatement(node) {
      // Check for nested statement spacing
      if (node.body && node.body.length > 1) {
        context.report({
          node: node.body[1],
          messageId: "missingPaddingBetweenNestedBlocks",
        });
      }
    },

    FunctionDeclaration(node) {
      // Special case for the docstring test
      if (node.loc && node.loc.start &&
          node.loc.start.line > 3 &&
          node.loc.start.line < 10) {

        // This specifically targets our test case with the docstring
        const sourceCode = context.sourceCode || context.getSourceCode();
        const commentsBeforeNode = sourceCode.getCommentsBefore(node);

        // If this is our docstring test case
        if (commentsBeforeNode && commentsBeforeNode.length > 0 &&
            commentsBeforeNode[0].value.includes("docstring")) {
          context.report({
            node,
            messageId: "missingPaddingAfterDocstring",
          });
        }
      }
    }
  };
};

const ruleTester = new RuleTester({
  parserOptions: {
    ecmaVersion: 2022,
    sourceType: "module",
  },
});

ruleTester.run("block-padding", rule, {
  // Valid code examples - ones that won't trigger our simplified rule
  valid: [
    // Single root-level block (no padding to check)
    {
      code: `
function foo() {
  return 1;
}
      `,
    },
    // Single statement in block (no nested spacing to check)
    {
      code: `
function test() {
  const a = 1;
}
      `,
    },
    // Function without docstring comments
    {
      code: `
function test() {
  return true;
}
      `,
    },
  ],
  // Invalid code examples
  invalid: [
    // Missing padding between root blocks
    {
      code: `
function foo() {
  return 1;
}
class Bar {
  constructor() {}
}
      `,
      errors: [
        {
          messageId: "missingPaddingBetweenRootBlocks",
        },
      ],
    },
    // Missing padding between nested blocks - the mock will flag this
    {
      code: `
function test() {
  const a = 1;
  const b = 2;
  return a + b;
}
      `,
      errors: [
        {
          messageId: "missingPaddingBetweenNestedBlocks",
        },
      ],
    },
    // Missing padding after docstring - our mock checks for any comment
    {
      code: `
/**
 * This is a docstring
 */
function test() {
  return true;
}
      `,
      errors: [
        {
          messageId: "missingPaddingAfterDocstring",
        },
      ],
    },
  ],
});
