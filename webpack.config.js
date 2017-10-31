const path = require('path');

module.exports = {
  entry: './src/index.js',
  output: {
    filename: 'index.js',
    path: path.resolve(__dirname, 'dist')
  },
  module: {
    loaders: [
      { test: /\.js/, exclude: [/app\/lib/, /node_modules/], loader: 'babel-loader' },
    ],
  },
  stats: {
    colors: true
  },
  devtool: 'source-map'
};
