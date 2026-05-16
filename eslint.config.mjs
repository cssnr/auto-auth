import { fileURLToPath } from 'node:url'
import { defineConfig } from 'eslint/config'
import { includeIgnoreFile } from '@eslint/config-helpers'
import js from '@eslint/js'
import tseslint from 'typescript-eslint'
import pluginVue from 'eslint-plugin-vue'
import globals from 'globals'

const gitignorePath = fileURLToPath(new URL('.gitignore', import.meta.url))

// noinspection JSCheckFunctionSignatures,JSUnresolvedReference
export default defineConfig([
  js.configs.recommended,
  tseslint.configs.recommended,
  ...pluginVue.configs['flat/essential'],
  includeIgnoreFile(gitignorePath, 'Imported .gitignore patterns'),
  {
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
      // 'no-undef': 'off',
    },
    languageOptions: {
      sourceType: 'module',
      parserOptions: {
        parser: tseslint.parser,
      },
      globals: {
        ...globals.browser,
        ...globals.webextensions,
        RadioBackground: 'readonly', // NOTE: consider disabling no-undef
      },
    },
  },
])
