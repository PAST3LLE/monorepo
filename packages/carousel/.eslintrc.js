module.exports = {
  extends: [
    "../../.eslintrc.js",
  ],
  plugins: ["react-hooks"],
  include: ["*.fixture.tsx"],
  rules: {
    "react-hooks/rules-of-hooks": "error",
    "react-hooks/exhaustive-deps": "warn",
    "react/prop-types": "off"
  }
}
