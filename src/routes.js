import About from './components/pages/About';
import Home from './components/pages/Home';
import Inbox from './components/pages/Inbox';
import PaymentPage from './components/pages/PaymentPage';
import Dashboard from './components/pages/admin/Dashboard';
import Login from './components/pages/Login';
import Logout from './components/pages/Logout';
import App from './components/App';
import ReduxCounter from './components/ReduxCounter';
import auth from './auth';

import UserRoutes from './routes/users/UserRoutes'

export const routes = {
  path: '/',
  component: App,
  indexRoute: { component: Home },
  childRoutes: [
    { path: 'about', component: About },
    { path: 'inbox', component: Inbox },
    { path: 'donate', component: PaymentPage },
    { path: 'login', component: Login, onEnter: requiredNotAuth },
    { path: 'logout', component: Logout },
    { path: 'redux-counter', component: ReduxCounter},
    { 
      path: 'admin',
      indexRoute: { component: Dashboard },
      onEnter: requireAuth,
      childRoutes: [
        UserRoutes
      ]
    }
  ]
}


// redirects user to /login if they try to access a route that should only be 
// accessible to a user who is authenticated (logged in)
// 
function requireAuth(nextState, replace) {
  if (!auth.loggedIn()) {
    replace({
      pathname: '/login',
      state: { nextPathname: nextState.location.pathname }
    })
  }
}

// redirects user to /dashboard if they try to access a route that should only be 
// accessible to a user who is not logged in.
// 
function requiredNotAuth(nextState, replace) {
  if(auth.loggedIn()) {
    replace({
      pathname: '/admin', 
      state: { nextPathname: nextState.location.pathname }
    })
  }
}