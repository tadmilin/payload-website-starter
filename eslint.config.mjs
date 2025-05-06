import { dirname } from 'path'
import { fileURLToPath } from 'url'
import { FlatCompat } from '@eslint/eslintrc'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const compat = new FlatCompat({
  baseDirectory: __dirname,
})

const eslintConfig = [
  ...compat.extends(
    'next/core-web-vitals',
    'next/typescript',
    'plugin:import/recommended',
    'plugin:import/typescript',
  ),
  {
    rules: {
      // TypeScript
      '@typescript-eslint/ban-ts-comment': 'warn',
      '@typescript-eslint/no-empty-object-type': 'warn',
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/no-unused-vars': [
        'warn',
        {
          vars: 'all',
          args: 'after-used',
          ignoreRestSiblings: false,
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          destructuredArrayIgnorePattern: '^_',
          caughtErrorsIgnorePattern: '^(_|ignore)',
        },
      ],
      '@typescript-eslint/consistent-type-imports': [
        'warn',
        {
          prefer: 'type-imports',
          disallowTypeAnnotations: false,
        },
      ],
      '@typescript-eslint/no-misused-promises': 'warn',

      // React
      'react-hooks/exhaustive-deps': 'warn',
      'react/jsx-no-useless-fragment': 'warn',
      'react/no-array-index-key': 'warn',
      'react/jsx-sort-props': [
        'warn',
        {
          callbacksLast: true,
          shorthandFirst: true,
          ignoreCase: true,
          reservedFirst: true,
        },
      ],

      // Next.js
      '@next/next/no-img-element': 'off',
      '@next/next/no-html-link-for-pages': 'warn',

      // Import
      'import/no-anonymous-default-export': 'off',
      'import/order': [
        'warn',
        {
          'newlines-between': 'always',
          alphabetize: { order: 'asc', caseInsensitive: true },
          groups: [
            'builtin',
            'external',
            'internal',
            'parent',
            'sibling',
            'index',
            'object',
            'type',
          ],
        },
      ],

      // ทั่วไป
      'no-console': ['warn', { allow: ['warn', 'error', 'info'] }],
      camelcase: ['warn', { properties: 'never' }],
    },
  },
  {
    ignores: ['.next/', 'dist/', 'build/', 'node_modules/'],
  },
]

export default eslintConfig
