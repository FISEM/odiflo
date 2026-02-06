"use client";

import { useSyncExternalStore, useCallback } from "react";
import { useEasyIntl } from "./context";
import { intlStore } from "./store";
import { parseTranslation } from "./parser";
import type { TranslationFunction } from "../types";

export function useT(componentId: string = "unknown"): TranslationFunction {
  const { locale, formatters } = useEasyIntl();

  const state = useSyncExternalStore(
    intlStore.subscribe,
    intlStore.getSnapshotAll,
    () => new Map(),
  );

  const t = useCallback(
    (key: string, params?: Record<string, any>) => {
      const template = state.get(componentId)?.[key];

      if (!template) {
        // Removed process.env check to avoid TS2580
        console.warn(`[easy-intl] Missing key: "${key}" in ${componentId}`);
        return key;
      }

      return parseTranslation(template, params, locale, formatters);
    },
    [state, componentId, locale, formatters],
  ) as TranslationFunction;

  t.locale = locale;
  t.formatters = formatters;

  return t;
}
