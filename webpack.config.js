const path = require('path');
module.exports = {
  mode: 'production',
  entry: './src/couchbase-info.js',
  output: {
    path: path.resolve(__dirname, './dist'),
    filename: 'couchbase-info.js',
    library: 'topology-ui',
    libraryTarget: 'umd',
    globalObject: 'this',
  },
  module: {
    rules: [{
      test: /\.js$/,
      exclude: /(node_modules)/,
      use: 'babel-loader',
    }],
  },
};

