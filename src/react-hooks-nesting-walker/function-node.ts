import {
  FunctionDeclaration,
  FunctionExpression,
  ArrowFunction,
  Node,
  isFunctionDeclaration,
  isFunctionExpression,
  isArrowFunction,
} from 'typescript';

export type FunctionNode =
  | FunctionDeclaration
  | FunctionExpression
  | ArrowFunction;

const matchers = [isFunctionDeclaration, isFunctionExpression, isArrowFunction];

export function isFunctionNode(node: Node): node is FunctionNode {
  return matchers.some(matcher => matcher(node));
}
