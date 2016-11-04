// Dev tools
import { createDevTools } from 'redux-devtools'
import LogMonitor from 'redux-devtools-log-monitor'
import SliderMonitor from 'redux-slider-monitor';
import DockMonitor from 'redux-devtools-dock-monitor'
import React from 'react'
import { createStore, combineReducers, applyMiddleware, compose } from 'redux'

const DevTools = createDevTools(
  <DockMonitor toggleVisibilityKey="ctrl-h" changePositionKey="ctrl-q" changeMonitorKey='ctrl-m' defaultPosition='bottom'>
    <LogMonitor theme="tomorrow" preserveScrollTop={true} />
    <SliderMonitor />
  </DockMonitor>
)

const StoreHelper = () => {

  let store =  null;

  const getStore = () => {
    return store;
  }
  /**
   * [description]
   * @param  {[type]} reducers   [description]
   * @param  {[type]} middleware [description]
   * @param  {Object} existingState [description]
   * @param  {[type]} callback   [description]
   * @return {[type]}            [description]
   */
  const setStore = (reducers, middleware, callback, existingState = {}) => {

    const reducer = combineReducers({
      ...reducers
    });

    const composeArgs = [applyMiddleware(...middleware)];

    if ((typeof window !== 'undefined') && window.devToolsExtension) {
      composeArgs.push(window.devToolsExtension());
    }

    store = createStore(
      reducer,
      existingState,
      compose(...composeArgs)
    );
    
    if(callback){
      callback();
    }

    return store;
  }
  return {
    setStore: setStore,
    getStore: getStore
  }
}


export default StoreHelper;