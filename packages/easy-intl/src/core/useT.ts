"use client";

import { useEasyIntl } from "./context";
import type { TranslationFunction } from "../types";

/**
 * Parse translation string with variable substitution and formatters
 */
function parseTranslation(
  template: string,
  params?: Record<string, any>,
  locale?: string,
  formatters?: any,
): string {
  if (!params) return template;

  return template.replace(/\{([^}]+)\}/g, (match, key) => {
    const parts = key.split(":");
    const varName = parts[0].trim();
    const formatterPart = parts[1]?.trim();

    const value = params[varName];
    if (value === undefined) return match;

    if (!formatterPart) return String(value);

    const formatterMatch = formatterPart.match(/^(\w+)\(([^)]*)\)$/);
    if (!formatterMatch) return String(value);

    const [, formatterName, args] = formatterMatch;
    const formatter = formatters?.[formatterName];

    if (!formatter) {
      console.warn(`Unknown formatter: ${formatterName}`);
      return String(value);
    }

    const formatterArgs = args
      ? args.split(",").map((a: string) => a.trim())
      : [];
    return formatter(value, locale, ...formatterArgs);
  });
}

export function useT(): TranslationFunction {
  const { locale, translations, formatters } = useEasyIntl();

  const t: TranslationFunction = (key, params) => {
    const template = translations[key];
    if (!template) {
      console.warn(`[easy-intl] Missing translation: ${key}`);
      return key;
    }

    return parseTranslation(template, params, locale, formatters);
  };

  t.locale = locale;
  t.formatters = formatters;

  return t;
}
