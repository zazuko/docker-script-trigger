// eslint-disable-next-line no-undef
module.exports = {
  root: true,
  plugins: [],
  extends: [
    "eslint:recommended",
  ],
  parserOptions: {
    ecmaVersion: 2020
  },
  env: {
    es6: true,
    node: true,
    browser: true,
  },
  rules: {
    "no-console": "off"
  },
  ignorePatterns: [".eslintrc.js"],
};
