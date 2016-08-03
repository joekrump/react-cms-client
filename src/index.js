import React from 'react'
import ReactDOM from 'react-dom'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
// eslint-disable-next-line
import { Router, browserHistory } from 'react-router'
import { syncHistoryWithStore } from 'react-router-redux'
import { Provider } from 'react-redux' // Add Provider for passing context of store.

import { routes } from './routes'
import { store, DevTools } from './store'

import injectTapEventPlugin from 'react-tap-event-plugin'

import muiTheme from './muiTheme';

// Top level styling
import './index.css'

injectTapEventPlugin();

React.Perf = require('react-addons-perf');

const history = syncHistoryWithStore(browserHistory, store)

// Finally, we render a <Router> with some <Route>s.
// It does all the fancy routing stuff for us.
ReactDOM.render((
   <Provider store={store}>
    <MuiThemeProvider muiTheme={muiTheme}>
      <div>
        <Router history={history} routes={routes} />
        <DevTools />
      </div>
    </MuiThemeProvider>
  </Provider>
), document.getElementById('root'));