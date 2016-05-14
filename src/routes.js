import React from 'react'
import { Route, IndexRoute, createRoutes } from 'react-router'
import cookie from 'react-cookie'
import { getTimestampFromParams } from './utils/utils'
import { logout } from './actions/auth'
import Diary from './components/Diary'
import Main from './components/Main'
import Settings from './components/Settings'
import Preferences from './components/Preferences/Preferences'
import SignUpForm from './components/SignUpForm'
import SignInForm from './components/SignInForm'
import Statistics from './components/Statistics/Statistics'
import FoodList from './components/Food/FoodList'
import FoodDetail from './components/Food/FoodDetail'
import FoodDetailEdit from './components/Food/FoodDetailEdit'


// const routes = (
//   <Route path="/" component={Main}>
//     <Route requireAuth>
//       <IndexRoute component={Diary} />
//       <Route path="/jidelnicek/:date" component={Diary} />
//       <Route path="/statistika" component={Statistics} />
//       <Route path="/nastaveni" component={Settings}>
//         <Route path="predvolby/:date" component={Preferences} />
//       </Route>
//     </Route>
//     <Route path="/potraviny" component={FoodList} />
//     <Route path="/pridat-potravinu" component={FoodDetailEdit} />
//     <Route path="/potravina/:id" component={FoodDetail} />
//     <Route path="/potravina/:id/editace" component={FoodDetailEdit} />
//     <Route noAuth>
//       <Route path="/registrace" component={SignUpForm} />
//       <Route path="/prihlaseni" component={SignInForm} />
//     </Route>
//   </Route>
// );

// function walk(routes, cb) {
//   cb(routes);

//   if (routes.childRoutes) {
//     routes.childRoutes.forEach(route => walk(route, cb));
//   }

//   return routes;
// }


export default (store) => {

  const requireAuth = (nextState, replace) => {
    const {auth} = store.getState();
    const token = auth.get('token');

    if ( process.env.BROWSER && cookie.load('token') !== token ) {
      store.dispatch(logout());
      replace('/prihlaseni');
    } else if( !auth || !token ) replace('/prihlaseni');
  };

  const noAuth = (nextState, replace) => {

    const {auth} = store.getState();

    if (auth && auth.get('token')) replace('/');
  };

  const checkDate = (nextState, replace) => {
    requireAuth(nextState, replace);
    
    if(getTimestampFromParams(nextState.params) > new Date().setUTCHours(0,0,0,0)) replace('/nastaveni/predvolby');
  };

  // const assignOnEnter = (route, onEnter) => {
    
  //   if(route.indexRoute) route.indexRoute.onEnter = onEnter;

  //   if(route.childRoutes) route.childRoutes.forEach(childRoute => assignOnEnter(childRoute, onEnter));
  //   else route.onEnter = onEnter;
    
  //   return route;
  // }

  // return walk(createRoutes(routes), route => {
  //   if(route.requireAuth) assignOnEnter(route, requireAuth);
  //   else if(route.noAuth) assignOnEnter(route, noAuth);
  // });
  return (
    <Route path="/" component={Main}>
      <IndexRoute component={Diary} onEnter={requireAuth} />
      <Route path="/jidelnicek/:date" component={Diary} onEnter={requireAuth} />
      <Route path="/statistika" component={Statistics} onEnter={requireAuth} />
      <Route path="/nastaveni" component={Settings} onEnter={requireAuth}>
        <Route path="predvolby" component={Preferences} onEnter={requireAuth} />
        <Route path="predvolby/:date" component={Preferences} onEnter={checkDate} />
      </Route>
      <Route path="/potraviny" component={FoodList} />
      <Route path="/potravina/:id" component={FoodDetail} />
      <Route path="/potravina/:id/editace" component={FoodDetailEdit} onEnter={requireAuth} />
      <Route path="/pridat-potravinu" component={FoodDetailEdit} onEnter={requireAuth} />
      <Route path="/registrace" component={SignUpForm} onEnter={noAuth} />
      <Route path="/prihlaseni" component={SignInForm} onEnter={noAuth} />
    </Route>
  )
};
