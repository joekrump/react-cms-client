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
import request from 'superagent';
import AppConfig from '../app_config/app'

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
function allowSignupAccess(nextState, replace) {

}

function allowLoginAccess(nextState, replace) {
  requiredNotAuth(nextState, replace)
}
// redirects user to /admin if they try to access a route that should only be 
// accessible to a user who is not logged in.
// 
function requiredNotAuth(nextState, replace) {

  if(auth.loggedIn()) {
    replace({ nextPathname: nextState.location.pathname }, '/admin')
  } else if(! requireUsersExist()){
    console.log('no users');
    replace({ nextPathname: nextState.location.pathname }, '/signup')
  }
}

function requireUsersExist(){  
  request.get(AppConfig.apiBaseUrl + 'users/count')
    .end(function(err, res) {
      if(err){
        console.log(res);
        return 0;
      } else if(res.statusCode !== 200) {
        console.log(res);
        return 0;
      } else {
        return res.body.count;
      }
    })
}