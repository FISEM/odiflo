import { renderHook, act } from "@testing-library/react";
import { useT } from "../useT";
import { intlStore } from "../store";
import { EasyIntlProvider } from "../context";
import React from "react";

/**
 * Test wrapper: provides the EasyIntlProvider context for the hook.
 * The translations prop is removed as data now flows through the intlStore.
 */
const wrapper = ({ children }: { children: React.ReactNode }) => (
  <EasyIntlProvider
    locale="en"
    formatters={{
      upper: (s: string) => s.toUpperCase(),
    }}
  >
    {children}
  </EasyIntlProvider>
);

/**
 * Tests for the useT hook with the intlStore integration.
 * Ensures strict component-level isolation and reactive updates.
 */
describe("useT Hook - Store Integration", () => {
  const COMPONENT_ID = "src/components/TestComponent";

  beforeEach(() => {
    // Reset the store and mocks to ensure test isolation
    intlStore.clear();
    jest.restoreAllMocks();
  });

  it("should return the key if translations are not yet in the store", () => {
    const { result } = renderHook(() => useT(COMPONENT_ID), { wrapper });
    expect(result.current("welcome")).toBe("welcome");
  });

  it("should reactively update when store data is populated for the component", () => {
    const { result } = renderHook(() => useT(COMPONENT_ID), { wrapper });

    act(() => {
      // Simulate data being loaded into the specific component namespace
      intlStore.update(COMPONENT_ID, { welcome: "Hello {name}" });
    });

    expect(result.current("welcome", { name: "Israel" })).toBe("Hello Israel");
  });

  it("should apply Method Training (..) from the store data", () => {
    const { result } = renderHook(() => useT(COMPONENT_ID), { wrapper });

    act(() => {
      intlStore.update(COMPONENT_ID, { shout: "HEY {name..upper()}" });
    });

    expect(result.current("shout", { name: "israel" })).toBe("HEY ISRAEL");
  });

  it("should isolate updates between different components", () => {
    const OTHER_ID = "src/components/Other";

    const { result: res1 } = renderHook(() => useT(COMPONENT_ID), { wrapper });
    const { result: res2 } = renderHook(() => useT(OTHER_ID), { wrapper });

    act(() => {
      intlStore.update(COMPONENT_ID, { title: "Dashboard" });
      intlStore.update(OTHER_ID, { title: "Settings" });
    });

    expect(res1.current("title")).toBe("Dashboard");
    expect(res2.current("title")).toBe("Settings");
  });

  it("should warn on missing translation for the specific component", () => {
    const consoleSpy = jest.spyOn(console, "warn").mockImplementation();
    const { result } = renderHook(() => useT(COMPONENT_ID), { wrapper });

    const output = result.current("missing_key");

    expect(consoleSpy).toHaveBeenCalledWith(
      expect.stringContaining(
        '[easy-intl] Missing key: "missing_key" in src/components/TestComponent',
      ),
    );
    expect(output).toBe("missing_key");

    consoleSpy.mockRestore();
  });

  it("should provide current locale and formatters on the t function", () => {
    const { result } = renderHook(() => useT(COMPONENT_ID), { wrapper });
    expect(result.current.locale).toBe("en");
    expect(result.current.formatters).toHaveProperty("upper");
  });
});
