import React, { createContext, useContext, useMemo } from "react";
import { defaultFormatters } from "../formatters";
import type { FormatterRegistry } from "../types";

interface EasyIntlContextProps {
  locale: string;
  formatters: FormatterRegistry;
}

const EasyIntlContext = createContext<EasyIntlContextProps | undefined>(
  undefined,
);

export const EasyIntlProvider: React.FC<{
  locale: string;
  formatters?: FormatterRegistry;
  children: React.ReactNode;
}> = ({ locale, formatters, children }) => {
  // Memoize config to satisfy React optimization rules
  const contextValue = useMemo(
    () => ({
      locale,
      formatters: { ...defaultFormatters, ...formatters },
    }),
    [locale, formatters],
  );

  return (
    <EasyIntlContext.Provider value={contextValue}>
      {children}
    </EasyIntlContext.Provider>
  );
};

export const useEasyIntl = () => {
  const context = useContext(EasyIntlContext);
  if (!context) {
    throw new Error("useEasyIntl must be used within EasyIntlProvider");
  }
  return context;
};
