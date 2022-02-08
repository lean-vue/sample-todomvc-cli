module.exports = {
  env: {
    node: true,
    browser: true,
    es2020: true,
  },
  extends: ['plugin:vue/vue3-essential', 'eslint:recommended', '@vue/prettier'],
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: 'module',
  },
};
