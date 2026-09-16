import eslint from "@eslint/js";
import importPlugin from "eslint-plugin-import-x";
import prettier from "eslint-config-prettier";
import tseslint from "typescript-eslint";

export default tseslint.config(
  // ─────────────────────────────────────────────
  // Global ignores
  // ─────────────────────────────────────────────

  {
    ignores: [
      "node_modules/**",
      "dist/**",
      "build/**",
      "coverage/**",
      ".next/**",
      "src/generated/**",
    ],
  },

  // ─────────────────────────────────────────────
  // Base ESLint rules
  // ─────────────────────────────────────────────

  eslint.configs.recommended,

  // ─────────────────────────────────────────────
  // TypeScript
  // ─────────────────────────────────────────────

  tseslint.configs.recommendedTypeChecked,

  {
    files: ["**/*.ts", "**/*.tsx"],

    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },

    plugins: {
      import: importPlugin,
    },

    settings: {
      "import/resolver": {
        typescript: true,
      },
    },

    rules: {
      // ─────────────────────────────────────────
      // TypeScript
      // ─────────────────────────────────────────

      "@typescript-eslint/no-explicit-any": "warn",

      "@typescript-eslint/no-unused-vars": [
        "error",
        {
          args: "after-used",
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
          caughtErrors: "none",
        },
      ],

      "@typescript-eslint/consistent-type-imports": [
        "error",
        {
          prefer: "type-imports",
          fixStyle: "separate-type-imports",
        },
      ],

      "@typescript-eslint/no-floating-promises": "error",

      "@typescript-eslint/no-misused-promises": [
        "error",
        {
          checksVoidReturn: {
            arguments: false,
            attributes: false,
          },
        },
      ],

      "@typescript-eslint/await-thenable": "error",

      "@typescript-eslint/no-unnecessary-condition": "warn",

      "@typescript-eslint/no-unnecessary-type-assertion": "warn",

      "@typescript-eslint/no-unsafe-assignment": "warn",

      "@typescript-eslint/no-unsafe-argument": "warn",

      "@typescript-eslint/no-unsafe-member-access": "warn",

      "@typescript-eslint/no-unsafe-return": "warn",

      "@typescript-eslint/require-await": "error",

      "@typescript-eslint/return-await": ["error", "in-try-catch"],

      // ─────────────────────────────────────────
      // General JavaScript
      // ─────────────────────────────────────────

      "no-console": "warn",

      "no-debugger": "error",

      "no-alert": "error",

      "no-var": "error",

      "prefer-const": "error",

      "no-duplicate-imports": "off",

      "no-unreachable": "error",

      "no-unreachable-loop": "error",

      "no-constant-condition": [
        "error",
        {
          checkLoops: false,
        },
      ],

      "no-implicit-coercion": "warn",

      "no-new-wrappers": "error",

      "no-return-await": "off",

      // ─────────────────────────────────────────
      // Error handling
      // ─────────────────────────────────────────

      "no-throw-literal": "off",

      // ─────────────────────────────────────────
      // Imports
      // ─────────────────────────────────────────

      "import/first": "error",

      "import/no-duplicates": "error",

      "import/no-named-as-default": "error",

      "import/no-unresolved": "off",

      // ─────────────────────────────────────────
      // Complexity
      // ─────────────────────────────────────────

      complexity: [
        "warn",
        {
          max: 10,
        },
      ],

      "max-depth": [
        "warn",
        {
          max: 4,
        },
      ],

      "max-nested-callbacks": [
        "warn",
        {
          max: 4,
        },
      ],
    },
  },

  // ─────────────────────────────────────────────
  // JavaScript files
  // ─────────────────────────────────────────────

  {
    files: ["**/*.js", "**/*.mjs", "**/*.cjs"],

    extends: [tseslint.configs.disableTypeChecked],

    rules: {
      "no-console": "warn",
    },
  },

  // ─────────────────────────────────────────────
  // Prettier
  //
  // Must come LAST.
  // Disables ESLint formatting rules that
  // conflict with Prettier.
  // ─────────────────────────────────────────────

  prettier,
);
