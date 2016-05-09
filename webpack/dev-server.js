import webpack from 'webpack'
import WebpackDevServer from 'webpack-dev-server'
import config from './dev.config'

const host = process.env.HOST || 'localhost';
const port = (process.env.PORT + 1) || 3001;


const options = {
  publicPath: config.output.publicPath,
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

const compiler = webpack(config);
const webpackDevServer = new WebpackDevServer(compiler, options);
    
webpackDevServer.listen(port, host, () => {
  console.log(`Webpack dev server started: http://${host}:${port}/`);
});

