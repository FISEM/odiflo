export type Formatter<T = any> = (
  value: T,
  locale: string,
  ...params: string[]
) => string;

export type FormatterRegistry = Record<string, Formatter>;

export type TranslationKeys = Record<string, string>;

export interface EasyIntlConfig {
  locale: string;
  formatters: FormatterRegistry;
}

export interface TranslationFunction {
  (key: string, params?: Record<string, any>): string;
  locale: string;
  formatters: FormatterRegistry;
}
