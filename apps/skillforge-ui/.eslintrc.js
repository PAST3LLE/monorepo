module.exports = {
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaVersion: "latest",
    sourceType: "module",
    ecmaFeatures: {
      // Allows for the parsing of JSX
      jsx: true
    }
  },
  plugins: [
    "react-hooks",
    "@typescript-eslint",
    "prettier"
  ],
  extends: [
    "plugin:@typescript-eslint/recommended",
    "prettier",
  ],
  root: true,
  ignorePatterns: ["node_modules/**/*", ".github/*", "build", "dist", ".eslintrc.js", "*.config.js"],
  settings: {
    react: {
      version: "detect"
    }
  },
  rules: {
    "prettier/prettier": 2,
    "prettier/trailing-comma": "off",
    "react-hooks/rules-of-hooks": "error",
    "react-hooks/exhaustive-deps": "warn",
    "react/prop-types": "off",
    "@typescript-eslint/explicit-function-return-type": "off",
    "@typescript-eslint/no-explicit-any": "off",
    "@typescript-eslint/ban-ts-comment": "off",
    "@typescript-eslint/ban-ts-ignore": "off",
    "@typescript-eslint/explicit-module-boundary-types": "off",
    "object-shorthand": ["error", "always"],
    "no-restricted-imports": [
      "error",
      {
        paths: [
          {
            name: "lodash",
            message: "Please import from 'lodash/module' directly to support tree-shaking."
          },
          {
            name: "@lingui/macro",
            importNames: ["t"],
            message: "Please use <Trans> instead of t."
          },
          {
            name: "styled-components",
            message: "Please use styled-components/macro instead"
          }
        ],
        patterns: [
          {
            group: ["**/dist"],
            message: "Do not import from dist/ - this is an implementation detail, and breaks tree-shaking."
          }
        ]
      }
    ]
  }
}
