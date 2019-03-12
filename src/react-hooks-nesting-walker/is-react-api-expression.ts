import {
  Identifier,
  isPropertyAccessExpression,
  isIdentifier,
  Expression,
} from 'typescript';

import { Predicate } from './predicate';

/**
 * Tests whether an `Expression` is an identifier that matches a predicate. Accepts also property
 * access of that identifier from React's top-level API.
 *
 * @example
 * const isForwardRef = isReactApiExpression((identifier) => identifier.text === 'forwardRef');
 * // would match `isForwardRef` or `React.isForwardRef`
 * const matches = isForwardRef(node);
 *
 * @param predicate Predicate that is run on the actual identifier.
 */
export const isReactApiExpression = (predicate: Predicate<Identifier>) => (
  expression: Expression,
) => {
  if (isIdentifier(expression)) {
    return predicate(expression);
  } else if (isPropertyAccessExpression(expression)) {
    return (
      isIdentifier(expression.expression) &&
      expression.expression.text === 'React' &&
      predicate(expression.name)
    );
  }

  return false;
};
