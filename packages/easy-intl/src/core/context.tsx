import { createContext, useContext, type ReactNode } from "react";
import type { EasyIntlConfig, FormatterRegistry } from "../types";
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
  formatters?: FormatterRegistry;
  children: ReactNode;
}

export function EasyIntlProvider({
  locale,
  formatters,
  children,
}: EasyIntlProviderProps) {
  const value: EasyIntlConfig = {
    locale,
    formatters: { ...defaultFormatters, ...formatters },
  };

  return (
    <EasyIntlContext.Provider value={value}>
      {children}
    </EasyIntlContext.Provider>
  );
}
