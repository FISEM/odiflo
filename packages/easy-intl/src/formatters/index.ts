import type { Formatter } from "../types";

/**
 * Format number as currency
 * @example {price:currency(USD)} → "$49.00"
 */
export const currency: Formatter<number> = (
  value,
  locale,
  currencyCode = "USD",
) => {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency: currencyCode,
  }).format(value);
};

// Export as currencyFormatter for external use
export const currencyFormatter = currency;

/**
 * Format date
 * @example {date:date(long)} → "January 1, 2024"
 */
export const date: Formatter<Date | string | number> = (
  value,
  locale,
  style = "short",
) => {
  const dateValue =
    typeof value === "string" || typeof value === "number"
      ? new Date(value)
      : value;

  const options: Intl.DateTimeFormatOptions =
    style === "long"
      ? { dateStyle: "long" }
      : style === "short"
        ? { dateStyle: "short" }
        : { dateStyle: "medium" };

  return new Intl.DateTimeFormat(locale, options).format(dateValue);
};

// Export as dateFormatter for external use
export const dateFormatter = date;

/**
 * Format number
 * @example {count:number()} → "1,234"
 */
export const number: Formatter<number> = (value, locale, decimals = "2") => {
  const decimalPlaces = parseInt(decimals, 10);
  return new Intl.NumberFormat(locale, {
    minimumFractionDigits: decimalPlaces,
    maximumFractionDigits: decimalPlaces,
  }).format(value);
};

// Export as numberFormatter for external use
export const numberFormatter = number;

/**
 * Basic plural formatter
 * @example {count:plural(item,items)} → "5 items"
 */
export const plural: Formatter<number> = (
  value,
  locale,
  singular = "",
  pluralForm = "",
) => {
  const form = pluralForm || singular;
  if (value === 1) return singular;
  return form;
};

// Export as pluralFormatter for external use
export const pluralFormatter = plural;

/**
 * Default formatters registry
 */
export const defaultFormatters = {
  currency,
  date,
  number,
  plural,
};
