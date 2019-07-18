import {
  CallExpression,
  isIdentifier,
  isPropertyAccessExpression,
  Expression,
} from 'typescript';

import { isHookIdentifier } from './is-hook-identifier';
import {
  RuleOptions,
  detectHooksFromNonReactNamespaceOptionName,
  ignoredFunctionsOptionName,
} from './options';

/**
 * Tests if a `CallExpression` calls a React Hook
 * @see https://github.com/facebook/react/blob/master/packages/eslint-plugin-react-hooks/src/RulesOfHooks.js#L26
 */
export function isHookCall(
  { expression }: CallExpression,
  ruleOptions: RuleOptions,
) {
  if (isIdentifier(expression) && isHookIdentifier(expression)) {
    return !ruleOptions[ignoredFunctionsOptionName].has(expression.text);
  } else if (
    isPropertyAccessExpression(expression) &&
    isHookIdentifier(expression.name)
  ) {
    if (ruleOptions[ignoredFunctionsOptionName].has(expression.name.text)) {
      return false;
    }
    if (ruleOptions[detectHooksFromNonReactNamespaceOptionName]) {
      return true;
    }

    /**
     * The expression from which the property is accessed.
     *
     * @example for `React.useState`, this would be the `React` identifier
     */
    const sourceExpression = expression.expression;

    return isReactIdentifier(sourceExpression);
  }

  return false;
}

const isReactIdentifier = (expression: Expression) =>
  isIdentifier(expression) && expression.text === 'React';
