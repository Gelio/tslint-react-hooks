import { Identifier } from 'typescript';

/**
 * Tests if an identifier could be a component's name.
 * @param node
 */
export function isComponentIdentifier(node: Identifier) {
  return isComponentName(node.text);
}

/**
 * Tests if the name could be a component's name.
 *
 * @see https://github.com/facebook/react/blob/master/packages/eslint-plugin-react-hooks/src/RulesOfHooks.js#L49
 *
 * @param name
 */
function isComponentName(name: string) {
  return !/^[a-z]/.test(name);
}
