# TSLint Rules of Hooks

[![Downloads badge](https://img.shields.io/npm/dw/tslint-react-hooks.svg?style=flat)](https://www.npmjs.com/package/tslint-react-hooks)
![Version badge](https://img.shields.io/npm/v/tslint-react-hooks.svg?style=flat)
![License badge](https://img.shields.io/npm/l/tslint-react-hooks.svg?style=flat)
![GitHub stars badge](https://img.shields.io/github/stars/Gelio/tslint-react-hooks.svg?style=social)
[![Build Status](https://dev.azure.com/vorenygelio/vorenygelio/_apis/build/status/Gelio.tslint-react-hooks?branchName=master)](https://dev.azure.com/vorenygelio/vorenygelio/_build/latest?definitionId=3&branchName=master)

![Demo](https://i.imgur.com/SGHlOvF.png)

A TSLint rule that enforces the [Rules of Hooks](https://reactjs.org/docs/hooks-rules.html) for
React hooks.

The rule is based on an [ESLint plugin for react hooks](https://github.com/facebook/react/blob/master/packages/eslint-plugin-react-hooks/README.md).

## Features

- detects using React hooks inside potentially-conditional branches:
  - if statements
  - short-circuit conditional expressions (`&&`, `||`)
  - ternary expressions
  - loops (`while`, `for`, `do ... while`)
  - functions that themselves are not custom hooks or components

## Installation

First, install [the rule](https://www.npmjs.com/package/tslint-react-hooks):

```sh
npm install tslint-react-hooks --save-dev
```

Then, add the `"tslint-react-hooks"` to the list of `extends` in your `tslint.json`:

```json
{
  "extends": ["tslint-react-hooks"]
}
```

and enable the rule in `tslint.json`:

```json
{
  "rules": {
    "react-hooks-nesting": "error"
  }
}
```

Possible values are `"error"`, `"warning"`, `true`, or `false`.

## False positives and not-covered cases

There are some cases that seem hard to analyze and may result in false positives or false negatives.

In such cases, disable the rule for a specific line using the following comment:

```ts
// tslint:disable:react-hooks-nesting
useEffect(() => {});
```

### Looping over static arrays

The rule may report false positives, for example in:

```ts
function MyComponent() {
  const array = [1, 2, 3];

  array.forEach(value => {
    React.useEffect(() => console.log(value));
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ [A hook cannot be used inside of another function]
  });
}
```

The `useEffect` hook will be called unconditionally and the call-order will be the same between
renders.

### Using renamed hooks (that do not start with _use_)

The rule only treats functions that start with _use_ as hooks. Therefore, renaming the hook will
result in avoiding the rule:

```ts
const renamedUseState = React.useState;

function MyComponent() {
  const [state, setState] = renamedUseState(0);
}
```

### Unconditional nesting

Unconditional nesting, for example:

```tsx
function MyComponent() {
  if (true) {
    const variableThatCannotBeLeaked = useContext(SomeContext);
    useEffect(() => {
      console.log(variableThatCannotBeLeaked);
    });
  }

  return <div>Text</div>;
}
```

is treated as conditional nesting. It seems hard to verify if the condition is in fact a constant,
therefore such a situation will always result in a rule violation.

In situations where such an `if` statement was used to create an additional block scope, use the
block scope directly:

```tsx
function MyComponent() {
  {
    const variableThatCannotBeLeaked = useContext(SomeContext);
    useEffect(() => {
      console.log(variableThatCannotBeLeaked);
    });
  }

  return <div>Text</div>;
}
```

## Author

The author of this rule is Grzegorz Rozdzialik.
