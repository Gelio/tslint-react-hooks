import {
  CallExpression,
  isPropertyAccessExpression,
  isIdentifier
} from 'typescript';

import { isHookIdentifier } from './is-hook-identifier';

/**
 * Tests is a `CallExpression` calls a React Hook
 * @see https://github.com/facebook/react/blob/master/packages/eslint-plugin-react-hooks/src/RulesOfHooks.js#L26
 */
export function isHookCall({ expression }: CallExpression) {
  if (isIdentifier(expression)) {
    /**
     * Test for direct `useHook` calls
     */
    return isHookIdentifier(expression);
  } else if (isPropertyAccessExpression(expression)) {
    /**
     * Test for `React.useHook` calls
     */
    return (
      isIdentifier(expression.expression) &&
      expression.expression.text === 'React' &&
      isHookIdentifier(expression.name)
    );
  }

  return false;
}
