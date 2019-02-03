import { SourceFile } from 'typescript';
import { Rules, IRuleMetadata } from 'tslint';

import { RulesOfHooksWalker } from './rules-of-hooks-walker/rules-of-hooks-walker';

export class Rule extends Rules.AbstractRule {
  public static metadata: IRuleMetadata = {
    ruleName: 'rules-of-react-hooks',
    description: 'Enforces Rules of Hooks',
    optionsDescription: 'There are no available options.',
    hasFix: false,
    options: null,
    optionExamples: [true],
    type: 'functionality',
    typescriptOnly: false
  };

  public apply(sourceFile: SourceFile) {
    return this.applyWithWalker(
      new RulesOfHooksWalker(sourceFile, this.getOptions())
    );
  }
}
