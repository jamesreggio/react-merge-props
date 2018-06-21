module.exports = {
  ignore: ['**/*.test.js'],
  presets: [
    [
      require('@babel/preset-env'),
      {
        targets: {
          // For React Native.
          ios: '10',

          // For React server-side rendering.
          node: 'current',

          // For support of evergreens, IE11, and Safari 9.1 onward.
          // http://browserl.ist/?q=cover+95%25+in+US
          browsers: ['cover 95% in US'],
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
