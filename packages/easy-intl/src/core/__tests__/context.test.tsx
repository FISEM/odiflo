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
      <EasyIntlProvider locale="fr">
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
      <EasyIntlProvider locale="en">
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
      <EasyIntlProvider locale="en" formatters={customFormatters}>
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
      <EasyIntlProvider locale="fr">
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

  // TODO: Add tests for template literal API when build-time plugin is implemented
  // it('should support template literal syntax', () => {
  //   const TestComponent = () => {
  //     const t = useT();
  //     const result = t`welcome`({ name: 'John' });
  //     return <div>{result}</div>;
  //   };
  //
  //   const { getByText } = render(
  //     <EasyIntlProvider locale="en">
  //       <TestComponent />
  //     </EasyIntlProvider>
  //   );
  //
  //   expect(getByText(/John/)).toBeInTheDocument();
  // });
});
