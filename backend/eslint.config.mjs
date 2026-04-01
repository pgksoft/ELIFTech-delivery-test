import parser from '@typescript-eslint/parser';
import tsPlugin from '@typescript-eslint/eslint-plugin';
import prettier from 'eslint-plugin-prettier';
import importPlugin from 'eslint-plugin-import';

export default [
  {
    ignores: ['dist/**', 'dist-tests/**', 'node_modules/**'],
  },
  {
    files: ['src/**/*.{ts,tsx}'],
    languageOptions: {
      parser,
      parserOptions: {
        ecmaVersion: 2020,
        sourceType: 'module',
      },
      globals: {
        node: true,
        es2021: true,
      },
    },
    // will understand aliases (@api/*, @domain/*, …) and correctly build a dependency graph
    settings: {
      'import/resolver': {
        typescript: {
          project: './tsconfig.json',
        },
      },
    },
    plugins: {
      '@typescript-eslint': tsPlugin,
      prettier,
      import: importPlugin,
    },
    rules: {
      // 🔧 general rules
      'prettier/prettier': 'error',
      'no-console': 'warn',
      'no-unused-vars': 'off',
      '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],

      // 🔧 TS-specific
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/consistent-type-imports': 'error',

      // 🚨
      'import/no-cycle': ['error', { maxDepth: 1 }],
    },
  },
  {
    files: ['tests/**/*.ts'],
    env: { mocha: true },
    rules: {
      '@typescript-eslint/no-unused-expressions': 'off', // for chai.expect(...)
    },
  },
];
