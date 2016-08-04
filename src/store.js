// Dev tools
import { createDevTools } from 'redux-devtools'
import LogMonitor from 'redux-devtools-log-monitor'
import SliderMonitor from 'redux-slider-monitor';
import DockMonitor from 'redux-devtools-dock-monitor'

import React from 'react'
import { createStore, combineReducers, applyMiddleware, compose } from 'redux'
import { routerReducer, routerMiddleware } from 'react-router-redux'
import * as reducers from './reducers'
import { browserHistory } from 'react-router'

import thunk from 'redux-thunk';

const DevTools = createDevTools(
  <DockMonitor toggleVisibilityKey="ctrl-h" changePositionKey="ctrl-q" changeMonitorKey='ctrl-m' defaultPosition='bottom'>
    <LogMonitor theme="tomorrow" preserveScrollTop={true} />
    <SliderMonitor />
  </DockMonitor>
)

const reactRouterReduxMiddleware = routerMiddleware(browserHistory)

const reducer = combineReducers({
  ...reducers,
  routing: routerReducer
})

const store = createStore(
  reducer,
  compose(
    applyMiddleware(thunk, reactRouterReduxMiddleware),
    window.devToolsExtension ? window.devToolsExtension() : DevTools.instrument() 
  )
);

export {store, DevTools}