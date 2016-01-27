// https://christianalfoni.github.io/react-webpack-cookbook/Structuring-configuration.html

var path = require('path');
var node_modules_dir = path.resolve(__dirname, 'node_modules');

var config = {
  entry: path.resolve(__dirname, 'app/main.js'),
  output: {
    path: path.resolve(__dirname, 'build'),
    filename: 'bundle.js'
  },
  module: {
    loaders: [
    {
      test: /\.js$/,

      // There is not need to run the loader through
      // vendors
      exclude: [node_modules_dir],
      loader: 'babel'
    },
    {
        test: /\.jsx$/,
        loaders: ['react-hot', 'babel', 'babel-loader'],
        include: path.join(__dirname, 'src')
      },
      {
        test: /\.html$/,
        loader: "file?name=[name].[ext]"
      },
      {
        test: /\.scss$/, 
        loader: 'style!css!autoprefixer?browsers=last 2 version!sass?outputStyle=expanded'
      }
    ]
  }
};

module.exports = config;