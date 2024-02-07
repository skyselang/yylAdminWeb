module.exports = {
  root: true,
  env: {
    browser: true,
    es2021: true,
    node: true
  },
  parser: 'vue-eslint-parser',
  extends: ['plugin:vue/vue3-recommended', 'prettier', 'plugin:prettier/recommended'],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    project: './jsconfig.*?.json',
    createDefaultProgram: false,
    extraFileExtensions: ['.vue']
  },
  plugins: ['vue'],
  rules: {
    'vue/attributes-order': 'off',
    'vue/attribute-hyphenation': 'off',
    'vue/custom-event-name-casing': 'off',
    'vue/max-attributes-per-line': 'off',
    'vue/multi-word-component-names': 'off',
    'vue/multiline-html-element-content-newline': 'off',
    'vue/no-v-html': 'off',
    'vue/no-v-model-argument': 'off',
    'vue/no-reserved-component-names': 'off',
    'vue/one-component-per-file': 'off',
    'vue/require-default-prop': 'off',
    'vue/require-explicit-emits': 'off',
    'vue/script-setup-uses-vars': 'error',
    'vue/singleline-html-element-content-newline': 'off',
    'vue/html-closing-bracket-newline': 'off',
    'vue/html-self-closing': [
      'error',
      {
        html: {
          void: 'always',
          normal: 'never',
          component: 'always'
        },
        svg: 'always',
        math: 'always'
      }
    ],
    'prettier/prettier': [
      'error',
      {
        useTabs: false
      }
    ]
  },
  overrides: [
    {
      files: ['*.html'],
      processor: 'vue/.vue'
    }
  ],
  globals: {
    OptionType: 'readonly'
  }
}
