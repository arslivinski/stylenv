'use strict';

const OFF = 'off';
const ERROR = 'error';

module.exports = {
  root: true,
  reportUnusedDisableDirectives: true,
  overrides: [
    {
      files: ['*.js'],
      excludedFiles: 'extension/**/*.js',
      env: {
        node: true,
      },
      parserOptions: {
        sourceType: 'script',
      },
      extends: ['@arslivinski/eslint-config'],
      rules: {
        'no-console': OFF,
        'import/no-commonjs': OFF,
        'import/no-extraneous-dependencies': [
          ERROR,
          {
            devDependencies: true,
            optionalDependencies: true,
            peerDependencies: true,
          },
        ],
        'import/no-nodejs-modules': OFF,
        'unicorn/prefer-module': OFF,
        'unicorn/prefer-top-level-await': OFF, // Top-level await is for ES modules
      },
    },
    {
      files: ['extension/**/*.js'],
      env: {
        browser: true,
      },
      globals: {
        chrome: 'readonly',
      },
      extends: ['@arslivinski/eslint-config'],
      rules: {
        'no-console': OFF,
        'unicorn/prefer-top-level-await': OFF, // Not available for extensions
      },
      overrides: [
        {
          files: ['extension/themes/**/*.js'],
          env: {
            browser: true,
          },
          parserOptions: {
            sourceType: 'script',
          },
          extends: ['@arslivinski/eslint-config'],
          rules: {
            'no-console': OFF,
            'unicorn/prefer-module': OFF,
            'unicorn/prefer-top-level-await': OFF, // Not available for extensions
          },
        },
      ],
    },
  ],
};
