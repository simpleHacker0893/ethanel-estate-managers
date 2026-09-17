// @ts-check
import nextPlugin from '@next/eslint-plugin-next';
import jsxA11y from 'eslint-plugin-jsx-a11y';
import reactHooks from 'eslint-plugin-react-hooks';
import globals from 'globals';
import tseslint from 'typescript-eslint';

import base from './base.js';

export default tseslint.config(...base, {
  files: ['**/*.{ts,tsx}'],
  plugins: {
    '@next/next': nextPlugin,
    'react-hooks': reactHooks,
    'jsx-a11y': jsxA11y,
  },
  languageOptions: {
    globals: { ...globals.browser, ...globals.node },
  },
  rules: {
    ...nextPlugin.configs.recommended.rules,
    ...nextPlugin.configs['core-web-vitals'].rules,
    ...reactHooks.configs['recommended-latest'].rules,
    ...jsxA11y.flatConfigs.strict.rules,
    // Server Actions and RSC helpers are async by design; Next handles the promise.
    '@typescript-eslint/no-misused-promises': [
      'error',
      { checksVoidReturn: { attributes: false } },
    ],
    '@typescript-eslint/only-throw-error': ['error', { allowThrowingAny: false }],
    'jsx-a11y/no-autofocus': 'off',
  },
});
