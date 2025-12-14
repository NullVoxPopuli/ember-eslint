import * as parserOptions from './parser-options.js';
import globals from 'globals';
import js from '@eslint/js';
import ts from 'typescript-eslint';

import ember from 'eslint-plugin-ember/recommended';

import prettier from 'eslint-config-prettier';
import qunit from 'eslint-plugin-qunit';
import n from 'eslint-plugin-n';
import { hasTypescript, hasTypeModule } from './utils.js';

import babelParser from '@babel/eslint-parser/experimental-worker';

/**
 * @param {string} root the directory of the eslint config file. can be import.meta.dirname
 */
export function official(root) {
  let hasTS = hasTypescript(root);
  let esm = parserOptions.esm(root);
  let isTypeModule = hasTypeModule(root);

  return ts.config(
    [
      {
        name: '@eslint/js:recommended',
        ...js.configs.recommended,
      },
      ember.configs.base,
      ember.configs.gjs,
      ember.configs.gts,
      {
        name: 'prettier:disable-conflicting',
        ...prettier,
      },
      /**
       * Ignores must be in their own object
       * https://eslint.org/docs/latest/use/configure/ignore
       */
      {
        name: 'ember-eslint:ignores',
        ignores: [
          'dist/',
          'dist-*/',
          'declarations/',
          'node_modules/',
          'coverage/',
          'vendor/',
          'tmp/',
          '!**/.*',
        ],
      },
      /**
       * https://eslint.org/docs/latest/use/configure/configuration-files#configuring-linter-options
       */
      {
        name: 'ember-eslint:linter-options',
        linterOptions: {
          reportUnusedDisableDirectives: 'error',
        },
      },
      {
        name: 'ember-eslint:(js)/parser',
        files: ['**/*.js'],
        languageOptions: {
          parser: babelParser,
        },
      },
      {
        name: 'ember-eslint:(js, gjs)/parser-options',
        files: ['**/*.{js,gjs}'],
        languageOptions: {
          parserOptions: esm.js,
          globals: {
            ...globals.browser,
          },
        },
      },
      ...[
        hasTS
          ? /**
             * Not using "extends" behavior here from ts-eslint because it formats weird in the inspecter
             */
            (() => {
              let base = {
                ...ember.configs.gts,
                name: 'ember-eslint:(ts, gts)',
                files: ['**/*.{ts,gts}'],
                languageOptions: {
                  parser: ember.parser,
                  parserOptions: esm.ts,
                },
              };

              return [
                ts.configs.recommendedTypeChecked.map((x) => {
                  x.files = base.files;
                  x.name = x.name
                    ? `${base.name}:${x.name}`
                    : `${base.name}:unknown`;

                  x.languageOptions ||= {};
                  x.languageOptions.parser = base.languageOptions.parser;
                  x.languageOptions.parserOptions ||= {};
                  x.languageOptions.globals ||= {};
                  Object.assign(
                    x.languageOptions.parserOptions,
                    base.languageOptions.parserOptions
                  );
                  Object.assign(
                    x.languageOptions.globals,
                    base.languageOptions.globals
                  );

                  return x;
                }),
                base,
              ];
            })()
          : null,
      ].flat(),

      {
        name: 'ember-eslint:(js, gjs)/globals',
        files: ['**/*.{js,gjs}'],
        languageOptions: {
          globals: {
            ...globals.browser,
          },
        },
      },
      hasTS
        ? {
            name: 'ember-eslint:(ts, gts)/globals',
            files: ['**/*.{ts,gts}'],
            languageOptions: {
              globals: {
                ...globals.browser,
              },
            },
          }
        : null,

      hasTS
        ? {
            ...qunit.configs.recommended,
            name: 'ember-eslint:tests/qunit',
            files: ['tests/**/*-test.{js,gjs,ts,gts}'],
            plugins: {
              qunit,
            },
          }
        : {
            ...qunit.configs.recommended,
            name: 'ember-eslint:tests/qunit',
            files: ['tests/**/*-test.{js,gjs}'],
            plugins: {
              qunit,
            },
          },

      /**
       * CJS node files
       */
      {
        ...n.configs['flat/recommended-script'],
        name: 'ember-eslint:node/cjs',
        files: [
          '**/*.cjs',
          ...(isTypeModule
            ? // when type=module, cjs files must have .cjs extensions
              []
            : [
                'config/**/*.js',
                'tests/dummy/config/**/*.js',
                'testem.js',
                'testem*.js',
                '.prettierrc.js',
                '.stylelintrc.js',
                '.template-lintrc.js',
                'ember-cli-build.js',
              ]),
        ],
        plugins: {
          n,
        },

        languageOptions: {
          sourceType: 'script',
          ecmaVersion: 'latest',
          globals: {
            ...globals.node,
          },
        },

        rules: {
          ...n.configs['flat/recommended-script'].rules,
          'node/no-unsupported-features': [
            'error',
            {
              version: '24',
              ignores: [],
            },
          ],
        },
      },
      /**
       * ESM node files
       * NOTE: the app/src directory is browser-land (typically)
       */
      {
        ...n.configs['flat/recommended-module'],
        name: 'ember-eslint:node/esm',
        files: [
          '**/*.mjs',
          'config/**/*',
          '.template-lintrc.js',
          '*.js',
          '*.mjs',
        ],
        plugins: {
          n,
        },

        languageOptions: {
          sourceType: 'module',
          ecmaVersion: 'latest',
          parserOptions: esm.js,
          globals: {
            ...globals.node,
          },
        },
        rules: {
          ...n.configs['flat/recommended-module'].rules,
          'node/no-unsupported-features': [
            'error',
            {
              version: '24',
              ignores: [],
            },
          ],
        },
      },
      /**
       * Since this config is dynamically created, we create null entries when a situation doesn't apply.
       * For example, we use `null` in the place where the TypeScript configs would go if a consumer isn't using TypeScript.
       */
    ].filter(Boolean)
  );
}
