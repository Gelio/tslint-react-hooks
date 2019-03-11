import { Node } from 'typescript';

import { FunctionNode, isFunctionNode } from './function-node';
import { findClosestAncestorNode } from './find-closest-ancestor-node';

export function findAncestorFunction(node: Node): FunctionNode | null {
  return findClosestAncestorNode(node, isFunctionNode);
}
