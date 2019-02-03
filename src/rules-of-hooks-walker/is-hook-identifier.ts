import { Identifier } from 'typescript';

export function isHookIdentifier(node: Identifier) {
  return isHookName(node.text);
}

/**
 * @see https://github.com/facebook/react/blob/master/packages/eslint-plugin-react-hooks/src/RulesOfHooks.js#L17
 * @param name
 */
function isHookName(name: string) {
  return /^use[A-Z0-9].*$/.test(name);
}
