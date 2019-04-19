# Changelog

## v2.1.0 (2019-04-19)

- Describe a workaround for ambiguous function expressions in the README
- Detect and allow using hooks inside named function expressions

  ```tsx
  const withHoc = <TProps extends object>(Component: ComponentType<TProps>) =>
    function WrappedComponent(props: TProps) {
      // Naming the function expression allows using hooks
      const [state] = useState();
      return <Component {...props} />;
    };
  ```

## v2.0.0 (2019-03-12)

- Report violations whenever a React hook is used after an early return.

  For example, the following code sample now violates the rule:

  ```tsx
  function MyComponent({ counter }) {
    if (counter > 5) {
      return <div>Counter is over 5</div>;
    }

    useEffect(() => {
      console.log('Counter is', counter);
    });

    return <div>{counter}</div>;
  }
  ```

## v1.1.0 (2019-02-09)

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
