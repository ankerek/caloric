var path = require('path');
var webpack = require('webpack');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var strip = require("strip-loader");


module.exports = {
  devtool: 'source-map',
  entry: [
    './src/main',
    'font-awesome-webpack!./src/theme/font-awesome.config.prod.js'
  ],
  output: {
    path: path.join(__dirname, '../static/dist'),
    filename: 'bundle.js',
    publicPath: '/dist/'
  },
  
  module: {
    loaders: [
      {
        test: /\.jsx?/,
        loaders: [strip.loader('debug'), 'babel'],
        include: path.join(__dirname, '..', 'src'),
      },
      { test: /\.css$/, loader: 'style!css' },
      { test: /\.scss$/, loader: ExtractTextPlugin.extract('style', 'css!sass?includePaths[]=' + path.resolve(__dirname, '..', './node_modules/compass-mixins/lib'))},
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
  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        'NODE_ENV': JSON.stringify('production'),
        'BROWSER': JSON.stringify(true)
      }
    }),
    new ExtractTextPlugin('bundle.css'),
    // optimizations
    new webpack.optimize.DedupePlugin(),
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false
      }
    }),
    

    
  ],
  node: {
    net: 'empty',
    tls: 'empty',
    dns: 'empty'
  }
};
