import eslint from '@eslint/js';
import prettier from 'eslint-config-prettier';
import svelte from 'eslint-plugin-svelte';
import astro from 'eslint-plugin-astro';
import globals from 'globals';
import tseslint from 'typescript-eslint';

export default tseslint.config(
    eslint.configs.recommended,
    ...tseslint.configs.recommended,
    ...svelte.configs['flat/recommended'],
    ...astro.configs.recommended,
    prettier,
    ...svelte.configs['flat/prettier'],
    {
        languageOptions: {
            globals: {
                ...globals.browser,
                ...globals.node
            }
        }
    },
    {
        // Svelte files configuration
        files: ['**/*.svelte'],
        languageOptions: {
            parserOptions: {
                parser: tseslint.parser
            }
        }
    },
    {
        // Astro files configuration
        files: ['**/*.astro'],
        languageOptions: {
            parser: astro.parser
        }
    },
    {
        ignores: ['build/', '.svelte-kit/', 'dist/', 'node_modules/']
    }
);