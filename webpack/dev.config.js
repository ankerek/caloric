var path = require('path');
var webpack = require('webpack');

const host = process.env.HOST || 'localhost';
const port = (process.env.PORT + 1) || 3001;

module.exports = {
  devtool: 'cheap-module-eval-source-map',
  entry: [
    //'react-hot-loader/patch',
    'webpack-dev-server/client?http://' + host + ':' + port,
    'webpack/hot/only-dev-server',
    './src/main',
    //'./src/stylesheets/main.scss'
  ],
  output: {
    path: path.join(__dirname, '..', 'dist'),
    filename: 'bundle.js',
    publicPath: 'http://' + host + ':' + port + '/dist/'
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoErrorsPlugin(),
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
        loader: 'react-hot!babel',
        include: path.join(__dirname, '..', 'src'),
        // query: {
        //   presets: ['react-hmre']
        // }
      },
      { test: /\.css$/, loader: 'style!css' },
      { test: /\.scss$/, loader: 'style!css!sass?includePaths[]=' + path.resolve(__dirname, '..', './node_modules/compass-mixins/lib')},
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
