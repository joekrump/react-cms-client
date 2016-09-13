// Dev tools
import { createDevTools } from 'redux-devtools'
import LogMonitor from 'redux-devtools-log-monitor'
import SliderMonitor from 'redux-slider-monitor';
import DockMonitor from 'redux-devtools-dock-monitor'

import React from 'react'
import { createStore, combineReducers, applyMiddleware, compose } from 'redux'
import { routerReducer, routerMiddleware } from 'react-router-redux'
import * as reducers from '../reducers'
import { browserHistory } from 'react-router'
import createSagaMiddleware from 'redux-saga'
import rootSaga from '../sagas'

const sagaMiddleware = createSagaMiddleware()

const DevTools = createDevTools(
  <DockMonitor toggleVisibilityKey="ctrl-h" changePositionKey="ctrl-q" changeMonitorKey='ctrl-m' defaultPosition='bottom'>
    <LogMonitor theme="tomorrow" preserveScrollTop={true} />
    <SliderMonitor />
  </DockMonitor>
)

const makeStore = (additionalReducers, additionalMiddleware) => {

  const reactRouterReduxMiddleware = routerMiddleware(browserHistory)

  const reducer = combineReducers({
    ...reducers,
    ...additionalReducers,
    routing: routerReducer
  })

  const store = createStore(
    reducer,
    compose(
      applyMiddleware(sagaMiddleware, reactRouterReduxMiddleware, ...additionalMiddleware),
      ((typeof window !== 'undefined') && window.devToolsExtension) ? window.devToolsExtension() : DevTools.instrument() 
    )
  );

  // Run the saga
  sagaMiddleware.run(rootSaga)

  return store;
}



export default makeStore;