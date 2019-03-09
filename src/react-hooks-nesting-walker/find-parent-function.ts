import { Node } from 'typescript';
import { FunctionNode, isFunctionNode } from './function-node';

export function findParentFunction(node: Node): FunctionNode | null {
  if (isFunctionNode(node)) {
    return node;
  }

  if (!node.parent) {
    return null;
  }

  return findParentFunction(node.parent);
}
