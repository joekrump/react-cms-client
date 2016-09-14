import About from './components/Pages/About/About';
import Home from './components/Pages/Home/Home';
import DonationPage from './components/Pages/Payments/DonationPage/DonationPage';
import Dashboard from './components/Pages/Admin/Dashboard/Dashboard';
import Login from './components/Pages/Auth/Login/Login';
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
    indexRoute: { component: Home },
    childRoutes: [
      { path: 'about', component: About },
      { path: 'donate', component: DonationPage },
      { path: 'login', component: Login, onEnter: (event) => allowLoginAccess(event, store) },
      { path: 'signup', component: SignUp, onEnter: (event) => allowSignupAccess(event, store) },
      { path: 'forgot-password', component: ForgotPassword },
      { 
        path: 'admin',
        indexRoute: { component: Dashboard },
        onEnter: (event) => requireAuth(event, store),
        childRoutes: [
          { path: 'settings', component: UserSettings },
          AdminRoutes
        ]
      },
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
function requireAuth(event, store) {
  if (!auth.loggedIn()) {
    // console.log('NOT LOGGED IN, REDIRECTING...');
    store.dispatch(replace('/login'))
  }
}

/**
 * Allow user to access SignUp page, or redirect.
 * @return undefined
 */
function allowSignupAccess(event, store) {
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
function allowLoginAccess(event, store) {

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
function getUserCount(event, store) {
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