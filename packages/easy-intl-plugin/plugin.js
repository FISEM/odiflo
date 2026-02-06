const path = require("path");

/**
 * Easy-Intl Auto Component Context Plugin
 *
 * This Babel plugin transforms useT() calls with no arguments into useT("component/id")
 * by injecting a unique component identifier based on the file path at build time.
 *
 * Example:
 *   // In src/components/Header/Header.tsx
 *   const t = useT();
 *   // → const t = useT("src/components/Header/Header");
 *
 * Features:
 * - Works cross-platform (normalizes slashes)
 * - Leaves useT("manual-id") untouched
 * - Handles multiple useT() calls per file
 *
 * @param {object} api - Babel API
 * @returns {object} Babel visitor
 */
module.exports = function (api) {
  const { types: t } = api;

  return {
    name: "easy-intl-auto-component-context",
    visitor: {
      CallExpression(nodePath, state) {
        // Target: useT() with no arguments
        if (
          t.isIdentifier(nodePath.node.callee, { name: "useT" }) &&
          nodePath.node.arguments.length === 0
        ) {
          const filename = state.file.opts.filename;
          if (!filename) return;

          // Project root (e.g., /home/emmanuel/Projects/odiflo)
          const root = state.cwd || process.cwd();

          // Absolute to Relative (e.g., src/components/Header/Header.tsx)
          const relativePath = path.relative(root, filename);

          // Clean ID: Remove extension and normalize slashes for cross-platform
          const componentId = relativePath
            .replace(/\.[jt]sx?$/, "")
            .replace(/\\/g, "/");

          // Result: useT("src/components/Header/Header")
          nodePath.node.arguments.push(t.stringLiteral(componentId));
        }
      },
    },
  };
};
