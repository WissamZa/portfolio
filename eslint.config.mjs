import nextCoreWebVitals from "eslint-config-next/core-web-vitals";
import nextTypescript from "eslint-config-next/typescript";

/**
 * ESLint Configuration for Portfolio Project
 *
 * Configuration is organized into logical groups:
 * 1. TypeScript rules - Type safety and best practices
 * 2. React rules - Component and hooks best practices
 * 3. Next.js rules - Framework-specific rules
 * 4. General JavaScript rules - Code quality standards
 */
const eslintConfig = [
  ...nextCoreWebVitals,
  ...nextTypescript,
  {
    rules: {
      /* ===========================================
       * TYPESCRIPT RULES
       * =========================================== */
      "@typescript-eslint/no-explicit-any": "warn",
      "@typescript-eslint/no-unused-vars": [
        "warn",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
          caughtErrorsIgnorePattern: "^_",
        },
      ],
      "@typescript-eslint/no-non-null-assertion": "off",
      "@typescript-eslint/ban-ts-comment": "off",
      "@typescript-eslint/prefer-as-const": "warn",

      /* ===========================================
       * REACT RULES
       * =========================================== */
      "react-hooks/exhaustive-deps": "warn",
      "react/no-unescaped-entities": "off",
      "react/display-name": "off",
      "react/prop-types": "off",

      /* ===========================================
       * NEXT.JS RULES
       * =========================================== */
      "@next/next/no-img-element": "off",
      "@next/next/no-html-link-for-pages": "off",

      /* ===========================================
       * GENERAL JAVASCRIPT RULES
       * =========================================== */
      "prefer-const": "warn",
      "no-unused-vars": "off",
      "no-console": ["warn", { allow: ["warn", "error"] }],
      "no-debugger": "warn",
      "no-empty": "warn",
      "no-irregular-whitespace": "warn",
      "no-case-declarations": "off",
      "no-fallthrough": "off",
      "no-mixed-spaces-and-tabs": "warn",
      "no-redeclare": "off",
      "no-unreachable": "warn",
      "no-useless-escape": "warn",
    },
  },
  {
    ignores: [
      "node_modules/**",
      ".next/**",
      "out/**",
      "build/**",
      "next-env.d.ts",
      "examples/**",
      "skills/**",
      "*.config.js",
      "*.config.mjs",
      "database/**",
    ],
  },
];

export default eslintConfig;
