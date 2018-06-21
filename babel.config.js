module.exports = {
  presets: [
    [
      require('@babel/preset-env'),
      {
        targets: {
          ios: '10',
          node: 'current',
          browsers: ['>0.25%', 'not ie 11', 'not op_mini all'],
        },
      },
    ],
    [
      require('@babel/preset-stage-1'),
      {
        decoratorsLegacy: true,
      },
    ],
    require('@babel/preset-react'),
  ],
};
