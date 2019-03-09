import { SyntaxKind } from 'typescript';

export const ERROR_MESSAGES = {
  [SyntaxKind.IfStatement]: 'A hook cannot appear inside an if statement',
  [SyntaxKind.SwitchStatement]:
    'A hook cannot appear inside a switch statement',
  [SyntaxKind.BinaryExpression]:
    'A hook cannot be used in a conditional expression',
  [SyntaxKind.ConditionalExpression]:
    'A hook cannot be used in a conditional expression',
  [SyntaxKind.SourceFile]:
    'A hook cannot be used outside of a component or another hook',
  [SyntaxKind.ClassDeclaration]: 'A hook cannot be used in a class component',

  iterationStatement: 'A hook cannot appear inside a loop',
  invalidFunctionDeclaration:
    'A hook cannot be used inside of another function',
  invalidFunctionExpression: 'A hook cannot be used inside of another function',
  hookAfterEarlyReturn: 'A hook should not appear after a return statement',
};
