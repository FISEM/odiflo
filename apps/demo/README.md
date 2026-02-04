# @odiflo/easy-intl - SSR Demo

Live demonstration of @odiflo/easy-intl running in Server-Side Rendering mode with Next.js.

## 🚀 Features

- ✅ **Server-Side Rendering** - Full SSR support with Next.js
- ✅ **Built-in Formatters** - Currency, Date, Number, Plural
- ✅ **Multi-locale** - EN/FR translations included
- ✅ **Type-Safe** - Full TypeScript support
- ✅ **Production Ready** - Optimized for deployment

## 📦 Installation

```bash
pnpm install
```

## 🏃 Development

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000)

## 🏗️ Build

```bash
pnpm build
```

## 🚀 Production

```bash
pnpm start
```

## 📝 Code Examples

### Layout with Provider

```tsx
import { EasyIntlProvider } from "@odiflo/easy-intl";

const translations = {
  welcome: "Welcome {name}!",
  price: "Price: {amount:currency(USD)}",
};

export default function Layout({ children }) {
  return (
    <EasyIntlProvider locale="en" translations={translations}>
      {children}
    </EasyIntlProvider>
  );
}
```

### Component Usage

```tsx
"use client";

import { useT } from "@odiflo/easy-intl";

export default function Page() {
  const t = useT();

  return (
    <div>
      <h1>{t("welcome", { name: "John" })}</h1>
      <p>{t("price", { amount: 49.99 })}</p>
    </div>
  );
}
```

## 🌍 VPS Deployment

### Requirements

- Node.js 18+ or 20+
- PM2 for process management (optional but recommended)

### Deploy Steps

1. **Build the app:**
   ```bash
   pnpm build
   ```

2. **Transfer to VPS:**
   ```bash
   rsync -avz --exclude node_modules . user@your-vps:/var/www/easy-intl-demo
   ```

3. **Install on VPS:**
   ```bash
   ssh user@your-vps
   cd /var/www/easy-intl-demo
   pnpm install --prod
   ```

4. **Run with PM2:**
   ```bash
   pm2 start pnpm --name "easy-intl-demo" -- start
   pm2 save
   ```

5. **Setup Nginx (optional):**
   ```nginx
   server {
       listen 80;
       server_name demo.example.com;

       location / {
           proxy_pass http://localhost:3000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```

## 📖 Documentation

See [packages/easy-intl/README.md](../../packages/easy-intl/README.md) for full package documentation.

## 📄 License

MIT
