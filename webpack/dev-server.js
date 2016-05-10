import webpack from 'webpack'
import WebpackDevServer from 'webpack-dev-server'
import webpackConfig from './dev.config'
import config from '../src/config'

const port = config.port + 1;


const options = {
  publicPath: webpackConfig.output.publicPath,
  hot: true,
  historyApiFallback: true,
  stats: { 
    colors: true,
    chunks: false
  },
  // proxy: {
  //   '*': 'http://localhost:3000'
  // }
};

const compiler = webpack(webpackConfig);
const webpackDevServer = new WebpackDevServer(compiler, options);
    
webpackDevServer.listen(port, config.host, () => {
  console.log(`Webpack dev server started: http://${config.host}:${port}/`);
});

