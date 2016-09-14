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

// Routes for the app
export const routes = {
  path: '/',
  component: App,
  indexRoute: { component: Home },
  childRoutes: [
    { path: 'about', component: About },
    { path: 'donate', component: DonationPage },
    { path: 'login', component: Login, /*onEnter: allowLoginAccess*/ },
    { path: 'signup', component: SignUp, /*onEnter: allowSignupAccess*/ },
    { path: 'forgot-password', component: ForgotPassword },
    { 
      path: 'admin',
      indexRoute: { component: Dashboard },
      /*onEnter: requireAuth,*/
      childRoutes: [
        { path: 'settings', component: UserSettings },
        AdminRoutes
      ]
    },
    { path: '*', component: PageNotFound }
  ]
}

export default routes;


/**
 * Redirects user to /login if they try to access a route that should only be 
 * accessible to a user who is authenticated (logged in)
 * @return undefined
 */
// function requireAuth(param1, param2, param3) {
//   console.log(param1);
//   console.log(param2);
//   console.log(param3);
//   if (!auth.loggedIn()) {
//     // console.log('NOT LOGGED IN, REDIRECTING...');
//     store.dispatch(replace('/login'))
//   }
// }

/**
 * Allow user to access SignUp page, or redirect.
 * @return undefined
 */
// function allowSignupAccess(param1, param2, param3) {
//   console.log(param1, param2, param3)
//   getUserCount(store).then((count) => {
//     if(count > 0) {
//       store.dispatch(replace('/login'));
//     }
//   }).catch((error) => {
//     console.warn('Error: ', error)
//   })
// }


/**
 * Check to see if /login should be accessible.
 * @return undefined
 */
// function allowLoginAccess(param1, param2, param3) {
//   console.log(param1, param2, param3)

//   if(auth.loggedIn()) {
//     store.dispatch(replace('/admin'))
//   } else {
//     getUserCount(store).then((count) => {
//       if(count === 0) {
//         console.log('replace')
//         store.dispatch(replace('/signup'));
//       }
//     }).catch((error) => {
//       console.log('Error: ', error)
//     })
//   }
// }

/**
 * Return a Promise that will be resolved once GET request for 
 * user count is completed.
 * @return Promise
 */
// function getUserCount(param1, param2, param3) {
//   console.log(param1, param2, param3)
//   return new Promise((resolve, reject) => {
//     let client = new APIClient(store);
//     client.get('users/count', false)
//       .end(function(err, res) {
//         if(err){
//           reject(-1);
//         } else if(res.statusCode !== 200) {
//           reject(-1);
//         } else {
//           resolve(res.body.count);
//         }
//       })
//   })
// }