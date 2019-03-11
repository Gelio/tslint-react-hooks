import { Node } from 'typescript';

import { TypeGuardPredicate } from './predicate';

/**
 * Finds a closest ancestor that matches a given predicate.
 *
 * Ensures type safety
 */
export function findClosestAncestorNode<ParentNodeType extends Node = Node>(
  startingNode: Node,
  predicate: TypeGuardPredicate<Node, ParentNodeType>,
): ParentNodeType | null {
  if (!startingNode.parent) {
    return null;
  }

  if (predicate(startingNode.parent)) {
    return startingNode.parent;
  }

  return findClosestAncestorNode(startingNode.parent, predicate);
}
