import {
  BinaryExpression,
  isBinaryExpression,
  Node,
  SyntaxKind,
} from 'typescript';

const binaryConditionalOperators = [
  SyntaxKind.AmpersandAmpersandToken,
  SyntaxKind.BarBarToken,
];

export function isBinaryConditionalExpression(
  node: Node,
): node is BinaryExpression {
  if (!isBinaryExpression(node)) {
    return false;
  }

  return binaryConditionalOperators.includes(node.operatorToken.kind);
}
