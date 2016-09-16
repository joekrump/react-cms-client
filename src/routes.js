import Page from './components/Pages/Page/Page';
import Dashboard from './components/Pages/Admin/Dashboard/Dashboard';
import SignUp from './components/Pages/Auth/SignUp/SignUp';
import UserSettings from './components/Pages/Admin/User/Settings/Settings';
import ForgotPassword from './components/Pages/Auth/ForgotPassword/ForgotPassword';
import PageNotFound from './components/Pages/Errors/404/404';
import App from './components/App';
import auth from './auth';
import { replace } from 'react-router-redux'
import APIClient from './http/requests'
import AdminRoutes from './routes/admin/routes'

/**
 * Returns the routes in the app
 * @param  {object} store - The redux store for the app`
 * @return {object}       - the routes for the app
 */
const getRoutes = (store) => {

  let routes = {
    path: '/',
    component: App,
    indexRoute: { component: Page },
    childRoutes: [
      { path: 'login', component: Page, onEnter: (nextState, replace) => allowLoginAccess(nextState, replace, store) },
      { path: 'signup', component: SignUp, onEnter: (nextState, replace) => allowSignupAccess(nextState, replace, store) },
      { path: 'forgot-password', component: ForgotPassword },
      { 
        path: 'admin',
        indexRoute: { component: Dashboard },
        onEnter: () => requireAuth(store),
        childRoutes: [
          { path: 'settings', component: UserSettings },
          AdminRoutes
        ]
      },
      // PageRoutes,
      { path: ':slug', component: Page},
      { path: '*', component: PageNotFound }
    ]
  }
  return routes;
}

export default getRoutes;

/**
 * Redirects user to /login if they try to access a route that should only be 
 * accessible to a user who is authenticated (logged in)
 * @return undefined
 */
function requireAuth(store) {
  if (!auth.loggedIn()) {
    store.dispatch(replace('/login'))
  }
}

/**
 * Allow user to access SignUp page, or redirect.
 * @return undefined
 */
function allowSignupAccess(nextState, replace, store) {
  getUserCount(store).then((count) => {
    if(count > 0) {
      store.dispatch(replace('/login'));
    }
  }).catch((error) => {
    console.warn('Error: ', error)
  })
}

/**
 * Check to see if /login should be accessible.
 * @return undefined
 */
function allowLoginAccess(nextState, replace, store) {

  if(auth.loggedIn()) {
    store.dispatch(replace('/admin'))
  } else {
    getUserCount(store).then((count) => {
      if(count === 0) {
        console.log('replace')
        store.dispatch(replace('/signup'));
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
function getUserCount(nextState, replace, store) {
  return new Promise((resolve, reject) => {
    let client = new APIClient(store);
    client.get('users/count', false)
    .then((res) => {
      if(res.statusCode !== 200) {
        reject(-1);
      } else {
        resolve(res.body.count);
      }
    })
    .catch((res) => {
      reject(-1);
    })
  })
}