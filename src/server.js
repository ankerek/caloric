import 'babel-polyfill';

import express from 'express'
import path from 'path'
import logger from 'morgan'
import cookieParser from 'cookie-parser'
import bodyParser from 'body-parser'
import mongoose from 'mongoose'

import apiRoutes from './api'
import config from './config'
import React from 'react'
import ReactDOM from 'react-dom/server'
import { RouterContext, match } from 'react-router'
import { Provider } from 'react-redux'
import routes from './routes'
import configureStore from './utils/configureStore'
import { isDateStringValid } from './utils/utils'
import Html from './Html'


  const app = express();

  console.log(config.mongodb);

  mongoose.connect(config.mongodb);
  mongoose.connection.on('error', function() {
    console.info('Error: Could not connect to MongoDB. Did you forget to run `mongod`?');
  });



  // uncomment after placing your favicon in /public
  //app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
  app.use(logger('dev'));
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(cookieParser());




  app.use(express.static(path.join(__dirname, '..', 'static')));



  app.use('/api', apiRoutes);


  app.use(function(req, res) {

    const token = req.cookies.token;

    const store = configureStore( { auth: { token } } );

    match({ routes: routes(store), location: req.url }, ( error, redirectLocation, renderProps ) => {

      if ( redirectLocation ) {
        return res.redirect( 301, redirectLocation.pathname + redirectLocation.search );
      } else if ( error ) {
        console.log( 'error: ', error)
        return res.status(500).send( error.message );
      } else if ( renderProps == null ) {
        res.status(404).json( 'Stránka nenalezena' );
        //next();
      } else {

        getReduxPromise().then(() => {
          const component = (
            <Provider store={store}>
              <RouterContext {...renderProps} />
            </Provider>
          );
       
          res.send('<!doctype html>\n' + ReactDOM.renderToString(<Html component={component} store={store}/>));
        })
        .catch(err => res.status(404).json( 'Stránka nenalezena' ));

        function getReduxPromise () {
          const { query, params } = renderProps;

          if(params && params.date) if(!isDateStringValid(params.date)) res.status(404).json( 'Not found' );

          const baseUrl = req.protocol + '://' + req.get('host');

          //let comp = renderProps.components[renderProps.components.length - 1].WrappedComponent;
          const comps = renderProps.components.map(comp => comp && comp.WrappedComponent ? comp.WrappedComponent : null);

          const promises = comps.map(comp => comp && comp.fetchData ? comp.fetchData({ query, params, store, baseUrl, comp }) : Promise.resolve() );
          

          //let promise = comp && comp.fetchData ? comp.fetchData({ query, params, store, baseUrl }) : Promise.resolve();
          //return promise;
          return Promise.all(promises);
        }

      }
    });

  });


  app.use(function(err, req, res, next) { // eslint-disable-line no-unused-vars
    console.log(err);
    return res.status(err.status || 500).json('Něco se pokazilo');
  });

  app.listen(config.port, function() {
    console.log(`Server started: http://${config.host}:${config.port}/`);
  });

  if(app.get('env') === 'development') {
    require('../webpack/dev-server');
  }
  //return app.listen(3000, () => callback(app));
//}


//module.exports = app;