import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";
import { defineConfig, globalIgnores } from "eslint/config";
import prettier from "eslint-plugin-prettier";
import react from "eslint-plugin-react";
import reactHooks from "eslint-plugin-react-hooks";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

export default defineConfig([
  // Base config
  ...compat.extends("next/core-web-vitals"),

  // Ignore patterns
  globalIgnores([
    "node_modules/**",
    ".contentlayer/**",
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),

  // Other options
  {
    files: ["**/*.{js,jsx,mjs,cjs}"],
    plugins: {
      prettier,
      react,
      "react-hooks": reactHooks,
    },
    rules: {
      // Prettier integration
      "prettier/prettier": "error",

      // React rules
      "react/react-in-jsx-scope": "off", // Not needed in Next.js
      "react/no-unescaped-entities": "off", // Disable unescaped entities rule
      "react/prop-types": "off",
      "react/jsx-uses-react": "error",
      "react/jsx-uses-vars": "error",

      // React Hooks rules
      "react-hooks/rules-of-hooks": "error",
      "react-hooks/exhaustive-deps": "warn",

      // General JavaScript rules
      "no-unused-vars": ["error", { argsIgnorePattern: "^_" }],
      "no-console": "warn",
      "prefer-const": "error",
      "no-var": "error",
    },
  },
]);
