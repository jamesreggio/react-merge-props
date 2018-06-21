module.exports = {
  parser: 'babel-eslint',
  extends: ['airbnb-base', 'prettier'],
  rules: {
    'no-nested-ternary': 0,
    'no-param-reassign': 0,
    'no-plusplus': 0,
    'no-shadow': 0,
    'no-use-before-define': [2, {variables: false}],
    'spaced-comment': 0,
    'import/extensions': 0,
    'import/first': 0,
    'import/prefer-default-export': 0,
  },
};
