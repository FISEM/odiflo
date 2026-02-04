# SSR Architecture - @odiflo/easy-intl

## Overview

This package uses **dual entry points** for Next.js App Router compatibility:
- **react-server.ts** - For Server Components (types only)
- **react-client.ts** - For Client Components (hooks + providers)

## Architecture Pattern

```
Server Component (layout.tsx)
    ↓ Loads translations (JSON/inline)
    ↓ Passes data as props
Client Component Wrapper (IntlProvider)
    ↓ 'use client' directive
    ↓ Wraps children with EasyIntlProvider
Child Components
    ↓ Use useT() hook
```

## Package Exports (package.json)

```json
{
  "exports": {
    ".": {
      "react-server": {
        "require": "./dist/react-server.js",
        "import": "./dist/react-server.mjs",
        "types": "./dist/react-server.d.ts"
      },
      "default": {
        "require": "./dist/react-client.js",
        "import": "./dist/react-client.mjs",
        "types": "./dist/react-client.d.ts"
      }
    }
  }
}
```

## Build Output

- **react-server.mjs**: 0 B (types only, no runtime code)
- **react-client.mjs**: 3.94 KB (full functionality)

## Usage

### 1. Create Client Component Wrapper

```tsx
// components/IntlProvider.tsx
'use client';

import { EasyIntlProvider } from '@odiflo/easy-intl';

export default function IntlProvider({
  locale,
  translations,
  children,
}: {
  locale: string;
  translations: Record<string, string>;
  children: React.ReactNode;
}) {
  return (
    <EasyIntlProvider locale={locale} translations={translations}>
      {children}
    </EasyIntlProvider>
  );
}
```

### 2. Use in Server Component

```tsx
// app/layout.tsx
import IntlProvider from '@/components/IntlProvider';

const translationsEN = {
  welcome: "Welcome to {name}!",
  // ...
};

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <IntlProvider locale="en" translations={translationsEN}>
          {children}
        </IntlProvider>
      </body>
    </html>
  );
}
```

### 3. Use in Client Components

```tsx
// components/MyComponent.tsx
'use client';

import { useT } from '@odiflo/easy-intl';

export function MyComponent() {
  const t = useT();
  
  return <h1>{t('welcome', { name: 'Easy Intl' })}</h1>;
}
```

## Why This Pattern?

Next.js App Router has two types of components:

1. **Server Components** (default)
   - Run on server only
   - Cannot use React hooks (useState, useContext, etc.)
   - Can load data directly

2. **Client Components** ('use client')
   - Run on both server and client
   - Can use all React hooks
   - Receive data via props

The dual entry points ensure:
- ✅ Server Components can import types only
- ✅ Client Components get full functionality
- ✅ No "createContext only works in Client Component" errors
- ✅ Tree-shaking works correctly

## Conditional Exports Resolution

When Next.js imports `@odiflo/easy-intl`:

```typescript
// In Server Component (layout.tsx)
import IntlProvider from '@odiflo/easy-intl';
// → Resolves to dist/react-server.mjs (types only, 0 B)

// In Client Component (MyComponent.tsx)
import { useT } from '@odiflo/easy-intl';
// → Resolves to dist/react-client.mjs (full code, 3.94 KB)
```

## Next Steps

- [ ] Implement `.easy.*.json` file convention
- [ ] Add middleware for locale detection
- [ ] Create `[locale]` route structure
- [ ] Support client-side language switching
- [ ] Add VPS deployment guide

## References

- [Next.js Conditional Exports](https://nextjs.org/docs/app/building-your-application/rendering/composition-patterns)
- [next-intl SSR Pattern](https://next-intl.dev/docs/getting-started/app-router)
