# Contributing guidelines

Anyone is welcome to contribute to this project. Filing issues with detected bugs or false positives
is appreciated, as is opening pull requests with fixes to those.

Before opening a pull request, make sure that all the tests pass by running

```sh
npm run test
```

It would be great if you added new test cases that cover the functionality you added/fixed in the
pull request.

## Information for developers

Creating TSLint rules may seem complex in the beginning, but it is actually pretty easy once you
understand the underlying concepts.

Each Typescript file is parsed into an Abstract Syntax Tree (AST). It is a tree structure that
contains nodes like statements, expressions, identifier that appear in the file being linted. The
rule can then analyze the AST and report rule violations.

Check the [TSLint documentation for developing TSLint rules](https://palantir.github.io/tslint/develop/custom-rules/)
for more information on the subject.

[AST Explorer](https://astexplorer.net/) is an extremely useful tool when working with and exploring ASTs. It
supports different parsers, so when developing TSLint rules make sure to pick the _typescript_
parser from the settings bar at the top.
