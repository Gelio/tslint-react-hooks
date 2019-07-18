import { SourceFile } from 'typescript';
import { Rules, IRuleMetadata, Utils } from 'tslint';

import { ReactHooksNestingWalker } from './react-hooks-nesting-walker/react-hooks-nesting-walker';
import {
  detectHooksFromNonReactNamespaceOptionName,
  ignoredFunctionsOptionName
} from './react-hooks-nesting-walker/options';

export class Rule extends Rules.AbstractRule {
  public static metadata: IRuleMetadata = {
    ruleName: 'react-hooks-nesting',
    description: 'Enforces Rules of Hooks',
    descriptionDetails: 'See https://reactjs.org/docs/hooks-rules.html',

    optionsDescription: Utils.dedent`
      An optional object with optional properties:
      - ${detectHooksFromNonReactNamespaceOptionName} When set to true,
      violations will be reported for hooks from namespaces other
      than the React namespace (e.g. \`MyHooks.useHook\` will be treated as a hook).
      - ${ignoredFunctionsOptionName} contains a list of function names,
      that are never treated as hooks.
      Also effects things from the React namespace, use with care.
    `,
    options: {
      type: 'object',
      properties: {
        [detectHooksFromNonReactNamespaceOptionName]: {
          type: 'boolean',
        },
        [ignoredFunctionsOptionName]: {
          type: 'array',
          items: {
            type: 'string',
          },
        },
      },
    },
    optionExamples: [
      true,
      [true, { [detectHooksFromNonReactNamespaceOptionName]: true }],
      [true, { [ignoredFunctionsOptionName]: ['useTestHelper'] }],
    ],

    hasFix: false,
    type: 'functionality',
    typescriptOnly: false,
    requiresTypeInfo: false,
  };

  public apply(sourceFile: SourceFile) {
    return this.applyWithWalker(
      new ReactHooksNestingWalker(sourceFile, this.getOptions()),
    );
  }
}
