import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import { defineConfig, globalIgnores } from 'eslint/config'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{js,jsx}'],
    extends: [
      js.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
      parserOptions: {
        ecmaVersion: 'latest',
        ecmaFeatures: { jsx: true },
        sourceType: 'module',
      },
    },
    rules: {
      'no-unused-vars': [
        'error',
        {
          varsIgnorePattern: '^[A-Z_]|^motion$',
          argsIgnorePattern: '^_',
          caughtErrors: 'none',
        },
      ],
      // False positives with useScrollReveal({ ref, isInView }) + deps `[x.isInView]` and ref={x.ref} on elements.
      'react-hooks/refs': 'off',
      // Legit sync when server `botConfig` identity changes (form reset).
      'react-hooks/set-state-in-effect': 'off',
    },
  },
])
