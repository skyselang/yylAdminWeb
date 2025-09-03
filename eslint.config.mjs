import { defineConfig, globalIgnores } from 'eslint/config'
import vue from 'eslint-plugin-vue'
import globals from 'globals'
import parser from 'vue-eslint-parser'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import js from '@eslint/js'
import { FlatCompat } from '@eslint/eslintrc'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
  allConfig: js.configs.all
})

export default defineConfig([
  globalIgnores([
    '**/.buildpath',
    '**/.codebuddy',
    '**/.comate',
    '**/.cursor',
    '**/.eslintrc.cjs',
    '**/.husky',
    '**/.idea',
    '**/.prettierrc.cjs',
    '**/.project',
    '**/.qoder',
    '**/.settings',
    '**/.stylelintrc.cjs',
    '**/.trae',
    '**/.vscode',
    '**/.workflow',
    '**/admin',
    '**/dist',
    '**/md',
    '**/node_modules',
    '**/pnpm-lock.yaml',
    '**/public',
    '**/src/assets',
    '**/*.md',
    '**/*.sh'
  ]),
  {
    extends: compat.extends('plugin:vue/vue3-recommended', 'prettier', 'plugin:prettier/recommended'),

    plugins: {
      vue
    },

    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
        OptionType: 'readonly'
      },

      parser: parser,
      ecmaVersion: 'latest',
      sourceType: 'module',

      parserOptions: {
        project: './jsconfig.*?.json',
        createDefaultProgram: false,
        extraFileExtensions: ['.vue']
      }
    },

    rules: {
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
    }
  },
  {
    files: ['**/*.html'],
    processor: 'vue/.vue'
  }
])
