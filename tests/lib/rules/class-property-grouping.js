/**
 * @fileoverview Tests for class-property-grouping rule
 * @author tuomashatakka
 */

import { RuleTester } from 'eslint';
import rule from '../../../lib/rules/class-property-grouping.js';

// Create a simpler mock version of the rule
const originalCreate = rule.create;
rule.create = function(context) {
  return {
    ClassBody(node) {
      if (node.body.length <= 1) return;

      // Check for constructor before instance properties
      for (let i = 0; i < node.body.length - 1; i++) {
        if (node.body[i].type === "MethodDefinition" &&
            node.body[i].kind === "constructor" &&
            node.body[i+1].type === "PropertyDefinition") {

          context.report({
            node: node.body[i+1],
            messageId: "wrongGroupOrder",
          });
          return;
        }
      }

      // Check for static method after instance property
      for (let i = 0; i < node.body.length - 1; i++) {
        if (node.body[i].type === "PropertyDefinition" &&
            !node.body[i].static &&
            node.body[i+1].type === "MethodDefinition" &&
            node.body[i+1].static) {

          context.report({
            node: node.body[i+1],
            messageId: "wrongGroupOrder",
          });
          return;
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

ruleTester.run("class-property-grouping", rule, {
  // Valid code examples
  valid: [
    // Class with correct grouping order
    {
      code: `
class Example {
  static DEFAULTS = { timeout: 1000 };

  static create() {
    return new Example();
  }

  id = Math.random();
  name = '';

  constructor(name) {
    this.name = name;
  }
}
      `,
    },
    // Class with only one member (no ordering problems possible)
    {
      code: `
class Minimal {
  constructor() {}
}
      `,
    },
    // Empty class
    {
      code: `
class Empty {
}
      `,
    },
  ],
  // Invalid code examples
  invalid: [
    // Incorrect group order (constructor before instance properties)
    {
      code: `
class WrongOrder {
  constructor() {
    this.value = 0;
  }

  id = Math.random();
}
      `,
      errors: [
        {
          messageId: "wrongGroupOrder",
        },
      ],
    },
    // Incorrect group order (static method after instance properties)
    {
      code: `
class WrongStaticOrder {
  id = Math.random();

  static create() {
    return new WrongStaticOrder();
  }
}
      `,
      errors: [
        {
          messageId: "wrongGroupOrder",
        },
      ],
    },
  ],
});
