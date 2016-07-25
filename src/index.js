import React from 'react';
import ReactDOM from 'react-dom';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import { Router, browserHistory, RouterContext } from 'react-router'
import {routes} from './routes';
import injectTapEventPlugin from 'react-tap-event-plugin';

import './index.css';

injectTapEventPlugin();

if(process.env.NODE_ENV !== 'production') {
  React.Perf = require('react-addons-perf');
}

// Finally, we render a <Router> with some <Route>s.
// It does all the fancy routing stuff for us.
ReactDOM.render((
  <MuiThemeProvider>
    <Router history={browserHistory} routes={routes} render={(props) => <RouterContext {...props} />}/>
  </MuiThemeProvider>
), document.getElementById('root'));
