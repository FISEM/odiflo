/**
 * Defines the structure for translation formatters.
 * Supports flat structures or nested namespaces (e.g., { Math: { round: fn } }).
 */
export type FormatterRegistry = {
  [key: string]: Function | FormatterRegistry;
};

/**
 * Parses a translation template string by substituting variables and applying
 * a pipeline of training methods (formatters).
 *
 * @param template - The raw translation string (e.g., "Price: {val..currency(USD)}")
 * @param params - Data object containing the variables
 * @param locale - Current locale string (e.g., "en", "fr")
 * @param formatters - Registry of available formatting functions
 * @returns The fully processed string
 */
export function parseTranslation(
  template: string,
  params: Record<string, any> = {},
  locale: string = "en",
  formatters: FormatterRegistry = {},
): string {
  if (!template) return "";

  /**
   * REGEX EXPLANATION (/g flag enabled for multi-occurrence support):
   *
   * Group 1: (\w+(?:\.\w+)*)
   * Matches the variable key or path (e.g., "count" or "user.name").
   *
   * Group 2: ((\.\.[\w\.\(\),#-]+)+)
   * Matches the "Method Training" chain starting with ".."
   * and allows nested dots for namespaces (e.g., "..Math.round()").
   *
   * Group 3: |\{([^}]+)\}
   * Fallback: Matches simple variables without methods (e.g., "{name}").
   */
  const RE = /\{(\w+(?:\.\w+)*)((\.\.[\w\.\(\),#-]+)+)\}|(?<!\\)\{([^}]+)\}/g;

  return template.replace(
    RE,
    (match, complexVar, chain, _lastChain, simpleVar) => {
      // 1. Resolve target data from params
      const rawPath = complexVar || simpleVar;

      // Resolved 'implicit any' by typing the reducer (obj: any, key: string)
      const value = rawPath
        .split(".")
        .reduce((obj: any, key: string) => obj?.[key], params);

      // If the variable is missing, return the original placeholder to prevent UI breakage
      if (value === undefined) return match;

      // Return raw value if no training chain is provided
      if (!chain) return String(value);

      // 2. Execute the Training Pipeline
      // Splits by ".." to isolate each transformation step
      return chain
        .split("..")
        .filter(Boolean)
        .reduce((accumulator: any, action: string) => {
          // Separate the method path from the arguments: "Math.round(2)" -> ["Math.round", "2)"]
          const [methodPath, argsPart] = action.split("(");

          // Clean arguments by removing the trailing parenthesis and splitting by comma
          const args = argsPart
            ? argsPart
                .replace(")", "")
                .split(",")
                .map((s: string) => s.trim())
            : [];

          // Resolve namespaced methods: "Math.round" -> formatters["Math"]["round"]
          const pathParts = methodPath.split(".");
          let fn: any = formatters;

          for (const part of pathParts) {
            fn = fn?.[part];
          }

          // Execute the formatter if it exists and is a valid function
          if (typeof fn === "function") {
            try {
              return fn(accumulator, locale, ...args);
            } catch (error) {
              console.error(
                `[easy-intl] Error in formatter "${methodPath}":`,
                error,
              );
              return accumulator;
            }
          }

          console.warn(`[easy-intl] Training module not found: ${methodPath}`);
          return accumulator;
        }, value);
    },
  );
}
