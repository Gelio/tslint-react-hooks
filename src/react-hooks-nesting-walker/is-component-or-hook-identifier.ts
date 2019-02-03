import { Identifier } from 'typescript';

import { isComponentIdentifier } from './is-component-identifier';
import { isHookIdentifier } from './is-hook-identifier';

export function isComponentOrHookIdentifier(node: Identifier) {
  return isComponentIdentifier(node) || isHookIdentifier(node);
}
