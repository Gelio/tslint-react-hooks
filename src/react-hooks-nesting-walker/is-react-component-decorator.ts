import { isReactApiExpression } from './is-react-api-expression';

const reactComponentDecorators = ['forwardRef', 'memo'];

/**
 * Tests is an expression is a React top-level API component decorator (e.g. `React.forwardRef`,
 * `React.memo`)
 */
export const isReactComponentDecorator = isReactApiExpression(identifier =>
  reactComponentDecorators.includes(identifier.text),
);
