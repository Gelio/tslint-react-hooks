import { RuleWalker } from 'tslint';
import { CallExpression } from 'typescript';
import { isHookCall } from './is-hook-call';

export class RulesOfHooksWalker extends RuleWalker {
  public visitCallExpression(node: CallExpression) {
    if (isHookCall(node)) {
      this.verifyHookNesting(node);
    }

    super.visitCallExpression(node);
  }

  private verifyHookNesting(node: CallExpression) {}
}
