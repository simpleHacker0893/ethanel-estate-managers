// @ts-check
import js from '@eslint/js';
import prettier from 'eslint-config-prettier';
import boundaries from 'eslint-plugin-boundaries';
import globals from 'globals';
import tseslint from 'typescript-eslint';

/**
 * Architectural boundaries, encoded in tooling rather than prose (eslint-plugin-boundaries v7).
 *
 *   apps/*        may import packages/* only. Never another app, service or worker.
 *   services/*    may import packages/* only. Never another service, app or worker.
 *   workers/*     may import packages/* only.
 *   packages/contracts imports nothing internal (it is the single source of truth).
 *   packages/*    may import other packages; nothing imports an app.
 *
 * Applies to TypeScript sources only; tooling files (eslint.config.js etc.) are exempt.
 */
const boundaryElements = [
  { type: 'contracts', pattern: 'packages/contracts' },
  { type: 'package', pattern: 'packages/*', capture: ['name'] },
  { type: 'app', pattern: 'apps/*', capture: ['name'] },
  { type: 'service', pattern: 'services/*', capture: ['name'] },
  { type: 'worker', pattern: 'workers/*', capture: ['name'] },
];

const internalPackageSpecifiers = ['@ethanel/*'];
const appSpecifiers = ['web', 'gateway'];

export const boundariesConfig = {
  files: ['**/*.ts', '**/*.tsx'],
  plugins: { boundaries },
  settings: {
    'boundaries/elements': boundaryElements,
    'boundaries/ignore': ['**/node_modules/**', '**/dist/**', '**/.next/**'],
    'boundaries/dependency-nodes': ['import', 'dynamic-import', 'require', 'export'],
  },
  rules: {
    'boundaries/no-unknown-files': 'off',
    'boundaries/no-unknown': 'off',
    'boundaries/dependencies': [
      'error',
      {
        default: 'disallow',
        message:
          '{{file.type}} may not import from {{dependency.type}}. ' +
          'Apps, services and workers import packages/* only; packages/contracts imports nothing internal.',
        policies: [
          // Relative / path-alias imports between elements.
          {
            from: { element: { types: { anyOf: ['app', 'service', 'worker', 'package'] } } },
            allow: { to: { element: { types: { anyOf: ['package', 'contracts'] } } } },
          },
          // Workspace packages resolve as bare specifiers through node_modules, so also police those.
          {
            from: { element: { type: 'contracts' } },
            disallow: { to: { module: { origin: 'external', source: internalPackageSpecifiers } } },
          },
          { disallow: { to: { module: { origin: 'external', source: appSpecifiers } } } },
          // Every other external module is fine.
          { allow: { to: { module: { origin: 'external' } } } },
          // Files inside the same element may import each other freely.
          { allow: { to: { element: { internal: true } } } },
        ],
      },
    ],
  },
};

/**
 * Money is `bigint` minor units (KES cents) end to end. Any file under a `money/` folder or named
 * `*.money.ts` may not use the `number` type, `Number(...)`, `parseFloat` or `parseInt`.
 */
export const moneyConfig = {
  files: ['**/money/**/*.{ts,tsx}', '**/*.money.{ts,tsx}'],
  rules: {
    'no-restricted-syntax': [
      'error',
      {
        selector: 'TSNumberKeyword',
        message:
          'Money is bigint minor units (KES cents). `number` is banned in money files — use bigint.',
      },
      {
        selector: "CallExpression[callee.name='Number']",
        message: 'Number(...) is banned in money files. Use BigInt(...) on validated input.',
      },
      {
        selector: 'CallExpression[callee.name=/^(parseFloat|parseInt)$/]',
        message:
          'parseFloat/parseInt are banned in money files. Use BigInt(...) on validated input.',
      },
      {
        selector: 'Literal[value=/^\\d+\\.\\d+$/]',
        message: 'Decimal literals are banned in money files. Amounts are integer minor units.',
      },
    ],
  },
};

export default tseslint.config(
  {
    ignores: [
      '**/node_modules/**',
      '**/dist/**',
      '**/.next/**',
      '**/.turbo/**',
      '**/coverage/**',
      '**/playwright-report/**',
      '**/next-env.d.ts',
    ],
  },
  js.configs.recommended,
  ...tseslint.configs.strictTypeChecked,
  ...tseslint.configs.stylisticTypeChecked,
  {
    languageOptions: {
      globals: { ...globals.node, ...globals.es2022 },
      parserOptions: { projectService: true },
    },
    rules: {
      '@typescript-eslint/consistent-type-imports': [
        'error',
        { prefer: 'type-imports', fixStyle: 'inline-type-imports' },
      ],
      '@typescript-eslint/no-unused-vars': [
        'error',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_', caughtErrorsIgnorePattern: '^_' },
      ],
      '@typescript-eslint/restrict-template-expressions': [
        'error',
        { allowNumber: true, allowBoolean: true },
      ],
      '@typescript-eslint/no-unnecessary-condition': 'off',
      'no-console': ['error', { allow: ['warn', 'error'] }],
      eqeqeq: ['error', 'always'],
    },
  },
  {
    files: ['**/*.{js,mjs,cjs}'],
    ...tseslint.configs.disableTypeChecked,
  },
  boundariesConfig,
  moneyConfig,
  prettier,
);
