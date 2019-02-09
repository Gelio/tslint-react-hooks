# Changelog

## Latest

- Allow using hooks inside React component decorators, such as `React.memo` or `React.forwardRef`.

  For example, the following code sample now **does not** violate the rule:

  ```tsx
  const MyComponent = React.memo(props => {
    useEffect(() => {
      console.log('Counter changed');
    }, [props.value]);

    return <div>Counter: {props.value}</div>;
  });
  ```

## v1.0.1 (2019-02-03)

- Updated README

  The source code of the rule did not change. The rule has been released again so that the README on
  npmjs.com matches the one on GitHub.

## v1.0.0 (2019-02-03)

- The initial implementation of the rule
