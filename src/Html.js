import React, { Component } from 'react';
import ReactDOM from 'react-dom/server';
import Helmet from 'react-helmet';

let script;
if(process.env.NODE_ENV === 'development') {
  const config = require('../webpack/dev.config');
  script = `${config.output.publicPath}${config.output.filename}`;
} else script = '/dist/bundle.js';

// const config = process.env.NODE_ENV === 'production' ? require('../webpack/prod.config') : require('../webpack/dev.config');
// const script = `${config.output.publicPath}${config.output.filename}`;

export default class Html extends Component {

  render() {
    const { component, store } = this.props;
    const content = component ? ReactDOM.renderToString(component) : '';
    const head = Helmet.rewind();

    return (
      <html lang="cs">
        <head>
          {head.base.toComponent()}
          {head.title.toComponent()}
          {head.meta.toComponent()}
          {head.link.toComponent()}
          {head.script.toComponent()}

          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <link href="/bootstrap.min.css" rel="stylesheet" type="text/css" charSet="UTF-8"/>
          {process.env.NODE_ENV === 'production' && <link href="/dist/bundle.css" rel="stylesheet" type="text/css" charSet="UTF-8"/>}

        </head>
        <body>
          <div id="main" dangerouslySetInnerHTML={{__html: content}}/>
          <script dangerouslySetInnerHTML={{__html: `window.__INITIAL_STATE__=${JSON.stringify(store.getState())};`}} charSet="UTF-8"/>
          <script src={script} charSet="UTF-8"/>

        </body>
      </html>
    );
  }
}
