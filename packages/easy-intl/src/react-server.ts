/**
 * Server-side entry point for easy-intl
 * Only exports types for Server Components
 * Server Components should NOT import hooks/providers
 */

// Export types only - no hooks or components
export type { TranslationKeys, Formatter, FormatterRegistry, EasyIntlConfig, TranslationFunction } from './types';
