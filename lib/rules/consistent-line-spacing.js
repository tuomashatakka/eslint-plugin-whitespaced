/**
 * @fileoverview ESLint rule to enforce consistent line spacing before and after statements
 * @author tuomashatakka
 */

export default {
  meta: {
    type: "layout",
    docs: {
      description: "Enforce consistent line spacing before and after statements",
      category: "Stylistic Issues",
      recommended: false,
    },
    fixable: "whitespace",
    schema: [{
      type: "object",
      properties: {
        beforeImports: { type: "integer", minimum: 0, default: 1 },
        afterImports: { type: "integer", minimum: 0, default: 1 },
        beforeExports: { type: "integer", minimum: 0, default: 1 },
        afterExports: { type: "integer", minimum: 0, default: 1 },
        beforeClass: { type: "integer", minimum: 0, default: 2 },
        afterClass: { type: "integer", minimum: 0, default: 2 },
        beforeFunction: { type: "integer", minimum: 0, default: 2 },
        afterFunction: { type: "integer", minimum: 0, default: 2 },
        beforeComment: { type: "integer", minimum: 0, default: 1 },
        ignoreTopLevelCode: { type: "boolean", default: false },
        skipImportGroups: { type: "boolean", default: true }
      },
      additionalProperties: false
    }],
    messages: {
      missingLinesBefore: "Expected {{expected}} empty {{lineText}} before {{nodeType}}, but found {{actual}}.",
      missingLinesAfter: "Expected {{expected}} empty {{lineText}} after {{nodeType}}, but found {{actual}}."
    },
  },
  create(context) {
    const sourceCode = context.sourceCode || context.getSourceCode();
    const options = context.options[0] || {};

    const beforeImports = options.beforeImports !== undefined ? options.beforeImports : 1;
    const afterImports = options.afterImports !== undefined ? options.afterImports : 1;
    const beforeExports = options.beforeExports !== undefined ? options.beforeExports : 1;
    const afterExports = options.afterExports !== undefined ? options.afterExports : 1;
    const beforeClass = options.beforeClass !== undefined ? options.beforeClass : 2;
    const afterClass = options.afterClass !== undefined ? options.afterClass : 2;
    const beforeFunction = options.beforeFunction !== undefined ? options.beforeFunction : 2;
    const afterFunction = options.afterFunction !== undefined ? options.afterFunction : 2;
    const beforeComment = options.beforeComment !== undefined ? options.beforeComment : 1;
    const ignoreTopLevelCode = options.ignoreTopLevelCode !== undefined ? options.ignoreTopLevelCode : false;
    const skipImportGroups = options.skipImportGroups !== undefined ? options.skipImportGroups : true;

    function getBlankLinesBetween(node1, node2) {
      const node1End = node1.loc.end.line;
      const node2Start = node2.loc.start.line;
      return node2Start - node1End - 1;
    }

    function getNextNonCommentToken(node) {
      const nextToken = sourceCode.getTokenAfter(node, { includeComments: false });
      return nextToken;
    }

    function getPrevNonCommentToken(node) {
      const prevToken = sourceCode.getTokenBefore(node, { includeComments: false });
      return prevToken;
    }

    function isFirstInParent(node) {
      const parent = node.parent;
      if (!parent || !parent.body || !parent.body.length) {
        return true;
      }

      return parent.body[0] === node;
    }

    function isLastInParent(node) {
      const parent = node.parent;
      if (!parent || !parent.body || !parent.body.length) {
        return true;
      }

      return parent.body[parent.body.length - 1] === node;
    }

    function isTopLevel(node) {
      return node.parent && node.parent.type === "Program";
    }

    function isImport(node) {
      return node.type === "ImportDeclaration";
    }

    function isExport(node) {
      return node.type === "ExportNamedDeclaration" ||
             node.type === "ExportDefaultDeclaration" ||
             node.type === "ExportAllDeclaration";
    }

    function hasCommentBefore(node) {
      const beforeToken = sourceCode.getTokenBefore(node, { includeComments: true });
      return beforeToken && (beforeToken.type === "Block" || beforeToken.type === "Line");
    }

    function checkLinesBefore(node, requiredLines, nodeType) {
      if (isFirstInParent(node) && (ignoreTopLevelCode && isTopLevel(node))) {
        return;
      }

      const prevToken = getPrevNonCommentToken(node);
      const prevNode = prevToken ? sourceCode.getNodeByRangeIndex(prevToken.range[0]) : null;

      if (skipImportGroups && isImport(node) && prevNode && isImport(prevNode)) {
        return;
      }

      const prevTokenWithComments = sourceCode.getTokenBefore(node, { includeComments: true });
      if (!prevTokenWithComments) {
        return;
      }

      const blankLines = node.loc.start.line - prevTokenWithComments.loc.end.line - 1;

      if (blankLines !== requiredLines) {
        context.report({
          node,
          messageId: "missingLinesBefore",
          data: {
            expected: requiredLines,
            actual: blankLines,
            nodeType,
            lineText: requiredLines === 1 ? "line" : "lines",
          },
          fix(fixer) {
            const tokenBefore = sourceCode.getTokenBefore(node, { includeComments: true });
            if (!tokenBefore) {
              return null;
            }

            const range = [tokenBefore.range[1], node.range[0]];
            const newLines = "\n".repeat(requiredLines + 1); // +1 because one newline is the end of the previous line

            return fixer.replaceTextRange(range, newLines);
          }
        });
      }
    }

    function checkLinesAfter(node, requiredLines, nodeType) {
      if (isLastInParent(node) && (ignoreTopLevelCode && isTopLevel(node))) {
        return;
      }

      const nextToken = getNextNonCommentToken(node);
      const nextNode = nextToken ? sourceCode.getNodeByRangeIndex(nextToken.range[0]) : null;

      if (skipImportGroups && isImport(node) && nextNode && isImport(nextNode)) {
        return;
      }

      const nextTokenWithComments = sourceCode.getTokenAfter(node, { includeComments: true });
      if (!nextTokenWithComments) {
        return;
      }

      const blankLines = nextTokenWithComments.loc.start.line - node.loc.end.line - 1;

      if (blankLines !== requiredLines) {
        context.report({
          node,
          messageId: "missingLinesAfter",
          data: {
            expected: requiredLines,
            actual: blankLines,
            nodeType,
            lineText: requiredLines === 1 ? "line" : "lines",
          },
          fix(fixer) {
            const tokenAfter = sourceCode.getTokenAfter(node, { includeComments: true });
            if (!tokenAfter) {
              return null;
            }

            const range = [node.range[1], tokenAfter.range[0]];
            const newLines = "\n".repeat(requiredLines + 1); // +1 because one newline is the end of the current line

            return fixer.replaceTextRange(range, newLines);
          }
        });
      }
    }

    return {
      ImportDeclaration(node) {
        checkLinesBefore(node, beforeImports, "import declaration");
        checkLinesAfter(node, afterImports, "import declaration");
      },

      ExportNamedDeclaration(node) {
        checkLinesBefore(node, beforeExports, "export declaration");
        checkLinesAfter(node, afterExports, "export declaration");
      },

      ExportDefaultDeclaration(node) {
        checkLinesBefore(node, beforeExports, "export declaration");
        checkLinesAfter(node, afterExports, "export declaration");
      },

      ExportAllDeclaration(node) {
        checkLinesBefore(node, beforeExports, "export declaration");
        checkLinesAfter(node, afterExports, "export declaration");
      },

      ClassDeclaration(node) {
        checkLinesBefore(node, beforeClass, "class declaration");
        checkLinesAfter(node, afterClass, "class declaration");
      },

      FunctionDeclaration(node) {
        checkLinesBefore(node, beforeFunction, "function declaration");
        checkLinesAfter(node, afterFunction, "function declaration");
      },

      BlockComment(node) {
        if (node.loc.start.column === 0) {
          checkLinesBefore(node, beforeComment, "block comment");
        }
      },
    };
  }
};