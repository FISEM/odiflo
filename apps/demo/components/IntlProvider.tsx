'use client';

import { EasyIntlProvider } from '@odiflo/easy-intl';
import type { ReactNode } from 'react';

export default function IntlProvider({
  locale,
  translations,
  children,
}: {
  locale: string;
  translations: Record<string, string>;
  children: ReactNode;
}) {
  return (
    <EasyIntlProvider locale={locale} translations={translations}>
      {children}
    </EasyIntlProvider>
  );
}
