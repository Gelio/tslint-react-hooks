import { CallExpression } from 'typescript';

import { isHookIdentifier } from './is-hook-identifier';
import { isReactApiExpression } from './is-react-api-expression';

/**
 * Tests if a `CallExpression` calls a React Hook
 * @see https://github.com/facebook/react/blob/master/packages/eslint-plugin-react-hooks/src/RulesOfHooks.js#L26
 */
export function isHookCall({ expression }: CallExpression) {
  return isHookAccessExpression(expression);
}

/**
 * Tests for `useHook` or `React.useHook` calls
 */
const isHookAccessExpression = isReactApiExpression(isHookIdentifier);
