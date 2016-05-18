import React from 'react'
import { Route, IndexRoute } from 'react-router'
import cookie from 'react-cookie'
import { getTimestampFromParams } from './utils/utils'
import { logout } from './actions/auth'
import Diary from './components/Diary'
import Main from './components/Main'
import Preferences from './components/Preferences/Preferences'
import SignUpForm from './components/SignUpForm'
import SignInForm from './components/SignInForm'
import Statistics from './components/Statistics/Statistics'
import FoodList from './components/Food/FoodList'
import FoodDetail from './components/Food/FoodDetail'
import FoodDetailEdit from './components/Food/FoodDetailEdit'



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
    
    if(getTimestampFromParams(nextState.params) > new Date().setUTCHours(0,0,0,0)) replace('/predvolby');
  };

  return (
    <Route path="/" component={Main}>
      <IndexRoute component={Diary} onEnter={requireAuth} />
      <Route path="/jidelnicek/:date" component={Diary} onEnter={requireAuth} />
      <Route path="/statistika" component={Statistics} onEnter={requireAuth} />
      <Route path="/predvolby" component={Preferences} onEnter={requireAuth} />
      <Route path="/predvolby/:date" component={Preferences} onEnter={checkDate} />
      <Route path="/potraviny" component={FoodList} />
      <Route path="/potravina/:id" component={FoodDetail} />
      <Route path="/potravina/:id/editace" component={FoodDetailEdit} onEnter={requireAuth} />
      <Route path="/pridat-potravinu" component={FoodDetailEdit} onEnter={requireAuth} />
      <Route path="/registrace" component={SignUpForm} onEnter={noAuth} />
      <Route path="/prihlaseni" component={SignInForm} onEnter={noAuth} />
    </Route>
  )
};
