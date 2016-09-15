// app-server.js
import React from 'react'
import { createMemoryHistory, match, RouterContext } from 'react-router'
import ReactDOMServer from 'react-dom/server'
import express from 'express'
import hogan from 'hogan-express'
import NotFoundPage from './components/Pages/Errors/404/404.js';
import storeHelper from './redux/store/store'
import { Provider } from 'react-redux' // Add Provider for passing context of store.
// Routes
import getRoutes from './routes'

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
import muiTheme from './muiTheme';
import StyleContextProvider from './components/StyleContextProvider'
import { syncHistoryWithStore, routerReducer, routerMiddleware } from 'react-router-redux'
import createSagaMiddleware from 'redux-saga'
import rootSaga from './redux/sagas'
import reducers from './redux/reducers'

const styleContext = {
  insertCss: styles => styles._insertCss(),
};

var path = require('path');

// Configuring userAgent for Material-UI
// 
// global.navigator = global.navigator || {};
// global.navigator.userAgent = req.headers['user-agent'] || 'all';
global.navigator = { navigator: 'all' };
// Express
const app = express()
const basePath = path.dirname(app.get('views'));
app.engine('html', hogan)
app.set('views', path.join(basePath, 'build'));
// console.log(app.get('views'));
app.use('/', express.static('build'));
app.set('port', (process.env.PORT || 3001))

const sagaMiddleware = createSagaMiddleware()

app.get('*',(req, res) => {

  const memoryHistory = createMemoryHistory(req.path)
  const store = makeStore(sagaMiddleware, memoryHistory)
  // syncHistoryWithStore(memoryHistory, store)
  const routes        = getRoutes(store);

  match({routes, location: req.url }, (error, redirectLocation, renderProps) => {
        
    if (error) {
      res.status(500).send(error.message)
    } else if (redirectLocation) {
      res.redirect(302, redirectLocation.pathname + redirectLocation.search)
    } else if (renderProps) {
      res.locals.reactMarkup = renderPage(renderProps, store);
      // Success!
      res.status(200).render('index.html')
    
    } else {
      res.locals.reactMarkup = renderToString(<NotFoundPage />);
      res.status(404).render('index.html')
    }
  })
})

function makeStore(sagaMiddleware, memoryHistory) {
  return storeHelper().setStore({
    ...reducers,
    routing: routerReducer
  },
  [
    sagaMiddleware,
    routerMiddleware(memoryHistory)
  ], () => {
    // Run the saga
    sagaMiddleware.run(rootSaga)
  });
}

function renderPage(renderProps, store){
  return ReactDOMServer.renderToStaticMarkup(
    <Provider store={store}>
      <MuiThemeProvider muiTheme={muiTheme}>
        <StyleContextProvider context={styleContext}>
        <RouterContext {...renderProps}/>
        </StyleContextProvider>
      </MuiThemeProvider>
    </Provider>
  );
}

app.listen(app.get('port'))

console.info('==> Server is listening in ' + process.env.NODE_ENV + ' mode')
console.info('==> Go to http://localhost:%s', app.get('port'))