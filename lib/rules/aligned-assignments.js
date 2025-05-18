/**
 * @fileoverview ESLint rule to enforce vertically aligned assignments
 * @author tuomashatakka
 */

export default {
  meta: {
    type: "layout",
    docs: {
      description: "Enforce vertically aligned assignments in declaration blocks",
      category: "Stylistic Issues",
      recommended: false,
    },
    fixable: "whitespace",
    schema: [{
      type: "object",
      properties: {
        alignComments: { type: "boolean", default: false },
        alignLiterals: { type: "boolean", default: false },
        blockSize: { type: "integer", minimum: 2, default: 2 },
        ignoreAdjacent: { type: "boolean", default: true },
        ignoreIfAssignmentsNotInBlock: { type: "boolean", default: true },
        alignTypes: { type: "boolean", default: false },
        ignoreTypesMismatch: { type: "boolean", default: true }
      },
      additionalProperties: false
    }],
    messages: {
      misalignedAssignment: "Assignment operators should be vertically aligned within blocks.",
      misalignedTypes: "Type declarations should be vertically aligned within blocks."
    },
  },
  create(context) {
    const sourceCode = context.sourceCode || context.getSourceCode();
    const options = context.options[0] || {};

    const alignComments = options.alignComments !== undefined ? options.alignComments : false;
    const alignLiterals = options.alignLiterals !== undefined ? options.alignLiterals : false;
    const blockSize = options.blockSize !== undefined ? options.blockSize : 2;
    const ignoreAdjacent = options.ignoreAdjacent !== undefined ? options.ignoreAdjacent : true;
    const ignoreIfAssignmentsNotInBlock = options.ignoreIfAssignmentsNotInBlock !== undefined ? options.ignoreIfAssignmentsNotInBlock : true;
    const alignTypes = options.alignTypes !== undefined ? options.alignTypes : false;
    const ignoreTypesMismatch = options.ignoreTypesMismatch !== undefined ? options.ignoreTypesMismatch : true;

    function getEqualsColumn(declarator) {
      const equalsToken = sourceCode.getTokenBefore(
        declarator.init,
        token => token.value === "="
      );

      return equalsToken ? equalsToken.loc.start.column : null;
    }

    function getTypeColonColumn(declarator) {
      if (declarator.id && declarator.id.typeAnnotation) {
        const colonToken = sourceCode.getFirstToken(declarator.id.typeAnnotation);
        return colonToken ? colonToken.loc.start.column : null;
      }
      return null;
    }

    function areNodesAdjacent(node1, node2) {
      return node2.loc.start.line === node1.loc.end.line + 1;
    }

    function haveSameKind(declarations) {
      if (!declarations.length) return true;

      const firstKind = declarations[0].parent.kind;
      return declarations.every(decl => decl.parent.kind === firstKind);
    }

    function allHaveTypes(declarations) {
      return declarations.every(decl =>
        decl.id && decl.id.typeAnnotation
      );
    }

    function anyHaveTypes(declarations) {
      return declarations.some(decl =>
        decl.id && decl.id.typeAnnotation
      );
    }

    function getMaxEqualsColumn(declarations) {
      return Math.max(...declarations.map(getEqualsColumn));
    }

    function getMaxTypeColonColumn(declarations) {
      const columns = declarations
        .map(getTypeColonColumn)
        .filter(column => column !== null);

      return columns.length ? Math.max(...columns) : null;
    }

    function getFixedDeclaration(declarator, targetEqualsColumn, targetTypeColumn) {
      const originalText = sourceCode.getText(declarator);
      const idText = sourceCode.getText(declarator.id);
      let initText = declarator.init ? sourceCode.getText(declarator.init) : "";
      let equalsColumn = getEqualsColumn(declarator);

      let hasType = false;
      let typeColon = null;
      let typeText = "";

      if (declarator.id && declarator.id.typeAnnotation) {
        hasType = true;
        typeColon = getTypeColonColumn(declarator);
        typeText = sourceCode.getText(declarator.id.typeAnnotation);
      }

      if (!equalsColumn) {
        return originalText;
      }

      let result = idText;

      if (hasType && targetTypeColumn !== null) {
        const typeColonPadding = " ".repeat(targetTypeColumn - (idText.length + result.length));
        result += typeColonPadding + typeText;
      }

      const currentEndPos = hasType ? typeColon + typeText.length : idText.length;
      const equalsPadding = " ".repeat(targetEqualsColumn - currentEndPos);
      result += equalsPadding + "= " + initText;

      return result;
    }

    function checkAlignment(declarations) {
      if (declarations.length < blockSize) {
        return;
      }

      if (ignoreIfAssignmentsNotInBlock && !haveSameKind(declarations)) {
        return;
      }

      const maxEqualsColumn = getMaxEqualsColumn(declarations);

      let maxTypeColonColumn = null;
      if (alignTypes && anyHaveTypes(declarations)) {
        if (ignoreTypesMismatch && !allHaveTypes(declarations)) {
          // Skip only type alignment but still do equals alignment
        } else {
          maxTypeColonColumn = getMaxTypeColonColumn(declarations);
        }
      }

      declarations.forEach(declarator => {
        const equalsColumn = getEqualsColumn(declarator);

        if (equalsColumn !== null && equalsColumn !== maxEqualsColumn) {
          context.report({
            node: declarator,
            messageId: "misalignedAssignment",
            fix(fixer) {
              return fixer.replaceText(
                declarator,
                getFixedDeclaration(declarator, maxEqualsColumn, maxTypeColonColumn)
              );
            }
          });
        }

        if (alignTypes && maxTypeColonColumn !== null) {
          const typeColumn = getTypeColonColumn(declarator);

          if (typeColumn !== null && typeColumn !== maxTypeColonColumn) {
            context.report({
              node: declarator,
              messageId: "misalignedTypes",
              fix(fixer) {
                return fixer.replaceText(
                  declarator,
                  getFixedDeclaration(declarator, maxEqualsColumn, maxTypeColonColumn)
                );
              }
            });
          }
        }
      });
    }

    function processDeclarationGroup(declarations) {
      if (!declarations.length) return;

      const declarationsWithInits = declarations.filter(decl => decl.init);

      if (declarationsWithInits.length < blockSize) {
        return;
      }

      if (ignoreAdjacent) {
        const adjacentGroups = [];
        let currentGroup = [declarationsWithInits[0]];

        for (let i = 1; i < declarationsWithInits.length; i++) {
          const prevDecl = declarationsWithInits[i - 1];
          const currentDecl = declarationsWithInits[i];

          if (areNodesAdjacent(prevDecl, currentDecl)) {
            currentGroup.push(currentDecl);
          } else {
            if (currentGroup.length >= blockSize) {
              adjacentGroups.push(currentGroup);
            }
            currentGroup = [currentDecl];
          }
        }

        if (currentGroup.length >= blockSize) {
          adjacentGroups.push(currentGroup);
        }

        adjacentGroups.forEach(checkAlignment);
      } else {
        checkAlignment(declarationsWithInits);
      }
    }

    function processBlockVariables(node) {
      const declarations = [];
      const scopeBody = node.type === 'Program' ? node.body : node.body ? node.body : [];

      for (const statement of scopeBody) {
        if (statement.type === 'VariableDeclaration') {
          declarations.push(...statement.declarations);
        }
      }

      processDeclarationGroup(declarations);
    }

    return {
      Program(node) {
        processBlockVariables(node);
      },

      BlockStatement(node) {
        processBlockVariables(node);
      },

      SwitchCase(node) {
        if (node.consequent) {
          const declarations = [];

          for (const statement of node.consequent) {
            if (statement.type === 'VariableDeclaration') {
              declarations.push(...statement.declarations);
            }
          }

          processDeclarationGroup(declarations);
        }
      }
    };
  }
};