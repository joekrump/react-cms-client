// Root for client

import React from 'react'
import ReactDOM from 'react-dom'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
// eslint-disable-next-line
import { Router, browserHistory } from 'react-router'
import { syncHistoryWithStore } from 'react-router-redux'
import { Provider } from 'react-redux' // Add Provider for passing context of store.
import routes from './routes'
import makeStore from './redux/store/store'
import injectTapEventPlugin from 'react-tap-event-plugin'
import muiTheme from './muiTheme';
import StyleContextProvider from './components/StyleContextProvider'

injectTapEventPlugin();

React.Perf = require('react-addons-perf');

const history = syncHistoryWithStore(browserHistory, store)
const styleContext = {
  insertCss: styles => styles._insertCss(),
};

const store = makeStore();

ReactDOM.render((
  <Provider store={store}>
    <MuiThemeProvider muiTheme={muiTheme}>
      <StyleContextProvider context={styleContext}>
        <Router history={history} routes={routes} onUpdate={() => window.scrollTo(0, 0)} />
      </StyleContextProvider>
    </MuiThemeProvider>
  </Provider>
), document.getElementById('root'));