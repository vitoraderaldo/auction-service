module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: 'tsconfig.json',
    tsconfigRootDir: __dirname,
    sourceType: 'module',
  },
  plugins: [
    '@typescript-eslint/eslint-plugin',
    "jest",
  ],
  extends: [
    'plugin:@typescript-eslint/recommended',
    //'plugin:prettier/recommended',
    'airbnb-base',
    'airbnb-typescript/base',
    'plugin:import/typescript',
  ],
  root: true,
  env: {
    node: true,
    jest: true,
  },
  ignorePatterns: ['.eslintrc.js'],
  rules: {
    '@typescript-eslint/interface-name-prefix': 'off',
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/no-explicit-any': 'off',

    "jest/no-disabled-tests": "error",
    "jest/no-focused-tests": "error",
    "jest/no-identical-title": "error",
    "jest/prefer-to-have-length": "error",
    "jest/valid-expect": "error"
  },
  overrides: [
    {
      files: ['**/*.spec.ts'],
      rules: {
        'import/no-extraneous-dependencies': [
          'error',
          { devDependencies: true},
        ],
        'no-new': 'off',
      },
    },
    {
      files: ['**/*.guard.ts'],
      rules: {
        'class-methods-use-this': 'off',
      },
    },
  ]
};
