import globals from 'globals';

import prettier from 'eslint-config-prettier';
import n from 'eslint-plugin-n';

export default [
  prettier,
  {
    files: ['**/*.js'],
    plugins: {
      n,
    },

    languageOptions: {
      sourceType: 'module',
      ecmaVersion: 'latest',
      globals: {
        ...globals.node,
      },
    },
  },
];
