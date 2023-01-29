const path = require("path");

module.exports = {
  extends: [
    "../../.eslintrc.js",
  ],
  parserOptions: {
    tsconfigRootDir: path.join(__dirname, "../../")
  },
  plugins: ["react-hooks"],
  rules: {
    "react-hooks/rules-of-hooks": "error",
    "react-hooks/exhaustive-deps": "warn",
    "react/prop-types": "off"
  }
}
