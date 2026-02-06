# @odiflo/easy-intl

Component-level internationalization with a Functional Pipeline engine. Built for performance-critical applications where data structures are decoupled from the translation layer.

## Features

- ✅ **Shadow Injection** — Automatic component ID injection via Babel: `useT()`
- ✅ **Nested Property Access** — Access deep data directly: `{user.profile.name}`
- ✅ **Method Training (..)** — Transform data via functional pipelines: `{val..upper()}`
- ✅ **Namespaced Formatters** — Organize logic into domains: `{val..Math.round()}`
- ✅ **Method Chaining** — String multiple transformations: `{v..round()..currency(USD)}`
- ✅ **Isomorphic** — Works in Next.js Server Components and the browser
- ✅ **Lightweight** — Minimal bundle size with O(1) memory performance

## Installation

```bash
npm install @odiflo/easy-intl
```

## Quick Start

### 1. Setup Provider (Global Config)

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

export default function RootLayout({ children }) {
  return (
    <EasyIntlProvider locale="en" translations={{}} formatters={formatters}>
      {children}
    </EasyIntlProvider>
  );
}
```

### 2. Use in Component

The component ID is automatically injected by the Babel plugin. No manual key mapping required.

```tsx
import { useT } from "@odiflo/easy-intl";
export function ProfileCard({ user }) {
  const t = useT();
  // Data: { user: { name: "israel", account: { balance: 49.995 } } }
  return (
    <>
      {t("welcome", { user })}
      {t("balance", { user })}
    </>
  );
}
```

### 3. Component Translation (`ProfileCard.en.t.json`)

```json
{
  "welcome": "Welcome, {user.name..upper()}!",
  "balance": "Balance: {user.account.balance..Math.round()..currency(CAD)}"
}
```

## Syntax Grammar

| Symbol | Name       | Purpose                                   | Example                 |
| ------ | ---------- | ----------------------------------------- | ----------------------- |
| .      | Dot        | Navigate deeper into a Data Object        | `{user.name}`           |
| ..     | Double Dot | Enter the Method Training (Logic) domain  | `{val..upper()}`        |
| ..     | Pipe       | Chain a new method to the previous result | `{v..round()..upper()}` |

## License

MIT © Israel Emmanuel Matenly Forestal
