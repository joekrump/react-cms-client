// Root for client

import React from 'react'
import ReactDOM from 'react-dom'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
// eslint-disable-next-line
import { Router, browserHistory } from 'react-router'
import { syncHistoryWithStore } from 'react-router-redux'
import { Provider } from 'react-redux' // Add Provider for passing context of store.
import getRoutes from './routes'
import storeHelper from './redux/store/store'
import injectTapEventPlugin from 'react-tap-event-plugin'
import muiTheme from './muiTheme';
import StyleContextProvider from './components/StyleContextProvider'


import { routerReducer, routerMiddleware } from 'react-router-redux'
import * as reducers from './redux/reducers'
import createSagaMiddleware from 'redux-saga'
import rootSaga from './redux/sagas/root'

injectTapEventPlugin();

React.Perf = require('react-addons-perf');


const styleContext = {
  insertCss: styles => styles._insertCss(),
};

const reactRouterReduxMiddleware = routerMiddleware(browserHistory) 
const sagaMiddleware = createSagaMiddleware()

// Make the store with reducers and middleware specified. 
// 
const store = storeHelper().setStore({
  ...reducers,
  routing: routerReducer
},
[
  sagaMiddleware,
  reactRouterReduxMiddleware
], () => {
  // Run the saga
  sagaMiddleware.run(rootSaga)
});

const history = syncHistoryWithStore(browserHistory, store)

if(typeof document !== 'undefined'){
  ReactDOM.render((
    <Provider store={store}>
      <MuiThemeProvider muiTheme={muiTheme}>
        <StyleContextProvider context={styleContext}>
          <Router history={history} routes={getRoutes(store)} onUpdate={() => window.scrollTo(0, 0)} />
        </StyleContextProvider>
      </MuiThemeProvider>
    </Provider>
  ), document.getElementById('base'));
}
