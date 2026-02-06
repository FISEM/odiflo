import { render } from "@testing-library/react";
import { EasyIntlProvider } from "../context";
import { useT } from "../useT";
import { intlStore } from "../store";

describe("EasyIntlProvider & useT Integration", () => {
  beforeEach(() => {
    intlStore.clear();
    jest.restoreAllMocks();
  });

  it("should provide locale and formatters without a translations prop", () => {
    let capturedLocale: string | undefined;
    let hasFormatters = false;

    const TestComponent = () => {
      const t = useT("test-id");
      capturedLocale = t.locale;
      hasFormatters = Object.keys(t.formatters).length > 0;
      return null;
    };

    render(
      <EasyIntlProvider locale="fr">
        <TestComponent />
      </EasyIntlProvider>,
    );

    expect(capturedLocale).toBe("fr");
    expect(hasFormatters).toBe(true);
  });

  it("should translate using data pushed directly to the specific component store", () => {
    const COMPONENT_ID = "src/components/Header";

    // Simulate the data being pushed specifically for this component ID
    intlStore.update(COMPONENT_ID, { welcome: "Welcome {name}!" });

    let result: string | undefined;
    const TestComponent = () => {
      const t = useT(COMPONENT_ID);
      result = t("welcome", { name: "John" });
      return null;
    };

    render(
      <EasyIntlProvider locale="en">
        <TestComponent />
      </EasyIntlProvider>,
    );

    expect(result).toBe("Welcome John!");
  });

  it("should warn on missing key for the specific component", () => {
    const consoleSpy = jest.spyOn(console, "warn").mockImplementation();

    const TestComponent = () => {
      const t = useT("component-x");
      // Calling a key that doesn't exist in the store for "component-x"
      return <div>{t("missing")}</div>;
    };

    render(
      <EasyIntlProvider locale="en">
        <TestComponent />
      </EasyIntlProvider>,
    );

    // Expecting the clean warning message without the "global" mention
    expect(consoleSpy).toHaveBeenCalledWith(
      expect.stringContaining(
        '[easy-intl] Missing key: "missing" in component-x',
      ),
    );

    consoleSpy.mockRestore();
  });
});
