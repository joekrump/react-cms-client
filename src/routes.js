import About from './components/pages/About';
import Home from './components/pages/Home';
import Inbox from './components/pages/Inbox';
import PaymentPage from './components/pages/PaymentPage';
import Dashboard from './components/pages/admin/Dashboard';
import Login from './components/pages/Login';
import PageNotFound from './components/pages/404';
import App from './components/App';
import ReduxCounter from './components/pages/ReduxCounter';
import auth from './auth';

import AdminRoutes from './routes/admin/routes'

export const routes = {
  path: '/',
  component: App,
  indexRoute: { component: Home },
  childRoutes: [
    { path: 'about', component: About },
    { path: 'inbox', component: Inbox },
    { path: 'donate', component: PaymentPage },
    { path: 'login', component: Login, onEnter: requiredNotAuth },
    { path: 'redux-counter', component: ReduxCounter},
    { 
      path: 'admin',
      indexRoute: { component: Dashboard },
      onEnter: requireAuth,
      childRoutes: [
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
    replace({
      pathname: '/login',
      state: { nextPathname: nextState.location.pathname }
    })
  }
}

// redirects user to /admin if they try to access a route that should only be 
// accessible to a user who is not logged in.
// 
function requiredNotAuth(nextState, replace) {
  console.log('LOGGED IN, REDIRECTING...');
  if(auth.loggedIn()) {
    replace({
      pathname: '/admin', 
      state: { nextPathname: nextState.location.pathname }
    })
  }
}