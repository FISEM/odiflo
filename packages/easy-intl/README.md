# @odiflo/easy-intl

Component-level internationalization with template literals and custom formatters.

## Features

- ✅ **Simple API** - Clean syntax `t('key', params)`
- ✅ **Co-location** - Translations live next to components
- ✅ **Custom formatters** - Extensible formatter system with `{var:formatter(params)}`
- ✅ **Type-safe** - Full TypeScript support
- ✅ **Lightweight** - Minimal API, maximum power

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

export default function RootLayout({ children }) {
  return (
    <EasyIntlProvider value={{ locale: "en" }}>{children}</EasyIntlProvider>
  );
}
```

### 2. Create Translation Files

```
components/
  PostCard.tsx
  PostCard.en.t.json  ← English translations
  PostCard.fr.t.json  ← French translations
```

```json
// PostCard.en.t.json
{
  "title": "Posted {time:date(long)} ago",
  "readMore": "Read more",
  "price": "Price: {amount:currency(USD)}"
}
```

```json
// PostCard.fr.t.json
{
  "title": "Publié il y a {time:date(long)}",
  "readMore": "Lire la suite",
  "price": "Prix : {amount:currency(EUR)}"
}
```

### 3. Use in Component

```tsx
// PostCard.tsx
import { useT } from "@odiflo/easy-intl";

export function PostCard({ timestamp, price }) {
  const t = useT();

  return (
    <div>
      <h3>{t("title", { time: timestamp })}</h3>
      <p>{t("price", { amount: price })}</p>
      <a>{t("readMore")}</a>
    </div>
  );
}
```

## Built-in Formatters

### Currency

```json
{
  "price": "{amount:currency(USD)}"
}
```

### Date

```json
{
  "published": "{date:date(long)}"
}
```

### Number

```json
{
  "count": "{value:number()}"
}
```

### Plural

```json
{
  "items": "{count:plural()}"
}
```

## Custom Formatters

Create custom formatters per locale:

```typescript
// formatters/username.en.ts
export const username = (value: string) => `@${value}`;

// formatters/username.fr.ts
export const username = (value: string) => `@${value}`;
```

Register them:

```tsx
import { EasyIntlProvider } from "@odiflo/easy-intl";
import { username } from "./formatters/username.en";

<EasyIntlProvider
  value={{
    locale: "en",
    formatters: { username },
  }}
>
  {children}
</EasyIntlProvider>;
```

Use in translations:

```json
{
  "welcome": "Welcome {name:username()}!"
}
```

## Formatter Syntax

```
{variable:formatter(param1,param2)}
```

Examples:

- `{price:currency(USD)}` - Format as USD currency
- `{date:date(long)}` - Long date format
- `{count:plural()}` - Pluralize based on count
- `{name:username()}` - Custom formatter

## Philosophy

**Co-location over centralization**

Instead of massive translation files, keep translations next to components:

```
❌ locales/en.json (1000+ keys)
✅ PostCard.en.t.json (5-10 keys)
```

**Benefits:**

- ✅ Delete component = translations deleted automatically
- ✅ No orphaned keys
- ✅ Better team collaboration (no merge conflicts)
- ✅ Easier to maintain
- ✅ Scalable

## License

MIT
