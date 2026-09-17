import config from '@ethanel/config/eslint/node';

export default [...config, { ignores: ['prisma/generated/**'] }];
