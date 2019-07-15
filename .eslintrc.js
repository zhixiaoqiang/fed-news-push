module.exports = {
  parser: "babel-eslint",
  env: {
    browser: true,
    node: true,
    es6: true
  },
  extends: ["standard", "standard-jsx"],
  plugins: ["import"],
  rules: {
    "no-eval": "error",
    "no-var": "error",
    "no-debugger": "error",
    "prefer-const": "error",
    "prefer-template": "error",
    "no-param-reassign": "error",
    "no-multi-assign": "error",
    "no-case-declarations": "error",
    "no-mixed-operators": "error",
    "no-else-return": "error",
    "newline-per-chained-call": "error",
    "import/first": "error",
    "import/no-mutable-exports": "error",
    "import/prefer-default-export": "error",
    "import/no-webpack-loader-syntax": "error",
    "comma-dangle": ["error", "always-multiline"],
    "quote-props": ["error", "as-needed"],
    "function-paren-newline": ["error", "multiline"],
    "object-shorthand": [
      "error",
      "methods",
      { avoidExplicitReturnArrows: true }
    ],
    "arrow-parens": ["error", "as-needed", { requireForBlockBody: true }],
    "no-confusing-arrow": ["error", { allowParens: true }],
    "id-length": [
      "error",
      {
        properties: "never",
        exceptions: ["a", "b", "c", "e", "i", "j", "k", "l", "o", "v"]
      }
    ],
    "jsx-quotes": ["error", "prefer-double"]
  }
};
