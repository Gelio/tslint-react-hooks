export const detectHooksFromNonReactNamespaceOptionName =
  'detect-hooks-from-non-react-namespace';
export const ignoredFunctionsOptionName = 'ignored-functions';

export interface RuleOptions {
  /**
   * When set to `true`, violations will be reported for hooks from  namespaces other than `React
   * (e.g. `MyHooks.useHook` will be treated as a hook).
   */
  [detectHooksFromNonReactNamespaceOptionName]?: boolean;
  /**
   * Every function name listed here will never be treated as a hook.
   */
  [ignoredFunctionsOptionName]: ReadonlySet<string>;
}

const defaultRuleOptions: RuleOptions = {
  [ignoredFunctionsOptionName]: new Set(),
};

export function parseRuleOptions(rawOptionsArray: unknown): RuleOptions {
  if (!Array.isArray(rawOptionsArray)) {
    return defaultRuleOptions;
  }

  const rawOptions: Record<string, unknown> | undefined = rawOptionsArray[0];
  if (!rawOptions) {
    return defaultRuleOptions;
  }

  const parsedOptions: RuleOptions = { ...defaultRuleOptions };

  const detectHooksFromNonReactNamespaceOption =
    rawOptions[detectHooksFromNonReactNamespaceOptionName];
  if (typeof detectHooksFromNonReactNamespaceOption === 'boolean') {
    parsedOptions[
      detectHooksFromNonReactNamespaceOptionName
    ] = detectHooksFromNonReactNamespaceOption;
  }

  const ignoredFunctionsOption =
    rawOptions[ignoredFunctionsOptionName];
  if (Array.isArray(ignoredFunctionsOption) && ignoredFunctionsOption.length > 0) {
    parsedOptions[
      ignoredFunctionsOptionName
    ] = new Set(ignoredFunctionsOption);
  }

  return parsedOptions;
}
