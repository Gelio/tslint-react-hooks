import { RuleWalker } from 'tslint';
import {
  CallExpression,
  Node,
  isIfStatement,
  isIterationStatement,
  isSwitchStatement,
  isConditionalExpression,
  isFunctionDeclaration,
  isVariableDeclaration,
  isArrowFunction,
  isFunctionExpression,
  isIdentifier,
  isSourceFile,
  isClassDeclaration,
  isCallExpression,
  ReturnStatement,
  isReturnStatement,
} from 'typescript';

import { isHookCall } from './is-hook-call';
import { ERROR_MESSAGES } from './error-messages';
import { isBinaryConditionalExpression } from './is-binary-conditional-expression';
import { isComponentOrHookIdentifier } from './is-component-or-hook-identifier';
import { isReactComponentDecorator } from './is-react-component-decorator';
import { findAncestorFunction } from './find-ancestor-function';
import { FunctionNode, isFunctionNode } from './function-node';
import { findClosestAncestorNode } from './find-closest-ancestor-node';
import { parseRuleOptions } from './options';

export class ReactHooksNestingWalker extends RuleWalker {
  private functionsWithReturnStatements = new Set<FunctionNode>();

  private readonly ruleOptions = parseRuleOptions(this.getOptions());

  public visitCallExpression(node: CallExpression) {
    if (isHookCall(node, this.ruleOptions)) {
      this.visitHookAncestor(node, node.parent);
    }

    super.visitCallExpression(node);
  }

  public visitReturnStatement(node: ReturnStatement) {
    const parentFunction = findAncestorFunction(node);

    if (parentFunction) {
      this.functionsWithReturnStatements.add(parentFunction);
    }

    super.visitReturnStatement(node);
  }

  private visitHookAncestor(hookNode: CallExpression, ancestor: Node) {
    /**
     * Fail for:
     * * if statements
     * * conditional expressions (binary and ternary)
     * * switch statements
     * * iterations statements
     * * classes
     */
    if (
      isIfStatement(ancestor) ||
      isSwitchStatement(ancestor) ||
      isConditionalExpression(ancestor) ||
      isBinaryConditionalExpression(ancestor) ||
      isSourceFile(ancestor) ||
      isClassDeclaration(ancestor)
    ) {
      this.addFailureAtNode(hookNode, ERROR_MESSAGES[ancestor.kind]);
      return;
    } else if (isIterationStatement(ancestor, false)) {
      this.addFailureAtNode(hookNode, ERROR_MESSAGES.iterationStatement);
      return;
    }

    /**
     * Finish visiting ancestors if the following node is encountered:
     * * `FunctionDeclaration`
     * * `VariableDeclaration`
     * * `FunctionExpression`
     *
     * If it not is a hook or a component, fail, as hooks cannot be nested inside arbitrary
     * functions.
     */
    if (isFunctionDeclaration(ancestor)) {
      /**
       * Allow using hooks inside functions that are hooks or components.
       *
       * ```ts
       * function useCustomHook() {
       *   useEffect();
       * }
       *
       * function MyComponent() {
       *   useEffect();
       * }
       * ```
       */

      if (this.functionsWithReturnStatements.has(ancestor)) {
        const closestReturnStatementOrFunctionNode = findClosestAncestorNode(
          hookNode,
          (node): node is ReturnStatement | FunctionNode =>
            isReturnStatement(node) || isFunctionNode(node),
        );

        if (
          closestReturnStatementOrFunctionNode &&
          !isReturnStatement(closestReturnStatementOrFunctionNode)
        ) {
          this.addFailureAtNode(hookNode, ERROR_MESSAGES.hookAfterEarlyReturn);
        }
      }

      if (ancestor.name && isComponentOrHookIdentifier(ancestor.name)) {
        return;
      }

      // Disallow using hooks inside other kinds of functions
      this.addFailureAtNode(
        hookNode,
        ERROR_MESSAGES.invalidFunctionDeclaration,
      );
      return;
    } else if (isArrowFunction(ancestor) || isFunctionExpression(ancestor)) {
      /**
       * Allow declaring custom hooks and components using arrow functions and function expressions
       *
       * ```ts
       * const useCustomHook = () => {
       *   useEffect();
       * }
       *
       * const MyComponent = function() {
       *   useEffect();
       * }
       *
       * const MyComponent = function MyComponent() {
       *   useEffect();
       * }
       * ```
       */

      /**
       * REFACTOR: Use a shared implementation for all types of functions.
       * The logic below is duplicated for function declarations.
       */
      if (this.functionsWithReturnStatements.has(ancestor)) {
        const closestReturnStatementOrFunctionNode = findClosestAncestorNode(
          hookNode,
          (node): node is ReturnStatement | FunctionNode =>
            isReturnStatement(node) || isFunctionNode(node),
        );

        if (
          closestReturnStatementOrFunctionNode &&
          !isReturnStatement(closestReturnStatementOrFunctionNode)
        ) {
          this.addFailureAtNode(hookNode, ERROR_MESSAGES.hookAfterEarlyReturn);
        }
      }

      /**
       * Detect using hooks inside named function expressions
       */
      if (ancestor.name && isComponentOrHookIdentifier(ancestor.name)) {
        return;
      }

      /**
       * Detect that an unnamed function expression is a component or a hook
       */
      if (
        isVariableDeclaration(ancestor.parent) &&
        isIdentifier(ancestor.parent.name) &&
        isComponentOrHookIdentifier(ancestor.parent.name)
      ) {
        return;
      }

      /**
       * Allow using hooks when the function is passed to `React.memo` or `React.forwardRef`
       */
      if (
        isCallExpression(ancestor.parent) &&
        isReactComponentDecorator(ancestor.parent.expression)
      ) {
        return;
      }

      /**
       * Detect if the unnamed expression is wrapped in a illegal function call
       */
      if (
        isCallExpression(ancestor.parent) &&
        isIdentifier(ancestor.parent.expression) &&
        !isComponentOrHookIdentifier(ancestor.parent.expression)
      ) {
        this.addFailureAtNode(
          hookNode,
          ERROR_MESSAGES.anonymousFunctionIllegalCallback,
        );
        return;
      }

      // Disallow using hooks inside other kinds of functions
      this.addFailureAtNode(hookNode, ERROR_MESSAGES.invalidFunctionExpression);
      return;
    }

    this.visitHookAncestor(hookNode, ancestor.parent);
  }
}
