// @ts-check
import js from '@eslint/js';
import prettier from 'eslint-config-prettier';
import boundaries from 'eslint-plugin-boundaries';
import globals from 'globals';
import tseslint from 'typescript-eslint';

/**
 * Architectural boundaries, encoded in tooling rather than prose.
 *
 *   apps/*        may import packages/* only. Never another app, service or worker.
 *   services/*    may import packages/* only. Never another service, app or worker.
 *   workers/*     may import packages/* only.
 *   packages/contracts imports nothing internal (it is the single source of truth).
 *   packages/*    may import other packages, except that nothing imports from an app.
 *
 * Element roots are resolved from the repository root, so this config must be consumed from a
 * package whose eslint.config.js sets `settings['boundaries/root-path']` is unnecessary —
 * eslint-plugin-boundaries matches on the absolute file path pattern below.
 */
const boundaryElements = [
  { type: 'contracts', pattern: 'packages/contracts' },
  { type: 'package', pattern: 'packages/*', capture: ['name'] },
  { type: 'app', pattern: 'apps/*', capture: ['name'] },
  { type: 'service', pattern: 'services/*', capture: ['name'] },
  { type: 'worker', pattern: 'workers/*', capture: ['name'] },
];

export const boundariesConfig = {
  plugins: { boundaries },
  settings: {
    'boundaries/elements': boundaryElements,
    'boundaries/ignore': ['**/node_modules/**', '**/dist/**', '**/.next/**'],
    'boundaries/dependency-nodes': ['import', 'dynamic-import', 'require', 'export'],
  },
  rules: {
    'boundaries/no-unknown-files': 'off',
    'boundaries/no-unknown': 'off',
    'boundaries/element-types': [
      'error',
      {
        default: 'disallow',
        message:
          '${file.type} "${file.name}" may not import from ${dependency.type} "${dependency.name}". ' +
          'Apps, services and workers import packages/* only; packages/contracts imports nothing internal.',
        rules: [
          { from: ['app'], allow: ['package', 'contracts'] },
          { from: ['service'], allow: ['package', 'contracts'] },
          { from: ['worker'], allow: ['package', 'contracts'] },
          { from: ['package'], allow: ['package', 'contracts'] },
          { from: ['contracts'], allow: [] },
        ],
      },
    ],
    // Workspace packages resolve through node_modules, so also block their bare specifiers.
    'boundaries/external': [
      'error',
      {
        default: 'allow',
        rules: [
          { from: ['contracts'], disallow: ['@ethanel/*'] },
          { from: ['app', 'service', 'worker', 'package'], disallow: ['web', 'gateway'] },
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
