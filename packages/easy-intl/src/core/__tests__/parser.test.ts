import { parseTranslation } from "../parser";

describe("parseTranslation", () => {
  const mockFormatters = {
    upper: (val: string) => val.toUpperCase(),
    currency: (val: number, locale: string, curr = "USD") =>
      new Intl.NumberFormat(locale, {
        style: "currency",
        currency: curr,
      }).format(val),
  };

  it("should interpolate simple variables", () => {
    const result = parseTranslation("Hello {name}", { name: "John" }, {}, "en");
    expect(result).toBe("Hello John");
  });

  it("should apply formatter without params", () => {
    const result = parseTranslation(
      "Hello {name:upper()}",
      { name: "john" },
      mockFormatters,
      "en",
    );
    expect(result).toBe("Hello JOHN");
  });

  it("should apply formatter with single param", () => {
    const result = parseTranslation(
      "Price: {amount:currency(EUR)}",
      { amount: 49.99 },
      mockFormatters,
      "en",
    );
    expect(result).toContain("49.99");
    expect(result).toContain("€");
  });

  it("should handle multiple variables", () => {
    const result = parseTranslation(
      "{greeting} {name:upper()}",
      { greeting: "Hello", name: "john" },
      mockFormatters,
      "en",
    );
    expect(result).toBe("Hello JOHN");
  });

  it("should warn on missing variable", () => {
    const consoleSpy = jest.spyOn(console, "warn").mockImplementation();

    const result = parseTranslation("Hello {name}", {}, {}, "en");

    expect(consoleSpy).toHaveBeenCalledWith("[easy-intl] Missing param: name");
    expect(result).toBe("Hello {name}");

    consoleSpy.mockRestore();
  });

  it("should warn on unknown formatter", () => {
    const consoleSpy = jest.spyOn(console, "warn").mockImplementation();

    const result = parseTranslation(
      "Hello {name:unknown()}",
      { name: "John" },
      {},
      "en",
    );

    expect(consoleSpy).toHaveBeenCalledWith(
      "[easy-intl] Unknown formatter: unknown",
    );
    expect(result).toBe("Hello John");

    consoleSpy.mockRestore();
  });

  it("should handle formatter errors gracefully", () => {
    const errorFormatter = () => {
      throw new Error("Formatter error");
    };

    const consoleSpy = jest.spyOn(console, "error").mockImplementation();

    const result = parseTranslation(
      "Value: {val:error()}",
      { val: "test" },
      { error: errorFormatter },
      "en",
    );

    expect(consoleSpy).toHaveBeenCalled();
    expect(result).toBe("Value: test");

    consoleSpy.mockRestore();
  });
});
