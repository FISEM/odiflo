import { createContext, useContext, type ReactNode } from "react";
import type {
  EasyIntlConfig,
  FormatterRegistry,
  TranslationKeys,
} from "../types";
import { defaultFormatters } from "../formatters";

const EasyIntlContext = createContext<EasyIntlConfig | null>(null);

export function useEasyIntl() {
  const context = useContext(EasyIntlContext);
  if (!context) {
    throw new Error("useEasyIntl must be used within EasyIntlProvider");
  }
  return context;
}

interface EasyIntlProviderProps {
  locale: string;
  translations: TranslationKeys;
  formatters?: FormatterRegistry;
  children: ReactNode;
}

export function EasyIntlProvider({
  locale,
  translations,
  formatters,
  children,
}: EasyIntlProviderProps) {
  const value: EasyIntlConfig = {
    locale,
    translations,
    formatters: { ...defaultFormatters, ...formatters },
  };

  return (
    <EasyIntlContext.Provider value={value}>
      {children}
    </EasyIntlContext.Provider>
  );
}
