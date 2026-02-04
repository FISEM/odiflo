import type { Metadata } from "next";
import { EasyIntlProvider } from "@odiflo/easy-intl";
import "./globals.css";

// Translations EN
const translationsEN = {
  welcome: "Welcome to {name}!",
  tagline: "Simple i18n with custom formatters",
  price: "Price: {amount:currency(USD)}",
  published: "Published {date:date(long)}",
  users: "{count:plural(user,users)} online",
  description: "This demo showcases @odiflo/easy-intl running in SSR mode on Next.js",
};

// Translations FR
const translationsFR = {
  welcome: "Bienvenue sur {name}!",
  tagline: "i18n simple avec formatters personnalisés",
  price: "Prix : {amount:currency(EUR)}",
  published: "Publié le {date:date(long)}",
  users: "{count:plural(utilisateur,utilisateurs)} en ligne",
  description: "Cette démo montre @odiflo/easy-intl en mode SSR sur Next.js",
};

export const metadata: Metadata = {
  title: "@odiflo/easy-intl - SSR Demo",
  description: "Demo app showcasing easy-intl with Server-Side Rendering",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Detect locale (in real app, use headers/cookies)
  const locale = "en";
  const translations = locale === "fr" ? translationsFR : translationsEN;

  return (
    <html lang={locale}>
      <body className="antialiased">
        <EasyIntlProvider locale={locale} translations={translations}>
          {children}
        </EasyIntlProvider>
      </body>
    </html>
  );
}
