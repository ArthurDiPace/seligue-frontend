module.exports = {
    root: true,
    env: {
      node: true
    },
    'extends': [
      'plugin:vue/recommended',
      'eslint:recommended'
    ],
    parserOptions: {
      parser: '@babel/eslint-parser'
    },
    rules: {
      'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
      'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
      'vue/require-prop-types': 0,
      'vue/require-default-prop': 0,
      'vue/no-v-html': 0
    }
   }
   