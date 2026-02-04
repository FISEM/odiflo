import type { FormatterRegistry } from "../types";

/**
 * Parse translation string and apply formatters
 * @example "Hello {name:upper()}" → "Hello JOHN"
 */
export function parseTranslation(
  template: string,
  params: Record<string, any>,
  formatters: FormatterRegistry,
  locale: string,
): string {
  // Regex: {variable:formatter(param1,param2)}
  const regex = /\{(\w+)(?::(\w+)(?:\(([^)]*)\))?)?\}/g;

  return template.replace(
    regex,
    (match, varName, formatterName, formatterParams) => {
      const value = params[varName];

      if (value === undefined) {
        console.warn(`[easy-intl] Missing param: ${varName}`);
        return match;
      }

      // No formatter, just interpolate
      if (!formatterName) {
        return String(value);
      }

      // Apply formatter
      const formatter = formatters[formatterName];
      if (!formatter) {
        console.warn(`[easy-intl] Unknown formatter: ${formatterName}`);
        return String(value);
      }

      // Parse formatter params (comma-separated)
      const formatterArgs = formatterParams
        ? formatterParams.split(",").map((p: string) => p.trim())
        : [];

      try {
        return formatter(value, locale, ...formatterArgs);
      } catch (error) {
        console.error(`[easy-intl] Formatter error (${formatterName}):`, error);
        return String(value);
      }
    },
  );
}
