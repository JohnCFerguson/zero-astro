import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';
import astroPlugin from 'eslint-plugin-astro';
import prettierConfig from 'eslint-config-prettier';
import globals from 'globals';

export default [
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
  prettierConfig,
  {
    files: ['**/*.{ts,tsx,js,jsx}'],
    plugins: {
      '@typescript-eslint': tseslint.plugin
    },
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        project: './tsconfig.json'
      },
      globals: {
        ...globals.browser,
        ...globals.node
      }
    }
  },
  {
    files: ['**/*.astro'],
    plugins: {
      astro: astroPlugin
    },
    languageOptions: {
      parser: astroPlugin.parser
    },
    rules: {
      ...astroPlugin.configs.recommended.rules
    }
  },
  {
    ignores: ['dist/**', 'node_modules/**']
  }
];