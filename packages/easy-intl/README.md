# @odiflo/easy-intl

Component-level internationalization with simple API and custom formatters.

## Features

- ✅ **Simple API** - Clean syntax `t('key', params)` 
- ✅ **Custom formatters** - Extensible formatter system with `{var:formatter(params)}`
- ✅ **Type-safe** - Full TypeScript support
- ✅ **Lightweight** - Minimal bundle size
- ✅ **React 16.8+** - Works with all modern React versions

## Installation

```bash
npm install @odiflo/easy-intl
# or
pnpm add @odiflo/easy-intl
```

**Requirements:**
- React >= 16.8.0 (hooks support)
- Works with React 16.8+, 17.x, 18.x, and 19.x

## Quick Start

### 1. Setup Provider

```tsx
// app/layout.tsx
import { EasyIntlProvider } from "@odiflo/easy-intl";

const translations = {
  welcome: "Welcome {name}!",
  price: "Price: {amount:currency(USD)}",
  readMore: "Read more",
};

export default function RootLayout({ children }) {
  return (
    <EasyIntlProvider locale="en" translations={translations}>
      {children}
    </EasyIntlProvider>
  );
}
```

### 2. Use in Component

```tsx
// PostCard.tsx
import { useT } from "@odiflo/easy-intl";

export function PostCard({ username, price }) {
  const t = useT();

  return (
    <div>
      <h3>{t('welcome', { name: username })}</h3>
      <p>{t('price', { amount: price })}</p>
      <a>{t('readMore')}</a>
    </div>
  );
}
```

**Output:**
```
Welcome John!
Price: $49.00
Read more
```

## Built-in Formatters

### Currency

```typescript
const translations = {
  price: "{amount:currency(USD)}"  // → "$49.99"
};

t('price', { amount: 49.99 });
```

Supported currencies: USD, EUR, GBP, JPY, etc. (all ISO 4217 codes)

### Date

```typescript
const translations = {
  published: "{date:date(long)}"  // → "January 15, 2024"
};

t('published', { date: new Date() });
```

Formats: `short`, `medium`, `long`

### Number

```typescript
const translations = {
  count: "{value:number(2)}"  // → "1,234.56"
};

t('count', { value: 1234.56 });
```

Parameter: number of decimal places (default: 2)

### Plural

```typescript
const translations = {
  items: "{count:plural(item,items)}"
};

t('items', { count: 1 });  // → "item"
t('items', { count: 5 });  // → "items"
```

## Custom Formatters

Extend with your own formatters:

```typescript
const customFormatters = {
  uppercase: (value: string) => value.toUpperCase(),
  username: (value: string) => `@${value}`,
};

<EasyIntlProvider
  locale="en"
  translations={translations}
  formatters={customFormatters}
>
  {children}
</EasyIntlProvider>
```

Usage:
```typescript
const translations = {
  user: "Hello {name:uppercase()}!",  // → "Hello JOHN!"
  mention: "{handle:username()}"       // → "@johndoe"
};
```

## Multi-locale Support

Load different translations per locale:

```typescript
const translations = {
  en: {
    welcome: "Welcome {name}!",
    price: "Price: {amount:currency(USD)}",
  },
  fr: {
    welcome: "Bienvenue {name}!",
    price: "Prix : {amount:currency(EUR)}",
  },
};

const locale = getUserLocale(); // 'en' | 'fr'

<EasyIntlProvider locale={locale} translations={translations[locale]}>
  {children}
</EasyIntlProvider>
```

## API Reference

### `<EasyIntlProvider>`

**Props:**
- `locale: string` - Current locale (e.g., 'en', 'fr')
- `translations: Record<string, string>` - Translation keys and templates
- `formatters?: FormatterRegistry` - Custom formatters (optional)

### `useT()`

Returns a translation function with locale and formatters attached.

**Returns:** `TranslationFunction`
- `t(key: string, params?: Record<string, any>): string`
- `t.locale: string` - Current locale
- `t.formatters: FormatterRegistry` - Available formatters

## Formatter Syntax

Format: `{variable:formatter(param1,param2)}`

**Examples:**
```typescript
"{price:currency(EUR)}"           // Currency with specific code
"{date:date(long)}"               // Date with format
"{count:number(4)}"               // Number with decimals
"{items:plural(item,items)}"      // Plural with forms
"{name:uppercase()}"              // Custom formatter
```

## TypeScript

Full type safety:

```typescript
import type { TranslationFunction, FormatterRegistry } from "@odiflo/easy-intl";

const t: TranslationFunction = useT();
const formatters: FormatterRegistry = { /* ... */ };
```

## License

MIT © Israel Emmanuel Matenly Forestal
