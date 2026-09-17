import config from '@ethanel/config/eslint/next';

export default [...config, { rules: { '@next/next/no-html-link-for-pages': 'off' } }];
