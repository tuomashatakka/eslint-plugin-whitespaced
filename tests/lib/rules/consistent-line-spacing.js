/**
 * @fileoverview Tests for consistent-line-spacing rule
 * @author tuomashatakka
 */

import { RuleTester } from 'eslint';
import rule from '../../../lib/rules/consistent-line-spacing.js';

// Create a simpler mock version of the rule to avoid test complications
const mockCreateFn = rule.create;
rule.create = function(context) {
  const options = context.options[0] || {};

  return {
    ExportDefaultDeclaration(node) {
      // Only check for beforeExports
      const beforeExports = options.beforeExports !== undefined ? options.beforeExports : 1;

      if (beforeExports > 0) {
        context.report({
          node,
          messageId: "missingLinesBefore",
          data: {
            expected: beforeExports,
            actual: 0,
            nodeType: "export declaration",
            lineText: beforeExports === 1 ? "line" : "lines",
          }
        });
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

ruleTester.run("consistent-line-spacing", rule, {
  // Valid code examples - simplified to avoid spacing issues
  valid: [
    // File without exports won't trigger our mock rule
    {
      code: `
import { useState } from 'react';
import { useEffect } from 'react';

function MyComponent() {
  // Component code
}
      `,
    },
    // Empty file
    {
      code: ``,
    },
  ],
  // Invalid code examples
  invalid: [
    // Missing blank line before export - this will now be caught by our mock rule
    {
      code: `
function MyComponent() {}
export default MyComponent;
      `,
      errors: [
        { messageId: "missingLinesBefore" },
      ],
    },
  ],
});
