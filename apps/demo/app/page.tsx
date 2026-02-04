"use client";

import { useT } from "@odiflo/easy-intl";

export default function Home() {
  const t = useT();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-16">
        {/* Header */}
        <header className="text-center mb-16">
          <h1 className="text-5xl font-bold text-gray-900 dark:text-white mb-4">
            {t("welcome", { name: "@odiflo/easy-intl" })}
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300">
            {t("tagline")}
          </p>
        </header>

        {/* Demo Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {/* Currency Formatter */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              💰 Currency Formatter
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              {t("price", { amount: 49.99 })}
            </p>
            <code className="text-sm bg-gray-100 dark:bg-gray-700 p-2 rounded block">
              {`t('price', { amount: 49.99 })`}
            </code>
          </div>

          {/* Date Formatter */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              📅 Date Formatter
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              {t("published", { date: new Date() })}
            </p>
            <code className="text-sm bg-gray-100 dark:bg-gray-700 p-2 rounded block">
              {`t('published', { date: new Date() })`}
            </code>
          </div>

          {/* Plural Formatter */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              🔢 Plural Formatter
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              {t("users", { count: 42 })}
            </p>
            <code className="text-sm bg-gray-100 dark:bg-gray-700 p-2 rounded block">
              {`t('users', { count: 42 })`}
            </code>
          </div>
        </div>

        {/* Description */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            About This Demo
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            {t("description")}
          </p>

          {/* Features */}
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                ✅ Features
              </h3>
              <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                <li>• Server-Side Rendering (SSR)</li>
                <li>• Built-in formatters (currency, date, number, plural)</li>
                <li>• Custom formatters support</li>
                <li>• Type-safe with TypeScript</li>
                <li>• React 16.8+ compatible</li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                📦 Installation
              </h3>
              <code className="text-sm bg-gray-100 dark:bg-gray-700 p-2 rounded block">
                pnpm add @odiflo/easy-intl
              </code>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="text-center mt-16 text-gray-600 dark:text-gray-400">
          <p>
            Built with ❤️ by{" "}
            <a
              href="https://github.com/odiflo"
              className="text-blue-600 dark:text-blue-400 hover:underline"
            >
              @odiflo
            </a>
          </p>
        </footer>
      </div>
    </div>
  );
}
