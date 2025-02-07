import * as parserOptions from './parser-options.js';
import globals from 'globals';
import js from '@eslint/js';
import ts from 'typescript-eslint';

import ember from 'eslint-plugin-ember/recommended';

import prettier from 'eslint-config-prettier';
import qunit from 'eslint-plugin-qunit';
import n from 'eslint-plugin-n';
import { hasTypescript } from './utils.js';

import babelParser from '@babel/eslint-parser';

/**
 * @param {string} root the directory of the eslint config file. can be import.meta.dirname
 */
export function official(root) {
  let hasTS = hasTypescript(root);
  let esm = parserOptions.esm(root);

  return ts.config([
    js.configs.recommended,
    ember.configs.base,
    ember.configs.gjs,
    ember.configs.gts,
    prettier,
    /**
     * Ignores must be in their own object
     * https://eslint.org/docs/latest/use/configure/ignore
     */
    {
      ignores: ['dist/', 'node_modules/', 'coverage/', '!**/.*'],
    },
    /**
     * https://eslint.org/docs/latest/use/configure/configuration-files#configuring-linter-options
     */
    {
      linterOptions: {
        reportUnusedDisableDirectives: 'error',
      },
    },
    {
      files: ['**/*.js'],
      languageOptions: {
        parser: babelParser,
      },
    },
    {
      files: ['**/*.{js,gjs}'],
      languageOptions: {
        parserOptions: esm.js,
        globals: {
          ...globals.browser,
        },
      },
    },
    hasTS
      ? {
          files: ['**/*.{ts,gts}'],
          languageOptions: {
            parser: ember.parser,
            parserOptions: esm.ts,
          },
          extends: [...ts.configs.recommendedTypeChecked, ember.configs.gts],
        }
      : {},
    hasTS
      ? {
          files: ['tests/**/*-test.{js,gjs,ts,gts}'],
          plugins: {
            qunit,
          },
        }
      : {
          files: ['tests/**/*-test.{js,gjs}'],
          plugins: {
            qunit,
          },
        },
    /**
     * CJS node files
     */
    {
      files: [
        '**/*.cjs',
        'config/**/*.js',
        'testem.js',
        'testem*.js',
        '.prettierrc.js',
        '.stylelintrc.js',
        '.template-lintrc.js',
        'ember-cli-build.js',
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
    },
    /**
     * ESM node files
     */
    {
      files: ['**/*.mjs'],
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
    },
  ]);
}
