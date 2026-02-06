const babel = require("@babel/core");
const plugin = require("../plugin");

describe("easy-intl-shadow-injector", () => {
  const transform = (code, filename) => {
    return babel.transform(code, {
      filename,
      plugins: [plugin],
      babelrc: false,
      configFile: false,
      cwd: "/home/projects/odiflo", // Simulate a fixed root for the test
    }).code;
  };

  it("should inject the precise relative path into useT()", () => {
    const input = "const t = useT();";
    const filename = "/home/projects/odiflo/src/components/Header/Header.tsx";

    const output = transform(input, filename);

    // Should inject a clean ID
    expect(output).toBe('const t = useT("src/components/Header/Header");');
  });

  it("should handle nested directories and different extensions", () => {
    const input = "const t = useT();";
    const filename = "/home/projects/odiflo/src/UI/Buttons/SubmitButton.jsx";

    const output = transform(input, filename);

    expect(output).toBe('const t = useT("src/UI/Buttons/SubmitButton");');
  });

  it("should not inject an ID if useT already has arguments", () => {
    const input = 'const t = useT("manual-id");';
    const filename = "/home/projects/odiflo/src/Component.tsx";

    const output = transform(input, filename);

    // Should not touch manual ID
    expect(output).toBe('const t = useT("manual-id");');
  });

  it("should work with multiple calls in the same file", () => {
    const input = "const t1 = useT(); const t2 = useT();";
    const filename = "/home/projects/odiflo/src/Page.tsx";

    const output = transform(input, filename);

    expect(output).toContain('useT("src/Page")');
    expect(output.match(/src\/Page/g)?.length).toBe(2);
  });
});
