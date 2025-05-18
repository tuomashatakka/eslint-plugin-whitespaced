# eslint-plugin-whitespaced

ESLint plugin that enforces whitespaced formatting in JavaScript/TypeScript code.

> **Note:** This plugin's tests need to be adjusted to match the implementation. Some tests might fail when running `npm test`.

## Installation

```bash
npm install eslint-plugin-whitespaced --save-dev
```

Then, in your `.eslintrc.js` file:

```js
module.exports = {
  plugins: ['whitespaced'],
  rules: {
    // Enable rules you want to use
    'whitespaced/block-padding': 'error',
    'whitespaced/class-property-grouping': 'error',
    'whitespaced/aligned-assignments': 'error',
    'whitespaced/consistent-line-spacing': 'error',
    'whitespaced/multiline-format': 'error'
  }
};
```

Or use the recommended configuration:

```js
module.exports = {
  extends: ['plugin:whitespaced/recommended']
};
```

## Rules

### whitespaced/block-padding

This rule enforces whitespaced block padding in your code:

- Two empty lines between root-level blocks (classes, functions, etc.)
- One empty line between nested blocks (within functions, classes, etc.)
- One empty line between docstrings and the code they document
- Optionally enforces no empty lines at the beginning of the file
- Optionally enforces specific number of empty lines at the end of the file

#### Options

```js
{
  // Number of empty lines required between root-level blocks
  "rootBlockPadding": 2, // default: 2

  // Number of empty lines required between nested blocks
  "nestedBlockPadding": 1, // default: 1

  // Whether to enforce no empty lines at the beginning of the file
  "enforceBeginningPadding": false, // default: false

  // Whether to enforce empty lines at the end of the file
  "enforceEndPadding": true, // default: false

  // Number of empty lines required after docstrings
  "docstringPadding": 1, // default: 1

  // Whether to treat consecutive line comments as docstrings
  "treatCommentsAsDocstrings": true, // default: true
}
```

### whitespaced/class-property-grouping

This rule enforces consistent grouping and ordering of class properties and methods, similar to Python style conventions:

- Groups class members by type (static properties, static methods, instance properties, constructor, instance methods)
- Enforces a specific order for these groups
- Optionally enforces alphabetical ordering within each group
- Enforces consistent padding between different member groups

#### Options

```js
{
  // Defines the groups and their order
  "groups": [
    {
      "name": "static-properties", // Group name
      "types": ["ClassProperty"],  // AST node types in this group
      "matches": ["static"],       // Special conditions to match
      "order": 0                  // Sort order (lower numbers come first)
    },
    // ... other groups
  ],

  // Number of empty lines required between different groups
  "paddingBetweenGroups": 1, // default: 1

  // Whether to enforce alphabetical ordering within each group
  "enforceAlphabeticalSorting": false // default: false
}
```

### whitespaced/aligned-assignments

This rule enforces vertically aligned assignments for variable declarations, making your code more readable by creating a visually consistent column of assignment operators:

```js
// Before:
const short = "value";
const veryLongIdentifier = "another value";
let anotherVar = 1000;

// After:
const short             = "value";
const veryLongIdentifier = "another value";
let anotherVar          = 1000;
```

#### Options

```js
{
  // Minimum declarations needed to trigger alignment (default: 2)
  "blockSize": 2,

  // Only align sequences of declarations that are on adjacent lines (default: true)
  "ignoreAdjacent": true,

  // Skip alignment if declarations have different kinds (const/let/var) (default: true)
  "ignoreIfAssignmentsNotInBlock": true,

  // Align type annotations in TypeScript (default: false)
  "alignTypes": false,

  // Skip type alignment if some declarations have types and others don't (default: true)
  "ignoreTypesMismatch": true
}
```

### whitespaced/consistent-line-spacing

This rule enforces consistent spacing between different types of code blocks, following Python's conventions for clear visual separation between logical sections of code.

#### Options

```js
{
  // Number of blank lines required before different statement types
  "beforeImports": 1,
  "beforeExports": 1,
  "beforeClass": 2,
  "beforeFunction": 2,
  "beforeComment": 1,

  // Number of blank lines required after different statement types
  "afterImports": 1,
  "afterExports": 1,
  "afterClass": 2,
  "afterFunction": 2,

  // Control handling of top-level code
  "ignoreTopLevelCode": false,

  // Skip checking between consecutive imports
  "skipImportGroups": true
}
```

### whitespaced/multiline-format

This rule enforces consistent formatting for multiline objects and arrays, following Python's conventions for clean, readable code.

#### Options

```js
{
  // Whether to allow objects and arrays on a single line
  "allowSingleLine": true,

  // When to enforce multiline formatting
  "multilineStyle": "consistent", // "always", "never", or "consistent"

  // Minimum number of items before enforcing multiline format
  "minItems": 3,

  // Maximum line length before enforcing multiline format
  "maxLineLength": 80,

  // Whether opening brackets should be on the same or new line
  "bracketStyle": "same-line", // "same-line" or "new-line"

  // Indentation level in spaces
  "indentation": 2,

  // Whether to require trailing commas in multiline objects/arrays
  "trailingComma": "always", // "always" or "never"

  // Whether to align object colons or values
  "objectAlignment": "none", // "colon", "value", or "none"

  // Enforce consistent spacing in objects
  "consistentSpacing": true
}
```

## License

MIT
