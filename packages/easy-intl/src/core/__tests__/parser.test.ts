import { parseTranslation } from "../parser";

describe("parseTranslation - Engine Verification", () => {
  const mockFormatters = {
    upper: (val: string) => val.toUpperCase(),
    lower: (val: string) => val.toLowerCase(),
    Math: {
      round: (val: number) => Math.round(val),
    },
    currency: (val: number, locale: string, curr = "USD") =>
      new Intl.NumberFormat(locale, {
        style: "currency",
        currency: curr,
      }).format(val),
  };

  it("should interpolate simple variables", () => {
    const result = parseTranslation(
      "Hello {name}",
      { name: "John" },
      "en",
      mockFormatters,
    );
    expect(result).toBe("Hello John");
  });

  it("should resolve nested property paths (e.g., user.name)", () => {
    const result = parseTranslation(
      "User: {user.profile.name}",
      { user: { profile: { name: "Israel" } } },
      "en",
      mockFormatters,
    );
    expect(result).toBe("User: Israel");
  });

  it("should apply training methods using the '..' syntax", () => {
    const result = parseTranslation(
      "Hello {name..upper()}",
      { name: "john" },
      "en",
      mockFormatters,
    );
    expect(result).toBe("Hello JOHN");
  });

  it("should support method chaining (Training Pipeline)", () => {
    const result = parseTranslation(
      "Ref: {name..lower()..upper()}",
      { name: "IsRaEl" },
      "en",
      mockFormatters,
    );
    expect(result).toBe("Ref: ISRAEL");
  });

  it("should support namespaced formatters (e.g., Math.round)", () => {
    const result = parseTranslation(
      "Score: {val..Math.round()}",
      { val: 95.6 },
      "en",
      mockFormatters,
    );
    expect(result).toBe("Score: 96");
  });

  it("should handle multiple occurrences of the same variable with different training", () => {
    const result = parseTranslation(
      "{n} in uppercase is {n..upper()}",
      { n: "quebec" },
      "en",
      mockFormatters,
    );
    expect(result).toBe("quebec in uppercase is QUEBEC");
  });

  it("should correctly pass arguments and locale to formatters", () => {
    const result = parseTranslation(
      "Price: {amount..currency(EUR)}",
      { amount: 49.99 },
      "fr",
      mockFormatters,
    );
    // Matches "49,99 €" (French format)
    expect(result).toMatch(/49,99\s?€/);
  });

  it("should fallback to original placeholder if variable is missing", () => {
    const result = parseTranslation(
      "Hello {missing_key}",
      {},
      "en",
      mockFormatters,
    );
    expect(result).toBe("Hello {missing_key}");
  });

  it("should warn on unknown training modules but return the last valid state", () => {
    const consoleSpy = jest.spyOn(console, "warn").mockImplementation();
    const result = parseTranslation(
      "{name..invalid()}",
      { name: "John" },
      "en",
      mockFormatters,
    );
    expect(consoleSpy).toHaveBeenCalledWith(
      expect.stringContaining("Training module not found"),
    );
    expect(result).toBe("John");
    consoleSpy.mockRestore();
  });

  it("should handle escaped braces as literal text", () => {
    // Uses the negative lookbehind in regex to skip \{
    const result = parseTranslation(
      "Show \\{bracket\\} and {name}",
      { name: "Israel" },
      "en",
      mockFormatters,
    );
    expect(result).toBe("Show \\{bracket\\} and Israel");
  });
});
