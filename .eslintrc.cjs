/** @type {import('eslint').Linter.Config} */
module.exports = {
    parser: '@typescript-eslint/parser',
    overrides: [
        {
            files: ['*.ts', '*.tsx'],
            parserOptions: {
                ecmaVersion: 6,
                ecmaFeatures: {
                    jsx: true,
                },
                project: './tsconfig.json',
                tsconfigRootDir: './',
            },
        },
    ],
    settings: {
        react: {
            pragma: 'React',
            version: 'detect',
        },
        linkComponents: [
            { name: 'Link', linkAttribute: 'to' },
            { name: 'NavLink', linkAttribute: 'to' },
        ],
    },
    env: {
        browser: true,
        es6: true,
        node: true,
    },
    plugins: ['react', 'react-hooks', 'prettier', '@typescript-eslint'],
    extends: [
        // 'standard',
        'eslint:recommended',
        'plugin:react/recommended',
        'plugin:react/jsx-runtime',
        'plugin:@typescript-eslint/recommended',
    ],
    rules: {
        '@typescript-eslint/no-var-requires': 0,
        '@typescript-eslint/ban-ts-comment': 0,
        'prettier/prettier': [
            'warn',
            {
                endOfLine: 'auto',
            },
            { usePrettierrc: true },
        ],
        // TypeScript can infer this significantly better than eslint ever can.
        'react/prop-types': 0,
        'react/display-name': 0,
        'react/no-unknown-property': ['error', { ignore: ['css'] }],
        '@typescript-eslint/no-explicit-any': 0,
        '@typescript-eslint/no-non-null-assertion': 0,
        // This setup is required to avoid a spam of errors when running eslint about React being
        // used before it is defined.
        //
        // @see https://github.com/typescript-eslint/typescript-eslint/blob/master/packages/eslint-plugin/docs/rules/no-use-before-define.md#how-to-use
        'no-use-before-define': 0,
        '@typescript-eslint/no-use-before-define': 'warn',
        '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_', varsIgnorePattern: '^_' }],
    },
};
