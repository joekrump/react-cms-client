import About from './components/pages/About';
import Home from './components/pages/Home';
import Inbox from './components/pages/Inbox';
import PaymentPage from './components/pages/PaymentPage';
import Dashboard from './components/pages/admin/Dashboard';
import Login from './components/pages/Login';
import SignUp from './components/pages/SignUp';
import UserSettings from './components/Admin/UserSettings';
import PageNotFound from './components/pages/404';
import App from './components/App';
import auth from './auth';
import { replace } from 'react-router-redux'
import { store } from './store'
import { apiGet } from './http/requests'

import AdminRoutes from './routes/admin/routes'

export const routes = {
  path: '/',
  component: App,
  indexRoute: { component: Home },
  childRoutes: [
    { path: 'about', component: About },
    { path: 'inbox', component: Inbox },
    { path: 'donate', component: PaymentPage },
    { path: 'login', component: Login, onEnter: allowLoginAccess },
    { path: 'signup', component: SignUp, onEnter: allowSignupAccess },
    { 
      path: 'admin',
      indexRoute: { component: Dashboard },
      onEnter: requireAuth,
      childRoutes: [
        { path: 'settings', component: UserSettings },
        AdminRoutes
      ]
    },
    { path: '*', component: PageNotFound }
  ]
}


// redirects user to /login if they try to access a route that should only be 
// accessible to a user who is authenticated (logged in)
// 
function requireAuth(nextState, replace) {
  if (!auth.loggedIn()) {
    console.log('NOT LOGGED IN, REDIRECTING...');
    replace({ nextPathname: nextState.location.pathname }, '/login')
  }
}
function allowSignupAccess() {
  getUserCount().then((count) => {
    if(count > 0) {
      console.log('replace')
      store.dispatch(replace('/login'));
    }
  }).catch((error) => {
    console.log('Error: ', error)
  })
}


/**
 * Check to see if /login should be accessible.
 * @param  {[type]} nextState [description]
 * @param  {[type]} replace   [description]
 * @return undefined
 */
function allowLoginAccess() {

  if(auth.loggedIn()) {
    replace('/admin')
  } else {
    getUserCount().then((count) => {
      if(count === 0) {
        console.log('replace')
        dispatch(replace('/signup'));
      }
    }).catch((error) => {
      console.log('Error: ', error)
    })
  }
}

/**
 * Return a Promise that will be resolved once GET request for 
 * user count is completed.
 * @return Promise
 */
function getUserCount(){
  return new Promise((resolve, reject) => {
    apiGet('users/count', false)
      .end(function(err, res) {
        if(err){
          reject(-1);
        } else if(res.statusCode !== 200) {
          reject(-1);
        } else {
          resolve(res.body.count);
        }
      })
  })
}