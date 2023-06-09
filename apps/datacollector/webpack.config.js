module.exports = function (options) {
  return {
    ...options,
    // externals: [],
    output: {
      ...options.output,
      libraryTarget: 'commonjs2',
    },
    // ... the rest of the configuration
  };
};
