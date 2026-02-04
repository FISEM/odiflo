import { useEasyIntl } from "./context";
import { parseTranslation } from "./parser";
import type { TranslationKeys, TranslationFunction } from "../types";

/**
 * Load translations for a component
 * @param componentName Name of the component (e.g., 'PostCard')
 * @param locale Current locale
 * @returns Translation keys object
 */
async function loadTranslations(
  componentName: string,
  locale: string,
): Promise<TranslationKeys> {
  try {
    // Dynamic import of co-located translation file
    // e.g., ./PostCard.en.t.json
    const translations = await import(`${componentName}.${locale}.t.json`);
    return translations.default || translations;
  } catch (error) {
    console.warn(
      `[easy-intl] Failed to load translations for ${componentName}.${locale}.t.json`,
    );
    return {};
  }
}

/**
 * Hook to use translations
 * @example
 * const t = useT();
 * t('welcome', { name: 'John' }) → "Welcome John!"
 */
export function useT(): TranslationFunction {
  const { locale, formatters } = useEasyIntl();

  // Simple function call
  const translationFunction = ((key: string, params?: Record<string, any>) => {
    // TODO: Implement when build-time plugin is ready
    // For now, return placeholder
    return `[Translation: ${key}]`;
  }) as TranslationFunction;

  // Attach locale and formatters as properties
  translationFunction.locale = locale;
  translationFunction.formatters = formatters;

  return translationFunction;
}
