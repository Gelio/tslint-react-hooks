import { SourceFile } from 'typescript';
import { Rules, IRuleMetadata } from 'tslint';

import { ReactHooksNestingWalker } from './react-hooks-nesting-walker/react-hooks-nesting-walker';

export class Rule extends Rules.AbstractRule {
  public static metadata: IRuleMetadata = {
    ruleName: 'react-hooks-nesting',
    description: 'Enforces Rules of Hooks',
    descriptionDetails: 'See https://reactjs.org/docs/hooks-rules.html',

    optionsDescription: 'There are no available options.',
    options: null,
    optionExamples: [true],

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
