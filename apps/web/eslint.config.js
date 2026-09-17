import config from '@ethanel/config/eslint/next';

export default [
  ...config,
  {
    ignores: ['.next/**', 'next-env.d.ts', 'next.config.ts'],
  },
];
