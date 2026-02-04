import React from "react";
import { render } from "@testing-library/react";
import { EasyIntlProvider } from "../context";
import { useT } from "../useT";

describe("EasyIntlProvider", () => {
  it("should provide locale context", () => {
    let capturedLocale: string | undefined;

    const TestComponent = () => {
      const t = useT();
      capturedLocale = t.locale;
      return null;
    };

    render(
      <EasyIntlProvider locale="fr" translations={{}}>
        <TestComponent />
      </EasyIntlProvider>,
    );

    expect(capturedLocale).toBe("fr");
  });

  it("should provide default formatters", () => {
    let hasFormatters = false;

    const TestComponent = () => {
      const t = useT();
      hasFormatters = Object.keys(t.formatters).length > 0;
      return null;
    };

    render(
      <EasyIntlProvider locale="en" translations={{}}>
        <TestComponent />
      </EasyIntlProvider>,
    );

    expect(hasFormatters).toBe(true);
  });

  it("should merge custom formatters", () => {
    let customFormatterExists = false;

    const customFormatters = {
      test: (val: string) => `TEST:${val}`,
    };

    const TestComponent = () => {
      const t = useT();
      customFormatterExists = "test" in t.formatters;
      return null;
    };

    render(
      <EasyIntlProvider
        locale="en"
        translations={{}}
        formatters={customFormatters}
      >
        <TestComponent />
      </EasyIntlProvider>,
    );

    expect(customFormatterExists).toBe(true);
  });
});

describe("useT hook", () => {
  it("should return locale from context", () => {
    let locale: string | undefined;

    const TestComponent = () => {
      const t = useT();
      locale = t.locale;
      return null;
    };

    render(
      <EasyIntlProvider locale="fr" translations={{}}>
        <TestComponent />
      </EasyIntlProvider>,
    );

    expect(locale).toBe("fr");
  });

  it("should throw error when used outside provider", () => {
    const TestComponent = () => {
      useT(); // Should throw
      return null;
    };

    // Suppress console.error for this test
    const consoleSpy = jest.spyOn(console, "error").mockImplementation();

    expect(() => {
      render(<TestComponent />);
    }).toThrow("useEasyIntl must be used within EasyIntlProvider");

    consoleSpy.mockRestore();
  });

  it("should translate with simple key", () => {
    let result: string | undefined;

    const TestComponent = () => {
      const t = useT();
      result = t("welcome", { name: "John" });
      return null;
    };

    render(
      <EasyIntlProvider
        locale="en"
        translations={{ welcome: "Welcome {name}!" }}
      >
        <TestComponent />
      </EasyIntlProvider>,
    );

    expect(result).toBe("Welcome John!");
  });

  it("should translate with formatters", () => {
    let result: string | undefined;

    const TestComponent = () => {
      const t = useT();
      result = t("price", { amount: 49.99 });
      return null;
    };

    render(
      <EasyIntlProvider
        locale="en"
        translations={{ price: "Price: {amount:currency(USD)}" }}
      >
        <TestComponent />
      </EasyIntlProvider>,
    );

    expect(result).toContain("49.99");
    expect(result).toContain("$");
  });

  it("should warn on missing translation", () => {
    let result: string | undefined;
    const consoleSpy = jest.spyOn(console, "warn").mockImplementation();

    const TestComponent = () => {
      const t = useT();
      result = t("missing");
      return null;
    };

    render(
      <EasyIntlProvider locale="en" translations={{}}>
        <TestComponent />
      </EasyIntlProvider>,
    );

    expect(consoleSpy).toHaveBeenCalledWith(
      "[easy-intl] Missing translation: missing",
    );
    expect(result).toBe("missing"); // Fallback to key

    consoleSpy.mockRestore();
  });
});
