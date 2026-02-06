t('price', { amount: 49.99 });
t('published', { date: new Date() });
t('count', { value: 1234.56 });
t('items', { count: 1 }); // → "item"
t('items', { count: 5 }); // → "items"

# @odiflo/easy-intl

Component-level internationalization with a Functional Pipeline engine. Built for performance-critical applications where data structures are decoupled from the translation layer.

## Features

- ✅ **Nested Property Access** — Access deep data directly: `{user.profile.name}`
- ✅ **Method Training (..)** — Transform data via functional pipelines: `{val..upper()}`
- ✅ **Namespaced Formatters** — Organize logic into domains: `{val..Math.round()}`
- ✅ **Method Chaining** — String multiple transformations: `{v..round()..currency(USD)}`
- ✅ **Isomorphic** — Works in Next.js Server Components and the browser.
- ✅ **Lightweight** — Minimal bundle size with O(1) memory performance.

## Installation

```bash
npm install @odiflo/easy-intl
```

## Quick Start

### 1. Setup Provider

```tsx
import { EasyIntlProvider } from "@odiflo/easy-intl";

const formatters = {
  upper: (val) => val.toUpperCase(),
  Math: {
    round: (val) => Math.round(val),
  },
  currency: (val, locale, code = "USD") =>
    new Intl.NumberFormat(locale, { style: "currency", currency: code }).format(
      val,
    ),
};

const translations = {
  welcome: "Welcome, {user.name..upper()}!",
  balance: "Balance: {user.account.balance..Math.round()..currency(CAD)}",
};

export default function RootLayout({ children }) {
  return (
    <EasyIntlProvider
      locale="en"
      translations={translations}
      formatters={formatters}
    >
      {children}
    </EasyIntlProvider>
  );
}
```

### 2. Use in Component

```tsx
import { useT } from "@odiflo/easy-intl";

export function ProfileCard({ user }) {
  const t = useT();
  return (
    <div>
      <h3>{t("welcome", { user })}</h3>
      <p>{t("balance", { user })}</p>
    </div>
  );
}
```

## Syntax Grammar

| Symbol | Usage      | Description                               | Example                 |
| ------ | ---------- | ----------------------------------------- | ----------------------- |
| .      | Dot        | Navigate deeper into a Data Object        | `{user.name}`           |
| ..     | Double Dot | Enter the Method Training (Logic) domain  | `{val..upper()}`        |
| ..     | Pipe       | Chain a new method to the previous result | `{v..round()..upper()}` |

## Why it's Revolutionary

Unlike next-intl or i18next which use the rigid ICU MessageFormat, easy-intl treats translation strings as Functional Pipelines.

Instead of destructuring your objects in React to satisfy a "dumb" translation string, you pass the whole object and let the translation layer decide how to "train" that data for the UI.

## License

MIT © Israel Emmanuel Matenly Forestal
