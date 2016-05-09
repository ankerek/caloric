var path = require('path');
var webpack = require('webpack');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var strip = require("strip-loader");
var StatsWriterPlugin = require("webpack-stats-plugin").StatsWriterPlugin;

const host = process.env.HOST || 'localhost';
const port = (process.env.PORT) || 8080;

module.exports = {
  devtool: 'source-map',
  entry: [
    './src/main',
    //'./src/stylesheets/main.scss'
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
      { test: /\.scss$/, loader: ExtractTextPlugin.extract('style', 'css!sass?includePaths[]=' + path.resolve(__dirname, '..', './node_modules/compass-mixins/lib'))}

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

    // Write out stats.json file to build directory.
    // new StatsWriterPlugin({
    //   transform: function (data) {
    //     return {
    //       main: data.assetsByChunkName.main[0],
    //       css: data.assetsByChunkName.main[1]
    //     };
    //   }
    // })
    

    
  ],
  node: {
    net: 'empty',
    tls: 'empty',
    dns: 'empty'
  }
};
