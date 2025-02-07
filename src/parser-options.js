import { hasBabelConfig } from './utils.js';

export function esm(root) {
  let isBabelConfigPresent = hasBabelConfig(root);

  return {
    js: isBabelConfigPresent
      ? {
          ecmaFeatures: { modules: true },
          ecmaVersion: 'latest',
        }
      : {
          ecmaFeatures: { modules: true },
          ecmaVersion: 'latest',
          requireConfigFile: false,
          babelOptions: {
            plugins: [
              [
                '@babel/plugin-proposal-decorators',
                { decoratorsBeforeExport: true },
              ],
            ],
          },
        },
    ts: {
      projectService: true,
      tsconfigRootDir: root,
      extraExtensions: ['.gjs', '.gts', '.json'],
    },
  };
}
