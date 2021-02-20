const path = require('path');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

module.exports = {
  entry: './src/index.js',
  devtool: 'inline-source-map',
  devServer: {
    contentBase: './example',
  },
  plugins: [
    new CleanWebpackPlugin()
  ],
  output: {
    filename: 'MyVue.js',
    path: path.resolve(__dirname, 'lib'),
  },
};