module.exports = {
  env: {
    browser: true,
    es2020: true,
  },
  extends: [
    'airbnb-base',
    "eslint:recommended",
    "plugin:react/recommended"
  ],
  parserOptions: {
    ecmaVersion: 11,
    sourceType: 'module',
  },
  rules: {
    "semi": "error",
    "no-unused-vars": "off"
  },
  "settings": {
    "react": {
      "createClass": "createReactClass",
      "pragma": "createElement",
      "version": "detect",
      "flowVersion": "0.53"
    }
  }
};
