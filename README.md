# TSLint Rules of Hooks

> **This package is no longer maintained.** [TSLint is deprecated](https://github.com/palantir/tslint/issues/4534),
> and v2.3.0 is the final release of `tslint-react-hooks`. Use
> [`eslint-plugin-react-hooks`](https://www.npmjs.com/package/eslint-plugin-react-hooks) with
> [typescript-eslint](https://typescript-eslint.io) instead. See
> [Migrating to ESLint](#migrating-to-eslint).

[![Downloads badge](https://img.shields.io/npm/dw/tslint-react-hooks.svg?style=flat)](https://www.npmjs.com/package/tslint-react-hooks)
[![Version badge](https://img.shields.io/npm/v/tslint-react-hooks.svg?style=flat)](https://www.npmjs.com/package/tslint-react-hooks)
[![License badge](https://img.shields.io/npm/l/tslint-react-hooks.svg?style=flat)](https://github.com/Gelio/tslint-react-hooks/blob/master/LICENSE.md)
[![GitHub stars badge](https://img.shields.io/github/stars/Gelio/tslint-react-hooks.svg?style=social)](https://github.com/Gelio/tslint-react-hooks)
[![CI](https://github.com/Gelio/tslint-react-hooks/actions/workflows/ci.yml/badge.svg?branch=master)](https://github.com/Gelio/tslint-react-hooks/actions/workflows/ci.yml)

![Demo](https://i.imgur.com/SGHlOvF.png)

A TSLint rule that enforces the [Rules of Hooks](https://react.dev/reference/rules/rules-of-hooks) for
React hooks.

The rule is based on an [ESLint plugin for react hooks](https://github.com/react/react/tree/main/packages/eslint-plugin-react-hooks).

## Features

- detects using React hooks inside potentially-conditional branches:
  - if statements
  - short-circuit conditional expressions (`&&`, `||`)
  - ternary expressions
  - loops (`while`, `for`, `do ... while`)
  - functions that themselves are not custom hooks or components
- detects using React hooks in spite of an early return
- support for detecting hooks from namespaces other than `React` (e.g. `MyHooks.useHook`) (**optional**)

## Migrating to ESLint

The `rules-of-hooks` rule in the official
[`eslint-plugin-react-hooks`](https://github.com/react/react/tree/main/packages/eslint-plugin-react-hooks)
checks the same Rules of Hooks as this package, and the plugin also ships `exhaustive-deps`, which
checks effect dependency arrays and has no equivalent here.

1. Set up ESLint for TypeScript by following the
   [typescript-eslint Getting Started guide](https://typescript-eslint.io/getting-started).

2. Optionally, convert the rest of your `tslint.json` with
   [`tslint-to-eslint-config`](https://github.com/typescript-eslint/tslint-to-eslint-config):

   ```sh
   npx tslint-to-eslint-config
   ```

   It writes a legacy `.eslintrc.js` file, which ESLint 10 no longer reads, so treat its output as a
   starting point to move into `eslint.config.mjs` (e.g. with
   [`@eslint/migrate-config`](https://www.npmjs.com/package/@eslint/migrate-config)). It does not
   convert `react-hooks-nesting`; replace that rule by hand in the next steps.

3. Install the plugin:

   ```sh
   npm install eslint-plugin-react-hooks --save-dev
   ```

4. Enable the rules in `eslint.config.mjs`, next to the typescript-eslint config:

   ```js
   // eslint.config.mjs
   import js from '@eslint/js';
   import { defineConfig } from 'eslint/config';
   import reactHooks from 'eslint-plugin-react-hooks';
   import tseslint from 'typescript-eslint';

   export default defineConfig(
     {
       files: ['**/*.{js,jsx,ts,tsx}'],
       extends: [js.configs.recommended, tseslint.configs.recommended],
     },
     {
       files: ['**/*.{js,jsx,ts,tsx}'],
       plugins: { 'react-hooks': reactHooks },
       rules: {
         'react-hooks/rules-of-hooks': 'error',
         'react-hooks/exhaustive-deps': 'warn',
       },
     },
   );
   ```

   This enables only the two classic hooks rules. The plugin's README recommends its preset,
   `reactHooks.configs.flat.recommended`, which also turns on its React Compiler rules.

5. Remove `tslint-react-hooks`, TSLint and your `tslint.json` once ESLint covers your code.

A `"warning"` severity in `tslint.json` becomes `'warn'` in ESLint. Rewrite
`tslint:disable` comments for `react-hooks-nesting` as ESLint disable comments for
`react-hooks/rules-of-hooks`, e.g. `// eslint-disable-next-line react-hooks/rules-of-hooks`.

The `detect-hooks-from-non-react-namespace` option has no direct equivalent. `rules-of-hooks` has
no option for it, and always treats `Namespace.useSomething` as a hook when the namespace starts
with an uppercase letter: `MyHooks.useHook` is checked, while `myHooks.useHook` is not.

### Compatibility

The final release supports TSLint 5 and 6, and TypeScript 2.4 through 6.x. TypeScript 7 is not
supported: TSLint itself crashes on it.

## Installation

First, install [the rule](https://www.npmjs.com/package/tslint-react-hooks):

```sh
npm install tslint-react-hooks --save-dev
```

Then, enable the rule by modifying `tslint.json`:

```js
{
  "extends": [
    // your other plugins...
    "tslint-react-hooks"
  ],
  "rules": {
    // your other rules...
    "react-hooks-nesting": "error"
  }
}
```

To report rule violations as warnings instead of errors, set it to `"warning"`.

## Options

While the rule works fine out-of-the-box, it can be customized. To specify options, use the
following syntax when modifying `tslint.json`:

```js
{
  "extends": [
    // your other plugins...
    "tslint-react-hooks"
  ],
  "rules": {
    // your other rules...
    "react-hooks-nesting": {
      "severity": "error", // "error", "warning", "default" or "off"
      "options": {
        // options go here
      }
    }
  }
}
```

### Available options

- `"detect-hooks-from-non-react-namespace"` - when set to `true`, violations will be also reported
  hooks accessed from sources other than the `React` namespace (e.g. `MyHooks.useHook` will be
  treated as a hook).

  By default, only direct calls (e.g. `useHook`) or calls from `React` namespace (e.g.
  `React.useState`) are treated as hooks.

Have an idea for an option? [Create a new issue](https://github.com/Gelio/tslint-react-hooks/issues/new).

## Workarounds

For some arrow functions/function expressions, the rule has no way to determine whether those are a
component, a hook, both of which could contain hook calls, or a regular function that should not
contain hook calls.

```ts
const withHoc = <TProps extends object>(Component: ComponentType<TProps>) => (
  props: TProps,
) => {
  const [state] = useState();
  return <Component {...props} />;
};
```

The workaround in those cases is to use a **named function expression**:

```ts
const withHoc = <TProps extends object>(Component: ComponentType<TProps>) =>
  function WrappedComponent(props: TProps) {
    const [state] = useState();
    return <Component {...props} />;
  };
```

Naming the function like a component (in _PascalCase_) unambiguously lets the rule treat the
function as a component.

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

## Development

After pulling the repository, make sure to run

```sh
npm install
```

The source code for the rule is located in the `src` directory.

For more information about the developing custom TSLint rules, take a look at
[TSLint's documentation](https://palantir.github.io/tslint/develop/custom-rules/).

### Testing the rule

Run

```sh
npm run test
```

to compile the rule and run automatic TSLint tests.

They are located in the `test` directory.

## Author

The author of this rule is Grzegorz Rozdzialik.
