export const detectHooksFromNonReactNamespaceOptionName =
  'detect-hooks-from-non-react-namespace';

export interface RuleOptions {
  /**
   * When set to `true`, violations will be reported for hooks from  namespaces other than `React
   * (e.g. `MyHooks.useHook` will be treated as a hook).
   */
  [detectHooksFromNonReactNamespaceOptionName]?: boolean;
}

const defaultRuleOptions: RuleOptions = {};

export function parseRuleOptions(rawOptionsArray: unknown): RuleOptions {
  if (!Array.isArray(rawOptionsArray)) {
    return defaultRuleOptions;
  }

  const rawOptions: Record<string, unknown> | undefined = rawOptionsArray[0];
  if (!rawOptions) {
    return defaultRuleOptions;
  }

  let parsedOptions: RuleOptions = { ...defaultRuleOptions };

  const detectHooksFromNonReactNamespaceOption =
    rawOptions[detectHooksFromNonReactNamespaceOptionName];
  if (typeof detectHooksFromNonReactNamespaceOption === 'boolean') {
    parsedOptions[
      detectHooksFromNonReactNamespaceOptionName
    ] = detectHooksFromNonReactNamespaceOption;
  }

  return parsedOptions;
}
