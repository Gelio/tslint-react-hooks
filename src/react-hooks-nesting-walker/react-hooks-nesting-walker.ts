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
} from 'typescript';

import { isHookCall } from './is-hook-call';
import { ERROR_MESSAGES } from './error-messages';
import { isBinaryConditionalExpression } from './is-binary-conditional-expression';
import { isComponentOrHookIdentifier } from './is-component-or-hook-identifier';
import { isReactComponentDecorator } from './is-react-component-decorator';

export class ReactHooksNestingWalker extends RuleWalker {
  public visitCallExpression(node: CallExpression) {
    if (isHookCall(node)) {
      this.visitHookAncestor(node, node.parent);
    }

    super.visitCallExpression(node);
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
       * ```
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

      // Disallow using hooks inside other kinds of functions
      this.addFailureAtNode(hookNode, ERROR_MESSAGES.invalidFunctionExpression);
      return;
    }

    this.visitHookAncestor(hookNode, ancestor.parent);
  }
}
