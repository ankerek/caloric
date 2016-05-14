var path = require('path');
var webpack = require('webpack');
var config = require('../src/config');

const port = config.port + 1;

module.exports = {
  devtool: 'cheap-module-eval-source-map',
  entry: [
    'react-hot-loader/patch',
    'webpack-dev-server/client?http://' + config.host + ':' + port,    
    'webpack/hot/only-dev-server',
    'font-awesome-webpack!./src/theme/font-awesome.config.js',
    './src/main',
  ],
  output: {
    path: path.join(__dirname, '..', 'dist'),
    filename: 'bundle.js',
    publicPath: 'http://' + config.host + ':' + port + '/dist/'
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.DefinePlugin({
      'process.env': {
        'NODE_ENV': JSON.stringify('development'),
        'BROWSER': JSON.stringify(true)
      }
    }),
  ],
  module: {
    loaders: [
      {
        test: /\.jsx?/,
        loader: 'babel',
        include: path.join(__dirname, '..', 'src'),
      },
      { test: /\.css$/, loader: 'style!css' },
      { test: /\.scss$/, loader: 'style!css!sass?includePaths[]=' + path.resolve(__dirname, '..', './node_modules/compass-mixins/lib')},
      { test: /\.less$/, loader: 'style!css!less' },
      {
        test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        loader: 'url-loader?limit=10000&mimetype=application/font-woff'
      },
      {
        test: /\.(ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        loader: 'file-loader'
      }

    ]
  },
  node: {
    net: 'empty',
    tls: 'empty',
    dns: 'empty'
  }
};
