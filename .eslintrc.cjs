/* eslint-env node */
require('@rushstack/eslint-patch/modern-module-resolution')

module.exports = {
  root: true,
  extends: [
    'plugin:vue/vue3-essential',
    'eslint:recommended',
    '@vue/eslint-config-typescript',
    '@vue/eslint-config-prettier/skip-formatting',
    'plugin:prettier/recommended'
  ],
  plugins: ['prettier', 'simple-import-sort'],
  rules: {
    'prettier/prettier': 'warn',
    'vue/multi-word-component-names': 'off',
    'simple-import-sort/imports': 'error'
  },
  parserOptions: {
    ecmaVersion: 'latest'
  }
}
