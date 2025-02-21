'use strict';

module.exports = {
  plugins: [
    [
      'module:decorator-transforms',
      {
        runtime: {
          import: require.resolve('decorator-transforms/runtime-esm'),
        },
      },
    ],
  ],

  generatorOpts: {
    compact: false,
  },
};
