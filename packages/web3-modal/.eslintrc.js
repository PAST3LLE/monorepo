module.exports = {
  extends: [
    "../../.eslintrc.js",
  ],
  exclude: ["*.config.js", "*.config.mjs"],
  plugins: ["react-hooks"],
  rules: {
    "react-hooks/rules-of-hooks": "error",
    "react-hooks/exhaustive-deps": "warn",
    "react/prop-types": "off"
  }
}
