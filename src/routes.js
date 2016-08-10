import About from './components/pages/About';
import Home from './components/pages/Home';
import Inbox from './components/pages/Inbox';
import PaymentPage from './components/pages/PaymentPage';
import Dashboard from './components/pages/admin/Dashboard';
import Login from './components/pages/Login';
import UserSettings from './components/Admin/UserSettings';
import PageNotFound from './components/pages/404';
import App from './components/App';
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
    { 
      path: 'admin',
      indexRoute: { component: Dashboard },
      onEnter: requireAuth,
      childRoutes: [
        AdminRoutes,
        { path: 'settings', component: UserSettings }
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

// redirects user to /admin if they try to access a route that should only be 
// accessible to a user who is not logged in.
// 
function requiredNotAuth(nextState, replace) {
  console.log('LOGGED IN, REDIRECTING...');
  if(auth.loggedIn()) {
    replace({ nextPathname: nextState.location.pathname }, '/admin')
  }
}